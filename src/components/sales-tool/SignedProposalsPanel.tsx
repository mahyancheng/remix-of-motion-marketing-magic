 import { useState, useEffect } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Copy, ExternalLink, Check, Loader2, FileText, Calendar, User, Trash2 } from 'lucide-react';
 import { toast } from '@/GrowHubHooks/use-toast';
 import { format } from 'date-fns';
 
 interface SignedProposal {
   id: string;
   token: string;
   client_name: string | null;
   created_at: string;
   is_signed: boolean;
   signature?: {
     signer_name: string;
     signer_designation: string | null;
     signed_at: string;
   };
 }
 
 export const SignedProposalsPanel = () => {
   const [signedProposals, setSignedProposals] = useState<SignedProposal[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [copiedId, setCopiedId] = useState<string | null>(null);
   const [deletingId, setDeletingId] = useState<string | null>(null);
 
   useEffect(() => {
     fetchSignedProposals();
   }, []);
 
   const fetchSignedProposals = async () => {
     try {
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) return;
 
       // Fetch shares that are signed
       const { data: shares, error } = await supabase
         .from('proposal_shares')
         .select('id, token, client_name, created_at, is_signed')
         .eq('is_signed', true)
         .order('created_at', { ascending: false });
 
       if (error) throw error;
 
       // For each signed share, get the signature details
       const proposalsWithSignatures = await Promise.all(
         (shares || []).map(async (share) => {
           const { data: sig } = await supabase
             .from('proposal_signatures')
             .select('signer_name, signer_designation, signed_at')
             .eq('share_id', share.id)
             .single();
 
           return {
             ...share,
             signature: sig || undefined,
           };
         })
       );
 
       setSignedProposals(proposalsWithSignatures);
     } catch (error) {
       console.error('Error fetching signed proposals:', error);
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Failed to load signed proposals.',
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const copyLink = async (token: string, id: string) => {
     const url = `${window.location.origin}/signed/${token}`;
     await navigator.clipboard.writeText(url);
     setCopiedId(id);
     toast({
       title: 'Link Copied!',
       description: 'Signed proposal link copied to clipboard.',
     });
     setTimeout(() => setCopiedId(null), 2000);
   };
 
   const openProposal = (token: string) => {
     window.open(`/signed/${token}`, '_blank');
   };
 
   const deleteSignedProposal = async (id: string) => {
     if (!confirm('Are you sure you want to delete this signed proposal? This action cannot be undone.')) {
       return;
     }
     
     setDeletingId(id);
     try {
       // First delete the signature
       const { error: sigError } = await supabase
         .from('proposal_signatures')
         .delete()
         .eq('share_id', id);
       
       if (sigError) throw sigError;
       
       // Then delete the share
       const { error: shareError } = await supabase
         .from('proposal_shares')
         .delete()
         .eq('id', id);
       
       if (shareError) throw shareError;
       
       setSignedProposals(prev => prev.filter(p => p.id !== id));
       toast({
         title: 'Deleted',
         description: 'Signed proposal has been removed.',
       });
     } catch (error) {
       console.error('Error deleting signed proposal:', error);
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Failed to delete signed proposal.',
       });
     } finally {
       setDeletingId(null);
     }
   };
 
   if (isLoading) {
     return (
       <div className="flex h-full items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
       </div>
     );
   }
 
   if (signedProposals.length === 0) {
     return (
       <div className="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
         <FileText className="h-16 w-16 text-muted-foreground/50" />
         <div>
           <h3 className="font-display text-lg font-semibold text-foreground">No Signed Proposals Yet</h3>
           <p className="text-sm text-muted-foreground mt-1">
             When clients sign your proposals, they'll appear here.
           </p>
         </div>
       </div>
     );
   }
 
   return (
     <div className="h-full overflow-auto p-4">
       <div className="mb-4">
         <h2 className="font-display text-xl font-semibold text-foreground">Signed Proposals</h2>
         <p className="text-sm text-muted-foreground">View and share signed proposal documents</p>
       </div>
       
       <div className="grid gap-4">
         {signedProposals.map((proposal) => (
           <Card key={proposal.id} className="border-border bg-card">
             <CardHeader className="pb-2">
               <div className="flex items-start justify-between">
                 <CardTitle className="text-base font-medium">
                   {proposal.client_name || 'Unnamed Client'}
                 </CardTitle>
                  <Badge variant="default" className="bg-accent/20 text-accent border-accent/30">
                    Signed
                  </Badge>
               </div>
             </CardHeader>
             <CardContent className="space-y-3">
               {proposal.signature && (
                 <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                   <div className="flex items-center gap-1.5">
                     <User className="h-3.5 w-3.5" />
                     <span>{proposal.signature.signer_name}</span>
                     {proposal.signature.signer_designation && (
                       <span className="text-muted-foreground/70">
                         ({proposal.signature.signer_designation})
                       </span>
                     )}
                   </div>
                   <div className="flex items-center gap-1.5">
                     <Calendar className="h-3.5 w-3.5" />
                     <span>
                       {format(new Date(proposal.signature.signed_at), 'dd MMM yyyy, h:mm a')}
                     </span>
                   </div>
                 </div>
               )}
               
               <div className="flex gap-2 pt-2">
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => copyLink(proposal.token, proposal.id)}
                   className="flex-1"
                 >
                   {copiedId === proposal.id ? (
                     <>
                       <Check className="mr-2 h-4 w-4 text-accent" />
                       Copied!
                     </>
                   ) : (
                     <>
                       <Copy className="mr-2 h-4 w-4" />
                       Copy Link
                     </>
                   )}
                 </Button>
                 <Button
                   variant="default"
                   size="sm"
                   onClick={() => openProposal(proposal.token)}
                 >
                   <ExternalLink className="mr-2 h-4 w-4" />
                   View
                 </Button>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => deleteSignedProposal(proposal.id)}
                   disabled={deletingId === proposal.id}
                   className="text-destructive hover:text-destructive hover:bg-destructive/10"
                 >
                   {deletingId === proposal.id ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                   ) : (
                     <Trash2 className="h-4 w-4" />
                   )}
                 </Button>
               </div>
             </CardContent>
           </Card>
         ))}
       </div>
     </div>
   );
 };