import { ProposalData } from '@/types/proposal';
import leadzapLogo from '@/assets/leadzap-logo.png';
import { Zap } from 'lucide-react';

interface ProposalHeaderProps {
  data: ProposalData;
  formatDate: (dateStr: string) => string;
}

// Strip markdown formatting and common prefixes from text
const cleanText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/^\s*(to|for)\s+/i, '') // Remove leading "to" or "for"
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/\*/g, '') // Remove italic markdown
    .replace(/[_.]/g, (match) => match === '.' ? '' : match) // Remove trailing periods
    .trim();
};

export const ProposalHeader = ({ data, formatDate }: ProposalHeaderProps) => {
  const clientName = cleanText(data.clientName) || 'Client';
  
  return (
    <header className="space-y-8">
      <div className="flex items-center justify-between">
        <img src={leadzapLogo} alt="Leadzap" className="h-14" />
        <div className="text-right text-sm text-muted-foreground">
          <p className="font-medium text-foreground">www.leadzapmarketing.com.my</p>
          <p>www.leadzapmarketing.com</p>
        </div>
      </div>
      
      <div className="relative rounded-3xl overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 accent-gradient opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-30">
          <Zap className="h-24 w-24 text-accent-foreground" />
        </div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-black/20 to-transparent rounded-tr-full" />
        
        {/* Content */}
        <div className="relative z-10 p-10 md:p-14">
          <span className="inline-block rounded-full bg-accent-foreground/20 px-4 py-1.5 text-sm font-semibold text-accent-foreground mb-4">
            MARKETING PROPOSAL
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-accent-foreground mb-6">
            Digital Marketing Strategy
          </h2>
          <div className="flex flex-wrap gap-6">
            <div className="rounded-xl bg-accent-foreground/10 backdrop-blur-sm px-6 py-3">
              <span className="text-sm text-accent-foreground/70">Prepared for</span>
              <p className="font-display text-xl font-bold text-accent-foreground">{clientName}</p>
            </div>
            <div className="rounded-xl bg-accent-foreground/10 backdrop-blur-sm px-6 py-3">
              <span className="text-sm text-accent-foreground/70">Date</span>
              <p className="font-display text-xl font-bold text-accent-foreground">{formatDate(data.date)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
