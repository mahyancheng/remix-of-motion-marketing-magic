import { Button } from "@/components/ui/button";
import { Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        <a href="#" className="mb-12 font-display text-3xl font-bold text-primary-foreground">
          Leadzap<span className="text-accent">.</span>
        </a>

        <h1 className="mb-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
          Welcome to <span className="text-gradient">Leadzap</span>
        </h1>
        <p className="mb-12 max-w-xl text-lg text-primary-foreground/70">
          Sign in to continue to your workspace.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button variant="hero-outline" size="xl" onClick={() => navigate('/auth')} className="text-primary-foreground">
            <Sparkles className="mr-2 h-5 w-5" />
            Leadzap Crew Login
          </Button>
          <Button variant="hero" size="xl" onClick={() => navigate('/client/login')}>
            <Users className="mr-2 h-5 w-5" />
            Client Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
