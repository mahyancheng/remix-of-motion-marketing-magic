export interface CustomLineItem {
  id: string;
  description: string;
  monthlyAmount: number;
}

export interface PaymentBreakdown {
  managementFee?: number;
  adBudget?: number;
  setupFee?: number;
  extraPlatforms?: number;
}

export interface PaymentInstallment {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  isPaid?: boolean;
  breakdown?: PaymentBreakdown;
}

export interface MonthlyBreakdown {
  managementFee: number;
  adBudget: number;
  extraPlatforms: number;
  totalMonthly: number;
}

export interface MarketResearch {
  industryOverview: string;
  marketSize: string;
  trends: string[];
  competitorInsights: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
}

export interface ProposalData {
  // Client Info
  clientName: string;
  date: string;
  businessType: string;
  
  // Business Context
  productService: string;
  bestSellers: string;
  margin: string;
  seasonality: string;
  
  // Target Customer
  icp: string;
  targetLocation: string;
  companySize: string;
  persona: string;
  painPoints: string;
  
  // Financial
  aov: number;
  targetRevenue: number;
  conversionRate: number;
  budgetRatio: number; // Marketing budget as % of revenue (15-25%)
  
  // Calculated
  conversionsNeeded: number;
  leadsNeeded: number;
  marketingBudget: number;
  estimatedCPL: number; // Derived from budget constraint
  
  // Strategy
  primaryOffer: string;
  corePromise: string;
  differentiators: string[];
  messageAngles: string[];
  positioningOneLiner: string;
  
  // Package Selection
  selectedPackage: 'google-seo' | 'social' | 'both' | 'custom' | null;
  extraPlatforms: number;
  selectedPlatforms: string[]; // Which social platforms (e.g., 'Facebook', 'Instagram', 'TikTok', 'LinkedIn')
  customLineItems?: CustomLineItem[]; // AI- or user-defined custom service items
  
  // Payment Schedule
  paymentSchedule: PaymentInstallment[];
  totalContractValue: number;
  discountPercentage: number;
  discountReason: string;
  monthlyBreakdown?: MonthlyBreakdown;
  contractMonths?: number;
  
  // Market Research
  marketResearch: MarketResearch | null;
  
  // Sales Info
  currentChannels: string;
  pastCampaigns: string;
  competitors: string[];
  cta: 'whatsapp' | 'call' | 'form' | 'checkout';
  
  // KPI
  kpiType: 'leads' | 'ecommerce';
  kpiTarget: string;
  
  // Misc
  assets: string;
  startDate: string;
  notes: string;
}

export const defaultProposalData: ProposalData = {
  clientName: '',
  date: new Date().toISOString().split('T')[0],
  businessType: '',
  productService: '',
  bestSellers: '',
  margin: '',
  seasonality: '',
  icp: '',
  targetLocation: '',
  companySize: '',
  persona: '',
  painPoints: '',
  aov: 500,
  targetRevenue: 100000,
  conversionRate: 2.5,
  budgetRatio: 20,
  conversionsNeeded: 0,
  leadsNeeded: 0,
  marketingBudget: 0,
  estimatedCPL: 0,
  primaryOffer: '',
  corePromise: '',
  differentiators: [],
  messageAngles: [],
  positioningOneLiner: '',
  selectedPackage: null,
  extraPlatforms: 0,
  selectedPlatforms: [],
  customLineItems: [],
  paymentSchedule: [],
  totalContractValue: 0,
  discountPercentage: 0,
  discountReason: '',
  marketResearch: null,
  currentChannels: '',
  pastCampaigns: '',
  competitors: [],
  cta: 'whatsapp',
  kpiType: 'leads',
  kpiTarget: '',
  assets: '',
  startDate: '',
  notes: '',
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  attachments?: ChatAttachment[];
};

export type ChatAttachment = {
  name: string;
  type: string;
  size: number;
  base64: string;
};

export interface SavedProposalData {
  proposalData: ProposalData;
  chatMessages?: ChatMessage[];
}
