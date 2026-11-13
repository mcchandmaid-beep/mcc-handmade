"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { getLocalizedField } from "@/data/products";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface TheFourTonesProps {
  dictionary: Dictionary;
  locale: Locale;
  product: Product;
}

export function TheFourTones({ dictionary, locale, product }: TheFourTonesProps) {
  const [hoveredToneId, setHoveredToneId] = useState<string | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const isArabic = locale === "ar";

  const handleMobileScroll = () => {
    const el = gridRef.current;
    if (!el) return;
    const scrollLeft = Math.abs(el.scrollLeft);
    const itemWidth = el.clientWidth * 0.82;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveMobileIndex(Math.max(0, Math.min(product.colourVariants.length - 1, index)));
  };

  return (
    <section
      aria-labelledby="tones-title"
      className="four-tones-exhibition"
      id="tones"
    >
      {/* Top Hairline Header */}
      <div className="four-tones-exhibition__top-bar reveal-on-scroll">
        <div className="four-tones-exhibition__top-left">
          <span className="mono-label">[ {dictionary.tones.eyebrow} ]</span>
          <h2 id="tones-title" className="four-tones-exhibition__title">
            {dictionary.tones.title}
          </h2>
        </div>
        <div className="four-tones-exhibition__top-right">
          <span className="mono-label">{dictionary.tones.subtitle}</span>
        </div>
      </div>

      {/* 4-Column Interactive Exhibition (Desktop Accordion Expansion & Mobile Snap) */}
      <div
        className={`four-tones-exhibition__grid reveal-on-scroll ${hoveredToneId ? "four-tones-exhibition__grid--has-hover" : ""}`}
        onMouseLeave={() => setHoveredToneId(null)}
        onScroll={handleMobileScroll}
        ref={gridRef}
      >
        {product.colourVariants.map((variant, index) => {
          const localizedName = getLocalizedField(variant.name, locale);
          const image = variant.images[0]!;
          const toneMood =
            variant.id === "burgundy"
              ? dictionary.tones.tonesList.burgundy.mood
              : variant.id === "black"
              ? dictionary.tones.tonesList.black.mood
              : variant.id === "dark-green"
              ? dictionary.tones.tonesList.darkGreen.mood
              : dictionary.tones.tonesList.white.mood;

          const numStr = String(index + 1).padStart(2, "0");
          const isHovered = hoveredToneId === variant.id;
          const isDimmed = hoveredToneId !== null && !isHovered;

          return (
            <article
              className={`tone-column ${isHovered ? "tone-column--active" : ""} ${isDimmed ? "tone-column--dimmed" : ""}`}
              data-cursor="tone"
              data-cursor-text={numStr}
              key={variant.id}
              onMouseEnter={() => setHoveredToneId(variant.id)}
              onFocus={() => setHoveredToneId(variant.id)}
              onBlur={() => setHoveredToneId(null)}
            >
              <Link
                aria-label={`${localizedName} — ${toneMood}`}
                className="tone-column__link"
                href={`/${locale}/model-01`}
              >
                {/* Image Frame */}
                <div className="tone-column__media">
                  <Image
                    alt={`${getLocalizedField(product.name, locale)} — ${localizedName}`}
                    className="tone-column__image tone-column__image--primary"
                    height={image.height ?? 1600}
                    loading="lazy"
                    sizes="(max-width: 800px) 85vw, (max-width: 1200px) 50vw, 35vw"
                    src={image.src}
                    width={image.width ?? 1000}
                  />
                  {variant.images[1] && (
                    <Image
                      alt={`${getLocalizedField(product.name, locale)} — ${localizedName} (Détail)`}
                      className={`tone-column__image tone-column__image--secondary ${isHovered ? "tone-column__image--visible" : ""}`}
                      height={variant.images[1].height ?? 1600}
                      loading="lazy"
                      sizes="(max-width: 800px) 85vw, (max-width: 1200px) 50vw, 35vw"
                      src={variant.images[1].src}
                      width={variant.images[1].width ?? 1000}
                    />
                  )}
                  <div className="tone-column__media-tag" aria-hidden="true">
                    <span className="mono-label">[{numStr}]</span>
                  </div>
                </div>

                {/* Metadata Overlay / Caption */}
                <div className="tone-column__meta">
                  <div className="tone-column__header">
                    <span className="mono-label tone-column__index">0{index + 1}</span>
                    <h3 className="tone-column__name">{localizedName}</h3>
                  </div>
                  <p className="tone-column__mood">{toneMood}</p>
                  <div className="tone-column__action">
                    <span className="mono-label tone-column__action-text">
                      {dictionary.tones.exploreTone}
                    </span>
                    <span className="tone-column__arrow" aria-hidden="true">
                      {isArabic ? "←" : "→"}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>

      {/* Mobile Active Slide Progress Indicator */}
      <div className="four-tones-exhibition__mobile-bar">
        <div className="four-tones-exhibition__progress-track">
          {product.colourVariants.map((variant, idx) => (
            <span
              className={`four-tones-exhibition__progress-pill ${idx === activeMobileIndex ? "four-tones-exhibition__progress-pill--active" : ""}`}
              key={variant.id}
            />
          ))}
        </div>
        <span className="mono-label">[ 0{activeMobileIndex + 1} / 04 ]</span>
      </div>
    </section>
  );
}
