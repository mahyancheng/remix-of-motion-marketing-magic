import { Suspense, lazy, useEffect, useState } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

export function SiteDitheringBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 检查屏幕宽度，小于 768px 认为是移动端
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // 初始检查
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      {/* 如果是移动端，就不渲染 Shader，直接用父级的深色背景 */}
      {!isMobile && (
        <Suspense fallback={<div className="absolute inset-0 bg-[#020617]" />}>
          <Dithering
            colorBack="#020617"
            colorFront="#fcd200" 
            shape="warp"
            type="4x4"
            speed={0.25}
            className="w-full h-full opacity-50" // 建议加点透明度，别抢了主要内容的戏
            minPixelRatio={1}
          />
        </Suspense>
      )}
    </div>
  );
}