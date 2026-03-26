import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { StaticRouter } from "react-router-dom/server.mjs";
import { renderToString } from "react-dom/server";
import { Link, useLocation, useNavigate, useParams, Navigate, Routes, Route } from "react-router-dom";
import * as React from "react";
import { useState, useId, useEffect, useCallback, useMemo, useRef, createContext, useContext, lazy, Suspense } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown, MoveRight, PhoneCall, Menu, AlertTriangle, Zap, X, CheckCircle, Flame, ArrowUpRight, Search, Megaphone, CodeXml, ShieldAlert, Clock, BarChart2, AlertCircle, ArrowLeft, Home, Calendar, User, ArrowRight, Target, Globe, TrendingUp, LineChart, Facebook, Youtube, Instagram, Users, ShoppingCart, Package, Settings, Phone, Mail, Share2, FileText, PlusCircle, Edit, Trash2, PenTool, Monitor, Camera, Eye, MousePointer, Sparkles, BarChart3, Rocket, Crown, Check, Calculator, DollarSign, HelpCircle, MessageCircle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { createClient } from "@supabase/supabase-js";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { useTheme } from "next-themes";
import { Toaster as Toaster$2 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const HeroBackground = () => /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" }),
  /* @__PURE__ */ jsx("div", { className: "absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" })
] });
const Logo = "/assets/Logo-BtIJ7fab.webp";
const Footer = () => {
  return /* @__PURE__ */ jsx("footer", { className: "bg-background text-foreground py-8 lg:py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: Logo,
            alt: "Leadzap Marketing - Top Digital Marketing Agency Malaysia",
            className: "h-8 md:h-10 mb-3 md:mb-4"
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mb-3 md:mb-4 text-sm md:text-base text-muted-foreground", children: "Leadzap is a top digital marketing agency Malaysia trusted for SEO services pricing Malaysia, social media marketing Malaysia, and Google Ads agency Malaysia solutions." }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Digital marketing Kuala Lumpur • Malaysia SEO consultant • Free SEO analysis Malaysia" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base md:text-lg font-semibold mb-3 md:mb-4", children: "Company" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-1.5 md:space-y-2 text-sm md:text-base", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/", className: "hover:text-accent hover:no-underline", children: "Home" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/corporate-profile/", className: "hover:text-accent hover:no-underline", children: "Company Profile" }) }),
          /* @__PURE__ */ jsx("li", { className: "font-medium mt-1", children: "Services" }),
          /* @__PURE__ */ jsx("li", { className: "ml-3", children: /* @__PURE__ */ jsx("a", { href: "/sem/", className: "hover:text-accent hover:no-underline", children: "SEO Services Malaysia" }) }),
          /* @__PURE__ */ jsx("li", { className: "ml-3", children: /* @__PURE__ */ jsx("a", { href: "/social-media-ads/", className: "hover:text-accent hover:no-underline", children: "Social Media Marketing Malaysia" }) }),
          /* @__PURE__ */ jsx("li", { className: "ml-3", children: /* @__PURE__ */ jsx("a", { href: "/custom-software/", className: "hover:text-accent hover:no-underline", children: "Custom Software Development" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/blog/", className: "hover:text-accent hover:no-underline", children: "Blog" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/contact/", className: "hover:text-accent hover:no-underline", children: "Contact Us" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base md:text-lg font-semibold mb-3 md:mb-4", children: "Get In Touch" }),
        /* @__PURE__ */ jsx("p", { className: "mb-1 text-sm md:text-base", children: /* @__PURE__ */ jsx("a", { href: "mailto:sales@leadzap.com.my", className: "hover:text-accent hover:no-underline", children: "sales@leadzap.com.my" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base", children: /* @__PURE__ */ jsx("a", { href: "tel:+601111335119", className: "hover:text-accent hover:no-underline", children: "+60-111-1335119" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: "Based in Kuala Lumpur, Malaysia. Serving clients nationwide." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-foreground/20 mt-8 md:mt-12 pt-4 md:pt-6 text-xs md:text-sm text-center text-muted-foreground", children: "Copyright © 2025 | Powered by Leadzap Sdn Bhd | Top Digital Marketing Agency Malaysia" })
  ] }) });
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Root,
  {
    ref,
    className: cn(
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(NavigationMenuViewport, {})
    ]
  }
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;
const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.List,
  {
    ref,
    className: cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    ),
    ...props
  }
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;
const NavigationMenuItem = NavigationMenuPrimitive.Item;
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);
const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  NavigationMenuPrimitive.Trigger,
  {
    ref,
    className: cn(navigationMenuTriggerStyle(), "group", className),
    ...props,
    children: [
      children,
      " ",
      /* @__PURE__ */ jsx(
        ChevronDown,
        {
          className: "relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180",
          "aria-hidden": "true"
        }
      )
    ]
  }
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;
const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Content,
  {
    ref,
    className: cn(
      "left-0 top-0 data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute w-auto",
      className
    ),
    ...props
  }
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;
const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: cn("absolute left-0 top-full flex justify-center"), children: /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Viewport,
  {
    className: cn(
      "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]",
      className
    ),
    ref,
    ...props
  }
) }));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;
const NavigationMenuIndicator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  NavigationMenuPrimitive.Indicator,
  {
    ref,
    className: cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: "relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" })
  }
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;
const DynamicActionBar = React.forwardRef(({ actions, className, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const activeAction = activeIndex !== null ? actions[activeIndex] : null;
  const BUTTON_BAR_HEIGHT = 60;
  const containerAnimate = activeAction ? {
    width: activeAction.dimensions.width,
    height: activeAction.dimensions.height + BUTTON_BAR_HEIGHT
  } : {
    width: 460,
    height: BUTTON_BAR_HEIGHT
  };
  const transition = { type: "spring", stiffness: 400, damping: 35 };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: `relative ${className ?? ""}`,
      onMouseLeave: () => setActiveIndex(null),
      ...props,
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "flex flex-col overflow-hidden rounded-2xl bg-black/5 backdrop-blur-xl",
          animate: containerAnimate,
          transition,
          initial: { width: 420, height: BUTTON_BAR_HEIGHT },
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "flex flex-shrink-0 items-center justify-center gap-2 px-2",
                style: { height: `${BUTTON_BAR_HEIGHT}px` },
                children: actions.map((action, index) => {
                  const Icon = action.icon;
                  return /* @__PURE__ */ jsxs(
                    Link,
                    {
                      to: action.to,
                      onMouseEnter: () => setActiveIndex(index),
                      className: "flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-white transition-colors duration-300 hover:bg-white/10 hover:text-yellow-400",
                      children: [
                        /* @__PURE__ */ jsx(Icon, { className: "size-6 text-yellow-400" }),
                        /* @__PURE__ */ jsx("span", { className: "font-bold w-full", children: action.label })
                      ]
                    },
                    action.id
                  );
                })
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "flex-grow overflow-hidden", children: /* @__PURE__ */ jsx(AnimatePresence, { children: activeAction && /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "w-full",
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.2, delay: 0.1 },
                children: activeAction.content
              }
            ) }) })
          ]
        }
      )
    }
  );
});
DynamicActionBar.displayName = "DynamicActionBar";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-input bg-background hover:bg-secondary hover:border-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "accent-gradient text-accent-foreground hover:opacity-90 shadow-glow animate-pulse-glow",
        hero: "accent-gradient text-accent-foreground hover:opacity-90 shadow-glow text-base font-bold tracking-wide",
        "hero-outline": "border-2 border-accent/30 bg-transparent text-accent-foreground hover:bg-accent/10 text-base font-bold tracking-wide"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-12 rounded-lg px-8",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const SparklesCore = (props) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity
  } = props;
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  const particlesLoaded = useCallback(async (container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: { duration: 1 }
      });
    }
  }, [controls]);
  const memoizedOptions = useMemo(() => ({
    background: {
      color: { value: background || "transparent" }
    },
    fullScreen: { enable: false, zIndex: 1 },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: false, mode: "repulse" },
        resize: true
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 }
      }
    },
    particles: {
      bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
      collisions: { enable: false },
      color: { value: particleColor || "#ffffff" },
      move: {
        enable: true,
        direction: "none",
        outModes: { default: "out" },
        random: false,
        speed: { min: 0.1, max: 1 },
        straight: false
      },
      number: {
        density: { enable: true, width: 400, height: 400 },
        value: particleDensity || 120
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: speed || 4,
          sync: false,
          startValue: "random"
        }
      },
      shape: { type: "circle" },
      size: {
        value: { min: minSize || 1, max: maxSize || 3 }
      }
    },
    detectRetina: true
  }), [background, particleColor, particleDensity, speed, minSize, maxSize]);
  return /* @__PURE__ */ jsx(motion.div, { animate: controls, className: cn("opacity-0", className), children: init && /* @__PURE__ */ jsx(
    Particles,
    {
      id: id || generatedId,
      className: "h-full w-full",
      particlesLoaded,
      options: memoizedOptions
    }
  ) });
};
const Cover = ({
  children,
  className,
  variant = "text",
  particleColor
}) => {
  const [hovered, setHovered] = useState(false);
  const isButton = variant === "button";
  const isActive = isButton || hovered;
  const isText = variant === "text";
  const resolvedColor = particleColor ?? (isButton ? "hsl(var(--accent))" : "#FBBF24");
  const ref = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState([]);
  useEffect(() => {
    if (ref.current) {
      setContainerWidth(ref.current.clientWidth ?? 0);
      const height = ref.current.clientHeight ?? 0;
      const numberOfBeams = Math.floor(height / 10);
      const positions = Array.from(
        { length: numberOfBeams },
        (_, i) => (i + 1) * (height / (numberOfBeams + 1))
      );
      setBeamPositions(positions);
    }
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onMouseEnter: () => !isText && setHovered(true),
      onMouseLeave: () => !isText && setHovered(false),
      ref,
      className: cn(
        "relative group/cover inline-block transition duration-200",
        isButton ? "bg-transparent hover:bg-transparent p-0 rounded-lg w-full" : "bg-transparent px-2 py-2 rounded-sm",
        className
      ),
      children: [
        isButton && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute inset-0 rounded-lg pointer-events-none",
              animate: {
                boxShadow: [
                  "0 0 8px 1px hsl(var(--accent) / 0.4), inset 0 0 8px 1px hsl(var(--accent) / 0.1)",
                  "0 0 16px 2px hsl(var(--accent) / 0.6), inset 0 0 12px 2px hsl(var(--accent) / 0.15)",
                  "0 0 8px 1px hsl(var(--accent) / 0.4), inset 0 0 8px 1px hsl(var(--accent) / 0.1)"
                ]
              },
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              style: {
                border: "1.5px solid hsl(var(--accent) / 0.6)"
              }
            }
          ),
          /* @__PURE__ */ jsx(CircleIcon, { className: "absolute -right-[2px] -top-[2px]" }),
          /* @__PURE__ */ jsx(CircleIcon, { className: "absolute -bottom-[2px] -right-[2px]", delay: 0.4 }),
          /* @__PURE__ */ jsx(CircleIcon, { className: "absolute -left-[2px] -top-[2px]", delay: 0.8 }),
          /* @__PURE__ */ jsx(CircleIcon, { className: "absolute -bottom-[2px] -left-[2px]", delay: 1.6 })
        ] }),
        /* @__PURE__ */ jsx(AnimatePresence, { children: (isActive || isText) && /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { opacity: { duration: 0.2 } },
            className: cn(
              "h-full w-full overflow-hidden absolute inset-0",
              isButton && "rounded-lg opacity-70"
            ),
            children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                animate: { translateX: ["-50%", "0%"] },
                transition: { translateX: { duration: 10, ease: "linear", repeat: Infinity } },
                className: "w-[200%] h-full flex",
                children: [
                  /* @__PURE__ */ jsx(
                    SparklesCore,
                    {
                      background: "transparent",
                      minSize: 0.4,
                      maxSize: 1,
                      particleDensity: 500,
                      className: "w-full h-full",
                      particleColor: resolvedColor
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    SparklesCore,
                    {
                      background: "transparent",
                      minSize: 0.4,
                      maxSize: 1,
                      particleDensity: 500,
                      className: "w-full h-full",
                      particleColor: resolvedColor
                    }
                  )
                ]
              }
            )
          }
        ) }),
        beamPositions.map((position, index) => /* @__PURE__ */ jsx(
          Beam,
          {
            hovered: isActive || isText,
            duration: Math.random() * 2 + 1,
            delay: Math.random() * 2 + 1,
            width: containerWidth,
            className: cn("pointer-events-none", isButton && "opacity-70"),
            style: { top: `${position}px` }
          },
          index
        )),
        isButton ? /* @__PURE__ */ jsx(
          motion.div,
          {
            animate: {
              scale: hovered ? 0.97 : 1,
              x: hovered ? [0, -2, 2, -2, 2, 0] : [0, -0.5, 0.5, -0.5, 0.5, 0],
              y: hovered ? [0, 2, -2, 2, -2, 0] : [0, -0.5, 0.5, -0.5, 0.5, 0]
            },
            transition: {
              duration: 0.3,
              x: { duration: hovered ? 0.3 : 1.5, repeat: Infinity, repeatType: "loop" },
              y: { duration: hovered ? 0.3 : 1.5, repeat: Infinity, repeatType: "loop" },
              scale: { duration: 0.2 }
            },
            className: "relative z-20 [&_button]:!bg-transparent [&_button]:!border-0 [&_button]:!shadow-none [&_button]:!text-accent [&_button:hover]:!bg-transparent [&_button:focus]:!bg-transparent [&_button]:!bg-none",
            children
          },
          String(hovered)
        ) : /* @__PURE__ */ jsx(
          motion.span,
          {
            animate: {
              scale: 0.8,
              x: [0, -30, 30, -30, 30, 0],
              y: [0, 30, -30, 30, -30, 0]
            },
            transition: {
              duration: 0.2,
              x: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
              y: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
              scale: { duration: 0.2 }
            },
            className: "dark:text-white inline-block text-foreground relative z-20 text-accent transition duration-200",
            children
          }
        )
      ]
    }
  );
};
const Beam = ({
  className,
  delay,
  duration,
  hovered,
  width = 600,
  ...svgProps
}) => {
  const id = useId();
  return /* @__PURE__ */ jsxs(
    motion.svg,
    {
      width: width ?? "600",
      height: "1",
      viewBox: `0 0 ${width ?? "600"} 1`,
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      className: cn("absolute inset-x-0 w-full", className),
      ...svgProps,
      children: [
        /* @__PURE__ */ jsx(
          motion.path,
          {
            d: `M0 0.5H${width ?? "600"}`,
            stroke: `url(#svgGradient-${id})`
          }
        ),
        /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs(
          motion.linearGradient,
          {
            id: `svgGradient-${id}`,
            gradientUnits: "userSpaceOnUse",
            initial: { x1: "0%", x2: hovered ? "-10%" : "-5%", y1: 0, y2: 0 },
            animate: { x1: hovered ? "110%" : "105%", x2: "100%", y1: 0, y2: 0 },
            transition: { duration: hovered ? 0.5 : duration ?? 2, ease: "linear", repeat: Infinity, delay: hovered ? Math.random() * 1 : delay ?? 1, repeatDelay: hovered ? Math.random() * 2 : delay ?? 1 },
            children: [
              /* @__PURE__ */ jsx("stop", { stopColor: "#FBBF24", stopOpacity: "0" }),
              /* @__PURE__ */ jsx("stop", { stopColor: "#FBBF24" }),
              /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#F59E0B", stopOpacity: "0" })
            ]
          },
          String(hovered)
        ) })
      ]
    }
  );
};
const CircleIcon = ({
  className,
  delay
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        `pointer-events-none animate-pulse group-hover/cover:hidden`,
        className
      ),
      style: { animationDelay: `${delay || 0}s` },
      children: /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: "3",
          height: "3",
          viewBox: "0 0 3 3",
          fill: "none",
          children: /* @__PURE__ */ jsx("circle", { cx: "1", cy: "1", r: "1", className: "fill-accent" })
        }
      )
    }
  );
};
const DEFAULT_WORDS = ["automating", "scaling", "winning", "growing", "thriving"];
const DEFAULT_PRIMARY = { label: "Get Free Consultation", href: "/contact/" };
const DEFAULT_SECONDARY = { label: "See How It Works", href: "/custom-software/" };
function AnimatedHero({
  badge = "We build systems that print money",
  titlePrefix = "Your competitors are",
  rotatingWords = DEFAULT_WORDS,
  description = "Every hour your team wastes on manual processes is an hour your competitor uses to serve more customers, make fewer errors, and grow faster. We build custom software that ends the chaos.",
  primaryCTA = DEFAULT_PRIMARY,
  secondaryCTA = DEFAULT_SECONDARY
}) {
  const [titleNumber, setTitleNumber] = useState(0);
  const memoizedRotatingWords = useMemo(() => rotatingWords, [rotatingWords]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % memoizedRotatingWords.length);
    }, 1200);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, memoizedRotatingWords.length]);
  return /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-8 py-20 lg:py-40 items-center justify-center flex-col w-full min-w-0", children: [
    /* @__PURE__ */ jsx("div", { className: "w-full max-w-full min-w-0 flex justify-center px-1", children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "secondary",
        size: "sm",
        className: "h-auto min-h-9 max-w-full w-full gap-2 py-2.5 rounded-full sm:w-auto px-6",
        children: [
          /* @__PURE__ */ jsx("span", { className: "break-words font-medium", children: badge }),
          /* @__PURE__ */ jsx(SparklesIcon, { className: "h-4 w-4 shrink-0 text-accent" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-col items-center w-full", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-4xl sm:text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-black flex flex-col items-center leading-tight", children: [
        /* @__PURE__ */ jsx("span", { className: "text-accent", children: titlePrefix }),
        /* @__PURE__ */ jsxs("span", { className: "relative inline-flex items-center justify-center overflow-hidden w-full h-[1.1em] md:h-[1.2em]", children: [
          " ",
          /* @__PURE__ */ jsx(AnimatePresence, { mode: "popLayout", children: memoizedRotatingWords.map((word, index) => titleNumber === index && /* @__PURE__ */ jsx(
            motion.span,
            {
              className: "absolute font-semibold text-foreground text-2xl sm:text-3xl md:text-5xl tracking-normal whitespace-nowrap",
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -30 },
              transition: {
                y: { type: "spring", stiffness: 350, damping: 25 },
                opacity: { duration: 0.2 }
              },
              children: word.toUpperCase()
            },
            word
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center mt-4", children: description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center mt-6", children: [
      /* @__PURE__ */ jsx(Link, { to: secondaryCTA.href, className: "w-full sm:w-auto", children: /* @__PURE__ */ jsxs(Button, { size: "xl", className: "gap-4 w-full sm:w-auto", variant: "outline", children: [
        secondaryCTA.label,
        " ",
        /* @__PURE__ */ jsx(MoveRight, { className: "w-4 h-4" })
      ] }) }),
      /* @__PURE__ */ jsx(Link, { to: primaryCTA.href, className: "w-full sm:w-auto", children: /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs(Button, { size: "xl", className: "gap-4 w-full sm:w-auto", children: [
        /* @__PURE__ */ jsx(PhoneCall, { className: "w-4 h-4" }),
        primaryCTA.label
      ] }) }) })
    ] })
  ] }) }) });
}
function SparklesIcon({ className }) {
  return /* @__PURE__ */ jsx("svg", { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" }) });
}
const PushPullFramework = "/assets/Push-Pull-MarketingFrame-CN5WL2ul.webp";
const Workconnect = "/assets/workconnect-DQtU6Ril.webp";
const Tectone = "/assets/tectone-DsuhQtnR.webp";
const Puregen = "/assets/puregen-DW3bEBM7.webp";
const NAV_ACTIONS = [
  {
    id: "sem",
    to: "/sem/",
    label: "SEM",
    icon: Search,
    content: /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center", children: /* @__PURE__ */ jsx(Link, { to: "/sem/", className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-[95%] rounded-2xl py-3 px-3 transition duration-300 hover:bg-secondary", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "size-6 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: "Search Engine Marketing" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-accent", children: "Stop losing leads to competitors who rank above you. Our SEO & Google Ads put you first." })
    ] }) }) }),
    dimensions: { width: 500, height: 100 }
  },
  {
    id: "ads",
    to: "/social-media-ads/",
    label: "Social Media Marketing",
    icon: Megaphone,
    content: /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center", children: /* @__PURE__ */ jsx(Link, { to: "/social-media-ads/", className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-[95%] rounded-2xl py-3 px-3 transition duration-300 hover:bg-secondary", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(Megaphone, { className: "size-6 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: "Social Media Paid Ads" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-accent", children: "Your competitors are stealing your customers on social media right now. Let's fight back." })
    ] }) }) }),
    dimensions: { width: 500, height: 100 }
  },
  {
    id: "software",
    to: "/custom-software/",
    label: "Custom Software",
    icon: CodeXml,
    content: /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center", children: /* @__PURE__ */ jsx(Link, { to: "/custom-software/", className: "w-full", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto w-[95%] rounded-2xl py-3 px-3 transition duration-300 hover:bg-secondary", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(CodeXml, { className: "size-6 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: "Custom Software Solution" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-sm text-accent", children: "Still running your business on spreadsheets? Automate and scale with custom-built systems." })
    ] }) }) }),
    dimensions: { width: 500, height: 100 }
  }
];
const HERO_ROTATING_WORDS$6 = ["stealing your leads", "outranking you", "automating", "scaling faster", "winning"];
const HERO_PRIMARY_CTA$6 = { label: "Stop Losing Leads — Talk to Us Free", href: "/contact/" };
const HERO_SECONDARY_CTA$6 = { label: "See What You're Missing", href: "/custom-software/" };
const PAIN_POINTS_DATA$1 = [
  { icon: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-7 w-7" }), title: "Invisible Online?", description: "Your potential customers are searching for your services right now — but finding your competitors instead. Every missed click is a missed sale." },
  { icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-7 w-7" }), title: "Wasting Ad Budget?", description: "You've tried Facebook Ads or Google Ads but got nothing. Bad targeting, weak copy, no strategy — your money burned with zero ROI." },
  { icon: /* @__PURE__ */ jsx(Clock, { className: "h-7 w-7" }), title: "Stuck with Spreadsheets?", description: "While you manually track orders and chase invoices, your competitors are automating everything — and scaling 3x faster than you." },
  { icon: /* @__PURE__ */ jsx(BarChart2, { className: "h-7 w-7" }), title: "No Idea What's Working?", description: "You're spending money on marketing but can't tell what's driving revenue. No dashboard. No data. Just hope." }
];
const SOLUTIONS_DATA = [
  { title: "SEO Services Malaysia", description: "Your competitors are on page 1. You're not. Our free SEO analysis Malaysia reveals exactly why — and how to fix it fast." },
  { title: "Facebook Marketing Malaysia", description: "Stop boosting posts and hoping. Our data-driven Facebook marketing Malaysia campaigns target buyers, not browsers." },
  { title: "Google Ads Agency Malaysia", description: "Every wasted click costs you money. Our Google Ads Malaysia campaigns deliver leads at the lowest possible cost." },
  { title: "Social Media Marketing Malaysia", description: "Your audience scrolls past 300+ posts daily. We make sure they stop on yours — and take action." }
];
const WEBSITES_DATA = [
  { name: "WorkConnect", description: "From zero online presence to 200+ monthly leads in 4 months", url: "https://workconnect.com.my", image: Workconnect },
  { name: "Tectone Steel", description: "Went from page 10 to page 1 for 'steel supplier Malaysia'", url: "https://tectonesteel.com", image: Tectone },
  { name: "Puregen", description: "3x revenue growth through integrated digital marketing", url: "https://www.puregen.com.my", image: Puregen }
];
const SERVICE_ITEMS_DATA = [
  { emoji: "🎯", title: "Search Engine Marketing (SEM)", description: "Your competitor just ranked above you for your main keyword. Our free SEO audit shows you exactly how to take it back.", cta: "GET FREE SEO AUDIT →", link: "/sem/" },
  { emoji: "📱", title: "Social Media Marketing", description: "Your ideal customer just scrolled past a competitor's ad. We make sure the next ad they see is yours.", cta: "Steal Their Attention →", link: "/social-media-ads/" },
  { emoji: "💻", title: "Custom Software", description: "Still copy-pasting between 5 different tools? Your competitor just automated their entire workflow.", cta: "Automate Now →", link: "/custom-software/" },
  { emoji: "⚡", title: "Full Service Package", description: "Why hire 4 agencies when one can do it all? One team, one strategy, one dashboard — maximum results.", cta: "Get Full Package →", link: "/contact/" }
];
const CONTACT_SERVICE_OPTIONS = [
  { value: "", label: "Select a Service" },
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social Media Ads" },
  { value: "order", label: "Order Management System" },
  { value: "other", label: "Other" }
];
const BEFORE_ITEMS = [
  "Spending RM5,000/month on ads with zero trackable ROI",
  "Website buried on page 5 of Google",
  "Manually managing orders on WhatsApp and Excel",
  "Competitors outranking you for every keyword",
  "No idea which marketing channel actually works"
];
const AFTER_ITEMS = [
  "Every RM spent tracked to real revenue — 3-5x ROAS average",
  "Ranking #1 for high-intent keywords in your industry",
  "Automated systems handling orders, invoices & follow-ups",
  "Competitors wondering how you grew so fast",
  "Clear dashboard showing exactly what drives growth"
];
const Index = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(Hero$5, {}),
    /* @__PURE__ */ jsx(PainPoints$1, {}),
    /* @__PURE__ */ jsx(Framework, {}),
    /* @__PURE__ */ jsx(BeforeAfter, {}),
    /* @__PURE__ */ jsx(TotalDigitalSolutions, {}),
    /* @__PURE__ */ jsx(WebsiteDesign, {}),
    /* @__PURE__ */ jsx(Services$1, {}),
    /* @__PURE__ */ jsx(ContactForm$1, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const SideMenu = ({ isMenuOpen, toggleMenu, actions }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (to) => {
    if (to === "/" && currentPath === "/") return true;
    return currentPath === to;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `fixed inset-0 bg-black/70 z-[110] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`,
        onClick: toggleMenu
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `fixed top-0 right-0 h-full w-64 bg-primary/100 border-l border-border z-[120] transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "p-4 pt-6 flex justify-between items-center border-b border-border", children: [
            /* @__PURE__ */ jsx("span", { className: "text-primary-foreground font-bold text-lg", children: "Navigation" }),
            /* @__PURE__ */ jsx("button", { onClick: toggleMenu, className: "text-primary-foreground hover:text-accent p-1", children: /* @__PURE__ */ jsx(X, { className: "size-6" }) })
          ] }),
          /* @__PURE__ */ jsxs("nav", { className: "flex flex-col p-4 space-y-2 text-primary-foreground", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/",
                onClick: toggleMenu,
                className: `py-2 border-b border-border transition-colors ${isActive("/") ? "text-accent font-bold" : "hover:text-accent"}`,
                children: "Home"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-muted-foreground mb-2", children: "Services" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-2 pl-3", children: actions.map((action) => /* @__PURE__ */ jsx(
                Link,
                {
                  to: action.to,
                  onClick: toggleMenu,
                  className: `py-1 text-sm transition-colors ${isActive(action.to) ? "text-accent font-medium" : "hover:text-accent text-muted-foreground"}`,
                  children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                    action.icon && /* @__PURE__ */ jsx(action.icon, { className: "size-4" }),
                    action.label
                  ] })
                },
                action.id
              )) })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: "/blog/", onClick: toggleMenu, className: `py-2 border-t border-b border-border transition-colors ${isActive("/blog/") ? "text-accent font-bold" : "hover:text-accent"}`, children: "Blog" }),
            /* @__PURE__ */ jsx(Link, { to: "/corporate-profile/", onClick: toggleMenu, className: `py-2 border-b border-border transition-colors ${isActive("/corporate-profile/") ? "text-accent font-bold" : "hover:text-accent"}`, children: "Company Profile" }),
            /* @__PURE__ */ jsx(Link, { to: "/contact/", onClick: toggleMenu, className: `py-2 border-b border-border transition-colors ${isActive("/contact/") ? "text-accent font-bold" : "hover:text-accent"}`, children: "Contact Us" }),
            /* @__PURE__ */ jsx("div", { className: "mt-auto pt-4 border-t border-border", children: /* @__PURE__ */ jsx(Link, { to: "/contact/", onClick: toggleMenu, children: /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", className: "w-full", children: "Get Started" }) }) }) })
          ] })
        ]
      }
    )
  ] });
};
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (!isMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMenuOpen]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: `fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-primary/95 shadow-lg backdrop-blur-md py-2" : "bg-transparent py-4"}`,
        children: /* @__PURE__ */ jsxs("div", { className: "relative container mx-auto px-4 md:px-6 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx("img", { src: Logo, alt: "Leadzap Marketing", className: "h-8 md:h-10" }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2", children: [
            /* @__PURE__ */ jsx(Link, { to: "/", className: "text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors", children: "Home" }),
            /* @__PURE__ */ jsx(NavigationMenu, { children: /* @__PURE__ */ jsx(NavigationMenuList, { children: /* @__PURE__ */ jsxs(NavigationMenuItem, { children: [
              /* @__PURE__ */ jsx(NavigationMenuTrigger, { className: "bg-transparent text-primary-foreground/70 hover:text-primary-foreground", children: "Services" }),
              /* @__PURE__ */ jsx(NavigationMenuContent, { className: "bg-primary z-50", children: /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsx(DynamicActionBar, { actions: NAV_ACTIONS }) }) })
            ] }) }) }),
            /* @__PURE__ */ jsx(Link, { to: "/blog/", className: "text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors", children: "Blog" }),
            /* @__PURE__ */ jsx(Link, { to: "/corporate-profile/", className: "text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors", children: "Company Profile" }),
            /* @__PURE__ */ jsx(Link, { to: "/contact/", className: "text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors", children: "Contact Us" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden md:flex ml-auto", children: /* @__PURE__ */ jsx(Link, { to: "/contact/", onClick: toggleMenu, children: /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsx(Button, { variant: "hero", size: "default", children: "Get Started" }) }) }) }),
          /* @__PURE__ */ jsx("div", { className: "md:hidden flex items-center gap-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: toggleMenu,
              className: "text-primary-foreground hover:text-accent p-2 rounded-md transition-colors",
              "aria-label": "Toggle menu",
              children: /* @__PURE__ */ jsx(Menu, { className: "size-6" })
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(SideMenu, { isMenuOpen, toggleMenu, actions: NAV_ACTIONS })
  ] });
};
const Hero$5 = () => {
  return /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(HeroBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
      AnimatedHero,
      {
        badge: "90% of Malaysian SMEs fail within 5 years",
        titlePrefix: "Your competitors are",
        rotatingWords: HERO_ROTATING_WORDS$6,
        description: "Every day you wait, your competitors capture leads that should be yours. Leadzap is the top digital marketing agency Malaysia businesses trust to fight back — with SEO services pricing Malaysia can afford and social media marketing Malaysia that actually converts.",
        primaryCTA: HERO_PRIMARY_CTA$6,
        secondaryCTA: HERO_SECONDARY_CTA$6
      }
    ) })
  ] });
};
const PainPoints$1 = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-destructive", children: "Sound Familiar?" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "These Problems Are Costing You Thousands Every Month" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: [
        "Most Malaysian SMEs and startups face these exact challenges. The difference between those who thrive and those who close? ",
        /* @__PURE__ */ jsx("strong", { className: "text-accent", children: "Taking action before it's too late." })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6", children: PAIN_POINTS_DATA$1.map((pain, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-destructive/20 bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-colors group-hover:bg-accent group-hover:text-accent-foreground", children: pain.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-foreground", children: pain.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-muted-foreground", children: pain.description })
        ]
      },
      index
    )) })
  ] }) });
};
const Framework = () => {
  return /* @__PURE__ */ jsx("section", { id: "framework", className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "The Solution" })
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
        "While Others Guess, We ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Engineer Growth" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "Most agencies run random ads and pray for results. Our proprietary Push-Pull framework creates a self-reinforcing ecosystem — push data feeds pull marketing, pull data optimizes push campaigns. The result? Compounding returns that get cheaper over time." })
    ] }),
    /* @__PURE__ */ jsx(motion.div, { className: "mt-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, viewport: { once: true }, children: /* @__PURE__ */ jsx("img", { src: PushPullFramework, alt: "Push-Pull Marketing Framework", className: "max-w-2xl w-[55%] mx-auto" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-16 grid grid-cols-2 gap-3 md:gap-6", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 flex flex-col h-full",
          initial: { opacity: 0, x: -30 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.3 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-bold mb-3 md:mb-4 text-accent", children: "PUSH — Instant Leads" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm md:text-base text-muted-foreground mb-3 md:mb-4", children: [
              "Can't wait 6 months for SEO? Neither can we. Push campaigns put you in front of buyers ",
              /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "today" }),
              " — and every click feeds data back into your long-term strategy."
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "mt-auto space-y-1 md:space-y-2 text-xs sm:text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "→" }),
                /* @__PURE__ */ jsx("span", { children: "Facebook, Instagram & TikTok ads that convert" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "→" }),
                /* @__PURE__ */ jsx("span", { children: "Retargeting audiences built from real data" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "→" }),
                /* @__PURE__ */ jsx("span", { children: "Immediate enquiries from day one" })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/50 flex flex-col h-full",
          initial: { opacity: 0, x: 30 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.4 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-bold mb-3 md:mb-4 text-accent", children: "PULL — Compounding Growth" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm md:text-base text-muted-foreground mb-3 md:mb-4", children: [
              "Ads stop when you stop paying. SEO doesn't. Our pull strategy builds an asset that generates free traffic ",
              /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "forever" }),
              " — and gets smarter from push campaign data."
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "mt-auto space-y-1 md:space-y-2 text-xs sm:text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "→" }),
                /* @__PURE__ */ jsx("span", { children: "SEO + GEO for Google and AI search engines" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "→" }),
                /* @__PURE__ */ jsx("span", { children: "Content that ranks and converts" })
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "text-accent mr-2", children: "→" }),
                /* @__PURE__ */ jsx("span", { children: "Lower cost-per-lead every month" })
              ] })
            ] })
          ]
        }
      )
    ] })
  ] }) });
};
const BeforeAfter = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "The Transformation Is Real" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "This is what happens when you stop guessing and start growing with a proven system." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "rounded-2xl border border-destructive/20 bg-card p-6 md:p-8 shadow-card",
          initial: { opacity: 0, x: -30 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.5 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1", children: [
              /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-destructive" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-destructive", children: "BEFORE Leadzap" })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: BEFORE_ITEMS.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start text-muted-foreground", children: [
              /* @__PURE__ */ jsx(X, { className: "h-4 w-4 text-destructive mt-1 mr-3 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: item })
            ] }, i)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "rounded-2xl border border-accent/30 bg-card p-6 md:p-8 shadow-card shadow-glow",
          initial: { opacity: 0, x: 30 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.1 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-accent", children: "AFTER Leadzap" })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: AFTER_ITEMS.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start text-foreground", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-accent mt-1 mr-3 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: item })
            ] }, i)) })
          ]
        }
      )
    ] })
  ] }) });
};
const TotalDigitalSolutions = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-10 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.2 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Complete Solutions" })
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
        "Everything You Need to ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Dominate" }),
        " Your Market"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-xl text-muted-foreground max-w-3xl mx-auto", children: "While other agencies do one thing, we build the entire machine. SEO, ads, social, software — all working together so you never leave money on the table." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6", children: SOLUTIONS_DATA.map((solution, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-3 text-accent", children: solution.title }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-md", children: solution.description })
        ]
      },
      index
    )) })
  ] }) });
};
const WebsiteDesign = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-10 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-3", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
        "Businesses That Chose to ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Fight Back" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "These companies were once in your exact position. Now they dominate their industries online." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: WEBSITES_DATA.map((website, index) => /* @__PURE__ */ jsx("div", { className: "group rounded-2xl p-2 -m-2 h-full", children: /* @__PURE__ */ jsxs(
      motion.a,
      {
        href: website.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "flex flex-col h-full rounded-xl overflow-hidden border border-transparent transition-all duration-300 bg-card shadow-card hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 group-hover:border-accent/50 hover:-translate-y-1",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("img", { src: website.image, alt: website.name, className: "w-full h-48 object-cover shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "p-6 flex flex-col flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-bold mb-2 text-accent group-hover:text-accent/80 transition-colors", children: website.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground min-h-[80px] line-clamp-3", children: website.description })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center text-sm text-accent group-hover:text-accent/80 transition-colors mt-auto pt-4", children: [
              "See Their Results",
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" }) })
            ] })
          ] })
        ]
      }
    ) }, index)) })
  ] }) });
};
const Services$1 = () => {
  return /* @__PURE__ */ jsx("section", { id: "services", className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Take Action Now" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Choose Your Weapon" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "Every day without a strategy is a day your competitors get further ahead. Pick the service that solves your biggest bottleneck — or take all of them." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6", children: SERVICE_ITEMS_DATA.map((item, index) => /* @__PURE__ */ jsx(Link, { to: item.link, className: "block h-full", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 flex flex-col h-full min-h-[240px] md:min-h-[280px] cursor-pointer",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-3 md:mb-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-accent font-bold text-2xl md:text-3xl", children: item.emoji }),
              /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-accent transition-colors" })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-accent", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-muted-foreground mb-4 md:mb-6", children: item.description })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-auto", children: /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsx(Button, { variant: "hero", size: "default", className: "w-full text-sm md:text-base", children: item.cta }) }) })
        ]
      }
    ) }, index)) })
  ] }) });
};
const ContactForm$1 = () => {
  var _a;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [isServicePopoutOpen, setIsServicePopoutOpen] = useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
    } catch (error) {
      console.error("Error sending to Pabbly:", error);
    }
    setTimeout(() => setSubmitted(false), 3e3);
  };
  return /* @__PURE__ */ jsx("section", { className: "py-6 lg:py-24 bg-secondary", id: "contact", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
        "Your Competitors Won't Wait. ",
        /* @__PURE__ */ jsx(Cover, { children: "Will You?" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "Get a free consultation and discover exactly how much revenue you're leaving on the table. No obligations. No pressure. Just clarity." })
    ] }),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "max-w-2xl mx-auto rounded-2xl border border-border bg-card p-4 md:p-6 lg:p-8 shadow-card",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2 },
        viewport: { once: true },
        children: submitted ? /* @__PURE__ */ jsxs(
          motion.div,
          {
            className: "bg-green-800/30 border border-green-600 rounded-lg p-5 md:p-6 text-center",
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.3 },
            children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-3 md:mb-4" }),
              /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-bold mb-2 text-foreground", children: "We're On It!" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-muted-foreground", children: "Expect a call from our strategist within 24 hours. Your competitors better watch out." })
            ]
          }
        ) : /* @__PURE__ */ jsxs("form", { className: "space-y-5 md:space-y-6", onSubmit: handleSubmit, children: [
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4 md:gap-6", children: [
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
                  className: "w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent",
                  placeholder: "John Doe"
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
                  className: "w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent",
                  placeholder: "john@example.com"
                }
              )
            ] })
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
                className: "w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent",
                placeholder: "Your Company"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "What's Your Biggest Challenge?" }),
            /* @__PURE__ */ jsxs("div", { className: "md:hidden", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setIsServicePopoutOpen(true),
                  className: "w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground flex items-center justify-between focus:ring-accent focus:border-accent",
                  children: [
                    /* @__PURE__ */ jsx("span", { children: ((_a = CONTACT_SERVICE_OPTIONS.find((opt) => opt.value === formData.service)) == null ? void 0 : _a.label) || "Select a Service" }),
                    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs", children: "Tap to choose" })
                  ]
                }
              ),
              isServicePopoutOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background/50", onClick: () => setIsServicePopoutOpen(false) }),
                /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6 border-t border-border", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Select a Service" }),
                    /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsServicePopoutOpen(false), className: "text-muted-foreground text-xs", children: "Close" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: CONTACT_SERVICE_OPTIONS.map((opt) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setFormData((prev) => ({ ...prev, service: opt.value }));
                        setIsServicePopoutOpen(false);
                      },
                      className: `w-full text-left px-3 py-2 rounded-md text-sm border ${formData.service === opt.value ? "accent-gradient text-accent-foreground border-accent" : "bg-muted text-foreground border-border hover:bg-muted/80"}`,
                      children: opt.label
                    },
                    opt.value || "none"
                  )) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx(
              "select",
              {
                id: "service",
                value: formData.service,
                onChange: handleChange,
                className: "w-full bg-muted border border-border rounded-md px-4 py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent",
                children: CONTACT_SERVICE_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value || "none"))
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Tell Us About Your Situation" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: "message",
                rows: 4,
                required: true,
                value: formData.message,
                onChange: handleChange,
                className: "w-full bg-muted border border-border rounded-md px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-foreground focus:ring-accent focus:border-accent",
                placeholder: "What's costing you the most right now? Lost leads? Wasted ad spend? Manual processes?"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", children: [
            /* @__PURE__ */ jsx(Flame, { className: "mr-2 h-5 w-5" }),
            "Get My Free Growth Strategy"
          ] }) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Free. No credit card. Response within 24 hours." })
        ] })
      }
    )
  ] }) });
};
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    console.error(
      "404 Error: Path not found ->",
      location.pathname
    );
  }, [location.pathname]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-background text-foreground px-4", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "max-w-md w-full text-center",
      children: [
        /* @__PURE__ */ jsx("div", { className: "mb-8 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              animate: { scale: [1, 1.1, 1] },
              transition: { repeat: Infinity, duration: 4 },
              className: "absolute inset-0 bg-accent/20 blur-3xl rounded-full"
            }
          ),
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-24 w-24 text-accent relative z-10" })
        ] }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-7xl font-black font-display mb-2 tracking-tighter", children: "404" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold mb-4", children: "Lost in the System?" }),
        /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground mb-10 leading-relaxed", children: [
          "The page you are looking for ",
          /* @__PURE__ */ jsx("code", { className: "text-accent bg-accent/10 px-1 rounded", children: location.pathname }),
          " does not exist or has been moved to a new coordinate."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              size: "lg",
              onClick: () => navigate(-1),
              className: "gap-2 border-border hover:bg-secondary",
              children: [
                /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
                "Go Back"
              ]
            }
          ),
          /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsxs(Button, { size: "lg", className: "gap-2 w-full sm:w-auto shadow-lg shadow-accent/10", children: [
            /* @__PURE__ */ jsx(Home, { className: "h-4 w-4" }),
            "Return Home"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-16 pt-8 border-t border-border/50 text-xs text-muted-foreground tracking-widest uppercase", children: "Leadzap Digital Infrastructure" })
      ]
    }
  ) });
};
const supabaseUrl = "https://cchxoycyanozttgqddxn.supabase.co";
const supabaseAnonKey = "sb_publishable_3XFI8HX3hofFyc0Rwa_Gxw_Y4cpx4Az";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const ContentContext = createContext(void 0);
function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within a ContentProvider");
  return ctx;
}
const __ssgInitialBlogPosts = [];
const sanitizeTags = (tags) => {
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  if (typeof tags === "string") return tags.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};
const mapToBlogPost = (row) => ({
  id: row.id.toString(),
  title: row.title ?? "",
  content: row.content ?? "",
  excerpt: row.excerpt ?? "",
  author: row.author ?? "",
  imageUrl: row.imageUrl ?? "",
  tags: sanitizeTags(row.tags),
  featured: !!row.featured,
  publishedAt: row.publishedAt ? new Date(row.publishedAt) : new Date(row.created_at || Date.now())
});
function ContentProvider({ children }) {
  const [blogPosts, setBlogPosts] = useState([]);
  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from("LeadzapTable").select("*").order("publishedAt", { ascending: false });
        if (error) {
          console.error("Error fetching LeadzapTable:", error);
        } else if (data && isMounted) {
          setBlogPosts(data.map(mapToBlogPost));
        }
      } catch (err) {
        console.error("Fetch exception:", err);
      }
    };
    fetchPosts();
    const channelName = `leadzap_updates_${Date.now()}`;
    const subscription = supabase.channel(channelName).on("postgres_changes", { event: "*", schema: "public", table: "LeadzapTable" }, () => {
      if (isMounted) fetchPosts();
    }).subscribe();
    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);
  const addBlogPost = useCallback(async (input) => {
    const { error } = await supabase.from("LeadzapTable").insert([{
      title: input.title,
      content: input.content,
      excerpt: input.excerpt || String(input.content).slice(0, 150) + "...",
      author: input.author,
      imageUrl: input.imageUrl || "",
      tags: sanitizeTags(input.tags),
      featured: !!input.featured,
      publishedAt: (/* @__PURE__ */ new Date()).toISOString()
    }]);
    if (error) throw error;
  }, []);
  const updateBlogPost = useCallback(async (id, updates) => {
    const payload = { ...updates };
    if (updates.tags) payload.tags = sanitizeTags(updates.tags);
    const { error } = await supabase.from("LeadzapTable").update(payload).eq("id", id);
    if (error) throw error;
  }, []);
  const deleteBlogPost = useCallback(async (id) => {
    const { error } = await supabase.from("LeadzapTable").delete().eq("id", id);
    if (error) throw error;
  }, []);
  const setFeaturedPost = useCallback(async (id) => {
    await supabase.from("LeadzapTable").update({ featured: false }).neq("id", id);
    const { error } = await supabase.from("LeadzapTable").update({ featured: true }).eq("id", id);
    if (error) throw error;
  }, []);
  const getFeaturedPost = useCallback(() => {
    return blogPosts.find((p) => p.featured);
  }, [blogPosts]);
  const value = useMemo(() => ({
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    setFeaturedPost,
    getFeaturedPost
  }), [blogPosts, addBlogPost, updateBlogPost, deleteBlogPost, setFeaturedPost, getFeaturedPost]);
  return /* @__PURE__ */ jsx(ContentContext.Provider, { value, children });
}
const BlogSection = ({ tags, title = "Latest Insights", subtitle = "Stay updated with our latest blog posts and industry insights" }) => {
  const { blogPosts } = useContent();
  const filteredPosts = blogPosts.filter(
    (post) => post.tags.some(
      (tag) => tags.some(
        (filterTag) => tag.toLowerCase().includes(filterTag.toLowerCase()) || filterTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  ).slice(0, 3);
  if (filteredPosts.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center mb-12",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold font-display mb-4 text-foreground", children: title }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: subtitle })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: filteredPosts.map((post, index) => /* @__PURE__ */ jsxs(
      motion.article,
      {
        className: "bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:border-accent transition-all duration-300 border border-border",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        whileHover: { scale: 1.02, y: -5 },
        viewport: { once: true },
        children: [
          post.imageUrl && /* @__PURE__ */ jsx("div", { className: "aspect-video overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: post.imageUrl,
              alt: post.title,
              className: "w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground mb-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("time", { dateTime: post.publishedAt.toISOString(), children: post.publishedAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { children: post.author })
              ] })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold font-display mb-3 text-foreground transition-colors", children: /* @__PURE__ */ jsx(Link, { to: `/blog/${post.id}/`, className: "line-clamp-2", children: post.title }) }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4 line-clamp-3", children: post.excerpt }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: post.tags.slice(0, 2).map((tag) => /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "bg-accent/10 text-accent text-xs px-2 py-1 rounded-full",
                  children: [
                    "#",
                    tag
                  ]
                },
                tag
              )) }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/blog/${post.id}/`,
                  className: "text-accent hover:text-accent/80 transition-colors flex items-center gap-1 text-sm font-medium",
                  children: [
                    "Read More",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                  ]
                }
              )
            ] })
          ] })
        ]
      },
      post.id
    )) }),
    filteredPosts.length > 0 && /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "text-center mt-12",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.3 },
        viewport: { once: true },
        children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/blog/",
            className: "inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-md font-medium hover:bg-accent/90 transition-colors",
            children: [
              "View All Articles",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        )
      }
    )
  ] }) });
};
const HERO_ROTATING_WORDS$5 = ["your competitor", "someone else", "a rival brand", "not you"];
const HERO_PRIMARY_CTA$5 = { label: "Get Your FREE SEO Audit", href: "/contact/" };
const HERO_SECONDARY_CTA$5 = { label: "See How It Works", href: "/custom-software/" };
const BLOG_TAGS$2 = ["SEM", "SEO", "search engine marketing", "google ads", "paid advertising", "organic traffic"];
const SERVICE_OPTIONS$1 = [
  { value: "", label: "Select a Service" },
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social Media Ads" },
  { value: "order", label: "Order Management System" },
  { value: "other", label: "Other" }
];
const SEM = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(Hero$4, {}),
    /* @__PURE__ */ jsx(PainSection, {}),
    /* @__PURE__ */ jsx(Features$1, {}),
    /* @__PURE__ */ jsx(GEOExplanation, {}),
    /* @__PURE__ */ jsx(Process$1, {}),
    /* @__PURE__ */ jsx(PPCFeatures, {}),
    /* @__PURE__ */ jsx(PPCProcess, {}),
    /* @__PURE__ */ jsx(
      BlogSection,
      {
        tags: BLOG_TAGS$2,
        title: "SEM & SEO Insights",
        subtitle: "Learn the latest strategies and tips for search engine marketing success"
      }
    ),
    /* @__PURE__ */ jsx(CallToAction$1, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Hero$4 = () => {
  return /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(HeroBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
      AnimatedHero,
      {
        badge: "Your competitors rank above you on Google",
        titlePrefix: "Someone just Googled your service and found",
        rotatingWords: HERO_ROTATING_WORDS$5,
        description: "Every hour your website sits on page 2, you lose customers to businesses with worse products but better SEO. Get free SEO analysis Malaysia from our Malaysia SEO consultant team — and see exactly what's costing you leads.",
        primaryCTA: HERO_PRIMARY_CTA$5,
        secondaryCTA: HERO_SECONDARY_CTA$5
      }
    ) })
  ] });
};
const PainSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsx(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Does This Sound Like You?" }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6 max-w-4xl mx-auto", children: [
      { icon: /* @__PURE__ */ jsx(ShieldAlert, { className: "h-8 w-8" }), pain: `"I've been paying for SEO for months but see no results"`, solution: "Most agencies use outdated tactics. We combine SEO + GEO for both Google and AI search engines." },
      { icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8" }), pain: '"My Google Ads cost keeps going up but leads go down"', solution: "We audit your campaigns, cut waste, and restructure for maximum ROI — often cutting costs by 30-50%." },
      { icon: /* @__PURE__ */ jsx(Clock, { className: "h-8 w-8" }), pain: `"I don't know if my current agency is actually doing anything"`, solution: "We provide transparent dashboards. You see every keyword, every click, every ringgit — in real-time." }
    ].map((item, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "rounded-2xl border border-border bg-card p-6 shadow-card",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: i * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-destructive mb-4", children: item.icon }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground font-bold mb-3 italic", children: item.pain }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-accent", children: item.solution })
        ]
      },
      i
    )) })
  ] }) });
};
const Features$1 = () => {
  const features = [
    { icon: /* @__PURE__ */ jsx(Search, { className: "h-7 w-7" }), title: "SEO Packages Malaysia", description: "Affordable SEO services pricing Malaysia with transparent packages. No lock-in contracts. Cancel if we don't deliver results." },
    { icon: /* @__PURE__ */ jsx(Globe, { className: "h-7 w-7" }), title: "Local SEO Malaysia", description: "Dominate Google Maps and local search. When someone near your business searches, they find you — not your competitor." },
    { icon: /* @__PURE__ */ jsx(BarChart2, { className: "h-7 w-7" }), title: "Google Ads Malaysia", description: "Stop burning money on bad ads. Our Google Ads agency Malaysia service delivers leads at the lowest cost per acquisition." },
    { icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-7 w-7" }), title: "Free SEO Analysis", description: "Get free SEO analysis Malaysia from our Malaysia SEO specialist team. See exactly why you're losing to competitors." }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-6 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Our Arsenal" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "The Weapons Your Competitors Fear" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "Our SEM strategy doesn't stop at top search positions. We supercharge every corner of Google's ecosystem — Maps, My Business, Search, and AI — with both SEO & GEO optimization." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12", children: features.map((feature, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground", children: feature.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-foreground", children: feature.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-muted-foreground", children: feature.description })
        ]
      },
      index
    )) })
  ] }) });
};
const GEOExplanation = () => {
  return /* @__PURE__ */ jsxs("section", { className: "py-12 lg:py-24 hero-gradient relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(HeroBackground, {}),
    /* @__PURE__ */ jsxs("div", { className: "container relative z-10 mx-auto px-4 md:px-6", children: [
      /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-destructive" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-destructive", children: "Your Competitors Don't Know This Yet" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-6 text-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "GEO" }),
          " — The Secret Weapon 99% of Agencies Ignore"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed", children: "While everyone fights over Google rankings, a massive shift is happening. Over 60% of users now ask ChatGPT, Claude, and Perplexity for recommendations. If your business isn't optimized for AI search — you're invisible to the next generation of buyers." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center mb-12", children: [
        /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-display font-bold mb-6 text-accent", children: "First-Mover Advantage" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4 text-muted-foreground", children: [
            { label: "AI Search Growth:", text: "Over 60% of users now use AI chatbots for research — and this number doubles every year" },
            { label: "Window of Opportunity:", text: "Your competitors are still stuck in traditional SEO. Get ahead NOW while the door is open" },
            { label: "Higher Intent Traffic:", text: "People asking AI for recommendations are ready to buy — not just browse" },
            { label: "Local Domination:", text: "Be the business AI recommends when someone asks 'best [your service] in Malaysia'" }
          ].map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-accent mt-2.5 shrink-0" }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: item.label }),
              " ",
              item.text
            ] })
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-accent/20 bg-card p-8 shadow-card", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-xl font-display font-bold mb-4 text-accent", children: "Others vs Us" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-destructive pl-4", children: [
              /* @__PURE__ */ jsx("h5", { className: "font-semibold text-foreground", children: "Other Agencies" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "Still doing the same SEO they did in 2019. No AI strategy. No GEO. Falling behind." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-l-4 border-accent pl-4", children: [
              /* @__PURE__ */ jsx("h5", { className: "font-semibold text-foreground", children: "Leadzap (Our Approach)" }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: "SEO + GEO dual optimization ensures your business dominates both Google AND AI-generated answers." })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(motion.div, { className: "rounded-2xl bg-accent/10 p-8 border border-accent/30", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-display font-bold mb-4 text-foreground", children: "Our SEO + GEO Advantage" }),
        /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground mb-6 max-w-3xl mx-auto", children: "We don't just do traditional SEO. Our dual approach ensures your business dominates both Google search results AND gets featured in AI-powered responses when customers ask questions about your industry in Malaysia." }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-3 mt-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-accent mb-2", children: "Traditional SEO" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Google, Bing, Yahoo rankings" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx("div", { className: "text-xl text-muted-foreground", children: "+" }) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-accent mb-2", children: "GEO Optimization" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "ChatGPT, Claude, Perplexity mentions" })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
const Process$1 = () => {
  const steps2 = [
    { number: "01", title: "The X-Ray — SEM Audit", description: "We dissect your entire online presence. Every missed keyword. Every wasted dollar. Every competitor advantage. You'll see exactly where money is leaking." },
    { number: "02", title: "The Battle Plan", description: "Based on data (not guesses), we create a strategy combining SEO and GEO tactics custom-built for your market, your competition, and your budget." },
    { number: "03", title: "Deployment", description: "Our team executes on-page, off-page, technical SEO and GEO optimizations. You start climbing rankings while competitors wonder what happened." },
    { number: "04", title: "Compound & Dominate", description: "We continuously optimize based on real data. Your cost-per-lead drops every month while your traffic compounds — the rich get richer." }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-10 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "How We Take You to #1" }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "A proven, methodical process — not random tactics. Every step builds on the last." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-0 bottom-0 w-1 bg-border transform -translate-x-1/2 hidden md:block" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-12 md:space-y-0", children: steps2.map((step, index) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: `flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center md:gap-8`,
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: index * 0.2 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxs("div", { className: `md:w-1/2 mb-4 md:mb-0 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`, children: [
              /* @__PURE__ */ jsx("span", { className: "block text-4xl md:text-5xl font-bold text-accent mb-2", children: step.number }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-display font-bold mb-3 text-foreground", children: step.title }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-md md:text-lg", children: step.description })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "md:w-1/2 flex justify-center relative" })
          ]
        },
        index
      )) })
    ] })
  ] }) });
};
const PPCFeatures = () => {
  const features = [
    { icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-7 w-7" }), title: "Surgical Targeting", description: "We don't spray and pray. Every ad targets buyers with high purchase intent — so you pay for leads, not clicks." },
    { icon: /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-7 w-7" }), title: "Results in 24 Hours", description: "While SEO builds momentum, PPC delivers leads TODAY. See traffic and enquiries the moment campaigns go live." },
    { icon: /* @__PURE__ */ jsx(BarChart2, { className: "h-7 w-7" }), title: "Stop Wasting Money", description: "We cut wasted spend by 30-50% on average. Your budget goes to conversions, not irrelevant clicks." },
    { icon: /* @__PURE__ */ jsx(LineChart, { className: "h-7 w-7" }), title: "Every Ringgit Tracked", description: "No more guessing. See exactly which keywords and ads drive revenue — down to the last sen." }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-primary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-primary-foreground", children: "Google Ads: Stop Burning Money. Start Printing Leads." }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-primary-foreground/70 max-w-3xl mx-auto", children: "Most businesses waste 40-60% of their Google Ads budget on irrelevant clicks. We fix that — and turn your ad spend into a lead generation machine." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6", children: features.map((feature, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground", children: feature.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-foreground", children: feature.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-muted-foreground", children: feature.description })
        ]
      },
      index
    )) })
  ] }) });
};
const PPCProcess = () => {
  const steps2 = [
    { number: "01", title: "Campaign Autopsy", description: "We audit your existing campaigns (or competitors') to find exactly where money is being wasted." },
    { number: "02", title: "Keyword Sniping", description: "Identify the exact keywords that bring buyers — not browsers. High intent, low competition, maximum ROI." },
    { number: "03", title: "Killer Ad Copy", description: "Craft ads that make people stop scrolling and start clicking. Headlines that convert. Landing pages that sell." },
    { number: "04", title: "Precision Launch", description: "Launch campaigns with surgical targeting, smart bidding, and daily optimization from day one." },
    { number: "05", title: "Scale What Works", description: "Double down on winners, kill losers. Every week your campaigns get cheaper and more profitable." }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-10 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsx(motion.div, { className: "text-center mb-8 md:mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4 text-foreground", children: "Our Google Ads Battle Plan" }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6", children: steps2.map((step, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-border bg-card p-4 md:p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-accent text-xl md:text-2xl font-bold mb-3 md:mb-4", children: step.number }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-2 md:mb-3 text-foreground", children: step.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base text-muted-foreground", children: step.description })
        ]
      },
      index
    )) })
  ] }) });
};
const CallToAction$1 = () => {
  var _a;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [isServicePopoutOpen, setIsServicePopoutOpen] = useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
    } catch (error) {
      console.error("Error sending to Pabbly:", error);
    }
    setTimeout(() => setSubmitted(false), 3e3);
  };
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 md:px-6", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-primary p-8 md:p-16", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-destructive" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-destructive", children: "Limited: 5 free audits remaining this month" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-6 text-primary-foreground", children: [
          "Get Your FREE SEO Audit ",
          /* @__PURE__ */ jsx(Cover, { children: "Before Your Competitor Does" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-primary-foreground/70 mb-6", children: "Every week you wait, your competitor's SEO gets stronger and yours gets weaker. This free audit shows you exactly what to fix — and how much revenue you're missing." }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 text-primary-foreground/70", children: ["Complete technical SEO & GEO analysis", "Competitor gap report — see what they rank for", "AI search visibility assessment", "Revenue opportunity calculator", "FREE Google Ads waste audit"].map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-accent mr-3" }),
          item
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "rounded-2xl border border-border bg-card p-4 md:p-6 lg:p-8 shadow-card",
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.2 },
          viewport: { once: true },
          children: submitted ? /* @__PURE__ */ jsxs(motion.div, { className: "bg-green-800/30 border border-green-600 rounded-lg p-5 md:p-6 text-center", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-10 w-10 text-green-500 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mb-2 text-foreground", children: "Your Audit Is Being Prepared!" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Expect it in your inbox within 24 hours." })
          ] }) : /* @__PURE__ */ jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [
            /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
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
                    className: "w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent",
                    placeholder: "John Doe"
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
                    className: "w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent",
                    placeholder: "john@example.com"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "company", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Your Website URL" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "company",
                  value: formData.company,
                  onChange: handleChange,
                  className: "w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent",
                  placeholder: "leadzap.com.my"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "service", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "What do you need most?" }),
              /* @__PURE__ */ jsxs("div", { className: "md:hidden", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setIsServicePopoutOpen(true),
                    className: "w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground flex items-center justify-between",
                    children: [
                      /* @__PURE__ */ jsx("span", { children: ((_a = SERVICE_OPTIONS$1.find((opt) => opt.value === formData.service)) == null ? void 0 : _a.label) || "Select a Service" }),
                      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs", children: "Tap to choose" })
                    ]
                  }
                ),
                isServicePopoutOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background/50", onClick: () => setIsServicePopoutOpen(false) }),
                  /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6 border-t border-border", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Select a Service" }),
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsServicePopoutOpen(false), className: "text-muted-foreground text-xs", children: "Close" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: SERVICE_OPTIONS$1.map((opt) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setFormData((prev) => ({ ...prev, service: opt.value }));
                          setIsServicePopoutOpen(false);
                        },
                        className: `w-full text-left px-3 py-2 rounded-md text-sm border ${formData.service === opt.value ? "accent-gradient text-accent-foreground border-accent" : "bg-muted text-foreground border-border hover:bg-muted/80"}`,
                        children: opt.label
                      },
                      opt.value || "none"
                    )) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx(
                "select",
                {
                  id: "service",
                  value: formData.service,
                  onChange: handleChange,
                  className: "w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground focus:ring-accent focus:border-accent",
                  children: SERVICE_OPTIONS$1.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value || "none"))
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "What keywords do you want to rank for?" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "message",
                  rows: 3,
                  required: true,
                  value: formData.message,
                  onChange: handleChange,
                  className: "w-full bg-muted border border-border rounded-md px-3 py-2 md:py-3 text-sm text-foreground focus:ring-accent focus:border-accent",
                  placeholder: "e.g. 'dental clinic KL', 'best lawyer malaysia'..."
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", children: [
              /* @__PURE__ */ jsx(Flame, { className: "mr-2 h-5 w-5" }),
              "Claim My Free SEO Audit"
            ] }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground", children: "100% free. No obligations. Delivered within 24 hours." })
          ] })
        }
      )
    ] })
  ] }) }) });
};
const BLOG_TAGS$1 = ["social media marketing", "social media ads", "facebook ads", "instagram marketing", "tiktok advertising", "paid social"];
const HERO_ROTATING_WORDS$4 = ["your competitor's ad", "a rival's offer", "someone else's deal", "and clicked it"];
const HERO_PRIMARY_CTA$4 = { label: "Stop Losing Customers — Free Strategy Call", href: "/contact/" };
const HERO_SECONDARY_CTA$4 = { label: "View Our Results", href: "/corporate-profile/" };
const PAIN_POINTS_DATA = [
  { wrong: "Boosted a post for RM50 and got likes but no sales", right: "We build conversion-optimized funnels with retargeting — likes mean nothing, sales mean everything" },
  { wrong: "Hired a 'social media manager' who just posted pretty pictures", right: "We run data-driven paid campaigns with A/B testing, audience segmentation, and performance tracking" },
  { wrong: "Tried Facebook Ads but the cost kept climbing with no results", right: "We optimize daily, kill underperformers, and scale winners — your cost goes DOWN over time" },
  { wrong: "Got lots of clicks but nobody actually bought anything", right: "We target buyers, not browsers. Custom audiences, lookalikes, and retargeting close the deal" }
];
const PLATFORMS_DATA = [
  { icon: /* @__PURE__ */ jsx(Facebook, { className: "h-12 w-12" }), name: "Facebook & Instagram", description: "Where your customers spend 2+ hours daily. We put your offer right in front of them — with surgical targeting.", features: ["Precise buyer targeting", "Retargeting warm audiences", "Shopping integration", "Messenger automation"] },
  { icon: /* @__PURE__ */ jsx(Youtube, { className: "h-12 w-12" }), name: "TikTok Advertising", description: "The platform your competitors haven't figured out yet. Lower costs, higher engagement, massive reach.", features: ["Viral content potential", "50% lower CPM than Facebook", "Hashtag challenges", "Creator partnerships"] },
  { icon: /* @__PURE__ */ jsx(Instagram, { className: "h-12 w-12" }), name: "RedNote (Xiaohongshu)", description: "Dominate the Chinese-Malaysian market. Where high-intent buyers discover and buy premium products.", features: ["Premium audience targeting", "Product discovery", "KOL partnerships", "Community trust building"] }
];
const CAMPAIGN_TYPES_DATA = [
  { icon: /* @__PURE__ */ jsx(Megaphone, { className: "h-10 w-10" }), name: "Brand Awareness", description: "Make your brand unforgettable. We put you in front of thousands of ideal customers daily — so when they're ready to buy, they think of YOU first." },
  { icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-10 w-10" }), name: "Lead Generation", description: "Fill your sales pipeline with qualified leads. Real phone numbers, real emails, real people ready to talk — not vanity metrics." },
  { icon: /* @__PURE__ */ jsx(Users, { className: "h-10 w-10" }), name: "Foot Traffic", description: "Empty store? We drive people from their phones to your door with geo-targeted campaigns that track every visit." },
  { icon: /* @__PURE__ */ jsx(Target, { className: "h-10 w-10" }), name: "Online Sales", description: "Abandoned carts? We bring them back. Retargeting, dynamic product ads, and checkout optimization that turns browsers into buyers." }
];
const PROCESS_STEPS_DATA = [
  { title: "Spy on Competitors", description: "We reverse-engineer your top competitors' ads. What works for them, we do better. What doesn't, we avoid." },
  { title: "Build the Machine", description: "Custom audiences, killer creative, landing pages that convert. We build the entire funnel — not just the ad." },
  { title: "Test Everything", description: "5 headlines. 3 images. 4 audiences. We test ruthlessly and let data pick the winner — not gut feelings." },
  { title: "Kill Losers, Scale Winners", description: "Every day we cut what doesn't work and double down on what does. Your ROI improves every single week." },
  { title: "Compound Results", description: "Retargeting, lookalike audiences, upsell campaigns. The longer we run, the cheaper your leads get." }
];
const SERVICE_OPTIONS = [
  { value: "", label: "Select a Service" },
  { value: "seo", label: "SEO" },
  { value: "social", label: "Social Media Ads" },
  { value: "order", label: "Order Management System" },
  { value: "other", label: "Other" }
];
const CTA_LIST_ITEMS = [
  "Competitor ad analysis — see what they're running",
  "Custom audience strategy for your market",
  "Budget recommendation with projected ROI",
  "Creative direction and messaging framework"
];
const SocialMediaAds = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(Hero$3, {}),
    /* @__PURE__ */ jsx(PainPoints, {}),
    /* @__PURE__ */ jsx(Platforms, {}),
    /* @__PURE__ */ jsx(CampaignTypes, {}),
    /* @__PURE__ */ jsx(Process, {}),
    /* @__PURE__ */ jsx(
      BlogSection,
      {
        tags: BLOG_TAGS$1,
        title: "Social Media Marketing Insights",
        subtitle: "Discover proven strategies for social media advertising and organic growth"
      }
    ),
    /* @__PURE__ */ jsx(CallToAction, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Hero$3 = () => {
  return /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(HeroBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
      AnimatedHero,
      {
        badge: "Your competitor's ad is showing to YOUR customers right now",
        titlePrefix: "Your customers just scrolled past",
        rotatingWords: HERO_ROTATING_WORDS$4,
        description: "While you're 'thinking about it,' your competitors are running Facebook marketing Malaysia campaigns that steal your customers. As the leading social media marketing agency Malaysia, we turn the tables.",
        primaryCTA: HERO_PRIMARY_CTA$4,
        secondaryCTA: HERO_SECONDARY_CTA$4
      }
    ) })
  ] });
};
const PainPoints = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-10", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: `"I Tried Social Media Ads. It Didn't Work."` }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: "We hear this every week. Here's why it failed — and why it'll be different with us." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6 max-w-4xl mx-auto", children: PAIN_POINTS_DATA.map((item, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "rounded-2xl border border-border bg-card p-6 shadow-card",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: i * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-3", children: [
            /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-destructive mt-1 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground text-sm italic", children: [
              '"',
              item.wrong,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-accent mt-1 flex-shrink-0" }),
            /* @__PURE__ */ jsx("p", { className: "text-foreground text-sm font-medium", children: item.right })
          ] })
        ]
      },
      i
    )) })
  ] }) });
};
const Platforms = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-10 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Platforms" })
      ] }),
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
        "Your Customers Are Here — ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Are You?" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "Social media marketing packages Malaysia covering every platform where your customers hang out. As a social media marketing agency Malaysia leader, we maximize your ROI on each one." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 mt-6 md:mt-12", children: PLATFORMS_DATA.map((platform, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-border bg-card p-2 sm:p-3 md:p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 flex flex-col h-full",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-2 md:mb-4 text-accent flex justify-center text-2xl md:text-3xl", children: platform.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-[9px] sm:text-xs md:text-lg font-display font-bold mb-1 md:mb-3 text-center leading-snug text-foreground", children: platform.name }),
          /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-xs md:text-sm text-muted-foreground mb-2 md:mb-4 text-center", children: platform.description }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1 md:space-y-2 mt-auto", children: platform.features.map((feature, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start text-[9px] sm:text-xs md:text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { className: "text-accent mr-1 md:mr-2 text-xs md:text-sm", children: "✓" }),
            /* @__PURE__ */ jsx("span", { children: feature })
          ] }, i)) })
        ]
      },
      index
    )) })
  ] }) });
};
const CampaignTypes = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
        "What's Your ",
        /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Biggest Goal" }),
        "?"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: "Tell us what you need — we build campaigns that deliver exactly that." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12", children: CAMPAIGN_TYPES_DATA.map((campaign, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 text-center",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 text-accent flex justify-center", children: campaign.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-bold mb-3 text-foreground", children: campaign.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-md text-muted-foreground", children: campaign.description })
        ]
      },
      index
    )) })
  ] }) });
};
const Process = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-10 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-8", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Our Unfair Advantage" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "While other agencies set and forget, we optimize daily. Here's how we consistently outperform." })
    ] }),
    /* @__PURE__ */ jsx(motion.div, { className: "mt-12 grid md:grid-cols-5 gap-4", initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.5 }, viewport: { once: true }, children: PROCESS_STEPS_DATA.map((step, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "accent-gradient text-accent-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold absolute -top-5 left-1/2 transform -translate-x-1/2", children: index + 1 }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-3 mt-4 text-center text-foreground", children: step.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-md text-muted-foreground text-center", children: step.description })
        ]
      },
      index
    )) })
  ] }) });
};
const CallToAction = () => {
  var _a;
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", service: "", message: "" });
  const [isServicePopoutOpen, setIsServicePopoutOpen] = useState(false);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", company: "", service: "", message: "" });
    } catch (error) {
      console.error("Error sending to Pabbly:", error);
    }
    setTimeout(() => setSubmitted(false), 3e3);
  };
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 md:px-6", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-primary p-8 md:p-16", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-destructive" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-destructive", children: "Every hour without ads = customers lost to competitors" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-6 text-primary-foreground", children: [
          "Your Competitors Are Running Ads Right Now. ",
          /* @__PURE__ */ jsx(Cover, { children: "Are You?" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-md text-primary-foreground/70 mb-6", children: "Get a free ad strategy session and discover exactly how much revenue social media can generate for your business. No fluff. Just numbers." }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-3 text-primary-foreground/70", children: CTA_LIST_ITEMS.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-accent mr-3" }),
          item
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "rounded-2xl border border-border bg-card p-4 md:p-6 lg:p-8 shadow-card",
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.2 },
          viewport: { once: true },
          children: submitted ? /* @__PURE__ */ jsxs(motion.div, { className: "bg-green-800/30 border border-green-600 rounded-lg p-5 text-center", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-10 w-10 text-green-500 mx-auto mb-3" }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mb-2 text-foreground", children: "Strategy Session Booked!" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "We'll reach out within 24 hours with your custom plan." })
          ] }) : /* @__PURE__ */ jsxs("form", { className: "space-y-5", onSubmit: handleSubmit, children: [
            /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [
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
                    className: "w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent",
                    placeholder: "John Doe"
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
                    className: "w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent",
                    placeholder: "john@example.com"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "company", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Company / Brand Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "company",
                  value: formData.company,
                  onChange: handleChange,
                  className: "w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent",
                  placeholder: "Your Company"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "service", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "What's your main goal?" }),
              /* @__PURE__ */ jsxs("div", { className: "md:hidden", children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setIsServicePopoutOpen(true),
                    className: "w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground flex items-center justify-between",
                    children: [
                      /* @__PURE__ */ jsx("span", { children: ((_a = SERVICE_OPTIONS.find((opt) => opt.value === formData.service)) == null ? void 0 : _a.label) || "Select a Service" }),
                      /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs", children: "Tap to choose" })
                    ]
                  }
                ),
                isServicePopoutOpen && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-50 flex items-end justify-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background/50", onClick: () => setIsServicePopoutOpen(false) }),
                  /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6 border-t border-border", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-foreground", children: "Select a Service" }),
                      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsServicePopoutOpen(false), className: "text-muted-foreground text-xs", children: "Close" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: SERVICE_OPTIONS.map((opt) => /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setFormData((prev) => ({ ...prev, service: opt.value }));
                          setIsServicePopoutOpen(false);
                        },
                        className: `w-full text-left px-3 py-2 rounded-md text-sm border ${formData.service === opt.value ? "accent-gradient text-accent-foreground border-accent" : "bg-muted text-foreground border-border hover:bg-muted/80"}`,
                        children: opt.label
                      },
                      opt.value || "none"
                    )) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsx(
                "select",
                {
                  id: "service",
                  value: formData.service,
                  onChange: handleChange,
                  className: "w-full bg-muted border border-border rounded-md px-4 py-3 text-sm text-foreground focus:ring-accent focus:border-accent",
                  children: SERVICE_OPTIONS.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, children: opt.label }, opt.value || "none"))
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "Monthly ad budget (approximate)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "message",
                  rows: 3,
                  required: true,
                  value: formData.message,
                  onChange: handleChange,
                  className: "w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-accent focus:border-accent",
                  placeholder: "e.g. RM3,000-5,000/month. Or tell us your goals and we'll recommend a budget."
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", children: [
              /* @__PURE__ */ jsx(Flame, { className: "mr-2 h-5 w-5" }),
              "Get My Free Ad Strategy"
            ] }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Free consultation. No obligations. Response within 24 hours." })
          ] })
        }
      )
    ] })
  ] }) }) });
};
const HERO_ROTATING_WORDS$3 = ["chaotic", "manual", "broken", "costing you money"];
const HERO_PRIMARY_CTA$3 = { label: "Request a Demo", href: "/contact/" };
const HERO_SECONDARY_CTA$3 = { label: "View Features", href: "/custom-software/" };
const FEATURES_DATA = [
  { icon: /* @__PURE__ */ jsx(ShoppingCart, { className: "h-7 w-7" }), title: "Order Processing", description: "Streamline order capture, validation, and processing across multiple sales channels." },
  { icon: /* @__PURE__ */ jsx(Package, { className: "h-7 w-7" }), title: "Inventory Management", description: "Real-time inventory tracking across all warehouses and sales channels." },
  { icon: /* @__PURE__ */ jsx(CheckCircle, { className: "h-7 w-7" }), title: "Fulfillment Automation", description: "Automate picking, packing, and shipping processes with intelligent workflows." },
  { icon: /* @__PURE__ */ jsx(User, { className: "h-7 w-7" }), title: "Customer Management", description: "Centralized customer data with order history, preferences, and communication tools." },
  { icon: /* @__PURE__ */ jsx(BarChart2, { className: "h-7 w-7" }), title: "Analytics & Reporting", description: "Comprehensive reporting on sales, inventory, fulfillment, and customer insights." },
  { icon: /* @__PURE__ */ jsx(Settings, { className: "h-7 w-7" }), title: "Customizable Workflows", description: "Tailor the system to your specific business processes and requirements." }
];
const INTEGRATIONS_DATA = [
  "Shopify",
  "WooCommerce",
  "Magento",
  "Amazon",
  "eBay",
  "QuickBooks",
  "Xero",
  "ShipStation",
  "FedEx",
  "UPS",
  "USPS",
  "DHL",
  "PayPal",
  "Stripe",
  "Square"
];
const PRICING_PLAN_DATA = {
  name: "Enterprise",
  price: "Custom",
  description: "Tailored solutions for high-volume businesses with complex needs.",
  features: ["Unlimited orders", "Unlimited users", "Dedicated account manager", "Custom reporting", "Custom integrations", "White-label options", "On-premise deployment"]
};
const OrderManagement = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(Hero$2, {}),
    /* @__PURE__ */ jsx(Features, {}),
    /* @__PURE__ */ jsx(Integration, {}),
    /* @__PURE__ */ jsx(Pricing, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Hero$2 = () => {
  return /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(HeroBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
      AnimatedHero,
      {
        badge: "Still tracking orders in spreadsheets?",
        titlePrefix: "Your order management is",
        rotatingWords: HERO_ROTATING_WORDS$3,
        description: "Custom business systems designed by a software development company in Malaysia. Automate order workflows with business automation software tailored for cost optimization.",
        primaryCTA: HERO_PRIMARY_CTA$3,
        secondaryCTA: HERO_SECONDARY_CTA$3
      }
    ) })
  ] });
};
const Features = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Key Features" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Key Features" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: "Our comprehensive order management system is designed to streamline your entire order fulfillment process." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12", children: FEATURES_DATA.map((feature, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground", children: feature.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-bold mb-3 text-foreground", children: feature.title }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: feature.description })
        ]
      },
      index
    )) })
  ] }) });
};
const Integration = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Seamless Integrations" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: "Our system integrates with your favorite e-commerce platforms, payment processors, shipping carriers, and accounting software." })
    ] }),
    /* @__PURE__ */ jsx(motion.div, { className: "mt-12 grid grid-cols-3 md:grid-cols-5 gap-4", initial: { opacity: 0 }, whileInView: { opacity: 1 }, transition: { duration: 0.5 }, viewport: { once: true }, children: INTEGRATIONS_DATA.map((integration, index) => /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "rounded-2xl border border-border bg-card p-4 flex items-center justify-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, scale: 0.9 },
        whileInView: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, delay: index * 0.05 },
        viewport: { once: true },
        children: /* @__PURE__ */ jsx("span", { className: "text-center font-medium text-foreground", children: integration })
      },
      index
    )) })
  ] }) });
};
const Pricing = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Enterprise Solution" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: "A comprehensive solution tailored to your business needs." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "rounded-2xl border border-border bg-card p-8 shadow-card card-glow",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-display font-bold mb-2 text-foreground", children: PRICING_PLAN_DATA.name }),
          /* @__PURE__ */ jsxs("div", { className: "text-3xl font-bold mb-2 text-foreground", children: [
            PRICING_PLAN_DATA.price,
            /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground font-normal", children: " /month" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6", children: PRICING_PLAN_DATA.description }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3 mb-8", children: PRICING_PLAN_DATA.features.map((feature, featureIndex) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-accent mr-2 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: feature })
          ] }, featureIndex)) }),
          /* @__PURE__ */ jsx("div", { className: "text-center mb-4", children: /* @__PURE__ */ jsxs("span", { className: "text-lg font-display font-bold text-foreground", children: [
            "Ready to automate at ",
            /* @__PURE__ */ jsx(Cover, { children: "warp speed" }),
            "?"
          ] }) }),
          /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsx(Button, { variant: "hero", size: "lg", className: "w-full", children: "Contact Sales" }) })
        ]
      }
    ) })
  ] }) });
};
const PhoneInput = ({ id, value, onChange, className }) => {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type: "tel",
      id,
      value,
      onChange: (e) => onChange(e.target.value),
      className: className ?? "w-full bg-gray-800 text-white px-3 py-2.5 rounded-md outline-none text-sm",
      placeholder: "+60 12 345 6789"
    }
  );
};
const SERVICE_LABELS = {
  "": "Select a Service",
  seo: "SEO — I'm invisible on Google",
  social: "Social Media Ads — I need leads NOW",
  order: "Custom Software — I need to automate",
  other: "Other — Let's talk"
};
const MOBILE_SERVICE_OPTIONS = ["seo", "social", "order", "other"];
const HERO_ROTATING_WORDS$2 = ["losing leads", "wasting budget", "falling behind", "guessing"];
const HERO_PRIMARY_CTA$2 = { label: "Get My Free Growth Strategy", href: "/contact/" };
const HERO_SECONDARY_CTA$2 = { label: "See Our Results", href: "/corporate-profile/" };
const CONTACT_DETAILS_DATA = [
  { icon: /* @__PURE__ */ jsx(Phone, { className: "h-8 w-8 text-accent" }), title: "Call Us Now", details: ["+60-111-1335119", "Mon-Fri: 9AM - 6PM"] },
  { icon: /* @__PURE__ */ jsx(Mail, { className: "h-8 w-8 text-accent" }), title: "Email Us", details: ["sales@leadzap.com.my", "Response within 4 hours"] }
];
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
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
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTY0MDYzMzA0MzA1MjZmNTUzNTUxMzQi_pc",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }
      );
      if (res.ok) {
        setSubmitted(true);
      } else {
        console.error("❌ Failed to send data to Pabbly");
      }
    } catch (err) {
      console.error("❌ Error sending data to Pabbly:", err);
    }
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" });
    }, 3e3);
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(Hero$1, {}),
    /* @__PURE__ */ jsx(
      ContactForm,
      {
        submitted,
        onSubmit: handleSubmit,
        formData,
        handleChange,
        handlePhoneChange,
        handleServiceChange
      }
    ),
    /* @__PURE__ */ jsx(ContactInfo, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const Hero$1 = () => /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
  /* @__PURE__ */ jsx(HeroBackground, {}),
  /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
    AnimatedHero,
    {
      badge: "Every day you wait, competitors get stronger",
      titlePrefix: "Ready to stop",
      rotatingWords: HERO_ROTATING_WORDS$2,
      description: "Get free SEO analysis Malaysia, social media marketing Malaysia consultation, or custom software quotes. No sales pitch — just honest answers about what's costing you customers.",
      primaryCTA: HERO_PRIMARY_CTA$2,
      secondaryCTA: HERO_SECONDARY_CTA$2
    }
  ) })
] });
const ContactForm = ({ submitted, onSubmit, formData, handleChange, handlePhoneChange, handleServiceChange }) => {
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "py-6 md:py-10", children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 md:px-6", children: /* @__PURE__ */ jsx(motion.div, { className: "max-w-xl md:max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-xl bg-card border border-border", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-3xl font-bold font-display mb-2 md:mb-4 text-foreground", children: "Tell Us What's Broken" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "We'll tell you exactly how to fix it — for free. No obligations." }),
      submitted ? /* @__PURE__ */ jsxs(motion.div, { className: "bg-green-800/30 border border-green-600 rounded-lg p-6 text-center", initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.3 }, children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "h-12 w-12 text-green-500 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-bold mb-2 text-foreground", children: "We're On It!" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm md:text-base", children: "Expect a response within 4 hours. Your competitors should be worried." })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit, className: "space-y-5 md:space-y-6", children: [
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
          /* @__PURE__ */ jsx("label", { className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "What's Your Biggest Problem?" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setIsServicePickerOpen(true),
              className: "w-full bg-muted text-foreground px-3 py-2.5 rounded-md border border-border flex items-center justify-between text-sm outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors",
              children: [
                /* @__PURE__ */ jsx("span", { children: SERVICE_LABELS[formData.service] ?? "Select a Service" }),
                /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden md:block", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "service", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "What's Your Biggest Problem?" }),
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
          /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-xs md:text-sm font-medium text-muted-foreground mb-1", children: "What's Keeping You Up at Night?" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "message",
              rows: 4,
              required: true,
              value: formData.message,
              onChange: handleChange,
              placeholder: "Tell us what's frustrating you most. Lost leads? Wasted ad spend? Manual processes? We've heard it all — and fixed it all.",
              className: "w-full bg-muted text-foreground px-3 md:px-4 py-2.5 md:py-3 rounded-md border border-border outline-none focus:border-accent/20 focus:ring-1 focus:ring-accent transition-colors text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "w-full accent-gradient text-accent-foreground px-4 py-3 rounded-md font-bold hover:opacity-90 transition-opacity text-sm md:text-base flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Flame, { className: "h-5 w-5" }),
          "Get My Free Growth Strategy"
        ] }) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Free. No credit card. Response within 4 hours." })
      ] })
    ] }) }) }),
    isServicePickerOpen && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center bg-background/60 md:hidden", children: /* @__PURE__ */ jsxs(motion.div, { initial: { y: 40, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 40, opacity: 0 }, className: "w-full max-w-md bg-secondary rounded-t-2xl p-4 pb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-foreground", children: "What's Your Biggest Problem?" }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "text-muted-foreground", onClick: () => setIsServicePickerOpen(false), children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: MOBILE_SERVICE_OPTIONS.map((val) => /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            handleServiceChange(val);
            setIsServicePickerOpen(false);
          },
          className: "w-full text-left px-3 py-2 rounded-md bg-muted hover:bg-muted/70 text-sm text-foreground",
          children: SERVICE_LABELS[val]
        },
        val
      )) })
    ] }) })
  ] });
};
const ContactInfo = () => {
  return /* @__PURE__ */ jsx("div", { className: "py-16 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold font-display mb-4 text-foreground", children: "Prefer to Talk to a Human?" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: "No bots. No runaround. Real strategists who understand your business." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12", children: CONTACT_DETAILS_DATA.map((item, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "rounded-2xl border border-border bg-card p-6 shadow-card text-center hover:border-accent/50 transition-colors",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-4", children: item.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-3 text-center text-accent", children: item.title }),
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-center", children: item.details.map((detail, detailIndex) => /* @__PURE__ */ jsx("p", { children: detail }, detailIndex)) })
        ]
      },
      index
    )) }),
    /* @__PURE__ */ jsx(motion.div, { className: "mt-16", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: /* @__PURE__ */ jsx("div", { className: "w-full h-80 md:h-96 rounded-xl overflow-hidden border border-border", children: /* @__PURE__ */ jsx(
      "iframe",
      {
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50470.04181970438!2d-122.43523211165136!3d37.75790247804089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus",
        width: "100%",
        height: "100%",
        style: { border: 0 },
        allowFullScreen: true,
        title: "Office Location"
      }
    ) }) })
  ] }) });
};
const products = [
  { id: "prod-001", name: "Alpha Unit", price: 299.99, stock: 10 },
  { id: "prod-002", name: "Beta Package", price: 499.99, stock: 5 },
  { id: "prod-003", name: "Gamma Solution", price: 799.99, stock: 3 },
  { id: "prod-004", name: "Delta Enterprise", price: 1299.99, stock: 2 }
];
const customer = {
  id: "cust-001",
  name: "Demo Customer",
  email: "demo@example.com",
  phone: "(555) 123-4567",
  notes: []
};
const orders = [];
const generateId = (prefix) => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 5e3;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
const toastTimeouts = /* @__PURE__ */ new Map();
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) return;
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: "REMOVE_TOAST", toastId });
  }, TOAST_REMOVE_DELAY);
  toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT)
      };
    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === action.toast.id ? { ...t, ...action.toast } : t
        )
      };
    case "DISMISS_TOAST": {
      const { toastId } = action;
      return {
        ...state,
        toasts: state.toasts.map(
          (t) => t.id === toastId || toastId === void 0 ? { ...t, open: false } : t
        )
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === void 0) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId)
      };
    default:
      return state;
  }
};
const listeners = [];
let memoryState = { toasts: [] };
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  memoryState.toasts.forEach((toast2) => {
    if (!toast2.open && !toastTimeouts.has(toast2.id)) {
      addToRemoveQueue(toast2.id);
    }
  });
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}
function toast({ ...props }) {
  const id = genId();
  const update = (props2) => dispatch({ type: "UPDATE_TOAST", toast: { ...props2, id } });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      }
    }
  });
  return { id, dismiss, update };
}
function useToast() {
  const [state, setState] = React.useState(memoryState);
  React.useEffect(() => {
    listeners.push(setState);
    setState(memoryState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: "DISMISS_TOAST", toastId })
  };
}
const OrderContext = createContext(void 0);
function OrderProvider({ children }) {
  const [productsList, setProductsList] = useState([...products]);
  const [ordersList, setOrdersList] = useState([...orders]);
  const [customerData, setCustomerData] = useState({ ...customer });
  const [activeSection, setActiveSection] = useState(1);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const createOrder = (productId, quantity) => {
    const product = productsList.find((p) => p.id === productId);
    if (!product) {
      toast({
        title: "Error",
        description: "Product not found",
        variant: "destructive"
      });
      return;
    }
    if (product.stock < quantity) {
      toast({
        title: "Cannot Create Order",
        description: `Only ${product.stock} units available`,
        variant: "destructive"
      });
      return;
    }
    const newOrder = {
      id: generateId("order"),
      customerId: customerData.id,
      product,
      quantity,
      total: product.price * quantity,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const updatedProducts = productsList.map(
      (p) => p.id === product.id ? { ...p, stock: p.stock - quantity } : p
    );
    setOrdersList([newOrder, ...ordersList]);
    setProductsList(updatedProducts);
    setHighlightedOrderId(newOrder.id);
    toast({
      title: "Order Created",
      description: `Order for ${quantity} x ${product.name} has been created`
    });
  };
  const confirmOrder = (orderId) => {
    const updatedOrders = ordersList.map(
      (order) => order.id === orderId ? { ...order, status: "confirmed", updatedAt: /* @__PURE__ */ new Date() } : order
    );
    setOrdersList(updatedOrders);
    toast({
      title: "Order Confirmed",
      description: `Order ${orderId} has been confirmed`
    });
  };
  const beginFulfillment = (orderId) => {
    const updatedOrders = ordersList.map(
      (order) => order.id === orderId ? { ...order, status: "processing", updatedAt: /* @__PURE__ */ new Date() } : order
    );
    setOrdersList(updatedOrders);
    toast({
      title: "Fulfillment Started",
      description: `Order ${orderId} is now being processed`
    });
  };
  const shipOrder = (orderId) => {
    const updatedOrders = ordersList.map(
      (order) => order.id === orderId ? { ...order, status: "shipped", updatedAt: /* @__PURE__ */ new Date() } : order
    );
    setOrdersList(updatedOrders);
    toast({
      title: "Order Shipped",
      description: `Order ${orderId} has been marked as shipped`
    });
  };
  const adjustStock = (productId, quantity) => {
    const updatedProducts = productsList.map(
      (product) => product.id === productId ? { ...product, stock: product.stock + quantity } : product
    );
    setProductsList(updatedProducts);
    toast({
      title: "Stock Updated",
      description: `Stock for product has been adjusted by ${quantity} units`
    });
  };
  const addCustomerNote = (content) => {
    const newNote = {
      id: generateId("note"),
      content,
      createdAt: /* @__PURE__ */ new Date()
    };
    setCustomerData({
      ...customerData,
      notes: [newNote, ...customerData.notes]
    });
    toast({
      title: "Note Added",
      description: "Customer note has been added successfully"
    });
  };
  const getOrdersByStatus = (status) => {
    return ordersList.filter((order) => order.status === status);
  };
  const getOrdersForSalesperson = () => {
    return ordersList;
  };
  const getOrdersForAdmin = () => {
    return ordersList;
  };
  return /* @__PURE__ */ jsx(OrderContext.Provider, { value: {
    products: productsList,
    orders: ordersList,
    customer: customerData,
    createOrder,
    confirmOrder,
    beginFulfillment,
    shipOrder,
    adjustStock,
    addCustomerNote,
    getOrdersByStatus,
    getOrdersForSalesperson,
    getOrdersForAdmin,
    setActiveSection,
    activeSection,
    setHighlightedOrderId,
    highlightedOrderId
  }, children });
}
const CustomSoftwareHero = ({ subtitle }) => {
  return /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(HeroBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
      AnimatedHero,
      {
        badge: "Still running your business on spreadsheets?",
        titlePrefix: "Your competitors are",
        rotatingWords: ["automating", "scaling", "winning", "growing", "thriving"],
        description: "Every hour your team wastes on manual processes is an hour your competitor uses to serve more customers, make fewer errors, and grow faster. We're a software development company in Malaysia that builds custom software development solutions to end the chaos.",
        primaryCTA: { label: "Get Free Software Consultation", href: "/contact/" },
        secondaryCTA: { label: "See How It Works", href: "/custom-software/" }
      }
    ) })
  ] });
};
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
const steps = [
  { n: "01", title: "The Deep Dive", desc: "We don't just ask what you want — we study your operations, find the bottlenecks costing you money, and map out the system that eliminates them." },
  { n: "02", title: "Blueprint & Prototype", desc: "Before writing a single line of code, you see and test a working prototype. No surprises. No 'that's not what I wanted.' Zero risk." },
  { n: "03", title: "Build & Integrate", desc: "Our team builds your system and integrates it with your existing tools — CRM, ERP, payment gateways, WhatsApp, whatever you need." },
  { n: "04", title: "Launch & Optimize", desc: "We don't just hand it off and disappear. We launch, train your team, monitor performance, and optimize until it runs like clockwork." }
];
const ProcessSection = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "text-center mb-12",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: [
            "From Chaos to ",
            /* @__PURE__ */ jsx("span", { className: "text-gradient", children: "Clockwork" }),
            " in 4 Steps"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto", children: "A proven approach used by our software development company to deliver reliable custom software — on time and on budget." })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-2", children: steps.map((s, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: i * 0.05 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("span", { className: "block text-2xl md:text-4xl font-bold text-accent mb-2", children: s.n }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-semibold mb-2 text-accent", children: s.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-md text-muted-foreground", children: s.desc })
        ]
      },
      s.n
    )) })
  ] }) });
};
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
const BLOG_TAGS = ["custom software", "software development", "automation", "business systems", "erp", "crm integration"];
const CustomerSoftware = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Custom Software Development Solutions Malaysia";
    const ensureMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      return el;
    };
    ensureMeta("description", "Software development company in Malaysia offering custom software development services, custom business systems, and automation tools for cost optimization.");
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}/custom-software/`);
    const faqJson = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "What are custom software development solutions?", acceptedAnswer: { "@type": "Answer", text: "Custom software development solutions are tailored applications built to your exact business needs—ensuring better fit, efficiency, and ROI." } },
        { "@type": "Question", name: "Are you a software development company in Malaysia?", acceptedAnswer: { "@type": "Answer", text: "Yes, we are a software company in Malaysia providing full-cycle custom software development services for local and international clients." } },
        { "@type": "Question", name: "How do custom business systems improve efficiency?", acceptedAnswer: { "@type": "Answer", text: "By aligning to your workflows, custom business systems reduce manual work through business automation software and software automation tools." } },
        { "@type": "Question", name: "Can you integrate with existing platforms?", acceptedAnswer: { "@type": "Answer", text: "As a software provider we integrate CRMs, ERPs, and other platforms to create efficient software ecosystems." } },
        { "@type": "Question", name: "How do you approach cost optimization?", acceptedAnswer: { "@type": "Answer", text: "We design for maintainability, automate where it matters, and prioritize high-impact features to optimize total cost of ownership." } }
      ]
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqJson);
    document.head.appendChild(script);
    return () => {
      document.title = prevTitle;
      script.remove();
    };
  }, []);
  return /* @__PURE__ */ jsx(OrderProvider, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(CustomSoftwareHero, { subtitle: "Custom software, automation tools, and systems engineered for efficiency and cost optimization." }),
      /* @__PURE__ */ jsx(ServicesSection, {}),
      /* @__PURE__ */ jsx(BenefitsSection, {}),
      /* @__PURE__ */ jsx(ProcessSection, {}),
      /* @__PURE__ */ jsx(
        BlogSection,
        {
          tags: BLOG_TAGS,
          title: "Software Development Insights",
          subtitle: "Explore the latest trends and best practices in custom software development"
        }
      ),
      /* @__PURE__ */ jsx(CTASection, {}),
      /* @__PURE__ */ jsx(FAQSection, {}),
      /* @__PURE__ */ jsx(
        LeadForm,
        {
          heading: "Get Your Custom Software Quote",
          subheading: "Tell us about your project and we'll get back to you with a tailored proposal — no obligations.",
          defaultService: "order"
        }
      ),
      /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] }) });
};
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight ",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const HERO_ROTATING_WORDS$1 = ["automated", "scalable", "high-converting", "intelligent"];
const HERO_PRIMARY_CTA$1 = { label: "Start Free Trial", href: "/contact/" };
const HERO_SECONDARY_CTA$1 = { label: "Explore Features", href: "/growth-hub/" };
function LeadzapBlog() {
  var _a;
  const { blogPosts, getFeaturedPost } = useContent();
  const featuredPost = getFeaturedPost();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(HeroBackground, {}),
      /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
        AnimatedHero,
        {
          badge: "Master the Art of Lead Generation",
          titlePrefix: "Lead generation that is",
          rotatingWords: HERO_ROTATING_WORDS$1,
          description: "Unlock the secrets to high-quality leads. Expert guides and data-driven tactics for modern sales teams.",
          primaryCTA: HERO_PRIMARY_CTA$1,
          secondaryCTA: HERO_SECONDARY_CTA$1
        }
      ) })
    ] }),
    featuredPost && /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold font-display mb-8 text-center", children: "Featured Strategy" }),
      /* @__PURE__ */ jsx(Link, { to: `/blog/${featuredPost.id}/`, className: "group", children: /* @__PURE__ */ jsx("div", { className: "bg-secondary rounded-2xl overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:-translate-y-2", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-0", children: [
        featuredPost.imageUrl && /* @__PURE__ */ jsx("div", { className: "overflow-hidden [aspect-ratio:16/9] group/image", children: /* @__PURE__ */ jsx("img", { src: featuredPost.imageUrl, alt: featuredPost.title, className: "w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-105", loading: "lazy" }) }),
        /* @__PURE__ */ jsxs("div", { className: "p-8 flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: (_a = featuredPost.tags) == null ? void 0 : _a.map((tag) => /* @__PURE__ */ jsx(Badge, { className: "bg-accent/20 text-accent border-accent/30", children: tag }, tag)) }),
          /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold font-display mb-4 group-hover:text-accent transition-colors", children: featuredPost.title }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-6 text-lg leading-relaxed line-clamp-3", children: featuredPost.excerpt }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: featuredPost.author })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsx("span", { children: new Date(featuredPost.publishedAt).toLocaleDateString() })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "group/btn p-0 h-auto font-semibold text-accent hover:text-accent/80 w-fit", children: [
            "Read Full Strategy",
            /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" })
          ] })
        ] })
      ] }) }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-16 bg-secondary/50", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold font-display mb-12 text-center", children: "Growth Resources" }),
      blogPosts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20 bg-background rounded-2xl border border-dashed border-border", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg mb-2", children: "No articles published yet." }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground/60", children: "Once you add posts in your admin dashboard, they will appear here." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: blogPosts.filter((post) => !post.featured).map((post, index) => {
        var _a2;
        return /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, viewport: { once: true }, children: /* @__PURE__ */ jsx(Link, { to: `/blog/${post.id}/`, className: "group", children: /* @__PURE__ */ jsxs(Card, { className: "h-full bg-background border-border hover:border-accent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl", children: [
          post.imageUrl && /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-t-lg aspect-video", children: /* @__PURE__ */ jsx("img", { src: post.imageUrl, alt: post.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300", loading: "lazy" }) }),
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: (_a2 = post.tags) == null ? void 0 : _a2.map((tag) => /* @__PURE__ */ jsx(Badge, { className: "text-[10px] bg-accent/10 text-accent border-accent/20 uppercase", children: tag }, tag)) }),
            /* @__PURE__ */ jsx(CardTitle, { className: "text-xl mb-2 group-hover:text-accent transition-colors line-clamp-2", children: post.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(User, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { children: post.author })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-3 h-3" }),
                /* @__PURE__ */ jsx("span", { children: new Date(post.publishedAt).toLocaleDateString() })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mb-4 line-clamp-3 text-sm", children: post.excerpt }),
            /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "group/btn p-0 h-auto text-sm font-bold text-accent", children: [
              "View Article",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" })
            ] })
          ] })
        ] }) }) }, post.id);
      }) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-gradient-to-b from-transparent to-accent/5", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 text-center", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 }, transition: { duration: 0.5 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("h2", { className: "text-4xl font-bold font-display mb-6", children: [
        "Ready to skyrocket your ",
        /* @__PURE__ */ jsx(Cover, { children: "Conversion Rate?" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-muted-foreground mb-10 max-w-2xl mx-auto", children: "Join 5,000+ marketers getting weekly insights on automation and lead generation." }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: /* @__PURE__ */ jsx(Link, { to: "/contact", children: /* @__PURE__ */ jsx(Button, { className: "bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-accent/20 transition-all", children: "Subscribe Now" }) }) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function BlogPost() {
  var _a;
  const { id } = useParams();
  const { blogPosts } = useContent();
  const post = blogPosts.find((p) => p.id === id);
  if (!post) {
    if (blogPosts.length === 0) {
      return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background text-foreground flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "animate-pulse flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Loading article..." })
      ] }) });
    }
    return /* @__PURE__ */ jsx(Navigate, { to: "/blog/", replace: true });
  }
  const formattedContent = post.content.split("\n").map((p) => p.trim()).filter((p) => p.length > 0);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    post.imageUrl ? /* @__PURE__ */ jsxs("div", { className: "relative h-[40vh] md:h-[50vh] overflow-hidden mt-16", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: post.imageUrl,
          alt: post.title,
          className: "w-full h-full object-cover"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "mt-24" }),
    /* @__PURE__ */ jsx("article", { className: "max-w-4xl mx-auto px-4 py-12 flex-grow w-full relative z-10 -mt-20", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsxs(Link, { to: "/blog/", className: "inline-flex items-center text-accent hover:text-accent/80 mb-8 transition-colors font-medium", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
            "Back to Articles"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: (_a = post.tags) == null ? void 0 : _a.map((tag) => /* @__PURE__ */ jsx(Badge, { className: "bg-accent/10 text-accent border-accent/20 text-sm py-1 px-3", children: tag }, tag)) }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 leading-tight tracking-tight", children: post.title }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-6 mb-10 pb-8 border-b border-border text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-accent" }),
                /* @__PURE__ */ jsx("span", { className: "font-medium text-foreground", children: post.author })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-accent" }),
                /* @__PURE__ */ jsx("span", { children: post.publishedAt instanceof Date ? post.publishedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "border-border hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all",
                onClick: () => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, text: post.excerpt, url: window.location.href }).catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                },
                children: [
                  /* @__PURE__ */ jsx(Share2, { className: "w-4 h-4 mr-2" }),
                  "Share Article"
                ]
              }
            )
          ] }),
          post.excerpt && /* @__PURE__ */ jsx("div", { className: "bg-secondary/50 border-l-4 border-accent rounded-r-lg p-6 mb-10", children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-foreground font-medium leading-relaxed italic", children: [
            '"',
            post.excerpt,
            '"'
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "prose prose-lg prose-invert max-w-none mb-16", children: formattedContent.map((paragraph, index) => /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: paragraph }, index)) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-16 bg-gradient-to-br from-secondary via-background to-accent/5 border border-border rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "max-w-xl", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-2xl md:text-3xl font-bold font-display mb-4", children: [
                "Ready to ",
                /* @__PURE__ */ jsx(Cover, { children: "Transform" }),
                " Your Lead Generation?"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg", children: "Stop leaving money on the table. Automate your sales funnel and start closing more deals with Leadzap today." })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(Link, { to: "/contact/", children: /* @__PURE__ */ jsx(Button, { className: "bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-accent/20 transition-all", children: "Get Free Demo" }) }) })
          ] })
        ]
      }
    ) }),
    blogPosts.length > 1 && /* @__PURE__ */ jsx("section", { className: "py-20 bg-secondary/30 border-t border-border", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold font-display mb-10", children: "More Growth Insights" }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8", children: blogPosts.filter((p) => p.id !== post.id).slice(0, 2).map((relatedPost) => {
        var _a2;
        return /* @__PURE__ */ jsx(Link, { to: `/blog/${relatedPost.id}/`, className: "group", children: /* @__PURE__ */ jsxs("div", { className: "h-full bg-background border border-border rounded-xl overflow-hidden hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1", children: [
          relatedPost.imageUrl && /* @__PURE__ */ jsx("div", { className: "aspect-video overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: relatedPost.imageUrl,
              alt: relatedPost.title,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 mb-4", children: (_a2 = relatedPost.tags) == null ? void 0 : _a2.slice(0, 2).map((tag) => /* @__PURE__ */ jsx(Badge, { className: "text-[10px] bg-accent/10 text-accent uppercase tracking-wider", children: tag }, tag)) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2", children: relatedPost.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm mb-4 line-clamp-2", children: relatedPost.excerpt }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground font-medium", children: new Date(relatedPost.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })
          ] })
        ] }) }, relatedPost.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;
function CreatePostForm({
  onSubmit,
  onCancel
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const tags = useMemo(
    () => (tagsInput || "").split(",").map((t) => t.trim()).filter(Boolean),
    [tagsInput]
  );
  const previewSrc = useMemo(() => imageUrl ? imageUrl : "", [imageUrl]);
  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!author.trim()) return "Author is required.";
    if (!content.trim()) return "Content is required.";
    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      return "Image URL must start with http(s)://";
    }
    return "";
  };
  const handleSubmit = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
        excerpt: (excerpt || content.slice(0, 150) + "...").trim(),
        imageUrl: imageUrl || void 0,
        tags,
        featured: false
      });
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "title", children: "Title" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "title",
            value: title || "",
            onChange: (e) => setTitle(e.target.value),
            placeholder: "Enter post title"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "author", children: "Author" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "author",
            value: author || "",
            onChange: (e) => setAuthor(e.target.value),
            placeholder: "Author name"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "tags", children: "Tags (comma separated)" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "tags",
          value: tagsInput || "",
          onChange: (e) => setTagsInput(e.target.value),
          placeholder: "web development, react, javascript"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "excerpt", children: "Excerpt" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          id: "excerpt",
          value: excerpt || "",
          onChange: (e) => setExcerpt(e.target.value),
          placeholder: "Brief description of the post",
          rows: 2
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "content", children: "Content" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          id: "content",
          value: content || "",
          onChange: (e) => setContent(e.target.value),
          placeholder: "Write your blog post content here...",
          rows: 8
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "imageUrl", children: "Cover Image URL" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "imageUrl",
          value: imageUrl || "",
          onChange: (e) => setImageUrl(e.target.value),
          placeholder: "https://example.com/image.jpg"
        }
      ),
      previewSrc ? /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-lg overflow-hidden border border-gray-800", children: /* @__PURE__ */ jsx("img", { src: previewSrc, alt: "Preview", className: "w-full max-h-60 object-cover" }) }) : null
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-400", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          disabled: submitting,
          onClick: handleSubmit,
          className: "bg-yellow-400 text-black hover:bg-yellow-300 w-full",
          children: submitting ? "Creating..." : "Create Post"
        }
      ),
      onCancel && /* @__PURE__ */ jsx(
        Button,
        {
          variant: "outline",
          className: "border-gray-700 text-black hover:bg-gray-800 w-40",
          type: "button",
          onClick: onCancel,
          disabled: submitting,
          children: "Cancel"
        }
      )
    ] })
  ] });
}
function AdminDashboard() {
  const content = useContent();
  const {
    blogPosts = [],
    testimonials = [],
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    setFeaturedPost,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial
  } = content;
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    username: "",
    body: "",
    img: "",
    country: ""
  });
  const handleUpdatePost = () => {
    if (editingPost) {
      const tagsArray = Array.isArray(editingPost.tags) ? editingPost.tags : editingPost.tags.toString().split(",").map((tag) => tag.trim()).filter(Boolean);
      updateBlogPost(editingPost.id, {
        title: editingPost.title,
        content: editingPost.content,
        excerpt: editingPost.excerpt,
        author: editingPost.author,
        imageUrl: editingPost.imageUrl,
        tags: tagsArray
      });
      setEditingPost(null);
    }
  };
  const handleAddTestimonial = () => {
    if (newTestimonial.name && newTestimonial.body) {
      addTestimonial(newTestimonial);
      setNewTestimonial({ name: "", username: "", body: "", img: "", country: "" });
      setIsAddingTestimonial(false);
    }
  };
  const handleUpdateTestimonial = () => {
    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, editingTestimonial);
      setEditingTestimonial(null);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-black text-white", children: [
    /* @__PURE__ */ jsx("header", { className: "border-b border-gray-800 bg-black/90 backdrop-blur-sm sticky top-0 z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            className: "flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" }),
              "Back to Home"
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-yellow-400", children: "Admin Dashboard" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex gap-6", children: /* @__PURE__ */ jsx(Link, { to: "/blog/", className: "text-gray-300 hover:text-yellow-400 transition-colors", children: "View Blog" }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "mb-8",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-4xl font-bold mb-4", children: [
              "Welcome to ",
              /* @__PURE__ */ jsx("span", { className: "text-yellow-400", children: "Leadzap" }),
              " Admin"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-lg", children: "Manage your blog content and client testimonials to showcase your marketing expertise." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.1 },
            children: /* @__PURE__ */ jsxs(Card, { className: "bg-gray-900 border-gray-800", children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-gray-300", children: "Total Posts" }),
                /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-yellow-400" })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: blogPosts.length }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Marketing insights published" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.2 },
            children: /* @__PURE__ */ jsxs(Card, { className: "bg-gray-900 border-gray-800", children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sm font-medium text-gray-300", children: "Client Testimonials" }),
                /* @__PURE__ */ jsx(Users, { className: "h-4 h-4 text-yellow-400" })
              ] }),
              /* @__PURE__ */ jsxs(CardContent, { children: [
                /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-white", children: testimonials.length }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Happy client reviews" })
              ] })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Tabs, { defaultValue: "posts", className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "bg-gray-900 border-gray-800", children: [
          /* @__PURE__ */ jsx(
            TabsTrigger,
            {
              value: "posts",
              className: "text-gray-300 data-[state=active]:bg-yellow-400 data-[state=active]:text-black",
              children: "Blog Posts"
            }
          ),
          /* @__PURE__ */ jsx(
            TabsTrigger,
            {
              value: "testimonials",
              className: "text-gray-300 data-[state=active]:bg-yellow-400 data-[state=active]:text-black",
              children: "Testimonials"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "posts", className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-white", children: "Manage Blog Posts" }),
            /* @__PURE__ */ jsxs(Dialog, { open: isAddingPost, onOpenChange: setIsAddingPost, children: [
              /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "bg-yellow-400 text-black hover:bg-yellow-300", children: [
                /* @__PURE__ */ jsx(PlusCircle, { className: "w-4 h-4 mr-2" }),
                "Add New Post"
              ] }) }),
              /* @__PURE__ */ jsxs(
                DialogContent,
                {
                  className: "\n                    max-w-2xl max-h-[85vh] overflow-y-auto bg-gray-900 border-gray-800 text-white\n                    [&_input]:text-black [&_textarea]:text-black\n                    [&_input]:bg-white [&_textarea]:bg-white\n                    [&_input]:placeholder:text-gray-500 [&_textarea]:placeholder:text-gray-500\n                    [&_input]:border-gray-300 [&_textarea]:border-gray-300\n                    [&_input:focus]:ring-yellow-400 [&_textarea:focus]:ring-yellow-400\n                  ",
                  onOpenAutoFocus: (e) => e.preventDefault(),
                  children: [
                    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-yellow-400", children: "Create New Blog Post" }) }),
                    /* @__PURE__ */ jsx(
                      CreatePostForm,
                      {
                        onSubmit: async (payload) => {
                          await addBlogPost({
                            title: payload.title,
                            content: payload.content,
                            excerpt: payload.excerpt,
                            author: payload.author,
                            imageUrl: payload.imageUrl,
                            // 仅 URL
                            tags: payload.tags,
                            featured: payload.featured
                          });
                          setIsAddingPost(false);
                        },
                        onCancel: () => setIsAddingPost(false)
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: blogPosts.map((post) => /* @__PURE__ */ jsxs(Card, { className: "bg-gray-900 border-gray-800", children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-lg text-white", children: post.title }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-400", children: [
                  "by ",
                  post.author,
                  " • ",
                  post.publishedAt.toLocaleDateString()
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: post.tags.map((tag) => /* @__PURE__ */ jsx(
                  Badge,
                  {
                    className: "text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
                    children: tag
                  },
                  tag
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxs(
                  Dialog,
                  {
                    open: (editingPost == null ? void 0 : editingPost.id) === post.id,
                    onOpenChange: () => setEditingPost((editingPost == null ? void 0 : editingPost.id) === post.id ? null : post),
                    children: [
                      /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          className: "border-gray-700 hover:bg-gray-800",
                          children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                        }
                      ) }),
                      /* @__PURE__ */ jsxs(
                        DialogContent,
                        {
                          className: "\n                              max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800 text-white\n                              [&_input]:text-black [&_textarea]:text-black\n                              [&_input]:bg-white [&_textarea]:bg-white\n                              [&_input]:placeholder:text-gray-500 [&_textarea]:placeholder:text-gray-500\n                              [&_input]:border-gray-300 [&_textarea]:border-gray-300\n                              [&_input:focus]:ring-yellow-400 [&_textarea:focus]:ring-yellow-400\n                            ",
                          children: [
                            /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-yellow-400", children: "Edit Blog Post" }) }),
                            editingPost && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-title", children: "Title" }),
                                /* @__PURE__ */ jsx(
                                  Input,
                                  {
                                    id: "edit-title",
                                    value: editingPost.title || "",
                                    onChange: (e) => setEditingPost(
                                      (prev) => prev ? { ...prev, title: e.target.value } : null
                                    )
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-author", children: "Author" }),
                                /* @__PURE__ */ jsx(
                                  Input,
                                  {
                                    id: "edit-author",
                                    value: editingPost.author || "",
                                    onChange: (e) => setEditingPost(
                                      (prev) => prev ? { ...prev, author: e.target.value } : null
                                    )
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-imageUrl", children: "Image URL" }),
                                /* @__PURE__ */ jsx(
                                  Input,
                                  {
                                    id: "edit-imageUrl",
                                    value: editingPost.imageUrl || "",
                                    onChange: (e) => setEditingPost(
                                      (prev) => prev ? { ...prev, imageUrl: e.target.value } : null
                                    )
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-tags", children: "Tags" }),
                                /* @__PURE__ */ jsx(
                                  Input,
                                  {
                                    id: "edit-tags",
                                    value: Array.isArray(editingPost.tags) ? editingPost.tags.join(", ") : editingPost.tags || "",
                                    onChange: (e) => setEditingPost(
                                      (prev) => prev ? {
                                        ...prev,
                                        tags: e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean)
                                      } : null
                                    )
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-excerpt", children: "Excerpt" }),
                                /* @__PURE__ */ jsx(
                                  Textarea,
                                  {
                                    id: "edit-excerpt",
                                    value: editingPost.excerpt || "",
                                    onChange: (e) => setEditingPost(
                                      (prev) => prev ? { ...prev, excerpt: e.target.value } : null
                                    ),
                                    rows: 2
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-content", children: "Content" }),
                                /* @__PURE__ */ jsx(
                                  Textarea,
                                  {
                                    id: "edit-content",
                                    value: editingPost.content || "",
                                    onChange: (e) => setEditingPost(
                                      (prev) => prev ? { ...prev, content: e.target.value } : null
                                    ),
                                    rows: 8
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsx(Button, { onClick: handleUpdatePost, className: "w-full", children: "Update Post" })
                            ] })
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => deleteBlogPost(post.id),
                    className: "text-destructive hover:text-destructive border-gray-700 hover:bg-gray-800",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: post.featured ? "default" : "outline",
                    size: "sm",
                    onClick: () => setFeaturedPost(post.id),
                    className: post.featured ? "bg-yellow-400 text-black hover:bg-yellow-300" : "border-gray-700 hover:bg-gray-800 text-yellow-400 hover:text-yellow-300",
                    children: post.featured ? "Featured" : "Set Featured"
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-gray-300 line-clamp-2", children: post.excerpt }) })
          ] }, post.id)) })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "testimonials", className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold text-white", children: "Manage Client Testimonials" }),
            /* @__PURE__ */ jsxs(Dialog, { open: isAddingTestimonial, onOpenChange: setIsAddingTestimonial, children: [
              /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "bg-yellow-400 text-black hover:bg-yellow-300", children: [
                /* @__PURE__ */ jsx(PlusCircle, { className: "w-4 h-4 mr-2" }),
                "Add New Testimonial"
              ] }) }),
              /* @__PURE__ */ jsxs(
                DialogContent,
                {
                  className: "\n                    max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800 text-white\n                    [&_input]:text-black [&_textarea]:text-black\n                    [&_input]:bg-white [&_textarea]:bg-white\n                    [&_input]:placeholder:text-gray-500 [&_textarea]:placeholder:text-gray-500\n                    [&_input]:border-gray-300 [&_textarea]:border-gray-300\n                    [&_input:focus]:ring-yellow-400 [&_textarea:focus]:ring-yellow-400\n                  ",
                  children: [
                    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-yellow-400", children: "Create New Testimonial" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name" }),
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            id: "name",
                            value: newTestimonial.name || "",
                            onChange: (e) => setNewTestimonial((prev) => ({ ...prev, name: e.target.value })),
                            placeholder: "Customer name"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { htmlFor: "username", children: "Username" }),
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            id: "username",
                            value: newTestimonial.username || "",
                            onChange: (e) => setNewTestimonial((prev) => ({ ...prev, username: e.target.value })),
                            placeholder: "@username"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { htmlFor: "country", children: "Country" }),
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            id: "country",
                            value: newTestimonial.country || "",
                            onChange: (e) => setNewTestimonial((prev) => ({ ...prev, country: e.target.value })),
                            placeholder: "🇺🇸 United States"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { htmlFor: "img", children: "Profile Image URL" }),
                        /* @__PURE__ */ jsx(
                          Input,
                          {
                            id: "img",
                            value: newTestimonial.img || "",
                            onChange: (e) => setNewTestimonial((prev) => ({ ...prev, img: e.target.value })),
                            placeholder: "https://example.com/profile.jpg"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(Label, { htmlFor: "body", children: "Testimonial" }),
                        /* @__PURE__ */ jsx(
                          Textarea,
                          {
                            id: "body",
                            value: newTestimonial.body || "",
                            onChange: (e) => setNewTestimonial((prev) => ({ ...prev, body: e.target.value })),
                            placeholder: "Write the testimonial text here...",
                            rows: 3
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(Button, { onClick: handleAddTestimonial, className: "w-full", children: "Create Testimonial" })
                    ] })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4", children: testimonials.map((testimonial) => /* @__PURE__ */ jsxs(Card, { className: "bg-gray-900 border-gray-800", children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: testimonial.img,
                    alt: testimonial.name,
                    className: "w-12 h-12 rounded-full object-cover"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold text-white", children: testimonial.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: testimonial.username }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400", children: testimonial.country })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxs(
                  Dialog,
                  {
                    open: (editingTestimonial == null ? void 0 : editingTestimonial.id) === testimonial.id,
                    onOpenChange: () => setEditingTestimonial(
                      (editingTestimonial == null ? void 0 : editingTestimonial.id) === testimonial.id ? null : testimonial
                    ),
                    children: [
                      /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          className: "border-gray-700 hover:bg-gray-800",
                          children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                        }
                      ) }),
                      /* @__PURE__ */ jsxs(
                        DialogContent,
                        {
                          className: "\n                              max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800 text-white\n                              [&_input]:text-black [&_textarea]:text-black\n                              [&_input]:bg-white [&_textarea]:bg-white\n                              [&_input]:placeholder:text-gray-500 [&_textarea]:placeholder:text-gray-500\n                              [&_input]:border-gray-300 [&_textarea]:border-gray-300\n                              [&_input:focus]:ring-yellow-400 [&_textarea:focus]:ring-yellow-400\n                            ",
                          children: [
                            /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { className: "text-yellow-400", children: "Edit Testimonial" }) }),
                            editingTestimonial && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-name", children: "Name" }),
                                /* @__PURE__ */ jsx(
                                  Input,
                                  {
                                    id: "edit-name",
                                    value: editingTestimonial.name || "",
                                    onChange: (e) => setEditingTestimonial(
                                      (prev) => prev ? { ...prev, name: e.target.value } : null
                                    )
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-username", children: "Username" }),
                                /* @__PURE__ */ jsx(
                                  Input,
                                  {
                                    id: "edit-username",
                                    value: editingTestimonial.username || "",
                                    onChange: (e) => setEditingTestimonial(
                                      (prev) => prev ? { ...prev, username: e.target.value } : null
                                    )
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-country", children: "Country" }),
                                /* @__PURE__ */ jsx(
                                  Input,
                                  {
                                    id: "edit-country",
                                    value: editingTestimonial.country || "",
                                    onChange: (e) => setEditingTestimonial(
                                      (prev) => prev ? { ...prev, country: e.target.value } : null
                                    )
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-img", children: "Profile Image URL" }),
                                /* @__PURE__ */ jsx(
                                  Input,
                                  {
                                    id: "edit-img",
                                    value: editingTestimonial.img || "",
                                    onChange: (e) => setEditingTestimonial(
                                      (prev) => prev ? { ...prev, img: e.target.value } : null
                                    )
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsxs("div", { children: [
                                /* @__PURE__ */ jsx(Label, { htmlFor: "edit-body", children: "Testimonial" }),
                                /* @__PURE__ */ jsx(
                                  Textarea,
                                  {
                                    id: "edit-body",
                                    value: editingTestimonial.body || "",
                                    onChange: (e) => setEditingTestimonial(
                                      (prev) => prev ? { ...prev, body: e.target.value } : null
                                    ),
                                    rows: 3
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ jsx(Button, { onClick: handleUpdateTestimonial, className: "w-full", children: "Update Testimonial" })
                            ] })
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => deleteTestimonial(testimonial.id),
                    className: "text-destructive hover:text-destructive border-gray-700 hover:bg-gray-800",
                    children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("p", { className: "text-gray-300", children: [
              '"',
              testimonial.body,
              '"'
            ] }) })
          ] }, testimonial.id)) })
        ] })
      ] })
    ] })
  ] });
}
const MarketingProcessDiagram = "/assets/Clients-DBTQPusL.webp";
const AnalyticsResults = "/assets/analytics-results-wFIrgug5.webp";
const MultiplatformAnimation = "/assets/multiplatform-animation-DsfPQOR6.gif";
const HERO_ROTATING_WORDS = ["your growth partner", "results-driven", "data-obsessed", "Malaysia's best"];
const HERO_PRIMARY_CTA = { label: "Start Your Growth Journey", href: "/contact/" };
const HERO_SECONDARY_CTA = { label: "View Our Services", href: "/growth-hub" };
const COMPANY_HIGHLIGHTS = [
  "One-stop solution provider with 461K+ sessions generated",
  "Full-service capabilities: SEO, Social Media, Design, Development",
  "Proprietary Push-Pull marketing framework",
  "75% average growth rate for client campaigns",
  "Malaysia-based with proven international success",
  "Custom software development and business automation"
];
const COMPANY_STATEMENTS = [
  { title: "Our Mission", text: "To be the one-stop digital marketing solution provider that accelerates business growth through innovative strategies, creative excellence, and measurable results." },
  { title: "Our Vision", text: "To be Malaysia's most trusted turnkey growth partner, leading the digital transformation of businesses through creativity, innovation, and proven methodologies." }
];
const CORE_SERVICES_DATA = [
  { icon: /* @__PURE__ */ jsx(Search, { className: "h-8 w-8" }), title: "SEO Services Malaysia", description: "Free SEO analysis Malaysia, SEO packages Malaysia, and local SEO Malaysia by Malaysia SEO expert consultants.", features: ["SEO Kuala Lumpur", "SEO Penang", "Google SEO Malaysia", "SEO Services Pricing Malaysia"] },
  { icon: /* @__PURE__ */ jsx(Megaphone, { className: "h-8 w-8" }), title: "Social Media Marketing Malaysia", description: "Leading social media marketing agency Malaysia for Facebook marketing Malaysia and social media agency marketing.", features: ["Facebook Marketing Malaysia", "Social Media Packages", "Instagram Marketing", "TikTok Ads"] },
  { icon: /* @__PURE__ */ jsx(BarChart2, { className: "h-8 w-8" }), title: "Google Ads Agency Malaysia", description: "Expert Google Ads Malaysia management with proven ROI and transparent pricing.", features: ["Google Ads Malaysia", "Google Product Listing Ads", "Google Shopping Ads", "PPC Management"] },
  { icon: /* @__PURE__ */ jsx(CodeXml, { className: "h-8 w-8" }), title: "Custom Software Development", description: "Software development company Malaysia delivering business automation and custom solutions.", features: ["CRM Systems", "ERP Solutions", "Business Automation", "Custom Applications"] }
];
const COMPREHENSIVE_SERVICES_DATA = [
  { icon: /* @__PURE__ */ jsx(PenTool, { className: "h-6 w-6" }), title: "Graphic Design", description: "Creative visual solutions for branding and marketing materials" },
  { icon: /* @__PURE__ */ jsx(Monitor, { className: "h-6 w-6" }), title: "Web Design & Development", description: "Responsive, conversion-optimized websites and applications" },
  { icon: /* @__PURE__ */ jsx(Camera, { className: "h-6 w-6" }), title: "Photo & Video Production", description: "Professional content creation for marketing campaigns" },
  { icon: /* @__PURE__ */ jsx(Target, { className: "h-6 w-6" }), title: "Content Production & Management", description: "Strategic content creation and distribution across platforms" }
];
const MULTI_DEVICE_FEATURES = [
  "Multi-device optimization for mobile, tablet, and desktop",
  "Professional graphic design and visual branding",
  "High-quality photo and video production",
  "Strategic content creation and management"
];
const MARKETING_PROCESS_STEPS = [
  { num: 1, title: "Multi-Channel Approach", desc: "Integrate SEO, Paid Ads, and Social Media for comprehensive market coverage." },
  { num: 2, title: "Data Collection & Analysis", desc: "Gather comprehensive data from all channels to optimize performance and identify opportunities." },
  { num: 3, title: "Traffic & Lead Generation", desc: "Convert optimized campaigns into qualified traffic and high-quality leads through CRM integration." },
  { num: 4, title: "Continuous Optimization", desc: "Maintain feedback loop to client, ensuring ongoing improvement and measurable results." }
];
const MARKETING_FRAMEWORK_DATA = [
  { icon: /* @__PURE__ */ jsx(Megaphone, { className: "h-8 w-8" }), title: "PUSH Strategy", desc: "Active brand promotion through strategic paid advertising campaigns that feed data into pull marketing.", items: ["Facebook, Instagram & TikTok advertising", "Influencer marketing campaigns", "Retargeting with pull data insights"] },
  { icon: /* @__PURE__ */ jsx(Search, { className: "h-8 w-8" }), title: "PULL Strategy", desc: "Natural audience attraction through search engines and organic discovery that enhances push campaigns.", items: ["SEO audit Malaysia & GEO for AI search", "Content marketing & authority building", "Data feeds into push advertising"] }
];
const CASE_STUDY_METRICS = [
  { label: "Growth Achievement", value: "+75%" },
  { label: "Organic Traffic Share", value: "79.6%" },
  { label: "Campaign Duration", value: "6+ Years" },
  { label: "Total Engagement", value: "373+ Days" }
];
const PERFORMANCE_METRICS = [
  { icon: /* @__PURE__ */ jsx(Eye, { className: "h-8 w-8" }), number: "461K", label: "Total Sessions", growth: "+75%" },
  { icon: /* @__PURE__ */ jsx(Users, { className: "h-8 w-8" }), number: "333K", label: "Total Users", growth: "+63%" },
  { icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-8 w-8" }), number: "1.07M", label: "Page Views", growth: "+89%" },
  { icon: /* @__PURE__ */ jsx(MousePointer, { className: "h-8 w-8" }), number: "2.96M", label: "Events Tracked", growth: "+73%" },
  { icon: /* @__PURE__ */ jsx(Clock, { className: "h-8 w-8" }), number: "373d 5h", label: "User Engagement", growth: "+60%" },
  { icon: /* @__PURE__ */ jsx(Target, { className: "h-8 w-8" }), number: "367K", label: "Organic Sessions", growth: "Leading Source" }
];
const WHY_CHOOSE_US_REASONS = [
  { title: "Total Solution Provider", description: "Everything under one roof—from strategy to execution, marketing to software development." },
  { title: "Data-Driven Approach", description: "All strategies backed by rigorous testing, transparent measurement, and continuous optimization." },
  { title: "Malaysia Expertise", description: "Deep understanding of Malaysian market dynamics with local SEO and cultural insights." },
  { title: "Custom Technology", description: "Proprietary software solutions tailored to your specific business workflows and requirements." },
  { title: "Proven Framework", description: "Our Push-Pull methodology creates synergies between paid and organic marketing channels." },
  { title: "Scalable Solutions", description: "From startups to enterprises—solutions that grow with your business needs." }
];
const OOH_PORTFOLIO_ITEMS = [
  { title: "OOH (Out-of-Home) Advertising", description: "Strategic outdoor advertising campaigns that capture attention and drive brand awareness across Malaysia's key locations.", features: ["Billboard Campaigns", "Transit Advertising", "Street Furniture", "Digital Displays"] },
  { title: "DOOH (Digital Out-of-Home)", description: "Dynamic digital advertising solutions that deliver targeted, real-time content to engage audiences in high-traffic areas.", features: ["LED Screens", "Interactive Displays", "Real-time Content", "Data-Driven Targeting"] },
  { title: "Road Shows & Booth Exhibitions", description: "Complete event marketing solutions from concept to execution, creating memorable brand experiences that drive engagement.", features: ["Event Planning", "Booth Design", "Interactive Experiences", "Lead Generation"] }
];
const CONTACT_INFO_DATA = [
  { icon: /* @__PURE__ */ jsx(Globe, { className: "h-12 w-12" }), title: "Location", main: "Malaysia", sub: "Serving Global Markets" },
  { icon: /* @__PURE__ */ jsx(Users, { className: "h-12 w-12" }), title: "Email", main: "info@leadzap.com", sub: "Business Inquiries" },
  { icon: /* @__PURE__ */ jsx(CheckCircle, { className: "h-12 w-12" }), title: "Free Consultation", main: "Available Now", sub: "Strategy & Planning" }
];
const CorporateProfile = () => {
  useEffect(() => {
    document.title = "Corporate Profile - Leadzap Marketing Sdn Bhd Malaysia";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Leadzap Marketing Sdn Bhd corporate profile - Leading digital marketing agency and software development company in Malaysia offering SEM, social media marketing, and custom software solutions.");
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(CompanyHeader, {}),
      /* @__PURE__ */ jsx(CompanyOverview, {}),
      /* @__PURE__ */ jsx(CoreServices, {}),
      /* @__PURE__ */ jsx(ComprehensiveServices, {}),
      /* @__PURE__ */ jsx(MarketingProcess, {}),
      /* @__PURE__ */ jsx(MarketingFramework, {}),
      /* @__PURE__ */ jsx(PerformanceResults, {}),
      /* @__PURE__ */ jsx(WhyChooseUs, {}),
      /* @__PURE__ */ jsx(OutOfHomePortfolio, {}),
      /* @__PURE__ */ jsx(ContactInformation, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
};
const CompanyHeader = () => {
  return /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(HeroBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
      AnimatedHero,
      {
        badge: "Top Digital Marketing Agency Malaysia",
        titlePrefix: "Leadzap Marketing is",
        rotatingWords: HERO_ROTATING_WORDS,
        description: "Top Digital Marketing Agency Malaysia | Digital Marketing Kuala Lumpur. We build the entire machine — SEO, ads, social, software — all working together so you never leave money on the table.",
        primaryCTA: HERO_PRIMARY_CTA,
        secondaryCTA: HERO_SECONDARY_CTA
      }
    ) })
  ] });
};
const CompanyOverview = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-start", children: [
      /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-6 text-foreground", children: "Digital Marketing Kuala Lumpur Leader" }),
        /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground mb-6 leading-relaxed", children: "Leadzap is the top digital marketing agency Malaysia businesses choose for results. As a leading social media marketing agency Malaysia, we deliver comprehensive SEO services pricing Malaysia and digital marketing Kuala Lumpur solutions." }),
        /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground mb-6 leading-relaxed", children: "Our Malaysia SEO consultant team provides free SEO analysis Malaysia, local SEO Malaysia optimization, and Google Ads agency Malaysia services—all under one roof." })
      ] }),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 30 },
          whileInView: { opacity: 1, x: 0 },
          transition: { duration: 0.6 },
          viewport: { once: true },
          className: "rounded-2xl border border-border bg-card p-8 shadow-card hover:border-accent/50 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-display font-bold mb-6 text-accent", children: "Company Highlights" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: COMPANY_HIGHLIGHTS.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-accent mt-1 mr-3 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "text-foreground", children: item })
            ] }, i)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 grid grid-cols-1 md:grid-cols-2 gap-4", children: COMPANY_STATEMENTS.map((item, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, x: i === 0 ? -30 : 30 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.5, delay: 0.3 + i * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h4", { className: "text-lg font-display font-semibold text-accent mb-3", children: item.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-md text-muted-foreground", children: item.text })
        ]
      },
      i
    )) })
  ] }) });
};
const CoreServices = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-10", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Core Services" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Our Core Services" }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "Comprehensive digital marketing and software development solutions designed to accelerate your business growth." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-4", children: CORE_SERVICES_DATA.map((service, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground", children: service.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-3 text-accent", children: service.title }),
          /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground mb-4", children: service.description }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: service.features.map((feature, featureIndex) => /* @__PURE__ */ jsxs("div", { className: "flex items-center text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-accent mr-2" }),
            feature
          ] }, featureIndex)) })
        ]
      },
      index
    )) })
  ] }) });
};
const ComprehensiveServices = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Complete Digital Solutions" }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-4xl mx-auto", children: "Beyond our core services, we offer a comprehensive suite of creative and technical solutions to support your entire digital ecosystem." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-2", children: COMPREHENSIVE_SERVICES_DATA.map((service, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 shadow-card text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground", children: service.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-display font-bold mb-3 text-accent", children: service.title }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: service.description })
        ]
      },
      index
    )) }),
    /* @__PURE__ */ jsx(motion.div, { className: "mt-10", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-card p-8 border border-accent/30 shadow-card", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-display font-bold mb-6 text-center text-accent", children: "Multi-Device & Creative Excellence" }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-8 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-left", children: [
          /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground mb-4", children: "Our comprehensive approach ensures seamless user experiences across all devices while delivering creative excellence through:" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-muted-foreground", children: MULTI_DEVICE_FEATURES.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-accent rounded-full mr-3" }),
            item
          ] }, i)) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: MultiplatformAnimation,
            alt: "Multi-platform digital marketing animation showcasing responsive design across devices",
            className: "max-w-full h-auto rounded-lg shadow-lg bg-foreground/10 p-4"
          }
        ) })
      ] })
    ] }) })
  ] }) });
};
const MarketingProcess = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Our Strategic Marketing Process" }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-4xl mx-auto", children: "Our systematic approach ensures every campaign is data-driven, results-focused, and continuously optimized for maximum impact." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6 items-center", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: /* @__PURE__ */ jsx("img", { src: MarketingProcessDiagram, alt: "Leadzap Marketing Sdn Bhd Process Flow Diagram", className: "w-full h-auto rounded-lg border border-accent/20" }) }),
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: MARKETING_PROCESS_STEPS.map((step) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 shadow-card hover:border-accent/50 transition-all duration-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 accent-gradient text-accent-foreground rounded-full flex items-center justify-center text-sm font-bold mr-4", children: step.num }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-display font-bold text-accent", children: step.title })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-md text-muted-foreground", children: step.desc })
      ] }, step.num)) }) })
    ] })
  ] }) });
};
const MarketingFramework = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Our Proprietary Push-Pull Framework" }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-4xl mx-auto", children: "Our innovative marketing framework creates a connected ecosystem where push data feeds into pull marketing for retargeting, while pull data improves push campaigns—maximizing ROI across all channels." })
    ] }),
    /* @__PURE__ */ jsx(motion.div, { className: "flex justify-center mb-8 md:mb-12", initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 }, transition: { duration: 0.6 }, viewport: { once: true }, children: /* @__PURE__ */ jsx("img", { src: PushPullFramework, alt: "Push-Pull Marketing Framework", className: "mx-auto max-w-md md:max-w-lg lg:max-w-2xl h-auto rounded-lg bg-card p-6" }) }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-8 mt-8 md:mt-12", children: MARKETING_FRAMEWORK_DATA.map((strategy, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 md:p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, x: i === 0 ? -30 : 30 },
        whileInView: { opacity: 1, x: 0 },
        transition: { duration: 0.5, delay: 0.3 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4 text-accent", children: strategy.icon }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-display font-bold text-accent", children: strategy.title })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-lg text-muted-foreground mb-4 text-center", children: strategy.desc }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: strategy.items.map((item, j) => /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-accent mt-2 mr-3 shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm md:text-md text-muted-foreground", children: item })
          ] }, j)) })
        ]
      },
      i
    )) })
  ] }) });
};
const PerformanceResults = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-6 lg:py-24 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Proven Performance Results" }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-4xl mx-auto", children: "Real results from our digital marketing campaigns - showcasing the power of our integrated approach and data-driven strategies." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-12 items-center mb-8", children: [
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: /* @__PURE__ */ jsx("img", { src: AnalyticsResults, alt: "Google Analytics Results showing 461K sessions with 75% growth", className: "w-full h-auto rounded-lg border border-accent/20" }) }),
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-accent/30 bg-card p-8 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-display font-bold mb-4 text-accent", children: "Single Client Case Study" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-muted-foreground mb-6 italic", children: "*Results shown are from one individual client campaign, demonstrating the effectiveness of our integrated approach." }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: CASE_STUDY_METRICS.map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm md:text-md text-muted-foreground", children: item.label }),
          /* @__PURE__ */ jsx("span", { className: "text-accent font-bold", children: item.value })
        ] }, i)) }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-accent", children: [
          /* @__PURE__ */ jsx("strong", { children: "Client Industry:" }),
          " Legal Services - Red Kite Solicitors"
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-6", children: PERFORMANCE_METRICS.map((metric, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-accent mb-3 flex justify-center", children: metric.icon }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-foreground mb-1", children: metric.number }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mb-2", children: metric.label }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-green-400 font-medium", children: metric.growth })
        ]
      },
      index
    )) })
  ] }) });
};
const WhyChooseUs = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-16 lg:py-24 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center md:mb-12 mb-8", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Why Choose Leadzap Marketing Sdn Bhd" }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "We believe breakthroughs come from innovative ideas that are tested rigorously, scaled responsibly, and measured transparently." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8", children: WHY_CHOOSE_US_REASONS.map((reason, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-3 text-accent", children: reason.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-md text-muted-foreground", children: reason.description })
        ]
      },
      index
    )) })
  ] }) });
};
const OutOfHomePortfolio = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-12 lg:py-16 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-8 md:mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Out-of-Home & Event Marketing" }),
      /* @__PURE__ */ jsx("p", { className: "text-md md:text-lg text-muted-foreground max-w-3xl mx-auto", children: "Comprehensive offline marketing solutions that create powerful brand presence and memorable customer experiences." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-3 md:gap-8 md:mb-6 mb-16", children: OOH_PORTFOLIO_ITEMS.map((item, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: index * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-display font-bold mb-3 text-accent", children: item.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm md:text-md text-muted-foreground mb-4", children: item.description }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: item.features.map((feature, featureIndex) => /* @__PURE__ */ jsxs("li", { className: "flex items-center text-xs md:text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-green-400 mr-2 flex-shrink-0" }),
            feature
          ] }, featureIndex)) })
        ]
      },
      index
    )) })
  ] }) });
};
const ContactInformation = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-10 lg:py-16 bg-secondary", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6", children: [
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mb-8 md:mb-12", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold mb-4 text-foreground", children: "Get In Touch" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-3xl mx-auto", children: "Ready to accelerate your business growth? Let's discuss how our integrated marketing and technology solutions can help you achieve your goals." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-3 gap-2 md:gap-8", children: CONTACT_INFO_DATA.map((item, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "group rounded-2xl border border-border bg-card p-8 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/50",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: i * 0.1 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("div", { className: "text-accent mx-auto mb-4", children: item.icon }),
          /* @__PURE__ */ jsx("h3", { className: "text-md md:text-xl font-display font-bold mb-2 text-accent", children: item.title }),
          /* @__PURE__ */ jsx("p", { className: "text-foreground", children: item.main }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: item.sub })
        ]
      },
      i
    )) }),
    /* @__PURE__ */ jsxs(motion.div, { className: "text-center mt-12 mb-5", initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 }, viewport: { once: true }, children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-2xl md:text-3xl font-display font-bold mb-6 text-foreground", children: [
        "Ready to ",
        /* @__PURE__ */ jsx(Cover, { children: "accelerate growth" }),
        "?"
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/contact/", children: /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "xl", children: [
        "Start Your Growth Journey",
        /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5 ml-2" })
      ] }) }) })
    ] })
  ] }) });
};
const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How We Work", href: "#delivery" },
  { label: "Packages", href: "#packages" },
  { label: "Calculator", href: "#calculator" },
  { label: "FAQ", href: "#faq" }
];
const GrowthHubNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = useCallback((href) => {
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  }, []);
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      className: `fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ${isScrolled ? "bg-primary/90 shadow-xl backdrop-blur-md py-2" : "bg-transparent py-4"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex h-16 items-center justify-between px-4 md:px-6", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "/growth-hub",
              className: "font-display text-2xl font-bold tracking-tighter text-primary-foreground group",
              children: [
                "Leadzap",
                /* @__PURE__ */ jsx("span", { className: "text-accent transition-all duration-300 group-hover:pl-1", children: "." })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-8 md:flex", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => navigate("/"),
                className: "group relative text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground",
                children: [
                  "Home",
                  /* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "h-4 w-[1px] bg-white/10" }),
            NAV_LINKS.map((link) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => scrollToSection(link.href),
                className: "group relative text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground",
                children: [
                  link.label,
                  /* @__PURE__ */ jsx("span", { className: "absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" })
                ]
              },
              link.label
            ))
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hidden items-center gap-4 md:flex", children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "accent",
              size: "sm",
              className: "shadow-lg shadow-accent/20 hover:shadow-accent/40",
              onClick: () => navigate("/contact/"),
              children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
                "Get Started"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "rounded-lg p-2 text-primary-foreground hover:bg-white/10 md:hidden",
              onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
              children: isMobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-6 w-6" }) : /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" })
            }
          )
        ] }),
        isMobileMenuOpen && /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-0 top-[100%] border-t border-white/10 bg-primary/98 p-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-5 duration-300 md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                navigate("/");
                setIsMobileMenuOpen(false);
              },
              className: "text-left text-lg font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground",
              children: "Back to HomePage"
            }
          ),
          /* @__PURE__ */ jsx("hr", { className: "border-white/10" }),
          NAV_LINKS.map((link) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => scrollToSection(link.href),
              className: "text-lg font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground",
              children: link.label
            },
            link.label
          )),
          /* @__PURE__ */ jsx("hr", { className: "border-white/10" }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "accent",
              size: "lg",
              className: "w-full",
              onClick: () => {
                navigate("/contact/");
                setIsMobileMenuOpen(false);
              },
              children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "mr-2 h-4 w-4" }),
                "Get Started"
              ]
            }
          )
        ] }) })
      ]
    }
  );
};
const Hero = () => {
  return /* @__PURE__ */ jsxs("header", { className: "hero-gradient relative overflow-hidden", children: [
    /* @__PURE__ */ jsx(HeroBackground, {}),
    /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(
      AnimatedHero,
      {
        badge: "One-Stop Digital Marketing Solution",
        titlePrefix: "Drive measurable growth with",
        rotatingWords: ["performance marketing", "paid ads", "SEO & GEO", "social media", "data-driven strategy"],
        description: "We focus on leads and e-commerce sales. Combining fast channels (paid ads) with compounding channels (SEO) so your business gets immediate enquiries and long-term growth.",
        primaryCTA: { label: "Get Started", href: "/contact/" },
        secondaryCTA: { label: "View Packages", href: "/growth-hub#packages/" }
      }
    ) })
  ] });
};
const services = [
  {
    icon: Search,
    title: "Google Ads",
    description: "Performance-driven campaigns capturing demand from people ready to buy. Search & Shopping ads optimised for sales and leads.",
    features: ["Keyword research & strategy", "Conversion tracking", "Weekly optimisation", "ROI focused"]
  },
  {
    icon: Globe,
    title: "SEO Management",
    description: "Build long-term organic traffic with optimised website structure, content, and visibility for high-intent keywords.",
    features: ["Technical SEO audit", "On-page optimisation", "Content strategy", "Monthly rankings report"]
  },
  {
    icon: Share2,
    title: "Social Media Ads",
    description: "Reach your ideal customers on Facebook, Instagram, TikTok & more with creative-led performance campaigns.",
    features: ["Content creation", "Ad creative production", "Retargeting setup", "Multi-platform management"]
  }
];
const Services = () => {
  return /* @__PURE__ */ jsx("section", { id: "services", className: "bg-background py-24", children: /* @__PURE__ */ jsxs("div", { className: "container px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-16 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Our Services" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl", children: "One-Stop Digital Marketing" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "We handle website/landing pages, creatives, ads setup, tracking, and optimisation under one plan. No need for multiple vendors." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: services.map((service, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "group relative rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        style: { animationDelay: `${index * 0.1}s` },
        children: [
          /* @__PURE__ */ jsx("div", { className: "mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground", children: /* @__PURE__ */ jsx(service.icon, { className: "h-7 w-7" }) }),
          /* @__PURE__ */ jsx("h3", { className: "mb-3 font-display text-xl font-bold text-foreground", children: service.title }),
          /* @__PURE__ */ jsx("p", { className: "mb-6 text-muted-foreground", children: service.description }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: service.features.map((feature) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("div", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
            feature
          ] }, feature)) })
        ]
      },
      service.title
    )) }),
    /* @__PURE__ */ jsx("div", { className: "mt-16 rounded-2xl bg-primary p-8 text-center md:p-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-2xl flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "h-8 w-8 text-accent" }),
        /* @__PURE__ */ jsx(BarChart3, { className: "h-8 w-8 text-accent" })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "font-display text-2xl font-bold text-primary-foreground md:text-3xl", children: "KPI Focus: Leads & E-commerce Sales" }),
      /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/70", children: "Everything we do is measured against leads (calls/WhatsApp/forms) or e-commerce purchases, plus cost per lead / cost per purchase." })
    ] }) })
  ] }) });
};
const phases = [
  {
    icon: Settings,
    phase: "Phase 1",
    title: "Foundation",
    duration: "Week 1-2",
    items: [
      "Tracking & analytics setup",
      "Landing page/website creation",
      "Creative + ad copy development",
      "Account structure planning"
    ]
  },
  {
    icon: Rocket,
    phase: "Phase 2",
    title: "Launch & Learning",
    duration: "Week 3-4",
    items: [
      "Testing keywords/audiences",
      "Multiple ad variations",
      "Early lead quality checks",
      "Weekly optimisations"
    ]
  },
  {
    icon: TrendingUp,
    phase: "Phase 3",
    title: "Optimise & Scale",
    duration: "Month 2-3+",
    items: [
      "Lower CPL over time",
      "Scale winning campaigns",
      "Add retargeting layers",
      "SEO content execution"
    ]
  }
];
const DeliveryModel = () => {
  return /* @__PURE__ */ jsx("section", { id: "delivery", className: "bg-secondary/30 py-24", children: /* @__PURE__ */ jsxs("div", { className: "container px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-16 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Rocket, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "How We Work" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl", children: "Our 3-Phase Delivery Model" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "A structured approach that ensures we build strong foundations before scaling for maximum ROI." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-accent via-accent/50 to-accent/20 lg:block" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-8 lg:grid-cols-3", children: phases.map((phase) => /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl border border-border bg-card p-8 shadow-card", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-4 left-8 lg:left-1/2 lg:-translate-x-1/2", children: /* @__PURE__ */ jsxs("div", { className: "flex h-8 items-center gap-2 rounded-full accent-gradient px-4 text-sm font-bold text-accent-foreground shadow-glow", children: [
          /* @__PURE__ */ jsx(phase.icon, { className: "h-4 w-4" }),
          phase.phase
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-2 text-sm font-medium text-accent", children: phase.duration }),
          /* @__PURE__ */ jsx("h3", { className: "mb-4 font-display text-2xl font-bold text-foreground", children: phase.title }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: phase.items.map((item) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "mt-0.5 h-5 w-5 flex-shrink-0 text-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: item })
          ] }, item)) })
        ] })
      ] }, phase.title)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "SEO Timeline:" }),
      " ",
      "Month 1 foundation → Month 2-3 early movement → Month 4-6 stronger rankings → Month 6-12 compounding growth (varies by competition)"
    ] }) })
  ] }) });
};
const packages = [
  {
    name: "Google Ads + SEO",
    price: "2,400",
    currency: "RM",
    period: "/month",
    description: "Complete search marketing solution for leads and e-commerce",
    suggestedBudget: "RM 2,000/month (Google)",
    featured: true,
    features: [
      "Website creation + creative",
      "Google Ads (Search & Shopping)",
      "SEO management & optimisation",
      "Tracking & analytics setup",
      "Weekly campaign optimisation",
      "Monthly performance reports",
      "Strategy & positioning direction"
    ]
  },
  {
    name: "Social Media Paid Ads",
    price: "2,100",
    currency: "RM",
    period: "/month",
    description: "Content creation & paid ads for social platforms",
    suggestedBudget: "RM 2,000/month per platform",
    featured: false,
    features: [
      "Content creation & management",
      "Graphic design for ads & posts",
      "Photo/video production (planned)",
      "Ads strategy & implementation",
      "Retargeting setup",
      "Monthly performance reports",
      "+RM 300/month per extra platform"
    ]
  }
];
const Packages = () => {
  const scrollToCalculator = () => {
    var _a;
    (_a = document.getElementById("calculator")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  return /* @__PURE__ */ jsx("section", { id: "packages", className: "bg-background py-24", children: /* @__PURE__ */ jsxs("div", { className: "container px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-16 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Crown, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Our Packages" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl", children: "Transparent Pricing" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "Packages sold annually with monthly instalments. Ad budgets are paid directly to platforms and are separate from management fees." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto grid max-w-5xl gap-8 md:grid-cols-2", children: packages.map((pkg) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative overflow-hidden rounded-2xl border ${pkg.featured ? "border-accent shadow-glow" : "border-border shadow-card"} bg-card p-8 transition-all duration-300 hover:-translate-y-1`,
        children: [
          pkg.featured && /* @__PURE__ */ jsx("div", { className: "absolute right-4 top-4", children: /* @__PURE__ */ jsx("div", { className: "rounded-full accent-gradient px-3 py-1 text-xs font-bold text-accent-foreground", children: "Most Popular" }) }),
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "mb-2 font-display text-2xl font-bold text-foreground", children: pkg.name }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: pkg.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: pkg.currency }),
              /* @__PURE__ */ jsx("span", { className: "font-display text-5xl font-bold text-foreground", children: pkg.price }),
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: pkg.period })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm text-muted-foreground", children: [
              "Suggested ad budget: ",
              pkg.suggestedBudget
            ] })
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "mb-8 space-y-3", children: pkg.features.map((feature) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx(Check, { className: "mt-0.5 h-5 w-5 flex-shrink-0 text-accent" }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground", children: feature })
          ] }, feature)) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: pkg.featured ? "accent" : "outline",
              size: "lg",
              className: "w-full",
              onClick: scrollToCalculator,
              children: [
                "Get Started",
                /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ]
            }
          )
        ]
      },
      pkg.name
    )) }),
    /* @__PURE__ */ jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: "Typical benchmark:" }),
      " ",
      "Website conversion rate is often 2-3% (varies by industry). We use 2.5% for planning safety."
    ] }) })
  ] }) });
};
const Slider = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(
  SliderPrimitive.Root,
  {
    ref,
    className: cn(
      "relative flex w-full touch-none select-none items-center",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx(SliderPrimitive.Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", children: /* @__PURE__ */ jsx(SliderPrimitive.Range, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsx(SliderPrimitive.Thumb, { className: "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = SliderPrimitive.Root.displayName;
const BudgetCalculator = () => {
  const [targetRevenue, setTargetRevenue] = useState(1e5);
  const [averageOrderValue, setAverageOrderValue] = useState(500);
  const [conversionRate, setConversionRate] = useState(2.5);
  const [budgetRatio, setBudgetRatio] = useState(20);
  const [results, setResults] = useState({
    conversionsNeeded: 0,
    leadsNeeded: 0,
    marketingBudget: 0,
    estimatedCPL: 0
  });
  useEffect(() => {
    const conversionsNeeded = Math.ceil(targetRevenue / averageOrderValue);
    const leadsNeeded = Math.ceil(conversionsNeeded / (conversionRate / 100));
    const marketingBudget = Math.round(targetRevenue * (budgetRatio / 100));
    const estimatedCPL = leadsNeeded > 0 ? Math.round(marketingBudget / leadsNeeded) : 0;
    setResults({ conversionsNeeded, leadsNeeded, marketingBudget, estimatedCPL });
  }, [targetRevenue, averageOrderValue, conversionRate, budgetRatio]);
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  return /* @__PURE__ */ jsx("section", { id: "calculator", className: "bg-primary py-24", children: /* @__PURE__ */ jsxs("div", { className: "container px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-12 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2", children: [
        /* @__PURE__ */ jsx(Calculator, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "Budget Calculator" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl", children: "Find Your Optimal Budget" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-primary-foreground/70", children: "Use this calculator to estimate your marketing budget based on your revenue goals. Marketing budget is typically 15-25% of target revenue." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-5xl", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur md:p-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-6 font-display text-xl font-bold text-primary-foreground", children: "Your Business Goals" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-primary-foreground/80", children: "Target Monthly Revenue" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-accent", children: formatCurrency(targetRevenue) })
            ] }),
            /* @__PURE__ */ jsx(Slider, { value: [targetRevenue], onValueChange: (v) => setTargetRevenue(v[0]), min: 1e4, max: 1e6, step: 1e4, className: "w-full" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-primary-foreground/50", children: [
              /* @__PURE__ */ jsx("span", { children: "RM 10K" }),
              /* @__PURE__ */ jsx("span", { children: "RM 1M" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-primary-foreground/80", children: "Average Order/Contract Value" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-accent", children: formatCurrency(averageOrderValue) })
            ] }),
            /* @__PURE__ */ jsx(Slider, { value: [averageOrderValue], onValueChange: (v) => setAverageOrderValue(v[0]), min: 50, max: 1e4, step: 50, className: "w-full" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-primary-foreground/50", children: [
              /* @__PURE__ */ jsx("span", { children: "RM 50" }),
              /* @__PURE__ */ jsx("span", { children: "RM 10K" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-primary-foreground/80", children: "Conversion Rate" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-accent", children: [
                conversionRate,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx(Slider, { value: [conversionRate], onValueChange: (v) => setConversionRate(v[0]), min: 1, max: 10, step: 0.5, className: "w-full" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-primary-foreground/50", children: [
              /* @__PURE__ */ jsx("span", { children: "1%" }),
              /* @__PURE__ */ jsx("span", { children: "Typical: 2-3%" }),
              /* @__PURE__ */ jsx("span", { children: "10%" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(Label, { className: "text-primary-foreground/80", children: "Marketing Budget Ratio" }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-accent", children: [
                budgetRatio,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx(Slider, { value: [budgetRatio], onValueChange: (v) => setBudgetRatio(v[0]), min: 15, max: 25, step: 1, className: "w-full" }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-primary-foreground/50", children: [
              /* @__PURE__ */ jsx("span", { children: "15% (Normal)" }),
              /* @__PURE__ */ jsx("span", { children: "25% (Competitive)" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2 text-primary-foreground/60", children: [
              /* @__PURE__ */ jsx(Target, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Conversions Needed" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-display text-3xl font-bold text-primary-foreground", children: results.conversionsNeeded.toLocaleString() }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-primary-foreground/50", children: "Sales/orders per month" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2 text-primary-foreground/60", children: [
              /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Leads Needed" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "font-display text-3xl font-bold text-primary-foreground", children: results.leadsNeeded.toLocaleString() }),
            /* @__PURE__ */ jsx("div", { className: "mt-1 text-xs text-primary-foreground/50", children: "Enquiries per month" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl accent-gradient p-6 shadow-glow md:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center gap-2 text-accent-foreground/80", children: [
            /* @__PURE__ */ jsx(DollarSign, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
              "Marketing Budget (",
              budgetRatio,
              "% of revenue)"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mb-2 font-display text-4xl font-bold text-accent-foreground md:text-5xl", children: formatCurrency(results.marketingBudget) }),
          /* @__PURE__ */ jsxs("div", { className: "text-accent-foreground/70", children: [
            "Estimated CPL: ",
            formatCurrency(results.estimatedCPL),
            " per lead"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5", children: [
          /* @__PURE__ */ jsx("h4", { className: "mb-3 font-semibold text-primary-foreground", children: "How it's calculated:" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-primary-foreground/70", children: [
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-primary-foreground", children: "Conversions:" }),
              " ",
              formatCurrency(targetRevenue),
              " ÷ ",
              formatCurrency(averageOrderValue),
              " = ",
              results.conversionsNeeded
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-primary-foreground", children: "Leads:" }),
              " ",
              results.conversionsNeeded,
              " ÷ ",
              conversionRate,
              "% = ",
              results.leadsNeeded
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-primary-foreground", children: "Budget:" }),
              " ",
              formatCurrency(targetRevenue),
              " × ",
              budgetRatio,
              "% = ",
              formatCurrency(results.marketingBudget)
            ] }),
            /* @__PURE__ */ jsxs("p", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-primary-foreground", children: "Estimated CPL:" }),
              " ",
              formatCurrency(results.marketingBudget),
              " ÷ ",
              results.leadsNeeded,
              " = ",
              formatCurrency(results.estimatedCPL)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "xl", className: "w-full", children: [
          "Get Your Custom Proposal",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) })
      ] })
    ] }) })
  ] }) });
};
const faqs = [
  {
    question: "What's included in the management fee?",
    answer: "Our management fee covers strategy & positioning, campaign setup, creatives, tracking setup, ongoing optimisation, and monthly reporting. For Google Ads + SEO, this also includes website/landing page creation. Ad budgets are paid separately directly to platforms."
  },
  {
    question: "How long does it take to see results?",
    answer: "Paid ads (Google & Social) typically show initial results within 2-4 weeks. SEO is a longer-term play: expect early movements in Month 2-3, stronger rankings by Month 4-6, and compounding growth from Month 6-12. Results vary based on competition and industry."
  },
  {
    question: "What's the typical conversion rate?",
    answer: "Industry benchmark for website conversion is typically 2-3%. We use 2.5% for conservative planning. Your actual rate depends on factors like offer strength, landing page quality, and lead quality. We continuously optimise to improve this."
  },
  {
    question: "Why annual contracts with monthly payments?",
    answer: "Marketing requires time to optimise and compound. Annual commitments allow us to build proper foundations, test strategies, and scale what works. Monthly instalments make it budget-friendly while ensuring long-term partnership for best results."
  },
  {
    question: "How much ad budget should I allocate?",
    answer: "We recommend at least RM 2,000/month per platform for meaningful results. Use our budget calculator to estimate based on your revenue goals. Marketing budget is typically 15% of revenue for normal industries, 25% for highly competitive ones."
  },
  {
    question: "What KPIs do you track and report?",
    answer: "Primary KPIs are leads (calls/WhatsApp/forms) or e-commerce sales. Secondary metrics include Cost Per Lead (CPL), Cost Per Acquisition (CPA), conversion rate, lead quality, and ROAS for e-commerce. You'll receive monthly reports with clear insights."
  },
  {
    question: "Can I add more social media platforms later?",
    answer: "Yes! Each additional social platform is +RM 300/month management fee, plus we recommend RM 2,000/month ad budget per platform. We can expand your campaigns as your business grows."
  },
  {
    question: "What access do you need from me?",
    answer: "We'll need Google Ads/GA4/Tag Manager access (or we create fresh accounts), website CMS access, Google Business Profile, and relevant social media ad account access. We'll also collect brand assets, product info, and testimonials during onboarding."
  }
];
const FAQ = () => {
  return /* @__PURE__ */ jsx("section", { id: "faq", className: "bg-secondary/30 py-24", children: /* @__PURE__ */ jsxs("div", { className: "container px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto mb-12 max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2", children: [
        /* @__PURE__ */ jsx(HelpCircle, { className: "h-4 w-4 text-accent" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-accent", children: "FAQ" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "mb-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl", children: "Frequently Asked Questions" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "Everything you need to know about working with us." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-3xl", children: /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "space-y-4", children: faqs.map((faq, index) => /* @__PURE__ */ jsxs(
      AccordionItem,
      {
        value: `item-${index}`,
        className: "overflow-hidden rounded-xl border border-border bg-card px-6 shadow-soft",
        children: [
          /* @__PURE__ */ jsx(AccordionTrigger, { className: "py-5 text-left font-display font-semibold text-foreground hover:no-underline [&[data-state=open]>svg]:text-accent", children: faq.question }),
          /* @__PURE__ */ jsx(AccordionContent, { className: "pb-5 text-muted-foreground", children: faq.answer })
        ]
      },
      index
    )) }) })
  ] }) });
};
const CTA = () => {
  return /* @__PURE__ */ jsx("section", { className: "bg-background py-24", children: /* @__PURE__ */ jsx("div", { className: "container px-4", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-3xl bg-primary p-8 md:p-16", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" }),
    /* @__PURE__ */ jsx("div", { className: "absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 mx-auto max-w-3xl text-center", children: [
      /* @__PURE__ */ jsxs("h2", { className: "mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl", children: [
        "Ready to Drive ",
        /* @__PURE__ */ jsx(Cover, { children: "Measurable Growth" }),
        "?"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-primary-foreground/70 md:text-xl", children: "Let's discuss your business goals and create a tailored digital marketing strategy that delivers results." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4 sm:flex-row", children: [
        /* @__PURE__ */ jsx(Cover, { variant: "button", children: /* @__PURE__ */ jsxs(Button, { variant: "hero", size: "xl", children: [
          "Get Your Proposal",
          /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 h-5 w-5" })
        ] }) }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "hero-outline",
            size: "xl",
            className: "border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10",
            children: [
              /* @__PURE__ */ jsx(MessageCircle, { className: "mr-2 h-5 w-5" }),
              "WhatsApp Us"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-primary-foreground/60", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "Quick Response" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block h-4 w-px bg-primary-foreground/20" }),
        /* @__PURE__ */ jsx("span", { children: "No Commitment Required" }),
        /* @__PURE__ */ jsx("div", { className: "hidden sm:block h-4 w-px bg-primary-foreground/20" }),
        /* @__PURE__ */ jsx("span", { children: "Free Consultation" })
      ] })
    ] })
  ] }) }) });
};
const GrowthHubFooter = () => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-border bg-primary py-12", children: /* @__PURE__ */ jsxs("div", { className: "container px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsxs("h3", { className: "mb-4 font-display text-2xl font-bold text-primary-foreground", children: [
          "Leadzap",
          /* @__PURE__ */ jsx("span", { className: "text-accent", children: "." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mb-4 max-w-md text-primary-foreground/60", children: "Your one-stop digital marketing solution. We focus on measurable growth through Google Ads, SEO, and Social Media paid advertising." }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 text-sm text-primary-foreground/60", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4 text-accent" }),
          /* @__PURE__ */ jsx("a", { href: "https://leadzap.com.my/", target: "_blank", rel: "noopener noreferrer", className: "hover:text-primary-foreground", children: "leadzap.com.my" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-4 font-semibold text-primary-foreground", children: "Services" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-primary-foreground/60", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#services", className: "hover:text-primary-foreground", children: "Google Ads" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#services", className: "hover:text-primary-foreground", children: "SEO Management" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#services", className: "hover:text-primary-foreground", children: "Social Media Ads" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#packages", className: "hover:text-primary-foreground", children: "Packages" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "mb-4 font-semibold text-primary-foreground", children: "Quick Links" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm text-primary-foreground/60", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#delivery", className: "hover:text-primary-foreground", children: "How We Work" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#calculator", className: "hover:text-primary-foreground", children: "Budget Calculator" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#faq", className: "hover:text-primary-foreground", children: "FAQ" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 text-sm text-primary-foreground/50 md:flex-row", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "© ",
        currentYear,
        " Leadzap Marketing. All rights reserved."
      ] }),
      /* @__PURE__ */ jsx("p", { children: "KPI Focus: Leads & E-commerce Sales" })
    ] })
  ] }) });
};
const GrowthHub = () => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(GrowthHubNavbar, {}),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Services, {}),
    /* @__PURE__ */ jsx(DeliveryModel, {}),
    /* @__PURE__ */ jsx(Packages, {}),
    /* @__PURE__ */ jsx(BudgetCalculator, {}),
    /* @__PURE__ */ jsx(FAQ, {}),
    /* @__PURE__ */ jsx(CTA, {}),
    /* @__PURE__ */ jsx(GrowthHubFooter, {})
  ] });
};
const AppRoutes = () => /* @__PURE__ */ jsxs(Routes, { children: [
  /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(Index, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/sem/", element: /* @__PURE__ */ jsx(SEM, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/social-media-ads/", element: /* @__PURE__ */ jsx(SocialMediaAds, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/custom-software/", element: /* @__PURE__ */ jsx(CustomerSoftware, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/order-management/", element: /* @__PURE__ */ jsx(OrderManagement, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/contact/", element: /* @__PURE__ */ jsx(Contact, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/corporate-profile/", element: /* @__PURE__ */ jsx(CorporateProfile, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/growth-hub/", element: /* @__PURE__ */ jsx(GrowthHub, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/blog/", element: /* @__PURE__ */ jsx(LeadzapBlog, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/blog/:id/", element: /* @__PURE__ */ jsx(BlogPost, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "/admin/", element: /* @__PURE__ */ jsx(AdminDashboard, {}) }),
  /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFound, {}) })
] });
const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Viewport,
  {
    ref,
    className: cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    ),
    ...props
  }
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    ToastPrimitives.Root,
    {
      ref,
      className: cn(toastVariants({ variant }), className),
      ...props
    }
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;
const ToastAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Action,
  {
    ref,
    className: cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    ),
    ...props
  }
));
ToastAction.displayName = ToastPrimitives.Action.displayName;
const ToastClose = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Close,
  {
    ref,
    className: cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    ),
    "toast-close": "",
    ...props,
    children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
  }
));
ToastClose.displayName = ToastPrimitives.Close.displayName;
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Title,
  {
    ref,
    className: cn("text-sm font-semibold", className),
    ...props
  }
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  ToastPrimitives.Description,
  {
    ref,
    className: cn("text-sm opacity-90", className),
    ...props
  }
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;
function Toaster$1() {
  const { toasts } = useToast();
  return /* @__PURE__ */ jsxs(ToastProvider, { children: [
    toasts.map(function({ id, title, description, action, ...props }) {
      return /* @__PURE__ */ jsxs(Toast, { ...props, children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-1", children: [
          title && /* @__PURE__ */ jsx(ToastTitle, { children: title }),
          description && /* @__PURE__ */ jsx(ToastDescription, { children: description })
        ] }),
        action,
        /* @__PURE__ */ jsx(ToastClose, {})
      ] }, id);
    }),
    /* @__PURE__ */ jsx(ToastViewport, {})
  ] });
}
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$2,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const Dithering = lazy(
  () => import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);
function SiteDitheringBackground() {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 -z-10 overflow-hidden", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-background" }), children: /* @__PURE__ */ jsx(
    Dithering,
    {
      colorBack: "#020617",
      colorFront: "#fcd200",
      shape: "warp",
      type: "4x4",
      speed: 0.25,
      className: "w-full h-full",
      minPixelRatio: 1
    }
  ) }) });
}
const queryClient = new QueryClient();
function render(url) {
  const html = renderToString(
    /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(ContentProvider, { children: [
      /* @__PURE__ */ jsx(Toaster$1, {}),
      /* @__PURE__ */ jsx(Toaster, {}),
      /* @__PURE__ */ jsx(SiteDitheringBackground, {}),
      /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx(AppRoutes, {}) }) })
    ] }) }) })
  );
  return html;
}
export {
  __ssgInitialBlogPosts as initialBlogPosts,
  render
};
