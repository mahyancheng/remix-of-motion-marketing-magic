import { Link, useParams } from "react-router-dom";
import { Coffee, Zap, ArrowRight, ChevronRight } from "lucide-react";
import Logo from "@/image/Logo.webp";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Footer from "./Footer";
import NotFound from "./NotFound";
import { getDrink, zusDrinks } from "@/data/zusDrinks";
import { getFAQSchema } from "@/lib/schema";

const SITE = "https://leadzap.com.my";

const ZusDrink = () => {
  const { slug } = useParams();
  const drink = getDrink(slug);
  if (!drink) return <NotFound />;

  const path = `/zus-coffee-menu/${drink.slug}`;
  const faqSchema = getFAQSchema(drink.faqs.map((f) => ({ question: f.q, answer: f.a })));
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: drink.name,
    description: drink.intro,
    offers: { "@type": "Offer", price: drink.price.replace(/[^\d.]/g, ""), priceCurrency: "MYR" },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "ZUS Coffee Menu", item: `${SITE}/zus-coffee-menu/` },
      { "@type": "ListItem", position: 3, name: drink.name },
    ],
  };
  const others = zusDrinks.filter((d) => d.slug !== drink.slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={`${drink.name} — Price, Calories & Details (Malaysia 2026) | Leadzap`}
        description={`${drink.intro} ${drink.price} (indicative). Full ZUS Coffee menu by Leadzap Marketing.`}
        path={path}
        schema={[productSchema, faqSchema, breadcrumb]}
      />

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

      <main className="container mx-auto max-w-3xl px-4 pb-4">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 pt-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-accent">Home</Link><ChevronRight className="h-3 w-3" />
          <Link to="/zus-coffee-menu/" className="hover:text-accent">ZUS Coffee Menu</Link><ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{drink.name}</span>
        </nav>

        {/* Hero */}
        <section className="pt-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
            <Coffee className="h-3.5 w-3.5" /> ZUS Coffee Menu · by Leadzap
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight md:text-5xl">{drink.name}</h1>
          {drink.tag && <span className="mt-3 inline-block rounded bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">{drink.tag}</span>}
          <p className="mt-4 text-lg text-muted-foreground">{drink.intro}</p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-border bg-card px-3 py-1.5"><b className="text-accent">{drink.price}</b> · regular</span>
            <span className="rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground">{drink.calories}</span>
          </div>
        </section>

        {/* About */}
        <section className="prose-invert max-w-none py-8">
          {drink.about.map((p, i) => (
            <p key={i} className="mb-4 leading-relaxed text-foreground/90">{p}</p>
          ))}
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-accent">Taste</div>
              <p className="mt-1 text-sm text-muted-foreground">{drink.taste}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-accent">How it compares</div>
              <p className="mt-1 text-sm text-muted-foreground">{drink.compare}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-4">
          <h2 className="font-display text-2xl font-bold">{drink.name} — <span className="text-accent">FAQ</span></h2>
          <dl className="mt-4">
            {drink.faqs.map((f) => (
              <div key={f.q} className="border-b border-border py-4">
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-1.5 text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Internal links: hub + siblings */}
        <section className="py-6">
          <h2 className="font-display text-xl font-bold">More from the ZUS Coffee menu</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link to="/zus-coffee-menu/" className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-sm text-accent hover:bg-accent/20">← Full menu &amp; prices</Link>
            {others.map((d) => (
              <Link key={d.slug} to={`/zus-coffee-menu/${d.slug}`} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-accent hover:text-accent">{d.name.replace("ZUS ", "")}</Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="my-8 rounded-3xl border border-border bg-card p-8 text-center">
          <h2 className="font-display text-2xl font-bold">Why is ZUS's menu on a marketing agency's site?</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Because ZUS doesn't have a menu page — <code className="text-foreground">zuscoffee.com/menu</code> redirects to rewards. We built theirs to prove a point. Want this kind of SEO for your brand?</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/contact/"><Button variant="hero" size="lg">Get a free SEO audit <ArrowRight className="ml-1.5 h-4 w-4" /></Button></Link>
            <Link to="/"><Button variant="outline" size="lg">See what Leadzap does</Button></Link>
          </div>
        </section>

        <p className="mb-8 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
          <b>Disclaimer:</b> Independent SEO demonstration by Leadzap Marketing. Not affiliated with, endorsed by, or operated by ZUS Coffee. "ZUS Coffee" is a trademark of its owner, used here only to refer to and compare the brand. Prices and calories are indicative.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default ZusDrink;
