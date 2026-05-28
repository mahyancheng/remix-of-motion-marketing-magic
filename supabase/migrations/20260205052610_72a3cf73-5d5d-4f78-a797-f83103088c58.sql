-- Remove expiry for signed proposals - they should be stored permanently
-- When a proposal is signed, clear the expiry date
CREATE OR REPLACE FUNCTION public.clear_expiry_on_sign()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_signed = true AND OLD.is_signed = false THEN
    NEW.expires_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to clear expiry when signed
CREATE TRIGGER clear_expiry_on_sign_trigger
BEFORE UPDATE ON public.proposal_shares
FOR EACH ROW
EXECUTE FUNCTION public.clear_expiry_on_sign();