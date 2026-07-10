import { Link } from "react-router-dom";
import { Coffee, Zap, ExternalLink, ArrowRight } from "lucide-react";
import Logo from "@/image/Logo.webp";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import ZusReveal from "@/components/ZusReveal";
import Footer from "./Footer";
import { getMenuSchema, getFAQSchema } from "@/lib/schema";
import { zusDrinks, drinkImg } from "@/data/zusDrinks";

const MENU = [
  { cat: "Signature Series", items: [
    { name: "Spanish Latte", slug: "spanish-latte", desc: "Rich, sweet, creamy — the one everyone orders.", tag: "#1 BESTSELLER", price: "RM 11.90" },
    { name: "CEO Latté", slug: "ceo-latte", desc: "Premium dark-roast blend. Bold and aromatic.", price: "RM 12.90" },
    { name: "Vietnamese Spanish Latté", slug: "vietnamese-spanish-latte", desc: "Condensed-milk twist on the bestseller.", price: "RM 12.90" },
    { name: "Cham Latte", slug: "cham-latte", desc: "ZUS's coffee-and-tea cham, done as a latte.", price: "RM 10.90" },
    { name: "Caramel Latté", slug: "caramel-latte", price: "RM 11.90" },
  ]},
  { cat: "Classic Coffee", items: [
    { name: "Americano", slug: "americano", price: "RM 8.90" },
    { name: "Black Coffee", slug: "black-coffee", price: "RM 7.90" },
    { name: "Caffè Latte (Café Latte)", slug: "cafe-latte", price: "RM 9.90" },
    { name: "Cappuccino", slug: "cappuccino", price: "RM 9.90" },
    { name: "Flat White", slug: "flat-white", price: "RM 10.90" },
    { name: "Café Mocha", slug: "cafe-mocha", price: "RM 11.90" },
  ]},
  { cat: "Frappé (Blended)", items: [
    { name: "Java Chip Frappé", slug: "java-chip-frappe", desc: "Chocolate chips + coffee, blended.", price: "RM 13.90" },
    { name: "ZERO Frappé", slug: "zero-frappe", price: "RM 12.90" },
    { name: "Spanish Latte Frappé", slug: "spanish-latte-frappe", price: "RM 13.90" },
    { name: "Caramel Frappé", slug: "caramel-frappe", price: "RM 12.90" },
    { name: "Mocha Frappé", slug: "mocha-frappe", price: "RM 13.90" },
  ]},
  { cat: "Non-Coffee & Tea", items: [
    { name: "Matcho Latté (Matcha)", slug: "matcha-latte", price: "RM 11.90" },
    { name: "Creamy Mango", slug: "creamy-mango", price: "RM 11.90" },
    { name: "Hot Chocolate", slug: "hot-chocolate", price: "RM 10.90" },
    { name: "Genmaicha Latté", slug: "genmaicha-latte", price: "RM 11.90" },
  ]},
  { cat: "Bakery & Snacks", items: [
    { name: "Butter Croissant", slug: "butter-croissant", price: "RM 6.90" },
    { name: "Almond Croissant", slug: "almond-croissant", price: "RM 8.90" },
    { name: "Chocolate Chip Cookie", slug: "chocolate-chip-cookie", price: "RM 5.90" },
  ]},
];

const FAQS = [
  { question: "Does ZUS Coffee have a menu page on their website?", answer: "No. As of 2026, zuscoffee.com/menu redirects to the rewards page and there is no Menu link in the site navigation — which is exactly why this page exists." },
  { question: "What is the most popular drink at ZUS Coffee?", answer: "The Spanish Latte is ZUS's #1 bestseller — rich, sweet and creamy. The CEO Latté and Americano are also popular." },
  { question: "How much does a ZUS Coffee drink cost in Malaysia?", answer: "Most regular drinks run roughly RM 7.90 to RM 13.90, with signature and frappé drinks at the higher end. Prices are indicative — confirm in-store or on the ZUS app." },
  { question: "What drinks are on the ZUS Coffee menu in Malaysia?", answer: "The ZUS Coffee Malaysia menu covers signature lattes (Spanish Latte, CEO Latté, Cham Latte), classic coffee (Americano, Caffè Latte, Cappuccino, Flat White), blended frappés (Java Chip, Caramel, Mocha), non-coffee options like the Matcha Latté and Creamy Mango, plus bakery items. The full list with 2026 prices and calories is above." },
  { question: "How many calories are in ZUS Coffee drinks?", answer: "It ranges widely — an Americano is about 15 kcal, a Spanish Latte around 220 kcal, and a blended Java Chip Frappé can reach roughly 380 kcal. The calories table above lists every ZUS drink and snack." },
  { question: "Is this the official ZUS Coffee website?", answer: "No. This is an independent SEO demonstration by Leadzap Marketing. We are not affiliated with ZUS Coffee — we just built the menu page their own site is missing." },
];

