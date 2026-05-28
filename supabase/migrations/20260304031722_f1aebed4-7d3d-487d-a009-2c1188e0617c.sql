
-- Add POW (Proof of Work) column to work_order_tasks
ALTER TABLE public.work_order_tasks ADD COLUMN IF NOT EXISTS pow text;

-- Drop all existing restrictive RLS policies and replace with shared access for authenticated users

-- work_orders
DROP POLICY IF EXISTS "Users can CRUD own work orders" ON public.work_orders;
CREATE POLICY "Authenticated users can view all work orders" ON public.work_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert work orders" ON public.work_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update all work orders" ON public.work_orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete work orders" ON public.work_orders FOR DELETE TO authenticated USING (true);

-- work_order_tasks
DROP POLICY IF EXISTS "Users can CRUD own tasks" ON public.work_order_tasks;
CREATE POLICY "Authenticated users can view all tasks" ON public.work_order_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert tasks" ON public.work_order_tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update all tasks" ON public.work_order_tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete tasks" ON public.work_order_tasks FOR DELETE TO authenticated USING (true);

-- time_entries
DROP POLICY IF EXISTS "Users can CRUD own time entries" ON public.time_entries;
CREATE POLICY "Authenticated users can view all time entries" ON public.time_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert time entries" ON public.time_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update all time entries" ON public.time_entries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete time entries" ON public.time_entries FOR DELETE TO authenticated USING (true);

-- custody_events
DROP POLICY IF EXISTS "Users can CRUD own custody events" ON public.custody_events;
CREATE POLICY "Authenticated users can view all custody events" ON public.custody_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert custody events" ON public.custody_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update all custody events" ON public.custody_events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete custody events" ON public.custody_events FOR DELETE TO authenticated USING (true);

-- issues
DROP POLICY IF EXISTS "Users can CRUD own issues" ON public.issues;
CREATE POLICY "Authenticated users can view all issues" ON public.issues FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert issues" ON public.issues FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update all issues" ON public.issues FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete issues" ON public.issues FOR DELETE TO authenticated USING (true);

-- crm_contacts
DROP POLICY IF EXISTS "Users can CRUD own contacts" ON public.crm_contacts;
CREATE POLICY "Authenticated users can view all contacts" ON public.crm_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert contacts" ON public.crm_contacts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update all contacts" ON public.crm_contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete contacts" ON public.crm_contacts FOR DELETE TO authenticated USING (true);

-- crm_deals
DROP POLICY IF EXISTS "Users can CRUD own deals" ON public.crm_deals;
CREATE POLICY "Authenticated users can view all deals" ON public.crm_deals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert deals" ON public.crm_deals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update all deals" ON public.crm_deals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete deals" ON public.crm_deals FOR DELETE TO authenticated USING (true);

-- crm_activities
DROP POLICY IF EXISTS "Users can CRUD own activities" ON public.crm_activities;
CREATE POLICY "Authenticated users can view all activities" ON public.crm_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert activities" ON public.crm_activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update all activities" ON public.crm_activities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete activities" ON public.crm_activities FOR DELETE TO authenticated USING (true);
