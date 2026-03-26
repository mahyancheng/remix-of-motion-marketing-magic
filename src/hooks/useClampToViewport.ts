import { useEffect, useRef } from "react";

/** ==========================================
 * 🚀 性能优化版：视口高度限制钩子
 * 主要改进：
 * 1. 引入 requestAnimationFrame (rAF) 节流，防止滚动时的布局抖动
 * 2. 增强了对移动端动态工具栏（地址栏）变化的适配
 * 3. 资源清理逻辑更严密
 * ========================================== */

export function useClampToViewport({
  cardRef,
  bodyRef,
  bottomPad = 16,
}: {
  cardRef: React.RefObject<HTMLElement>;
  bodyRef: React.RefObject<HTMLElement>;
  bottomPad?: number;
}) {
  // 使用 ref 记录当前的 rAF ID，确保可以被正确取消
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // 1. 确定滚动的根容器
    const scrollRoot = (document.querySelector("[data-demo-scroll]") as HTMLElement) || window;

    const updateHeight = () => {
      const cardEl = cardRef.current;
      const bodyEl = bodyRef.current;
      if (!cardEl || !bodyEl) return;

      // 🚨 性能核心：使用 rAF 包装 DOM 读写操作
      // 确保在浏览器下一帧绘制前统一处理，避免 Layout Thrashing
      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const rect = cardEl.getBoundingClientRect();
        
        // 获取实际可视区域高度（兼容移动端地址栏伸缩）
        const viewportH = scrollRoot instanceof Window 
          ? window.innerHeight 
          : scrollRoot.clientHeight;

        // 计算可用高度：视口总高 - 卡片顶部到视口的距离 - 底部留白
        // 设置最小值 200px，防止内容被压到完全看不见
        const available = Math.max(200, viewportH - rect.top - bottomPad);
        
        // 直接操作 style 避开 React 状态更新的高昂开销
        bodyEl.style.maxHeight = `${available}px`;
        
        // 如果高度太小，可以强制开启滚动条
        bodyEl.style.overflowY = "auto";
      });
    };

    // 2. 初始化执行
    updateHeight();

    // 3. 监听尺寸变化 (ResizeObserver)
    // 观察 documentElement 以捕捉窗口缩放，观察 cardEl 以捕捉内容布局变化
    const ro = new ResizeObserver(() => updateHeight());
    ro.observe(document.documentElement);
    if (cardRef.current) ro.observe(cardRef.current);

    // 4. 监听滚动 (Scroll Listener)
    const onScroll = () => updateHeight();
    const onResize = () => updateHeight();

    const target = scrollRoot instanceof Window ? window : scrollRoot;
    
    // 使用 passive: true 提升滚动性能
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // 5. 彻底清理
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      ro.disconnect();
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [cardRef, bodyRef, bottomPad]);
}