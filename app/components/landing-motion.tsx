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

          clearInterval(interval!);

          interval = setInterval(() => {
            el.textContent = originalText.split("").map((letter, index) => {
              if (index < iteration) {
                return originalText[index];
              }
              const isSpace = originalText[index] === " " || originalText[index] === "\n";
              if (isSpace) return originalText[index]; // Preserve layout
              return letters[Math.floor(Math.random() * letters.length)];
            }).join("");

            if (iteration >= originalText.length) {
              clearInterval(interval!);
            }
            iteration += 1 / 4;
          }, 30);
        },
      });
    });

    // Reveal animations for HUD items
    const hudPanels = document.querySelectorAll(".hud-reveal");
    hudPanels.forEach((panel, i) => {
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
