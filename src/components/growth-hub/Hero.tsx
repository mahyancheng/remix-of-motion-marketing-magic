import { AnimatedHero } from "@/components/ui/animated-hero";
import HeroBackground from "@/components/HeroBackground";

const Hero = () => {
  return (
    <header className="hero-gradient relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10">
        <AnimatedHero
          badge="One-Stop Digital Marketing Solution"
          titlePrefix="Drive measurable growth with"
          rotatingWords={["performance marketing", "paid ads", "SEO & GEO", "social media", "data-driven strategy"]}
          description="We focus on leads and e-commerce sales. Combining fast channels (paid ads) with compounding channels (SEO) so your business gets immediate enquiries and long-term growth."
          primaryCTA={{ label: "Get Started", href: "/contact" }}
          secondaryCTA={{ label: "View Packages", href: "/growth-hub#packages" }}
        />
      </div>
    </header>
  );
};

export default Hero;