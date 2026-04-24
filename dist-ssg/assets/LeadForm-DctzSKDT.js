import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronDown, Flame, X } from "lucide-react";
import { P as PhoneInput, C as Cover } from "../entry-ssg.js";
import "react-router-dom/server.mjs";
import "react-dom/server";
import "react-router-dom";
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
const serviceLabels = {
  "": "Select a Service",
  seo: "SEO — I'm invisible on Google",
  social: "Social Media Ads — I need leads NOW",
  order: "Custom Software — I need to automate",
  other: "Other — Let's talk"
};
const LeadForm = ({
  heading = "Tell Us What's Broken",
  subheading = "We'll tell you exactly how to fix it — for free. No obligations.",
  defaultService = ""
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: defaultService,
    message: ""
  });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };
  const handleServiceChange = (value) => {
    setFormData((prev) => ({ ...prev, service: value }));
    setIsServicePickerOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }
      );
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error("Error sending form:", err);
    }
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", service: defaultService, message: "" });
    }, 3e3);
  };
  return /* @__PURE__ */ jsxs("section", { className: "py-12 md:py-16 bg-secondary", children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 md:px-6", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "max-w-xl md:max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-card border border-border",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true },
        children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-3xl font-bold font-display mb-2 md:mb-4 text-foreground", children: heading }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: subheading }),
          submitted ? /* @__PURE__ */ jsxs(motion.div, { className: "bg-green-800/30 border border-green-600 rounded-lg p-6 text-center", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-12 w-12 text-green-500 mx-auto mb-4" }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-bold mb-2 text-foreground", children: "We're On It!" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: "Expect a response within 4 hours. Your competitors should be worried." })
          ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 md:space-y-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 md:gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Your Name" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    id: "name",
                    required: true,
                    value: formData.name,
                    onChange: handleChange,
                    placeholder: "John Doe",
                    className: "w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Your Email" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    id: "email",
                    required: true,
                    value: formData.email,
                    onChange: handleChange,
                    placeholder: "john@example.com",
                    className: "w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "phone", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Phone Number" }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-muted rounded-md border border-border px-2 py-1.5", children: /* @__PURE__ */ jsx(PhoneInput, { id: "phone", value: formData.phone, onChange: handlePhoneChange }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "company", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Company Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "company",
                  value: formData.company,
                  onChange: handleChange,
                  placeholder: "Your Company",
                  className: "w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "md:hidden", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "What's Your Biggest Problem?" }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setIsServicePickerOpen(true),
                  className: "w-full bg-muted text-foreground px-3 py-2.5 rounded-md border border-border flex items-center justify-between text-sm",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: serviceLabels[formData.service] ?? "Select a Service" }),
                    /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "hidden md:block", children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "service", className: "block text-sm font-medium text-muted-foreground mb-1", children: "What's Your Biggest Problem?" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "service",
                  value: formData.service,
                  onChange: handleChange,
                  className: "w-full bg-muted text-foreground px-4 py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm md:text-base",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select a Service" }),
                    /* @__PURE__ */ jsx("option", { value: "seo", children: "SEO — I'm invisible on Google" }),
                    /* @__PURE__ */ jsx("option", { value: "social", children: "Social Media Ads — I need leads NOW" }),
                    /* @__PURE__ */ jsx("option", { value: "order", children: "Custom Software — I need to automate" }),
                    /* @__PURE__ */ jsx("option", { value: "other", children: "Other — Let's talk" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Tell Us About Your Project" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "message",
                  rows: 4,
                  required: true,
                  value: formData.message,
                  onChange: handleChange,
                  placeholder: "What processes do you want to automate? What's slowing your team down?",
                  className: "w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "w-full accent-gradient text-accent-foreground px-4 py-3 rounded-md font-bold hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(Flame, { className: "h-5 w-5" }),
              "Get My Free Quote"
            ] }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Free. No credit card. Response within 4 hours." })
          ] })
        ] })
      }
    ) }),
    isServicePickerOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-background/60 md:hidden", children: /* @__PURE__ */ jsxs(motion.div, { initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "What's Your Biggest Problem?" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "text-muted-foreground", onClick: () => setIsServicePickerOpen(false), children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: ["seo", "social", "order", "other"].map((val) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => handleServiceChange(val),
          className: "w-full text-left px-3 py-2 rounded-md bg-muted hover:bg-muted/70 text-sm text-foreground",
          children: serviceLabels[val]
        },
        val
      )) })
    ] }) })
  ] });
};
export {
  LeadForm as default
};
