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
  {
    slug: "ceo-latte",
    name: "ZUS CEO Latté",
    keyword: "zus ceo latte",
    price: "RM 12.90",
    calories: "~210 kcal (regular)",
    tag: "Premium",
    intro: "The CEO Latté is ZUS's premium signature latte — a darker, bolder roast for people who like their coffee with a bit more authority.",
    about: [
      "ZUS built the CEO Latté as the 'upgrade' to the everyday latte: a heavier, more aromatic bean profile pulled as espresso and topped with steamed milk. Less about sweetness, more about a deep, roasty backbone — the order for when a normal latte feels too polite.",
      "It's one of ZUS's most recognisable signature names, hot or iced. Premium positioning, premium price — and, somehow, no page of its own anywhere on their website.",
    ],
    troll: "ZUS named a drink after the boss and then forgot to give it a page. Search 'ZUS CEO Latte' and their own site has nothing to show Google — so we built the CEO an office. On a marketing agency's website. The symbolism writes itself. 💼",
    taste: "Bold, roasty, aromatic — espresso-forward with smooth milk.",
    compare: "Darker and stronger than the Caffè Latte; less sweet than the Spanish Latte.",
    faqs: [
      { q: "How much is a ZUS CEO Latté?", a: "Around RM 12.90 for a regular — indicative; confirm in-store or on the ZUS app." },
      { q: "What makes the CEO Latté different?", a: "It uses a bolder, darker-roast profile than the standard Caffè Latte — stronger and more aromatic, less sweet." },
    ],
  },
  {
    slug: "vietnamese-spanish-latte",
    name: "ZUS Vietnamese Spanish Latté",
    keyword: "zus vietnamese spanish latte",
    price: "RM 12.90",
    calories: "~250 kcal (regular)",
    intro: "A Vietnamese twist on ZUS's bestselling Spanish Latte — heavier on the condensed milk, with a stronger, robusta-style coffee punch.",
    about: [
      "This takes the sweet, condensed-milk idea of the Spanish Latte and pushes it toward Vietnamese cà phê sữa: bolder, darker coffee and a thicker, sweeter finish. The result is richer and more intense than the original.",
      "Iced is the move here — the sweetness and strength hold up beautifully over ice. If the Spanish Latte is dessert, this is dessert with a double shot of attitude.",
    ],
    troll: "It's the brand's bestseller, remixed — and it still doesn't get its own page on zuscoffee.com. Two of ZUS's most popular drinks share zero dedicated pages between them. We gave this one ours. 🇻🇳",
    taste: "Sweet, thick, intense — condensed milk over strong dark coffee.",
    compare: "Stronger and sweeter than the regular Spanish Latte; far richer than a plain latte.",
    faqs: [
      { q: "How much is a ZUS Vietnamese Spanish Latté?", a: "Around RM 12.90 for a regular (indicative — verify in-store or on the app)." },
      { q: "How is it different from the Spanish Latte?", a: "More condensed milk and a bolder, Vietnamese-style coffee base — sweeter and stronger." },
    ],
  },
  {
    slug: "caramel-latte",
    name: "ZUS Caramel Latté",
    keyword: "zus caramel latte",
    price: "RM 11.90",
    calories: "~240 kcal (regular)",
    intro: "ZUS's Caramel Latté is espresso and steamed milk with caramel syrup — smooth, sweet and buttery, hot or iced.",
    about: [
      "A crowd-pleaser for the sweet-tooth crowd: the caramel rounds off the espresso's edges into something dessert-adjacent but still clearly coffee. An easy entry point if black coffee isn't your thing.",
      "Works hot for cosy, iced for a sweet pick-me-up. One of those orders nearly every café has — which is exactly why people search the price before buying.",
    ],
    troll: "Every café on earth sells a caramel latte, and shoppers Google the price before they order. ZUS's answer to that search? No page. So the price you're reading is on ours, not theirs. 🍮",
    taste: "Sweet, buttery caramel over smooth espresso and milk.",
    compare: "Sweeter than the Caffè Latte; less condensed-milk-rich than the Spanish Latte.",
    faqs: [
      { q: "How much is a ZUS Caramel Latté?", a: "Around RM 11.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Is the Caramel Latté very sweet?", a: "Yes — caramel syrup makes it noticeably sweet, though still coffee-forward." },
    ],
  },
  {
    slug: "americano",
    name: "ZUS Americano",
    keyword: "zus americano",
    price: "RM 8.90",
    calories: "~15 kcal (regular)",
    intro: "The Americano is ZUS's purest coffee — espresso shots topped with hot water, black and bold with almost no calories.",
    about: [
      "Two things people want from an Americano: real coffee flavour and basically no sugar. ZUS's is straightforward — Arabica espresso lengthened with water, hot or over ice.",
      "It's the default for anyone watching calories or who just wants to taste the bean. Customise the strength, add milk on the side, or take it as-is.",
    ],
    troll: "The Americano is one of the most-searched coffees anywhere — and one of the simplest things to make a page for. ZUS made zero. Their black coffee is invisible to Google; ours isn't. ☕",
    taste: "Black, bold, clean — pure espresso lengthened with water.",
    compare: "Stronger and far less sweet than any latte; cleaner-tasting than brewed Black Coffee.",
    faqs: [
      { q: "How much is a ZUS Americano?", a: "Around RM 8.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "How many calories in a ZUS Americano?", a: "Very few — roughly 15 kcal for a black regular, before any milk or sugar." },
    ],
  },
  {
    slug: "black-coffee",
    name: "ZUS Black Coffee",
    keyword: "zus black coffee",
    price: "RM 7.90",
    calories: "~5 kcal (regular)",
    intro: "ZUS Black Coffee is the no-frills option — straight brewed coffee, no milk, no sugar, usually the cheapest cup on the menu.",
    about: [
      "When you want coffee and nothing else: black, hot, honest. It's also the most wallet-friendly drink ZUS sells, which makes it a common 'how much is it' search.",
      "Order it to taste the roast cleanly, or as the zero-calorie default. Simple by design.",
    ],
    troll: "The cheapest, simplest item on the menu — and still no page. If ZUS won't make a page for a RM 7.90 black coffee, you start to see why 880 of their other pages point Google at a staging server. We made this one. 🖤",
    taste: "Clean, roasty, unsweetened brewed coffee.",
    compare: "Fuller-brewed than an Americano's espresso; zero sweetness versus any latte.",
    faqs: [
      { q: "How much is ZUS Black Coffee?", a: "Around RM 7.90 for a regular — typically the cheapest drink on the menu (indicative)." },
      { q: "Does Black Coffee have sugar?", a: "No — it's served plain; add sugar or milk yourself if you want." },
    ],
  },
  {
    slug: "cappuccino",
    name: "ZUS Cappuccino",
    keyword: "zus cappuccino",
    price: "RM 9.90",
    calories: "~120 kcal (regular)",
    intro: "ZUS's Cappuccino is the classic — espresso, steamed milk and a thick cap of foam.",
    about: [
      "The cappuccino lives and dies on its foam: more airy froth than a latte, so the espresso reads stronger through the milk. ZUS's is the textbook version, usually served hot.",
      "Pick it over a latte when you want a lighter, foamier cup with the coffee a little louder.",
    ],
    troll: "A cappuccino is on every coffee menu in the world, and people search 'ZUS cappuccino price' constantly. ZUS's website returns nothing of their own. So here's the page that should've been theirs. ☁️",
    taste: "Foamy, balanced — espresso with airy steamed milk.",
    compare: "Foamier and less milky than a Caffè Latte; stronger-tasting than a Flat White.",
    faqs: [
      { q: "How much is a ZUS Cappuccino?", a: "Around RM 9.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Cappuccino vs latte at ZUS?", a: "The cappuccino has more foam and less milk, so the coffee tastes stronger; the latte is creamier." },
    ],
  },
  {
    slug: "flat-white",
    name: "ZUS Flat White",
    keyword: "zus flat white",
    price: "RM 10.90",
    calories: "~170 kcal (regular)",
    intro: "ZUS's Flat White is espresso with thin, velvety steamed milk — stronger than a latte, smoother than a cappuccino.",
    about: [
      "The flat white is the connoisseur's milk coffee: a double-shot feel with just enough microfoam to go silky, and no big foam cap. ZUS's keeps the coffee front and centre.",
      "Order it when a latte feels too milky but a cappuccino too foamy. The Goldilocks milk coffee.",
    ],
    troll: "The flat white is the drink coffee snobs argue about — and ZUS doesn't have a page to settle it. We wrote one. A marketing agency now ranks for ZUS's flat white. Let that sink in over a sip. 🥛",
    taste: "Silky, strong, smooth — espresso with thin microfoam.",
    compare: "Stronger than a Caffè Latte; less foam than a Cappuccino.",
    faqs: [
      { q: "How much is a ZUS Flat White?", a: "Around RM 10.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Flat White vs Latte at ZUS?", a: "The flat white has less milk and thinner foam, so it tastes stronger; the latte is creamier and milder." },
    ],
  },
  {
    slug: "zero-frappe",
    name: "ZUS ZERO Frappé",
    keyword: "zus zero frappe",
    price: "RM 12.90",
    calories: "~150 kcal (regular)",
    tag: "Lower sugar",
    intro: "The ZERO Frappé is ZUS's lighter blended coffee — the icy, creamy frappé experience with the sugar dialed way down.",
    about: [
      "Built for people who want the blended-frappé treat without the dessert-level sugar load: ZUS's ZERO swaps the sweetness for a cleaner, lighter finish while keeping the cold, creamy texture.",
      "A hot-weather favourite for the calorie-conscious. Same icy hit as the Java Chip, far less guilt.",
    ],
    troll: "ZUS made a health-conscious frappé and then gave its calorie info the same treatment as everything else: no page. People literally search the sugar content — and find ours, not theirs. 🧊",
    taste: "Icy, creamy, lightly sweet — frappé texture without the sugar rush.",
    compare: "Much lighter than the Java Chip or Mocha Frappé; less sweet across the board.",
    faqs: [
      { q: "How much is a ZUS ZERO Frappé?", a: "Around RM 12.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Is the ZERO Frappé sugar-free?", a: "It's ZUS's lower-sugar blended option — lighter than the dessert frappés, though not necessarily zero sugar. Confirm in-store." },
    ],
  },
  {
    slug: "spanish-latte-frappe",
    name: "ZUS Spanish Latte Frappé",
    keyword: "zus spanish latte frappe",
    price: "RM 13.90",
    calories: "~320 kcal (regular)",
    intro: "The blended, iced version of ZUS's #1 drink — the Spanish Latte's sweet condensed-milk flavour, frappé'd into a thick cold treat.",
    about: [
      "Take the bestseller everyone loves and blend it with ice into a creamy, sweet frappé. All the condensed-milk richness of the Spanish Latte, now cold, thick and almost spoonable.",
      "Peak hot-weather order for Spanish Latte fans who want it iced and indulgent.",
    ],
    troll: "ZUS's #1 flavour, in its most popular cold format — and between them they share exactly zero product pages on ZUS's own site. Their bestseller franchise is invisible to Google. We fixed that, twice. 🥤",
    taste: "Sweet, creamy, icy — blended condensed-milk coffee.",
    compare: "Sweeter than the Mocha Frappé; the cold, blended cousin of the hot Spanish Latte.",
    faqs: [
      { q: "How much is a ZUS Spanish Latte Frappé?", a: "Around RM 13.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Is it the same as the Spanish Latte?", a: "Same sweet condensed-milk flavour, but blended with ice into a cold frappé instead of a hot or iced latte." },
    ],
  },
  {
    slug: "caramel-frappe",
    name: "ZUS Caramel Frappé",
    keyword: "zus caramel frappe",
    price: "RM 12.90",
    calories: "~330 kcal (regular)",
    intro: "ZUS's Caramel Frappé is blended iced coffee with caramel — sweet, buttery and creamy, finished cold.",
    about: [
      "Caramel syrup, coffee, milk and ice blended into a sweet, smooth frappé — basically a caramel-coffee milkshake with a caffeine kick.",
      "The order for hot afternoons when you want sweet and cold over strong and hot.",
    ],
    troll: "Sweet, blended, popular — and pageless. ZUS sells the caramel frappé you're searching for, but Google can't find it on their site. It can find ours. 🍯",
    taste: "Sweet, buttery, icy — caramel blended coffee.",
    compare: "Less chocolatey than the Mocha Frappé; sweeter than the ZERO Frappé.",
    faqs: [
      { q: "How much is a ZUS Caramel Frappé?", a: "Around RM 12.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Does the Caramel Frappé have coffee?", a: "Yes — it's a blended iced coffee with caramel, milk and ice." },
    ],
  },
  {
    slug: "mocha-frappe",
    name: "ZUS Mocha Frappé",
    keyword: "zus mocha frappe",
    price: "RM 13.90",
    calories: "~340 kcal (regular)",
    intro: "The Mocha Frappé is ZUS's Café Mocha blended cold — chocolate, coffee and ice in a thick, sweet frappé.",
    about: [
      "Everything people like about the Café Mocha — chocolate plus espresso — blended with milk and ice into a cold, dessert-like frappé, usually topped with cream.",
      "The icy companion to the hot Mocha, and a natural sibling to the Java Chip for the chocolate-coffee crowd.",
    ],
    troll: "'Mocha' pulls 8,100 searches a month in Malaysia, where ZUS already sits on page two. The blended Mocha Frappé? No page at all. So we built the cold one too — the agency now covers ZUS's mocha range better than ZUS does. 🍫",
    taste: "Chocolatey, sweet, icy — blended mocha with cream.",
    compare: "Less sweet than the Java Chip Frappé; the cold, blended version of the hot Café Mocha.",
    faqs: [
      { q: "How much is a ZUS Mocha Frappé?", a: "Around RM 13.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Mocha Frappé vs Java Chip?", a: "Java Chip adds chocolate chips and is sweeter and heavier; the Mocha Frappé is smoother chocolate-coffee." },
    ],
  },
  {
    slug: "matcha-latte",
    name: "ZUS Matcha Latté",
    keyword: "zus matcha latte",
    price: "RM 11.90",
    calories: "~200 kcal (regular)",
    intro: "ZUS's Matcha Latté (branded 'Matcho') is stone-ground green tea whisked with milk — earthy, creamy and caffeine-light.",
    about: [
      "A non-coffee staple: Japanese matcha green tea blended with steamed or cold milk for a smooth, earthy, slightly sweet cup. The go-to for the no-coffee, still-want-caffeine crowd.",
      "Iced is the popular order. Vibrant green, photogenic, and one of the most-searched non-coffee café drinks in Malaysia.",
    ],
    troll: "ZUS brands theirs 'Matcho Latté' — and even with the quirky spelling, there's no page for it. One of the biggest non-coffee searches in the country, and ZUS hands it to everyone but themselves. We spelled it right and gave it a page. 🍵",
    taste: "Earthy, creamy, lightly sweet — green tea and milk.",
    compare: "No coffee, unlike the lattes; milder and grassier than the Genmaicha Latté.",
    faqs: [
      { q: "How much is a ZUS Matcha Latté?", a: "Around RM 11.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Does the Matcha Latté have coffee?", a: "No — it's green tea (matcha) with milk, so it's lower in caffeine than coffee." },
    ],
  },
  {
    slug: "creamy-mango",
    name: "ZUS Creamy Mango",
    keyword: "zus creamy mango",
    price: "RM 11.90",
    calories: "~210 kcal (regular)",
    intro: "Creamy Mango is ZUS's fruity non-coffee blend — sweet mango and cream, cold and dessert-like.",
    about: [
      "A caffeine-free crowd-pleaser: ripe mango flavour blended creamy and cold, somewhere between a smoothie and a milkshake. The pick for kids, non-coffee drinkers, or a hot-day treat.",
      "Sweet, tropical and refreshing — an easy 'something for everyone' order.",
    ],
    troll: "Not every ZUS order is coffee — but every one of them is missing a page. Searching 'ZUS Creamy Mango' gets you delivery apps, not ZUS. We made the page their menu pretends doesn't need to exist. 🥭",
    taste: "Sweet, creamy, tropical — blended mango and cream.",
    compare: "Caffeine-free, unlike the coffees; sweeter and fruitier than the Matcha Latté.",
    faqs: [
      { q: "How much is a ZUS Creamy Mango?", a: "Around RM 11.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Does Creamy Mango have caffeine?", a: "No — it's a fruit-based blended drink with no coffee." },
    ],
  },
  {
    slug: "hot-chocolate",
    name: "ZUS Hot Chocolate",
    keyword: "zus hot chocolate",
    price: "RM 10.90",
    calories: "~280 kcal (regular)",
    intro: "ZUS's Hot Chocolate is rich melted chocolate and steamed milk — no coffee, just cosy.",
    about: [
      "The comfort order: proper chocolate and milk, warm and rich, for the non-coffee crowd or anyone who just wants a cosy cup. A frequent choice for kids and chocolate lovers.",
      "Sweet, smooth and essentially caffeine-free, bar a trace from the cocoa.",
    ],
    troll: "Even the kid-friendly hot chocolate doesn't get a page. ZUS's website is so allergic to product pages that a cup of warm chocolate is invisible to Google. Here's its page — you're welcome, future cold evenings. 🍫",
    taste: "Rich, sweet, cosy — melted chocolate and milk.",
    compare: "No coffee, unlike the Café Mocha; sweeter and richer than most lattes.",
    faqs: [
      { q: "How much is a ZUS Hot Chocolate?", a: "Around RM 10.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "Does Hot Chocolate have coffee?", a: "No — it's chocolate and milk, essentially caffeine-free." },
    ],
  },
  {
    slug: "genmaicha-latte",
    name: "ZUS Genmaicha Latté",
    keyword: "zus genmaicha latte",
    price: "RM 11.90",
    calories: "~180 kcal (regular)",
    intro: "The Genmaicha Latté is ZUS's toasty Japanese green-tea latte — green tea blended with roasted brown rice and milk.",
    about: [
      "Genmaicha pairs green tea with roasted brown rice, giving a nutty, toasty, popcorn-like aroma. ZUS turns it into a milky latte — earthy and comforting, a more unusual non-coffee pick.",
      "For the tea-curious who find plain matcha too grassy; the roasted rice rounds it out.",
    ],
    troll: "It's a genuinely interesting drink — toasty Japanese tea, the kind of thing you'd Google to learn about. ZUS gives that curiosity nothing to land on. So the explainer lives here, on a marketing agency's site. 🌾",
    taste: "Toasty, nutty, mellow — roasted green tea with milk.",
    compare: "Nuttier and toastier than the Matcha Latté; non-coffee, unlike the lattes.",
    faqs: [
      { q: "How much is a ZUS Genmaicha Latté?", a: "Around RM 11.90 for a regular (indicative — confirm in-store or on the app)." },
      { q: "What is genmaicha?", a: "Green tea blended with roasted brown rice, giving a nutty, toasty flavour — and it's caffeine-light versus coffee." },
    ],
  },
  {
    slug: "butter-croissant",
    name: "ZUS Butter Croissant",
    keyword: "zus butter croissant",
    price: "RM 6.90",
    calories: "~300 kcal (each)",
    intro: "ZUS's Butter Croissant is the classic flaky, buttery pastry — the default pairing for any of their coffees.",
    about: [
      "A proper croissant: laminated, flaky, buttery, best slightly warm. It's the go-to food order to go with a Spanish Latte or an Americano.",
      "Simple, familiar, and a frequent add-on — which is exactly why people check the price.",
    ],
    troll: "ZUS sells food, but their website treats pastries like a state secret — no page, no prices, nothing. So yes, a digital marketing agency now has a better croissant page than the coffee chain. We're as surprised as you. 🥐",
    taste: "Flaky, buttery, light — classic croissant.",
    compare: "Plainer and less sweet than the Almond Croissant; not a dessert like the cookie.",
    faqs: [
      { q: "How much is a ZUS Butter Croissant?", a: "Around RM 6.90 each (indicative — confirm in-store or on the app)." },
      { q: "Is it good with ZUS coffee?", a: "Yes — the buttery, plain croissant pairs with just about any drink on the menu." },
    ],
  },
  {
    slug: "almond-croissant",
    name: "ZUS Almond Croissant",
    keyword: "zus almond croissant",
    price: "RM 8.90",
    calories: "~420 kcal (each)",
    intro: "The Almond Croissant is ZUS's richer pastry — a buttery croissant filled with almond cream and topped with flaked almonds.",
    about: [
      "More dessert than breakfast: almond frangipane inside, toasted almond flakes and a dusting of sugar on top. Sweeter and heavier than the plain croissant.",
      "The order for when coffee deserves a proper treat alongside it.",
    ],
    troll: "The fancier croissant, the higher price — and still no page to be found on ZUS's site. We itemised the pastry case they won't. Search 'ZUS almond croissant' and the agency shows up before the café does. 🌰",
    taste: "Sweet, nutty, rich — almond cream in a buttery croissant.",
    compare: "Sweeter and heavier than the Butter Croissant; more pastry than the cookie.",
    faqs: [
      { q: "How much is a ZUS Almond Croissant?", a: "Around RM 8.90 each (indicative — confirm in-store or on the app)." },
      { q: "Is the Almond Croissant sweet?", a: "Yes — the almond-cream filling and sugar topping make it a sweet, dessert-style pastry." },
    ],
  },
  {
    slug: "chocolate-chip-cookie",
    name: "ZUS Chocolate Chip Cookie",
    keyword: "zus chocolate chip cookie",
    price: "RM 5.90",
    calories: "~250 kcal (each)",
    intro: "ZUS's Chocolate Chip Cookie is the classic soft-baked cookie loaded with chocolate chips — the cheap, easy coffee sidekick.",
    about: [
      "A thick, soft chocolate-chip cookie — sweet, chocolatey and made to dunk. The grab-and-go treat next to the register.",
      "Cheapest item on the menu and a frequent impulse add-on with any drink.",
    ],
    troll: "It's a RM 5.90 cookie. It will never need SEO. And yet here it is with a cleaner, faster page than 880 of ZUS's real ones — because we built the whole menu the way a website should be built. Even the cookie. 🍪",
    taste: "Sweet, soft, chocolatey — classic chocolate-chip cookie.",
    compare: "A baked dessert, not a pastry like the croissants; the most affordable treat on the menu.",
    faqs: [
      { q: "How much is a ZUS Chocolate Chip Cookie?", a: "Around RM 5.90 each — usually the cheapest item on the menu (indicative)." },
      { q: "Is it good with coffee?", a: "Yes — a sweet, soft cookie made for dunking into any ZUS drink." },
    ],
  },
];

export const getDrink = (slug?: string) => zusDrinks.find((d) => d.slug === slug);
export const drinkSlugs = zusDrinks.map((d) => d.slug);
