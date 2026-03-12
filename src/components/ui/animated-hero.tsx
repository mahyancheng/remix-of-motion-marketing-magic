import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { Link } from "react-router-dom";

interface AnimatedHeroProps {
  badge?: string;
  titlePrefix?: string;
  rotatingWords?: string[];
  description?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

function AnimatedHero({
  badge = "We build systems that print money",
  titlePrefix = "Your competitors are",
  rotatingWords = ["automating", "scaling", "winning", "growing", "thriving"],
  description = "Every hour your team wastes on manual processes is an hour your competitor uses to serve more customers, make fewer errors, and grow faster. We build custom software that ends the chaos.",
  primaryCTA = { label: "Get Free Consultation", href: "/contact" },
  secondaryCTA = { label: "See How It Works", href: "/customer-software-demo" },
}: AnimatedHeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === rotatingWords.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, rotatingWords]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              {badge} <PhoneCall className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-bold">
              <span className="text-accent">{titlePrefix}</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                <AnimatePresence mode="wait">
                  {rotatingWords.map((word, index) => (
                    titleNumber === index && (
                      <motion.span
                        key={word}
                        className="absolute font-semibold text-foreground"
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{
                          y: { type: "spring", stiffness: 200, damping: 25 },
                          opacity: { duration: 0.3 },
                        }}
                      >
                        {word}
                      </motion.span>
                    )
                  ))}
                </AnimatePresence>
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              {description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
            <Link to={secondaryCTA.href} className="w-full sm:w-auto">
              <Button size="lg" className="gap-4 w-full sm:w-auto" variant="outline">
                {secondaryCTA.label} <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to={primaryCTA.href} className="w-full sm:w-auto">
              <Cover variant="button">
                <Button size="lg" className="gap-4 w-full sm:w-auto">
                  {primaryCTA.label} <PhoneCall className="w-4 h-4" />
                </Button>
              </Cover>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AnimatedHero };
