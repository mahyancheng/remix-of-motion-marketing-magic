"use client";
import React, { useId, useMemo, useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  // 1. 🚀 引擎初始化只执行一次
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // 2. 🚀 使用 useCallback 锁定加载回调
  const particlesLoaded = useCallback(async (container?: Container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: { duration: 1 },
      });
    }
  }, [controls]);

  // 3. 🚨 性能核心：使用 useMemo 锁定配置对象
  // 只有当这些外部 Props 改变时，粒子系统才会重新计算
  const memoizedOptions = useMemo(() => ({
    background: {
      color: { value: background || "transparent" },
    },
    fullScreen: { enable: false, zIndex: 1 },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: false, mode: "repulse" },
        resize: true as any,
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 200, duration: 0.4 },
      },
    },
    particles: {
      bounce: { horizontal: { value: 1 }, vertical: { value: 1 } },
      collisions: { enable: false },
      color: { value: particleColor || "#ffffff" },
      move: {
        enable: true,
        direction: "none" as const,
        outModes: { default: "out" as const },
        random: false,
        speed: { min: 0.1, max: 1 },
        straight: false,
      },
      number: {
        density: { enable: true, width: 400, height: 400 },
        value: particleDensity || 120,
      },
      opacity: {
        value: { min: 0.1, max: 1 },
        animation: {
          enable: true,
          speed: speed || 4,
          sync: false,
          startValue: "random" as const,
        },
      },
      shape: { type: "circle" },
      size: {
        value: { min: minSize || 1, max: maxSize || 3 },
      },
    },
    detectRetina: true,
  }), [background, particleColor, particleDensity, speed, minSize, maxSize]);

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={memoizedOptions}
        />
      )}
    </motion.div>
  );
};