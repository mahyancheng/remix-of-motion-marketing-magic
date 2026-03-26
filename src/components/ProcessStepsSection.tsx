"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardSticky } from "@/components/ui/cards-stack"; 
import OrderProcessingSection from "./OrderProcessingSection";
import InventorySection from "./InventorySection";
import FulfillmentSection from "./FulfillmentSection";
import CustomerSection from "./CustomerSection";
import AnalyticsSection from "./AnalyticsSection";
import { useClampToViewport } from "@/hooks/useClampToViewport";

const PROCESS_STEPS = [
  { id: "step-1", title: "Step 1: Effortless Order Processing", stepNumber: "01", component: <OrderProcessingSection /> },
  { id: "step-2", title: "Step 2: Customer Experience",         stepNumber: "02", component: <CustomerSection /> },
  { id: "step-3", title: "Step 3: Automated Fulfillment",        stepNumber: "03", component: <FulfillmentSection /> },
  { id: "step-4", title: "Step 4: Real-Time Inventory Management", stepNumber: "04", component: <InventorySection /> },
  { id: "step-5", title: "Step 5: Analytics & Insights",         stepNumber: "05", component: <AnalyticsSection /> },
];

/** 动态计算吸附偏移量 */
function useStepOffsets() {
  const [offsets, setOffsets] = useState({ topBasePx: 16, perStepOffsetPx: 72 });

  const calc = useCallback(() => {
    const w = window.innerWidth;
    let headerH = w >= 1024 ? 64 : w >= 768 ? 60 : 56;
    let gap = w >= 1024 ? 14 : w >= 768 ? 12 : 10;
    setOffsets({ topBasePx: 16, perStepOffsetPx: headerH + gap });
  }, []);

  useEffect(() => {
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [calc]);

  return offsets;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/** * 增强型吸附 Hook
 * 优化点：增加了边界释放机制，允许用户滚出 Demo 区域
 */
function useStepSnapOnlyHere(rootRef: React.RefObject<HTMLDivElement>, totalSteps: number, stepVh = 120) {
  const animatingRef = useRef(false);
  const touchStartY = useRef<number | null>(null);

  const getMetrics = useCallback(() => {
    const el = rootRef.current;
    if (!el) return { top: 0, stepH: 0 };
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const stepH = vh * (stepVh / 100);
    return { top: rect.top + window.scrollY, stepH };
  }, [rootRef, stepVh]);

  const scrollToIndex = useCallback((idx: number) => {
    const { top, stepH } = getMetrics();
    const targetTop = Math.round(top + idx * stepH);
    
    animatingRef.current = true;
    window.scrollTo({ top: targetTop, behavior: "smooth" });

    // 监听滚动停止
    let scrollTimeout: NodeJS.Timeout;
    const checkDone = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        animatingRef.current = false;
        window.removeEventListener("scroll", checkDone);
      }, 100);
    };
    window.addEventListener("scroll", checkDone);
  }, [getMetrics]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (animatingRef.current) { e.preventDefault(); return; }

      const { top, stepH } = getMetrics();
      const relativeScroll = window.scrollY - top;
      const currentIdx = clamp(Math.round(relativeScroll / stepH), 0, totalSteps - 1);
      const dir = e.deltaY > 0 ? 1 : -1;
      const nextIdx = currentIdx + dir;

      // 🚨 核心逻辑：如果在边界继续往外滚，不拦截事件，允许用户滚出区域
      if (nextIdx < 0 || nextIdx >= totalSteps) return;

      e.preventDefault();
      scrollToIndex(nextIdx);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || animatingRef.current) return;
      const endY = e.changedTouches[0]?.clientY ?? touchStartY.current;
      const dy = endY - touchStartY.current;
      touchStartY.current = null;

      if (Math.abs(dy) < 50) return; // 灵敏度阈值

      const { top, stepH } = getMetrics();
      const currentIdx = clamp(Math.round((window.scrollY - top) / stepH), 0, totalSteps - 1);
      const dir = dy < 0 ? 1 : -1;
      const nextIdx = currentIdx + dir;

      if (nextIdx >= 0 && nextIdx < totalSteps) {
        scrollToIndex(nextIdx);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("mouseenter", () => el.focus());

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [rootRef, totalSteps, stepVh, getMetrics, scrollToIndex]);
}

/** 单个卡片渲染 */
function StepCard({
  step,
  index,
  topBasePx,
  perStepOffsetPx,
}: {
  step: typeof PROCESS_STEPS[number];
  index: number;
  topBasePx: number;
  perStepOffsetPx: number;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 假设 Hook 内部处理了 resize 监听
  useClampToViewport({ cardRef, bodyRef, bottomPad: 24 });

  return (
    <CardSticky
      index={index}
      topBasePx={topBasePx}
      perStepOffsetPx={perStepOffsetPx}
      baseZ={3000}
      zStep={20}
      className="rounded-xl border bg-white/80 shadow-2xl backdrop-blur-xl mx-auto w-[94vw] sm:w-[90vw] md:w-[86vw] lg:w-[80vw] max-w-6xl overflow-hidden"
      ref={cardRef as any}
    >
      <div className="px-6 border-b flex items-center justify-between gap-4 h-14 md:h-[60px] lg:h-16 bg-brand-50/50">
        <h3 className="text-base md:text-lg font-display font-bold text-gray-900 truncate">
          {step.title}
        </h3>
        <span className="text-xs md:text-sm font-mono font-black text-white bg-gray-900 rounded-lg px-2 py-1 shadow-inner">
          {step.stepNumber}
        </span>
      </div>

      <div ref={bodyRef} className={`flex-1 p-4 md:p-6 ${index < 4 ? "pb-32" : "pb-10"}`}>
        {step.component}
      </div>
    </CardSticky>
  );
}

/** Demo 交互容器 */
function StepSnapDemo({
  steps,
  topBasePx,
  perStepOffsetPx,
  stepVh = 120,
}: {
  steps: typeof PROCESS_STEPS;
  topBasePx: number;
  perStepOffsetPx: number;
  stepVh?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  useStepSnapOnlyHere(rootRef, steps.length, stepVh);

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      className="relative w-full outline-none select-none"
      style={{ minHeight: `${steps.length * stepVh}vh` }}
    >
      <div className="sticky top-0 h-0 w-full overflow-visible z-50 pointer-events-none">
         {/* 这里可以放一些全局进度条或背景装饰 */}
      </div>

      {steps.map((step, index) => (
        <StepCard
          key={step.id}
          step={step}
          index={index}
          topBasePx={topBasePx}
          perStepOffsetPx={perStepOffsetPx}
        />
      ))}
      
      <div className="h-[40vh]" />
    </div>
  );
}

export default function ProcessStepsSection() {
  const { topBasePx, perStepOffsetPx } = useStepOffsets();

  return (
    <section className="relative min-h-screen bg-gray-50/50">
      <div className="py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-display font-black mb-4 text-gray-900">
           How It Works
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Streamlining your order-to-delivery lifecycle in five simple, automated steps.
        </p>
      </div>

      <StepSnapDemo
        steps={PROCESS_STEPS}
        topBasePx={topBasePx}
        perStepOffsetPx={perStepOffsetPx}
        stepVh={130} // 增加一点间距感
      />

      <div className="bg-gray-900 py-32 text-white text-center">
        <h2 className="text-3xl font-bold">Ready to Scale?</h2>
        <button className="mt-6 px-8 py-3 bg-white text-black rounded-full font-bold">
          Get Started Now
        </button>
      </div>
    </section>
  );
}