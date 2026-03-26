"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function LandingMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document
        .querySelectorAll<HTMLElement>(".hero-reveal, .reveal-up")
        .forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "none";
          element.style.filter = "none";
        });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-reveal",
        {
          opacity: 0.78,
          y: 18,
          filter: "blur(6px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.06,
        },
      );

      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((element, index) => {
        gsap.fromTo(
          element,
          {
            opacity: 0.82,
            y: 24,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.52,
            delay: index % 3 === 0 ? 0 : 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    });

    return () => {
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
