import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ProposedChange {
  action: 'create' | 'update' | 'delete';
  table: string;
  record_id?: string;
  data: Record<string, any>;
  reason: string;
}

export interface ChangeProposal {
  id: string;
  summary: string;
  changes: ProposedChange[];
  status: 'pending' | 'accepted' | 'rejected' | 'undone';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  proposal?: ChangeProposal;
  fileUrl?: string;
  fileName?: string;
}

export function useWorkChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [proposals, setProposals] = useState<ChangeProposal[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const workDataRef = useRef<any>(null);

  const VALID_COLUMNS: Record<string, string[]> = {
    work_orders: ['title', 'description', 'status', 'priority', 'assigned_to', 'due_date', 'contact_id', 'proposal_id', 'started_at', 'completed_at'],
    work_order_tasks: ['title', 'status', 'assigned_to', 'due_date', 'pow', 'work_order_id', 'sort_order', 'completed_at'],
    issues: ['title', 'description', 'status', 'priority', 'resolution', 'pow', 'work_order_id', 'contact_id', 'resolved_at'],
    custody_events: ['title', 'event_type', 'description', 'from_person', 'to_person', 'document_name', 'work_order_id', 'status'],
    crm_contacts: ['name', 'email', 'phone', 'company', 'position', 'type', 'notes', 'proposal_id'],
    crm_deals: ['title', 'stage', 'value', 'contact_id', 'expected_close_date', 'proposal_id', 'notes'],
    crm_activities: ['title', 'type', 'description', 'contact_id', 'deal_id', 'scheduled_at', 'completed_at'],
    time_entries: ['work_order_id', 'task_id', 'hours', 'description', 'date'],
  };

  const sanitizeData = (table: string, data: Record<string, any>) => {
    const valid = VALID_COLUMNS[table];
    if (!valid) return data;
    const cleaned: Record<string, any> = {};
    for (const [k, v] of Object.entries(data)) {
      if (valid.includes(k) && v !== undefined) cleaned[k] = v;
    }
    return cleaned;
  };

  // Look up a matching record from workData when _temp_ref_ can't be resolved
  const findRecordInWorkData = (field: string, tempVal: string, proposalChanges: ProposedChange[]): string | null => {
    const wd = workDataRef.current;
    if (!wd) return null;

    // Map field name to workData array
    const fieldToData: Record<string, { array: any[]; key: string }> = {
      work_order_id: { array: wd.workOrders || [], key: 'id' },
      contact_id: { array: wd.contacts || [], key: 'id' },
      deal_id: { array: wd.deals || [], key: 'id' },
      task_id: { array: wd.tasks || [], key: 'id' },
    };

    const lookup = fieldToData[field];
    if (!lookup || lookup.array.length === 0) return null;

    // Try to find the parent record that the AI intended
    // Check if any create in the proposal batch matches this temp ID as _temp_id
    // and was already created (in tempIdMap) — this is handled upstream
    // So here we try to match by looking at proposal context:
    // Find the parent create action that has this tempVal as _temp_id
    const parentCreate = proposalChanges.find(c =>
      c.data?._temp_id === tempVal && c.action === 'create'
    );

    if (parentCreate?.data?.title) {
      // Search workData for a record with matching title
      const match = lookup.array.find((r: any) =>
        r.title?.toLowerCase().trim() === parentCreate.data.title.toLowerCase().trim()
      );
      if (match) return match[lookup.key];
    }

    // If there's only one record in the relevant array, use it as fallback
    // (common when user is clearly working on a specific project)
    if (lookup.array.length === 1) return lookup.array[0][lookup.key];

    return null;
  };

  const applyChanges = useCallback(async (proposal: ChangeProposal, userId: string) => {
    const results: { success: boolean; error?: string }[] = [];
    // Map of _temp_id -> real UUID for dependency resolution
    const tempIdMap: Record<string, string> = {};

    // Sort by table dependency order, then by temp ref presence
    const TABLE_ORDER: Record<string, number> = {
      crm_contacts: 0, work_orders: 0, crm_deals: 1,
      work_order_tasks: 2, issues: 2, custody_events: 2,
      crm_activities: 2, time_entries: 3,
    };
    const sorted = [...proposal.changes].sort((a, b) => {
      const orderA = TABLE_ORDER[a.table] ?? 1;
      const orderB = TABLE_ORDER[b.table] ?? 1;
      if (orderA !== orderB) return orderA - orderB;
      // Within same level, creates before updates/deletes
      if (a.action === 'create' && b.action !== 'create') return -1;
      if (a.action !== 'create' && b.action === 'create') return 1;
      return 0;
    });
    
    for (const change of sorted) {
      try {
        // Extract _temp_id before sanitizing
        const tempId = change.data._temp_id;
        
        // Resolve _temp_ref_ fields to real UUIDs
        const resolvedData = { ...change.data };
        delete resolvedData._temp_id;
        let unresolvedRef = false;
        for (const [key, val] of Object.entries(resolvedData)) {
          if (key.startsWith('_temp_ref_') && typeof val === 'string') {
            const realField = key.replace('_temp_ref_', '');
            const realId = tempIdMap[val];
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (realId) {
              resolvedData[realField] = realId;
            } else if (uuidRegex.test(val)) {
              // Value is already a real UUID — use it directly
              resolvedData[realField] = val;
            } else {
              // Try to find matching record in workData by searching the target table
              const foundId = findRecordInWorkData(realField, val, sorted);
              if (foundId) {
                resolvedData[realField] = foundId;
              } else {
                // Last resort: skip this field but don't skip the record if field is nullable
                const nonNullableFields = ['work_order_id'];
                if (change.table === 'work_order_tasks' && realField === 'work_order_id') {
                  unresolvedRef = true;
                } else {
                  resolvedData[realField] = null;
                }
              }
            }
            delete resolvedData[key];
          }
        }
        if (unresolvedRef) {
          results.push({ success: false, error: `Skipped ${change.table}: parent record not yet created` });
          continue;
        }
        
        // Resolve foreign key fields via tempIdMap (handles temp IDs, remapped deleted records, and non-UUID strings)
        const fkFields = ['contact_id', 'work_order_id', 'task_id', 'deal_id', 'proposal_id'];
        for (const fk of fkFields) {
          if (resolvedData[fk] && typeof resolvedData[fk] === 'string') {
            // Always check tempIdMap first (handles remapped deleted→created records)
            const mappedId = tempIdMap[resolvedData[fk]];
            if (mappedId && mappedId !== resolvedData[fk]) {
              resolvedData[fk] = mappedId;
            } else {
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              if (!uuidRegex.test(resolvedData[fk])) {
                resolvedData[fk] = null;
              }
            }
          }
        }

        const cleanData = sanitizeData(change.table, resolvedData);
        if (change.action === 'create') {
          const payload = { ...cleanData, user_id: userId };
          const { data, error } = await supabase.from(change.table as any).insert(payload).select().single();
          results.push({ success: !error, error: error?.message });
          // Store real ID for temp references
          if (!error && data) {
            if (tempId) tempIdMap[tempId] = (data as any).id;
            // Also map the record_id if set (for children referencing this)
            if (change.record_id) tempIdMap[change.record_id] = (data as any).id;
          }
        } else if (change.action === 'update' && change.record_id) {
          const { data, error, count } = await supabase.from(change.table as any).update(cleanData).eq('id', change.record_id).select();
          if (!error && (!data || data.length === 0)) {
            // Record doesn't exist — fall back to create
            const payload = { ...cleanData, user_id: userId };
            const { data: created, error: createErr } = await supabase.from(change.table as any).insert(payload).select().single();
            results.push({ success: !createErr, error: createErr?.message });
            if (!createErr && created) {
              tempIdMap[change.record_id] = (created as any).id;
              if (tempId) tempIdMap[tempId] = (created as any).id;
            }
          } else {
            results.push({ success: !error, error: error?.message });
            // Store the existing record_id for children
            if (!error) tempIdMap[change.record_id] = change.record_id;
          }
        } else if (change.action === 'delete' && change.record_id) {
          const { error } = await supabase.from(change.table as any).delete().eq('id', change.record_id);
          results.push({ success: !error, error: error?.message });
        }
      } catch (e: any) {
        results.push({ success: false, error: e.message });
      }
    }

    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      toast({ title: 'Some changes failed', description: failed.map(f => f.error).join(', '), variant: 'destructive' });
    } else {
      toast({ title: 'Changes applied', description: proposal.summary });
    }
    return failed.length === 0;
  }, []);

  const undoChanges = useCallback(async (proposal: ChangeProposal) => {
    // For creates, delete them. For updates, we can't perfectly undo without snapshots.
    // For now, delete created records
    for (const change of proposal.changes) {
      if (change.action === 'create' && change.data?.id) {
        await supabase.from(change.table as any).delete().eq('id', change.data.id);
      }
    }
    toast({ title: 'Changes undone', description: proposal.summary });
  }, []);

  const acceptProposal = useCallback(async (proposalId: string, userId: string, onRefresh: () => void) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;
    
    const success = await applyChanges(proposal, userId);
    if (success) {
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'accepted' as const } : p));
      setMessages(prev => prev.map(m => m.proposal?.id === proposalId ? { ...m, proposal: { ...m.proposal!, status: 'accepted' as const } } : m));
      onRefresh();
    }
  }, [proposals, applyChanges]);

  const rejectProposal = useCallback((proposalId: string) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'rejected' as const } : p));
    setMessages(prev => prev.map(m => m.proposal?.id === proposalId ? { ...m, proposal: { ...m.proposal!, status: 'rejected' as const } } : m));
  }, []);

  const undoProposal = useCallback(async (proposalId: string, onRefresh: () => void) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;
    await undoChanges(proposal);
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'undone' as const } : p));
    setMessages(prev => prev.map(m => m.proposal?.id === proposalId ? { ...m, proposal: { ...m.proposal!, status: 'undone' as const } } : m));
    onRefresh();
  }, [proposals, undoChanges]);

  const sendMessage = useCallback(async (
    input: string,
    workData: {
      workOrders: any[];
      tasks: any[];
      issues: any[];
      custodyEvents: any[];
      contacts: any[];
      deals: any[];
      activities: any[];
    },
    fileUrl?: string,
    fileName?: string,
  ) => {
    const userMsg: ChatMessage = { role: 'user', content: input, fileUrl, fileName };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    // Store workData for use by applyChanges
    workDataRef.current = workData;
    const hasFile = !!fileUrl;
    setStatusMessage(hasFile ? 'Uploading file for processing...' : 'Reading your work data...');

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantSoFar = '';

    try {
      const apiMessages = updatedMessages.map(m => {
        let content = m.content;
        if (m.fileUrl) content += `\n\n[Attached file: ${m.fileName || 'document'}]\nFile URL: ${m.fileUrl}`;
        return { role: m.role, content };
      });

      setStatusMessage(hasFile ? 'Processing file contents...' : 'Connecting to AI...');
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/work-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ messages: apiMessages, workData }),
          signal: controller.signal,
        }
      );
      setStatusMessage('Thinking...');

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const event = JSON.parse(jsonStr);

            if (event.type === 'status') {
              setStatusMessage(event.message || 'Working...');
            } else if (event.type === 'text') {
              // Append text content from the AI
              assistantSoFar += event.content || '';
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && !last.proposal) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            } else if (event.type === 'proposal') {
              // AI proposed changes — show as a proposal card
              const proposal: ChangeProposal = {
                id: crypto.randomUUID(),
                summary: event.summary,
                changes: event.changes || [],
                status: 'pending',
              };
              setProposals(prev => [...prev, proposal]);
              // If there was text before this proposal, finalize that message
              if (assistantSoFar) {
                // Update the existing assistant message, then add proposal as new message
                setMessages(prev => {
                  const newMessages = [...prev];
                  // Make sure the last text message is finalized
                  return [...newMessages, {
                    role: 'assistant' as const,
                    content: `📋 **Proposed Changes:** ${event.summary}`,
                    proposal,
                  }];
                });
                assistantSoFar = ''; // Reset so next text creates a new message
              } else {
                setMessages(prev => [...prev, {
                  role: 'assistant' as const,
                  content: `📋 **Proposed Changes:** ${event.summary}`,
                  proposal,
                }]);
              }
            } else if (event.type === 'error') {
              setMessages(prev => [...prev, {
                role: 'assistant' as const,
                content: `⚠️ ${event.message}`,
              }]);
            } else if (event.type === 'done') {
              // Stream complete
            }
          } catch {
            // Partial JSON, put it back
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ Error: ${e.message}` }]);
      }
    } finally {
      setIsLoading(false);
      setStatusMessage('');
      abortRef.current = null;
    }
  }, [messages]);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setProposals([]);
  }, []);

  return {
    messages, isLoading, statusMessage, proposals,
    sendMessage, stopGeneration, clearChat,
    acceptProposal, rejectProposal, undoProposal,
  };
}
