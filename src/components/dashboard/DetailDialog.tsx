import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  FileText, Calendar, Tag, Paperclip, MoreHorizontal, Plus, ArrowRight,
  Edit2, X, Image as ImageIcon, Loader2, Trash2, ClipboardList, AlertTriangle,
  CheckCircle2, Clock, Briefcase,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DetailDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  kind: 'task' | 'issue';
  title: string;
  status: string;
  statusOptions: string[];
  priority?: string;
  priorityOptions?: string[];
  description?: string | null;
  pow: string;
  breadcrumbs: { label: string; href?: string }[];
  meta: { label: string; value: string; icon?: React.ReactNode }[];
  tags?: { label: string; tone?: 'default' | 'secondary' | 'destructive' | 'outline' }[];
  storagePath: string; // e.g. `pow/tasks/<id>` or `pow/issues/<id>`
  onStatusChange: (status: string) => void;
  onPriorityChange?: (priority: string) => void;
  onPowChange: (pow: string) => void;
  onDelete: () => void;
}

const statusBadge = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('done') || s.includes('resolved') || s.includes('closed') || s.includes('completed'))
    return 'bg-green-500/15 text-green-400 border-green-500/30';
  if (s.includes('progress')) return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
  if (s.includes('open')) return 'bg-destructive/15 text-destructive border-destructive/30';
  if (s.includes('review')) return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  return 'bg-muted text-muted-foreground border-border';
};

const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

export function DetailDialog(props: DetailDialogProps) {
  const {
    open, onOpenChange, kind, title, status, statusOptions, priority, priorityOptions,
    description, pow, breadcrumbs, meta, tags = [], storagePath,
    onStatusChange, onPriorityChange, onPowChange, onDelete,
  } = props;

  const [editPow, setEditPow] = useState('');
  const [isEditingPow, setIsEditingPow] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${storagePath}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('pow-attachments').upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('pow-attachments').getPublicUrl(path);
      const newPow = pow + (pow ? '\n' : '') + `![POW Image](${urlData.publicUrl})`;
      onPowChange(newPow);
      toast({ title: 'Image uploaded' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [storagePath, pow, onPowChange]);

  // Parse POW into image attachments + text
  const lines = pow ? pow.split('\n') : [];
  const attachments = lines
    .map(l => l.match(/!\[.*?\]\((.*?)\)/))
    .filter(Boolean)
    .map((m, i) => ({ url: m![1], name: `Attachment ${i + 1}` }));
  const textLines = lines.filter(l => !l.match(/!\[.*?\]\(.*?\)/));

  const KindIcon = kind === 'task' ? ClipboardList : AlertTriangle;
  const kindLabel = kind === 'task' ? 'Task' : 'Issue';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-card border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="p-6 space-y-6"
        >
          {/* Header: Breadcrumbs + actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <KindIcon className="h-3.5 w-3.5" />
              <span>{kindLabel}</span>
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span>/</span>
                  <span className={i === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
                    {b.label}
                  </span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
          </div>

          {/* Meta Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-y border-border py-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                <Select value={status} onValueChange={onStatusChange}>
                  <SelectTrigger className={`h-8 text-xs w-fit min-w-[140px] border ${statusBadge(status)}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => <SelectItem key={s} value={s}>{fmt(s)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {priority && priorityOptions && onPriorityChange && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Priority</p>
                  <Select value={priority} onValueChange={onPriorityChange}>
                    <SelectTrigger className="h-8 text-xs w-fit min-w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(p => <SelectItem key={p} value={p}>{fmt(p)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {meta.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="text-muted-foreground mt-0.5">{m.icon || <Calendar className="h-4 w-4" />}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-sm text-foreground truncate">{m.value}</p>
                </div>
              </div>
            ))}

            {tags.length > 0 && (
              <div className="flex items-start gap-3 md:col-span-2">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t, i) => <Badge key={i} variant={t.tone || 'secondary'} className="text-[10px]">{t.label}</Badge>)}
                  </div>
                </div>
              </div>
            )}

            {description && (
              <div className="flex items-start gap-3 md:col-span-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground/90 leading-relaxed">{description}</p>
                </div>
              </div>
            )}
          </div>

          {/* POW Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">
                  Proof of Work {kind === 'issue' ? '/ Resolution' : ''}
                </h3>
                {attachments.length > 0 && (
                  <Badge variant="outline" className="text-[10px]">{attachments.length}</Badge>
                )}
              </div>
              <div className="flex gap-1">
                <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => fileRef.current?.click()} disabled={isUploading}>
                  {isUploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
                  Add Image
                </Button>
                {!isEditingPow && (
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setEditPow(pow); setIsEditingPow(true); }}>
                    <Edit2 className="h-3 w-3" /> Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Attachments grid */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {attachments.map((a, i) => (
                  <a key={i} href={a.url} target="_blank" rel="noreferrer" className="block group relative rounded-lg overflow-hidden border border-border bg-secondary/20 aspect-video">
                    <img src={a.url} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2">
                      <span className="text-[10px] text-white opacity-0 group-hover:opacity-100">{a.name}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Notes/Text content */}
            {isEditingPow ? (
              <div className="space-y-2">
                <Textarea
                  value={editPow}
                  onChange={e => setEditPow(e.target.value)}
                  className="text-sm min-h-[120px]"
                  placeholder={kind === 'issue' ? 'Describe the resolution or proof of work...' : 'Describe the proof of work...'}
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingPow(false)}>Cancel</Button>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { onPowChange(editPow); setIsEditingPow(false); }}>
                    Save
                  </Button>
                </div>
              </div>
            ) : textLines.filter(l => l.trim()).length > 0 ? (
              <div className="bg-secondary/30 rounded-lg p-3 text-sm text-foreground/90 space-y-1">
                {textLines.map((l, i) => l.trim() ? <p key={i}>{l}</p> : null)}
              </div>
            ) : attachments.length === 0 ? (
              <div className="bg-secondary/20 rounded-lg p-6 text-center text-sm text-muted-foreground italic border border-dashed border-border">
                No proof of work recorded yet. Click "Add Image" or "Edit" to start.
              </div>
            ) : null}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
