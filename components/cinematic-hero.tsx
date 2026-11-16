"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { getLocalizedField, model01 } from "@/data/products";
import type { ColourVariant } from "@/data/products";
import { formatMessage, type Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface CinematicHeroProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function CinematicHero({ dictionary, locale }: CinematicHeroProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(model01.colourVariants[0]!.id);
  const [previousVariantId, setPreviousVariantId] = useState<string | null>(null);
  const [imageReady, setImageReady] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const isArabic = locale === "ar";

  const selectedVariant =
    model01.colourVariants.find((variant) => variant.id === selectedVariantId) ??
    model01.colourVariants[0]!;
  const previousVariant = previousVariantId
    ? model01.colourVariants.find((variant) => variant.id === previousVariantId)
    : undefined;
  const mainImage = selectedVariant.images[1] ?? selectedVariant.images[0]!;

  function selectVariant(variant: ColourVariant) {
    if (variant.id === selectedVariantId) return;
    setPreviousVariantId(selectedVariantId);
    setImageReady(false);
    setSelectedVariantId(variant.id);
  }

  function cycleVariant(direction: -1 | 1) {
    const currentIndex = model01.colourVariants.findIndex(
      (variant) => variant.id === selectedVariantId,
    );
    const nextIndex =
      (currentIndex + direction + model01.colourVariants.length) %
      model01.colourVariants.length;
    selectVariant(model01.colourVariants[nextIndex]!);
  }

  useEffect(() => {
    if (model01.colourVariants.length < 2) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      setPreviousVariantId(selectedVariantId);
      setImageReady(false);
      setSelectedVariantId((currentId) => {
        const currentIndex = model01.colourVariants.findIndex(
          (variant) => variant.id === currentId,
        );
        return model01.colourVariants[(currentIndex + 1) % model01.colourVariants.length]!.id;
      });
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [selectedVariantId]);

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;

    const deltaX = event.changedTouches[0]!.clientX - startX;
    if (Math.abs(deltaX) < 48) return;

    const direction = (deltaX < 0 ? 1 : -1) * (isArabic ? -1 : 1);
    cycleVariant(direction as -1 | 1);
  }

  return (
    <section
      aria-labelledby="hero-display-title"
      className="editorial-hero editorial-hero--layered"
      data-image-ready={imageReady}
      data-locale={locale}
      id="home-hero"
    >
      <div className="editorial-hero__canvas">
        <div className="editorial-hero__visual">
          <div
            className="editorial-hero__image-wrapper"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              alt=""
              aria-hidden="true"
              className="editorial-hero__image editorial-hero__image--desktop"
              fill
              priority
              sizes="100vw"
              src="/images/hero-desktop.jpg"
            />
            {previousVariant && (
              <Image
                alt=""
                aria-hidden="true"
                className="editorial-hero__image editorial-hero__image--mobile editorial-hero__image--previous"
                fill
                priority
                sizes="100vw"
                src={previousVariant.images[0]!.src}
              />
            )}
            <Image
              alt={`${getLocalizedField(model01.name, locale)} — ${getLocalizedField(selectedVariant.name, locale)}`}
              className="editorial-hero__image editorial-hero__image--mobile editorial-hero__image--current"
              fill
              onLoad={() => setImageReady(true)}
              onTransitionEnd={() => {
                if (imageReady) setPreviousVariantId(null);
              }}
              priority
              sizes="100vw"
              src={mainImage.src}
            />
          </div>
        </div>

        <div className="hero-utility-bar mono-label" aria-hidden="true">
          <span>{dictionary.hero.eyebrow}</span>
          <span>{dictionary.hero.metaSpec}</span>
        </div>

        <div className="editorial-hero__content">
          <div className="editorial-hero__content-inner">
            <p className="mono-label editorial-hero__ref">{dictionary.hero.eyebrow}</p>
            <h1 id="hero-display-title" className="editorial-hero__display-title">
              {isArabic ? (
                dictionary.hero.headline
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

            <div
              className="editorial-hero__swatches"
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
                    key={variant.id}
                    onClick={() => selectVariant(variant)}
                    title={colorName}
                    type="button"
                  >
                    <span className="colour-option__indicator" data-colour={variant.id} />
                  </button>
                );
              })}
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

        <div className="editorial-hero__pagination" role="group" aria-label={dictionary.colour}>
          {model01.colourVariants.map((variant, index) => (
            <button
              aria-label={formatMessage(dictionary.showImage, {
                current: index + 1,
                total: model01.colourVariants.length,
              })}
              aria-pressed={variant.id === selectedVariant.id}
              className="editorial-hero__pagination-dot"
              key={variant.id}
              onClick={() => selectVariant(variant)}
              type="button"
            >
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>

      <button
        aria-label={dictionary.hero.scrollHint}
        className="hero-scroll-button"
        onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 4v15m0 0-6-6m6 6 6-6" />
        </svg>
      </button>
    </section>
  );
}
