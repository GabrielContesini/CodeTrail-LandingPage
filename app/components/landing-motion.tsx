"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LandingMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const parallaxItems = gsap.utils.toArray<HTMLElement>("[data-parallax]");

    reveals.forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 42,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          delay: index < 3 ? index * 0.08 : 0,
          scrollTrigger: {
            trigger: element,
            start: "top 84%",
            once: true,
          },
        },
      );
    });

    parallaxItems.forEach((element, index) => {
      gsap.to(element, {
        yPercent: index % 2 === 0 ? -10 : -16,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
