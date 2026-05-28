import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as XLSX from "https://esm.sh/xlsx@0.18.5";
import JSZip from "https://esm.sh/jszip@3.10.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Leadzap Work Management AI assistant. You are AGENTIC — you can read, analyse, AND propose changes to the work management system.

# YOUR CAPABILITIES
1. **Read & Analyse**: Access all work orders, tasks, issues, custody events, CRM contacts, deals, and calendar data
2. **Create & Edit**: Propose new tasks, update statuses, create issues, log custody events, update POW
3. **Categorise & Organise**: Auto-categorise tasks by type, priority; link items to correct client projects
4. **Report & Summarise**: Generate progress reports, identify blockers, summarise what's been done
5. **Plan & Schedule**: Help plan work distribution, estimate timelines, suggest assignments
6. **Document Analysis**: Analyse uploaded documents — spreadsheets (all sheets), PDFs, images, CSVs — and extract actionable work items, data tables, and insights

# IMPORTANT RULES
- When you want to CREATE or MODIFY data, you MUST use the available tools to propose changes
- Changes are NOT applied immediately — the user sees a preview and must click Accept
- Always link related items: tasks to work orders, issues to work orders & contacts, etc.
- When categorising, consider the client project context
- Be smart about inferring connections between items
- When file content is provided, analyse it thoroughly — go through every sheet, every table, every data point

# CRITICAL: CHECK EXISTING DATA BEFORE CREATING
Before proposing ANY new records, you MUST:
1. **Search workData thoroughly** — Check ALL existing work_orders, tasks, issues, contacts, and deals in the provided workData context.
2. **Match by title/name** — If a task, issue, work order, or contact with the same or very similar title/name ALREADY EXISTS, propose an UPDATE instead of a CREATE.
3. **Only create when truly new** — Only use action "create" if NO matching record exists in the current workData.
4. **Link to existing parents** — When the user mentions a project/client name, find the matching work_order or contact in workData and use its real UUID.
5. **Announce your findings** — Before proposing changes, briefly state what existing records you found and what you're adding vs updating.

Example thought process:
- User says "add Google Business Update task to SEO project"
- You check workData → find work_order "SEO & Google Ads" (ID: abc-123)
- You check existing tasks → no task named "Google Business Update" exists
- You propose: CREATE task with work_order_id: "abc-123" (real UUID)

Another example:
- User says "update Blog Update task to done"
- You check workData → find existing task "Blog Update" (ID: def-456)
- You propose: UPDATE task record_id: "def-456" with status: "done"

# AVAILABLE TOOLS
You have access to these tools:
1. **propose_changes** — Propose a batch of creates, updates, or deletes. Each change has: action (create/update/delete), table, record_id (for update/delete), data (field values), reason.
2. **generate_report** — Generate structured progress reports (daily/weekly/client/issues/full).

When using propose_changes:
- For CREATE: omit record_id, provide data with field values
- For UPDATE: provide record_id (real UUID of existing record), provide only the fields to change in data
- For DELETE: provide record_id (real UUID), data can be empty {}

# FILE ANALYSIS GUIDELINES — CRITICAL
- For spreadsheets: Analyse EVERY SINGLE ROW in EVERY sheet. Each row is a separate task or issue — create a work_order_task or issue for EACH ONE. Do NOT summarise or skip rows.
- Each sheet in a spreadsheet typically represents a different CLIENT or PROJECT. Create a separate work_order for each sheet/client ONLY if one doesn't already exist.
- If a row has a "Completed" column marked yes/done, set status to "done". Otherwise set to "todo" or "in_progress".
- If a row describes a problem, bug, or something that needs fixing, create it as an ISSUE linked to the relevant work order.
- For images: Describe what you see and extract any text/data visible
- For PDFs/documents: Extract all relevant information, tables, and action items
- Always relate file contents back to existing work orders, contacts, or projects when possible
- NEVER skip rows or combine multiple rows into one task. Each row = one task or issue.
- Before creating records from file data, CHECK if any of those items already exist in workData.

