"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface EditorialDiptychProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function EditorialDiptych({ dictionary, locale }: EditorialDiptychProps) {
  const isArabic = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const figureARef = useRef<HTMLElement>(null);
  const figureBRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      // 1. Entrance reveals
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        figureARef.current,
        { clipPath: "inset(12% 0% 12% 0%)", opacity: 0.8 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.2, ease: "power4.out" }
      );

      tl.fromTo(
        figureBRef.current,
        { clipPath: "inset(15% 0% 15% 0%)", opacity: 0.8 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.2, ease: "power4.out" },
        "-=0.9"
      );

      // 2. Continuous Parallax Relationship during scroll
      gsap.to(figureARef.current, {
        scrollTrigger: {
          trigger: sectionEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
        yPercent: 5,
        ease: "none",
      });

      gsap.to(figureBRef.current, {
        scrollTrigger: {
          trigger: sectionEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
        yPercent: -8,
        ease: "none",
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      aria-labelledby="story-title"
      className="editorial-story"
      ref={sectionRef}
    >
      {/* Top Hairline Bar */}
      <div className="editorial-story__top-bar">
        <div className="editorial-story__top-left">
          <span className="mono-label">[ {dictionary.diptych.eyebrow} ]</span>
          <h2 id="story-title" className="editorial-story__title">
            {dictionary.diptych.title}
          </h2>
        </div>
        <div className="editorial-story__top-right">
          <p className="editorial-story__description">{dictionary.diptych.description}</p>
        </div>
      </div>

      {/* Asymmetric Image Grid */}
      <div className="editorial-story__grid">
        {/* Primary Large Image */}
        <figure
          className="editorial-story__figure editorial-story__figure--primary"
          data-cursor="view"
          ref={figureARef}
        >
          <div className="editorial-story__media">
            <Image
              alt={dictionary.diptych.captionLeft}
              className="editorial-story__image"
              height={1573}
              loading="lazy"
              sizes="(max-width: 900px) 100vw, (max-width: 1440px) 55vw, 760px"
              src="/products/model-01/burgundy-02.png"
              width={1000}
            />
          </div>
          <figcaption className="editorial-story__caption">
            <span className="mono-label">{dictionary.diptych.captionLeft}</span>
            <span className="mono-label">[ 01 ]</span>
          </figcaption>
        </figure>

        {/* Secondary Staggered/Offset Image */}
        <figure
          className="editorial-story__figure editorial-story__figure--secondary"
          data-cursor="view"
          ref={figureBRef}
        >
          <div className="editorial-story__media">
            <Image
              alt={dictionary.diptych.captionRight}
              className="editorial-story__image"
              height={1629}
              loading="lazy"
              sizes="(max-width: 900px) 100vw, (max-width: 1440px) 45vw, 620px"
              src="/products/model-01/black-01.png"
              width={966}
            />
          </div>
          <figcaption className="editorial-story__caption">
            <span className="mono-label">{dictionary.diptych.captionRight}</span>
            <span className="mono-label">[ 02 ]</span>
          </figcaption>
        </figure>
      </div>

      {/* Bottom Hairline Footer Bar */}
      <div className="editorial-story__bottom-bar">
        <span className="mono-label">{isArabic ? "دراسة بصرية للموديل" : "ÉTUDE PHOTOGRAPHIQUE IN SITU"}</span>
        <span className="mono-label">{isArabic ? "دار MCC · أناقة سيادية" : "MCC HANDMADE · ÉLÉGANCE SOUVERAINE"}</span>
      </div>
    </section>
  );
}
