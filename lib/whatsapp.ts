import type { Locale } from "@/lib/i18n";
import type { Product, SizeOption } from "@/data/products";
import { getLocalizedField } from "@/data/products";

/**
 * MCC Handmade — Centralized WhatsApp Configuration
 * Exactly one source of truth without +, spaces, or dashes.
 */
export const WHATSAPP_NUMBER = "212689532341";

export interface WhatsAppOrderPayload {
  product: Product;
  selectedColorName: string;
  selectedSizeFormatted: string;
  customerName: string;
  city: string;
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
 * Follows Section 17 (FR) and Section 18 (AR) with exact line breaks and formatting.
 */
export function buildWhatsAppMessage(payload: WhatsAppOrderPayload): string {
  const { product, selectedColorName, selectedSizeFormatted, customerName, city, locale } = payload;
  const productName = getLocalizedField(product.name, locale);
  const priceAmount = product.price.amount;

  if (locale === "ar") {
    return [
      "مرحباً MCC Handmade 👋",
      "",
      "أرغب في تأكيد طلب:",
      "",
      `المنتج: ${productName}`,
      `اللون: ${selectedColorName}`,
      `المقاس: ${selectedSizeFormatted}`,
      `الثمن: ${priceAmount} درهم`,
      "",
      `الاسم الكامل: ${customerName}`,
      `المدينة: ${city}`,
      "",
      "شكراً لتأكيد طلبي.",
    ].join("\n");
  }

  return [
    "Bonjour MCC Handmade 👋",
    "",
    "Je souhaite passer une commande :",
    "",
    `Produit : ${productName}`,
    `Couleur : ${selectedColorName}`,
    `Taille : ${selectedSizeFormatted}`,
    `Prix : ${priceAmount} DH`,
    "",
    `Nom complet : ${customerName}`,
    `Ville : ${city}`,
    "",
    "Merci de confirmer ma commande.",
  ].join("\n");
}

/**
 * Generates the WhatsApp click-to-chat URL using wa.me with encodeURIComponent.
 */
export function buildWhatsAppOrderUrl(payload: WhatsAppOrderPayload): string {
  try {
    const message = buildWhatsAppMessage(payload);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  } catch (error) {
    console.error("Failed to generate WhatsApp URL", error);
    return "";
  }
}
