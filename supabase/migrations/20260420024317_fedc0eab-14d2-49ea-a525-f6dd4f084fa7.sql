
-- 1. Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'team', 'client');

-- 2. user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. has_role security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS for user_roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Backfill existing users as 'team' and first user as 'admin'
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'team'::public.app_role FROM auth.users
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT DO NOTHING;

-- 6. client_integrations
CREATE TABLE public.client_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'meta')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  account_id TEXT,
  account_name TEXT,
  scopes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

ALTER TABLE public.client_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own integrations or team/admin sees all"
  ON public.client_integrations FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'team')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users manage own integrations"
  ON public.client_integrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own integrations"
  ON public.client_integrations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users delete own integrations"
  ON public.client_integrations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER update_client_integrations_updated_at
  BEFORE UPDATE ON public.client_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. client_metrics_cache
CREATE TABLE public.client_metrics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  date_range TEXT NOT NULL,
  payload JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider, metric_type, date_range)
);

ALTER TABLE public.client_metrics_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own metrics or team/admin sees all"
  ON public.client_metrics_cache FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'team')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Service role and team can insert metrics"
  ON public.client_metrics_cache FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'team')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Service role and team can update metrics"
  ON public.client_metrics_cache FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.has_role(auth.uid(), 'team')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE INDEX idx_client_metrics_lookup
  ON public.client_metrics_cache (user_id, provider, metric_type, date_range);
