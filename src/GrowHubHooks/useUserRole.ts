import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'team' | 'client';

export function useUserRole(userId: string | undefined) {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setRoles([]); setIsLoading(false); return; }
    let mounted = true;
    supabase.from('user_roles').select('role').eq('user_id', userId).then(({ data }) => {
      if (!mounted) return;
      setRoles((data || []).map((r) => r.role as AppRole));
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, [userId]);

  return {
    roles,
    isLoading,
    isAdmin: roles.includes('admin'),
    isTeam: roles.includes('team') || roles.includes('admin'),
    isClient: roles.includes('client'),
  };
}
