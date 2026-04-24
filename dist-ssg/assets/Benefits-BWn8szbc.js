import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
const BenefitsSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center mb-8",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
            "Off-the-Shelf Software vs ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Custom-Built" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "Generic software forces you to change your workflow. Custom software fits YOUR workflow — and grows with your business." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "rounded-2xl border border-destructive/20 bg-card p-6 shadow-card",
          initial: { opacity: 0, x: -30 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.5 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1", children: [
              /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-destructive" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-destructive", children: "Off-the-Shelf Software" })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: [
              "Paying for 100 features you don't use",
              "Monthly subscriptions that never end",
              "Forces your team to change their workflow",
              "No competitive advantage — competitors use the same tool",
              "Data trapped in someone else's system"
            ].map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start text-muted-foreground", children: [
              /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-destructive mt-1 mr-3 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: item })
            ] }, i)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "rounded-2xl border border-accent/30 bg-card p-6 shadow-card shadow-glow",
          initial: { opacity: 0, x: 30 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.1 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-accent", children: "Custom Software by Leadzap" })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: [
              "Every feature built for YOUR exact workflow",
              "One-time investment that pays for itself in months",
              "Your team works faster from day one — zero learning curve",
              "Unique competitive advantage nobody can copy",
              "Your data, your system, your rules"
            ].map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start text-foreground", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent mt-1 mr-3 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: item })
            ] }, i)) })
          ]
        }
      )
    ] })
  ] }) });
};
export {
  BenefitsSection as default
};
