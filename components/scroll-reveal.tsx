"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Lightweight, accessible scroll-reveal coordinator.
 * Adds `.is-revealed` class to elements with `.reveal-on-scroll` as they enter viewport.
 * Automatically unobserves elements once revealed to prevent rerender/scroll re-triggers.
 * Honors `prefers-reduced-motion` immediately without animation.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll<HTMLElement>(".reveal-on-scroll");

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      elements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -16px 0px",
      }
    );

    elements.forEach((el) => {
      // If element is already in the upper viewport on load, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add("is-revealed");
      } else {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
