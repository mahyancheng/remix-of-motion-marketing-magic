import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import {
  ArrowDown, Search, Heart, Home, CreditCard, Ticket, User, Store,
  Leaf, LayoutGrid, Coffee, CupSoda, Hand, Milk, GlassWater,
} from "lucide-react";
import Logo from "@/image/Logo.webp";

/**
 * Scroll-driven "rebuild" intro for the ZUS Coffee menu page.
 *
 * First view ≈ a recreation of ZUS's own ordering app (white UI, their navy +
 * gold palette, category rail, product grid, bottom tab bar) — a stylised
 * *impression* of the layout, NOT ZUS's actual logo mark or product photos. The
 * "For You" products are OUR cluster pages; each card links to its subpage. As
 * the visitor scrolls, a framer-motion pinned scene blurs/fades it and
 * transforms into the Leadzap dark+gold design, handing off into the real
 * (crawlable) menu below. Fully responsive — phone and desktop. Framed as a
 * friendly demonstration; the page's "not affiliated" disclaimer still applies.
 */

const NAVY = "#17226a";
const GOLD = "#a4884e";

const CATS = [
  { label: "For You", Icon: Heart },
  { label: "Matcha Series", Icon: Leaf },
  { label: "Chocolate", Icon: LayoutGrid },
  { label: "CEO Series", Icon: Coffee },
  { label: "ZUS Tea Series", Icon: CupSoda },
  { label: "Top Picks", Icon: Hand },
  { label: "Crème Series", Icon: Milk },
  { label: "Coconut Series", Icon: GlassWater },
];