# VALID TABLE FIELDS (ONLY use these — do NOT invent fields)
- work_orders: title, description, status(pending/in_progress/review/done/cancelled), priority(low/medium/high/urgent), assigned_to, due_date, contact_id
- work_order_tasks: title, status(todo/in_progress/done), assigned_to, due_date, pow, work_order_id(REQUIRED)
- issues: title, description, status(open/in_progress/resolved/closed), priority(low/medium/high/critical), resolution, work_order_id, contact_id
- custody_events: title, event_type, description, from_person, to_person, document_name, work_order_id
- crm_contacts: name, email, phone, company, position, type(MUST be one of: lead/client/partner/vendor), notes
- crm_deals: title, stage, value, contact_id, expected_close_date, notes
- crm_activities: title, type, description, contact_id, deal_id, scheduled_at, completed_at
- time_entries: work_order_id, task_id, hours, description, date

# CRITICAL: FOREIGN KEY AND DEPENDENCY RULES
- All UUID foreign key fields (contact_id, work_order_id, task_id, deal_id) MUST be valid UUIDs or null.
- NEVER use placeholder strings like "temp_wo_123" or "Company Name Contact ID" — these will cause database errors.
- **EXISTING RECORDS**: When linking to a work_order, contact, or deal that ALREADY EXISTS in the provided workData, use the REAL UUID directly in the standard field name. For example: "work_order_id": "abc-123-real-uuid". Look up the ID from the workData context. NEVER use _temp_ref_ for existing records — that is ONLY for new records created in the same proposal.
- **NEW RECORDS**: Only use _temp_ref_ when referencing a NEW record being created IN THE SAME proposal batch:
  - Add a unique "_temp_id" field to EVERY NEW parent record you create. This is MANDATORY.
  - In child records, reference the NEW parent ONLY via "_temp_ref_<field>" (e.g. "_temp_ref_work_order_id": "wo1"). Do NOT also set "work_order_id".
  - The system resolves these: creates parents first, gets real UUIDs, substitutes into children.
- **MOST COMMON CASE**: The user asks you to add tasks/issues to an EXISTING work order. In this case, just use "work_order_id": "<real-uuid-from-workData>" directly. Do NOT use _temp_ref_.
- work_order_tasks REQUIRES work_order_id — it is NOT nullable. You MUST always link tasks to a work order.
- If you cannot find or create a parent, set the foreign key to null — NEVER use a made-up string. But work_order_id on tasks is NOT nullable.
- ORDER your changes: parent records (contacts, work_orders) FIRST, then children (tasks, issues, time_entries).

# EXAMPLE 1: Creating NEW work order + tasks (use _temp_ref_)
{"summary":"Create work order with tasks","changes":[{"action":"create","table":"work_orders","data":{"_temp_id":"wo1","title":"Project Alpha","status":"pending","priority":"medium"},"reason":"Parent work order"},{"action":"create","table":"work_order_tasks","data":{"_temp_ref_work_order_id":"wo1","title":"Task 1","status":"todo"},"reason":"Child task linked to wo1"}]}

# EXAMPLE 2: Adding tasks/issues to an EXISTING work order (use real UUID)
{"summary":"Add tasks to existing project","changes":[{"action":"create","table":"work_order_tasks","data":{"work_order_id":"real-uuid-from-workData","title":"New Task","status":"todo"},"reason":"Task for existing project"},{"action":"create","table":"issues","data":{"work_order_id":"real-uuid-from-workData","title":"Bug found","status":"open","priority":"high"},"reason":"Issue for existing project"}]}

