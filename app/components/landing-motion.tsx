"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function scrollToSection(selector: string) {
  const target = document.querySelector<HTMLElement>(selector);
  if (!target) {
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - 104;
  window.scrollTo({ top, behavior: "auto" });
  window.history.replaceState(null, "", selector);
}

export function LandingMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const curtain = document.querySelector<HTMLElement>("[data-page-curtain]");
    const introItems = gsap.utils.toArray<HTMLElement>("[data-intro]");
    const sections = gsap.utils.toArray<HTMLElement>("[data-section]");
    const floatItems = gsap.utils.toArray<HTMLElement>("[data-float]");
    const navLinks = gsap.utils.toArray<HTMLAnchorElement>("[data-section-link]");

    const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (curtain) {
      introTimeline.to(curtain, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 1.05,
      });
    }

    introTimeline.fromTo(
      introItems,
      {
        opacity: 0,
        y: 36,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.12,
      },
      curtain ? "-=0.72" : 0,
    );

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 56,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        },
      );
    });

    floatItems.forEach((item, index) => {
      gsap.to(item, {
        yPercent: index % 2 === 0 ? -7 : -11,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    const handlers = navLinks.map((link) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) {
        return () => {};
      }

      const handler = (event: Event) => {
        event.preventDefault();

        if (!curtain) {
          scrollToSection(href);
          return;
        }

        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
        });

        timeline
          .set(curtain, {
            transformOrigin: "bottom center",
            pointerEvents: "auto",
          })
          .to(curtain, {
            scaleY: 1,
            duration: 0.42,
          })
          .add(() => {
            scrollToSection(href);
          })
          .set(curtain, {
            transformOrigin: "top center",
          })
          .to(curtain, {
            scaleY: 0,
            duration: 0.52,
          })
          .set(curtain, { pointerEvents: "none" });
      };

      link.addEventListener("click", handler);
      return () => link.removeEventListener("click", handler);
    });

    return () => {
      handlers.forEach((cleanup) => cleanup());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
