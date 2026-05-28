import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
 import { ArrowLeft, Save, FolderOpen, LogOut, Loader2, Check, Cloud, Trash2 } from 'lucide-react';
import ChatPanel from '@/components/sales-tool/ChatPanel';
import ProposalPreview from '@/components/sales-tool/ProposalPreview';
import { useSalesChat } from '@/GrowHubHooks/useSalesChat';
import { useAuth } from '@/GrowHubHooks/useAuth';
import { useProposals } from '@/GrowHubHooks/useProposals';
import { ProposalData, defaultProposalData } from '@/types/proposal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { SignedProposalsPanel } from '@/components/sales-tool/SignedProposalsPanel';
 import { FileCheck2, MessageSquare } from 'lucide-react';

const AUTOSAVE_DELAY = 2000; // 2 seconds debounce

const SalesTool = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isLoading: isAuthLoading, signOut } = useAuth();
  const { proposals, isLoading: isLoadingProposals, isSaving, fetchProposals, saveProposal, loadProposal, deleteProposal } = useProposals();
  
  const [proposalData, setProposalData] = useState<ProposalData>(defaultProposalData);
  const [currentProposalId, setCurrentProposalId] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  
  const updateProposalData = useCallback((updates: Partial<ProposalData>) => {
    setProposalData(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);
  
  const { 
    messages, 
    isLoading, 
    statusMessage,
    sendMessage, 
    stopGeneration, 
    clearChat,
    setMessages,
  } = useSalesChat(proposalData, updateProposalData);

  // Autosave function
  const performAutoSave = useCallback(async () => {
    if (!user || isInitialLoadRef.current) return;
    
    // Only autosave if there's meaningful data
    if (!proposalData.clientName && !proposalData.businessType && proposalData.targetRevenue === defaultProposalData.targetRevenue) {
      return;
    }
    
    setAutoSaveStatus('saving');
    try {
      const id = await saveProposal(proposalData, currentProposalId || undefined, messages);
      if (id && !currentProposalId) {
        setCurrentProposalId(id);
        setSearchParams({ id });
        fetchProposals();
      }
      setAutoSaveStatus('saved');
      setHasUnsavedChanges(false);
      // Reset to idle after 2 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Autosave failed:', error);
      setAutoSaveStatus('idle');
    }
  }, [user, proposalData, currentProposalId, messages, saveProposal, setSearchParams, fetchProposals]);

  // Debounced autosave effect
  useEffect(() => {
    if (!hasUnsavedChanges || isInitialLoadRef.current) return;
    
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      performAutoSave();
    }, AUTOSAVE_DELAY);
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [proposalData, hasUnsavedChanges, performAutoSave]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/auth');
    }
  }, [user, isAuthLoading, navigate]);

  // Fetch proposals on mount
  useEffect(() => {
    if (user) {
      fetchProposals();
    }
  }, [user, fetchProposals]);

  // Load proposal from URL param
  useEffect(() => {
    const proposalId = searchParams.get('id');
    if (proposalId && user) {
      isInitialLoadRef.current = true;
      loadProposal(proposalId).then((loaded) => {
        if (loaded) {
          setProposalData(loaded.proposalData);
          setCurrentProposalId(proposalId);
          // Restore chat messages
          if (loaded.chatMessages && loaded.chatMessages.length > 0) {
            setMessages(loaded.chatMessages);
          }
        }
        // Allow autosave after initial load
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 500);
      });
    } else {
      // No proposal to load, allow autosave
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 500);
    }
  }, [searchParams, user, loadProposal, setMessages]);

  // Parse AI responses for JSON data
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.content) {
      extractProposalData(lastMessage.content);
    }
  }, [messages]);

  const extractProposalData = (content: string) => {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        setProposalData(prev => ({
          ...prev,
          ...mapAIResponseToProposal(parsed),
        }));
      } catch (e) {
        console.log('Could not parse JSON from response');
      }
    }
    
    const extractors: Record<string, RegExp> = {
      clientName: /client(?:\s+name)?[:\s]+["']?([^"'\n,]+)/i,
      businessType: /business(?:\s+type)?[:\s]+["']?([^"'\n,]+)/i,
      targetRevenue: /target(?:\s+monthly)?\s+revenue[:\s]+(?:RM\s*)?(\d[\d,]*)/i,
      aov: /(?:average\s+order\s+value|aov)[:\s]+(?:RM\s*)?(\d[\d,]*)/i,
    };

    Object.entries(extractors).forEach(([key, regex]) => {
      const match = content.match(regex);
      if (match) {
        const value = match[1].trim().replace(/,/g, '');
        setProposalData(prev => ({
          ...prev,
          [key]: key === 'targetRevenue' || key === 'aov' ? parseInt(value) || prev[key as keyof ProposalData] : value,
        }));
      }
    });
  };

  const mapAIResponseToProposal = (data: Record<string, unknown>): Partial<ProposalData> => {
    return {
      clientName: (data.clientName || data.client_name || data.client) as string | undefined,
      businessType: (data.businessType || data.business_type || data.business) as string | undefined,
      productService: (data.productService || data.product_service || data.product || data.service) as string | undefined,
      icp: (data.icp || data.ideal_customer || data.idealCustomer) as string | undefined,
      targetLocation: (data.targetLocation || data.target_location || data.location) as string | undefined,
      aov: parseInt(String(data.aov || data.average_order_value || data.averageOrderValue)) || undefined,
      targetRevenue: parseInt(String(data.targetRevenue || data.target_revenue || data.revenue)) || undefined,
      primaryOffer: (data.primaryOffer || data.primary_offer || data.offer) as string | undefined,
      corePromise: (data.corePromise || data.core_promise || data.promise) as string | undefined,
      differentiators: Array.isArray(data.differentiators) ? data.differentiators : [],
      messageAngles: Array.isArray(data.messageAngles || data.message_angles) ? (data.messageAngles || data.message_angles) as string[] : [],
      positioningOneLiner: (data.positioningOneLiner || data.positioning_one_liner || data.positioning) as string | undefined,
      competitors: Array.isArray(data.competitors) ? data.competitors : [],
      kpiTarget: (data.kpiTarget || data.kpi_target || data.kpi) as string | undefined,
      painPoints: (data.painPoints || data.pain_points) as string | undefined,
      startDate: (data.startDate || data.start_date) as string | undefined,
    };
  };

  const handleClearChat = () => {
    clearChat();
    setProposalData(defaultProposalData);
    setCurrentProposalId(null);
    setSearchParams({});
    setHasUnsavedChanges(false);
    isInitialLoadRef.current = true;
    setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 500);
  };

  const handleSave = async () => {
    // Cancel any pending autosave
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    setAutoSaveStatus('saving');
    const id = await saveProposal(proposalData, currentProposalId || undefined, messages);
    if (id && !currentProposalId) {
      setCurrentProposalId(id);
      setSearchParams({ id });
    }
    fetchProposals();
    setAutoSaveStatus('saved');
    setHasUnsavedChanges(false);
    setTimeout(() => setAutoSaveStatus('idle'), 2000);
  };

  const handleLoadProposal = async (id: string) => {
    isInitialLoadRef.current = true;
    const loaded = await loadProposal(id);
    if (loaded) {
      setProposalData(loaded.proposalData);
      setCurrentProposalId(id);
      setSearchParams({ id });
      // Restore chat messages instead of clearing
      if (loaded.chatMessages && loaded.chatMessages.length > 0) {
        setMessages(loaded.chatMessages);
      } else {
        clearChat();
      }
      setHasUnsavedChanges(false);
    }
    setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 500);
  };

  const handleNewProposal = () => {
    isInitialLoadRef.current = true;
    setProposalData(defaultProposalData);
    setCurrentProposalId(null);
    setSearchParams({});
    clearChat();
    setHasUnsavedChanges(false);
    setAutoSaveStatus('idle');
    setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 500);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

   const handleDeleteProposal = async (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     if (!confirm('Are you sure you want to delete this proposal? This action cannot be undone.')) {
       return;
     }
     const success = await deleteProposal(id);
     if (success && currentProposalId === id) {
       handleNewProposal();
     }
   };
 
  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-display text-lg font-semibold text-foreground">
            Leadzap<span className="text-accent">.</span> Sales Tool
          </h1>
          {currentProposalId && (
            <span className="text-xs text-muted-foreground">
              (Editing: {proposalData.clientName || 'Untitled'})
            </span>
          )}
          {/* Autosave status indicator */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {autoSaveStatus === 'saving' && (
              <>
                <Cloud className="h-3.5 w-3.5 animate-pulse" />
                <span>Saving...</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                 <Check className="h-3.5 w-3.5 text-accent" />
                 <span className="text-accent">Saved</span>
              </>
            )}
            {autoSaveStatus === 'idle' && hasUnsavedChanges && (
              <>
                <Cloud className="h-3.5 w-3.5" />
                <span>Unsaved</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Manual save button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving || autoSaveStatus === 'saving'}
          >
            {isSaving || autoSaveStatus === 'saving' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {currentProposalId ? 'Save' : 'Save New'}
          </Button>

          {/* Load proposals dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderOpen className="mr-2 h-4 w-4" />
                Open
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem onClick={handleNewProposal}>
                <span className="font-medium text-accent">+ New Proposal</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isLoadingProposals ? (
                <DropdownMenuItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </DropdownMenuItem>
              ) : proposals.length === 0 ? (
                <DropdownMenuItem disabled>
                  No saved proposals
                </DropdownMenuItem>
              ) : (
                proposals.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => handleLoadProposal(p.id)}
                     className="flex items-center justify-between group"
                  >
                     <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium">{p.client_name || 'Untitled'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(p.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                     <button
                       onClick={(e) => handleDeleteProposal(e, p.id)}
                       className="ml-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive transition-opacity"
                     >
                       <Trash2 className="h-4 w-4" />
                     </button>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {user.email?.split('@')[0]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-muted-foreground text-xs">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Split view */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={30}>
          <Tabs defaultValue="chat" className="flex h-full flex-col">
            <div className="border-b border-border bg-card/50 px-2">
              <TabsList className="h-10 bg-transparent">
                <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-secondary">
                  <MessageSquare className="h-4 w-4" />
                  AI Chat
                </TabsTrigger>
                <TabsTrigger value="signed" className="gap-2 data-[state=active]:bg-secondary">
                  <FileCheck2 className="h-4 w-4" />
                  Signed Proposals
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="chat" className="flex-1 m-0 min-h-0 overflow-hidden data-[state=inactive]:hidden">
              <ChatPanel
                messages={messages}
                isLoading={isLoading}
                statusMessage={statusMessage}
                onSendMessage={sendMessage}
                onStopGeneration={stopGeneration}
                onClearChat={handleClearChat}
              />
            </TabsContent>
            <TabsContent value="signed" className="flex-1 m-0 overflow-hidden data-[state=inactive]:hidden">
              <SignedProposalsPanel />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          <ProposalPreview 
            data={proposalData} 
            onUpdateData={updateProposalData}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SalesTool;
