import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function nextInvoiceNumber(admin: ReturnType<typeof createClient>) {
  const year = new Date().getFullYear();
  const { data, error } = await admin.rpc("next_invoice_number", { _year: year });
  if (error) throw error;
  return data as string;
}

function addMonths(d: Date, n: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + n);
  return x;
}

async function generateInvoice(
  admin: ReturnType<typeof createClient>,
  contract: Record<string, any>,
  userId: string | null,
) {
  const invoiceNumber = await nextInvoiceNumber(admin);
  const issued = new Date();
  const due = new Date(issued);
  due.setDate(Math.min(28, issued.getDate() + 14));

  const months = Number(contract.installment_count || 0);
  const monthly = Number(contract.monthly_installment || 0);
  const remainingMonths = months - Number(contract.installments_issued || 0);
  const billedMonths = remainingMonths > 0 ? remainingMonths : months;
  // Full-package invoice: total = monthly × months
  const totalAmount = Number(contract.total_amount) || monthly * billedMonths;

  const { data: inv, error: invErr } = await admin.from("invoices").insert({
    invoice_number: invoiceNumber,
    proposal_id: contract.proposal_id,
    share_id: contract.share_id,
    quotation_number: contract.quotation_number,
    customer_id: contract.customer_id,
    client_name: contract.client_name,
    client_id: contract.client_id,
    total_amount: totalAmount,
    currency: contract.currency || "MYR",
    monthly_installment: monthly,
    installment_count: billedMonths,
    status: "issued",
    issued_at: issued.toISOString(),
    due_date: due.toISOString().slice(0, 10),
    notes: `Full package: ${billedMonths} month(s) × ${monthly} ${contract.currency || "MYR"}`,
    created_by: userId,
  }).select().single();
  if (invErr) throw invErr;

  // Mark contract fully invoiced (single full-package invoice covers remaining months)
  await admin.from("contracts").update({
    installments_issued: months,
    next_invoice_date: new Date().toISOString().slice(0, 10),
    status: "completed",
  }).eq("id", contract.id);

  return inv;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = body.action || url.searchParams.get("action") || "run-cron";
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Cron job trigger (no auth) — generates due invoices for all active contracts
    if (action === "run-cron") {
      const today = new Date().toISOString().slice(0, 10);
      const { data: due, error } = await admin
        .from("contracts")
        .select("*")
        .eq("status", "active")
        .lte("next_invoice_date", today);
      if (error) throw error;

      const created: string[] = [];
      for (const c of due || []) {
        if ((c.installments_issued || 0) >= (c.installment_count || 0)) {
          await admin.from("contracts").update({ status: "completed" }).eq("id", c.id);
          continue;
        }
        const inv = await generateInvoice(admin, c, null);
        created.push(inv.invoice_number);
      }
      return new Response(JSON.stringify({ ok: true, created }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Authenticated user actions
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userId);
    if (!(roles || []).some((r: any) => r.role === "team" || r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate-now") {
      const { contract_id } = body;
      if (!contract_id) throw new Error("contract_id required");
      const { data: c, error } = await admin.from("contracts").select("*").eq("id", contract_id).single();
      if (error) throw error;
      if ((c.installments_issued || 0) >= (c.installment_count || 0)) {
        return new Response(JSON.stringify({ error: "All installments already issued" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const inv = await generateInvoice(admin, c, userId);
      return new Response(JSON.stringify({ ok: true, invoice: inv }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("contracts-invoicing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