// Our real cluster products — the "ZUS app" grid is actually ours, and every
// card links straight to that product's page on /zus-coffee-menu/<slug>/.
const PRODUCTS = [
  { slug: "spanish-latte", cat: "#1 BESTSELLER", name: "Spanish Latte", price: "RM 11.90", cup: "#c9a87f" },
  { slug: "cafe-mocha", cat: "CHOCOLATE COFFEE", name: "Café Mocha", price: "RM 11.90", cup: "#46301f" },
  { slug: "matcha-latte", cat: "MATCHA SERIES", name: "Matcha Latté", price: "RM 11.90", cup: "#6f9150" },
  { slug: "americano", cat: "CLASSIC", name: "Iced Americano", price: "RM 8.90", cup: "#39271d" },
  { slug: "cham-latte", cat: "ZUS TEA SERIES", name: "Cham Latte", price: "RM 10.90", cup: "#8a5a2e" },
  { slug: "cafe-latte", cat: "CLASSIC LATTE", name: "Caffè Latte", price: "RM 9.90", cup: "#6f5240" },
];

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

  // Boot "splash" — recreates ZUS's app launch screen, with a deliberately slow
  // loading bar (a nod to their real 19.5s load) that hands off to the menu.
  const [pct, setPct] = useState(0);
  const [splashGone, setSplashGone] = useState(false);
  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(100, p + Math.ceil(Math.random() * 8) + 2);
      setPct(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => setSplashGone(true), 550);
      }
    }, 140);
    return () => clearInterval(id);
  }, []);

  // Tapping a (ZUS-style) category whisks the visitor past the intro into our
  // real menu content below — smooth-scrolls to the end of this pinned section.
  const skipToContent = () => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative z-[60] h-[200vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-white">
        {/* ============ boot splash (recreated layout, not ZUS's logo art) ============ */}
        {!splashGone && (
          <div
            className={`absolute inset-0 z-50 flex flex-col items-center bg-white transition-opacity duration-500 ${pct >= 100 ? "pointer-events-none opacity-0" : "opacity-100"}`}
          >
            <div className="flex flex-1 flex-col items-center justify-center px-6">
              <div className="grid h-28 w-28 place-items-center rounded-full md:h-32 md:w-32" style={{ background: NAVY }}>
                <Coffee className="h-14 w-14 text-white md:h-16 md:w-16" strokeWidth={1.5} />
              </div>
              <div className="mt-6 text-center leading-none" style={{ color: NAVY }}>
                <div className="text-5xl font-black tracking-tight md:text-6xl">
                  ZUS<sup className="align-super text-base md:text-lg">®</sup>
                </div>
                <div className="mt-2 text-xl font-extrabold tracking-[0.35em] md:text-2xl">COFFEE</div>
              </div>
            </div>
            <div className="mb-12 flex flex-col items-center gap-4">
              <p className="text-lg font-semibold md:text-xl" style={{ color: NAVY }}>
                a Necessity, not a <span style={{ color: GOLD }}>Luxury</span>
              </p>
              <div className="flex items-center gap-2 rounded-full bg-[#c9ccd4] px-7 py-3 text-white">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                <span className="font-bold">Loading… {pct}%</span>
              </div>
            </div>
          </div>
        )}

        {/* ============ ZUS-style app skin (responsive: phone + desktop) ============ */}
        <motion.div
          style={{ opacity: zusOpacity, scale: zusScale, filter: zusFilter }}
          className="absolute inset-0 overflow-hidden bg-white"
        >
          <div className="mx-auto flex h-full w-full max-w-md flex-col px-4 pt-6 text-[#2b2b2b] md:max-w-6xl md:px-10 md:pt-12">
            {/* pickup / delivery + search */}
            <div className="flex items-center justify-between">
              <div className="flex rounded-full bg-[#eef0f3] p-1 text-sm font-semibold md:text-lg">
                <span className="rounded-full px-5 py-2 text-white md:px-9 md:py-3" style={{ background: NAVY }}>Pickup</span>
                <span className="px-5 py-2 text-[#9aa0ad] md:px-9 md:py-3">Delivery</span>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#eef0f3] md:h-14 md:w-14">
                <Search className="h-5 w-5 md:h-6 md:w-6" style={{ color: NAVY }} />
              </div>
            </div>

            <div className="mt-5 flex min-h-0 flex-1 gap-3 md:mt-9 md:gap-10">
              {/* category rail (compact on phone, sidebar on desktop) */}
              <aside className="w-[78px] shrink-0 space-y-4 overflow-hidden pr-1 md:w-[200px] md:space-y-1">
                {CATS.map(({ label, Icon }, i) => (
                  <button
                    type="button"
                    key={label}
                    onClick={skipToContent}
                    className="relative flex w-full cursor-pointer flex-col items-center gap-1 text-center transition-colors md:flex-row md:gap-3 md:rounded-xl md:px-3 md:py-2 md:text-left md:hover:bg-[#f3f4f9]"
                  >
                    {i === 0 && <span className="absolute -left-3 top-1 h-6 w-1 rounded-full md:-left-1 md:top-1/2 md:h-7 md:-translate-y-1/2" style={{ background: NAVY }} />}
                    <div
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg md:h-11 md:w-11"
                      style={{ background: i === 0 ? "#eef0fb" : "transparent", color: i === 0 ? NAVY : "#9aa0ad" }}
                    >
                      <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.8} {...(i === 0 ? { fill: NAVY } : {})} />
                    </div>
                    <span className="text-[10px] font-semibold leading-tight md:text-base" style={{ color: i === 0 ? NAVY : "#7b8190" }}>
                      {label}
                    </span>
                  </button>
                ))}
              </aside>

              {/* product grid: 2 cols on phone, 3 on desktop */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <span className="h-5 w-1 rounded-full md:h-8" style={{ background: NAVY }} />
                  <span className="text-lg font-extrabold md:text-3xl" style={{ color: NAVY }}>For You</span>
                  <span className="rounded-full border px-3 py-1 text-[11px] font-semibold md:px-4 md:py-1.5 md:text-sm" style={{ borderColor: GOLD, color: GOLD }}>
                    You may love these!
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 md:mt-7 md:grid-cols-3 md:gap-x-7 md:gap-y-9">
                  {PRODUCTS.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/zus-coffee-menu/${p.slug}/`}
                      className="block text-center transition-transform hover:-translate-y-0.5 active:scale-95"
                    >
                      <div className="h-28 w-full overflow-hidden rounded-2xl md:h-52" style={{ background: "#f3f3f5" }}>
                        <img src={`/zus-menu/${p.slug}.jpg`} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="mt-1.5 text-[10px] font-bold leading-tight md:mt-3 md:text-xs" style={{ color: GOLD }}>{p.cat}</div>
                      <div className="mt-0.5 text-[13px] font-bold leading-tight md:text-lg" style={{ color: NAVY }}>{p.name}</div>
                      <div className="mt-0.5 text-sm font-extrabold md:mt-1 md:text-xl" style={{ color: NAVY }}>{p.price}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* bottom tab bar */}
            <nav className="mt-2 flex items-center justify-between border-t border-[#ececec] px-2 pb-3 pt-2 md:mx-auto md:mt-6 md:w-full md:max-w-2xl md:pb-6 md:pt-4">
              {TABS.map(({ label, Icon, active }) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-1">
                  <Icon className="h-5 w-5 md:h-6 md:w-6" style={{ color: active ? NAVY : "#b8bcc6" }} />
                  <span className="text-[10px] font-semibold md:text-sm" style={{ color: active ? NAVY : "#b8bcc6" }}>{label}</span>
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
          <p className="text-center font-display text-2xl font-bold leading-snug text-white md:text-5xl">
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
            <img src={Logo} alt="Leadzap Marketing" className="mx-auto h-10 md:h-14" />
            <h2 className="mt-7 font-display text-3xl font-bold text-foreground md:text-6xl">
              So we <span className="text-accent">rebuilt it.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground md:max-w-xl md:text-lg">
              The whole ZUS menu — a few KB, loads instantly, on a marketing agency's website. Ranking above ZUS's own.
            </p>
            <div className="mt-7 flex items-center justify-center gap-2 text-sm font-medium text-accent md:text-base">
              keep scrolling <ArrowDown className="h-4 w-4 animate-bounce" />
            </div>
          </div>
        </motion.div>

        {/* ============ initial scroll hint ============ */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-7 left-0 right-0 z-40 flex flex-col items-center gap-1"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] md:text-xs" style={{ color: NAVY }}>Scroll</span>
          <ArrowDown className="h-5 w-5 animate-bounce md:h-6 md:w-6" style={{ color: NAVY }} />
        </motion.div>
      </div>
    </section>
  );
};

export default ZusReveal;
