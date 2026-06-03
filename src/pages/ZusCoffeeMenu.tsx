import { Link } from "react-router-dom";
import { Coffee, Zap, ExternalLink, ArrowRight } from "lucide-react";
import Logo from "@/image/Logo.webp";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Footer from "./Footer";
import { getMenuSchema, getFAQSchema } from "@/lib/schema";
import { zusDrinks } from "@/data/zusDrinks";

const MENU = [
  { cat: "Signature Series", items: [
    { name: "Spanish Latte", desc: "Rich, sweet, creamy — the one everyone orders.", tag: "#1 BESTSELLER", price: "RM 11.90" },
    { name: "CEO Latté", desc: "Premium dark-roast blend. Bold and aromatic.", price: "RM 12.90" },
    { name: "Vietnamese Spanish Latté", desc: "Condensed-milk twist on the bestseller.", price: "RM 12.90" },
    { name: "Cham Latte", desc: "ZUS's coffee-and-tea cham, done as a latte.", price: "RM 10.90" },
    { name: "Caramel Latté", price: "RM 11.90" },
  ]},
  { cat: "Classic Coffee", items: [
    { name: "Americano", price: "RM 8.90" },
    { name: "Black Coffee", price: "RM 7.90" },
    { name: "Caffè Latte (Café Latte)", price: "RM 9.90" },
    { name: "Cappuccino", price: "RM 9.90" },
    { name: "Flat White", price: "RM 10.90" },
    { name: "Café Mocha", price: "RM 11.90" },
  ]},
  { cat: "Frappé (Blended)", items: [
    { name: "Java Chip Frappé", desc: "Chocolate chips + coffee, blended.", price: "RM 13.90" },
    { name: "ZERO Frappé", price: "RM 12.90" },
    { name: "Spanish Latte Frappé", price: "RM 13.90" },
    { name: "Caramel Frappé", price: "RM 12.90" },
    { name: "Mocha Frappé", price: "RM 13.90" },
  ]},
  { cat: "Non-Coffee & Tea", items: [
    { name: "Matcho Latté (Matcha)", price: "RM 11.90" },
    { name: "Creamy Mango", price: "RM 11.90" },
    { name: "Hot Chocolate", price: "RM 10.90" },
    { name: "Genmaicha Latté", price: "RM 11.90" },
  ]},
  { cat: "Bakery & Snacks", items: [
    { name: "Butter Croissant", price: "RM 6.90" },
    { name: "Almond Croissant", price: "RM 8.90" },
    { name: "Chocolate Chip Cookie", price: "RM 5.90" },
  ]},
];

const FAQS = [
  { question: "Does ZUS Coffee have a menu page on their website?", answer: "No. As of 2026, zuscoffee.com/menu redirects to the rewards page and there is no Menu link in the site navigation — which is exactly why this page exists." },
  { question: "What is the most popular drink at ZUS Coffee?", answer: "The Spanish Latte is ZUS's #1 bestseller — rich, sweet and creamy. The CEO Latté and Americano are also popular." },
  { question: "How much does a ZUS Coffee drink cost in Malaysia?", answer: "Most regular drinks run roughly RM 7.90 to RM 13.90, with signature and frappé drinks at the higher end. Prices are indicative — confirm in-store or on the ZUS app." },
  { question: "Is this the official ZUS Coffee website?", answer: "No. This is an independent SEO demonstration by Leadzap Marketing. We are not affiliated with ZUS Coffee — we just built the menu page their own site is missing." },
];

const FACTS = [
  { stat: "/menu → /rewards", t: "No menu page", d: "ZUS has no menu URL and no Menu link in their nav, so Google gives \"ZUS coffee menu\" to foodpanda, listicles and their own forgotten staging server — not zuscoffee.com." },
  { stat: "~880 pages", t: "Canonical leak", d: "Around 880 of their pages tell Google their \"real\" version lives on a private staging site they built before launch and seemingly forgot. Google believed them." },
  { stat: "19.5s", t: "Time to first byte", d: "Their homepage takes ~19.5s to start loading and weighs 34 MB. Starbucks Malaysia: ~40 ms. This page is a few KB." },
  { stat: "96%", t: "Brand-only traffic", d: "96% of ZUS's search traffic is people who already typed \"zus.\" Almost no one discovers them — a hard ceiling for a brand expanding regionally." },
];

const ZusCoffeeMenu = () => {
  const menuSchema = getMenuSchema(MENU);
  const faqSchema = getFAQSchema(FAQS);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="ZUS Coffee Menu & Prices (Malaysia, 2026) — built by Leadzap because ZUS didn't"
        description="The full ZUS Coffee Malaysia menu and prices — Spanish Latte, CEO Latté, Americano and more. Built by Leadzap Marketing because zuscoffee.com has no menu page. Yes, really."
        path="/zus-coffee-menu"
        schema={[menuSchema, faqSchema]}
      />

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
          <h2 className="font-display text-2xl font-bold">ZUS Coffee Menu &amp; <span className="text-accent">Prices</span> 2026</h2>
          <p className="mt-1 text-muted-foreground">Indicative Malaysia prices (regular size). Verify current pricing in-store or on the ZUS app.</p>
          {MENU.map((sec) => (
            <div key={sec.cat}>
              <div className="mt-7 mb-1 text-xs font-bold uppercase tracking-widest text-accent">{sec.cat}</div>
              {sec.items.map((it) => (
                <div key={it.name} className="flex items-baseline justify-between gap-4 border-b border-dashed border-border py-3">
                  <div>
                    <span className="font-semibold">{it.name}</span>
                    {"tag" in it && it.tag && <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground align-middle">{it.tag}</span>}
                    {"desc" in it && it.desc && <div className="text-sm text-muted-foreground">{it.desc}</div>}
                  </div>
                  <span className="whitespace-nowrap font-bold">{it.price}</span>
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* Popular drinks — full guides (internal links to the cluster) */}
        <section className="py-6">
          <h2 className="font-display text-xl font-bold">Popular ZUS drinks — <span className="text-accent">full guides</span></h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">Price, taste, calories and details for the most-searched ZUS Coffee drinks.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {zusDrinks.map((d) => (
              <Link key={d.slug} to={`/zus-coffee-menu/${d.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent">
                <div>
                  <div className="font-semibold">{d.name.replace("ZUS ", "")}</div>
                  <div className="text-xs text-muted-foreground">{d.price} · guide</div>
                </div>
                <ArrowRight className="h-4 w-4 text-accent" />
              </Link>
            ))}
          </div>
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
