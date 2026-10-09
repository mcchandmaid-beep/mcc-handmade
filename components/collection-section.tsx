"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { model01, model02, model03, formatPrice, getLocalizedField } from "@/data/products";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface CollectionSectionProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function CollectionSection({ dictionary, locale }: CollectionSectionProps) {
  const isArabic = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const ctx = gsap.context(() => {
      const cards = sectionEl.querySelectorAll(".collection-piece-card");

      gsap.fromTo(
        cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isArabic]);

  return (
    <section
      aria-labelledby="collection-title"
      className="collection-section"
      id="collection"
      ref={sectionRef}
    >
      {/* Top Hairline Bar */}
      <div className="collection-section__top-bar">
        <span className="mono-label">[ {dictionary.collection.eyebrow} ]</span>
        <span className="mono-label">
          {isArabic ? "المجموعة الدائمة · إصدار 2026" : "COLLECTION PERMANENTE · ÉDITION 2026"}
        </span>
      </div>

      <div className="collection-section__intro reveal-on-scroll">
        <h2 id="collection-title" className="collection-section__main-title">
          {isArabic ? "ثلاثة تصاميم. ثلاثة تعبيرات عن الوقار والأناقة." : "TROIS SILHOUETTES. TROIS EXPRESSIONS DE L'ALLURE."}
        </h2>
        <p className="collection-section__main-subtitle">
          {isArabic
            ? "يفتتح محترف MCC Handmade تشكيلته الدائمة بثلاثة تصاميم أساسية: الموديل 01 التأسيسي، طقم الكابوش، وفستان التونك الطويل."
            : "L'Atelier MCC Handmade enrichit son vestiaire permanent : le Modèle 01 fondateur, l'Ensemble Capuche et la Robe-Tunique Longue Casual."}
        </p>
      </div>

      {/* Editorial Three-Piece Curation */}
      <div className="collection-pieces-grid">
        {/* Piece 01: Modèle 01 */}
        <article className="collection-piece-card reveal-on-scroll reveal-delay-1" data-cursor="discover">
          <Link
            href={`/${locale}/model-01`}
            className="collection-piece-card__media-wrap"
            aria-label={`${getLocalizedField(model01.name, locale)} — ${formatPrice(model01, locale)}`}
          >
            <div className="collection-piece-card__media">
              <Image
                alt={`${getLocalizedField(model01.name, locale)} — MCC Handmade`}
                className="collection-piece-card__image"
                fill
                loading="lazy"
                sizes="(max-width: 900px) 100vw, 33vw"
                src="/products/model-01/burgundy-03.png"
              />
              <div className="collection-piece-card__badge mono-label">
                [ 01 / 03 · {isArabic ? "الموديل 01" : "MODÈLE 01"} ]
              </div>
            </div>
          </Link>

          <div className="collection-piece-card__content">
            <div className="collection-piece-card__meta">
              <span className="mono-label">[ {isArabic ? "المجموعة الدائمة" : "COLLECTION PERMANENTE"} ]</span>
              <span className="mono-label collection-piece-card__price">
                {formatPrice(model01, locale)}
              </span>
            </div>

            <h3 className="collection-piece-card__title">
              <Link href={`/${locale}/model-01`}>
                {getLocalizedField(model01.name, locale)}
              </Link>
            </h3>

            <p className="collection-piece-card__tagline">
              {getLocalizedField(model01.tagline, locale)}
            </p>

            <div className="collection-piece-card__specs">
              <span className="mono-label">
                {isArabic ? "4 ألوان" : "4 NUANCES"}
              </span>
              <span className="spec-dot" aria-hidden="true">·</span>
              <span className="mono-label">S · M · L · XL</span>
            </div>

            <div className="collection-piece-card__action">
              <Link
                className="action-btn action-btn--primary"
                href={`/${locale}/model-01`}
              >
                <span>{dictionary.collection.viewDetails}</span>
                <span className="action-btn__arrow" aria-hidden="true">
                  {isArabic ? "←" : "→"}
                </span>
              </Link>
            </div>
          </div>
        </article>

        {/* Piece 02: Model 02 — Ensemble Capuche */}
        <article className="collection-piece-card reveal-on-scroll reveal-delay-2" data-cursor="discover">
          <Link
            href={`/${locale}/model-02`}
            className="collection-piece-card__media-wrap"
            aria-label={`${getLocalizedField(model02.name, locale)} — ${formatPrice(model02, locale)}`}
          >
            <div className="collection-piece-card__media">
              <Image
                alt={`${getLocalizedField(model02.name, locale)} — MCC Handmade`}
                className="collection-piece-card__image"
                fill
                loading="lazy"
                sizes="(max-width: 900px) 100vw, 33vw"
                src="/products/model-02/bordeaux-01.png"
              />
              <div className="collection-piece-card__badge mono-label">
                [ 02 / 03 · {isArabic ? "طقم بقبعة" : "ENSEMBLE CAPUCHE"} ]
              </div>
            </div>
          </Link>

          <div className="collection-piece-card__content">
            <div className="collection-piece-card__meta">
              <span className="mono-label">[ {isArabic ? "المجموعة الدائمة" : "COLLECTION PERMANENTE"} ]</span>
              <span className="mono-label collection-piece-card__price">
                {formatPrice(model02, locale)}
              </span>
            </div>

            <h3 className="collection-piece-card__title">
              <Link href={`/${locale}/model-02`}>
                {getLocalizedField(model02.name, locale)}
              </Link>
            </h3>

            <p className="collection-piece-card__tagline">
              {getLocalizedField(model02.tagline, locale)}
            </p>

            <div className="collection-piece-card__specs">
              <span className="mono-label">
                {isArabic ? "4 ألوان" : "4 NUANCES"}
              </span>
              <span className="spec-dot" aria-hidden="true">·</span>
              <span className="mono-label">
                {isArabic ? "المقاسات 1 · 2 · 3" : "TAILLES 1 · 2 · 3"}
              </span>
            </div>

            <div className="collection-piece-card__action">
              <Link
                className="action-btn action-btn--primary"
                href={`/${locale}/model-02`}
              >
                <span>{dictionary.collection.viewDetails}</span>
                <span className="action-btn__arrow" aria-hidden="true">
                  {isArabic ? "←" : "→"}
                </span>
              </Link>
            </div>
          </div>
        </article>

        {/* Piece 03: Model 03 — Robe-Tunique Longue Casual */}
        <article className="collection-piece-card reveal-on-scroll reveal-delay-3" data-cursor="discover">
          <Link
            href={`/${locale}/model-03`}
            className="collection-piece-card__media-wrap"
            aria-label={`${getLocalizedField(model03.name, locale)} — ${formatPrice(model03, locale)}`}
          >
            <div className="collection-piece-card__media">
              <Image
                alt={`${getLocalizedField(model03.name, locale)} — MCC Handmade`}
                className="collection-piece-card__image"
                fill
                loading="lazy"
                sizes="(max-width: 900px) 100vw, 33vw"
                src="/products/model-03/blanc-casse-01.png"
              />
              <div className="collection-piece-card__badge mono-label">
                [ 03 / 03 · {isArabic ? "فستان تونك طويل" : "ROBE-TUNIQUE"} ]
              </div>
            </div>
          </Link>

          <div className="collection-piece-card__content">
            <div className="collection-piece-card__meta">
              <span className="mono-label">[ {isArabic ? "المجموعة الدائمة" : "COLLECTION PERMANENTE"} ]</span>
              <span className="mono-label collection-piece-card__price">
                {formatPrice(model03, locale)}
              </span>
            </div>

            <h3 className="collection-piece-card__title">
              <Link href={`/${locale}/model-03`}>
                {getLocalizedField(model03.name, locale)}
              </Link>
            </h3>

            <p className="collection-piece-card__tagline">
              {getLocalizedField(model03.tagline, locale)}
            </p>

            <div className="collection-piece-card__specs">
              <span className="mono-label">
                {isArabic ? "3 ألوان" : "3 NUANCES"}
              </span>
              <span className="spec-dot" aria-hidden="true">·</span>
              <span className="mono-label">S · M · L · XL</span>
            </div>

            <div className="collection-piece-card__action">
              <Link
                className="action-btn action-btn--primary"
                href={`/${locale}/model-03`}
              >
                <span>{dictionary.collection.viewDetails}</span>
                <span className="action-btn__arrow" aria-hidden="true">
                  {isArabic ? "←" : "→"}
                </span>
              </Link>
            </div>
          </div>
        </article>
      </div>

      {/* Bottom Collection Link */}
      <div className="collection-section__footer">
        <Link
          className="collection-section__all-link"
          href={`/${locale}/collection`}
        >
          <span className="mono-label">
            [ {isArabic ? "استكشفي كامل المجموعة (03 تصاميم)" : "DÉCOUVRIR TOUTE LA COLLECTION (03 PIÈCES)"} ]
          </span>
          <span className="action-btn__arrow" aria-hidden="true">
            {isArabic ? "←" : "→"}
          </span>
        </Link>
      </div>
    </section>
  );
}
