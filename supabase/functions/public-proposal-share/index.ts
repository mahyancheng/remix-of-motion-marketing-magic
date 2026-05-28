import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const ALLOWED_MIME = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

function decodeBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function sha256Hex(text: string): Promise<string> {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function canonicalize(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(canonicalize).join(",") + "]";
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalize((obj as Record<string, unknown>)[k])).join(",") + "}";
}

function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim().slice(0, 64);
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || null;
}

async function getAuthUser(req: Request, admin: ReturnType<typeof createClient>) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error) return null;
  return data.user;
}

async function requireTeamOrAdmin(req: Request, admin: ReturnType<typeof createClient>) {
  const user = await getAuthUser(req, admin);
  if (!user) return { error: "unauthorized", status: 401 } as const;
  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
  const ok = roles?.some((r: { role: string }) => r.role === "team" || r.role === "admin");
  if (!ok) return { error: "forbidden", status: 403 } as const;
  return { user } as const;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "");

    // ── CREATE: issue quotation # + customer id + hash, store share ─────────
    if (action === "create") {
      const auth = await requireTeamOrAdmin(req, admin);
      if ("error" in auth) return json({ error: auth.error }, auth.status);

      const proposalData = body?.proposal_data;
      if (!proposalData || typeof proposalData !== "object") return json({ error: "Missing proposal_data" }, 400);
      const clientName = String(body?.client_name || "").trim().slice(0, 255) || null;
      const proposalId = body?.proposal_id || null;
      const overrideQuote = body?.quotation_number_override ? String(body.quotation_number_override).trim().slice(0, 64) : null;
      const overrideCustomer = body?.customer_id_override ? String(body.customer_id_override).trim().slice(0, 64) : null;

      const year = new Date().getFullYear();
      let quotationNumber = overrideQuote;
      if (!quotationNumber) {
        const { data: q, error: qe } = await admin.rpc("next_quotation_number", { _year: year });
        if (qe) return json({ error: qe.message }, 500);
        quotationNumber = q as string;
      }
      let customerId = overrideCustomer;
      if (!customerId) {
        // reuse if proposal already had one
        if (proposalId) {
          const { data: p } = await admin.from("proposals").select("customer_id").eq("id", proposalId).maybeSingle();
          if (p?.customer_id) customerId = p.customer_id;
        }
        if (!customerId) {
          const { data: c, error: ce } = await admin.rpc("next_customer_id");
          if (ce) return json({ error: ce.message }, 500);
          customerId = c as string;
        }
      }

      // Try to pre-link to an existing client by name (case-insensitive)
      let linkedClientId: string | null = body?.client_id || null;
      if (!linkedClientId && clientName) {
        const { data: existing } = await admin
          .from("clients").select("id").ilike("name", clientName).limit(1).maybeSingle();
        linkedClientId = existing?.id || null;
      }

      // Hash canonical proposal_data + numbers
      const docHash = await sha256Hex(canonicalize({ proposal_data: proposalData, quotation_number: quotationNumber, customer_id: customerId }));

      const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { error: insErr } = await admin.from("proposal_shares").insert({
        token,
        proposal_id: proposalId,
        proposal_data: proposalData,
        client_name: clientName,
        client_id: linkedClientId,
        expires_at: expiresAt,
        created_by: auth.user.id,
        quotation_number: quotationNumber,
        customer_id: customerId,
        doc_hash: docHash,
      });
      if (insErr) return json({ error: insErr.message }, 500);

      // Persist numbers on proposal too
      if (proposalId) {
        await admin.from("proposals").update({
          quotation_number: quotationNumber,
          customer_id: customerId,
        }).eq("id", proposalId);
      }

      return json({ success: true, token, quotation_number: quotationNumber, customer_id: customerId, doc_hash: docHash, expires_at: expiresAt });
    }

    // ── Below: GET / SIGN need a token ──────────────────────────────────────
    const token = String(body?.token || "");
    if (!token || token.length < 8 || token.length > 128) return json({ error: "Invalid token" }, 400);

    const { data: share, error: shareErr } = await admin
      .from("proposal_shares")
      .select("id, token, proposal_id, proposal_data, client_name, expires_at, is_signed, created_at, quotation_number, customer_id, doc_hash, signed_pdf_url")
      .eq("token", token)
      .maybeSingle();
    if (shareErr) return json({ error: shareErr.message }, 500);
    if (!share) return json({ error: "not_found" }, 404);

    if (action === "get") {
      let signature = null;
      if (share.is_signed) {
        const { data: sig } = await admin
          .from("proposal_signatures")
          .select("signer_name, signer_designation, signer_email, signature_data, stamp_url, signed_at")
          .eq("share_id", share.id)
          .maybeSingle();
        signature = sig || null;
      }
      return json({ share, signature });
    }

    if (action === "sign") {
      if (share.is_signed) return json({ error: "already_signed" }, 400);
      if (share.expires_at && new Date(share.expires_at).getTime() < Date.now()) return json({ error: "expired" }, 400);

      const signer_name = String(body?.signer_name || "").trim();
      const signer_designation = body?.signer_designation ? String(body.signer_designation).trim() : null;
      const signer_email = body?.signer_email ? String(body.signer_email).trim() : null;
      const signature_data = String(body?.signature_data || "");

      if (!signer_name || signer_name.length > 200) return json({ error: "Invalid signer_name" }, 400);
      if (signer_email && (signer_email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signer_email))) return json({ error: "Invalid email" }, 400);
      if (!signature_data.startsWith("data:image/") || signature_data.length > 2_500_000) return json({ error: "Invalid signature" }, 400);

      let stamp_url: string | null = null;
      const stamp = body?.stamp;
      if (stamp && stamp.base64 && stamp.mime) {
        if (!ALLOWED_MIME.includes(String(stamp.mime).toLowerCase())) return json({ error: "Invalid stamp type" }, 400);
        const bytes = decodeBase64(String(stamp.base64));
        if (bytes.length > MAX_BYTES) return json({ error: "Stamp too large" }, 400);
        const ext = (stamp.mime.split("/")[1] || "png").replace("jpeg", "jpg");
        const fileName = `${share.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await admin.storage.from("company-stamps").upload(fileName, bytes, { contentType: stamp.mime, upsert: false });
        if (upErr) return json({ error: "Upload failed: " + upErr.message }, 400);
        const { data: pub } = admin.storage.from("company-stamps").getPublicUrl(fileName);
        stamp_url = pub.publicUrl;
      }

      // Optional signed PDF snapshot (base64 PDF rendered client-side)
      let signed_pdf_path: string | null = null;
      let signed_pdf_url: string | null = null;
      const pdf = body?.signed_pdf;
      if (pdf && pdf.base64) {
        const bytes = decodeBase64(String(pdf.base64));
        if (bytes.length > 15 * 1024 * 1024) return json({ error: "PDF too large" }, 400);
        signed_pdf_path = `${share.id}/${Date.now()}.pdf`;
        const { error: pdfErr } = await admin.storage.from("signed-quotations").upload(signed_pdf_path, bytes, {
          contentType: "application/pdf",
          upsert: false,
        });
        if (pdfErr) return json({ error: "PDF upload failed: " + pdfErr.message }, 400);
        const { data: signed } = await admin.storage.from("signed-quotations").createSignedUrl(signed_pdf_path, 60 * 60 * 24 * 365 * 5);
        signed_pdf_url = signed?.signedUrl || null;
      }

      const userAgent = req.headers.get("user-agent")?.slice(0, 500) || null;
      const ip = getClientIp(req);

      const { error: sigErr } = await admin.from("proposal_signatures").insert({
        share_id: share.id,
        signature_data,
        stamp_url,
        signer_name,
        signer_designation,
        signer_email,
        user_agent: userAgent,
        ip_address: ip,
      });
      if (sigErr) return json({ error: sigErr.message }, 500);

      const { error: updErr } = await admin.from("proposal_shares").update({
        is_signed: true,
        signed_pdf_url,
        signed_pdf_path,
        signed_ip: ip,
      }).eq("id", share.id);
      if (updErr) return json({ error: updErr.message }, 500);

      // ── Auto-issue invoice ────────────────────────────────────────────────
      try {
        const data = (share.proposal_data || {}) as Record<string, any>;
        // Compute monthly fee from package selection (mirrors FormalQuotation logic)
        let subtotal = 0;
        if (data.selectedPackage === "custom" && Array.isArray(data.customLineItems)) {
          subtotal = data.customLineItems.reduce((s: number, i: any) => s + Number(i.monthlyAmount || 0), 0);
        } else {
          if (data.selectedPackage === "google-seo" || data.selectedPackage === "both") subtotal += 2400;
          if (data.selectedPackage === "social" || data.selectedPackage === "both") {
            subtotal += 2100 + Number(data.extraPlatforms || 0) * 300;
          }
        }
        const discountPct = Number(data.discountPercentage || 0);
        const netMonthly = Number((subtotal - subtotal * (discountPct / 100)).toFixed(2));
        const months = Number(data.contractMonths || (Array.isArray(data.paymentSchedule) ? data.paymentSchedule.length : 0) || 12);
        const monthlyInstallment = netMonthly > 0 ? netMonthly : null;
        const totalContractValue = Number(data.totalContractValue || 0) || Number((netMonthly * months).toFixed(2));

        const year = new Date().getFullYear();
        const { data: invNum } = await admin.rpc("next_invoice_number", { _year: year });

        // Resolve linked client: prefer share.client_id (pre-connected at issue time),
        // fall back to a name match, otherwise auto-create a new client record.
        const resolvedName: string =
          (data.companyName as string) ||
          (data.clientName as string) ||
          share.client_name ||
          "Unnamed Client";

        let matchedClientId: string | null = (share as { client_id?: string | null }).client_id || null;
        if (!matchedClientId && resolvedName) {
          const { data: cl } = await admin.from("clients").select("id").ilike("name", resolvedName).limit(1).maybeSingle();
          matchedClientId = cl?.id || null;
          console.log("[sign] name lookup", resolvedName, "→", matchedClientId);
        }
        if (!matchedClientId) {
          const { data: newClient, error: clientErr } = await admin.from("clients").insert({
            name: resolvedName,
            created_by: share.created_by,
            notes: `Auto-created from signed quotation ${share.quotation_number}`,
          }).select("id").single();
          if (clientErr) {
            console.error("[sign] auto-create client failed:", clientErr);
          }
          matchedClientId = newClient?.id || null;
          if (matchedClientId) {
            await admin.from("proposal_shares").update({ client_id: matchedClientId }).eq("id", share.id);
            console.log("[sign] created client", matchedClientId, resolvedName);
          }
        }

        await admin.from("invoices").insert({
          invoice_number: invNum,
          share_id: share.id,
          proposal_id: share.proposal_id,
          client_id: matchedClientId,
          client_name: share.client_name,
          customer_id: share.customer_id,
          quotation_number: share.quotation_number,
          total_amount: totalContractValue,
          currency: "MYR",
          monthly_installment: monthlyInstallment,
          installment_count: months,
          status: "issued",
          notes: `Full package: ${months} month(s) — auto-issued on signing of ${share.quotation_number}`,
        });

        // Create contract record (full-package already invoiced above)
        if (months > 0) {
          const start = new Date();
          await admin.from("contracts").insert({
            client_id: matchedClientId,
            client_name: share.client_name,
            customer_id: share.customer_id,
            proposal_id: share.proposal_id,
            share_id: share.id,
            quotation_number: share.quotation_number,
            currency: "MYR",
            total_amount: totalContractValue,
            monthly_installment: monthlyInstallment,
            installment_count: months,
            installments_issued: months,
            start_date: start.toISOString().slice(0, 10),
            next_invoice_date: start.toISOString().slice(0, 10),
            status: "completed",
            notes: `Auto-created from signed quotation ${share.quotation_number} — full package invoice issued`,
          });
        }
      } catch (e) {
        console.error("Invoice auto-issue failed:", e);
      }

      return json({ success: true, signed_at: new Date().toISOString(), stamp_url, signed_pdf_url });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
