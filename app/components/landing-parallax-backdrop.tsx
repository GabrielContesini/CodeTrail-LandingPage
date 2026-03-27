"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo } from "react";
import { useLandingMotionConfig } from "./motion/use-landing-motion-config";

/** Spring suave: responde ao scroll sem “borrão” exagerado */
const SPRING_SCROLL = { stiffness: 38, damping: 38, mass: 0.92 };
const SPRING_MOUSE = { stiffness: 48, damping: 32, mass: 0.78 };

/** Distância de referência do scroll (px) para mapear movimento das camadas */
const SCROLL_RANGE = 2800;

export function LandingParallaxBackdrop() {
  const {
    enableParallax,
    enableParticles,
    prefersReducedMotion,
    hydrationSafeReducedMotion,
    mounted,
    tier,
  } = useLandingMotionConfig();

  const { scrollY } = useScroll();

  const motionScale = useMemo(() => {
    if (hydrationSafeReducedMotion) {
      return 0;
    }
    if (enableParallax) {
      return 1;
    }
    if (tier === "lite") {
      return 0.38;
    }
    return 0;
  }, [hydrationSafeReducedMotion, enableParallax, tier]);

  const d = motionScale;

  const rawFar = useTransform(scrollY, [0, SCROLL_RANGE], [0, 22 * d]);
  const rawBloom = useTransform(scrollY, [0, SCROLL_RANGE], [0, -42 * d]);
  const rawMid = useTransform(scrollY, [0, SCROLL_RANGE], [0, 74 * d]);
  const rawNear = useTransform(scrollY, [0, SCROLL_RANGE], [0, -58 * d]);
  const rawGridY = useTransform(scrollY, [0, SCROLL_RANGE], [0, 62 * d]);
  const rawGridX = useTransform(scrollY, [0, SCROLL_RANGE], [0, -16 * d]);
  const rawFine = useTransform(scrollY, [0, SCROLL_RANGE], [0, 38 * d]);
  const rawAccent = useTransform(scrollY, [0, SCROLL_RANGE], [0, -28 * d]);
  const rawOrbit = useTransform(scrollY, [0, SCROLL_RANGE], [0, 24 * d]);

  const layerFar = useSpring(rawFar, SPRING_SCROLL);
  const layerBloom = useSpring(rawBloom, SPRING_SCROLL);
  const layerMid = useSpring(rawMid, SPRING_SCROLL);
  const layerNear = useSpring(rawNear, SPRING_SCROLL);
  const layerGridY = useSpring(rawGridY, { ...SPRING_SCROLL, stiffness: 32 });
  const layerGridX = useSpring(rawGridX, { ...SPRING_SCROLL, stiffness: 34 });
  const layerFine = useSpring(rawFine, SPRING_SCROLL);
  const layerAccent = useSpring(rawAccent, SPRING_SCROLL);
  const layerOrbit = useSpring(rawOrbit, SPRING_SCROLL);

  const gridTilt = (enableParallax ? -2.2 : tier === "lite" ? -0.85 : 0) * d;
  const gridRot = useTransform(scrollY, [0, SCROLL_RANGE], [0, gridTilt]);
  const gridRotSpring = useSpring(gridRot, { ...SPRING_SCROLL, stiffness: 28, damping: 40 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smoothMx = useSpring(mx, SPRING_MOUSE);
  const smoothMy = useSpring(my, SPRING_MOUSE);

  const mouseGain = enableParallax ? 1 : tier === "lite" ? 0.42 : 0;

  useEffect(() => {
    if (!mounted || !mouseGain || prefersReducedMotion) {
      mx.set(0);
      my.set(0);
      return;
    }

    let raf = 0;
    const handle = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const nx = (event.clientX / window.innerWidth - 0.5) * 48 * mouseGain;
        const ny = (event.clientY / window.innerHeight - 0.5) * 34 * mouseGain;
        mx.set(nx);
        my.set(ny);
      });
    };

    window.addEventListener("pointermove", handle, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", handle);
    };
  }, [enableParallax, tier, prefersReducedMotion, mounted, mouseGain, mx, my]);

  const rawScrollBoostY = useTransform(scrollY, [0, 2200], [0, prefersReducedMotion ? 0 : 20 * d]);
  const scrollBoostY = useSpring(rawScrollBoostY, { stiffness: 24, damping: 42 });

  const spotX = useMotionTemplate`calc(50% + ${smoothMx}px)`;
  const spotY = useMotionTemplate`calc(34% + ${smoothMy}px + ${scrollBoostY}px)`;
  const spotlightPrimary = useMotionTemplate`radial-gradient(820px circle at ${spotX} ${spotY}, rgba(50,208,255,0.1), transparent 54%)`;
  const spotlightAccent = useMotionTemplate`radial-gradient(520px circle at calc(72% + ${smoothMx}px * 0.4) calc(68% + ${smoothMy}px * 0.35), rgba(159,232,112,0.055), transparent 50%)`;

  const particleLayer =
    mounted && enableParticles && !prefersReducedMotion ? (
      <div className="absolute inset-0">
        {PARTICLE_POSITIONS.map((p, i) => (
          <span
            key={`${p.left}-${p.top}`}
            className="landing-backdrop-particle absolute h-1 w-1 rounded-full bg-primary/30 shadow-[0_0_12px_rgba(50,208,255,0.25)]"
            style={{
              left: p.left,
              top: p.top,
              animationDuration: `${10 + (i % 5)}s`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>
    ) : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Camada 1 — fundo profundo (move pouco) */}
      <motion.div className="absolute -inset-[20%] opacity-[0.48]" style={{ y: layerFar }}>
        <div className="absolute left-1/2 top-[-22%] h-[min(92vh,760px)] w-[min(125vw,1320px)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle,rgba(6,14,22,0.85)_0%,transparent_58%)] blur-[40px]" />
      </motion.div>

      {/* Camada 2 — bloom cyan superior */}
      <motion.div className="absolute -inset-[18%] opacity-[0.55]" style={{ y: layerMid }}>
        <div className="absolute left-1/2 top-[-18%] h-[min(88vh,740px)] w-[min(120vw,1280px)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle,rgba(50,208,255,0.13)_0%,transparent_68%)] blur-[96px]" />
      </motion.div>

      {/* Camada 3 — bloom verde invertido (contramovimento) */}
      <motion.div className="absolute -inset-[16%] opacity-[0.44]" style={{ y: layerBloom }}>
        <div className="absolute bottom-[-12%] left-[-10%] h-[58vh] w-[58vw] max-w-[720px] rounded-full bg-[radial-gradient(circle,rgba(159,232,112,0.075)_0%,transparent_70%)] blur-[104px]" />
      </motion.div>

      {/* Camada 4 — orbe lateral direita */}
      <motion.div className="absolute -inset-[12%] opacity-[0.38]" style={{ y: layerNear }}>
        <div className="absolute right-[-8%] top-[22%] h-[44vh] w-[44vw] max-w-[560px] rounded-full bg-[radial-gradient(circle,rgba(50,208,255,0.07)_0%,transparent_72%)] blur-[112px]" />
      </motion.div>

      {/* Camada 5 — halo inferior central */}
      <motion.div className="absolute -inset-[8%] opacity-[0.32]" style={{ y: layerFine }}>
        <div className="absolute bottom-[-6%] left-1/2 h-[min(50vh,480px)] w-[min(90vw,880px)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(50,208,255,0.06),transparent_65%)] blur-[88px]" />
      </motion.div>

      {/* Grid com parallax Y + X + rotação leve */}
      <motion.div
        className="absolute inset-0 opacity-[0.13]"
        style={{
          y: layerGridY,
          x: layerGridX,
          rotateZ: gridRotSpring,
        }}
      >
        <div
          className="absolute inset-[-8%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(50,208,255,0.055) 1px, transparent 1px),
              linear-gradient(90deg, rgba(50,208,255,0.042) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 85% 70% at 50% 45%, black 0%, transparent 74%)",
          }}
        />
      </motion.div>

      {/* Grid secundário (escala menor, outra velocidade) */}
      <motion.div className="absolute inset-0 opacity-[0.07]" style={{ y: layerOrbit, x: layerAccent }}>
        <div
          className="absolute inset-[-5%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at 60% 35%, black 0%, transparent 68%)",
          }}
        />
      </motion.div>

      {/* Vignette estático leve */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 120% 85% at 50% 40%, transparent 0%, rgba(4,9,15,0.55) 100%)",
        }}
      />

      {/* Spotlight duplo (mouse + micro deslocamento no scroll via spotY) */}
      <motion.div className="absolute inset-0 opacity-[0.88]" style={{ backgroundImage: spotlightPrimary }} />
      <motion.div className="absolute inset-0 opacity-[0.75]" style={{ backgroundImage: spotlightAccent }} />

      <div
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="absolute inset-x-0 top-0 h-[42vh] opacity-[0.22]"
        style={{ y: layerAccent }}
      >
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(180deg, rgba(50,208,255,0.06), transparent 65%)",
          }}
        />
      </motion.div>

      {/* Beams — velocidades distintas */}
      <motion.div
        className="absolute left-[-12%] top-[16%] h-px w-[48%] origin-left opacity-32"
        style={{
          rotate: -7,
          y: layerMid,
          x: layerFine,
          background: "linear-gradient(90deg, transparent, rgba(50,208,255,0.38), transparent)",
        }}
      />
      <motion.div
        className="absolute left-[8%] top-[52%] h-px w-[36%] origin-left opacity-22"
        style={{
          rotate: -11,
          y: layerNear,
          background: "linear-gradient(90deg, transparent, rgba(50,208,255,0.22), transparent)",
        }}
      />
      <motion.div
        className="absolute bottom-[20%] right-[-10%] h-px w-[42%] origin-right opacity-26"
        style={{
          rotate: -4.5,
          y: layerBloom,
          background: "linear-gradient(90deg, transparent, rgba(159,232,112,0.3), transparent)",
        }}
      />

      {/* Anel tecnológico muito suave */}
      <motion.div
        className="absolute left-1/2 top-[28%] h-[min(70vh,620px)] w-[min(110vw,980px)] -translate-x-1/2 opacity-[0.06]"
        style={{
          y: layerOrbit,
          borderRadius: "48%",
          border: "1px solid rgba(50,208,255,0.12)",
          boxShadow: "0 0 60px rgba(50,208,255,0.04)",
        }}
      />

      {particleLayer}
    </div>
  );
}

const PARTICLE_POSITIONS = [
  { left: "8%", top: "16%" },
  { left: "18%", top: "42%" },
  { left: "28%", top: "12%" },
  { left: "42%", top: "28%" },
  { left: "56%", top: "18%" },
  { left: "71%", top: "34%" },
  { left: "84%", top: "22%" },
  { left: "12%", top: "62%" },
  { left: "38%", top: "78%" },
  { left: "62%", top: "68%" },
  { left: "88%", top: "58%" },
  { left: "22%", top: "88%" },
  { left: "48%", top: "92%" },
  { left: "76%", top: "82%" },
];
