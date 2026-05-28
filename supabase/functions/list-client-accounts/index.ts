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
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id);
    const roleNames = (roles || []).map((r) => r.role);
    if (!roleNames.includes("admin")) return new Response(JSON.stringify({ error: "Admin only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Get all client-role users
    const { data: clientRoles } = await admin.from("user_roles").select("user_id").eq("role", "client");
    const clientUserIds = new Set((clientRoles || []).map((r) => r.user_id));

    // Get linked clients for context
    const { data: linkedClients } = await admin.from("clients").select("id, name, auth_user_id").not("auth_user_id", "is", null);
    const clientByUser = new Map<string, { id: string; name: string }>();
    (linkedClients || []).forEach((c) => { if (c.auth_user_id) clientByUser.set(c.auth_user_id, { id: c.id, name: c.name }); });

    // List all auth users (paginated). For typical use a single page is enough.
    const accounts: Array<{ user_id: string; email: string; username: string | null; created_at: string; last_sign_in_at: string | null; linked_client: { id: string; name: string } | null }> = [];
    let page = 1;
    const perPage = 200;
    while (true) {
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page, perPage });
      if (listErr) return new Response(JSON.stringify({ error: listErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const users = list?.users || [];
      for (const u of users) {
        if (!clientUserIds.has(u.id)) continue;
        accounts.push({
          user_id: u.id,
          email: u.email || "",
          username: (u.user_metadata as any)?.username || (u.email ? String(u.email).split("@")[0] : null),
          created_at: u.created_at,
          last_sign_in_at: (u as any).last_sign_in_at || null,
          linked_client: clientByUser.get(u.id) || null,
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
