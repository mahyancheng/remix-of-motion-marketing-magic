import { motion } from "framer-motion";
import { AlertTriangle, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeroProps {
  subtitle?: string;
}

const CustomSoftwareHero = ({ subtitle }: HeroProps) => {
  return (
    <header className="hero-gradient relative overflow-hidden pt-24 lg:pt-32 pb-10 lg:pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center">
        <motion.div
          className="lg:w-3/5 mb-4 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-primary-foreground/80">Still running your business on spreadsheets?</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-primary-foreground">
            Your Competitor Just Automated Their Entire Operation — <span className="text-gradient">You're Still Copy-Pasting</span>
          </h1>
          <p className="text-md md:text-xl text-primary-foreground/70 mb-6">
            Every hour your team wastes on manual processes is an hour your competitor uses to serve more customers, make fewer errors, and grow faster. We're a software development company in Malaysia that builds custom software development solutions to end the chaos.
          </p>
          {subtitle && (
            <p className="text-base text-primary-foreground/60 max-w-3xl mb-6">{subtitle}</p>
          )}
          <Link to="/contact">
            <Button variant="hero" size="xl">
              <Flame className="mr-2 h-5 w-5" />
              Get a Free Software Consultation
            </Button>
          </Link>
        </motion.div>
        <motion.div
          className="lg:w-2/5"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-card m-6 md:m-10">
            <h2 className="text-xl font-display font-semibold mb-4 text-destructive">⚠️ The Real Cost of Manual Processes</h2>
            <div className="space-y-3">
              {[
                { stat: "23 hrs/week", desc: "wasted on tasks that should be automated" },
                { stat: "RM15K+", desc: "monthly cost of human errors and rework" },
                { stat: "3x slower", desc: "growth vs competitors with custom systems" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-accent min-w-[100px]">{item.stat}</span>
                  <span className="text-sm text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default CustomSoftwareHero;
