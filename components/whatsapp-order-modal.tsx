"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product, ColourVariant, SizeOption } from "@/data/products";
import { getLocalizedField } from "@/data/products";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import {
  formatOrderSize,
  buildWhatsAppOrderUrl,
  type WhatsAppOrderPayload,
} from "@/lib/whatsapp";

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant: ColourVariant;
  selectedSize: SizeOption;
  locale: Locale;
  dictionary: Dictionary;
}

export function WhatsAppOrderModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
  selectedSize,
  locale,
  dictionary,
}: WhatsAppOrderModalProps) {
  const isArabic = locale === "ar";
  const [step, setStep] = useState<1 | 2>(1);
  const [customerName, setCustomerName] = useState("");
  const [city, setCity] = useState("");
  const [nameError, setNameError] = useState("");
  const [cityError, setCityError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const t = dictionary.whatsapp;
  const productName = getLocalizedField(product.name, locale);
  const selectedColorName = getLocalizedField(selectedVariant.name, locale);
  const formattedSize = formatOrderSize(product, selectedSize, locale);
  const primaryImage = selectedVariant.images[0] ?? {
    id: "default-img",
    src: "/products/model-01/burgundy-01.png",
    width: 928,
    height: 1695,
  };

  // Reset errors and step when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setNameError("");
      setCityError("");
      setGeneralError("");
      // Lock background scrolling
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus name input
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 60);

      return () => {
        document.body.style.overflow = originalOverflow;
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleContinueToReview(e: React.FormEvent) {
    e.preventDefault();
    let hasError = false;

    if (!customerName.trim()) {
      setNameError(t.validation.nameMissing);
      hasError = true;
    } else {
      setNameError("");
    }

    if (!city.trim()) {
      setCityError(t.validation.cityMissing);
      hasError = true;
    } else {
      setCityError("");
    }

    if (!hasError) {
      setStep(2);
    }
  }

  const payload: WhatsAppOrderPayload = {
    product,
    selectedColorName,
    selectedSizeFormatted: formattedSize,
    customerName: customerName.trim(),
    city: city.trim(),
    locale,
  };

  const whatsappUrl = buildWhatsAppOrderUrl(payload);

  function handleFinalConfirm(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!whatsappUrl) {
      e.preventDefault();
      setGeneralError(t.validation.generationError);
    }
  }

  return (
    <div
      aria-labelledby="order-modal-title"
      aria-modal="true"
      className="order-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div className="order-modal-panel" ref={modalRef}>
        {/* Modal Header */}
        <div className="order-modal-header">
          <div className="order-modal-header__info">
            <span className="mono-label order-modal-eyebrow">
              [ MCC HANDMADE · {step === 1 ? t.stepCustomer : t.stepReview} ]
            </span>
            <h2 id="order-modal-title" className="order-modal-title">
              {t.modalTitle}
            </h2>
          </div>
          <button
            aria-label={t.closeBtn}
            className="order-modal-close-btn"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="order-modal-body">
          {step === 1 ? (
            /* STEP 1: Customer Information */
            <div className="order-step order-step--customer">
              {/* Garment Preview Summary */}
              <div className="order-garment-summary">
                <div className="order-garment-summary__image-wrapper">
                  <Image
                    alt={`${productName} — ${selectedColorName}`}
                    className="order-garment-summary__image"
                    height={primaryImage.height ?? 1600}
                    priority
                    sizes="96px"
                    src={primaryImage.src}
                    width={primaryImage.width ?? 1000}
                  />
                </div>
                <div className="order-garment-summary__details">
                  <h3 className="order-garment-summary__title">{productName}</h3>
                  <div className="order-garment-summary__tags">
                    <span className="order-summary-tag">{selectedColorName}</span>
                    <span className="order-summary-separator">/</span>
                    <span className="order-summary-tag">{formattedSize}</span>
                  </div>
                  <span className="order-garment-summary__price">
                    {product.price.amount} {getLocalizedField(product.price.currency, locale)}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form className="order-form" onSubmit={handleContinueToReview} noValidate>
                {/* Full Name Field */}
                <div className="order-form-group">
                  <label htmlFor="order-customer-name" className="order-form-label">
                    <span>{t.nameLabel}</span>
                    <span className="order-required-mark">*</span>
                  </label>
                  <input
                    autoComplete="name"
                    className={`order-form-input ${nameError ? "order-form-input--error" : ""}`}
                    id="order-customer-name"
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (nameError) setNameError("");
                    }}
                    placeholder={t.namePlaceholder}
                    ref={nameInputRef}
                    type="text"
                    value={customerName}
                  />
                  {nameError && (
                    <p className="order-form-error" role="alert">
                      {nameError}
                    </p>
                  )}
                </div>

                {/* City Field */}
                <div className="order-form-group">
                  <label htmlFor="order-city" className="order-form-label">
                    <span>{t.cityLabel}</span>
                    <span className="order-required-mark">*</span>
                  </label>
                  <input
                    autoComplete="address-level2"
                    className={`order-form-input ${cityError ? "order-form-input--error" : ""}`}
                    id="order-city"
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (cityError) setCityError("");
                    }}
                    placeholder={t.cityPlaceholder}
                    type="text"
                    value={city}
                  />
                  {cityError && (
                    <p className="order-form-error" role="alert">
                      {cityError}
                    </p>
                  )}
                </div>

                <div className="order-form-actions">
                  <button
                    className="action-btn action-btn--primary order-submit-btn"
                    type="submit"
                  >
                    <span>{t.continueBtn}</span>
                    <span className="action-btn__arrow" aria-hidden="true">
                      {isArabic ? "←" : "→"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* STEP 2: Order Review & WhatsApp Confirmation */
            <div className="order-step order-step--review">
              {/* Product Image Confirmation (Sections 4, 5, 14) */}
              <div className="order-confirmation-visual">
                <div className="order-confirmation-image-box">
                  <Image
                    alt={`${productName} — ${selectedColorName}`}
                    className="order-confirmation-image"
                    height={primaryImage.height ?? 1600}
                    priority
                    sizes="(max-width: 640px) 100vw, 420px"
                    src={primaryImage.src}
                    width={primaryImage.width ?? 1000}
                  />
                  <div className="order-confirmation-image-badge mono-label">
                    {selectedColorName}
                  </div>
                </div>
              </div>

              {/* Order Summary Specifications (Section 14 exact format) */}
              <div className="order-summary-box">
                <div className="order-summary-grid">
                  <div className="order-summary-row">
                    <span className="order-summary-label">{t.summaryLabels.product}</span>
                    <span className="order-summary-value">{productName}</span>
                  </div>
                  <div className="order-summary-row">
                    <span className="order-summary-label">{t.summaryLabels.color}</span>
                    <span className="order-summary-value">{selectedColorName}</span>
                  </div>
                  <div className="order-summary-row">
                    <span className="order-summary-label">{t.summaryLabels.size}</span>
                    <span className="order-summary-value">{formattedSize}</span>
                  </div>
                  <div className="order-summary-row">
                    <span className="order-summary-label">{t.summaryLabels.price}</span>
                    <span className="order-summary-value">
                      {product.price.amount} {getLocalizedField(product.price.currency, locale)}
                    </span>
                  </div>
                  <div className="order-summary-row">
                    <span className="order-summary-label">{t.summaryLabels.customer}</span>
                    <span className="order-summary-value">{customerName}</span>
                  </div>
                  <div className="order-summary-row">
                    <span className="order-summary-label">{t.summaryLabels.city}</span>
                    <span className="order-summary-value">{city}</span>
                  </div>
                </div>
              </div>

              {generalError && (
                <p className="order-form-error order-general-error" role="alert">
                  {generalError}
                </p>
              )}

              {/* Actions */}
              <div className="order-review-actions">
                <a
                  className="action-btn action-btn--primary order-confirm-btn"
                  href={whatsappUrl}
                  onClick={handleFinalConfirm}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>{t.confirmCTA}</span>
                  <span className="action-btn__arrow" aria-hidden="true">
                    {isArabic ? "←" : "→"}
                  </span>
                </a>

                <button
                  className="order-back-btn"
                  onClick={() => setStep(1)}
                  type="button"
                >
                  <span aria-hidden="true">{isArabic ? "→" : "←"}</span>
                  <span>{t.backBtn}</span>
                </button>
              </div>

              <p className="order-notice mono-label">
                {t.notice}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
