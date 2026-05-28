import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

    const { user_id, new_password } = await req.json();
    if (!user_id) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Block destructive actions on team/admin accounts (safety)
    const { data: targetRoles } = await admin.from("user_roles").select("role").eq("user_id", user_id);
    const targetRoleNames = (targetRoles || []).map((r) => r.role);
    if (targetRoleNames.includes("admin") || targetRoleNames.includes("team")) {
      return new Response(JSON.stringify({ error: "Refusing to modify a team/admin account" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (new_password) {
      if (String(new_password).length < 8) return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { error: pwErr } = await admin.auth.admin.updateUserById(user_id, { password: new_password });
      if (pwErr) return new Response(JSON.stringify({ error: pwErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ success: true, action: "password_reset" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Delete: unlink any linked clients first, then drop role rows, then delete auth user.
    await admin.from("clients").update({ auth_user_id: null }).eq("auth_user_id", user_id);
    await admin.from("user_roles").delete().eq("user_id", user_id);
    const { error: delErr } = await admin.auth.admin.deleteUser(user_id);
    if (delErr) return new Response(JSON.stringify({ error: delErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ success: true, action: "deleted" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
