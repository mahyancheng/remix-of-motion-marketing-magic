"use client";
import { Suspense, lazy, useEffect, useState } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

export function SiteDitheringBackground() {
  const [isMobile, setIsMobile] = useState(false);
  // 🚀 新增状态：控制 WebGL 是否可以开始渲染
  const [shouldRenderWebGL, setShouldRenderWebGL] = useState(false);

  useEffect(() => {
    // 媒体查询逻辑保持不变...
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    // 🚀 核心优化：延迟渲染 WebGL
    // 让主线程先去渲染文字、图片等核心 DOM。
    // 等待 500ms（或者你可以按需调整）后，再开始编译耗时的 WebGL 着色器
    const timer = setTimeout(() => {
      setShouldRenderWebGL(true);
    }, 500);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      {/* 只有在非移动端，且允许渲染后，才加载 WebGL */}
      {!isMobile && shouldRenderWebGL && (
        <Suspense fallback={<div className="absolute inset-0 bg-[#020617]" />}>
          <Dithering
            colorBack="#020617"
            colorFront="#fcd200"
            shape="warp"
            type="4x4"
            speed={0.25}
            className="w-full h-full opacity-50 transition-opacity duration-1000" // 可以加个淡入效果避免突兀
            minPixelRatio={1}
          />
        </Suspense>
      )}
    </div>
  );
}