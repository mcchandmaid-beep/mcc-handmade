"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

export interface DominoCardItem {
  id: string;
  productId: "model-01" | "model-02" | "model-03";
  title: { fr: string; ar: string };
  color: { fr: string; ar: string };
  price: number;
  image: string;
  width: number;
  height: number;
  alt: { fr: string; ar: string };
}

export const DOMINO_ITEMS: DominoCardItem[] = [
  {
    id: "m01-burgundy",
    productId: "model-01",
    title: { fr: "Ensemble sport femme", ar: "بدلة رياضية" },
    color: { fr: "Bordeaux", ar: "بورغندي" },
    price: 249,
    image: "/products/model-01/burgundy-01.png",
    width: 928,
    height: 1695,
    alt: {
      fr: "Modèle 01 Ensemble sport femme en teinte Bordeaux — Allure modeste contemporaine",
      ar: "الموديل 01 بدلة رياضية نسائية بلون بورغندي — إطلالة محتشمة معاصرة",
    },
  },
  {
    id: "m02-kaki",
    productId: "model-02",
    title: { fr: "Ensemble Capuche", ar: "طقم بقبعة" },
    color: { fr: "Vert kaki", ar: "أخضر كاكي" },
    price: 299,
    image: "/products/model-02/vert-kaki-01.png",
    width: 972,
    height: 1618,
    alt: {
      fr: "Modèle 02 Ensemble Capuche en Vert kaki — Coupe ample et asymétrique",
      ar: "الموديل 02 طقم بقبعة بلون أخضر كاكي — قصة واسعة وانسيابية",
    },
  },
  {
    id: "m03-marron",
    productId: "model-03",
    title: { fr: "Robe-Tunique Longue Casual", ar: "فستان تونك طويل كاجوال" },
    color: { fr: "Marron", ar: "بني" },
    price: 219,
    image: "/products/model-03/marron-01.png",
    width: 929,
    height: 1693,
    alt: {
      fr: "Modèle 03 Robe-Tunique Longue Casual en Marron — Élégance quotidienne",
      ar: "الموديل 03 فستان تونك طويل كاجوال بلون بني — أناقة عملية",
    },
  },
  {
    id: "m01-noir",
    productId: "model-01",
    title: { fr: "Ensemble sport femme", ar: "بدلة رياضية" },
    color: { fr: "Noir", ar: "أسود" },
    price: 249,
    image: "/products/model-01/black-01.png",
    width: 938,
    height: 1677,
    alt: {
      fr: "Modèle 01 Ensemble sport femme en Noir — Ligne épurée intemporelle",
      ar: "الموديل 01 بدلة رياضية نسائية بلون أسود — تصميم رصين خالد",
    },
  },
  {
    id: "m02-bordeaux",
    productId: "model-02",
    title: { fr: "Ensemble Capuche", ar: "طقم بقبعة" },
    color: { fr: "Bordeaux", ar: "بورغندي" },
    price: 299,
    image: "/products/model-02/bordeaux-01.png",
    width: 964,
    height: 1632,
    alt: {
      fr: "Modèle 02 Ensemble Capuche en Bordeaux — Tissu Scopa haut de gamme",
      ar: "الموديل 02 طقم بقبعة بلون بورغندي — قماش Scopa الفاخر",
    },
  },
  {
    id: "m03-blanc-casse",
    productId: "model-03",
    title: { fr: "Robe-Tunique Longue Casual", ar: "فستان تونك طويل كاجوال" },
    color: { fr: "Blanc cassé", ar: "أوف وايت" },
    price: 219,
    image: "/products/model-03/blanc-casse-01.png",
    width: 1039,
    height: 1513,
    alt: {
      fr: "Modèle 03 Robe-Tunique Longue en Blanc cassé — Lumière et tombé fluide",
      ar: "الموديل 03 فستان تونك طويل بلون أوف وايت — نقاء وانسيابية",
    },
  },
];

interface DominoGalleryProps {
  locale: Locale;
  eyebrow?: string;
  headline?: string;
  supportingText?: string;
  primaryCtaText?: string;
  secondaryCtaText?: string;
}

