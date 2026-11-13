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

  // 1. Manual selection state (stable, default index 1, never rotates automatically)
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Active visual focus is the card nearest the pointer on hover, or the selected card at rest
  const activeVisualIndex = isHovering && hoveredIndex !== null ? hoveredIndex : selectedIndex;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const hoveredIndexRef = useRef<number | null>(null);
  const isHoveringRef = useRef(false);
  const targetParallaxXRef = useRef(0);
  const currentParallaxXRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Media query checks for reduced motion and mobile screen size
  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", onMotionChange);

    const mobileQuery = window.matchMedia("(max-width: 640px)");
    setIsMobile(mobileQuery.matches);
    const onMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mobileQuery.addEventListener("change", onMobileChange);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      mobileQuery.removeEventListener("change", onMobileChange);
    };
  }, []);

  // Parallax animation loop: only runs while interacting or settling to rest, never at idle
  const updateParallax = useCallback(() => {
    if (prefersReducedMotion) {
      if (stageRef.current) {
        stageRef.current.style.transform = "";
      }
      animFrameRef.current = null;
      return;
    }

    const diff = targetParallaxXRef.current - currentParallaxXRef.current;
    currentParallaxXRef.current += diff * 0.08;

    if (stageRef.current) {
      const pX = currentParallaxXRef.current;
      const deg = (pX * 3.2 * (isArabic ? -1 : 1)).toFixed(3);
      const shift = (pX * 14 * (isArabic ? -1 : 1)).toFixed(2);
      stageRef.current.style.transform = `rotateY(${deg}deg) translateX(${shift}px)`;
    }

    // Keep loop active while user is hovering OR currentParallax has not yet settled
    if (isHoveringRef.current || Math.abs(currentParallaxXRef.current) > 0.001) {
      animFrameRef.current = requestAnimationFrame(updateParallax);
    } else {
      currentParallaxXRef.current = 0;
      if (stageRef.current) {
        stageRef.current.style.transform = "rotateY(0deg) translateX(0px)";
      }
      animFrameRef.current = null;
    }
  }, [isArabic, prefersReducedMotion]);

  const startParallaxLoop = useCallback(() => {
    if (prefersReducedMotion) return;
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updateParallax);
    }
  }, [prefersReducedMotion, updateParallax]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Pointer movement: maps horizontal mouse position across gallery to nearest card + subtle 3D shift
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if ("pointerType" in e && e.pointerType === "touch") return;
    if (prefersReducedMotion) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (!isHoveringRef.current) {
      isHoveringRef.current = true;
      setIsHovering(true);
    }

    const rect = wrapper.getBoundingClientRect();
    if (rect.width <= 0) return;

    // 1. Subtle 3D stage parallax
    const normX = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    targetParallaxXRef.current = (normX - 0.5) * 2;
    startParallaxLoop();

    // 2. Continuous horizontal card detection across gallery width
    const normFraction = isArabic ? 1 - normX : normX;
    const continuousIdx = normFraction * (DOMINO_ITEMS.length - 1);
    const nearest = Math.min(
      Math.max(Math.round(continuousIdx), 0),
      DOMINO_ITEMS.length - 1
    );

    // Apply hysteresis to prevent boundary jitter
    const current = hoveredIndexRef.current;
    if (current === null) {
      hoveredIndexRef.current = nearest;
      setHoveredIndex(nearest);
    } else if (Math.abs(continuousIdx - current) > 0.45) {
      hoveredIndexRef.current = nearest;
      setHoveredIndex(nearest);
    }
  };

  const handlePointerEnter = () => {
    isHoveringRef.current = true;
    setIsHovering(true);
  };

  const handlePointerLeave = () => {
    isHoveringRef.current = false;
    setIsHovering(false);
    hoveredIndexRef.current = null;
    setHoveredIndex(null);
    targetParallaxXRef.current = 0;
    startParallaxLoop();
  };

  // Direct card hover for precision
  const handleCardPointerEnter = (idx: number) => {
    isHoveringRef.current = true;
    setIsHovering(true);
    hoveredIndexRef.current = idx;
    setHoveredIndex(idx);
  };

  // Manual selection: clicking a card locks it as the selected product
  const handleSelectCard = (idx: number) => {
    setSelectedIndex(idx);
    hoveredIndexRef.current = idx;
    setHoveredIndex(idx);
  };

  // Touch swipe support on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    const start = touchStartRef.current;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - start.x;
    const deltaY = endY - start.y;
    touchStartRef.current = null;

    // Preserve native vertical scrolling
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (Math.abs(deltaX) >= 35) {
      const isSwipingNext = isArabic ? deltaX > 0 : deltaX < 0;
      if (isSwipingNext) {
        setSelectedIndex((prev) => Math.min(prev + 1, DOMINO_ITEMS.length - 1));
      } else {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  return (
    <section
      className="domino-hero"
      aria-label={isArabic ? "معرض أزياء الدار" : "Galerie Domino Mode Féminine"}
      dir={isArabic ? "rtl" : "ltr"}
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

        {/* The Interactive 3D Domino Stage */}
        <div
          ref={wrapperRef}
          className="domino-stage-wrapper"
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={stageRef}
            className="domino-stage"
            role="region"
            aria-label="Lookbook Domino"
            onClick={() => {
              if (hoveredIndex !== null) {
                handleSelectCard(hoveredIndex);
              }
            }}
          >
            {DOMINO_ITEMS.map((item, index) => {
              const offset = index - activeVisualIndex;
              const isFocused = index === activeVisualIndex;
              const isSelected = index === selectedIndex;

              const dirMultiplier = isArabic ? -1 : 1;
              const stepX = isMobile ? 85 : 170;

              // 3D Domino calculation: subtle, refined perspective
              const rotateY = prefersReducedMotion || isFocused ? 0 : offset * -12.5 * dirMultiplier;
              const rotateZ = prefersReducedMotion || isFocused ? 0 : offset * -1.6 * dirMultiplier;
              const translateX = offset * stepX * dirMultiplier;
              const translateZ = prefersReducedMotion
                ? 0
                : isFocused
                ? 68
                : -Math.abs(offset) * 76;
              const opacity = Math.abs(offset) > 3 ? 0.18 : 1 - Math.abs(offset) * 0.16;
              const scale = isFocused ? 1.05 : Math.max(0.93 - Math.abs(offset) * 0.04, 0.82);

              return (
                <div
                  key={item.id}
                  className={`domino-card ${isFocused ? "domino-card--active" : ""}`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                    zIndex: 30 - Math.abs(offset),
                    opacity: Math.max(opacity, 0.15),
                  }}
                  onClick={() => handleSelectCard(index)}
                  onPointerEnter={(e) => {
                    e.stopPropagation();
                    handleCardPointerEnter(index);
                  }}
                  onPointerMove={(e) => {
                    e.stopPropagation();
                    if (wrapperRef.current) {
                      const rect = wrapperRef.current.getBoundingClientRect();
                      if (rect.width > 0) {
                        const normX = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
                        targetParallaxXRef.current = (normX - 0.5) * 2;
                        startParallaxLoop();
                      }
                    }
                    handleCardPointerEnter(index);
                  }}
                  onFocus={() => {
                    handleCardPointerEnter(index);
                  }}
                  onBlur={() => {
                    setHoveredIndex(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectCard(index);
                    } else if (e.key === "ArrowRight") {
                      e.preventDefault();
                      const next = isArabic ? Math.max(index - 1, 0) : Math.min(index + 1, DOMINO_ITEMS.length - 1);
                      handleSelectCard(next);
                    } else if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      const prev = isArabic ? Math.min(index + 1, DOMINO_ITEMS.length - 1) : Math.max(index - 1, 0);
                      handleSelectCard(prev);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${item.title[locale]} — ${item.color[locale]}`}
                >
                  <div className="domino-card__frame">
                    <div className="domino-card__image-box">
                      <Image
                        alt={item.alt[locale]}
                        className="domino-card__image"
                        fill
                        priority={index === 0 || index === 1}
                        sizes="(max-width: 640px) 220px, (max-width: 1024px) 300px, 340px"
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

                      {isFocused && (
                        <Link
                          href={`/${locale}/${item.productId}`}
                          className="domino-card__action-btn mono-label"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
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
                className={`domino-dot ${idx === activeVisualIndex ? "domino-dot--active" : ""}`}
                onClick={() => handleSelectCard(idx)}
                type="button"
                role="tab"
                aria-selected={idx === activeVisualIndex}
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
