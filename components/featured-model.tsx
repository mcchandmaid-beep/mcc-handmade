"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/data/products";
import { getLocalizedField } from "@/data/products";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface FeaturedModelProps {
  dictionary: Dictionary;
  locale: Locale;
  product: Product;
}

export function FeaturedModel({ dictionary, locale, product }: FeaturedModelProps) {
  const [selectedColourId, setSelectedColourId] = useState(product.colourVariants[0]!.id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isArabic = locale === "ar";

  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const swatchesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const selectedIndex = product.colourVariants.findIndex((v) => v.id === selectedColourId);
  const selectedVariant =
    product.colourVariants[selectedIndex] ?? product.colourVariants[0]!;

  const previewImage = selectedVariant.images[0]!;
  const selectedColourName = getLocalizedField(selectedVariant.name, locale);

  const toneMood =
    selectedVariant.id === "burgundy"
      ? dictionary.tones.tonesList.burgundy.mood
      : selectedVariant.id === "black"
      ? dictionary.tones.tonesList.black.mood
      : selectedVariant.id === "dark-green"
      ? dictionary.tones.tonesList.darkGreen.mood
      : dictionary.tones.tonesList.white.mood;

  const paddedIndex = String((selectedIndex >= 0 ? selectedIndex : 0) + 1).padStart(2, "0");

  function handleColorSelect(id: string) {
    if (id === selectedColourId) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedColourId(id);
      setIsTransitioning(false);
    }, 180);
  }

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
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out" },
      });

      // Media reveal
      tl.fromTo(
        mediaRef.current,
        { clipPath: "inset(10% 0% 10% 0%)", opacity: 0.8 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 1.2, ease: "power4.out" }
      );

      tl.fromTo(
        imageRef.current,
        { scale: 1.1 },
        { scale: 1.0, duration: 1.3, ease: "power3.out" },
        "-=1.1"
      );

      // Details typography slide
      tl.fromTo(
        ".model-reveal__title, .model-reveal__subtitle",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
        "-=0.8"
      );

      // Swatches progressive reveal
      const tabs = swatchesRef.current?.querySelectorAll(".model-reveal__swatch-tab");
      if (tabs && tabs.length > 0) {
        tl.fromTo(
          tabs,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.5"
        );
      }

      // Meta & CTA reveal
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isArabic]);

  return (
    <section
      aria-labelledby="model-reveal-title"
      className="model-reveal"
      id="model-01"
      ref={sectionRef}
    >
      {/* Top Hairline Meta Bar */}
      <div className="model-reveal__top-bar">
        <div className="model-reveal__top-left">
          <span className="mono-label">[ {dictionary.reveal.eyebrow} ]</span>
          <span className="mono-label">{isArabic ? "أناقة محتشمة معاصرة" : "HAUTE ÉLÉGANCE MODESTE"}</span>
        </div>
        <div className="model-reveal__top-right">
          <span className="mono-label">[ {paddedIndex} / 04 ]</span>
        </div>
      </div>

      {/* Main Photographic Bridge Layout */}
      <div className="model-reveal__grid">
        {/* Large Architectural Portrait */}
        <div
          className="model-reveal__media"
          data-cursor="view"
          ref={mediaRef}
        >
          <div className="model-reveal__media-inner">
            <Image
              alt={`${getLocalizedField(product.name, locale)} — ${selectedColourName}`}
              className={`model-reveal__image ${isTransitioning ? "model-reveal__image--fading" : ""}`}
              height={previewImage.height ?? 1600}
              key={previewImage.src}
              loading="lazy"
              ref={imageRef}
              sizes="(max-width: 900px) 100vw, (max-width: 1440px) 60vw, 860px"
              src={previewImage.src}
              width={previewImage.width ?? 1000}
            />
            <div className="model-reveal__tag" aria-hidden="true">
              <span className="mono-label">[ {selectedColourName} · {previewImage.id} ]</span>
            </div>
          </div>
        </div>

        {/* Narrative & Tabular Swatches Column */}
        <div className="model-reveal__details" ref={detailsRef}>
          <div className="model-reveal__details-header">
            <h2 id="model-reveal-title" className="model-reveal__title">
              {getLocalizedField(product.name, locale)}
            </h2>
            <p className="model-reveal__subtitle">
              {dictionary.reveal.descriptor}
            </p>
          </div>

          {/* Color Tabs (Exhibition Style) */}
          <div className="model-reveal__swatches-block">
            <p className="mono-label model-reveal__swatches-title">
              {dictionary.reveal.paletteLabel}
            </p>

            <div
              aria-label={dictionary.colour}
              className="model-reveal__swatches-list"
              ref={swatchesRef}
              role="group"
            >
              {product.colourVariants.map((variant, index) => {
                const isSelected = variant.id === selectedColourId;
                const localizedName = getLocalizedField(variant.name, locale);
                const itemIndex = String(index + 1).padStart(2, "0");

                return (
                  <button
                    aria-pressed={isSelected}
                    className={`model-reveal__swatch-tab ${isSelected ? "model-reveal__swatch-tab--active" : ""}`}
                    data-cursor="tone"
                    data-cursor-text={itemIndex}
                    key={variant.id}
                    onClick={() => handleColorSelect(variant.id)}
                    onMouseEnter={() => handleColorSelect(variant.id)}
                    onFocus={() => handleColorSelect(variant.id)}
                    type="button"
                  >
                    <span className="mono-label model-reveal__swatch-num">0{index + 1}</span>
                    <span className={`model-reveal__swatch-pip model-reveal__swatch-pip--${variant.id}`} aria-hidden="true" />
                    <span className="model-reveal__swatch-name">{localizedName}</span>
                    <span className="model-reveal__swatch-status mono-label" aria-hidden="true">
                      {isSelected ? "●" : "○"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tone Metadata & Call to Action */}
          <div className="model-reveal__active-meta" ref={ctaRef}>
            <div className="model-reveal__mood-row">
              <span className="mono-label">{isArabic ? "اللون المختار :" : "NUANCE ACTIVE :"}</span>
              <span className="mono-label model-reveal__mood-val">
                {selectedColourName} — {toneMood}
              </span>
            </div>

            <div className="model-reveal__cta-wrap">
              <Link
                className="action-btn action-btn--primary"
                data-cursor="discover"
                href={`/${locale}/model-01`}
              >
                <span>{dictionary.reveal.viewProduct}</span>
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
