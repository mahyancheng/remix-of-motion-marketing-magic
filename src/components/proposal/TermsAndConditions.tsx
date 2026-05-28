 import { FileText } from 'lucide-react';
 
 interface TermsAndConditionsProps {
   contractMonths?: number;
 }
 
 export const TermsAndConditions = ({ contractMonths = 3 }: TermsAndConditionsProps) => {
   const terms = [
     {
       title: 'Exclusions',
       content: 'All management fees exclude Ads Budget. The client is responsible for paying Google and Meta directly for advertising spend.'
     },
     {
       title: 'Service Commencement',
       content: 'Digital marketing services officially begin upon receipt of first payment and onboarding completion.'
     },
     {
       title: 'Payment Terms',
       content: 'Invoices are issued monthly. Payment is due within 14 days of the invoice date.'
     },
     {
       title: 'Validity',
       content: 'This quotation is valid for 30 days from the date of issuance.'
     },
     {
       title: 'Contract Duration',
       content: `This agreement is for an initial period of ${contractMonths} month${contractMonths > 1 ? 's' : ''}, after which it may be renewed or terminated with 30 days written notice.`
     },
     {
       title: 'Intellectual Property',
       content: 'All campaign assets, ad creatives, and content created during the engagement remain the property of the client upon full payment.'
     },
     {
       title: 'Confidentiality',
       content: 'Both parties agree to maintain confidentiality of all business information shared during the engagement.'
     }
   ];
 
   return (
     <section className="space-y-6">
       <div className="mb-8">
         <div className="flex items-center gap-4">
           <span className="flex h-12 w-12 items-center justify-center rounded-2xl accent-gradient font-display text-lg font-bold text-accent-foreground shadow-glow">
             <FileText className="h-6 w-6" />
           </span>
           <div>
             <h3 className="font-display text-2xl font-bold text-foreground">Terms & Conditions</h3>
             <p className="text-sm text-muted-foreground mt-1">Please review the following terms carefully</p>
           </div>
         </div>
       </div>
 
       <div className="rounded-2xl border border-accent/30 bg-accent/5 overflow-hidden">
         {/* Header */}
         <div className="bg-accent/20 px-6 py-3 border-b border-accent/30">
           <h4 className="font-display font-bold text-foreground text-center">Terms & Conditions</h4>
         </div>
         
         {/* Terms List */}
         <div className="p-6 space-y-4">
           {terms.map((term, index) => (
             <div key={index}>
               <p className="text-foreground">
                 <span className="font-bold">{index + 1}. {term.title}:</span>
               </p>
               <p className="text-muted-foreground mt-1">{term.content}</p>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
 };