export function DominoGallery({
  locale,
  eyebrow = locale === "ar" ? "MCC HANDMADE · أزياء نسائية" : "MCC HANDMADE · MODE FÉMININE",
  headline = locale === "ar" ? "أناقة بسيطة، بأسلوبك الخاص." : "L’élégance, tout simplement.",
  supportingText = locale === "ar"
    ? "اكتشفي تصاميم تجمع بين الأناقة العصرية والراحة، لترافقك في مختلف لحظات يومك."
    : "Des tenues pensées pour un style moderne, confortable et naturellement élégant.",
  primaryCtaText = locale === "ar" ? "اكتشفي المجموعة" : "Découvrir la collection",
  secondaryCtaText = locale === "ar" ? "تصفحي الموديلات" : "Explorer les modèles",
}: DominoGalleryProps) {
  const isArabic = locale === "ar";
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isInViewport, setIsInViewport] = useState(true);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Viewport observer: completely pauses rAF loop when off-screen to save CPU
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto idle domino progression that gently cycles through cards
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !isInViewport) return;

    function step(timestamp: number) {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;

      if (!isPaused && delta > 4200) {
        setActiveIndex((prev) => (prev + 1) % DOMINO_ITEMS.length);
        lastTimeRef.current = timestamp;
      }

      animFrameRef.current = requestAnimationFrame(step);
    }

    animFrameRef.current = requestAnimationFrame(step);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPaused, isInViewport]);

  // Subtle scroll-driven micro-rotation handover
  const handleScrollProgress = useCallback(() => {
    if (!containerRef.current || !isInViewport) return;
    const rect = containerRef.current.getBoundingClientRect();
    const windowH = window.innerHeight || 800;
    const currentProgress = Math.min(Math.max((windowH - rect.top) / (windowH + rect.height), 0), 1);
    setProgress(currentProgress);
  }, [isInViewport]);

  useEffect(() => {
    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    handleScrollProgress();
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, [handleScrollProgress]);

  return (
    <section
      className="domino-hero"
      aria-label={isArabic ? "معرض أزياء الدار" : "Galerie Domino Mode Féminine"}
      dir={isArabic ? "rtl" : "ltr"}
      ref={containerRef}
    >
      {/* Editorial Ambient Background Elements */}
      <div className="domino-hero__ambient" aria-hidden="true">
        <div className="domino-hero__glow" />
      </div>

      <div className="domino-hero__inner">
        {/* Top Text Editorial Header */}
        <div className="domino-hero__content">
          <div className="domino-hero__eyebrow-wrap">
            <span className="mono-label domino-hero__eyebrow">[ {eyebrow} ]</span>
            <span className="mono-label domino-hero__season-tag">
              {isArabic ? "المجموعة الدائمة · 2026" : "COLLECTION PERMANENTE · 2026"}
            </span>
          </div>

          <h1 className="domino-hero__headline">{headline}</h1>

          <p className="domino-hero__supporting">{supportingText}</p>

          <div className="domino-hero__actions">
            <Link
              href={`/${locale}/collection`}
              className="action-btn action-btn--primary domino-hero__cta-primary"
            >
              <span>{primaryCtaText}</span>
              <span className="action-btn__arrow" aria-hidden="true">
                {isArabic ? "←" : "→"}
              </span>
            </Link>

            <a
              href="#collection-preview"
              className="action-btn action-btn--secondary domino-hero__cta-secondary"
            >
              <span>{secondaryCtaText}</span>
            </a>
          </div>
        </div>

        {/* The 3D Domino Stage */}
        <div
          className="domino-stage-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="domino-stage" role="region" aria-label="Lookbook Domino">
            {DOMINO_ITEMS.map((item, index) => {
              const offset = index - activeIndex;
              const isActive = index === activeIndex;

              // Domino 3D cascade calculation
              // Cards topple and lie back with a natural gravity tilt
              const dirMultiplier = isArabic ? -1 : 1;
              const rotateY = isActive ? 0 : offset * -14 * dirMultiplier;
              const rotateZ = isActive ? 0 : offset * -2 * dirMultiplier;
              const translateX = offset * 135 * dirMultiplier;
              const translateZ = isActive ? 60 : -Math.abs(offset) * 85;
              const opacity = Math.abs(offset) > 3 ? 0.15 : 1 - Math.abs(offset) * 0.18;
              const scale = isActive ? 1.04 : 0.94 - Math.abs(offset) * 0.04;

              return (
                <div
                  key={item.id}
                  className={`domino-card ${isActive ? "domino-card--active" : ""}`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                    zIndex: 20 - Math.abs(offset),
                    opacity: Math.max(opacity, 0.1),
                  }}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => {
                    setActiveIndex(index);
                    setIsPaused(true);
                  }}
                  onBlur={() => setIsPaused(false)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${item.title[locale]} — ${item.color[locale]}`}
                >
                  <div className="domino-card__frame">
                    <div className="domino-card__image-box">
                      <Image
                        alt={item.alt[locale]}
                        className="domino-card__image"
                        fill
                        priority={index === 0 || index === 1}
                        sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 340px"
                        src={item.image}
                      />
                      <div className="domino-card__tint" />
                    </div>

                    {/* Card Overlay Details */}
                    <div className="domino-card__info">
                      <div className="domino-card__meta">
                        <span className="mono-label domino-card__num">0{index + 1}</span>
                        <span className="mono-label domino-card__color">
                          {item.color[locale]}
                        </span>
                      </div>

                      <div className="domino-card__footer">
                        <h3 className="domino-card__title">{item.title[locale]}</h3>
                        <span className="mono-label domino-card__price">
                          {item.price} {isArabic ? "درهم" : "DH"}
                        </span>
                      </div>

                      {isActive && (
                        <Link
                          href={`/${locale}/${item.productId}`}
                          className="domino-card__action-btn mono-label"
                          tabIndex={-1}
                        >
                          <span>{isArabic ? "عرض التفاصيل" : "VOIR LA PIÈCE"}</span>
                          <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Domino Navigation Dots */}
          <div className="domino-nav-dots" role="tablist" aria-label="Sélection domino">
            {DOMINO_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                className={`domino-dot ${idx === activeIndex ? "domino-dot--active" : ""}`}
                onClick={() => setActiveIndex(idx)}
                type="button"
                role="tab"
                aria-selected={idx === activeIndex}
                aria-label={`${item.title[locale]} — ${item.color[locale]}`}
              >
                <span className="sr-only">0{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
