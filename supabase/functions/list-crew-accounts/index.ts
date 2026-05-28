import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Missing auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: callerRoles } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id);
    if (!(callerRoles || []).some((r) => r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // All role rows for team/admin
    const { data: crewRoles } = await admin.from("user_roles").select("user_id, role").in("role", ["team", "admin"]);
    const rolesByUser = new Map<string, string[]>();
    (crewRoles || []).forEach((r) => {
      const arr = rolesByUser.get(r.user_id) || [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    });

    const accounts: Array<{ user_id: string; email: string; full_name: string | null; roles: string[]; created_at: string; last_sign_in_at: string | null }> = [];
    let page = 1;
    const perPage = 200;
    while (true) {
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page, perPage });
      if (listErr) return new Response(JSON.stringify({ error: listErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const users = list?.users || [];
      for (const u of users) {
        const r = rolesByUser.get(u.id);
        if (!r) continue;
        accounts.push({
          user_id: u.id,
          email: u.email || "",
          full_name: (u.user_metadata as any)?.full_name || null,
          roles: r,
          created_at: u.created_at,
          last_sign_in_at: (u as any).last_sign_in_at || null,
        });
      }
      if (users.length < perPage) break;
      page += 1;
      if (page > 20) break;
    }

    return new Response(JSON.stringify({ accounts }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
