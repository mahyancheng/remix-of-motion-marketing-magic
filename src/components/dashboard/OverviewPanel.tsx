import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkOrders } from '@/GrowHubHooks/useWorkOrders';
import { useCRM } from '@/GrowHubHooks/useCRM';
import { Briefcase, AlertTriangle, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { KPICard } from './overview/KPICard';
import { NeedsAttentionList } from './overview/NeedsAttentionList';
import { UpcomingTimeline } from './overview/UpcomingTimeline';
import { ProjectHealthBoard } from './overview/ProjectHealthBoard';
import { getKPIs, getNeedsAttention, getUpcoming, getProjectHealth } from '@/GrowtLib/dashboardAggregates';
import type { AttentionItem } from '@/GrowtLib/dashboardAggregates';

export default function OverviewPanel() {
  const navigate = useNavigate();
  const { workOrders, tasks, issues, custodyEvents, upsertIssue, upsertTask } = useWorkOrders();
  const { contacts, deals, activities } = useCRM();

  const data = useMemo(
    () => ({ workOrders, tasks, issues, custodyEvents, contacts, deals, activities }),
    [workOrders, tasks, issues, custodyEvents, contacts, deals, activities]
  );

  const kpis = useMemo(() => getKPIs(data), [data]);
  const attention = useMemo(() => getNeedsAttention(data), [data]);
  const upcoming = useMemo(() => getUpcoming(data), [data]);
  const health = useMemo(() => getProjectHealth(data), [data]);

  const handleResolveIssue = (id: string) => {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;
    upsertIssue({ ...issue, status: 'resolved', resolved_at: new Date().toISOString() });
  };

  const handleCompleteTask = (id: string, workOrderId: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    upsertTask({ ...task, status: 'done', completed_at: new Date().toISOString() });
  };

  const goTo = (kind: AttentionItem['kind']) => {
    const map: Record<AttentionItem['kind'], string> = {
      issue: '#all-issues',
      task: '#all-tasks',
      workOrder: '#work-orders',
      custody: '#work-orders',
    };
    navigate(`/dashboard${map[kind]}`);
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Command Center</h2>
        <p className="text-sm text-muted-foreground">At-a-glance status across every project, issue and deadline.</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard
          label="Active Projects"
          value={kpis.activeProjects}
          icon={Briefcase}
          tone="progress"
          onClick={() => navigate('/dashboard#work-orders')}
        />
        <KPICard
          label="Open Issues"
          value={kpis.openIssues}
          icon={AlertTriangle}
          tone="blocked"
          highlight={kpis.highPriorityIssues}
          highlightLabel="high"
          onClick={() => navigate('/dashboard#all-issues')}
        />
        <KPICard
          label="Due This Week"
          value={kpis.dueThisWeek}
          icon={Clock}
          tone="waiting"
          onClick={() => navigate('/dashboard#all-tasks')}
        />
        <KPICard
          label="Awaiting Client"
          value={kpis.awaitingClient}
          icon={ArrowRight}
          tone="external"
          onClick={() => navigate('/dashboard#work-orders')}
        />
        <KPICard
          label="Resolved · 7d"
          value={kpis.resolvedThisWeek}
          icon={CheckCircle2}
          tone="done"
        />
      </div>

      {/* Two-column: Attention + Upcoming */}
      <div className="grid gap-3 lg:grid-cols-2">
        <NeedsAttentionList
          items={attention}
          onResolveIssue={handleResolveIssue}
          onCompleteTask={handleCompleteTask}
          onOpen={goTo}
        />
        <UpcomingTimeline items={upcoming} />
      </div>

      {/* Project Health */}
      <ProjectHealthBoard projects={health} onOpen={() => navigate('/dashboard#work-orders')} />
    </div>
  );
}
