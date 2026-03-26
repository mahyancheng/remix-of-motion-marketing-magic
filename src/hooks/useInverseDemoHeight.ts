import { useEffect, useMemo, useState, useCallback } from "react";

/** ==========================================
 * 🚀 性能优化版：逆向高度计算钩子
 * 主要改进：
 * 1. 增加了 SSR 安全保护，防止 Node.js 环境下报错
 * 2. 优化了事件监听，减少不必要的重计算
 * 3. 规范了 Clamp（夹取）逻辑，确保 UI 稳定性
 * ========================================== */

export function useInverseDemoHeight() {
  // 1. 🚀 SSR 安全处理：初始值设为 0，防止 Hydration 冲突
  const [wh, setWh] = useState({ 
    w: typeof window !== "undefined" ? window.innerWidth : 0, 
    h: typeof window !== "undefined" ? window.innerHeight : 0 
  });

  const update = useCallback(() => {
    // 使用 requestAnimationFrame 确保在浏览器重绘帧更新，
    // 这比直接 setWh 更平滑，且能有效防止高频 resize 导致的卡顿
    requestAnimationFrame(() => {
      setWh({ 
        w: window.innerWidth, 
        h: window.innerHeight 
      });
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update);
    
    // 初始化执行一次
    update();

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [update]);

  // 2. 🚀 锁定计算逻辑
  const heightPx = useMemo(() => {
    const { w, h } = wh;
    
    // 默认兜底高度（针对 SSR 或 初始加载）
    if (!w || !h) return 600;

    /**
     * 逆向比例算法说明：
     * 屏幕宽度(w)越大 -> pct 越小 -> Demo 占比越小
     * 屏幕宽度(w)越小 -> pct 越大 -> Demo 占比越大
     */
    
    // pct = 1.02 - w/2600
    // 修正：限制比例区间在 [0.55, 0.92] 之间，防止超宽屏时 Demo 缩得太小
    const pct = Math.max(0.55, Math.min(0.92, 1.02 - w / 2600));
    const px = h * pct;

    // 最终像素夹取：
    // 手机端保证至少 480px (方便展示 Demo 内容)
    // 桌面端最大限制在 960px (防止由于屏幕过高导致内容溢出)
    return Math.max(480, Math.min(px, 960));
  }, [wh]);

  return heightPx;
}