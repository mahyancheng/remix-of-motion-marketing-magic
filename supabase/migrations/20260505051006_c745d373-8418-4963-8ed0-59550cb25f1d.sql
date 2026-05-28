DELETE FROM public.contracts WHERE client_name ILIKE '%lu ying%' OR client_name ILIKE '%luting%';
DELETE FROM public.invoices WHERE client_name ILIKE '%lu ying%' OR client_name ILIKE '%luting%';
DELETE FROM public.proposal_signatures WHERE share_id IN (SELECT id FROM public.proposal_shares WHERE client_name ILIKE '%lu ying%' OR client_name ILIKE '%luting%');
DELETE FROM public.proposal_shares WHERE client_name ILIKE '%lu ying%' OR client_name ILIKE '%luting%';
DELETE FROM public.clients WHERE name ILIKE '%lu ying%' OR name ILIKE '%luting%';