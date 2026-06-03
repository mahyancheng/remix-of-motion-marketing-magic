// Per-drink content for the /zus-coffee-menu/<slug>/ cluster. Each page keeps a
// genuinely useful core (taste, price, calories, FAQ — what actually ranks) AND
// a trolling centerpiece: a "meanwhile, on ZUS's actual website" zinger grounded
// in the REAL URL/issue ZUS ranks that drink on (Semrush MY, May 2026):
// mocha 8.1K (pos 8) · cafe latte 2.9K (/bm/2022/05/31/...) · cham 3.6K (/bm/.../cham-latte)
// java chip 1K (/bm/2022/05/19/...) · spanish latte = bestseller with no real page.

export type ZusDrink = {
  slug: string;
  name: string;
  keyword: string;
  price: string;
  calories: string;
  tag?: string;
  intro: string;
  about: string[];
  troll: string;      // the comedic centerpiece — funny but factual
  taste: string;
  compare: string;
  faqs: { q: string; a: string }[];
};

export const zusDrinks: ZusDrink[] = [
  {
    slug: "spanish-latte",
    name: "ZUS Spanish Latte",
    keyword: "zus spanish latte",
    price: "RM 11.90",
    calories: "~220 kcal (regular)",
    tag: "#1 Bestseller",
    intro: "The Spanish Latte is ZUS Coffee's #1 bestseller — espresso and steamed milk sweetened with condensed milk for a rich, dessert-like cup.",
    about: [
      "ZUS's Spanish Latte takes a normal latte and swaps part of the sweetness for sweetened condensed milk, which is what gives it that thick, caramel-edged finish Malaysians keep coming back for. Built on 100% Arabica beans, so under the sweetness there's still a real espresso backbone — not just milk in a cup.",
      "Hot or iced, with iced being the more popular order: the condensed milk holds up over ice and stays sweet to the last sip. If ZUS's plain latte feels boring, this is 'the sweet one' everyone actually means.",
    ],
    troll: "ZUS's biggest-selling drink doesn't have its own page. It's crammed in as one of SIX <h1> tags on a homepage that takes 19.5 seconds to load and weighs 34 MB. Their bestseller — buried, slow, and un-rankable. So we gave it the page it deserves, on a marketing agency's website, in about ten minutes. You're welcome. 🙂",
    taste: "Sweet, creamy, condensed-milk richness over a real espresso base.",
    compare: "Sweeter and creamier than a Caffè Latte; less chocolatey than a Café Mocha.",
    faqs: [
      { q: "How much is a ZUS Spanish Latte?", a: "Around RM 11.90 for a regular — indicative; confirm in-store or on the ZUS app." },
      { q: "Is the ZUS Spanish Latte sweet?", a: "Yes — it's sweetened with condensed milk, noticeably sweeter and creamier than a standard latte." },
      { q: "Why is ZUS's bestseller on a marketing agency's website?", a: "Because ZUS doesn't have a proper page for it — and we couldn't resist proving the point. It's a friendly demonstration, not an official ZUS page." },
    ],
  },
  {
    slug: "cham-latte",
    name: "ZUS Cham Latte",
    keyword: "zus cham latte",
    price: "RM 10.90",
    calories: "~200 kcal (regular)",
    intro: "'Cham' is the Malaysian classic of coffee mixed with tea — and ZUS's Cham Latte reworks it as a modern café latte.",
    about: [
      "Cham (鸳鸯 / yuanyang) is a local legend: kopi and teh blended together. ZUS's Cham Latte brings it into the espresso line-up, layering tea notes over a milky coffee base — roastiness from the coffee, a tannic lift from the tea, one cup.",
      "Great if straight coffee feels one-note but you still want the caffeine. The 'cham' search gets 3,600 lookups a month in Malaysia — there's real demand here.",
    ],
    troll: "Here's the punchline: Google ranks ZUS's cham on <code>zuscoffee.com/bm/category/drinks/cham-latte/</code> — their 'Bahasa Malaysia' URL. The catch? That whole section is written in English. The Malay site is a costume, not a translation. So the page representing a Malaysian coffee-and-tea drink, to Malaysians, is filed under a fake-Malay URL in English. This page is just… a page. In one language. Revolutionary, we know. 🍵",
    taste: "Coffee-meets-tea: roasty, milky, with a gentle tea finish.",
    compare: "More aromatic and complex than a plain latte; less sweet than the Spanish Latte.",
    faqs: [
      { q: "What is ZUS Cham Latte?", a: "A latte-style take on 'cham' — the Malaysian mix of coffee and tea — on ZUS's espresso and milk." },
      { q: "How much is ZUS Cham Latte?", a: "Around RM 10.90 for a regular (indicative — verify in-store or on the app)." },
    ],
  },
  {
    slug: "cafe-mocha",
    name: "ZUS Café Mocha",
    keyword: "zus mocha",
    price: "RM 11.90",
    calories: "~290 kcal (regular)",
    intro: "ZUS's Café Mocha is espresso, steamed milk and chocolate — the chocolate-coffee crowd-pleaser, hot or iced.",
    about: [
      "The Mocha is the gateway coffee for chocolate lovers: Arabica espresso, chocolate and milk, so it drinks like a slightly grown-up hot chocolate with a real caffeine kick. It's one of the most-searched ZUS drinks in Malaysia.",
      "Iced for a dessert-like cold drink, hot when you want cosy. Want it blended and sweeter? The Mocha Frappé and Java Chip Frappé are the icy cousins.",
    ],
    troll: "\"Mocha\" gets 8,100 searches a month in Malaysia. ZUS ranks at position 8 for it — page two — losing to grocery sites for a drink they actually sell. We're now competing for it from a digital marketing agency that has never sold a single coffee. If a marketing agency can out-structure your menu, that's not a coffee problem. It's an SEO problem. ☕",
    taste: "Chocolatey and smooth with an espresso edge.",
    compare: "Sweeter and more chocolate-forward than a latte; the blended Mocha Frappé is the icy version.",
    faqs: [
      { q: "How much is a ZUS Mocha?", a: "Around RM 11.90 for a regular (indicative — confirm in-store or on the ZUS app)." },
      { q: "Does the ZUS Mocha have chocolate?", a: "Yes — espresso, milk and chocolate, hot or iced." },
    ],
  },
  {
    slug: "cafe-latte",
    name: "ZUS Caffè Latte",
    keyword: "zus cafe latte",
    price: "RM 9.90",
    calories: "~150 kcal (regular)",
    intro: "The Caffè Latte is ZUS's everyday classic — espresso and steamed milk, smooth and not too sweet.",
    about: [
      "If the Spanish Latte is the dessert, the Caffè Latte is the daily driver: a clean shot of Arabica espresso topped with steamed milk and a thin layer of foam. Order this when you want to taste the coffee, not the sugar.",
      "It's also the most customisable base — oat milk, less sweet, a syrup, iced. People search 'zus cafe latte' to check the price before ordering; here it is, with the rest of the menu one click away.",
    ],
    troll: "Google ranks ZUS's Café Latte on <code>zuscoffee.com/bm/2022/05/31/cafe-latte/</code>. Look at the date in the URL: 31 May 2022. ZUS published their latte as a dated blog post, so to Google it's an old news article, not a drink you can order today. It's been 'breaking news' for three years. We made it a menu item. Took us less than a coffee break. ⏱️",
    taste: "Smooth, balanced, lightly milky — coffee-forward.",
    compare: "Less sweet than the Spanish Latte; lighter than a Mocha.",
    faqs: [
      { q: "How much is a ZUS Caffè Latte?", a: "Around RM 9.90 for a regular (indicative — verify in-store or on the app)." },
      { q: "Is the ZUS latte sweet?", a: "The plain Caffè Latte is only lightly sweet. For a sweet version, order the Spanish Latte." },
    ],
  },
  {
    slug: "java-chip-frappe",
    name: "ZUS Java Chip Frappé",
    keyword: "zus java chip",
    price: "RM 13.90",
    calories: "~380 kcal (regular)",
    intro: "The Java Chip Frappé is ZUS's blended chocolate-chip coffee — icy, sweet and topped, the dessert end of the menu.",
    about: [
      "Java Chip is the order for when coffee should feel like a treat: espresso, chocolate, milk and chocolate chips blended into a thick frappé, usually finished with cream. Cold, sweet, closer to a milkshake than a coffee — which is the entire point.",
      "A hot-weather favourite, and one of the few non-brand terms ZUS actually ranks for. Here's the current version, price up front, no scavenger hunt required.",
    ],
    troll: "ZUS ranks for 'java chip' on <code>zuscoffee.com/bm/2022/05/19/java-chip-frappe/</code> — a blog post dated 19 May 2022. So one of the only non-brand searches ZUS wins is held up by a three-year-old 'article' on a fake-Malay URL. One Google hiccup and it's gone. We rebuilt it as a proper, fast, current page — the kind their whole site should be made of. Just saying. 🧋",
    taste: "Sweet, icy, chocolate-chip blended coffee — dessert in a cup.",
    compare: "Sweeter and heavier than the Mocha Frappé; far sweeter than any hot latte.",
    faqs: [
      { q: "How much is a ZUS Java Chip Frappé?", a: "Around RM 13.90 for a regular (indicative — confirm in-store or on the ZUS app)." },
      { q: "Does Java Chip have coffee?", a: "Yes — a blended coffee drink with espresso, chocolate and chocolate chips." },
    ],
  },
];

export const getDrink = (slug?: string) => zusDrinks.find((d) => d.slug === slug);
export const drinkSlugs = zusDrinks.map((d) => d.slug);
