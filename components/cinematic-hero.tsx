"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getLocalizedField, model01 } from "@/data/products";
import type { ColourVariant } from "@/data/products";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface CinematicHeroProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function CinematicHero({ dictionary, locale }: CinematicHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [selectedVariantId, setSelectedVariantId] = useState(model01.colourVariants[0]!.id);
  const [previousVariantId, setPreviousVariantId] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(true);

  const isArabic = locale === "ar";
  const selectedVariant =
    model01.colourVariants.find((variant) => variant.id === selectedVariantId) ??
    model01.colourVariants[0]!;
  const previousVariant = previousVariantId
    ? model01.colourVariants.find((variant) => variant.id === previousVariantId)
    : undefined;
  const mainImage = selectedVariant.images[0]!;
  const secondaryImage = selectedVariant.images[1] ?? mainImage;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frameId = 0;
    let pointerX = 0;
    let pointerY = 0;

    const updateParallax = () => {
      frameId = 0;
      const bounds = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / bounds.height));

      hero.style.setProperty("--hero-main-x", String(pointerX * -8) + "px");
      hero.style.setProperty("--hero-main-y", String(pointerY * -8 + progress * 10) + "px");
      hero.style.setProperty("--hero-secondary-x", String(pointerX * 12) + "px");
      hero.style.setProperty("--hero-secondary-y", String(pointerY * 14 - progress * 18) + "px");
    };

    const requestParallaxUpdate = () => {
      if (frameId === 0) frameId = window.requestAnimationFrame(updateParallax);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width - 0.5)) * 2;
      pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height - 0.5)) * 2;
      requestParallaxUpdate();
    };

    const handlePointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
      requestParallaxUpdate();
    };

    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate, { passive: true });
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    requestParallaxUpdate();

    return () => {
      window.removeEventListener("scroll", requestParallaxUpdate);
      window.removeEventListener("resize", requestParallaxUpdate);
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, []);

  function handleColourSelect(variant: ColourVariant) {
    if (variant.id === selectedVariantId) return;
    setPreviousVariantId(selectedVariantId);
    setImageReady(false);
    setSelectedVariantId(variant.id);
  }

  function handleCrossfadeEnd() {
    if (imageReady) setPreviousVariantId(null);
  }

  return (
    <section
      aria-labelledby="hero-display-title"
      className="editorial-hero editorial-hero--layered"
      data-image-ready={imageReady}
      data-tone={selectedVariant.id}
      ref={heroRef}
    >
      <div className="editorial-hero__ambient" aria-hidden="true" />

      <div className="hero-utility-bar">
        <span className="mono-label hero-utility-bar__index">[ 01 / 01 ]</span>
        <span className="mono-label hero-utility-bar__season">{dictionary.hero.eyebrow}</span>
        <span className="mono-label hero-utility-bar__spec">{dictionary.hero.metaSpec}</span>
      </div>

      <div className="editorial-hero__canvas">
        <div className="editorial-hero__visual" data-cursor="view">
          <div className="editorial-hero__image-wrapper">
            {previousVariant && (
              <Image
                alt=""
                aria-hidden="true"
                className="editorial-hero__image editorial-hero__image--previous"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 58vw"
                src={previousVariant.images[0]!.src}
              />
            )}
            <Image
              alt={
                getLocalizedField(model01.name, locale) +
                " — " +
                getLocalizedField(selectedVariant.name, locale)
              }
              className={
                "editorial-hero__image editorial-hero__image--current" +
                (imageReady ? " editorial-hero__image--ready" : "")
              }
              fill
              onLoad={() => setImageReady(true)}
              onTransitionEnd={handleCrossfadeEnd}
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
              src={mainImage.src}
            />

            <div className="editorial-hero__secondary-image">
              {previousVariant && (
                <Image
                  alt=""
                  aria-hidden="true"
                  className="editorial-hero__secondary-photo editorial-hero__secondary-photo--previous"
                  fill
                  priority
                  sizes="(max-width: 900px) 34vw, 21vw"
                  src={(previousVariant.images[1] ?? previousVariant.images[0]!).src}
                />
              )}
              <Image
                alt=""
                aria-hidden="true"
                className={
                  "editorial-hero__secondary-photo editorial-hero__secondary-photo--current" +
                  (imageReady ? " editorial-hero__secondary-photo--ready" : "")
                }
                fill
                priority
                sizes="(max-width: 900px) 34vw, 21vw"
                src={secondaryImage.src}
              />
            </div>

            <div className="editorial-hero__image-tag mono-label" aria-hidden="true">
              [ {dictionary.hero.modelTag} ]
            </div>

            <div
              className="editorial-hero__swatches glassmorphism"
              role="group"
              aria-label={dictionary.colour}
            >
              {model01.colourVariants.map((variant) => {
                const colorName = getLocalizedField(variant.name, locale);
                return (
                  <button
                    aria-label={colorName}
                    aria-pressed={variant.id === selectedVariant.id}
                    className={
                      "editorial-hero__swatch" +
                      (variant.id === selectedVariant.id ? " editorial-hero__swatch--selected" : "")
                    }
                    data-colour={variant.id}
                    key={variant.id}
                    onClick={() => handleColourSelect(variant)}
                    title={colorName}
                    type="button"
                  >
                    <span className="colour-option__indicator" data-colour={variant.id} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="editorial-hero__content">
          <div className="editorial-hero__content-inner">
            <p className="mono-label editorial-hero__ref">
              [ {dictionary.reveal.eyebrow} · 2026 ]
            </p>

            <h1 id="hero-display-title" className="editorial-hero__display-title">
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

            <p className="editorial-hero__statement">{dictionary.hero.subtitle}</p>

            <div className="editorial-hero__actions">
              <Link className="action-btn action-btn--primary" href="#collection">
                <span>{dictionary.hero.cta}</span>
                <span className="action-btn__arrow" aria-hidden="true">
                  {isArabic ? "←" : "→"}
                </span>
              </Link>
            </div>
          </div>

          <div className="editorial-hero__meta-footer">
            <span className="mono-label">
              {isArabic ? "أناقة محتشمة معاصرة" : "HAUTE ÉLÉGANCE MODESTE"}
            </span>
            <span className="mono-label">
              {isArabic ? "دار MCC · 2026" : "MAISON MCC · 2026"}
            </span>
          </div>
        </div>
      </div>

      <div className="editorial-hero__scroll-hint">
        <span className="mono-label">[ {dictionary.hero.scrollHint} ↓ ]</span>
      </div>
    </section>
  );
}
