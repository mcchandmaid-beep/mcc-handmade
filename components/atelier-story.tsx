"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface AtelierStoryProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function AtelierStory({ dictionary, locale }: AtelierStoryProps) {
  const isArabic = locale === "ar";
  const a = dictionary.atelier;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const cards = el.querySelectorAll<HTMLElement>(".atelier-pillar-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("atelier-pillar-card--visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="atelier-gradient-section"
      id="atelier"
      aria-labelledby="atelier-title"
      ref={sectionRef}
    >
      <div id="story" style={{ position: "absolute", top: 0 }} aria-hidden="true" />
      {/* Background Gradient Ambiance */}
      <div className="atelier-gradient-bg" aria-hidden="true">
        <div className="atelier-gradient-glow atelier-gradient-glow--clay" />
        <div className="atelier-gradient-glow atelier-gradient-glow--plum" />
        <div className="atelier-gradient-glow atelier-gradient-glow--rose" />
      </div>

      <div className="atelier-gradient-inner">
        {/* Top Hairline Header */}
        <div className="atelier-gradient-topbar">
          <span className="mono-label atelier-gradient-tag">
            [ {isArabic ? "المحترف · المعايير التأسيسية" : "L'ATELIER · PRINCIPES FONDAMENTAUX"} ]
          </span>
          <span className="mono-label atelier-gradient-edition">
            {isArabic ? "دار MCC · إصدار 2026" : "MAISON MCC · 2026"}
          </span>
        </div>

        {/* Section Intro */}
        <div className="atelier-gradient-intro">
          <p className="mono-label atelier-gradient-eyebrow">
            {a.eyebrow}
          </p>
          <h2 id="atelier-title" className="atelier-gradient-title">
            {a.title}
          </h2>
          <p className="atelier-gradient-subtitle">
            {a.subtitle}
          </p>
        </div>

        {/* Main Grid: 3 Pillars + Genuine Atelier Photography */}
        <div className="atelier-gradient-grid">
          {/* 3 Pillars Column */}
          <div className="atelier-pillars-list">
            {a.pillars.map((pillar, index) => (
              <article
                className="atelier-pillar-card"
                key={pillar.title}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="atelier-pillar-card__header">
                  <span className="mono-label atelier-pillar-card__index">
                    0{index + 1}
                  </span>
                  <span className="atelier-pillar-card__bar" aria-hidden="true" />
                </div>
                <h3 className="atelier-pillar-card__title">{pillar.title}</h3>
                <p className="atelier-pillar-card__body">{pillar.body}</p>
              </article>
            ))}
          </div>

          {/* Editorial Photo Canvas */}
          <div className="atelier-photo-canvas">
            <div className="atelier-photo-wrap">
              <Image
                src="/products/model-02/vert-kaki-02.png"
                alt={
                  isArabic
                    ? "تفاصيل قماش Scopa والانسيابية في محترف MCC Handmade"
                    : "Étude du tombé et du tissu Scopa à l'atelier MCC Handmade"
                }
                fill
                className="atelier-photo-img"
                sizes="(max-width: 900px) 100vw, 42vw"
                loading="lazy"
              />
              <div className="atelier-photo-tint" aria-hidden="true" />
              <div className="atelier-photo-badge mono-label">
                [ {isArabic ? "دراسة القصة · قماش Scopa" : "ÉTUDE DE COUPE · SCOPA"} ]
              </div>
            </div>

            <div className="atelier-action-box">
              <p className="atelier-action-text">
                {isArabic
                  ? "كل قطعة تُفصّل بعناية لضمان انسدال ناعم ووقار طبيعي يدوم عبر الأيام."
                  : "Chaque création est pensée pour allier liberté de mouvement et élégance modeste sans artifice."}
              </p>
              <Link
                href={`/${locale}/collection`}
                className="action-btn action-btn--primary atelier-cta-btn"
              >
                <span>{isArabic ? "استكشفي المجموعة" : "VOIR LES CRÉATIONS"}</span>
                <span className="action-btn__arrow" aria-hidden="true">
                  {isArabic ? "←" : "→"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
