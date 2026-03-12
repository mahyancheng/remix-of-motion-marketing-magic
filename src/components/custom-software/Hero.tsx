import { AnimatedHero } from "@/components/ui/animated-hero";
import HeroBackground from "@/components/HeroBackground";

interface HeroProps {
  subtitle?: string;
}

const CustomSoftwareHero = ({ subtitle }: HeroProps) => {
  return (
    <header className="hero-gradient relative overflow-hidden">
      <HeroBackground />
      <div className="relative z-10">
        <AnimatedHero
          badge="Still running your business on spreadsheets?"
          titlePrefix="Your competitors are"
          rotatingWords={["automating", "scaling", "winning", "growing", "thriving"]}
          description="Every hour your team wastes on manual processes is an hour your competitor uses to serve more customers, make fewer errors, and grow faster. We're a software development company in Malaysia that builds custom software development solutions to end the chaos."
          primaryCTA={{ label: "Get Free Software Consultation", href: "/contact" }}
          secondaryCTA={{ label: "See How It Works", href: "/customer-software-demo" }}
        />
      </div>
    </header>
  );
};

export default CustomSoftwareHero;
