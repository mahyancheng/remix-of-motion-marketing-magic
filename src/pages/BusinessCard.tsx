import { motion } from "framer-motion";
import { Mail, Phone, Globe, MapPin } from "lucide-react";

const BusinessCard = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-10">
      <div className="text-center max-w-2xl">
        <span className="inline-block px-4 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
          Business Card Preview
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3">
          Mah Yan Cheng · Director
        </h1>
        <p className="text-muted-foreground">
          Live preview rendered on the site's animated dithering background.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* FRONT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[1.75/1] rounded-2xl overflow-hidden border border-accent/20 shadow-2xl shadow-accent/10 bg-background/40 backdrop-blur-md"
        >
          {/* Glow */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-5 shadow-lg shadow-accent/40">
              <span className="text-background font-black text-2xl">L</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              LEADZAP
            </h2>
            <p className="text-accent text-xs font-semibold tracking-[0.3em] mt-1">
              MARKETING
            </p>
            <div className="mt-6 h-px w-16 bg-accent/40" />
            <p className="mt-4 text-[10px] md:text-xs text-muted-foreground tracking-[0.25em] uppercase">
              Digital Marketing · SEO · Ads · Software
            </p>
          </div>
        </motion.div>

        {/* BACK */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative aspect-[1.75/1] rounded-2xl overflow-hidden border border-accent/20 shadow-2xl shadow-accent/10 bg-background/40 backdrop-blur-md"
        >
          <div className="absolute top-1/2 -right-24 -translate-y-1/2 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight">
                Mah Yan Cheng
              </h3>
              <p className="text-accent text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mt-1">
                Director
              </p>
            </div>

            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex items-center gap-2.5 text-foreground/90">
                <Phone className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>011-1133 5119</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/90">
                <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>yc@leadzap.com.my</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/90">
                <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>www.leadzap.com.my</span>
              </div>
              <div className="flex items-start gap-2.5 text-foreground/70 pt-1">
                <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <span className="text-[10px] md:text-xs">
                  Leadzap Marketing Sdn Bhd
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground/70 max-w-md text-center">
        The animated background you see behind these cards is the same WebGL
        dithering effect used across the site.
      </p>
    </main>
  );
};

export default BusinessCard;
