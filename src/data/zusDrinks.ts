// Per-drink content for the /zus-coffee-menu/<slug>/ cluster. Each entry is a
// genuinely distinct, useful page (taste, ingredients, price, calories, FAQ) —
// NOT a thin template swap, which Google penalises. Targets the real drink
// keywords ZUS ranks for via clunky dated blog posts (Semrush MY, May 2026):
// mocha 8.1K · cafe latte 2.9K · cham 3.6K · java chip 1K · spanish latte (brand).

export type ZusDrink = {
  slug: string;
  name: string;
  keyword: string;
  price: string;
  calories: string;
  tag?: string;
  intro: string;
  about: string[];
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
      "ZUS's Spanish Latte takes a standard latte and swaps part of the sweetness for sweetened condensed milk, which is what gives it that thick, caramel-edged finish Malaysians keep coming back for. It's built on ZUS's 100% Arabica specialty beans, so under the sweetness there's still a real espresso backbone rather than just a milky drink.",
      "It's available hot or iced, and the iced version is the more popular order — the condensed milk holds up better over ice and the drink stays sweet to the last sip. If you find ZUS's regular latte a touch plain, this is the upgrade most people mean when they say 'the sweet one.'",
    ],
    taste: "Sweet, creamy, condensed-milk richness over a real espresso base.",
    compare: "Sweeter and creamier than a Caffè Latte; less chocolatey than a Café Mocha.",
    faqs: [
      { q: "How much is a ZUS Spanish Latte?", a: "Around RM 11.90 for a regular — indicative; confirm in-store or on the ZUS app." },
      { q: "Is the ZUS Spanish Latte sweet?", a: "Yes — it's sweetened with condensed milk, making it noticeably sweeter and creamier than a standard latte." },
      { q: "Hot or iced?", a: "Both are available. Iced is the more popular order." },
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
      "Cham (鸳鸯 / yuanyang) is a beloved local drink: kopi and teh blended together. ZUS's Cham Latte brings that idea into its espresso line-up, layering tea notes over a milky coffee base so you get both the roastiness of coffee and the tannic lift of tea in one cup.",
      "It's a great pick if you find straight coffee too one-note but still want caffeine. ZUS ranks for 'cham' on Google today only through an old dated blog post — this page is the clean, current version with the price and details in one place.",
    ],
    taste: "Coffee-meets-tea: roasty, milky, with a gentle tea finish.",
    compare: "More aromatic and complex than a plain latte; less sweet than the Spanish Latte.",
    faqs: [
      { q: "What is ZUS Cham Latte?", a: "A latte-style take on 'cham' — the Malaysian mix of coffee and tea — built on ZUS's espresso and milk." },
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
      "The Mocha is the gateway coffee for chocolate lovers: ZUS combines its Arabica espresso with chocolate and milk, so it drinks like a slightly grown-up hot chocolate with a real caffeine kick. It's consistently one of the most-searched ZUS drinks in Malaysia.",
      "Order it iced for a dessert-like cold drink, or hot when you want something cosier. If you want it sweeter and blended, the Mocha Frappé and Java Chip Frappé are the cold, scoopable cousins.",
    ],
    taste: "Chocolatey and smooth with an espresso edge.",
    compare: "Sweeter and more chocolate-forward than a latte; the blended Mocha Frappé is the icy version.",
    faqs: [
      { q: "How much is a ZUS Mocha?", a: "Around RM 11.90 for a regular (indicative — confirm in-store or on the ZUS app)." },
      { q: "Does the ZUS Mocha have chocolate?", a: "Yes — it's espresso, milk and chocolate, hot or iced." },
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
      "If the Spanish Latte is the dessert, the Caffè Latte is the daily driver: a clean shot of ZUS's Arabica espresso topped with steamed milk and a thin layer of foam. It's the drink to order when you want to actually taste the coffee rather than the sweetness.",
      "It's also the most customisable base — go oat or less-sweet, add a syrup, or take it iced. Many people search 'zus cafe latte' to check the price before ordering; here it is, with the rest of the menu one click away.",
    ],
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
      "Java Chip is the order for when coffee should feel like a treat: ZUS blends espresso, chocolate, milk and chocolate chips into a thick frappé, usually finished with cream. It's cold, sweet and closer to a milkshake than a coffee — which is exactly the point.",
      "It's a popular hot-weather pick, and one of the few non-brand terms ZUS actually ranks for (via an old 2022 blog post). This page is the current, clean version with the price up front.",
    ],
    taste: "Sweet, icy, chocolate-chip blended coffee — dessert in a cup.",
    compare: "Sweeter and heavier than the Mocha Frappé; far sweeter than any hot latte.",
    faqs: [
      { q: "How much is a ZUS Java Chip Frappé?", a: "Around RM 13.90 for a regular (indicative — confirm in-store or on the ZUS app)." },
      { q: "Does Java Chip have coffee?", a: "Yes — it's a blended coffee drink with espresso, chocolate and chocolate chips." },
    ],
  },
];

export const getDrink = (slug?: string) => zusDrinks.find((d) => d.slug === slug);
export const drinkSlugs = zusDrinks.map((d) => d.slug);
