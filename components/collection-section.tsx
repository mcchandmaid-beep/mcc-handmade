"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  model01,
  model02,
  model03,
  formatPrice,
  getLocalizedField,
  type Product,
} from "@/data/products";
import { WhatsAppOrderModal } from "@/components/whatsapp-order-modal";
import { formatMessage, type Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface CollectionSectionProps {
  dictionary: Dictionary;
  locale: Locale;
}

interface CollectionPieceCardProps {
  dictionary: Dictionary;
  locale: Locale;
  product: Product;
  index: number;
}

function CollectionPieceCard({
  dictionary,
  locale,
  product,
  index,
}: CollectionPieceCardProps) {
  const isArabic = locale === "ar";
  const firstVariant = product.colourVariants[0]!;
  const [selectedVariantId, setSelectedVariantId] = useState(firstVariant.id);
  const [previewVariantId, setPreviewVariantId] = useState<string | null>(null);
  const [lastPreviewVariantId, setLastPreviewVariantId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMediaHovered, setIsMediaHovered] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const selectedVariant =
    product.colourVariants.find((variant) => variant.id === selectedVariantId) ?? firstVariant;
  const previewVariant = previewVariantId
    ? product.colourVariants.find((variant) => variant.id === previewVariantId)
    : undefined;
  const lastPreviewVariant = lastPreviewVariantId
    ? product.colourVariants.find((variant) => variant.id === lastPreviewVariantId)
    : undefined;
  const selectedImage = selectedVariant.images[activeImageIndex % selectedVariant.images.length]!;
  const previewImage = previewVariant
    ? previewVariant.images[0]!
    : isMediaHovered && selectedVariant.images[1]
      ? selectedVariant.images[1]
      : lastPreviewVariant?.images[0] ?? selectedImage;
  const localizedName = getLocalizedField(product.name, locale);
  const selectedColorName = getLocalizedField(selectedVariant.name, locale);
  const previewColorName = previewVariant ? getLocalizedField(previewVariant.name, locale) : "";
  const indexLabel = String(index + 1).padStart(2, "0");
  const badgeLabel =
    product.id === "model-01"
      ? isArabic
        ? "الموديل 01"
        : "MODÈLE 01"
      : product.id === "model-02"
        ? isArabic
          ? "طقم بقبعة"
          : "ENSEMBLE CAPUCHE"
        : isArabic
          ? "فستان تونك طويل"
          : "ROBE-TUNIQUE";
  const sizeSummary =
    product.id === "model-02"
      ? isArabic
        ? "المقاسات 1 · 2 · 3"
        : "TAILLES 1 · 2 · 3"
      : "S · M · L · XL";

  function selectVariant(variantId: string) {
    setActiveImageIndex(0);
    setSelectedVariantId(variantId);
  }

  function changeImage(direction: -1 | 1) {
    setPreviewVariantId(null);
    setLastPreviewVariantId(null);
    setIsMediaHovered(false);
    setActiveImageIndex((current) => {
      const count = selectedVariant.images.length;
      return (current + direction + count) % count;
    });
  }

  return (
    <article className={"collection-piece-card reveal-on-scroll reveal-delay-" + String(index + 1)}>
      <div
        className="collection-piece-card__media-wrap"
        onMouseEnter={() => setIsMediaHovered(true)}
        onMouseLeave={() => setIsMediaHovered(false)}
      >
        <Link
          href={"/" + locale + "/" + product.id}
          className="collection-piece-card__media-link"
          data-cursor="view"
          aria-label={localizedName + " — " + formatPrice(product, locale)}
        >
          <div className="collection-piece-card__media">
            <Image
              alt={localizedName + " — " + selectedColorName + " — MCC Handmade"}
              aria-hidden={Boolean(previewVariant) || isMediaHovered}
              className="collection-piece-card__image collection-piece-card__image--visible"
              fill
              loading="lazy"
              sizes="(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 25vw"
              src={selectedImage.src}
            />
            <Image
              key={previewImage.id}
              alt={
                previewVariant
                  ? localizedName + " — " + previewColorName + " — MCC Handmade"
                  : isMediaHovered
                    ? localizedName + " — " + selectedColorName + " — MCC Handmade"
                    : ""
              }
              aria-hidden={!previewVariant && !isMediaHovered}
              className={
                "collection-piece-card__image collection-piece-card__image--preview" +
                (previewVariant || isMediaHovered ? " collection-piece-card__image--visible" : "")
              }
              fill
              loading="lazy"
              onTransitionEnd={(event) => {
                if (event.propertyName === "opacity" && !previewVariantId) {
                  setLastPreviewVariantId(null);
                }
              }}
              sizes="(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 25vw"
              src={previewImage.src}
            />
            <div className="collection-piece-card__badge mono-label">
              [ {indexLabel} / 03 · {badgeLabel} ]
            </div>
          </div>
        </Link>

        {selectedVariant.images.length > 1 && (
          <div className="collection-piece-card__image-switchers">
            <button
              aria-label={formatMessage(dictionary.showImage, {
                current: (activeImageIndex - 1 + selectedVariant.images.length) % selectedVariant.images.length + 1,
                total: selectedVariant.images.length,
              })}
              className="collection-piece-card__image-switch collection-piece-card__image-switch--previous"
              onClick={() => changeImage(-1)}
              type="button"
            >
              <span aria-hidden="true">{isArabic ? "→" : "←"}</span>
            </button>
            <button
              aria-label={formatMessage(dictionary.showImage, {
                current: (activeImageIndex + 1) % selectedVariant.images.length + 1,
                total: selectedVariant.images.length,
              })}
              className="collection-piece-card__image-switch collection-piece-card__image-switch--next"
              onClick={() => changeImage(1)}
              type="button"
            >
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </button>
          </div>
        )}

        <button
          aria-label={`${dictionary.whatsapp.orderCTA}: ${localizedName} — ${selectedColorName}`}
          className="collection-piece-card__quick-order"
          onClick={() => setIsOrderModalOpen(true)}
          type="button"
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="collection-piece-card__content">
        <div className="collection-piece-card__meta">
          <span className="mono-label">
            [ {isArabic ? "المجموعة الدائمة" : "COLLECTION PERMANENTE"} ]
          </span>
          <span className="mono-label collection-piece-card__price">
            {formatPrice(product, locale)}
          </span>
        </div>

        <h3 className="collection-piece-card__title">
          <Link href={"/" + locale + "/" + product.id}>{localizedName}</Link>
        </h3>

        <p className="collection-piece-card__tagline">
          {getLocalizedField(product.tagline, locale)}
        </p>

        <div className="collection-piece-card__swatches" role="group" aria-label={dictionary.colour}>
          {product.colourVariants.map((variant) => {
            const colorName = getLocalizedField(variant.name, locale);
            const isSelected = variant.id === selectedVariant.id;
            return (
              <button
                aria-label={colorName}
                aria-pressed={isSelected}
                className={
                  "collection-piece-card__swatch" +
                  (isSelected ? " collection-piece-card__swatch--selected" : "")
                }
                key={variant.id}
                onClick={() => selectVariant(variant.id)}
                onFocus={() => {
                  setLastPreviewVariantId(variant.id);
                  setPreviewVariantId(variant.id);
                }}
                onBlur={() => setPreviewVariantId(null)}
                onMouseEnter={() => {
                  setLastPreviewVariantId(variant.id);
                  setPreviewVariantId(variant.id);
                }}
                onMouseLeave={() => setPreviewVariantId(null)}
                title={colorName}
                type="button"
              >
                <span className="colour-option__indicator" data-colour={variant.id} />
              </button>
            );
          })}
        </div>

        <div className="collection-piece-card__specs">
          <span className="mono-label">
            {product.colourVariants.length} {isArabic ? "ألوان" : "NUANCES"}
          </span>
          <span className="spec-dot" aria-hidden="true">·</span>
          <span className="mono-label">{sizeSummary}</span>
        </div>

        <div className="collection-piece-card__action">
          <Link
            className="action-btn action-btn--outline collection-piece-card__details-btn"
            href={"/" + locale + "/" + product.id}
          >
            <span>{dictionary.collection.viewDetails}</span>
            <span className="action-btn__arrow" aria-hidden="true">
              {isArabic ? "←" : "→"}
            </span>
          </Link>
          <button
            className="action-btn action-btn--primary collection-piece-card__order-btn"
            onClick={() => setIsOrderModalOpen(true)}
            type="button"
          >
            <span>{dictionary.whatsapp.orderCTA}</span>
            <span className="action-btn__arrow" aria-hidden="true">
              {isArabic ? "←" : "→"}
            </span>
          </button>
        </div>
      </div>

      <WhatsAppOrderModal
        dictionary={dictionary}
        isOpen={isOrderModalOpen}
        locale={locale}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
        selectedImage={selectedImage}
        selectedVariant={selectedVariant}
      />
    </article>
  );
}

export function CollectionSection({ dictionary, locale }: CollectionSectionProps) {
  const isArabic = locale === "ar";
  const products = [model01, model02, model03];

  return (
    <section
      aria-labelledby="collection-title"
      className="collection-section"
      id="collection"
    >
      <div className="collection-section__top-bar">
        <span className="mono-label">[ {dictionary.collection.eyebrow} ]</span>
        <span className="mono-label">
          {isArabic ? "المجموعة الدائمة · إصدار 2026" : "COLLECTION PERMANENTE · ÉDITION 2026"}
        </span>
      </div>

      <div className="collection-section__intro reveal-on-scroll">
        <h2 id="collection-title" className="collection-section__main-title">
          {isArabic
            ? "ثلاثة تصاميم. ثلاثة تعبيرات عن الوقار والأناقة."
            : "TROIS SILHOUETTES. TROIS EXPRESSIONS DE L'ALLURE."}
        </h2>
        <p className="collection-section__main-subtitle">
          {isArabic
            ? "يفتتح محترف MCC Handmade تشكيلته الدائمة بثلاثة تصاميم أساسية: الموديل 01 التأسيسي، طقم الكابوش، وفستان التونك الطويل."
            : "L'Atelier MCC Handmade enrichit son vestiaire permanent : le Modèle 01 fondateur, l'Ensemble Capuche et la Robe-Tunique Longue Casual."}
        </p>
      </div>

      <div className="collection-pieces-grid">
        {products.map((product, index) => (
          <CollectionPieceCard
            dictionary={dictionary}
            index={index}
            key={product.id}
            locale={locale}
            product={product}
          />
        ))}
      </div>

      <div className="collection-section__footer">
        <Link className="collection-section__all-link" href={"/" + locale + "/collection"}>
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
