"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function LandingMotion() {
  useEffect(() => {
    // Decoding effect for headers
    const decodings = document.querySelectorAll(".decode-text");

    decodings.forEach((el) => {
      const originalText = el.getAttribute("data-text") || el.textContent || "";
      if (!el.hasAttribute("data-text")) {
        el.setAttribute("data-text", originalText);
      }

      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          let iteration = 0;
          let interval: NodeJS.Timeout | null = null;

          const target = el as HTMLElement;
          target.style.position = "relative";
          // Wrap in a layout-preserving container that won't break if wrapped around pure text spans
          target.innerHTML = `
            <span style="opacity: 0; pointer-events: none; visibility: hidden; white-space: pre-wrap;">${originalText}</span>
            <span class="animated-decode-layer" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; white-space: pre-wrap;"></span>
          `;

          const animatedLayer = target.querySelector(".animated-decode-layer");

          clearInterval(interval!);

          interval = setInterval(() => {
            const newText = originalText.split("").map((letter, index) => {
              if (index < iteration) {
                return originalText[index];
              }
              const isSpace = originalText[index] === " ";
              if (isSpace) return " ";
              return letters[Math.floor(Math.random() * letters.length)];
            }).join("");

            if (animatedLayer) {
              animatedLayer.innerHTML = newText;
            }

            if (iteration >= originalText.length) {
              clearInterval(interval!);
              target.innerHTML = originalText;
            }
            iteration += 1 / 3;
          }, 30);
        },
      });
    });

    // Reveal animations for HUD items
    const hudPanels = document.querySelectorAll(".hud-reveal");
    hudPanels.forEach((panel) => {
      gsap.fromTo(
        panel,
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
