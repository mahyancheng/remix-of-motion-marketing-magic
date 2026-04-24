import { jsx, jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { C as Cover } from "../entry-ssg.js";
import "react-router-dom/server.mjs";
import "react-dom/server";
import "react";
import "@radix-ui/react-navigation-menu";
import "class-variance-authority";
import "lucide-react";
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
const CTASection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-gradient-to-r from-accent via-accent/80 to-background text-foreground", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 md:px-6", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "max-w-3xl mx-auto text-center",
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      viewport: { once: true },
      children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-background", children: [
          "Build your custom software at",
          " ",
          /* @__PURE__ */ jsx(Cover, { particleColor: "#000000", children: "warp speed" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg mb-8 text-background/80", children: "While your competitors automate and scale, you're still copy-pasting. Talk to our team and get a tailored plan from a trusted software development company in Malaysia." }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-4", children: /* @__PURE__ */ jsx(Link, { to: "/contact/", children: /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsx("span", { className: "bg-foreground text-background px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity inline-block", children: "Schedule a Consultation" }) }) }) })
      ]
    }
  ) }) });
};
export {
  CTASection as default
};