# OUTPUT FORMAT
- Use markdown formatting
- Use ✅ for done, 🔄 for in progress, ⏳ for pending, ❌ for blocked, ⚠️ for issues
- Create structured tables for reports
- Keep responses focused and team-oriented`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "propose_changes",
      description: "Propose a batch of changes to the work management system. Each change creates, updates, or deletes a record. The user will see a preview and must accept before changes are applied.",
      parameters: {
        type: "object",
        properties: {
          summary: { type: "string", description: "Brief description of what these changes do" },
          changes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                action: { type: "string", enum: ["create", "update", "delete"], description: "Type of change" },
                table: { type: "string", enum: ["work_orders", "work_order_tasks", "issues", "custody_events", "crm_contacts", "crm_deals", "crm_activities", "time_entries"], description: "Which table to modify" },
                record_id: { type: "string", description: "ID of existing record (for update/delete). Leave empty for create." },
                data: {
                  type: "object",
                  description: "Field values. ONLY use valid fields listed in the system prompt for each table.",
                  additionalProperties: true,
                },
                reason: { type: "string", description: "Why this change is recommended" },
              },
              required: ["action", "table", "data", "reason"],
              additionalProperties: false,
            },
          },
        },
        required: ["summary", "changes"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "generate_report",
      description: "Generate a structured progress report for the team",
      parameters: {
        type: "object",
        properties: {
          reportType: { type: "string", enum: ["daily", "weekly", "client", "issues", "full"], description: "Type of report" },
          clientFilter: { type: "string", description: "Optional: filter by client/work order name" },
        },
        required: ["reportType"],
        additionalProperties: false,
      },
    },
  },
];

// ── File processing utilities ──

async function downloadFile(url: string): Promise<{ data: Uint8Array; contentType: string }> {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to download file: ${resp.status}`);
  const contentType = resp.headers.get("content-type") || "";
  const data = new Uint8Array(await resp.arrayBuffer());
  return { data, contentType };
}

function uint8ToBase64(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary);
}

function getFileExtension(fileName: string): string {
  return (fileName.split(".").pop() || "").toLowerCase();
}

function getMimeType(fileName: string): string {
  const ext = getFileExtension(fileName);
  const map: Record<string, string> = {
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    gif: "image/gif", webp: "image/webp", bmp: "image/bmp",
    tiff: "image/tiff", emf: "image/emf", wmf: "image/wmf",
  };
  return map[ext] || "image/png";
}

// Extract embedded images from ZIP-based formats (XLSX, DOCX, PPTX)
async function extractEmbeddedImages(data: Uint8Array, format: string): Promise<{ base64: string; mimeType: string; name: string }[]> {
  const images: { base64: string; mimeType: string; name: string }[] = [];
  try {
    const zip = await JSZip.loadAsync(data);
    
    // Different formats store media in different paths
    const mediaPaths: string[] = [];
    if (format === "xlsx") mediaPaths.push("xl/media/");
    else if (format === "docx") mediaPaths.push("word/media/");
    else if (format === "pptx") mediaPaths.push("ppt/media/");
    // Also check common paths
    mediaPaths.push("media/");

    const validExts = ["png", "jpg", "jpeg", "gif", "webp", "bmp"];
    let count = 0;
    const MAX_IMAGES = 10; // Limit to avoid huge payloads

    for (const [path, file] of Object.entries(zip.files)) {
      if (count >= MAX_IMAGES) break;
      if (file.dir) continue;
      
      const matchesPath = mediaPaths.some(mp => path.startsWith(mp));
      if (!matchesPath) continue;

      const ext = getFileExtension(path);
      if (!validExts.includes(ext)) continue;

      const imgData = await file.async("uint8array");
      // Skip tiny images (likely icons/bullets, < 2KB)
      if (imgData.length < 2048) continue;
      
      images.push({
        base64: uint8ToBase64(imgData),
        mimeType: getMimeType(path),
        name: path.split("/").pop() || `image_${count}`,
      });
      count++;
    }
  } catch (e) {
    console.error("Image extraction error:", e);
  }
  return images;
}

// Extract text from DOCX XML
async function extractDocxText(data: Uint8Array): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(data);
    const docXml = await zip.file("word/document.xml")?.async("string");
    if (!docXml) return "";
    
    // Extract text between <w:t> tags
    const textParts: string[] = [];
    const paragraphs = docXml.split(/<\/w:p>/);
    for (const para of paragraphs) {
      const texts: string[] = [];
      const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let match;
      while ((match = regex.exec(para)) !== null) {
        texts.push(match[1]);
      }
      if (texts.length > 0) textParts.push(texts.join(""));
    }
    return textParts.join("\n");
  } catch (e) {
    console.error("DOCX parse error:", e);
    return "";
  }
}

