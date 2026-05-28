import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { StatusTone, TONE_DOT } from '@/GrowtLib/statusColors';

interface Props {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: StatusTone;
  hint?: string;
  highlight?: number; // e.g. high priority count
  highlightLabel?: string;
  onClick?: () => void;
}

export function KPICard({ label, value, icon: Icon, tone, hint, highlight, highlightLabel, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className={`p-4 border-border bg-card hover:border-accent/40 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${TONE_DOT[tone]}`} />
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-foreground leading-none">{value}</span>
        {highlight !== undefined && highlight > 0 && (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px]">
            {highlight} {highlightLabel}
          </Badge>
        )}
      </div>
      {hint && <p className="text-[11px] text-muted-foreground mt-2">{hint}</p>}
    </Card>
  );
}
