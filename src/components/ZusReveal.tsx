import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Coffee, ArrowDown } from "lucide-react";
import Logo from "@/image/Logo.webp";

/**
 * Scroll-driven "rebuild" intro for the ZUS Coffee menu page.
 *
 * First view ≈ a ZUS-style coffee/rewards app (their deep-blue vibe, the name in
 * plain text, a generic cup glyph) — a stylised *impression*, deliberately NOT a
 * copy of ZUS's logo or trademarked assets. As the visitor scrolls, it blurs,
 * fades and transforms into the Leadzap dark+gold design, landing on the real
 * (crawlable) menu content below. Framed as a friendly demonstration; the page's
 * "not affiliated with ZUS Coffee" disclaimer still applies.
 *
 * SEO note: this is a purely visual intro layered ABOVE the existing prerendered
 * content — the H1, menu, schema and links all remain in the DOM underneath.
 */
const ZusReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  // "end end" maps progress 0→1 across the whole PINNED phase, so the full scene
  // plays while the sticky child is fixed (it releases exactly at progress 1).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // ZUS skin: holds, then blurs + lifts + fades out.
  const zusOpacity = useTransform(scrollYProgress, [0.5, 0.72], [1, 0]);
  const zusScale = useTransform(scrollYProgress, [0, 0.72], [1, 1.12]);
  const zusBlurPx = useTransform(scrollYProgress, [0.3, 0.68], [0, 12]);
  const zusFilter = useMotionTemplate`blur(${zusBlurPx}px)`;

  // Mid "rebuilding" caption.
  const capOpacity = useTransform(scrollYProgress, [0.42, 0.56, 0.72], [0, 1, 0]);

  // Leadzap reveal rises over everything and holds to the end of the pin.
  const lzOpacity = useTransform(scrollYProgress, [0.6, 0.82], [0, 1]);
  const lzScale = useTransform(scrollYProgress, [0.6, 1], [0.93, 1]);

  // Initial scroll hint.
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={ref} className="relative z-[60] h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* ============ ZUS-style app skin (impression, not their logo) ============ */}
        <motion.div
          style={{ opacity: zusOpacity, scale: zusScale, filter: zusFilter }}
          className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#0a1a52] via-[#13226b] to-[#091238] text-white"
        >
          {/* soft brand swirl */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-300/10 blur-3xl" />

          <div className="mx-auto flex h-full max-w-md flex-col px-5 pt-7">
            {/* app top bar */}
            <div className="flex items-center justify-between">
              <span className="text-2xl leading-none">≡</span>
              <div className="flex items-center gap-2 font-semibold tracking-wide">
                <Coffee className="h-5 w-5" /> ZUS Coffee
              </div>
              <span className="text-xl leading-none">⟳</span>
            </div>

            {/* rewards card */}
            <div className="mt-7 rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur">
              <p className="text-sm text-white/70">Good morning ☕</p>
              <p className="mt-1 text-2xl font-bold">You have 1,240 beans</p>
              <div className="mt-4 h-2 rounded-full bg-white/15">
                <div className="h-2 w-2/3 rounded-full bg-white/80" />
              </div>
              <p className="mt-2 text-xs text-white/60">260 beans to your next free drink</p>
            </div>

            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-white/70 ring-1 ring-white/10">
              ⭐ Members get 1.5× beans this week
            </div>

            <p className="mt-6 text-xs uppercase tracking-widest text-white/50">Order</p>
            <div className="mt-2 space-y-2">
              {["Spanish Latte", "Café Mocha", "Java Chip Frappé"].map((n) => (
                <div
                  key={n}
                  className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10"
                >
                  <span>{n}</span>
                  <span className="text-white/50">›</span>
                </div>
              ))}
            </div>

            {/* easter egg: nodding at their 19.5s load */}
            <p className="mt-5 flex items-center gap-2 text-[11px] text-white/40">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/25 border-t-white/70" />
              loading menu… (19.5s)
            </p>
          </div>
        </motion.div>

        {/* ============ "rebuilding" caption ============ */}
        <motion.div
          style={{ opacity: capOpacity }}
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6"
        >
          <p className="text-center font-display text-2xl font-bold leading-snug text-white drop-shadow-lg md:text-4xl">
            Now watch a marketing agency
            <br />
            rebuild it as you scroll…
          </p>
        </motion.div>

        {/* ============ Leadzap reveal ============ */}
        <motion.div
          style={{ opacity: lzOpacity, scale: lzScale }}
          className="absolute inset-0 z-20 grid place-items-center bg-[#121212]"
        >
          <div className="px-6 text-center">
            <img src={Logo} alt="Leadzap Marketing" className="mx-auto h-10 md:h-12" />
            <h2 className="mt-7 font-display text-3xl font-bold text-foreground md:text-5xl">
              So we <span className="text-accent">rebuilt it.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              The whole ZUS menu — a few KB, loads instantly, on a marketing agency's website. Ranking above ZUS's own.
            </p>
            <div className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-accent">
              keep scrolling <ArrowDown className="h-4 w-4 animate-bounce" />
            </div>
          </div>
        </motion.div>

        {/* ============ initial scroll hint ============ */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-1 text-white/80"
        >
          <span className="text-[11px] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown className="h-5 w-5 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};

export default ZusReveal;