// Extract text from PPTX XML
async function extractPptxText(data: Uint8Array): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(data);
    const slides: string[] = [];
    
    // Find all slide files
    const slideFiles = Object.keys(zip.files)
      .filter(f => f.match(/^ppt\/slides\/slide\d+\.xml$/))
      .sort();

    for (const slidePath of slideFiles) {
      const slideXml = await zip.file(slidePath)?.async("string");
      if (!slideXml) continue;
      
      const slideNum = slidePath.match(/slide(\d+)/)?.[1] || "?";
      const texts: string[] = [];
      const regex = /<a:t>([^<]*)<\/a:t>/g;
      let match;
      while ((match = regex.exec(slideXml)) !== null) {
        if (match[1].trim()) texts.push(match[1]);
      }
      if (texts.length > 0) {
        slides.push(`**Slide ${slideNum}:**\n${texts.join("\n")}`);
      }
    }
    return slides.join("\n\n");
  } catch (e) {
    console.error("PPTX parse error:", e);
    return "";
  }
}

function parseSpreadsheet(data: Uint8Array, fileName: string): string {
  try {
    const workbook = XLSX.read(data, { type: "array" });
    const sheetNames = workbook.SheetNames;
    let result = `📊 **Spreadsheet: ${fileName}** — ${sheetNames.length} sheet(s)\n\n`;

    for (const sheetName of sheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as any[][];
      result += `### Sheet: "${sheetName}"\n`;
      if (jsonData.length === 0) { result += `_(Empty sheet)_\n\n`; continue; }

      const maxRows = Math.min(jsonData.length, 200);
      const maxCols = Math.max(...jsonData.slice(0, maxRows).map(r => r.length));
      if (maxCols === 0) { result += `_(Empty sheet)_\n\n`; continue; }

      const headers = jsonData[0].map((h: any) => String(h || "").trim() || "—");
      result += `| ${headers.join(" | ")} |\n`;
      result += `| ${headers.map(() => "---").join(" | ")} |\n`;

      for (let r = 1; r < maxRows; r++) {
        const row = jsonData[r];
        const cells = [];
        for (let c = 0; c < headers.length; c++) {
          cells.push(String(row[c] ?? "").trim());
        }
        if (cells.every(c => !c)) continue;
        result += `| ${cells.join(" | ")} |\n`;
      }
      if (jsonData.length > 200) result += `\n_(Showing first 200 of ${jsonData.length} rows)_\n`;
      result += `\n`;
    }
    return result;
  } catch (e) {
    console.error("Spreadsheet parse error:", e);
    return `⚠️ Could not parse spreadsheet "${fileName}": ${e instanceof Error ? e.message : "Unknown error"}`;
  }
}

