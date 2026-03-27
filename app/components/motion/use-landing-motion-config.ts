"use client";

import { useReducedMotion } from "framer-motion";
import { useMemo, useSyncExternalStore } from "react";

export type LandingMotionTier = "full" | "reduced" | "lite";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useLandingMotionConfig() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const mounted = useHydrated();
  const tier = useMemo<LandingMotionTier>(() => {
    if (!mounted || typeof window === "undefined") {
      return "full";
    }

    const coarse =
      typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 640;
    const deviceMemory =
      typeof navigator !== "undefined"
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory
        : undefined;
    const lowMemory = typeof deviceMemory === "number" && deviceMemory > 0 && deviceMemory <= 4;

    if (prefersReducedMotion) {
      return "reduced";
    }

    if (coarse || narrow || lowMemory) {
      return "lite";
    }

    return "full";
  }, [mounted, prefersReducedMotion]);

  const enableParallax = tier === "full";
  const enableParticles = tier === "full";
  const tiltStrength = tier === "full" ? 7 : tier === "lite" ? 4 : 0;

  /**
   * No SSR, `useReducedMotion()` é `null`; no cliente pode ser `true` no 1º paint.
   * Usar este valor para markup/variants até `mounted` evita hydration mismatch.
   */
  const hydrationSafeReducedMotion = mounted ? prefersReducedMotion : false;

  return {
    mounted,
    tier,
    prefersReducedMotion,
    hydrationSafeReducedMotion,
    enableParallax,
    enableParticles,
    tiltStrength,
  };
}
