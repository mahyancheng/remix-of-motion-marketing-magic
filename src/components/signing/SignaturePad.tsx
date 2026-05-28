 import { useRef, useEffect, useState } from 'react';
 import SignaturePadLib from 'signature_pad';
 import { Button } from '@/components/ui/button';
 import { Eraser, RotateCcw } from 'lucide-react';
 
 interface SignaturePadProps {
   onSignatureChange: (signatureData: string | null) => void;
 }
 
 export const SignaturePad = ({ onSignatureChange }: SignaturePadProps) => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const signaturePadRef = useRef<SignaturePadLib | null>(null);
   const [isEmpty, setIsEmpty] = useState(true);
 
   useEffect(() => {
     if (canvasRef.current) {
       signaturePadRef.current = new SignaturePadLib(canvasRef.current, {
         backgroundColor: 'rgb(255, 255, 255)',
         penColor: 'rgb(0, 0, 0)',
       });
 
       // Handle canvas resize
       const resizeCanvas = () => {
         if (canvasRef.current && signaturePadRef.current) {
           const ratio = Math.max(window.devicePixelRatio || 1, 1);
           const canvas = canvasRef.current;
           canvas.width = canvas.offsetWidth * ratio;
           canvas.height = canvas.offsetHeight * ratio;
           canvas.getContext('2d')?.scale(ratio, ratio);
           signaturePadRef.current.clear();
         }
       };
 
       resizeCanvas();
       window.addEventListener('resize', resizeCanvas);
 
       // Listen for signature changes
       signaturePadRef.current.addEventListener('endStroke', () => {
         setIsEmpty(signaturePadRef.current?.isEmpty() ?? true);
         if (!signaturePadRef.current?.isEmpty()) {
           onSignatureChange(signaturePadRef.current?.toDataURL() ?? null);
         }
       });
 
       return () => {
         window.removeEventListener('resize', resizeCanvas);
         signaturePadRef.current?.off();
       };
     }
   }, [onSignatureChange]);
 
   const handleClear = () => {
     signaturePadRef.current?.clear();
     setIsEmpty(true);
     onSignatureChange(null);
   };
 
   return (
     <div className="space-y-2">
       <div className="relative rounded-lg border-2 border-dashed border-muted-foreground/30 bg-white">
         <canvas
           ref={canvasRef}
           className="w-full h-32 rounded-lg cursor-crosshair touch-none"
         />
         {isEmpty && (
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <span className="text-muted-foreground/50 text-sm">Sign here</span>
           </div>
         )}
       </div>
       <div className="flex justify-end">
         <Button
           type="button"
           variant="ghost"
           size="sm"
           onClick={handleClear}
           className="text-muted-foreground"
         >
           <RotateCcw className="h-4 w-4 mr-1" />
           Clear
         </Button>
       </div>
     </div>
   );
 };