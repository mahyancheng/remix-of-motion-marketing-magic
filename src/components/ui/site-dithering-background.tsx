import { Suspense, lazy } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

export function SiteDitheringBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
        <Dithering
          // Match Leadzap dark background + yellow accent
          colorBack="#020617"
          colorFront="#fcd200" // brand yellow
          shape="warp"
          type="4x4"
          speed={0.25}
          className="w-full h-full"
          minPixelRatio={1}
        />
      </Suspense>
    </div>
  );
}

