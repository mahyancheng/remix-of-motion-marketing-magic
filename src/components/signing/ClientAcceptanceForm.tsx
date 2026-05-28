import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SignaturePad } from './SignaturePad';
import { Upload, Check, Loader2 } from 'lucide-react';
import { toast } from '@/GrowHubHooks/use-toast';

interface ClientAcceptanceFormProps {
  token: string;
  clientName?: string;
  onSuccess: (signatureInfo: {
    signer_name: string;
    signer_designation: string | null;
    signature_data: string;
    stamp_url: string | null;
    signed_at: string;
  }) => void;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const i = res.indexOf(',');
      resolve(i >= 0 ? res.slice(i + 1) : res);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const ClientAcceptanceForm = ({ token, clientName, onSuccess }: ClientAcceptanceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);
  const [stampPreview, setStampPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    agreeToTerms: false,
  });

  const handleStampUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
      if (!allowed.includes(file.type)) {
        toast({ variant: 'destructive', title: 'Invalid file type', description: 'Please upload a PNG, JPG, WEBP, or GIF image.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'File too large', description: 'Company stamp image must be less than 5MB' });
        return;
      }
      setStampFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setStampPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signatureData) {
      toast({ variant: 'destructive', title: 'Signature required', description: 'Please sign the document before submitting' });
      return;
    }
    if (!formData.agreeToTerms) {
      toast({ variant: 'destructive', title: 'Agreement required', description: 'Please agree to the terms and conditions' });
      return;
    }
    if (!formData.name.trim()) {
      toast({ variant: 'destructive', title: 'Name required', description: 'Please enter your name' });
      return;
    }

    setIsSubmitting(true);

    try {
      let stampPayload: { base64: string; mime: string } | null = null;
      if (stampFile) {
        stampPayload = { base64: await fileToBase64(stampFile), mime: stampFile.type };
      }

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/public-proposal-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: 'sign',
          token,
          signer_name: formData.name.trim(),
          signer_designation: formData.designation.trim() || null,
          signer_email: formData.email.trim() || null,
          signature_data: signatureData,
          stamp: stampPayload,
        }),
      });

      const result = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(result?.error || 'Submission failed');

      toast({ title: 'Quotation Accepted', description: 'Your acceptance has been recorded successfully.' });

      onSuccess({
        signer_name: formData.name.trim(),
        signer_designation: formData.designation.trim() || null,
        signature_data: signatureData,
        stamp_url: result.stamp_url || null,
        signed_at: result.signed_at || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error submitting signature:', error);
      toast({ variant: 'destructive', title: 'Submission failed', description: 'Could not submit your acceptance. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

   return (
     <form onSubmit={handleSubmit} className="space-y-6">
       {/* Signature */}
       <div className="space-y-2">
         <Label className="text-foreground font-semibold">Signature *</Label>
         <SignaturePad onSignatureChange={setSignatureData} />
       </div>
 
       {/* Company Stamp Upload */}
       <div className="space-y-2">
         <Label className="text-foreground font-semibold">Company Stamp (Optional)</Label>
         <div className="flex items-center gap-4">
           <label className="flex-1 cursor-pointer">
             <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-secondary/50 p-4 hover:bg-secondary transition-colors">
               {stampPreview ? (
                 <img src={stampPreview} alt="Company stamp" className="max-h-20 object-contain" />
               ) : (
                 <>
                   <Upload className="h-5 w-5 text-muted-foreground" />
                   <span className="text-sm text-muted-foreground">Upload stamp image</span>
                 </>
               )}
             </div>
             <input
               type="file"
               accept="image/*"
               onChange={handleStampUpload}
               className="hidden"
             />
           </label>
           {stampPreview && (
             <Button
               type="button"
               variant="ghost"
               size="sm"
               onClick={() => {
                 setStampFile(null);
                 setStampPreview(null);
               }}
             >
               Remove
             </Button>
           )}
         </div>
       </div>
 
       {/* Form Fields */}
       <div className="grid gap-4 sm:grid-cols-2">
         <div className="space-y-2">
           <Label htmlFor="name" className="text-foreground font-semibold">Full Name *</Label>
           <Input
             id="name"
             value={formData.name}
             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
             placeholder="Enter your full name"
             required
           />
         </div>
         <div className="space-y-2">
           <Label htmlFor="designation" className="text-foreground font-semibold">Designation</Label>
           <Input
             id="designation"
             value={formData.designation}
             onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
             placeholder="e.g. Managing Director"
           />
         </div>
       </div>
 
       <div className="space-y-2">
         <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
         <Input
           id="email"
           type="email"
           value={formData.email}
           onChange={(e) => setFormData({ ...formData, email: e.target.value })}
           placeholder="Enter your email for confirmation"
         />
       </div>
 
       {/* Agreement Checkbox */}
       <div className="flex items-start gap-3 rounded-lg bg-accent/10 p-4 border border-accent/20">
         <Checkbox
           id="terms"
           checked={formData.agreeToTerms}
           onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
           className="mt-1"
         />
         <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
           I hereby confirm acceptance of this quotation and agree to proceed with the order based on the terms and 
           conditions stated herein. This signed quotation shall serve as confirmation of order in lieu of an official 
           Purchase Order (PO).
         </Label>
       </div>
 
       {/* Submit Button */}
       <Button
         type="submit"
         className="w-full accent-gradient text-accent-foreground font-semibold"
         disabled={isSubmitting || !signatureData || !formData.agreeToTerms}
       >
         {isSubmitting ? (
           <>
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
             Submitting...
           </>
         ) : (
           <>
             <Check className="mr-2 h-4 w-4" />
             Accept & Sign Quotation
           </>
         )}
       </Button>
     </form>
   );
 };