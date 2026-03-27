import type { Variants } from "framer-motion";

/** Easing premium: saída suave, sensação “cinemática”. */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
};