function parseCSV(data: Uint8Array, fileName: string): string {
  try {
    const text = new TextDecoder().decode(data);
    const lines = text.split("\n").filter(l => l.trim());
    let result = `📊 **CSV: ${fileName}** — ${lines.length} rows\n\n`;
    if (lines.length === 0) return result + "_(Empty file)_\n";

    const maxRows = Math.min(lines.length, 200);
    const parseRow = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuote = false;
      for (const ch of line) {
        if (ch === '"') { inQuote = !inQuote; continue; }
        if (ch === "," && !inQuote) { result.push(current.trim()); current = ""; continue; }
        current += ch;
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseRow(lines[0]);
    result += `| ${headers.join(" | ")} |\n`;
    result += `| ${headers.map(() => "---").join(" | ")} |\n`;
    for (let i = 1; i < maxRows; i++) {
      const cells = parseRow(lines[i]);
      result += `| ${cells.join(" | ")} |\n`;
    }
    if (lines.length > 200) result += `\n_(Showing first 200 of ${lines.length} rows)_\n`;
    return result;
  } catch (e) {
    return `⚠️ Could not parse CSV "${fileName}": ${e instanceof Error ? e.message : "Unknown error"}`;
  }
}

// Main file processor — returns text + optional embedded images
async function processFile(fileUrl: string, fileName: string): Promise<{
  textContent?: string;
  imageContent?: { base64: string; mimeType: string };
  embeddedImages?: { base64: string; mimeType: string; name: string }[];
}> {
  const ext = getFileExtension(fileName);
  const { data, contentType } = await downloadFile(fileUrl);

  // Spreadsheets — extract data + embedded images
  if (["xlsx", "xls", "xlsm", "xlsb", "ods", "numbers"].includes(ext)) {
    const textContent = parseSpreadsheet(data, fileName);
    const embeddedImages = await extractEmbeddedImages(data, "xlsx");
    if (embeddedImages.length > 0) {
      return { textContent: textContent + `\n\n📷 _Found ${embeddedImages.length} embedded image(s) — analysing them below._`, embeddedImages };
    }
    return { textContent };
  }

  // CSV
  if (ext === "csv") {
    return { textContent: parseCSV(data, fileName) };
  }

  // Standalone images
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff"].includes(ext)) {
    const mimeType = contentType.startsWith("image/") ? contentType : `image/${ext === "jpg" ? "jpeg" : ext}`;
    return { imageContent: { base64: uint8ToBase64(data), mimeType } };
  }

  // DOCX — proper XML text extraction + embedded images
  if (ext === "docx") {
    const extractedText = await extractDocxText(data);
    const embeddedImages = await extractEmbeddedImages(data, "docx");
    const textContent = extractedText
      ? `📄 **Document: ${fileName}**\n\n${extractedText.slice(0, 15000)}${extractedText.length > 15000 ? "\n\n_(Truncated — showing first 15,000 chars)_" : ""}`
      : `📄 **Document: ${fileName}** — Could not extract text content.`;
    if (embeddedImages.length > 0) {
      return { textContent: textContent + `\n\n📷 _Found ${embeddedImages.length} embedded image(s) — analysing them below._`, embeddedImages };
    }
    return { textContent };
  }

  // PPTX — proper XML text extraction + embedded images
  if (ext === "pptx") {
    const extractedText = await extractPptxText(data);
    const embeddedImages = await extractEmbeddedImages(data, "pptx");
    const textContent = extractedText
      ? `📊 **Presentation: ${fileName}**\n\n${extractedText.slice(0, 15000)}${extractedText.length > 15000 ? "\n\n_(Truncated)_" : ""}`
      : `📊 **Presentation: ${fileName}** — Could not extract text content.`;
    if (embeddedImages.length > 0) {
      return { textContent: textContent + `\n\n📷 _Found ${embeddedImages.length} embedded image(s) — analysing them below._`, embeddedImages };
    }
    return { textContent };
  }

  // PDF — text extraction (basic)
  if (ext === "pdf") {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(data);
    const readable = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{3,}/g, "\n").trim();
    const preview = readable.slice(0, 10000);
    return { textContent: `📄 **PDF: ${fileName}**\n\n${preview}\n\n_(Extracted text — some formatting may be lost)_` };
  }

  // Text-based files
  if (["txt", "md", "json", "xml", "html", "log", "yaml", "yml", "toml", "ini", "cfg"].includes(ext)) {
    const text = new TextDecoder().decode(data);
    const preview = text.slice(0, 10000);
    return { textContent: `📄 **${fileName}**\n\n\`\`\`\n${preview}\n\`\`\`\n${text.length > 10000 ? `\n_(Showing first 10,000 of ${text.length} characters)_` : ""}` };
  }

  // Legacy DOC/PPT — basic extraction
  if (["doc", "ppt"].includes(ext)) {
    const text = new TextDecoder("utf-8", { fatal: false }).decode(data);
    const readable = text.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{3,}/g, "\n").trim();
    const preview = readable.slice(0, 10000);
    return { textContent: `📄 **${ext.toUpperCase()}: ${fileName}**\n\n${preview}\n\n_(Extracted text — formatting may be lost)_` };
  }

  return { textContent: `📎 **${fileName}** — File type "${ext}" uploaded. Unable to extract content directly.` };
}

