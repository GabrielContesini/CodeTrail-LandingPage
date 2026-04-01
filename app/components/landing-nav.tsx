"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AuthTrigger } from "./auth-trigger";
import { easeOutExpo } from "./motion/motion-presets";
import { useLandingMotionConfig } from "./motion/use-landing-motion-config";

const brandMark = "/design/CodeTrailMainIcon.png";

export function LandingNav() {
  const { hydrationSafeReducedMotion: reduced } = useLandingMotionConfig();

  return (
    <motion.nav
      className="sticky top-0 z-50 border-b border-border/50 bg-background/78 backdrop-blur-xl"
      initial={reduced ? false : { y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: easeOutExpo }}
    >
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3 text-white decoration-transparent">
          <motion.div
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 shadow-[0_0_18px_rgba(50,208,255,0.16)]"
            whileHover={reduced ? undefined : { scale: 1.03, boxShadow: "0 0 28px rgba(50,208,255,0.22)" }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.22, ease: easeOutExpo }}
          >
            <Image src={brandMark} alt="CodeTrail Logo" width={40} height={40} className="h-full w-full object-cover" />
          </motion.div>
          <div className="flex flex-col">
            <strong className="text-base font-display tracking-tight leading-none">CodeTrail</strong>
            <span className="mt-1 text-[9px] uppercase tracking-[0.22em] text-text-secondary/80">Sistema de estudo</span>
          </div>
        </a>

        <div className="hidden items-center gap-2 md:flex">
          {[
            { href: "#produto", label: "Produto" },
            { href: "#planos", label: "Planos" },
            { href: "#faq", label: "FAQ" },
          ].map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="landing-nav-link inline-flex min-h-[44px] items-center px-4 text-xs font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-white"
              whileHover={reduced ? undefined : { y: -1 }}
              transition={{ duration: 0.18 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <AuthTrigger target="workspace" className="landing-button landing-button--primary px-4 py-2 text-[11px] sm:px-5">
            Entrar no sistema
          </AuthTrigger>
        </div>
      </div>
    </motion.nav>
  );
}
