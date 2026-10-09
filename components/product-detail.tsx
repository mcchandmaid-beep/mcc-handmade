"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product, SizeOption } from "@/data/products";
import { getLocalizedField, formatPrice } from "@/data/products";
import { formatMessage, type Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { WhatsAppOrderModal } from "@/components/whatsapp-order-modal";

interface ProductDetailProps {
  dictionary: Dictionary;
  locale: Locale;
  product: Product;
}

export function ProductDetail({ dictionary, locale, product }: ProductDetailProps) {
  const isArabic = locale === "ar";
  const firstVariant = product.colourVariants[0]!;
  
  const [selectedColourId, setSelectedColourId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState(firstVariant.images[0]!.id);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectionError, setSelectionError] = useState("");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);

  const mainFigureRef = useRef<HTMLElement>(null);

  const selectedVariant = useMemo(
    () => (selectedColourId ? product.colourVariants.find((v) => v.id === selectedColourId) : undefined) ?? firstVariant,
    [firstVariant, product.colourVariants, selectedColourId]
  );

  const selectedImage = useMemo(
    () => selectedVariant.images.find((img) => img.id === selectedImageId) ?? selectedVariant.images[0]!,
    [selectedVariant, selectedImageId]
  );

  const selectedImageIndex = selectedVariant.images.findIndex((img) => img.id === selectedImage.id) + 1;
  const totalVariantImages = selectedVariant.images.length;
  const selectedColourName = selectedColourId ? getLocalizedField(selectedVariant.name, locale) : "";

  // Subtle pointer-responsive micro-movement on desktop (4–8px range, no distortion)
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || prefersReducedMotion) return;

    const figureEl = mainFigureRef.current;
    if (!figureEl) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number | null = null;
    let isHovering = false;

    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      const imgEl = figureEl.querySelector<HTMLImageElement>(".product-gallery__main-image");
      if (imgEl) {
        imgEl.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) scale(1.025)`;
      }

      if (isHovering || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(updatePosition);
      } else {
        rafId = null;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = figureEl.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = Math.max(-6, Math.min(6, nx * 12));
      targetY = Math.max(-6, Math.min(6, ny * 12));

      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const handlePointerEnter = () => {
      isHovering = true;
    };

    const handlePointerLeave = () => {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    figureEl.addEventListener("pointermove", handlePointerMove, { passive: true });
    figureEl.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    figureEl.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      figureEl.removeEventListener("pointermove", handlePointerMove);
      figureEl.removeEventListener("pointerenter", handlePointerEnter);
      figureEl.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  function handleColourSelect(colourId: string) {
    if (colourId === selectedColourId) return;
    const nextVariant = product.colourVariants.find((v) => v.id === colourId);
    if (!nextVariant) return;

    setIsImageTransitioning(true);
    setTimeout(() => {
      setSelectedColourId(nextVariant.id);
      setSelectedImageId(nextVariant.images[0]!.id);
      setIsImageTransitioning(false);
    }, 150);

    if (selectionError) {
      if (!selectedSize) {
        setSelectionError(dictionary.whatsapp.validation.sizeMissing);
      } else {
        setSelectionError("");
      }
    }

    // If active size is unavailable in new variant, safely clear
    if (selectedSize && nextVariant.availabilityBySize[selectedSize.id] === "unavailable") {
      setSelectedSize(null);
    }
  }

  function handleThumbnailSelect(imageId: string) {
    if (imageId === selectedImageId) return;
    setIsImageTransitioning(true);
    setTimeout(() => {
      setSelectedImageId(imageId);
      setIsImageTransitioning(false);
    }, 150);
  }

  function handleSizeSelect(sizeOption: SizeOption) {
    setSelectedSize(sizeOption);
    if (selectionError) {
      if (!selectedColourId) {
        setSelectionError(dictionary.whatsapp.validation.colorMissing);
      } else {
        setSelectionError("");
      }
    }
  }

  function handleOrderClick() {
    const isColorMissing = !selectedColourId;
    const isSizeMissing = !selectedSize;

    if (isColorMissing && isSizeMissing) {
      setSelectionError(dictionary.whatsapp.validation.bothMissing);
      return;
    }
    if (isColorMissing) {
      setSelectionError(dictionary.whatsapp.validation.colorMissing);
      return;
    }
    if (isSizeMissing) {
      setSelectionError(dictionary.whatsapp.validation.sizeMissing);
      return;
    }

    setSelectionError("");
    setIsOrderModalOpen(true);
  }

  const availabilityStatus = selectedSize
    ? selectedVariant.availabilityBySize[selectedSize.id] ?? "unknown"
    : null;

  const isModel02 = product.id === "model-02";

  return (
    <main className="product-page">
      {/* Top Breadcrumb & Navigation */}
      <nav className="product-breadcrumb" aria-label="Fil d'Ariane">
        <div className="product-breadcrumb__inner">
          <Link href={`/${locale}/collection`} className="product-breadcrumb__back">
            <span aria-hidden="true">{isArabic ? "→" : "←"}</span>
            <span>{dictionary.nav.collection}</span>
          </Link>
          <span className="product-breadcrumb__separator" aria-hidden="true">/</span>
          <span className="product-breadcrumb__current">{getLocalizedField(product.name, locale)}</span>
        </div>
      </nav>

      <section className="product-layout" aria-labelledby="product-title">
        {/* Left Column: Adaptive Gallery */}
        <section
          className="product-gallery"
          aria-label={`${selectedColourName} ${dictionary.colour}`}
        >
          <figure className="product-gallery__main" ref={mainFigureRef}>
            <Image
              alt={`${getLocalizedField(product.name, locale)} — ${selectedColourName}, ${formatMessage(dictionary.imageOf, { current: selectedImageIndex, total: totalVariantImages })}`}
              className={`product-gallery__main-image ${isImageTransitioning ? "product-gallery__main-image--transitioning" : ""}`}
              height={selectedImage.height ?? 1600}
              key={selectedImage.id}
              priority
              sizes="(max-width: 900px) 100vw, (max-width: 1440px) 60vw, 840px"
              src={selectedImage.src}
              width={selectedImage.width ?? 1000}
            />
            <figcaption>
              <span>{formatMessage(dictionary.imageOf, { current: selectedImageIndex, total: totalVariantImages })}</span>
              <span className="product-gallery__colour-tag">{selectedColourName}</span>
            </figcaption>
          </figure>

          {/* Thumbnails (only displayed when there is more than 1 image for the active variant) */}
          {totalVariantImages > 1 && (
            <div className="product-gallery__thumbnails" aria-label={dictionary.imageOf}>
              {selectedVariant.images.map((image, index) => (
                <button
                  aria-label={formatMessage(dictionary.showImage, { current: index + 1 })}
                  aria-pressed={image.id === selectedImage.id}
                  className={`thumbnail ${image.id === selectedImage.id ? "thumbnail--selected" : ""}`}
                  key={image.id}
                  onClick={() => handleThumbnailSelect(image.id)}
                  type="button"
                >
                  <Image
                    alt=""
                    height={104}
                    loading="lazy"
                    sizes="76px"
                    src={image.src}
                    width={76}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Editorial Product Panel */}
        <aside className="product-panel">
          <div className="product-panel__meta">
            <span className="mono-label eyebrow">[ MCC HANDMADE · {isArabic ? "المجموعة الدائمة" : "COLLECTION PERMANENTE"} ]</span>
          </div>

          <h1 id="product-title" className="product-title">
            {getLocalizedField(product.name, locale)}
          </h1>

          {product.tagline && (
            <p className="product-tagline">
              {getLocalizedField(product.tagline, locale)}
            </p>
          )}

          {/* Price Display */}
          <div className="product-price-block">
            <span className="product-price-value">
              {formatPrice(product, locale)}
            </span>
          </div>

          {/* Short Description (if present) */}
          {product.details?.shortDescription && (
            <p className="product-short-desc">
              {getLocalizedField(product.details.shortDescription, locale)}
            </p>
          )}

          <div className="variant-controls">
            {/* Colour Variants */}
            <fieldset className="variant-group">
              <legend>
                <span>{dictionary.colour}</span>
                {selectedColourName && (
                  <span className="variant-selection-inline">— {selectedColourName}</span>
                )}
              </legend>
              <div className="variant-options variant-options--colours">
                {product.colourVariants.map((variant) => {
                  const isSelected = variant.id === selectedColourId;
                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`colour-option ${isSelected ? "colour-option--selected" : ""}`}
                      key={variant.id}
                      onClick={() => handleColourSelect(variant.id)}
                      type="button"
                    >
                      <span className="colour-option__indicator" data-colour={variant.id} />
                      <span className="colour-option__label">
                        {getLocalizedField(variant.name, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Sizes (Supports standard S-XL for Model 01 and Grouped Sizes for Model 02) */}
            <fieldset className="variant-group">
              <legend>
                <span>{dictionary.size}</span>
                {selectedSize && (
                  <span className="variant-selection-inline">
                    — {getLocalizedField(selectedSize.label, locale)}
                  </span>
                )}
              </legend>
              <div
                className={`variant-options ${isModel02 ? "variant-options--grouped-sizes" : "variant-options--sizes"}`}
              >
                {product.sizes.map((sizeOption) => {
                  const availability = selectedVariant.availabilityBySize[sizeOption.id];
                  const isUnavailable = availability === "unavailable";
                  const isSelected = selectedSize?.id === sizeOption.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`size-option ${isModel02 ? "size-option--grouped" : ""} ${isSelected ? "size-option--selected" : ""} ${isUnavailable ? "size-option--unavailable" : ""}`}
                      disabled={isUnavailable}
                      key={sizeOption.id}
                      onClick={() => handleSizeSelect(sizeOption)}
                      type="button"
                    >
                      {getLocalizedField(sizeOption.label, locale)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Size selection status indicator */}
            <p className="availability-message" aria-live="polite">
              {selectedSize
                ? getLocalizedField(selectedSize.label, locale)
                : dictionary.selectSize}
            </p>

            {/* WhatsApp Order Action */}
            <div className="product-actions">
              <button
                className="action-btn action-btn--primary product-actions__add-btn"
                onClick={handleOrderClick}
                type="button"
              >
                <span>{dictionary.whatsapp.orderCTA}</span>
                <span className="action-btn__arrow" aria-hidden="true">
                  {isArabic ? "←" : "→"}
                </span>
              </button>

              {selectionError && (
                <p className="product-selection-error" role="alert">
                  {selectionError}
                </p>
              )}
            </div>
          </div>

          {/* Product Detailed Specifications */}
          {product.details && (
            <div className="product-specifications">
              <h2 className="product-specifications__title mono-label">
                [ {dictionary.pdp.detailsTitle} ]
              </h2>

              <div className="specs-table">
                {product.details.style && (
                  <div className="specs-table__row">
                    <span className="specs-table__label mono-label">{dictionary.pdp.style}</span>
                    <p className="specs-table__content">{getLocalizedField(product.details.style, locale)}</p>
                  </div>
                )}

                {product.details.collar && (
                  <div className="specs-table__row">
                    <span className="specs-table__label mono-label">{dictionary.pdp.collar}</span>
                    <p className="specs-table__content">{getLocalizedField(product.details.collar, locale)}</p>
                  </div>
                )}

                {product.details.sleeves && (
                  <div className="specs-table__row">
                    <span className="specs-table__label mono-label">{dictionary.pdp.sleeves}</span>
                    <p className="specs-table__content">{getLocalizedField(product.details.sleeves, locale)}</p>
                  </div>
                )}

                {product.details.fit && (
                  <div className="specs-table__row">
                    <span className="specs-table__label mono-label">{dictionary.pdp.fit}</span>
                    <p className="specs-table__content">{getLocalizedField(product.details.fit, locale)}</p>
                  </div>
                )}

                {product.details.top && (
                  <div className="specs-table__row">
                    <span className="specs-table__label mono-label">{dictionary.pdp.top}</span>
                    <p className="specs-table__content">{getLocalizedField(product.details.top, locale)}</p>
                  </div>
                )}

                {product.details.bottom && (
                  <div className="specs-table__row">
                    <span className="specs-table__label mono-label">{dictionary.pdp.bottom}</span>
                    <p className="specs-table__content">{getLocalizedField(product.details.bottom, locale)}</p>
                  </div>
                )}

                {product.details.material && (
                  <div className="specs-table__row">
                    <span className="specs-table__label mono-label">{dictionary.pdp.material}</span>
                    <p className="specs-table__content">{getLocalizedField(product.details.material, locale)}</p>
                  </div>
                )}

                {product.details.measurements && product.details.measurements.length > 0 && (
                  <div className="specs-table__row specs-table__row--measurements">
                    <span className="specs-table__label mono-label">{dictionary.pdp.measurements}</span>
                    <div className="measurements-grid">
                      {product.details.measurements.map((m, idx) => (
                        <div className="measurement-item" key={idx}>
                          <span className="measurement-item__label">{getLocalizedField(m.label, locale)}</span>
                          <span className="measurement-item__val mono-label">{getLocalizedField(m.value, locale)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </section>

      {/* Reusable WhatsApp Order Flow Modal */}
      {selectedSize && (
        <WhatsAppOrderModal
          dictionary={dictionary}
          isOpen={isOrderModalOpen}
          locale={locale}
          onClose={() => setIsOrderModalOpen(false)}
          product={product}
          selectedSize={selectedSize}
          selectedVariant={selectedVariant}
        />
      )}
    </main>
  );
}
