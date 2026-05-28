import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Square, Trash2, Bot, User, Loader2, Paperclip, Check, X, Undo2, FileText, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ChatMessage, ChangeProposal } from '@/GrowHubHooks/useWorkChat';

interface WorkChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  statusMessage?: string;
  onSendMessage: (message: string, fileUrl?: string, fileName?: string) => void;
  onStopGeneration: () => void;
  onClearChat: () => void;
  onAcceptProposal: (proposalId: string) => void;
  onRejectProposal: (proposalId: string) => void;
  onUndoProposal: (proposalId: string) => void;
}

const TABLE_LABELS: Record<string, string> = {
  work_orders: 'Client Project',
  work_order_tasks: 'Task',
  issues: 'Issue',
  custody_events: 'Custody Event',
  crm_contacts: 'Contact',
  crm_deals: 'Project Monitor',
  crm_activities: 'Activity',
  time_entries: 'Time Entry',
};

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-500/20 text-green-400',
  update: 'bg-blue-500/20 text-blue-400',
  delete: 'bg-destructive/20 text-destructive',
};

const QUICK_PROMPTS = [
  { label: "📊 Progress Report", prompt: "Give me a full progress report of all current work orders with completion status, blockers, and recommendations." },
  { label: "⚠️ Overdue Items", prompt: "What tasks and work orders are overdue or blocked? List them with recommendations and propose status updates." },
  { label: "📋 Categorise & Organise", prompt: "Review all current tasks across all projects and propose better categories, priorities, and assignments. Link unlinked items to the right projects." },
  { label: "📝 Weekly Summary", prompt: "Generate a weekly summary report for the team meeting including progress, issues, and next steps." },
];

function ProposalCard({ proposal, onAccept, onReject, onUndo }: {
  proposal: ChangeProposal;
  onAccept: () => void;
  onReject: () => void;
  onUndo: () => void;
}) {
  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-accent">📋 Proposed Changes</span>
        <Badge variant="outline" className={`text-[10px] ${
          proposal.status === 'accepted' ? 'border-green-500 text-green-400' :
          proposal.status === 'rejected' ? 'border-destructive text-destructive' :
          proposal.status === 'undone' ? 'border-muted-foreground text-muted-foreground' :
          'border-accent text-accent'
        }`}>
          {proposal.status}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{proposal.summary}</p>
      <div className="space-y-1.5 max-h-48 overflow-auto">
        {proposal.changes.map((change, i) => (
          <div key={i} className="flex items-start gap-2 text-[11px] bg-background/50 rounded p-2">
            <Badge className={`${ACTION_COLORS[change.action]} text-[10px] flex-shrink-0`}>{change.action}</Badge>
            <div className="min-w-0">
              <span className="font-medium">{TABLE_LABELS[change.table] || change.table}</span>
              {change.data?.title && <span className="text-muted-foreground">: {change.data.title}</span>}
              <p className="text-muted-foreground/80 mt-0.5">{change.reason}</p>
            </div>
          </div>
        ))}
      </div>
      {proposal.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={onAccept}>
            <Check className="h-3 w-3 mr-1" /> Accept
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs text-destructive" onClick={onReject}>
            <X className="h-3 w-3 mr-1" /> Reject
          </Button>
        </div>
      )}
      {proposal.status === 'accepted' && (
        <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={onUndo}>
          <Undo2 className="h-3 w-3 mr-1" /> Undo Changes
        </Button>
      )}
    </div>
  );
}

export default function WorkChatPanel({
  messages, isLoading, statusMessage, onSendMessage, onStopGeneration, onClearChat,
  onAcceptProposal, onRejectProposal, onUndoProposal,
}: WorkChatPanelProps) {
  const [input, setInput] = useState('');
  const [pendingFile, setPendingFile] = useState<{ url: string; name: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, statusMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !pendingFile) || isLoading) return;
    const msg = input.trim() || (pendingFile ? `Analyse this file: ${pendingFile.name}` : '');
    onSendMessage(msg, pendingFile?.url, pendingFile?.name);
    setInput('');
    setPendingFile(null);
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ title: 'File too large', description: 'Max 10MB', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `chat-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('pow-attachments').upload(path, file);
      if (error) throw error;
      
      const { data: urlData } = supabase.storage.from('pow-attachments').getPublicUrl(path);
      setPendingFile({ url: urlData.publicUrl, name: file.name });
      toast({ title: 'File attached', description: `${file.name} ready to send` });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className="flex h-full flex-col bg-card border-l border-border">
      <div className="flex-shrink-0 flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg accent-gradient">
            <Bot className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-foreground text-sm">Work Assistant</h2>
            <p className="text-xs text-muted-foreground">AI • Reads & Writes</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClearChat} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
              <Bot className="h-7 w-7 text-accent" />
            </div>
            <h3 className="mb-2 font-display font-semibold text-foreground text-sm">Agentic Work AI</h3>
            <p className="mb-4 max-w-xs text-xs text-muted-foreground">
              I can read all your data, generate reports, categorise tasks, and propose changes you approve before they're applied.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
              {QUICK_PROMPTS.map((qp, idx) => (
                <Button key={idx} variant="outline" size="sm" onClick={() => onSendMessage(qp.prompt)} className="text-xs h-auto py-2 px-3 text-left">
                  {qp.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'accent-gradient text-accent-foreground'
                  }`}>
                    {message.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  </div>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 ${
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.fileUrl && (
                      <div className="mb-1.5">
                        {message.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img 
                            src={message.fileUrl} 
                            alt={message.fileName || 'Uploaded image'} 
                            className="rounded-lg max-w-full max-h-48 object-contain mb-1"
                          />
                        ) : (
                          <div className="flex items-center gap-1.5 text-[11px] opacity-80">
                            <FileText className="h-3 w-3" />
                            <span className="truncate">{message.fileName}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert text-xs">
                        <ReactMarkdown>{message.content || '...'}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-xs">{message.content}</p>
                    )}
                  </div>
                </div>
                {message.proposal && (
                  <div className="mt-2 ml-9">
                    <ProposalCard
                      proposal={message.proposal}
                      onAccept={() => onAcceptProposal(message.proposal!.id)}
                      onReject={() => onRejectProposal(message.proposal!.id)}
                      onUndo={() => onUndoProposal(message.proposal!.id)}
                    />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg accent-gradient text-accent-foreground">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-xl bg-secondary px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>{statusMessage || 'Thinking...'}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-shrink-0 border-t border-border p-3 bg-card space-y-2">
        {pendingFile && (
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-1.5">
            {pendingFile.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)
              ? <ImageIcon className="h-3.5 w-3.5 text-accent flex-shrink-0" />
              : <FileText className="h-3.5 w-3.5 text-accent flex-shrink-0" />
            }
            <span className="text-xs text-foreground truncate flex-1">{pendingFile.name}</span>
            <Button type="button" variant="ghost" size="icon" className="h-5 w-5 flex-shrink-0" onClick={() => setPendingFile(null)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.pptx,.txt" />
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" className="flex-shrink-0"
            onClick={() => fileInputRef.current?.click()} disabled={isLoading || isUploading}>
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          </Button>
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask, report, or propose changes..." disabled={isLoading} className="flex-1 text-sm" />
          {isLoading ? (
            <Button type="button" variant="destructive" size="icon" onClick={onStopGeneration}>
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" variant="accent" size="icon" disabled={!input.trim() && !pendingFile}>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