const FACTS = [
  { stat: "/menu → /rewards", t: "No menu page", d: "ZUS has no menu URL and no Menu link in their nav, so Google gives \"ZUS coffee menu\" to foodpanda, listicles and their own forgotten staging server — not zuscoffee.com." },
  { stat: "~880 pages", t: "Canonical leak", d: "Around 880 of their pages tell Google their \"real\" version lives on a private staging site they built before launch and seemingly forgot. Google believed them." },
  { stat: "19.5s", t: "Time to first byte", d: "Their homepage takes ~19.5s to start loading and weighs 34 MB. Starbucks Malaysia: ~40 ms. This page is a few KB." },
  { stat: "96%", t: "Brand-only traffic", d: "96% of ZUS's search traffic is people who already typed \"zus.\" Almost no one discovers them — a hard ceiling for a brand expanding regionally." },
];

// The few high-search-volume drinks we surface as featured cards; every other
// menu item still links to its own page from the menu list above.
const POPULAR_SLUGS = ["spanish-latte", "cafe-mocha", "cham-latte", "cafe-latte", "java-chip-frappe"];
const POPULAR = POPULAR_SLUGS.map((s) => zusDrinks.find((d) => d.slug === s)).filter(Boolean) as typeof zusDrinks;

const ZusCoffeeMenu = () => {
  const menuSchema = getMenuSchema(MENU);
  const faqSchema = getFAQSchema(FAQS);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="ZUS Coffee Menu & Price List 2026 (Malaysia) | Full Guide"
        description="See the full ZUS Coffee menu & price list for Malaysia (2026) — all drinks, prices in RM & calories in one place. Americano, Matcha Latte, Spanish Latte & more."
        path="/zus-coffee-menu"
        schema={[menuSchema, faqSchema]}
      />

      {/* Scroll-driven intro: starts as a ZUS-style app, transforms into Leadzap */}
      <ZusReveal />

      {/* Branded header (real Leadzap logo) */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" aria-label="Leadzap Marketing home">
            <img src={Logo} alt="Leadzap Marketing" className="h-8 md:h-9" height="36" />
          </Link>
          <Link to="/contact/">
            <Button variant="hero" size="sm"><Zap className="mr-1.5 h-4 w-4" /> Free SEO Audit</Button>
          </Link>
        </div>
      </header>

      {/* Troll banner */}
      <div className="bg-gradient-to-r from-accent to-amber-500 px-4 py-3 text-center text-sm font-semibold text-accent-foreground">
        👋 Hey ZUS — your website doesn't have a menu page, so <b>Leadzap built you one</b>. You're reading it on leadzap.com.my, ranking above your own site. <a href="#why" className="underline">Here's why ↓</a>
      </div>

      <main className="container mx-auto max-w-3xl px-4">
        {/* Hero */}
        <section className="pt-12 pb-2">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
            <Coffee className="h-3.5 w-3.5" /> Leadzap Marketing
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            The <span className="text-accent">ZUS Coffee menu</span> page ZUS forgot to build.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Full drinks list and prices for ZUS Coffee Malaysia. We made this in a weekend because <code className="text-foreground">zuscoffee.com/menu</code> quietly redirects to their rewards page. No, really — try it.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border bg-card px-3 py-1.5">⚡ Loads instantly</span>
            <span className="rounded-full border border-border bg-card px-3 py-1.5">ZUS homepage: <b className="text-accent">34 MB · 19.5s</b></span>
          </div>
        </section>

        {/* Menu */}
        <section className="py-10">
          <h2 className="font-display text-2xl font-bold">ZUS Coffee Menu &amp; <span className="text-accent">Price List</span> 2026 (Malaysia)</h2>
          <p className="mt-1 text-muted-foreground">Below is the complete ZUS Coffee price menu for 2026, with the latest prices for every drink and food item in Malaysia. Indicative regular-size prices — verify current pricing in-store or on the ZUS app.</p>
          {MENU.map((sec) => (
            <div key={sec.cat}>
              <div className="mt-7 mb-1 text-xs font-bold uppercase tracking-widest text-accent">{sec.cat}</div>
              {sec.items.map((it) => {
                const slug = "slug" in it ? it.slug : undefined;
                const inner = (
                  <>
                    <div>
                      <span className={`font-semibold ${slug ? "underline decoration-dotted decoration-accent/50 underline-offset-4 group-hover:text-accent" : ""}`}>{it.name}</span>
                      {slug && <ArrowRight className="ml-1 inline h-3.5 w-3.5 align-middle text-accent opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100" />}
                      {"tag" in it && it.tag && <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground align-middle">{it.tag}</span>}
                      {"desc" in it && it.desc && <div className="text-sm text-muted-foreground">{it.desc}{slug && <span className="text-accent"> · read the guide</span>}</div>}
                    </div>
                    <span className="whitespace-nowrap font-bold">{it.price}</span>
                  </>
                );
                const cls = "flex items-baseline justify-between gap-4 border-b border-dashed border-border py-3";
                return slug ? (
                  <Link key={it.name} to={`/zus-coffee-menu/${slug}`} className={`${cls} group transition-colors hover:border-accent`}>{inner}</Link>
                ) : (
                  <div key={it.name} className={cls}>{inner}</div>
                );
              })}
            </div>
          ))}
        </section>

        {/* Popular drinks — full guides (internal links to the cluster) */}
        <section className="py-6">
          <h2 className="font-display text-xl font-bold">Popular ZUS drinks — <span className="text-accent">full guides</span></h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">Price, taste, calories and details for the most-searched ZUS Coffee drinks. Every other item in the menu above links to its own page too.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {POPULAR.map((d) => (
              <Link key={d.slug} to={`/zus-coffee-menu/${d.slug}`} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:border-accent">
                {drinkImg(d.slug) && (
                  <img src={drinkImg(d.slug)} alt={d.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" style={{ background: "#f3f3f5" }} loading="lazy" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{d.name.replace("ZUS ", "")}</div>
                  <div className="text-xs text-muted-foreground">{d.price} · guide</div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-accent" />
              </Link>
            ))}
          </div>
        </section>

        {/* Calories & full price list — targets the "zus <drink> calories" + "harga" query cluster
            and seeds an internal link to every drink page in the cluster. */}
        <section className="py-8">
          <h2 className="font-display text-2xl font-bold">ZUS Coffee <span className="text-accent">calories &amp; prices</span> — full list</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            Approximate calories and Malaysia prices (regular size) for every ZUS Coffee drink and snack — berapa kalori &amp; harga, in one table. Tap any drink for its full guide.
          </p>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Drink</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Price</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Calories</th>
                </tr>
              </thead>
              <tbody>
                {zusDrinks.map((d) => (
                  <tr key={d.slug} className="border-t border-border">
                    <td className="px-4 py-2.5">
                      <Link to={`/zus-coffee-menu/${d.slug}`} className="font-medium underline decoration-dotted decoration-accent/50 underline-offset-4 hover:text-accent">
                        {d.name.replace("ZUS ", "")}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 text-right font-semibold whitespace-nowrap">{d.price}</td>
                    <td className="px-4 py-2.5 text-right text-muted-foreground whitespace-nowrap">{d.calories.replace(" (regular)", "").replace(" (each)", "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Calories are indicative estimates for a regular serving; actual values vary with size, milk and sweetness.</p>
        </section>

        {/* Why */}
        <section id="why" className="py-8 scroll-mt-20">
          <h2 className="font-display text-2xl font-bold">Wait — why is ZUS's menu on a <span className="text-accent">marketing agency's</span> site?</h2>
          <p className="mt-1 mb-6 text-muted-foreground">Fair question. We ran a full SEO audit of zuscoffee.com, found their menu page doesn't exist, and figured the funniest way to prove a point was to just… rank for it ourselves. Here's what we found.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {FACTS.map((f) => (
              <div key={f.t} className="rounded-2xl border border-border bg-card p-5">
                <div className="font-display text-2xl font-bold text-accent">{f.stat}</div>
                <div className="mt-1 font-bold">{f.t}</div>
                <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="my-10 rounded-3xl border border-border bg-card p-8 text-center">
          <h2 className="font-display text-2xl font-bold">It's all fixable — and we'd genuinely love to help. 🙂</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">A friendly flex, not a roast. The damaging stuff can be fixed in about two weeks. Want this kind of audit for your own brand?</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/contact/"><Button variant="hero" size="lg">Get a free SEO audit <ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
            <Link to="/"><Button variant="outline" size="lg">See what Leadzap does</Button></Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8">
          <h2 className="font-display text-2xl font-bold">ZUS Coffee menu — <span className="text-accent">FAQ</span></h2>
          <dl className="mt-4">
            {FAQS.map((f) => (
              <div key={f.question} className="border-b border-border py-4">
                <dt className="font-semibold">{f.question}</dt>
                <dd className="mt-1.5 text-muted-foreground">{f.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <b>Disclaimer:</b> This page is an independent SEO demonstration by Leadzap Marketing. It is <b>not</b> affiliated with, endorsed by, or operated by ZUS Coffee. "ZUS Coffee" is a trademark of its owner, used here only to refer to and compare the brand. Menu items and prices are indicative.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ZusCoffeeMenu;
