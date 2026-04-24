import { jsx, jsxs } from "react/jsx-runtime";
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { c as cn } from "../entry-ssg.js";
import "react-router-dom/server.mjs";
import "react-dom/server";
import "react-router-dom";
import "framer-motion";
import "@radix-ui/react-navigation-menu";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@tsparticles/react";
import "@tsparticles/slim";
import "react-fast-compare";
import "invariant";
import "shallowequal";
import "@supabase/supabase-js";
import "@radix-ui/react-tabs";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-toast";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Item,
  {
    ref,
    className: cn("border-b", className),
    ...props
  }
));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const FAQSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-6 text-center text-foreground", children: "Questions We Get Asked Every Week" }),
    /* @__PURE__ */ jsxs(
      Accordion,
      {
        type: "single",
        collapsible: true,
        className: "w-full max-w-md md:max-w-3xl mx-auto space-y-1",
        children: [
          /* @__PURE__ */ jsxs(AccordionItem, { value: "q1", className: "border-border", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground", children: '"How much does custom software cost?"' }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed", children: "It depends on complexity, but here's the truth: custom software costs less than you think when you factor in the cost of NOT having it. Manual errors, wasted hours, lost leads — those are the real expenses. We offer flexible pricing and can start with an MVP to prove ROI before scaling." })
          ] }),
          /* @__PURE__ */ jsxs(AccordionItem, { value: "q2", className: "border-border", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground", children: '"How long does it take to build?"' }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed", children: "Most MVPs launch in 6-8 weeks. Full systems take 3-6 months. But here's the key: every week you delay, your competitor with automated systems gets further ahead. We can start with a prototype in 2 weeks so you see progress immediately." })
          ] }),
          /* @__PURE__ */ jsxs(AccordionItem, { value: "q3", className: "border-border", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground", children: '"What if I already use off-the-shelf software?"' }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed", children: "We integrate with everything — your existing CRM, ERP, accounting software, payment gateways. You don't have to rip and replace. We build systems that connect your existing tools and fill the gaps." })
          ] }),
          /* @__PURE__ */ jsxs(AccordionItem, { value: "q4", className: "border-border", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground", children: '"Are you really a software company in Malaysia?"' }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed", children: "Yes. We're based in Malaysia, we understand Malaysian business workflows, local compliance, and we communicate in your timezone. No offshore guessing games." })
          ] }),
          /* @__PURE__ */ jsxs(AccordionItem, { value: "q5", className: "border-border", children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "hover:text-accent hover:no-underline text-xs sm:text-sm md:text-base py-3 md:py-4 text-foreground", children: '"What happens after launch?"' }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed", children: "We don't disappear. We provide ongoing support, monitoring, and optimization. As your business grows, your software grows with it. Think of us as your long-term technology partner, not a one-time vendor." })
          ] })
        ]
      }
    )
  ] }) });
};
export {
  FAQSection as default
};
