DELETE FROM public.contracts WHERE client_id = 'b262d3ec-36cb-4e69-a434-71b4fc91298c' OR client_name ILIKE '%lu ying%';
DELETE FROM public.invoices WHERE client_id = 'b262d3ec-36cb-4e69-a434-71b4fc91298c' OR client_name ILIKE '%lu ying%';
DELETE FROM public.proposal_signatures WHERE share_id IN (SELECT id FROM public.proposal_shares WHERE client_id = 'b262d3ec-36cb-4e69-a434-71b4fc91298c' OR client_name ILIKE '%lu ying%');
DELETE FROM public.proposal_shares WHERE client_id = 'b262d3ec-36cb-4e69-a434-71b4fc91298c' OR client_name ILIKE '%lu ying%';
DELETE FROM public.clients WHERE id = 'b262d3ec-36cb-4e69-a434-71b4fc91298c';