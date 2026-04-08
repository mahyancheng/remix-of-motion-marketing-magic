"use client";
import { Suspense, lazy, useEffect, useState } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

export function SiteDitheringBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 🚀 优化：检查屏幕宽度，小于 768px (手机端) 则不渲染 WebGL
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // 初始检查
    
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      {/* 如果是移动端，仅显示 bg-[#020617] 的纯色背景，省电又流畅 */}
      {!isMobile && (
        <Suspense fallback={<div className="absolute inset-0 bg-[#020617]" />}>
          <Dithering
            colorBack="#020617"
            colorFront="#fcd200"
            shape="warp"
            type="4x4"
            speed={0.25}
            // 加了 opacity-50 让它更像一个背景，不会太刺眼
            className="w-full h-full opacity-50" 
            minPixelRatio={1}
          />
        </Suspense>
      )}
    </div>
  );
}