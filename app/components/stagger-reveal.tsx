"use client";

import { motion } from "framer-motion";
import { easeOutExpo } from "./motion/motion-presets";
import { useLandingMotionConfig } from "./motion/use-landing-motion-config";

export function MotionStagger({
  children,
  className,
  viewportAmount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  viewportAmount?: number;
}) {
  const { hydrationSafeReducedMotion: reduced } = useLandingMotionConfig();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount, margin: "-32px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : 0.085,
            delayChildren: reduced ? 0 : 0.06,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { hydrationSafeReducedMotion: reduced } = useLandingMotionConfig();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: reduced ? 1 : 0,
          y: reduced ? 0 : 22,
          filter: reduced ? "blur(0px)" : "blur(7px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: reduced ? 0 : 0.52, ease: easeOutExpo },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
