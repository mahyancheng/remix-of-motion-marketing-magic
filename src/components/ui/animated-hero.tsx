import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover"; // 确保路径正确
import { Link } from "react-router-dom";

interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface AnimatedHeroProps {
  badge?: string;
  titlePrefix?: string;
  rotatingWords?: string[];
  description?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  breadcrumbs?: BreadcrumbEntry[];
}

const DEFAULT_WORDS = ["automating", "scaling", "winning", "growing", "thriving"];
const DEFAULT_PRIMARY = { label: "Get Free Consultation", href: "/contact/" };
const DEFAULT_SECONDARY = { label: "See How It Works", href: "/custom-software/" };

export function AnimatedHero({
  badge = "We build systems that print money",
  titlePrefix = "Your competitors are",
  rotatingWords = DEFAULT_WORDS,
  description = "Every hour your team wastes on manual processes is an hour your competitor uses to serve more customers, make fewer errors, and grow faster. We build custom software that ends the chaos.",
  primaryCTA = DEFAULT_PRIMARY,
  secondaryCTA = DEFAULT_SECONDARY,
  breadcrumbs,
}: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTitleNumber((prev) => (prev + 1) % rotatingWords.length);
    }, 1200);
    return () => clearInterval(intervalId);
  }, [rotatingWords.length]); 

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col w-full min-w-0">
          
          {/* Breadcrumb */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="breadcrumb" className="w-full max-w-2xl">
              <ol className="flex flex-wrap items-center gap-2 text-sm md:text-base text-accent/80 justify-center font-medium">
                <li><Link to="/" className="hover:text-accent transition-colors underline-offset-4 hover:underline">Home</Link></li>
                {breadcrumbs.map((item, i) => (
                  <li key={i} className="inline-flex items-center gap-2">
                    <span className="text-accent/40">/</span>
                    {item.href ? (
                      <Link to={item.href} className="hover:text-accent transition-colors underline-offset-4 hover:underline">{item.label}</Link>
                    ) : (
                      <span className="text-foreground font-semibold">{item.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Badge 部分 */}
          <div className="w-full max-w-full min-w-0 flex justify-center px-4">
            <Button
              variant="secondary"
              size="sm"
              className="h-auto min-h-9 max-w-full w-full gap-2 py-2.5 rounded-full sm:w-auto px-6 cursor-default hover:bg-secondary whitespace-normal text-center"
            >
              <span className="break-words font-medium text-xs sm:text-sm leading-snug">{badge}</span>
              <SparklesIcon className="h-4 w-4 shrink-0 text-accent" />
            </Button>
          </div>
          
          {/* Main Title Area */}
          <div className="flex gap-2 flex-col items-center w-full min-w-0">
            <h1 className="text-3xl sm:text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-black flex flex-col items-center leading-tight w-full min-w-0">
              
              <span className="text-accent break-words">{titlePrefix}</span>
              
              <span className="relative inline-flex items-center justify-center overflow-hidden w-full h-[1.2em] md:h-[1.2em]">
                &nbsp;
                <AnimatePresence mode="wait">
                  <motion.span
                    key={titleNumber}
                    className="absolute font-semibold text-foreground text-xl sm:text-3xl md:text-5xl tracking-normal whitespace-nowrap pointer-events-none"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{
                      y: { type: "spring", stiffness: 350, damping: 25 },
                      opacity: { duration: 0.2 },
                    }}
                  >
                    {rotatingWords[titleNumber].toUpperCase()}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className="text-base md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mt-4 px-2">
              {description}
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center mt-6 px-4">
            <Link to={secondaryCTA.href} className="w-full sm:w-auto">
              <Button size="xl" className="gap-2 w-full sm:w-auto text-sm sm:text-base whitespace-normal h-auto min-h-[3rem]" variant="outline">
                {secondaryCTA.label} <MoveRight className="w-4 h-4 shrink-0" />
              </Button>
            </Link>
            <Link to={primaryCTA.href} className="w-full sm:w-auto">
              <Cover variant="button">
                <Button size="xl" className="gap-2 w-full sm:w-auto text-sm sm:text-base whitespace-normal h-auto min-h-[3rem]">
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  {primaryCTA.label}
                </Button>
              </Cover>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}