// ── Build messages with file content ──

async function buildMessagesWithFiles(messages: any[]): Promise<any[]> {
  const processed: any[] = [];

  for (const msg of messages) {
    const fileMatch = msg.content?.match(/\[Attached file: (.+?)\]\nFile URL: (.+?)$/s);
    
    if (fileMatch && msg.role === "user") {
      const fileName = fileMatch[1];
      const fileUrl = fileMatch[2].trim();
      const userText = msg.content.replace(/\n\n\[Attached file: .+?\]\nFile URL: .+?$/s, "").trim();

      try {
        const result = await processFile(fileUrl, fileName);

        if (result.imageContent && !result.textContent) {
          // Standalone image — multimodal message
          const parts: any[] = [];
          if (userText) parts.push({ type: "text", text: userText });
          parts.push({
            type: "image_url",
            image_url: { url: `data:${result.imageContent.mimeType};base64,${result.imageContent.base64}` },
          });
          processed.push({ role: "user", content: parts });
        } else if (result.textContent) {
          // Document with text — build multimodal message if embedded images exist
          const textPart = userText
            ? `${userText}\n\n---\n\n**Extracted File Content:**\n\n${result.textContent}`
            : `Please analyse this file:\n\n${result.textContent}`;

          if (result.embeddedImages && result.embeddedImages.length > 0) {
            // Multimodal: text + embedded images
            const parts: any[] = [{ type: "text", text: textPart }];
            for (const img of result.embeddedImages) {
              parts.push({
                type: "image_url",
                image_url: { url: `data:${img.mimeType};base64,${img.base64}` },
              });
            }
            processed.push({ role: "user", content: parts });
          } else {
            processed.push({ role: "user", content: textPart });
          }
        } else {
          processed.push(msg);
        }
      } catch (e) {
        console.error("File processing error:", e);
        const errorNote = `${msg.content}\n\n⚠️ _Could not process file "${fileName}": ${e instanceof Error ? e.message : "Unknown error"}_`;
        processed.push({ role: msg.role, content: errorNote });
      }
    } else {
      processed.push(msg);
    }
  }

  return processed;
}

// ── Build context from work data ──

