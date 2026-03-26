"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/** =======================
 * 🚀 性能优化：将静态配置移出组件
 * 杜绝重渲染时的对象重复创建
 * ======================= */
const BG_COLORS = ["rgb(0 0 0)", "rgb(15 15 15)", "rgb(23 23 23)"];

const MODAL_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    y: 10, 
    transition: { duration: 0.2, ease: "easeIn" } 
  },
};

interface StickyScrollProps {
  content: { title: string; description: string; content?: React.ReactNode }[];
  contentClassName?: string;
}

export const StickyScroll = ({
  content,
  contentClassName,
}: StickyScrollProps) => {
  const [activeCard, setActiveCard] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // 1. 🚀 修复布局跳动：处理滚动条锁定
  useEffect(() => {
    if (expanded) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = "hidden";
      // 补足滚动条消失后的宽度，防止页面闪烁
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = "0px";
      };
    }
  }, [expanded]);

  // 2. 🚀 锁定函数引用
  const go = useCallback((i: number) => {
    setActiveCard((prev) => {
      if (i < 0 || i >= content.length) return prev;
      return i;
    });
  }, [content.length]);

  const toggleExpanded = useCallback((val: boolean) => {
    setExpanded(val);
  }, []);

  // 计算当前背景色
  const activeBg = useMemo(() => 
    BG_COLORS[activeCard % BG_COLORS.length], 
    [activeCard]
  );

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <React.Fragment key="modal-container">
            {/* 背景遮罩 */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleExpanded(false)}
            />
            
            {/* 弹出面板 */}
            <motion.div
              className={cn(
                "fixed z-[70] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                "w-[min(92vw,1100px)] h-[min(88vh,820px)] rounded-2xl border border-white/10",
                "bg-neutral-900/95 shadow-2xl overflow-hidden"
              )}
              variants={MODAL_VARIANTS}
              initial="hidden"
              animate="show"
              exit="exit"
              role="dialog"
              aria-modal="true"
            >
              {/* 顶部标签选择 */}
              <div className="absolute left-6 top-6 z-10 flex gap-2">
                {content.map((c, i) => (
                  <button
                    key={`modal-btn-${i}`}
                    onClick={(e) => { e.stopPropagation(); go(i); }}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
                      i === activeCard
                        ? "bg-yellow-400 text-black shadow-lg"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    )}
                  >
                    {c.title}
                  </button>
                ))}
              </div>

              {/* 弹窗内容 */}
              <div className="h-full w-full overflow-y-auto p-6 pt-20 no-scrollbar">
                <motion.div
                  key={`expanded-content-${activeCard}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {content[activeCard]?.content}
                </motion.div>
              </div>

              {/* 关闭按钮 */}
              <button
                onClick={() => toggleExpanded(false)}
                className="absolute right-6 top-6 rounded-full bg-white/10 hover:bg-white/20 transition p-2.5"
              >
                <CloseIcon />
              </button>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ backgroundColor: activeBg }}
        transition={{ duration: 0.4 }}
        className="relative h-screen flex justify-center gap-8 lg:gap-12 p-4 lg:p-12 w-full mx-auto"
      >
        {/* 左侧进度点 */}
        <aside className="hidden lg:flex flex-col justify-center gap-4">
          {content.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => go(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-all duration-300",
                i === activeCard 
                  ? "bg-yellow-400 scale-150 ring-4 ring-yellow-400/20" 
                  : "bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </aside>

        {/* 右侧主面板 */}
        <div
          className={cn(
            "hidden lg:block relative flex-1 max-w-5xl h-full rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md overflow-hidden shadow-2xl group cursor-zoom-in",
            contentClassName
          )}
          onClick={() => toggleExpanded(true)}
        >
          {/* 切换 Tab */}
          <div className="absolute left-8 top-8 z-10 flex gap-2" onClick={(e) => e.stopPropagation()}>
            {content.map((c, i) => (
              <button
                key={`tab-${i}`}
                onClick={() => go(i)}
                className={cn(
                  "rounded-full px-5 py-2 text-xs font-black tracking-widest transition-all",
                  i === activeCard
                    ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                )}
              >
                {c.title.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="h-full w-full p-8 pt-28 overflow-hidden">
             <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeCard}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full"
                >
                  {content[activeCard]?.content}
                </motion.div>
             </AnimatePresence>
          </div>
          
          {/* 全屏提示 */}
          <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
              Click to Expand View
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/80" stroke="currentColor" strokeWidth={2.5} fill="none">
    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
  </svg>
);