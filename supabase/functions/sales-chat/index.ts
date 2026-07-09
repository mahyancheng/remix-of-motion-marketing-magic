import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { chatCompletion } from "../_shared/ai-gateway.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a Leadzap Marketing sales assistant helping the internal sales team create client proposals. You guide conversations to gather all information needed for a complete proposal.

# COMPANY CONTEXT
Leadzap Marketing is a one-stop digital marketing agency offering:
- Google Ads + SEO: RM 2,400/month (includes website creation, creatives, tracking)
- Social Media Paid Ads: RM 2,100/month (includes content creation, RM 300 per extra platform)
- Available Social Platforms: Meta (Facebook + Instagram as one platform), TikTok, LinkedIn (first platform included, extras at RM 300/month each)
- Recommended ad budget: RM 2,000/month per platform
- Contracts: 12 months with monthly instalments
- KPI Focus: Leads (calls/WhatsApp/forms) or E-commerce sales
- Typical conversion rate: 2-3% (use 2.5% for planning)
- Marketing budget guideline: 15% of revenue (normal) or 25% (highly competitive)

# CUSTOM PACKAGES
Beyond the three preset packages, you can also propose a fully CUSTOM package tailored to the client. Use the set_custom_package tool to define a list of line items, each with a description and monthly RM amount (e.g. "Branding & Creative Production — RM 1,800/month", "TikTok Content Management — RM 1,500/month", "Landing Page Funnel — RM 800/month"). When you call set_custom_package, the selectedPackage becomes 'custom' and the sum of items becomes the management fee. Use this when the client has unusual needs that don't fit the presets, or when bundling specific deliverables with itemized pricing makes the quotation clearer.

# YOUR ROLE
1. Guide discovery conversation to collect client information
2. Help with positioning and strategy direction
3. Calculate budget recommendations
4. Generate proposal data by calling the update_proposal function
5. Browse websites and documents when provided to extract relevant information
6. Conduct market research using the conduct_market_research function
7. Set up customized payment schedules based on client needs
8. Configure platform selection for social media campaigns

# INFORMATION TO COLLECT (Discovery Checklist)
- Client name and business type
- Product/service, best sellers, margin, seasonality
- Target customer: industry, location, company size, persona, pain points
- Average Order Value (AOV) / average contract value
- Target monthly revenue
- Current marketing channels, past campaigns, what worked/failed
- Sales process: response time, follow-up, close rate, capacity
- Assets available: photos/videos/testimonials
- Competitors (top 3) and differentiators
- Primary offer to promote
- Preferred CTA (WhatsApp/Call/Form/Checkout)
- Which social platforms they want to use (if social package). Note: Meta = Facebook + Instagram combined as one platform. Always default to including Meta unless client specifies otherwise. Proactively call set_platforms when package is selected.

# POSITIONING FRAMEWORK
Help define:
- ICP (Ideal Customer Profile)
- Primary offer
- Core promise
- Differentiators (top 3)
- Message angles (2-3)

# BUDGET CALCULATION
Formula (budget-first approach):
- Target Revenue / AOV = Conversions Needed
- Conversions / Conversion Rate (2.5%) = Leads Needed
- Marketing Budget = Target Revenue × Budget Ratio (default 20%, range 15-25%)
- Estimated CPL = Marketing Budget / Leads Needed

# PAYMENT SCHEDULE
- Standard: 12 monthly instalments
- Can offer discounts for early payment or full upfront (max 10%)
- Can customize timing based on client's cash flow needs
- Can split packages to start at different times

# TOOL USAGE GUIDELINES
- When you gather information from the conversation, ALWAYS call update_proposal to save it to the live preview
- When user provides a website URL, call browse_website to extract information
- After browsing a website, summarize what you found and update the proposal accordingly
- When user uploads files (PDF, docs, images, etc.), analyze them using the analyze_document tool to extract relevant information
- For images, describe what you see and extract any text, logos, or business information
- When ready to generate a proposal, call conduct_market_research to add industry insights
- Use set_payment_schedule to customize payment plans
- Use set_platforms to specify which social media platforms to use
- Be proactive in updating the proposal as you learn new information

