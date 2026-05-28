import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface WorkOrder {
  id: string;
  contact_id: string | null;
  proposal_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  assigned_to: string | null;
  due_date: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderTask {
  id: string;
  work_order_id: string;
  title: string;
  status: string;
  assigned_to: string | null;
  due_date: string | null;
  completed_at: string | null;
  sort_order: number;
  pow: string | null;
  created_at: string;
}

export interface TimeEntry {
  id: string;
  work_order_id: string;
  task_id: string | null;
  description: string | null;
  hours: number;
  date: string;
  created_at: string;
}

export interface CustodyEvent {
  id: string;
  work_order_id: string | null;
  event_type: string;
  title: string;
  description: string | null;
  from_person: string | null;
  to_person: string | null;
  status: string | null;
  document_name: string | null;
  created_at: string;
}

export interface Issue {
  id: string;
  work_order_id: string | null;
  contact_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  resolution: string | null;
  resolved_at: string | null;
  pow: string | null;
  created_at: string;
  updated_at: string;
}

export function useWorkOrders() {
  const { user } = useAuth();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [tasks, setTasks] = useState<WorkOrderTask[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [custodyEvents, setCustodyEvents] = useState<CustodyEvent[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorkOrders = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase.from('work_orders').select('*').order('created_at', { ascending: false });
    if (!error) setWorkOrders(data || []);
    setIsLoading(false);
  }, [user]);

  const fetchTasks = useCallback(async (workOrderId?: string) => {
    if (!user) return;
    let q = supabase.from('work_order_tasks').select('*').order('sort_order');
    if (workOrderId) q = q.eq('work_order_id', workOrderId);
    const { data } = await q;
    setTasks(data || []);
  }, [user]);

  const fetchTimeEntries = useCallback(async (workOrderId?: string) => {
    if (!user) return;
    let q = supabase.from('time_entries').select('*').order('date', { ascending: false });
    if (workOrderId) q = q.eq('work_order_id', workOrderId);
    const { data } = await q;
    setTimeEntries(data || []);
  }, [user]);

  const fetchCustodyEvents = useCallback(async (workOrderId?: string) => {
    if (!user) return;
    let q = supabase.from('custody_events').select('*').order('created_at', { ascending: false });
    if (workOrderId) q = q.eq('work_order_id', workOrderId);
    const { data } = await q;
    setCustodyEvents(data || []);
  }, [user]);

  const fetchIssues = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('issues').select('*').order('created_at', { ascending: false });
    setIssues(data || []);
  }, [user]);

  // Work Order CRUD
  const upsertWorkOrder = useCallback(async (wo: Partial<WorkOrder> & { title: string }) => {
    if (!user) return null;
    const payload = { ...wo, user_id: user.id };
    if (wo.id) {
      const { data, error } = await supabase.from('work_orders').update(payload).eq('id', wo.id).select().single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return null; }
      fetchWorkOrders();
      return data;
    } else {
      const { data, error } = await supabase.from('work_orders').insert(payload).select().single();
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return null; }
      fetchWorkOrders();
      return data;
    }
  }, [user, fetchWorkOrders]);

  const deleteWorkOrder = useCallback(async (id: string) => {
    await supabase.from('work_orders').delete().eq('id', id);
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  // Task CRUD
  const upsertTask = useCallback(async (task: Partial<WorkOrderTask> & { title: string; work_order_id: string }) => {
    if (!user) return;
    const payload = { ...task, user_id: user.id };
    if (task.id) {
      await supabase.from('work_order_tasks').update(payload).eq('id', task.id);
    } else {
      await supabase.from('work_order_tasks').insert(payload);
    }
    fetchTasks(task.work_order_id);
  }, [user, fetchTasks]);

  const deleteTask = useCallback(async (id: string, workOrderId: string) => {
    await supabase.from('work_order_tasks').delete().eq('id', id);
    fetchTasks(workOrderId);
  }, [fetchTasks]);

  // Time Entry CRUD
  const addTimeEntry = useCallback(async (entry: Omit<TimeEntry, 'id' | 'created_at'>) => {
    if (!user) return;
    await supabase.from('time_entries').insert({ ...entry, user_id: user.id });
    fetchTimeEntries(entry.work_order_id);
  }, [user, fetchTimeEntries]);

  // Custody Events
  const addCustodyEvent = useCallback(async (event: Omit<CustodyEvent, 'id' | 'created_at'>) => {
    if (!user) return;
    await supabase.from('custody_events').insert({ ...event, user_id: user.id });
    fetchCustodyEvents(event.work_order_id || undefined);
  }, [user, fetchCustodyEvents]);

  // Issues
  const upsertIssue = useCallback(async (issue: Partial<Issue> & { title: string }) => {
    if (!user) return;
    const payload = { ...issue, user_id: user.id };
    if (issue.id) {
      await supabase.from('issues').update(payload).eq('id', issue.id);
    } else {
      await supabase.from('issues').insert(payload);
    }
    fetchIssues();
  }, [user, fetchIssues]);

  const deleteIssue = useCallback(async (id: string) => {
    await supabase.from('issues').delete().eq('id', id);
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    if (user) {
      fetchWorkOrders();
      fetchTasks();
      fetchTimeEntries();
      fetchCustodyEvents();
      fetchIssues();
    }
  }, [user, fetchWorkOrders, fetchTasks, fetchTimeEntries, fetchCustodyEvents, fetchIssues]);

  // Listen for AI-triggered refresh events
  useEffect(() => {
    const handler = () => {
      if (user) {
        fetchWorkOrders();
        fetchTasks();
        fetchTimeEntries();
        fetchCustodyEvents();
        fetchIssues();
      }
    };
    window.addEventListener('work-data-refresh', handler);
    return () => window.removeEventListener('work-data-refresh', handler);
  }, [user, fetchWorkOrders, fetchTasks, fetchTimeEntries, fetchCustodyEvents, fetchIssues]);

  return {
    workOrders, tasks, timeEntries, custodyEvents, issues, isLoading,
    fetchWorkOrders, fetchTasks, fetchTimeEntries, fetchCustodyEvents, fetchIssues,
    upsertWorkOrder, deleteWorkOrder,
    upsertTask, deleteTask,
    addTimeEntry, addCustodyEvent,
    upsertIssue, deleteIssue,
  };
}
