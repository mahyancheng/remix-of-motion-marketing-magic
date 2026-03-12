import { AnimatedHero } from "@/components/ui/animated-hero";

const Hero = () => {
  return (
    <header className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
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