import { motion } from "framer-motion";
import { Zap } from "lucide-react";

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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/80">Custom Software</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6 text-primary-foreground">
            Custom Software Development Solutions in <span className="text-gradient">Malaysia</span>
          </h1>
          <p className="text-md md:text-xl text-primary-foreground/70 mb-8">
            We are a software development company in Malaysia delivering efficient custom software development services and custom business systems for cost optimization and growth.
          </p>
          {subtitle && (
            <p className="text-base text-primary-foreground/60 max-w-3xl">{subtitle}</p>
          )}
        </motion.div>
        <motion.div
          className="lg:w-2/5"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card hover:border-accent/50 transition-all duration-300 m-6 md:m-10">
            <h2 className="text-xl font-display font-semibold mb-2 text-accent">Why choose our software development company?</h2>
            <p className="text-muted-foreground">
              As a trusted software provider, we build scalable custom software and business automation software tailored to your workflows.
            </p>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default CustomSoftwareHero;
