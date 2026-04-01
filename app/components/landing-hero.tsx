"use client";

import { Globe, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AuthTrigger } from "./auth-trigger";
import { DepthCard } from "./depth-card";
import { heroContainer } from "./motion/motion-presets";
import { useLandingMotionConfig } from "./motion/use-landing-motion-config";
import { MotionStagger, MotionStaggerItem } from "./stagger-reveal";

export type HeroProofMetric = {
  value: string;
  label: string;
  detail: string;
};

export function LandingHero({
  proofMetrics,
  developerSignals,
}: {
  proofMetrics: HeroProofMetric[];
  developerSignals: string[];
}) {
  const { hydrationSafeReducedMotion: reduced } = useLandingMotionConfig();

  const heroItem = {
    hidden: {
      opacity: reduced ? 1 : 0,
      y: reduced ? 0 : 34,
      filter: reduced ? "blur(0px)" : "blur(12px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduced ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="top"
      className="relative flex min-h-[72vh] items-center"
    >
      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-7 sm:gap-8">
        <motion.div
          className="flex flex-col gap-7 sm:gap-8"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={heroItem}
            className="hero-kicker inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-[0_0_12px_rgba(50,208,255,0.08)]"
          >
            <Sparkles size={12} aria-hidden />
            Sistema de estudo refinado
          </motion.span>

          <motion.div variants={heroItem} className="flex flex-col gap-6">
            <h1 className="hero-title m-0 max-w-5xl text-5xl font-display font-medium tracking-tight text-white sm:text-6xl lg:text-7xl lg:leading-[1.02]">
              Seu workspace de tecnologia, focado no sistema.
            </h1>
            <p className="hero-lead m-0 max-w-3xl text-lg font-light leading-relaxed text-text-secondary sm:text-xl">
              CodeTrail centraliza trilhas, revisões, projetos e billing em um fluxo coerente. Menos ruído, menos abas,
              mais controle operacional para estudar tecnologia com consistência.
            </p>
          </motion.div>

          <motion.div variants={heroItem} className="hero-actions flex flex-wrap gap-3 sm:gap-4">
            <motion.span
              className="inline-flex"
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <AuthTrigger target="workspace" className="landing-button landing-button--primary px-7 py-4 text-sm">
                Inicializar workspace
                <ArrowRight size={16} />
              </AuthTrigger>
            </motion.span>
          </motion.div>

          <motion.div variants={heroItem} className="relative">
            <DepthCard>
              <div className="hero-surface landing-surface flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {developerSignals.map((signal, index) => (
                          <motion.div
                            key={signal}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-surface text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(0,0,0,0.24)]"
                            initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: reduced ? 0 : 0.45 + index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          >
                            {signal.slice(0, 2)}
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex flex-col">
                        <strong className="text-base font-display text-white">
                          Desenhado para desenvolvedores que precisam de sistema, não de improviso.
                        </strong>
                        <span className="text-sm leading-relaxed text-text-secondary">
                          Front-end, back-end, dados e QA em uma rotina mais disciplinada e mais clara.
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                      <span className="inline-flex items-center gap-2">
                        <Globe size={14} className="text-primary/80" />
                        Fluxo web único
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <ShieldCheck size={14} className="text-accent/80" />
                        Billing integrado
                      </span>
                    </div>
                  </div>

                  <MotionStagger className="grid gap-3 sm:grid-cols-3" viewportAmount={0.12}>
                    {proofMetrics.map((item) => (
                      <MotionStaggerItem key={item.label} className="min-w-0">
                        <div className="landing-metric-card h-full rounded-2xl border border-border/70 bg-white/[0.03] px-4 py-4 sm:px-5 sm:py-5">
                          <strong className="font-display text-2xl text-white">{item.value}</strong>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{item.label}</p>
                          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.detail}</p>
                        </div>
                      </MotionStaggerItem>
                    ))}
                  </MotionStagger>
                </div>
              </div>
            </DepthCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
