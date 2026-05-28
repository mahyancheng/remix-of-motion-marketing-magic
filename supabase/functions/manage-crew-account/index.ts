import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Handles password reset, role change, and deletion for crew (team/admin) accounts.
// Body: { user_id, action: 'reset_password' | 'set_role' | 'delete', new_password?, role? }
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
    const callerId = userData.user.id;

    const { user_id, action, new_password, role } = await req.json();
    if (!user_id || !action) return new Response(JSON.stringify({ error: "user_id and action required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    if (user_id === callerId && (action === "delete" || (action === "set_role" && role !== "admin"))) {
      return new Response(JSON.stringify({ error: "You cannot remove your own admin access" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: targetRoles } = await admin.from("user_roles").select("role").eq("user_id", user_id);
    const targetRoleNames = (targetRoles || []).map((r) => r.role);
    if (targetRoleNames.includes("client")) {
      return new Response(JSON.stringify({ error: "This is a client account — manage in the client panel" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (targetRoleNames.length === 0) {
      return new Response(JSON.stringify({ error: "Account is not a crew member" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "reset_password") {
      if (!new_password || String(new_password).length < 8) return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { error: pwErr } = await admin.auth.admin.updateUserById(user_id, { password: new_password });
      if (pwErr) return new Response(JSON.stringify({ error: pwErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "set_role") {
      if (role !== "team" && role !== "admin") return new Response(JSON.stringify({ error: "role must be team or admin" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      await admin.from("user_roles").delete().eq("user_id", user_id).in("role", ["team", "admin"]);
      const { error: insErr } = await admin.from("user_roles").insert({ user_id, role });
      if (insErr) return new Response(JSON.stringify({ error: insErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete") {
      await admin.from("user_roles").delete().eq("user_id", user_id);
      const { error: delErr } = await admin.auth.admin.deleteUser(user_id);
      if (delErr) return new Response(JSON.stringify({ error: delErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
