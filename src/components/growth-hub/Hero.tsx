import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Target, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 opacity-0">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-primary-foreground/80">
            One-Stop Digital Marketing Solution
          </span>
        </div>

        <h1 className="animate-fade-up stagger-1 mb-6 max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground opacity-0 md:text-5xl lg:text-6xl xl:text-7xl">
          Drive <span className="text-gradient">Measurable Growth</span> with
          <br className="hidden md:block" /> Performance Marketing
        </h1>

        <p className="animate-fade-up stagger-2 mb-10 max-w-2xl text-lg text-primary-foreground/70 opacity-0 md:text-xl">
          We focus on leads and e-commerce sales. Combining fast channels (paid ads)
          with compounding channels (SEO) so your business gets immediate enquiries
          and long-term growth.
        </p>

        <div className="animate-fade-up stagger-3 mb-16 flex flex-col gap-4 opacity-0 sm:flex-row">
          <Button
            variant="hero"
            size="xl"
            onClick={() => navigate('/contact')}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Get Started
          </Button>
          <Button
            variant="hero-outline"
            size="xl"
            onClick={() => scrollToSection("packages")}
          >
            View Packages
          </Button>
        </div>

        <div className="animate-fade-up stagger-4 grid grid-cols-1 gap-8 opacity-0 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-accent">
              <Target className="h-5 w-5" />
              <span className="text-3xl font-bold text-primary-foreground">2-3%</span>
            </div>
            <span className="text-sm text-primary-foreground/60">Typical Conversion Rate</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp className="h-5 w-5" />
              <span className="text-3xl font-bold text-primary-foreground">15-25%</span>
            </div>
            <span className="text-sm text-primary-foreground/60">Recommended Marketing Budget</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-accent">
              <Zap className="h-5 w-5" />
              <span className="text-3xl font-bold text-primary-foreground">3 Phase</span>
            </div>
            <span className="text-sm text-primary-foreground/60">Delivery Model</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary-foreground/30 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;