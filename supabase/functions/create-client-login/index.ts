import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const USERNAME_DOMAIN = "client.local";

function normalizeUsername(raw: string): string {
  return (raw || "").trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const callerId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", callerId);
    const roleNames = (roles || []).map((r) => r.role);
    if (!roleNames.includes("team") && !roleNames.includes("admin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { client_id, password } = body;
    // Accept either `username` (preferred) or legacy `email` field
    const rawUsername: string = body.username || body.email || "";
    if (!client_id || !rawUsername || !password) {
      return new Response(JSON.stringify({ error: "client_id, username, password required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const username = normalizeUsername(rawUsername.split("@")[0]);
    if (username.length < 3) {
      return new Response(JSON.stringify({ error: "Username must be at least 3 characters (letters, numbers, _ . -)" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (String(password).length < 8) {
      return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const syntheticEmail = `${username}@${USERNAME_DOMAIN}`;

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: syntheticEmail,
      password,
      email_confirm: true,
      user_metadata: { username, login_type: "client_username" },
    });
    if (createErr || !created.user) {
      const msg = createErr?.message || "Failed to create user";
      const friendly = /already.*registered|exists/i.test(msg) ? `Username "${username}" is already taken` : msg;
      return new Response(JSON.stringify({ error: friendly }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const newUserId = created.user.id;

    const { error: roleErr } = await admin.from("user_roles").insert({ user_id: newUserId, role: "client" });
    if (roleErr) {
      return new Response(JSON.stringify({ error: "User created but role failed: " + roleErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { error: linkErr } = await admin.from("clients").update({ auth_user_id: newUserId }).eq("id", client_id);
    if (linkErr) {
      return new Response(JSON.stringify({ error: "User created but linking failed: " + linkErr.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ success: true, user_id: newUserId, username }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
