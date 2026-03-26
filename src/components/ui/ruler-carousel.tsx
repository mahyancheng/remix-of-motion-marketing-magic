"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

/** =======================
 * 类型定义
 * ======================= */
export interface CarouselItem {
  id: number;
  title: string;
}

const createInfiniteItems = (originalItems: CarouselItem[]) => {
  const items: Array<CarouselItem & { id: string; originalIndex: number }> = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 100,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = isCenter ? "h-8" : isFifth ? "h-4" : "h-3";
    let color = isCenter ? "bg-primary" : isFifth ? "bg-primary/60" : "bg-border";

    const positionClass = top ? "top-0" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-px ${height} ${color} ${positionClass} transition-colors`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-8 px-4 overflow-hidden">{lines}</div>;
};

/** =======================
 * 主组件
 * ======================= */
export function RulerCarousel({
  originalItems,
  onSelect,
  activeId,
}: RulerCarouselProps) {
  const itemsPerSet = originalItems.length;

  // 使用 useMemo 缓存无限项数组，提升性能
  const infiniteItems = useMemo(() => {
    const items: Array<CarouselItem & { uniqueId: string; originalIndex: number }> = [];
    for (let i = 0; i < 3; i++) {
      originalItems.forEach((item, index) => {
        items.push({
          ...item,
          uniqueId: `${i}-${item.id}`,
          originalIndex: index,
        });
      });
    }
    return items;
  }, [originalItems]);

  // activeIndex 是在 3 倍长数组中的索引，初始设为中间组的第一个
  const [activeIndex, setActiveIndex] = useState(itemsPerSet);
  const [isResetting, setIsResetting] = useState(false);

  // 🚨 核心修复：同步外部传入的 activeId 到内部索引
  useEffect(() => {
    if (activeId !== undefined) {
      const targetIndex = originalItems.findIndex((item) => item.id === activeId);
      if (targetIndex !== -1) {
        // 将索引映射到中间组 (Index + itemsPerSet)
        setActiveIndex(targetIndex + itemsPerSet);
      }
    }
  }, [activeId, itemsPerSet, originalItems]);

  // 处理点击跳转
  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;
    setActiveIndex(newIndex);
    if (onSelect) {
      onSelect(originalItems[newIndex % itemsPerSet]);
    }
  };

  const handlePrevious = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  // 循环逻辑：当滑动到最左或最右组时，无缝重置回中间组
  useEffect(() => {
    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      const timer = setTimeout(() => {
        setActiveIndex(activeIndex + itemsPerSet);
        setIsResetting(false);
      }, 0);
      return () => clearTimeout(timer);
    } else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      const timer = setTimeout(() => {
        setActiveIndex(activeIndex - itemsPerSet);
        setIsResetting(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, itemsPerSet]);

  // 计算偏移位置（假设每个 Item 宽度 + Gap = 240px，居中偏移）
  // 这里的 400 是根据你的 CSS 逻辑微调的基准值
  const targetX = -400 + (4 - (activeIndex % itemsPerSet)) * 400;

  return (
    <div className="w-full flex flex-col items-center justify-center py-4">
      <div className="w-full flex flex-col justify-center relative">
        <RulerLines top />

        <div className="flex items-center justify-center w-full h-20 relative overflow-hidden mask-fade-edges">
          <motion.div
            className="flex items-center gap-[80px]"
            animate={{ x: targetX }}
            transition={
              isResetting
                ? { duration: 0 }
                : { type: "spring", stiffness: 200, damping: 25, mass: 1 }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={item.uniqueId}
                  onClick={() => handleItemClick(index)}
                  className={`text-base md:text-xl font-display font-bold tracking-widest whitespace-nowrap cursor-pointer flex items-center justify-center transition-colors ${
                    isActive ? "text-accent" : "text-muted-foreground/40 hover:text-foreground"
                  }`}
                  animate={{
                    scale: isActive ? 1.2 : 0.8,
                    opacity: isActive ? 1 : 0.3,
                  }}
                  style={{ width: "160px" }}
                >
                  {item.title.toUpperCase()}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <RulerLines top={false} />
      </div>

      {/* 控制器 */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={handlePrevious}
          disabled={isResetting}
          className="p-2 rounded-full hover:bg-accent/10 text-primary transition-colors disabled:opacity-20"
        >
          <Rewind className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs font-mono text-muted-foreground tracking-tighter">
            SECTION {(activeIndex % itemsPerSet) + 1} OF {itemsPerSet}
          </span>
          <div className="flex gap-1 mt-1">
            {originalItems.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 transition-all duration-300 rounded-full ${
                  (activeIndex % itemsPerSet) === i ? "w-4 bg-accent" : "w-1 bg-border"
                }`} 
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={isResetting}
          className="p-2 rounded-full hover:bg-accent/10 text-primary transition-colors disabled:opacity-20"
        >
          <FastForward className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}