function buildWorkDataContext(workData: any): string {
  if (!workData) return "";
  const { workOrders, tasks, issues, custodyEvents, contacts, deals, activities } = workData;
  let contextStr = `\n\n# CURRENT WORK DATA\n`;

  if (workOrders?.length) {
    contextStr += `\n## Work Orders / Client Projects (${workOrders.length})\n`;
    workOrders.forEach((wo: any) => {
      const woTasks = tasks?.filter((t: any) => t.work_order_id === wo.id) || [];
      const done = woTasks.filter((t: any) => t.status === "done").length;
      const contact = contacts?.find((c: any) => c.id === wo.contact_id);
      const woIssues = issues?.filter((i: any) => i.work_order_id === wo.id) || [];
      contextStr += `- **${wo.title}** (ID: ${wo.id}) [${wo.status}] Priority: ${wo.priority} | Assigned: ${wo.assigned_to || "Unassigned"} | Client: ${contact?.name || "N/A"} (contact_id: ${wo.contact_id || "none"}) | Tasks: ${done}/${woTasks.length} done | Issues: ${woIssues.length} | Due: ${wo.due_date || "No date"}\n`;
      woTasks.forEach((t: any) => {
        contextStr += `  - Task (ID: ${t.id}): "${t.title}" [${t.status}] Assigned: ${t.assigned_to || "-"} Due: ${t.due_date || "-"} POW: ${t.pow || "Not recorded"}\n`;
      });
    });
  }

  if (contacts?.length) {
    contextStr += `\n## CRM Contacts (${contacts.length})\n`;
    contacts.forEach((c: any) => {
      contextStr += `- **${c.name}** (ID: ${c.id}) [${c.type}] Company: ${c.company || "-"} Email: ${c.email || "-"}\n`;
    });
  }

  if (deals?.length) {
    contextStr += `\n## Project Monitoring / Deals (${deals.length})\n`;
    deals.forEach((d: any) => {
      const contact = contacts?.find((c: any) => c.id === d.contact_id);
      contextStr += `- **${d.title}** (ID: ${d.id}) [${d.stage}] Value: RM${d.value || 0} | Client: ${contact?.name || "-"} | Close: ${d.expected_close_date || "-"}\n`;
    });
  }

  if (issues?.length) {
    contextStr += `\n## Issues (${issues.length})\n`;
    issues.forEach((i: any) => {
      const wo = workOrders?.find((w: any) => w.id === i.work_order_id);
      contextStr += `- **${i.title}** (ID: ${i.id}) [${i.status}] Priority: ${i.priority} | Project: ${wo?.title || "N/A"} | Resolution: ${i.resolution || "Pending"}\n`;
    });
  }

  if (custodyEvents?.length) {
    contextStr += `\n## Recent Custody Events (${custodyEvents.length})\n`;
    custodyEvents.slice(0, 15).forEach((e: any) => {
      contextStr += `- ${e.event_type}: "${e.title}" (ID: ${e.id}) ${e.from_person ? `From: ${e.from_person}` : ""} ${e.to_person ? `To: ${e.to_person}` : ""} | WO: ${e.work_order_id || "none"}\n`;
    });
  }

  if (activities?.length) {
    contextStr += `\n## CRM Activities (${activities.length})\n`;
    activities.slice(0, 10).forEach((a: any) => {
      contextStr += `- ${a.type}: "${a.title}" Scheduled: ${a.scheduled_at || "-"} Completed: ${a.completed_at || "No"}\n`;
    });
  }

  return contextStr;
}

// ── Agentic loop handler ──
// Runs multiple AI rounds: tool calls are processed server-side and fed back
// until the model produces a final text response or hits the step limit.
// Emits custom SSE events: "text", "proposal", "status", "done"

const MAX_STEPS = 100;

function sseEvent(type: string, data: any): string {
  return `data: ${JSON.stringify({ type, ...data })}\n\n`;
}

