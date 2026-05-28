 import { PenLine } from 'lucide-react';
 import { ProposalData } from '@/types/proposal';
 
 interface CustomerAcceptanceProps {
   data: ProposalData;
   formatDate: (dateStr: string) => string;
 }
 
 export const CustomerAcceptance = ({ data, formatDate }: CustomerAcceptanceProps) => {
   return (
     <section className="space-y-6">
       <div className="mb-8">
         <div className="flex items-center gap-4">
           <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
             <PenLine className="h-6 w-6" />
           </span>
           <div>
             <h3 className="font-display text-2xl font-bold text-foreground">Customer Acceptance</h3>
             <p className="text-sm text-muted-foreground mt-1">Please sign below to confirm your acceptance</p>
           </div>
         </div>
       </div>
 
       <div className="rounded-2xl border border-accent/30 bg-accent/5 overflow-hidden">
         {/* Header */}
         <div className="bg-accent/20 px-6 py-3 border-b border-accent/30">
           <h4 className="font-display font-bold text-foreground text-center">Customer Acceptance</h4>
         </div>
         
         {/* Acceptance Text */}
         <div className="p-6 space-y-8">
           <p className="text-muted-foreground leading-relaxed">
             We hereby confirm acceptance of this quotation and agree to proceed with the order based on the terms and 
             conditions stated herein. This signed quotation shall serve as confirmation of order in lieu of an official 
             Purchase Order (PO).
           </p>
 
          {/* Signature Section */}
          <div className="max-w-xl mx-auto">
            {/* Client Signature */}
            <div className="space-y-6">
              <h5 className="font-display font-bold text-foreground border-b border-border pb-2">
                Client
              </h5>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Company Stamp & Signature:</p>
                  <div className="h-24 border-b-2 border-dashed border-muted-foreground/30" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Name:</p>
                    <div className="h-8 border-b border-muted-foreground/30">
                      <span className="text-foreground">{data.clientName || ''}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Designation:</p>
                    <div className="h-8 border-b border-muted-foreground/30" />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Date:</p>
                  <div className="h-8 border-b border-muted-foreground/30 w-48" />
                </div>
              </div>
            </div>
          </div>
         </div>
       </div>
 
       {/* Footer Note */}
       <p className="text-xs text-muted-foreground text-center italic">
         Please return a signed copy of this quotation to confirm your acceptance. 
         This quotation is valid for 30 days from the date of issuance.
       </p>
     </section>
   );
 };