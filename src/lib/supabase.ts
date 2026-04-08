import { createClient } from '@supabase/supabase-js';

// External Supabase project for blog data
const EXTERNAL_SUPABASE_URL = 'https://cchxoycyanozttgqddxn.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'sb_publishable_3XFI8HX3hofFyc0Rwa_Gxw_Y4cpx4Az';

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);