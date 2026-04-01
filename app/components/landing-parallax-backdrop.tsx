"use client";

import { useLandingMotionConfig } from "./motion/use-landing-motion-config";

export function LandingParallaxBackdrop() {
  const { prefersReducedMotion, hydrationSafeReducedMotion, tier } = useLandingMotionConfig();

  const reduced = hydrationSafeReducedMotion || prefersReducedMotion;
  const lightMode = tier === "lite";

  if (reduced) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(50,208,255,0.06),transparent_40%),radial-gradient(ellipse_at_bottom_left,rgba(159,232,112,0.04),transparent_35%)] opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(50,208,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(50,208,255,0.02)_1px,transparent_1px)] bg-[length:48px_48px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_85%_at_50%_40%,transparent_0%,rgba(4,9,15,0.5)_100%)] opacity-50" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(50,208,255,0.08),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(159,232,112,0.05),transparent_40%)] opacity-70" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(50,208,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(50,208,255,0.03)_1px,transparent_1px)] bg-[length:56px_56px] opacity-50" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(50,208,255,0.06),transparent_60%)] opacity-40" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_85%_at_50%_40%,transparent_0%,rgba(4,9,15,0.55)_100%)] opacity-55" />

      {!lightMode && (
        <>
          <div className="absolute left-1/2 top-[30%] h-[min(60vh,500px)] w-[min(100vw,900px)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle,rgba(50,208,255,0.06)_0%,transparent_65%)] blur-[60px] opacity-50" />
          <div className="absolute bottom-[10%] right-[5%] h-[40vh] w-[40vw] max-w-[500px] rounded-full bg-[radial-gradient(circle,rgba(159,232,112,0.04)_0%,transparent_70%)] blur-[80px] opacity-40" />
        </>
      )}
    </div>
  );
}