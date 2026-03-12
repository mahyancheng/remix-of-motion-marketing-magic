import { FallingPattern } from "@/components/ui/falling-pattern";

/**
 * Shared hero background decoration with gradient blobs.
 * Place inside any `hero-gradient relative overflow-hidden` section.
 */
const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
  </div>
);

export default HeroBackground;