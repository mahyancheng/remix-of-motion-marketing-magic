import { createClient } from '@supabase/supabase-js';

// External Supabase project for blog data
const EXTERNAL_SUPABASE_URL = 'https://cchxoycyanozttgqddxn.supabase.co';
// TODO: Replace with the actual JWT anon key (eyJ...) from the external project
const EXTERNAL_SUPABASE_ANON_KEY = import.meta.env.VITE_EXTERNAL_SUPABASE_ANON_KEY || '';

// Only create client if key is available; otherwise fall back to main client
export const externalSupabase = EXTERNAL_SUPABASE_ANON_KEY
  ? createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY)
  : null;