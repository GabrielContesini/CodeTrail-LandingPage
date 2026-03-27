"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef } from "react";
import { useLandingMotionConfig } from "./motion/use-landing-motion-config";

export function DepthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { tiltStrength, prefersReducedMotion, hydrationSafeReducedMotion } = useLandingMotionConfig();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 280, damping: 28 });
  const springY = useSpring(py, { stiffness: 280, damping: 28 });
  const maxTilt = tiltStrength * 0.5;
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const onMove = useCallback(
    (event: React.PointerEvent) => {
      if (!ref.current || prefersReducedMotion || tiltStrength === 0) {
        return;
      }
      const r = ref.current.getBoundingClientRect();
      px.set((event.clientX - r.left) / r.width - 0.5);
      py.set((event.clientY - r.top) / r.height - 0.5);
    },
    [px, py, prefersReducedMotion, tiltStrength],
  );

  const onLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  return (
    <div className={`h-full min-h-0 [perspective:1200px] ${className ?? ""}`}>
      <motion.div
        ref={ref}
        className="h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        whileHover={
          hydrationSafeReducedMotion || tiltStrength === 0
            ? undefined
            : {
                y: -4,
                transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