async function callAINonStreaming(messages: any[], apiKey: string): Promise<any> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages,
      tools: TOOLS,
      tool_choice: "auto",
    }),
  });

  if (!resp.ok) {
    const status = resp.status;
    const body = await resp.text().catch(() => "");
    throw { status, body };
  }

  return resp.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth: require team or admin role
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", userData.user.id);
    if (!(roles || []).some((r) => r.role === "team" || r.role === "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { messages, workData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Process files
    const processedMessages = await buildMessagesWithFiles(messages);
    const contextStr = buildWorkDataContext(workData);

    const conversationMessages: any[] = [
      { role: "system", content: SYSTEM_PROMPT + contextStr },
      ...processedMessages,
    ];

    // SSE stream to client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (type: string, data: any) => {
          controller.enqueue(encoder.encode(sseEvent(type, data)));
        };

        try {
          let step = 0;
          while (step < MAX_STEPS) {
            step++;
            send("status", { message: step === 1 ? "Thinking..." : `Processing step ${step}...` });

            const result = await callAINonStreaming(conversationMessages, LOVABLE_API_KEY);
            const choice = result.choices?.[0];
            if (!choice) { send("text", { content: "⚠️ No response from AI." }); break; }

            const msg = choice.message;
            const hasToolCalls = (choice.finish_reason === "tool_calls" || msg.tool_calls?.length);

            // If the model returned text content, stream it — but suppress if it also has tool calls
            // (Gemini sometimes dumps tool call JSON as text alongside structured tool_calls)
            if (msg.content && !hasToolCalls) {
              // Also check if text contains an inline tool call (model wrote it as text instead of using tools)
              const inlineToolMatch = msg.content.match(/propose_changes\s*\(\s*\{/s);
              if (inlineToolMatch) {
                // Try to extract JSON from inline text tool call
                const jsonStart = msg.content.indexOf('{', msg.content.indexOf('propose_changes'));
                if (jsonStart !== -1) {
                  // Find matching closing brace
                  let depth = 0;
                  let jsonEnd = -1;
                  for (let i = jsonStart; i < msg.content.length; i++) {
                    if (msg.content[i] === '{') depth++;
                    else if (msg.content[i] === '}') { depth--; if (depth === 0) { jsonEnd = i + 1; break; } }
                  }
                  if (jsonEnd > jsonStart) {
                    try {
                      const parsed = JSON.parse(msg.content.slice(jsonStart, jsonEnd));
                      // Send the text before the tool call (if any meaningful text)
                      const preText = msg.content.slice(0, msg.content.indexOf('propose_changes')).replace(/[\n\s]+$/, '');
                      if (preText && preText.length > 10) {
                        send("text", { content: preText });
                      }
                      // Emit as proposal
                      send("status", { message: "Building change proposals..." });
                      send("proposal", { summary: parsed.summary, changes: parsed.changes || [] });
                      // Feed back to model and continue
                      conversationMessages.push({
                        role: "assistant",
                        content: `I have proposed changes: "${parsed.summary}" with ${parsed.changes?.length || 0} items. The user will review and accept/reject.`,
                      });
                      continue;
                    } catch { /* Fall through to send as text */ }
                  }
                }
              }
              send("text", { content: msg.content });
            } else if (msg.content && hasToolCalls) {
              // Suppress raw tool call text, but send any preamble text before "propose_changes"
              const cleanText = msg.content.replace(/propose_changes\s*\([\s\S]*$/, '').trim();
              if (cleanText && cleanText.length > 10) {
                send("text", { content: cleanText });
              }
            }

            // If no tool calls, we're done
            if (!hasToolCalls) {
              break;
            }

            // Process tool calls
            if (msg.tool_calls?.length) {
              // Add assistant message with tool calls to conversation
              conversationMessages.push(msg);

              for (const tc of msg.tool_calls) {
                const fnName = tc.function?.name;
                let args: any = {};
                try { args = JSON.parse(tc.function?.arguments || "{}"); } catch {}

                if (fnName === "propose_changes") {
                  send("status", { message: "Building change proposals..." });
                  send("proposal", {
                    summary: args.summary,
                    changes: args.changes || [],
                  });
                  conversationMessages.push({
                    role: "tool",
                    tool_call_id: tc.id,
                    content: JSON.stringify({
                      success: true,
                      message: `Proposed ${args.changes?.length || 0} changes: "${args.summary}". Changes shown to user for approval. You may continue with additional analysis or proposals.`,
                    }),
                  });
                } else if (fnName === "generate_report") {
                  send("status", { message: "Generating report..." });
                  conversationMessages.push({
                    role: "tool",
                    tool_call_id: tc.id,
                    content: JSON.stringify({
                      success: true,
                      message: `Report type "${args.reportType}" requested. Generate the full report in your text response using the work data provided.`,
                    }),
                  });
                } else {
                  conversationMessages.push({
                    role: "tool",
                    tool_call_id: tc.id,
                    content: JSON.stringify({ error: `Unknown tool: ${fnName}` }),
                  });
                }
              }
              continue;
            }

            break;
          }

          if (step >= MAX_STEPS) {
            send("text", { content: "\n\n⚠️ _Reached maximum processing steps. Some actions may need follow-up._" });
          }

          send("done", {});
        } catch (err: any) {
          if (err.status === 429) {
            send("error", { message: "Rate limit exceeded. Please try again in a moment." });
          } else if (err.status === 402) {
            send("error", { message: "AI credits exhausted. Please top up in workspace settings." });
          } else {
            console.error("Agentic loop error:", err);
            send("error", { message: err.message || "AI service error" });
          }
          send("done", {});
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  } catch (e) {
    console.error("work-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
