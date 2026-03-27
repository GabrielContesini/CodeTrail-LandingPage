"use client";

import { useEffect } from "react";
import { useLandingMotionConfig } from "./motion/use-landing-motion-config";

/**
 * Sincroniza sinais globais para CSS (reduced motion / tier) e não renderiza UI.
 */
export function LandingMotion() {
  const { prefersReducedMotion, tier } = useLandingMotionConfig();

  useEffect(() => {
    document.documentElement.toggleAttribute("data-reduced-motion", prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    document.documentElement.setAttribute("data-motion-tier", tier);
  }, [tier]);

  return null;
}
