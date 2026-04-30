import { motion } from "framer-motion";
import { Mail, Phone, Globe } from "lucide-react";
import logo from "@/image/Logo.webp";
import { CardSmokeBackground } from "@/components/ui/card-smoke-background";

/**
 * Business card preview page.
 * Each card embeds its OWN smoke animation (rendered inside the card surface),
 * so the card itself is "alive" — perfect for an Apple Wallet-style animated card.
 *
 * NOTE: SmokeBackground uses position:fixed internally, so to scope it inside
 * a card we wrap it in a relative container with overflow-hidden. We override
 * its fixed positioning with absolute via Tailwind's [&>*] selector below.
 */
const BusinessCard = () => {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-10">
      <div className="text-center max-w-2xl">
        <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
          Business Card Preview
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3">
          Mah Yan Cheng · Director
        </h1>
        <p className="text-muted-foreground">
          Animated card surface — designed for Apple Wallet-style scan & share.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* FRONT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="group relative aspect-[1.75/1] rounded-2xl overflow-hidden border border-accent/30 shadow-2xl shadow-accent/20 bg-background isolate [&>canvas]:!absolute [&>canvas]:!inset-0 [&>canvas]:!w-full [&>canvas]:!h-full"
        >
          {/* Smoke animation locked inside the card */}
          <CardSmokeBackground smokeColor="#fcd200" />
          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-background/55 z-[1] pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
            <img
              src={logo}
              alt="Leadzap Marketing logo"
              className="h-16 md:h-20 w-auto object-contain mb-5 drop-shadow-[0_0_24px_rgba(252,210,0,0.55)]"
            />
            <div className="h-px w-16 bg-accent/50" />
            <p className="mt-4 text-[10px] md:text-xs text-foreground/80 tracking-[0.25em] uppercase">
              Digital Marketing · SEO · Ads · Software
            </p>
          </div>
        </motion.div>

        {/* BACK */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="group relative aspect-[1.75/1] rounded-2xl overflow-hidden border border-accent/30 shadow-2xl shadow-accent/20 bg-background isolate [&>canvas]:!absolute [&>canvas]:!inset-0 [&>canvas]:!w-full [&>canvas]:!h-full"
        >
          <CardSmokeBackground smokeColor="#fcd200" />
          <div className="absolute inset-0 bg-background/65 z-[1] pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight">
                  Mah Yan Cheng
                </h3>
                <p className="text-accent text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mt-1">
                  Director
                </p>
              </div>
              <img
                src={logo}
                alt="Leadzap"
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>

            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2.5 text-foreground/95">
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>011-1133 5119</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/95">
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>yc@leadzap.com.my</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/95">
                <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>www.leadzap.com.my</span>
              </div>
              <p className="pt-1 text-[10px] md:text-xs text-foreground/60">
                Leadzap Marketing Sdn Bhd
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground/70 max-w-md text-center">
        Each card has its own live smoke animation — ready for an Apple Wallet
        scan-and-share experience.
      </p>
    </main>
  );
};

export default BusinessCard;
