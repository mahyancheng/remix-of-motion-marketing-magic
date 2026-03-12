import { FallingPattern } from "@/components/ui/falling-pattern";

/**
 * Shared hero background decoration with falling pattern + gradient blobs.
 * Place inside any `hero-gradient relative overflow-hidden` section.
 */
const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Falling pattern layer */}
    <div className="absolute inset-0 opacity-30">
      <FallingPattern
        color="hsl(var(--accent))"
        backgroundColor="transparent"
        duration={120}
        blurIntensity="0.8em"
        density={1}
        className="h-full w-full"
      />
    </div>
    {/* Gradient blobs */}
    <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
  </div>
);

export default HeroBackground;