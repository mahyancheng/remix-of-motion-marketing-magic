import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowDown, Search, Heart, Home, CreditCard, Ticket, User, Store } from "lucide-react";
import Logo from "@/image/Logo.webp";

/**
 * Scroll-driven "rebuild" intro for the ZUS Coffee menu page.
 *
 * First view ≈ a faithful recreation of ZUS's own ordering app (white UI, their
 * navy + gold palette, category rail, product grid, bottom tab bar) — a stylised
 * *impression* of the layout, deliberately NOT using ZUS's actual logo mark or
 * product photography. As the visitor scrolls, a framer-motion pinned scene
 * blurs/fades it and transforms into the Leadzap dark+gold design, handing off
 * into the real (crawlable) menu below. Framed as a friendly demonstration; the
 * page's "not affiliated with ZUS Coffee" disclaimer still applies.
 */

const NAVY = "#17226a";
const GOLD = "#a4884e";

const CATS = [
  "For You",
  "Matcha Series",
  "Chocolate",
  "CEO Series",
  "ZUS Tea Series",
  "Top Picks",
  "Crème Series",
  "Coconut Series",
];

// Our real cluster products — the "ZUS app" grid is actually ours, and every
// card links straight to that product's page on /zus-coffee-menu/<slug>/.
const PRODUCTS = [
  { slug: "spanish-latte", cat: "#1 BESTSELLER", name: "Spanish Latte", price: "RM 11.90", cup: "#c9a87f" },
  { slug: "cafe-mocha", cat: "CHOCOLATE COFFEE", name: "Café Mocha", price: "RM 11.90", cup: "#46301f" },
  { slug: "matcha-latte", cat: "MATCHA SERIES", name: "Matcha Latté", price: "RM 11.90", cup: "#6f9150" },
  { slug: "java-chip-frappe", cat: "FRAPPÉ", name: "Java Chip Frappé", price: "RM 13.90", cup: "#5b4636" },
];

const Cup = ({ color }: { color: string }) => (
  <div className="flex h-28 w-full items-end justify-center rounded-2xl" style={{ background: "#f3f3f5" }}>
    <div
      className="mb-2 flex h-20 w-14 flex-col items-center justify-center rounded-b-2xl rounded-t-md"
      style={{ background: color }}
    >
      <span className="text-[9px] font-extrabold leading-none tracking-wider text-white/85">ZUS</span>
      <span className="mt-0.5 text-[5px] font-semibold tracking-[0.2em] text-white/60">COFFEE</span>
    </div>
  </div>
);

const TABS = [
  { label: "Home", Icon: Home },
  { label: "Menu", Icon: Store, active: true },
  { label: "Gift Card", Icon: CreditCard },
  { label: "Rewards", Icon: Ticket },
  { label: "Account", Icon: User },
];

const ZusReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  // "end end" maps progress 0→1 across the whole PINNED phase, so the full scene
  // plays while the sticky child is fixed (it releases exactly at progress 1).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // ZUS app skin: holds, then blurs + lifts + fades out.
  const zusOpacity = useTransform(scrollYProgress, [0.45, 0.62], [1, 0]);
  const zusScale = useTransform(scrollYProgress, [0, 0.62], [1, 1.08]);
  const zusBlurPx = useTransform(scrollYProgress, [0.3, 0.6], [0, 12]);
  const zusFilter = useMotionTemplate`blur(${zusBlurPx}px)`;

  // "rebuilding" caption (carries its own dark scrim so it reads over the app).
  const capOpacity = useTransform(scrollYProgress, [0.42, 0.52, 0.66], [0, 1, 0]);

  // Leadzap reveal rises over everything and holds to the end of the pin.
  const lzOpacity = useTransform(scrollYProgress, [0.64, 0.82], [0, 1]);
  const lzScale = useTransform(scrollYProgress, [0.64, 1], [0.94, 1]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={ref} className="relative z-[60] h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-white">
        {/* ============ ZUS-style app skin (impression of their layout) ============ */}
        <motion.div
          style={{ opacity: zusOpacity, scale: zusScale, filter: zusFilter }}
          className="absolute inset-0 overflow-hidden bg-white"
        >
          <div className="mx-auto flex h-full max-w-[440px] flex-col px-4 pt-4 text-[#2b2b2b]">
            {/* faux status bar */}
            <div className="flex items-center justify-between px-1 text-[13px] font-semibold text-black">
              <span>2:37</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">●●●●</span>
                <span className="rounded bg-[#f2c200] px-1 text-[10px] font-bold text-black">81</span>
              </div>
            </div>

            {/* pickup / delivery + search */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex rounded-full bg-[#eef0f3] p-1 text-sm font-semibold">
                <span className="rounded-full px-5 py-2 text-white" style={{ background: NAVY }}>Pickup</span>
                <span className="px-5 py-2 text-[#9aa0ad]">Delivery</span>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#eef0f3]">
                <Search className="h-5 w-5" style={{ color: NAVY }} />
              </div>
            </div>

            {/* store */}
            <div className="mt-3 flex items-center gap-2 font-bold" style={{ color: NAVY }}>
              <Store className="h-5 w-5" /> INTI International College Subang
            </div>

            <div className="mt-3 flex min-h-0 flex-1 gap-3">
              {/* category rail */}
              <aside className="w-[78px] shrink-0 space-y-4 overflow-hidden pr-1">
                {CATS.map((c, i) => (
                  <div key={c} className="relative flex flex-col items-center gap-1 text-center">
                    {i === 0 && <span className="absolute -left-3 top-1 h-6 w-1 rounded-full" style={{ background: NAVY }} />}
                    <div
                      className="grid h-9 w-9 place-items-center rounded-lg"
                      style={{ background: i === 0 ? "#eef0fb" : "transparent", color: i === 0 ? NAVY : "#b8bcc6" }}
                    >
                      {i === 0 ? <Heart className="h-5 w-5" fill={NAVY} /> : <span className="text-lg">▢</span>}
                    </div>
                    <span className="text-[10px] font-semibold leading-tight" style={{ color: i === 0 ? NAVY : "#7b8190" }}>
                      {c}
                    </span>
                  </div>
                ))}
              </aside>

              {/* product grid */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full" style={{ background: NAVY }} />
                  <span className="text-lg font-extrabold" style={{ color: NAVY }}>For You</span>
                  <span className="rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ borderColor: GOLD, color: GOLD }}>
                    You may love these!
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4">
                  {PRODUCTS.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/zus-coffee-menu/${p.slug}/`}
                      className="block text-center transition-transform active:scale-95"
                    >
                      <Cup color={p.cup} />
                      <div className="mt-1.5 text-[10px] font-bold leading-tight" style={{ color: GOLD }}>{p.cat}</div>
                      <div className="mt-0.5 text-[13px] font-bold leading-tight" style={{ color: NAVY }}>{p.name}</div>
                      <div className="mt-0.5 text-sm font-extrabold" style={{ color: NAVY }}>{p.price}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* bottom tab bar */}
            <nav className="mt-2 flex items-center justify-between border-t border-[#ececec] px-2 pb-3 pt-2">
              {TABS.map(({ label, Icon, active }) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-1">
                  <Icon className="h-5 w-5" style={{ color: active ? NAVY : "#b8bcc6" }} />
                  <span className="text-[10px] font-semibold" style={{ color: active ? NAVY : "#b8bcc6" }}>{label}</span>
                </div>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* ============ "rebuilding" caption (own dark scrim) ============ */}
        <motion.div
          style={{ opacity: capOpacity }}
          className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-[#0b1020]/85 px-6"
        >
          <p className="text-center font-display text-2xl font-bold leading-snug text-white md:text-4xl">
            Now watch a marketing agency
            <br />
            rebuild it as you scroll…
          </p>
        </motion.div>

        {/* ============ Leadzap reveal ============ */}
        <motion.div
          style={{ opacity: lzOpacity, scale: lzScale }}
          className="pointer-events-none absolute inset-0 z-30 grid place-items-center bg-[#121212]"
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
          className="pointer-events-none absolute bottom-7 left-0 right-0 z-40 flex flex-col items-center gap-1"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: NAVY }}>Scroll</span>
          <ArrowDown className="h-5 w-5 animate-bounce" style={{ color: NAVY }} />
        </motion.div>
      </div>
    </section>
  );
};

export default ZusReveal;
