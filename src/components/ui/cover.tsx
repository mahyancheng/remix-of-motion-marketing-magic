"use client";
import React, { useEffect, useId, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SparklesCore } from "@/components/ui/sparkles";

export const Cover = ({
  children,
  className,
  variant = "text",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: "text" | "button";
}) => {
  const [hovered, setHovered] = useState(false);
  const isActive = variant === "button" || hovered;
  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState<number[]>([]);

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

  const isButton = variant === "button";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => !isButton && setHovered(false)}
      ref={ref}
      className={cn(
        "relative group/cover inline-block transition duration-200",
        isButton
          ? "bg-transparent hover:bg-transparent p-0 rounded-lg w-full"
          : "bg-muted hover:bg-secondary px-2 py-2 rounded-sm",
        className
      )}
    >
      {/* Button variant: glowing animated border */}
      {isButton && (
        <>
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 8px 1px hsl(var(--accent) / 0.4), inset 0 0 8px 1px hsl(var(--accent) / 0.1)",
                "0 0 16px 2px hsl(var(--accent) / 0.6), inset 0 0 12px 2px hsl(var(--accent) / 0.15)",
                "0 0 8px 1px hsl(var(--accent) / 0.4), inset 0 0 8px 1px hsl(var(--accent) / 0.1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              border: "1.5px solid hsl(var(--accent) / 0.6)",
            }}
          />
          <CircleIcon className="absolute -right-[2px] -top-[2px]" />
          <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
          <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
          <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
        </>
      )}

      {/* Sparkle background */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.2 } }}
            className={cn(
              "h-full w-full overflow-hidden absolute inset-0",
              isButton && "rounded-lg opacity-70"
            )}
          >
            <motion.div
              animate={{ translateX: ["-50%", "0%"] }}
              transition={{ translateX: { duration: 10, ease: "linear", repeat: Infinity } }}
              className="w-[200%] h-full flex"
            >
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="w-full h-full"
                particleColor={isButton ? "hsl(var(--accent))" : "#FBBF24"}
              />
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="w-full h-full"
                particleColor={isButton ? "hsl(var(--accent))" : "#FBBF24"}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated beams */}
      {beamPositions.map((position, index) => (
        <Beam
          key={index}
          hovered={hovered}
          duration={Math.random() * 2 + 1}
          delay={Math.random() * 2 + 1}
          width={containerWidth}
          className={cn("pointer-events-none", isButton && "opacity-70")}
          style={{ top: `${position}px` }}
        />
      ))}

      {/* Content */}
      {isButton ? (
        <motion.div
          animate={{
            scale: hovered ? 0.97 : 1,
            x: hovered ? [0, -1.5, 1.5, -1.5, 1.5, 0] : 0,
            y: hovered ? [0, 1.5, -1.5, 1.5, -1.5, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            x: { duration: 0.35, repeat: Infinity, repeatType: "loop" },
            y: { duration: 0.35, repeat: Infinity, repeatType: "loop" },
            scale: { duration: 0.2 },
          }}
          className="relative z-20 [&>button]:bg-transparent [&>button]:border-0 [&>button]:shadow-none [&>button:hover]:bg-transparent [&>button:focus]:bg-transparent [&>a>button]:bg-transparent [&>a>button]:border-0 [&>a>button]:shadow-none [&>a>button:hover]:bg-transparent [&>a>button:focus]:bg-transparent"
        >
          {children}
        </motion.div>
      ) : (
        <motion.span
          key={String(hovered)}
          animate={{
            scale: hovered ? 0.8 : 1,
            x: hovered ? [0, -30, 30, -30, 30, 0] : 0,
            y: hovered ? [0, 30, -30, 30, -30, 0] : 0,
          }}
          exit={{ filter: "none", scale: 1, x: 0, y: 0 }}
          transition={{
            duration: 0.2,
            x: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
            y: { duration: 0.2, repeat: Infinity, repeatType: "loop" },
            scale: { duration: 0.2 },
            filter: { duration: 0.2 },
          }}
          className="dark:text-white inline-block text-foreground relative z-20 group-hover/cover:text-accent transition duration-200"
        >
          {children}
        </motion.span>
      )}

      {/* Corner icons for text variant */}
      {!isButton && (
        <>
          <CircleIcon className="absolute -right-[2px] -top-[2px]" />
          <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
          <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.8} />
          <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={1.6} />
        </>
      )}
    </div>
  );
};

export const Beam = ({
  className,
  delay,
  duration,
  hovered,
  width = 600,
  ...svgProps
}: {
  className?: string;
  delay?: number;
  duration?: number;
  hovered?: boolean;
  width?: number;
} & React.ComponentProps<typeof motion.svg>) => {
  const id = useId();

  return (
    <motion.svg
      width={width ?? "600"}
      height="1"
      viewBox={`0 0 ${width ?? "600"} 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute inset-x-0 w-full", className)}
      {...svgProps}
    >
      <motion.path
        d={`M0 0.5H${width ?? "600"}`}
        stroke={`url(#svgGradient-${id})`}
      />
      <defs>
        <motion.linearGradient
          id={`svgGradient-${id}`}
          key={String(hovered)}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: hovered ? "-10%" : "-5%", y1: 0, y2: 0 }}
          animate={{ x1: hovered ? "110%" : "105%", x2: "100%", y1: 0, y2: 0 }}
          transition={{ duration: hovered ? 0.5 : (duration ?? 2), ease: "linear", repeat: Infinity, delay: hovered ? Math.random() * (1) : (delay ?? 1), repeatDelay: hovered ? Math.random() * 2 : (delay ?? 1) }}
        >
          <stop stopColor="#FBBF24" stopOpacity="0" />
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

export const CircleIcon = ({
  className,
  delay,
}: {
  className?: string;
  delay?: number;
}) => {
  return (
    <div
      className={cn(
        `pointer-events-none animate-pulse group-hover/cover:hidden`,
        className
      )}
      style={{ animationDelay: `${delay || 0}s` }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="3"
        height="3"
        viewBox="0 0 3 3"
        fill="none"
      >
        <circle cx="1" cy="1" r="1" className="fill-accent" />
      </svg>
    </div>
  );
};
