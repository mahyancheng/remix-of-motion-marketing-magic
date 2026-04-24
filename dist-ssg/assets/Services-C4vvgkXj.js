import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
const items = [
  {
    title: "Healthcare Software Solutions",
    pain: "Still managing patient records on paper?",
    desc: "Patient management systems, appointment booking, electronic health records, and HIPAA-compliant platforms that eliminate errors and save hours daily."
  },
  {
    title: "ERP Systems",
    pain: "Drowning in disconnected spreadsheets?",
    desc: "Enterprise resource planning systems for inventory, finance, HR, and operations — all in one place, talking to each other."
  },
  {
    title: "Customer Help Desk Platforms",
    pain: "Customers waiting hours for a response?",
    desc: "Ticketing systems, live chat solutions, and customer support automation that resolve issues 3x faster."
  },
  {
    title: "Business Automation Software",
    pain: "Your team doing the same task 50 times a day?",
    desc: "Workflow automation, document processing, and task management systems that eliminate manual overhead and human errors."
  },
  {
    title: "CRM & Sales Systems",
    pain: "Losing track of leads and forgetting follow-ups?",
    desc: "Customer relationship management platforms like our flagship Howkee CRM — never lose a lead again."
  },
  {
    title: "Building Automation System Software",
    pain: "Energy bills through the roof?",
    desc: "IoT-enabled monitoring and control systems to optimize building efficiency and cut energy costs by 20-40%."
  }
];
const ServicesSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-10 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center mb-6",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
            "We Build the Systems Your Business ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Actually Needs" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "End-to-end custom software by a software company in Malaysia. We don't sell features — we solve problems." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: items.map((item, i) => /* @__PURE__ */ jsxs(
      motion.article,
      {
        className: "group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 flex flex-col h-full",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: i * 0.05 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive font-medium mb-2 italic", children: item.pain }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-semibold mb-2 text-accent min-h-[48px]", children: item.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-md text-muted-foreground flex-grow", children: item.desc })
        ]
      },
      item.title
    )) }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "mt-10 rounded-2xl border border-accent/30 bg-card p-6 shadow-card shadow-glow",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.3 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-display font-bold mb-6 text-accent", children: "Featured Project: Howkee CRM" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm md:text-md text-muted-foreground mb-2", children: [
                /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "The Problem:" }),
                " A Malaysian sales team was losing 40% of leads because follow-ups fell through the cracks."
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm md:text-md text-muted-foreground mb-4", children: [
                /* @__PURE__ */ jsx("strong", { className: "text-accent", children: "The Result:" }),
                " Howkee CRM automated their pipeline, and they recovered RM200K in lost revenue within 3 months."
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "✓" }),
                  /* @__PURE__ */ jsx("span", { children: "Customer lifecycle management" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "✓" }),
                  /* @__PURE__ */ jsx("span", { children: "Sales pipeline automation" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "✓" }),
                  /* @__PURE__ */ jsx("span", { children: "Multi-language support (English/Malay/Chinese)" })
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "✓" }),
                  /* @__PURE__ */ jsx("span", { children: "Integration with Malaysian banking systems" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
                alt: "Howkee CRM Dashboard",
                className: "rounded-lg w-full"
              }
            ) })
          ] })
        ]
      }
    )
  ] }) });
};
export {
  ServicesSection as default
};
