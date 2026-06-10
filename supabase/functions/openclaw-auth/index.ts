// Admin-only proxy between the browser and the OpenClaw login sidecar on your VPS.
// Keeps the sidecar URL + token server-side (Supabase secrets) and verifies the
// caller is an admin before allowing any login action.
//
// Required secrets (supabase secrets set ...):
//   OPENCLAW_SIDECAR_URL    e.g. http://YOUR_VPS:8790  (or a private/tailnet address)
//   OPENCLAW_SIDECAR_TOKEN  the sidecar's ADMIN_TOKEN
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const SIDECAR_URL = Deno.env.get("OPENCLAW_SIDECAR_URL");
    const SIDECAR_TOKEN = Deno.env.get("OPENCLAW_SIDECAR_TOKEN");
    if (!SIDECAR_URL || !SIDECAR_TOKEN) return json(500, { error: "OpenClaw sidecar not configured" });

    // Verify the caller is a signed-in admin.
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return json(401, { error: "Not authenticated" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    if (!(roles || []).some((r: { role: string }) => r.role === "admin")) return json(403, { error: "Admin only" });

    const { action, sessionId } = await req.json();
    const sidecar = (path: string, init?: RequestInit) =>
      fetch(`${SIDECAR_URL.replace(/\/+$/, "")}${path}`, {
        ...init,
        headers: { Authorization: `Bearer ${SIDECAR_TOKEN}`, "Content-Type": "application/json", ...(init?.headers || {}) },
      });

    let resp: Response;
    if (action === "status") resp = await sidecar("/status");
    else if (action === "start") resp = await sidecar("/login/start", { method: "POST" });
    else if (action === "poll") resp = await sidecar(`/login/status?sessionId=${encodeURIComponent(sessionId || "")}`);
    else if (action === "logout") resp = await sidecar("/logout", { method: "POST" });
    else if (action === "restart") resp = await sidecar("/restart", { method: "POST" });
    else return json(400, { error: "invalid action" });

    return json(resp.status, await resp.json());
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : "Unknown error" });
  }
});
