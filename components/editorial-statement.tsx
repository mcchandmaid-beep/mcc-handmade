"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface EditorialStatementProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function EditorialStatement({ dictionary, locale }: EditorialStatementProps) {
  const isArabic = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDListElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });

      // Hairline top border animation
      tl.fromTo(
        ".editorial-statement__top-bar",
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.6 }
      );

      // Line-by-line masked typography reveal
      const lines = titleRef.current?.querySelectorAll(".statement-line");
      if (lines && lines.length > 0) {
        tl.fromTo(
          lines,
          { yPercent: 105, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power4.out" },
          "-=0.3"
        );
      }

      // Divider expansion
      if (dividerRef.current) {
        tl.fromTo(
          dividerRef.current,
          { scaleX: 0, transformOrigin: isArabic ? "right" : "left" },
          { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
          "-=0.5"
        );
      }

      // Description & specifications staggered reveal
      tl.fromTo(
        textColRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );

      const specRows = specsRef.current?.querySelectorAll(".statement-specs__row");
      if (specRows && specRows.length > 0) {
        tl.fromTo(
          specRows,
          { opacity: 0, x: isArabic ? -20 : 20 },
          { opacity: 1, x: 0, duration: 0.6, stagger: 0.12 },
          "-=0.6"
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isArabic]);

  return (
    <section
      aria-labelledby="statement-title"
      className="editorial-statement"
      id="statement"
      ref={sectionRef}
    >
      <div className="editorial-statement__top-bar">
        <span className="mono-label">{dictionary.statement.eyebrow}</span>
        <span className="mono-label">[ SECTION 02 ]</span>
      </div>

      <div className="editorial-statement__body">
        <h2 id="statement-title" className="editorial-statement__title" ref={titleRef}>
          <span className="statement-line-wrap">
            <span className="statement-line">{dictionary.statement.line1}</span>
          </span>
          <span className="statement-line-wrap">
            <span className="statement-line">{dictionary.statement.line2}</span>
          </span>
        </h2>

        <div
          className="editorial-statement__divider"
          aria-hidden="true"
          ref={dividerRef}
        />

        <div className="editorial-statement__footer-grid">
          <div className="editorial-statement__text-col" ref={textColRef}>
            <p className="editorial-statement__description">
              {dictionary.statement.body}
            </p>
          </div>

          <div className="editorial-statement__meta-col">
            <dl className="statement-specs" ref={specsRef}>
              <div className="statement-specs__row">
                <dt className="mono-label">DISCIPLINE</dt>
                <dd className="mono-label">{isArabic ? "أناقة محتشمة معاصرة" : "ÉLÉGANCE MODESTE"}</dd>
              </div>
              <div className="statement-specs__row">
                <dt className="mono-label">EXIGENCE</dt>
                <dd className="mono-label">{isArabic ? "خطوط نقية وتصميم رصين" : "LIGNES ÉPURÉES & SOUVERAINETÉ"}</dd>
              </div>
              <div className="statement-specs__row">
                <dt className="mono-label">PRÉSENCE</dt>
                <dd className="mono-label">{isArabic ? "دار MCC · 2026" : "MAISON MCC · 2026"}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
