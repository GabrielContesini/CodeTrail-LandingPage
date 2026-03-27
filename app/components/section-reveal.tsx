"use client";

import { motion } from "framer-motion";
import { easeOutExpo } from "./motion/motion-presets";
import { useLandingMotionConfig } from "./motion/use-landing-motion-config";

type SectionRevealProps = {
  children: React.ReactNode;
  as?: "section" | "div";
  className?: string;
  id?: string;
  delay?: number;
};

export function SectionReveal({
  as = "section",
  children,
  className,
  id,
  delay = 0,
}: SectionRevealProps) {
  const { hydrationSafeReducedMotion: reduced } = useLandingMotionConfig();
  const Tag = as === "div" ? motion.div : motion.section;

  const variants = {
    hidden: {
      opacity: reduced ? 1 : 0,
      y: reduced ? 0 : 28,
      filter: reduced ? "blur(0px)" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduced ? 0 : 0.62,
        delay: reduced ? 0 : delay,
        ease: easeOutExpo,
      },
    },
  };

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "-48px 0px -48px 0px" }}
      variants={variants}
    >
      {children}
    </Tag>
  );
}
