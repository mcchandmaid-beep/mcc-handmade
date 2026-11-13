import type { Locale } from "@/lib/i18n";
import type { Product, SizeOption } from "@/data/products";
import { getLocalizedField } from "@/data/products";
import { getDictionary } from "@/lib/dictionaries";

/**
 * MCC Handmade — Centralized WhatsApp Configuration
 * Exactly one source of truth without +, spaces, or dashes.
 */
export const WHATSAPP_NUMBER = "212689532341";

/**
 * Verified public deployment domain assigned by Vercel.
 * Active and publicly serving assets while custom domain DNS is pending.
 */
export const VERIFIED_VERCEL_DOMAIN = "https://mcc-handmade.vercel.app";

/**
 * Target custom domain for MCC Handmade.
 * Configurable via NEXT_PUBLIC_SITE_URL when DNS delegation is activated.
 */
export const CUSTOM_DOMAIN = "https://mcchandmade.com";

/**
 * Canonical default public domain.
 * Defaults to the verified active public Vercel deployment while custom domain DNS is inactive.
 */
export const DEFAULT_SITE_URL = VERIFIED_VERCEL_DOMAIN;

/**
 * Validates that a URL points to a local loopback or local port environment.
 */
function isLocalhost(url: string): boolean {
  return /localhost|127\.0\.0\.1|0\.0\.0\.0|::1/i.test(url) || /^https?:\/\/[^/]+:\d+/i.test(url);
}

/**
 * Normalizes a base URL ensuring it has an https:// protocol and no trailing slash.
 */
function normalizeBaseUrl(url: string): string {
  let cleaned = url.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

/**
 * Resolves the canonical public base URL for public assets.
 * 1. Reads NEXT_PUBLIC_SITE_URL (if configured and not localhost)
 * 2. Reads NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL (if on Vercel without custom domain)
 * 3. Reads NEXT_PUBLIC_VERCEL_URL (if on Vercel preview)
 * 4. Falls back to DEFAULT_SITE_URL (verified live Vercel domain https://mcc-handmade.vercel.app)
 */
export function getPublicBaseUrl(): string {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envSiteUrl && !isLocalhost(envSiteUrl)) {
    return normalizeBaseUrl(envSiteUrl);
  }

  const vercelProdUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProdUrl && !isLocalhost(vercelProdUrl)) {
    return normalizeBaseUrl(vercelProdUrl);
  }

  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercelUrl && !isLocalhost(vercelUrl)) {
    return normalizeBaseUrl(vercelUrl);
  }

  return DEFAULT_SITE_URL;
}

/**
 * Generates an absolute URL for a product image.
 * Uses the supplied site origin when creating an order in the browser and the
 * canonical public deployment when called without an origin.
 */
export function getPublicProductImageUrl(imagePath?: string, origin?: string): string {
  if (!imagePath) return "";

  const baseUrl = origin ? normalizeBaseUrl(origin) : getPublicBaseUrl();

  // If already an absolute URL, check if it's localhost or valid
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    if (isLocalhost(imagePath)) {
      try {
        const parsed = new URL(imagePath);
        return `${baseUrl}${parsed.pathname}`;
      } catch {
        return "";
      }
    }
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  const fullUrl = `${baseUrl}${normalizedPath}`;

  // Keep the canonical fallback for server-side calls, while allowing the active
  // browser origin when the order is generated from the current site.
  if (!origin && isLocalhost(fullUrl)) {
    return `${VERIFIED_VERCEL_DOMAIN}${normalizedPath}`;
  }

  return fullUrl;
}

export interface WhatsAppOrderPayload {
  product: Product;
  selectedColorName: string;
  selectedSizeFormatted: string;
  customerName: string;
  city: string;
  imagePath?: string;
  locale: Locale;
}

/**
 * Format size for order review and WhatsApp messages.
 * Critical Rule (Section 15):
 * Model 02 grouped sizes must include the actual grouped size:
 * Taille 1 -> Taille 1 (S/M)
 * Taille 2 -> Taille 2 (L/XL)
 * Taille 3 -> Taille 3 (XXL/XXXL)
 */
export function formatOrderSize(
  product: Product,
  sizeOption: SizeOption,
  locale: Locale
): string {
  if (product.id === "model-02") {
    if (sizeOption.id === "taille-1") {
      return locale === "ar" ? "المقاس 1 (S/M)" : "Taille 1 (S/M)";
    }
    if (sizeOption.id === "taille-2") {
      return locale === "ar" ? "المقاس 2 (L/XL)" : "Taille 2 (L/XL)";
    }
    if (sizeOption.id === "taille-3") {
      return locale === "ar" ? "المقاس 3 (XXL/XXXL)" : "Taille 3 (XXL/XXXL)";
    }
  }
  return getLocalizedField(sizeOption.label, locale);
}

/**
 * Constructs the exact textual message for WhatsApp orders.
 * Includes all customer fields and the clickable public product image URL.
 */
export function buildWhatsAppMessage(payload: WhatsAppOrderPayload, origin?: string): string {
  const {
    product,
    selectedColorName,
    selectedSizeFormatted,
    customerName,
    city,
    imagePath,
    locale,
  } = payload;
  const productName = getLocalizedField(product.name, locale);
  const priceAmount = product.price.amount;
  const absoluteImageUrl = getPublicProductImageUrl(imagePath, origin);
  const { whatsapp } = getDictionary(locale);

  if (locale === "ar") {
    const lines = [
      whatsapp.newOrderTitle,
      "",
      whatsapp.customerDetailsTitle,
      `${whatsapp.summaryLabels.customer} ${customerName}`,
      `${whatsapp.summaryLabels.city} ${city}`,
      "",
      whatsapp.productDetailsTitle,
      `${whatsapp.modelLabel} ${productName}`,
      `${whatsapp.summaryLabels.color} ${selectedColorName}`,
      `${whatsapp.summaryLabels.size} ${selectedSizeFormatted}`,
      `${whatsapp.summaryLabels.price} ${priceAmount} ${getLocalizedField(product.price.currency, locale)}`,
    ];

    if (absoluteImageUrl) {
      lines.push("", `${whatsapp.photoLabel}`, absoluteImageUrl);
    }

    lines.push("", "شكراً لتأكيد طلبي.");
    return lines.join("\n");
  }

  const lines = [
    whatsapp.newOrderTitle,
    "",
    whatsapp.customerDetailsTitle,
    `${whatsapp.summaryLabels.customer} ${customerName}`,
    `${whatsapp.summaryLabels.city} ${city}`,
    "",
    whatsapp.productDetailsTitle,
    `${whatsapp.modelLabel} ${productName}`,
    `${whatsapp.summaryLabels.color} ${selectedColorName}`,
    `${whatsapp.summaryLabels.size} ${selectedSizeFormatted}`,
    `${whatsapp.summaryLabels.price} ${priceAmount} ${getLocalizedField(product.price.currency, locale)}`,
  ];

  if (absoluteImageUrl) {
    lines.push("", `${whatsapp.photoLabel}`, absoluteImageUrl);
  }

  lines.push("", "Merci de confirmer ma commande.");
  return lines.join("\n");
}

/**
 * Generates the WhatsApp click-to-chat URL using wa.me with encodeURIComponent.
 */
export function buildWhatsAppOrderUrl(payload: WhatsAppOrderPayload, origin?: string): string {
  try {
    const message = buildWhatsAppMessage(payload, origin);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  } catch (error) {
    console.error("Failed to generate WhatsApp URL", error);
    return "";
  }
}
