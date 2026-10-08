"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface CinematicHeroProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function CinematicHero({ dictionary, locale }: CinematicHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const utilityBarRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const isArabic = locale === "ar";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Non-Blocking Progressive Entrance Enhancement (Target duration ~0.8s)
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Subtle image settle from 1.05 to 1.0 (no blank white flash, image is already visible)
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 1.05 },
          { scale: 1.0, duration: 0.8 }
        );
      }

      // Display Typography gentle settle
      const titleLines = titleRef.current?.querySelectorAll(".display-line");
      if (titleLines && titleLines.length > 0) {
        tl.fromTo(
          titleLines,
          { y: 14, opacity: 0.85 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 },
          "-=0.7"
        );
      }

      // Utility bar & hint gentle settle
      if (utilityBarRef.current) {
        tl.fromTo(
          utilityBarRef.current,
          { opacity: 0.6 },
          { opacity: 1, duration: 0.5 },
          "-=0.6"
        );
      }

      if (scrollHintRef.current) {
        tl.fromTo(
          scrollHintRef.current,
          { opacity: 0.6 },
          { opacity: 1, duration: 0.5 },
          "-=0.5"
        );
      }

      // 2. True Continuous Scroll Choreography (Desktop 901px+)
      // 0% -> 25% -> 50% -> 75% -> 100% continuous scrubbed handover
      mm.add("(min-width: 901px)", () => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 1.0,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 0% to 25%: Subtle image scale and positional transformation
        scrollTl.to(
          imageRef.current,
          {
            scale: 1.04,
            yPercent: -2,
            ease: "power1.inOut",
            duration: 0.25,
          },
          0
        );

        // 25% to 50%: Display typography begins to shift/exit
        scrollTl.to(
          contentRef.current,
          {
            yPercent: -18,
            opacity: 0.35,
            ease: "power2.inOut",
            duration: 0.25,
          },
          0.25
        );

        // 50% to 75%: Hero image composition changes (deeper frame drift, full title dissolve)
        scrollTl.to(
          imageRef.current,
          {
            scale: 1.08,
            yPercent: -6,
            ease: "power1.inOut",
            duration: 0.25,
          },
          0.5
        );

        scrollTl.to(
          contentRef.current,
          {
            yPercent: -35,
            opacity: 0,
            ease: "power2.in",
            duration: 0.25,
          },
          0.5
        );

        // 75% to 100%: Warm-sand Manifeste scene handover
        scrollTl.to(
          heroEl,
          {
            backgroundColor: "#F9F8F6",
            duration: 0.25,
            ease: "none",
          },
          0.75
        );

        scrollTl.to(
          scrollHintRef.current,
          {
            opacity: 0,
            y: 12,
            duration: 0.2,
            ease: "none",
          },
          0.1
        );
      });

      // Mobile: Fluid non-pinning parallax scrub
      mm.add("(max-width: 900px)", () => {
        if (imageRef.current) {
          gsap.to(imageRef.current, {
            scrollTrigger: {
              trigger: heroEl,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
            yPercent: -4,
            scale: 1.04,
            ease: "none",
          });
        }
      });
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-display-title"
      className="editorial-hero"
      ref={heroRef}
    >
      {/* Top Monospace Utility Bar */}
      <div className="hero-utility-bar" ref={utilityBarRef}>
        <span className="mono-label hero-utility-bar__index">[ 01 / 01 ]</span>
        <span className="mono-label hero-utility-bar__season">{dictionary.hero.eyebrow}</span>
        <span className="mono-label hero-utility-bar__spec">{dictionary.hero.metaSpec}</span>
      </div>

      {/* Main Editorial Canvas */}
      <div className="editorial-hero__canvas" ref={canvasRef}>
        {/* Typographic Column */}
        <div className="editorial-hero__content" ref={contentRef}>
          <div className="editorial-hero__content-inner">
            <p className="mono-label editorial-hero__ref">
              [ {dictionary.reveal.eyebrow} · 2026 ]
            </p>

            <h1 id="hero-display-title" className="editorial-hero__display-title" ref={titleRef}>
              {isArabic ? (
                <>
                  <span className="display-line-wrap">
                    <span className="display-line">المحترف</span>
                  </span>
                  <span className="display-line-wrap">
                    <span className="display-line">الصامت</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="display-line-wrap">
                    <span className="display-line">L’ATELIER</span>
                  </span>
                  <span className="display-line-wrap">
                    <span className="display-line">SILENCIEUX</span>
                  </span>
                </>
              )}
            </h1>

            <p className="editorial-hero__statement">
              {dictionary.hero.subtitle}
            </p>

            <div className="editorial-hero__actions">
              <Link
                className="action-btn action-btn--primary"
                data-cursor="discover"
                href={`/${locale}/model-01`}
              >
                <span>{dictionary.hero.cta}</span>
                <span className="action-btn__arrow" aria-hidden="true">
                  {isArabic ? "←" : "→"}
                </span>
              </Link>
            </div>
          </div>

          <div className="editorial-hero__meta-footer">
            <span className="mono-label">{isArabic ? "أناقة محتشمة معاصرة" : "HAUTE ÉLÉGANCE MODESTE"}</span>
            <span className="mono-label">{isArabic ? "دار MCC · 2026" : "MAISON MCC · 2026"}</span>
          </div>
        </div>

        {/* Dominant Photographic Column */}
        <div
          className="editorial-hero__visual"
          data-cursor="view"
          ref={visualRef}
        >
          <div className="editorial-hero__image-wrapper">
            <Image
              alt="MCC Handmade — Model 01 Bordeaux"
              className="editorial-hero__image"
              fill
              priority
              ref={imageRef}
              sizes="(max-width: 900px) 100vw, (max-width: 1440px) 65vw, 920px"
              src="/products/model-01/burgundy-01.png"
            />
            <div className="editorial-hero__image-tag" aria-hidden="true">
              <span className="mono-label">[ {dictionary.hero.modelTag} ]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Invitation */}
      <div className="editorial-hero__scroll-hint" ref={scrollHintRef}>
        <span className="mono-label">[ {dictionary.hero.scrollHint} ↓ ]</span>
      </div>
    </section>
  );
}
