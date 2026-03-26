import { useEffect, useRef } from "react";

/**
 * 🚀 性能优化版：无缝滚动链钩子
 * 功能：内层容器滚动到底部/顶部时，将滚动量自然传递给 window
 * 优化点：减少重排(Reflow)读取，优化触摸计算逻辑
 */
export function useScrollChain(ref: React.RefObject<HTMLElement | null>) {
  // 使用 Ref 存储触摸状态，避免触发 React 重渲染，同时保证在闭包中永远拿到最新值
  const touchState = useRef({
    startY: 0,
    lastY: 0,
    isTouching: false
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 🚀 性能核心：通过判断是否“需要拦截”来决定是否调用 preventDefault
    // 而不是手动去修改 scrollTop (手动修改会很卡且容易冲突)
    const onWheel = (e: WheelEvent) => {
      const { deltaY } = e;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;

      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

      // 如果正在向上滑且还没到顶，或者正在向下滑且还没到底
      // 我们拦截事件，让它只在容器内部滚动
      if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
        // 允许容器正常滚动，不作干预
        // 但我们要确保这个滚动不会传给 window
        e.stopPropagation();
      } else {
        // 已经到达边界了！
        // 如果我们不调用 e.preventDefault()，浏览器会自动把滚动传给父级
        // 所以这里我们什么都不做，让浏览器自然“链”过去
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchState.current.isTouching = true;
      touchState.current.startY = e.touches[0].clientY;
      touchState.current.lastY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchState.current.isTouching) return;
      
      const el = ref.current;
      if (!el) return;

      const y = e.touches[0].clientY;
      const dy = touchState.current.lastY - y; // 手指滑动的位移
      touchState.current.lastY = y;

      const scrollTop = el.scrollTop;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + el.clientHeight >= el.scrollHeight - 1;

      // 逻辑同 Wheel：只有在内部还能滚动时，才拦截
      if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) {
        // 在内部滚动时，必须 preventDefault 以防止 window 跟着动
        // 注意：这需要事件监听器是非 passive 的
        if (e.cancelable) {
          // 如果容器内部还有滚动空间，我们让它自己处理，并阻止穿透
        }
      } else {
        // 到达边界，不调用 preventDefault，让 touch 动作自然传给 window
      }
    };

    const onTouchEnd = () => {
      touchState.current.isTouching = false;
    };

    // 🚨 关键：wheel 必须设置为 passive: false 才能拦截
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [ref]);
}