# IMPORTANT: EDITABLE PREVIEW
The live preview on the right side is FULLY EDITABLE by the sales rep. They can:
- Click on any field (client name, business type, location, etc.) to edit it directly
- Adjust financial metrics (target revenue, AOV, conversion rate, budget ratio) with auto-recalculation
- Select packages by clicking on them
- All numeric fields auto-calculate: when they change Target Revenue, AOV, Conversion Rate, or Budget Ratio, the system automatically recalculates Conversions Needed, Leads Needed, Marketing Budget, and Required CPL

So you don't need to ask for every single detail - the rep can fine-tune values themselves. Focus on strategic discovery and positioning guidance.

Be conversational, helpful, and guide the user step by step. Ask 2-3 questions at a time, not everything at once. Acknowledge their answers and adapt your questions based on context.

Start by greeting and asking about the client they're creating a proposal for.`;

// Define the tools the agent can use
const TOOLS = [
  {
    type: "function",
    function: {
      name: "update_proposal",
      description: "Update the proposal preview with collected information. Call this whenever you learn new information about the client to keep the live preview updated.",
      parameters: {
        type: "object",
        properties: {
          clientName: { type: "string", description: "The client's company or business name" },
          businessType: { type: "string", description: "Type of business (e.g., restaurant, clinic, ecommerce)" },
          productService: { type: "string", description: "Main products or services offered" },
          bestSellers: { type: "string", description: "Top selling products or services" },
          margin: { type: "string", description: "Profit margin information" },
          seasonality: { type: "string", description: "Seasonal patterns in the business" },
          icp: { type: "string", description: "Ideal Customer Profile description" },
          targetLocation: { type: "string", description: "Target geographic location(s)" },
          companySize: { type: "string", description: "Target company size (if B2B)" },
          persona: { type: "string", description: "Target customer persona" },
          painPoints: { type: "string", description: "Customer pain points" },
          aov: { type: "number", description: "Average Order Value in RM" },
          targetRevenue: { type: "number", description: "Target monthly revenue in RM" },
          conversionRate: { type: "number", description: "Expected conversion rate as percentage (e.g., 2.5)" },
          budgetRatio: { type: "number", description: "Marketing budget as percentage of target revenue (15-25%, default 20)" },
          primaryOffer: { type: "string", description: "The main offer to promote" },
          corePromise: { type: "string", description: "The core value promise to customers" },
          differentiators: { type: "array", items: { type: "string" }, description: "Key differentiators from competitors" },
          messageAngles: { type: "array", items: { type: "string" }, description: "Marketing message angles" },
          positioningOneLiner: { type: "string", description: "One-liner positioning statement" },
          selectedPackage: { type: "string", enum: ["google-seo", "social", "both", "custom"], description: "Selected service package. Use 'custom' for AI-defined line items (call set_custom_package instead)." },
          extraPlatforms: { type: "number", description: "Number of extra social platforms (calculated automatically from selectedPlatforms)" },
          currentChannels: { type: "string", description: "Current marketing channels in use" },
          pastCampaigns: { type: "string", description: "Description of past marketing campaigns" },
          competitors: { type: "array", items: { type: "string" }, description: "List of competitors" },
          cta: { type: "string", enum: ["whatsapp", "call", "form", "checkout"], description: "Preferred call-to-action method" },
          kpiType: { type: "string", enum: ["leads", "ecommerce"], description: "Type of KPI focus" },
          kpiTarget: { type: "string", description: "Specific KPI target" },
          assets: { type: "string", description: "Available marketing assets" },
          startDate: { type: "string", description: "Proposed start date" },
          notes: { type: "string", description: "Additional notes" },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "analyze_document",
      description: "Analyze an uploaded document (PDF, Word, PowerPoint, Excel, image) to extract relevant business information. Use this when the user uploads files to extract client info, competitor data, or other relevant details.",
      parameters: {
        type: "object",
        properties: {
          fileIndex: { type: "number", description: "Index of the file in the attachments array (0-based)" },
          extractType: { 
            type: "string", 
            enum: ["general", "business_info", "competitor_analysis", "product_catalog", "financial_data"],
            description: "What type of information to extract from the document" 
          },
        },
        required: ["fileIndex"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_platforms",
      description: "Set the social media platforms for the campaign. Use this when the client specifies which platforms they want to advertise on. First platform is included, each additional is RM 300/month extra.",
      parameters: {
        type: "object",
        properties: {
          platforms: { 
            type: "array", 
            items: { type: "string" },
            description: "List of social media platforms to include in the campaign. Meta includes both Facebook and Instagram as a single platform. You can specify any platform name (e.g. Meta, TikTok, LinkedIn, YouTube, Twitter/X, Xiaohongshu, etc.)." 
          },
        },
        required: ["platforms"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_custom_package",
      description: "Define a fully custom package with itemized line items (description + monthly RM amount). Use this when the client's needs don't fit the standard presets. Each item represents a deliverable bundled into the monthly management fee. The sum of all items becomes the new management fee. After calling this, also call set_payment_schedule using the sum as managementFee.",
      parameters: {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                description: { type: "string", description: "Service / deliverable name (e.g. 'TikTok Content Production')" },
                monthlyAmount: { type: "number", description: "Monthly fee for this item in RM" },
              },
              required: ["description", "monthlyAmount"],
            },
            description: "List of custom line items that make up the package",
          },
        },
        required: ["items"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_payment_schedule",
      description: "Generate a comprehensive monthly payment schedule that includes both management fees and marketing budget across the contract timeline. This should show the full monthly breakdown of what the client pays.",
      parameters: {
        type: "object",
        properties: {
          contractMonths: { type: "number", description: "Contract duration in months (default 12)" },
          startDate: { type: "string", description: "Contract start date in YYYY-MM-DD format" },
          managementFee: { type: "number", description: "Monthly management fee in RM (based on selected package)" },
          monthlyAdBudget: { type: "number", description: "Monthly advertising/marketing budget in RM" },
          extraPlatformFee: { type: "number", description: "Extra platform fees per month in RM (RM 300 per extra platform)" },
          setupFee: { type: "number", description: "One-time setup fee in RM (optional, added to first month)" },
          discountPercentage: { type: "number", description: "Discount percentage on management fees (0-10%)" },
          discountReason: { type: "string", description: "Reason for discount (e.g., 'Early bird', 'Full upfront payment', 'Referral')" },
          customInstallments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                description: { type: "string", description: "Description of this payment" },
                amount: { type: "number", description: "Amount in RM" },
                dueDate: { type: "string", description: "Due date in YYYY-MM-DD format" },
                breakdown: { 
                  type: "object",
                  properties: {
                    managementFee: { type: "number" },
                    adBudget: { type: "number" },
                    setupFee: { type: "number" },
                    extraPlatforms: { type: "number" },
                  }
                },
              },
              required: ["description", "amount", "dueDate"],
            },
            description: "Custom installments if client needs non-standard payment schedule. If provided, this overrides the auto-generated monthly schedule."
          },
        },
        required: ["contractMonths", "startDate", "managementFee", "monthlyAdBudget"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "conduct_market_research",
      description: "Conduct comprehensive market research for the client's industry. Use this to add market insights, trends, competitor analysis, and strategic recommendations to the proposal.",
      parameters: {
        type: "object",
        properties: {
          industryOverview: { type: "string", description: "Brief overview of the industry landscape" },
          marketSize: { type: "string", description: "Market size and growth potential" },
          trends: { type: "array", items: { type: "string" }, description: "Key market trends (3-5 items)" },
          competitorInsights: { type: "array", items: { type: "string" }, description: "Insights about competitors' strategies (3-5 items)" },
          opportunities: { type: "array", items: { type: "string" }, description: "Market opportunities for the client (3-5 items)" },
          threats: { type: "array", items: { type: "string" }, description: "Potential threats or challenges (2-4 items)" },
          recommendations: { type: "array", items: { type: "string" }, description: "Strategic recommendations based on research (3-5 items)" },
        },
        required: ["industryOverview", "marketSize", "trends", "opportunities", "recommendations"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "browse_website",
      description: "Browse and extract information from a website URL. Use this when the user provides a website link to learn about their business, competitors, or industry.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The website URL to browse" },
          extractType: { 
            type: "string", 
            enum: ["general", "business_info", "competitor_analysis", "product_catalog"],
            description: "What type of information to extract" 
          },
        },
        required: ["url"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_budget",
      description: "Calculate marketing budget based on target revenue and other metrics",
      parameters: {
        type: "object",
        properties: {
          targetRevenue: { type: "number", description: "Target monthly revenue in RM" },
          aov: { type: "number", description: "Average Order Value in RM" },
          conversionRate: { type: "number", description: "Expected conversion rate as percentage (default 2.5)" },
          cpl: { type: "number", description: "Estimated Cost Per Lead in RM" },
        },
        required: ["targetRevenue", "aov"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "view_current_proposal",
      description: "View the complete current proposal data to review what has been collected so far. Use this to see all the information in the proposal including client details, positioning, budget calculations, market research, payment schedule, and all other fields. This gives you a comprehensive view of the proposal state.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_clients",
      description: "Search the existing client database to check if a client already exists. Use this BEFORE issuing a quotation so the proposal can be pre-linked to the right client account. Returns matching clients with their id, name, customer_id (if any), and whether they have a portal login. If no query is given, returns up to 20 most recent clients.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Partial client name to search (case-insensitive). Leave empty to list recent clients." },
          limit: { type: "number", description: "Max results to return (default 10, max 25)." },
        },
        additionalProperties: false,
      },
    },
  },
];

// Execute tool calls
async function executeTool(toolName: string, args: Record<string, unknown>): Promise<string> {
  console.log(`Executing tool: ${toolName}`, args);
  
  switch (toolName) {
    case "update_proposal":
      // Return the update data to be sent to the client
      return JSON.stringify({ type: "proposal_update", data: args });
    
    case "set_platforms": {
      const platforms = args.platforms as string[];
      const extraPlatforms = Math.max(0, platforms.length - 1);
      return JSON.stringify({ 
        type: "proposal_update", 
        data: { 
          selectedPlatforms: platforms,
          extraPlatforms: extraPlatforms,
        } 
      });
    }
    
    case "set_custom_package": {
      const rawItems = (args.items as Array<{ description: string; monthlyAmount: number }>) || [];
      const items = rawItems.map((it, i) => ({
        id: `item-${i + 1}-${Date.now()}`,
        description: it.description,
        monthlyAmount: Number(it.monthlyAmount) || 0,
      }));
      return JSON.stringify({
        type: "proposal_update",
        data: {
          selectedPackage: "custom",
          customLineItems: items,
        },
      });
    }
    
    case "set_payment_schedule": {
      const contractMonths = (args.contractMonths as number) || 12;
      const startDate = args.startDate as string;
      const managementFee = args.managementFee as number;
      const monthlyAdBudget = args.monthlyAdBudget as number;
      const extraPlatformFee = (args.extraPlatformFee as number) || 0;
      const setupFee = (args.setupFee as number) || 0;
      const discountPercentage = (args.discountPercentage as number) || 0;
      const discountReason = (args.discountReason as string) || "";
      const customInstallments = args.customInstallments as Array<{
        description: string;
        amount: number;
        dueDate: string;
        breakdown?: {
          managementFee?: number;
          adBudget?: number;
          setupFee?: number;
          extraPlatforms?: number;
        };
      }> | undefined;
      
      let paymentSchedule;
      
      if (customInstallments && customInstallments.length > 0) {
        // Use custom installments
        paymentSchedule = customInstallments.map((inst, index) => ({
          id: `payment-${index + 1}-${Date.now()}`,
          description: inst.description,
          amount: inst.amount,
          dueDate: inst.dueDate,
          isPaid: false,
          breakdown: inst.breakdown || {},
        }));
      } else {
        // Generate monthly schedule
        const discountMultiplier = 1 - (discountPercentage / 100);
        const discountedManagementFee = Math.round(managementFee * discountMultiplier);
        
        paymentSchedule = [];
        const start = new Date(startDate);
        
        for (let i = 0; i < contractMonths; i++) {
          const paymentDate = new Date(start);
          paymentDate.setMonth(paymentDate.getMonth() + i);
          
          const isFirstMonth = i === 0;
          const monthlyTotal = discountedManagementFee + monthlyAdBudget + extraPlatformFee + (isFirstMonth ? setupFee : 0);
          
          const monthName = paymentDate.toLocaleDateString('en-MY', { month: 'short', year: 'numeric' });
          
          paymentSchedule.push({
            id: `payment-${i + 1}-${Date.now()}`,
            description: isFirstMonth && setupFee > 0 
              ? `Month ${i + 1} (${monthName}) + Setup Fee`
              : `Month ${i + 1} (${monthName})`,
            amount: monthlyTotal,
            dueDate: paymentDate.toISOString().split('T')[0],
            isPaid: false,
            breakdown: {
              managementFee: discountedManagementFee,
              adBudget: monthlyAdBudget,
              setupFee: isFirstMonth ? setupFee : 0,
              extraPlatforms: extraPlatformFee,
            },
          });
        }
      }
      
      // Calculate total
      const totalContractValue = paymentSchedule.reduce((sum, i) => sum + i.amount, 0);
      
      // Calculate monthly breakdown summary
      const monthlyBreakdown = {
        managementFee: Math.round(managementFee * (1 - discountPercentage / 100)),
        adBudget: monthlyAdBudget,
        extraPlatforms: extraPlatformFee,
        totalMonthly: Math.round(managementFee * (1 - discountPercentage / 100)) + monthlyAdBudget + extraPlatformFee,
      };
      
      return JSON.stringify({ 
        type: "proposal_update", 
        data: { 
          paymentSchedule,
          totalContractValue,
          discountPercentage,
          discountReason,
          monthlyBreakdown,
          contractMonths,
        } 
      });
    }
    
    case "conduct_market_research": {
      const marketResearch = {
        industryOverview: args.industryOverview as string,
        marketSize: args.marketSize as string,
        trends: (args.trends as string[]) || [],
        competitorInsights: (args.competitorInsights as string[]) || [],
        opportunities: (args.opportunities as string[]) || [],
        threats: (args.threats as string[]) || [],
        recommendations: (args.recommendations as string[]) || [],
      };
      
      return JSON.stringify({ 
        type: "proposal_update", 
        data: { marketResearch } 
      });
    }
    
    case "browse_website": {
      const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
      if (!FIRECRAWL_API_KEY) {
        return JSON.stringify({ error: "Website browsing is not configured. Please connect Firecrawl." });
      }
      
      try {
        let url = (args.url as string).trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = `https://${url}`;
        }
        
        console.log("Scraping URL:", url);
        
        const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
            formats: ["markdown"],
            onlyMainContent: true,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Firecrawl error:", response.status, errorText);
          return JSON.stringify({ error: `Failed to browse website: ${response.status}` });
        }
        
        const data = await response.json();
        const markdown = data.data?.markdown || data.markdown || "";
        const metadata = data.data?.metadata || data.metadata || {};
        
        // Truncate if too long
        const truncatedContent = markdown.length > 8000 
          ? markdown.substring(0, 8000) + "\n\n[Content truncated...]" 
          : markdown;
        
        return JSON.stringify({
          type: "website_content",
          title: metadata.title || "Unknown",
          description: metadata.description || "",
          content: truncatedContent,
          url: url,
        });
      } catch (error) {
        console.error("Browse website error:", error);
        return JSON.stringify({ error: `Failed to browse website: ${error instanceof Error ? error.message : "Unknown error"}` });
      }
    }
    
    case "calculate_budget": {
      const targetRevenue = args.targetRevenue as number;
      const aov = args.aov as number;
      const conversionRate = (args.conversionRate as number) || 2.5;
      const cpl = (args.cpl as number) || 50;
      
      const conversionsNeeded = Math.ceil(targetRevenue / aov);
      const leadsNeeded = Math.ceil(conversionsNeeded / (conversionRate / 100));
      const marketingBudget = cpl * leadsNeeded;
      const budgetPercentage = ((marketingBudget / targetRevenue) * 100).toFixed(1);
      
      return JSON.stringify({
        type: "budget_calculation",
        conversionsNeeded,
        leadsNeeded,
        marketingBudget,
        budgetPercentage,
        recommendation: marketingBudget > targetRevenue * 0.25 
          ? "Budget exceeds 25% of revenue - consider adjusting targets or improving conversion rates"
          : marketingBudget < targetRevenue * 0.10
          ? "Budget is very lean - may need more investment for competitive industries"
          : "Budget is within healthy range (10-25% of target revenue)",
      });
    }
    
    case "view_current_proposal": {
      // This tool doesn't modify anything - it just returns the current proposal context
      // The actual proposal data is passed in proposalContext and will be included in the response
      return JSON.stringify({
        type: "proposal_view",
        message: "Current proposal data is available in the context. Review the CURRENT PROPOSAL DATA section in your system prompt for all collected information.",
      });
    }
    
    case "analyze_document": {
      // Document analysis is handled by passing file content to the AI
      // This tool signals intent - the actual analysis is done via multimodal capabilities
      const fileIndex = args.fileIndex as number;
      const extractType = (args.extractType as string) || "general";
      
      return JSON.stringify({
        type: "document_analysis_request",
        fileIndex,
        extractType,
        message: `Analyzing document at index ${fileIndex} for ${extractType} information. The file content has been provided in the conversation - please analyze it and extract relevant information.`,
      });
    }
    
    case "lookup_clients": {
      try {
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const admin = createClient(SUPABASE_URL, SERVICE_KEY);
        const q = String((args.query as string) || "").trim();
        const limit = Math.min(25, Math.max(1, Number(args.limit) || 10));
        let query = admin.from("clients").select("id, name, website, auth_user_id, created_at").limit(limit);
        if (q) query = query.ilike("name", `%${q}%`);
        else query = query.order("created_at", { ascending: false });
        const { data, error } = await query;
        if (error) return JSON.stringify({ error: error.message });
        const clients = (data || []).map((c: Record<string, unknown>) => ({
          id: c.id,
          name: c.name,
          website: c.website,
          has_portal_login: !!c.auth_user_id,
        }));
        return JSON.stringify({ type: "client_lookup", count: clients.length, clients });
      } catch (e) {
        return JSON.stringify({ error: e instanceof Error ? e.message : "Lookup failed" });
      }
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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

    const { messages, proposalContext } = await req.json();

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    const sendEvent = async (data: unknown) => {
      await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    };

    const sendStatus = async (message: string) => {
      await sendEvent({ type: 'status', message });
    };

    // Process in background
    (async () => {
      try {
        await sendStatus('Processing your message...');

    // Process messages to handle file attachments for multimodal AI
    const processedMessages = messages.map((msg: { role: string; content: string; attachments?: Array<{ name: string; type: string; size: number; base64: string }> }) => {
      if (msg.attachments && msg.attachments.length > 0) {
        // Convert to multimodal message format
        const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];
        
        // Add the text content first
        if (msg.content) {
          content.push({ type: "text", text: msg.content });
        }
        
        // Add file descriptions and content
        msg.attachments.forEach((att, index) => {
          if (att.type.startsWith("image/")) {
            // For images, include as image_url for vision models
            content.push({
              type: "image_url",
              image_url: {
                url: `data:${att.type};base64,${att.base64}`,
              },
            });
            content.push({
              type: "text",
              text: `[Image ${index + 1}: ${att.name}]`,
            });
          } else {
            // For documents, decode and include as text
            try {
              const decoded = atob(att.base64);
              // Check if it's readable text
              const isText = att.type.includes("text") || 
                att.name.endsWith(".txt") || 
                att.name.endsWith(".csv") ||
                att.name.endsWith(".json");
              
              if (isText && decoded.length < 50000) {
                content.push({
                  type: "text",
                  text: `\n\n--- File: ${att.name} ---\n${decoded}\n--- End of ${att.name} ---\n`,
                });
              } else {
                // For binary files (PDF, DOCX, etc.), include metadata and note
                content.push({
                  type: "text",
                  text: `\n[Document ${index + 1}: ${att.name} (${att.type}, ${Math.round(att.size / 1024)}KB) - Binary file uploaded. Please acknowledge receipt and ask if the user can share key details from this document, or suggest they copy-paste relevant text.]`,
                });
              }
            } catch {
              content.push({
                type: "text",
                text: `\n[Document ${index + 1}: ${att.name} (${att.type}) - File uploaded but content could not be decoded.]`,
              });
            }
          }
        });
        
        return {
          role: msg.role,
          content,
        };
      }
      return msg;
    });

    // Build context-aware system prompt
    let contextualPrompt = SYSTEM_PROMPT;
    if (proposalContext && Object.keys(proposalContext).length > 0) {
      contextualPrompt += `\n\n# CURRENT PROPOSAL DATA (already collected)\n${JSON.stringify(proposalContext, null, 2)}\n\nUse this data as context. Don't ask again for information already provided unless user wants to change it.`;
    }

    await sendStatus('Analyzing request...');

    // First API call - may result in tool calls.
    // Routed through the shared AI gateway → your ChatGPT/Codex (OpenClaw). Same
    // OpenAI /v1/chat/completions shape (messages + tools), so tool-calling is unchanged.
    let response = await chatCompletion({
      messages: [
        { role: "system", content: contextualPrompt },
        ...processedMessages,
      ],
      tools: TOOLS,
    });

    if (!response.ok) {
      if (response.status === 429) {
        await sendEvent({ error: "Rate limit exceeded. Please wait a moment and try again." });
        await writer.close();
        return;
      }
      if (response.status === 402) {
        await sendEvent({ error: "AI credits exhausted. Please add credits to continue." });
        await writer.close();
        return;
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      await sendEvent({ error: "AI service error. Please try again." });
      await writer.close();
      return;
    }

    let result = await response.json();
    let assistantMessage = result.choices?.[0]?.message;
    
    // Collect all tool results and proposal updates
    const toolResults: Array<{ toolCallId: string; result: string }> = [];
    const proposalUpdates: Record<string, unknown>[] = [];
    
    // Handle tool calls in a loop
    while (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log("Processing tool calls:", assistantMessage.tool_calls.length);
      
      // Execute all tool calls
      for (const toolCall of assistantMessage.tool_calls) {
        // Send status for each tool
        const toolName = toolCall.function.name;
        const statusMessages: Record<string, string> = {
          'browse_website': '🌐 Browsing website...',
          'analyze_document': '📄 Analyzing document...',
          'conduct_market_research': '📊 Conducting market research...',
          'calculate_budget': '💰 Calculating budget...',
          'update_proposal': '✏️ Updating proposal...',
          'set_payment_schedule': '📅 Setting up payment schedule...',
          'set_platforms': '📱 Configuring platforms...',
          'view_current_proposal': '👁️ Reviewing proposal data...',
          'lookup_clients': '🔎 Checking existing clients...',
        };
        await sendStatus(statusMessages[toolName] || `⚙️ Running ${toolName}...`);

        const args = JSON.parse(toolCall.function.arguments);
        const toolResult = await executeTool(toolCall.function.name, args);
        
        // Parse result to check for proposal updates
        try {
          const parsed = JSON.parse(toolResult);
          if (parsed.type === "proposal_update") {
            proposalUpdates.push(parsed.data);
            await sendEvent({ type: 'proposal_update', data: parsed.data });
          }
        } catch {
          // Not JSON, ignore
        }
        
        toolResults.push({
          toolCallId: toolCall.id,
          result: toolResult,
        });
      }
      
      await sendStatus('Processing tool results...');

      // Build messages for next call including tool results
      const messagesWithTools = [
        { role: "system", content: contextualPrompt },
        ...processedMessages,
        assistantMessage,
        ...toolResults.map(tr => ({
          role: "tool",
          tool_call_id: tr.toolCallId,
          content: tr.result,
        })),
      ];
      
      // Call again with tool results (through the same gateway → ChatGPT/Codex).
      response = await chatCompletion({
        messages: messagesWithTools,
        tools: TOOLS,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error on tool follow-up:", response.status, errorText);
        break;
      }
      
      result = await response.json();
      assistantMessage = result.choices?.[0]?.message;
      toolResults.length = 0; // Clear for next iteration
    }

    await sendStatus('Generating response...');

    // Return the final response with any proposal updates
    const finalContent = assistantMessage?.content || "";

    // Send final content
    await sendEvent({ type: 'content', content: finalContent });
    await writer.write(encoder.encode('data: [DONE]\n\n'));
    await writer.close();

      } catch (e) {
        console.error("Sales chat streaming error:", e);
        await sendEvent({ error: e instanceof Error ? e.message : "Unknown error" });
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });

  } catch (e) {
    console.error("Sales chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
