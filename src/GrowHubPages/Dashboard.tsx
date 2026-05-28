import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/GrowHubHooks/useAuth';
import { useWorkOrders } from '@/GrowHubHooks/useWorkOrders';
import { useCRM } from '@/GrowHubHooks/useCRM';
import { useWorkChat } from '@/GrowHubHooks/useWorkChat';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, LogOut, LayoutDashboard, Users, Briefcase, ClipboardList, AlertTriangle, Calendar, MessageSquare, PanelRightClose, PanelRightOpen, ListChecks, BarChart3, Settings as SettingsIcon, Compass } from 'lucide-react';
import OverviewPanel from '@/components/dashboard/OverviewPanel';
import { useUserRole } from '@/GrowHubHooks/useUserRole';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CRMPanel from '@/components/dashboard/CRMPanel';
import WorkOrdersPanel from '@/components/dashboard/WorkOrdersPanel';
import IssuesPanel from '@/components/dashboard/IssuesPanel';
import CalendarPanel from '@/components/dashboard/CalendarPanel';
import WorkChatPanel from '@/components/dashboard/WorkChatPanel';
import TasksPanel from '@/components/dashboard/TasksPanel';
import ClientsPanel from '@/components/dashboard/ClientsPanel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: isAuthLoading, signOut } = useAuth();
  const { isAdmin } = useUserRole(user?.id);
  const workOrdersHook = useWorkOrders();
  const crmHook = useCRM();
  const {
    messages, isLoading: isChatLoading, statusMessage,
    sendMessage, stopGeneration, clearChat,
    acceptProposal, rejectProposal, undoProposal,
  } = useWorkChat();
  const [showChat, setShowChat] = useState(false);

  const tabFromHash = location.hash.replace('#', '') || 'overview';

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/auth');
    }
  }, [user, isAuthLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admins');
  };

  const refreshAll = () => {
    workOrdersHook.fetchWorkOrders();
    workOrdersHook.fetchTasks();
    workOrdersHook.fetchTimeEntries();
    workOrdersHook.fetchCustodyEvents();
    workOrdersHook.fetchIssues();
    // Dispatch event so all panel hook instances also refresh
    window.dispatchEvent(new Event('work-data-refresh'));
  };

  const handleChatSend = (input: string, fileUrl?: string, fileName?: string) => {
    sendMessage(input, {
      workOrders: workOrdersHook.workOrders,
      tasks: workOrdersHook.tasks,
      issues: workOrdersHook.issues,
      custodyEvents: workOrdersHook.custodyEvents,
      contacts: crmHook.contacts,
      deals: crmHook.deals,
      activities: crmHook.activities,
    }, fileUrl, fileName);
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <><Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
      <div className="flex h-screen flex-col bg-background">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-accent" />
              Work Management
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showChat ? "accent" : "outline"}
              size="sm"
              onClick={() => setShowChat(!showChat)}
              className="gap-2"
            >
              {showChat ? <PanelRightClose className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
              AI Assistant
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/tool')}>
              Sales Tool
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/contracts')}>
              Contracts
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/invoices')}>
              Invoices
            </Button>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate('/settings')} className="gap-1">
                <SettingsIcon className="h-4 w-4" /> Settings
              </Button>
            )}
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

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs
              defaultValue={tabFromHash}
              onValueChange={(v) => navigate(`#${v}`, { replace: true })}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="border-b border-border bg-card/50 px-4">
                <TabsList className="h-11 bg-transparent gap-1">
                  <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-secondary">
                    <Compass className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="work-orders" className="gap-2 data-[state=active]:bg-secondary">
                    <ClipboardList className="h-4 w-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="all-tasks" className="gap-2 data-[state=active]:bg-secondary">
                    <ListChecks className="h-4 w-4" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="all-issues" className="gap-2 data-[state=active]:bg-secondary">
                    <AlertTriangle className="h-4 w-4" />
                    Issues
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-secondary">
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </TabsTrigger>
                  <TabsTrigger value="crm" className="gap-2 data-[state=active]:bg-secondary">
                    <Users className="h-4 w-4" />
                    CRM
                  </TabsTrigger>
                  <TabsTrigger value="project-monitoring" className="gap-2 data-[state=active]:bg-secondary">
                    <Briefcase className="h-4 w-4" />
                    Pipeline
                  </TabsTrigger>
                  <TabsTrigger value="client-insights" className="gap-2 data-[state=active]:bg-secondary">
                    <BarChart3 className="h-4 w-4" />
                    Client Insights
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="flex-1 m-0 overflow-auto data-[state=inactive]:hidden">
                <OverviewPanel />
              </TabsContent>
              <TabsContent value="work-orders" className="flex-1 m-0 overflow-auto data-[state=inactive]:hidden">
                <WorkOrdersPanel />
              </TabsContent>
              <TabsContent value="crm" className="flex-1 m-0 overflow-auto data-[state=inactive]:hidden">
                <CRMPanel tab="contacts" />
              </TabsContent>
              <TabsContent value="project-monitoring" className="flex-1 m-0 overflow-auto data-[state=inactive]:hidden">
                <CRMPanel tab="deals" />
              </TabsContent>
              <TabsContent value="all-issues" className="flex-1 m-0 overflow-auto data-[state=inactive]:hidden">
                <IssuesPanel />
              </TabsContent>
              <TabsContent value="all-tasks" className="flex-1 m-0 overflow-auto data-[state=inactive]:hidden">
                <TasksPanel />
              </TabsContent>
              <TabsContent value="calendar" className="flex-1 m-0 overflow-auto data-[state=inactive]:hidden">
                <CalendarPanel />
              </TabsContent>
              <TabsContent value="client-insights" className="flex-1 m-0 overflow-hidden data-[state=inactive]:hidden">
                <ClientsPanel />
              </TabsContent>
            </Tabs>
          </div>

          {showChat && (
            <div className="w-[400px] flex-shrink-0">
              <WorkChatPanel
                messages={messages}
                isLoading={isChatLoading}
                statusMessage={statusMessage}
                onSendMessage={handleChatSend}
                onStopGeneration={stopGeneration}
                onClearChat={clearChat}
                onAcceptProposal={(id) => acceptProposal(id, user.id, refreshAll)}
                onRejectProposal={rejectProposal}
                onUndoProposal={(id) => undoProposal(id, refreshAll)} />
            </div>
          )}
        </div>
      </div></>
  );
};

export default Dashboard;
