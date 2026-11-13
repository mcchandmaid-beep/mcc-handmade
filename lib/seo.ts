import type { Product } from "@/data/products";
import { getLocalizedField } from "@/data/products";
import type { Locale } from "@/lib/i18n";
import { getPublicBaseUrl, WHATSAPP_NUMBER } from "@/lib/whatsapp";

/**
 * Returns JSON-LD Organization schema for MCC Handmade.
 */
export function getOrganizationSchema() {
  const baseUrl = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "MCC Handmade",
    url: baseUrl,
    logo: `${baseUrl}/mcc-handmade-logo-trimmed.png`,
    description:
      "Maison de mode féminine modeste contemporaine au Maroc. Des tenues alliant élégance moderne, confort et coupes amples.",
    telephone: `+${WHATSAPP_NUMBER}`,
    sameAs: [`https://wa.me/${WHATSAPP_NUMBER}`],
    priceRange: "219 DH - 299 DH",
  };
}

/**
 * Returns JSON-LD WebSite schema.
 */
export function getWebSiteSchema(locale: Locale) {
  const baseUrl = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MCC Handmade",
    url: `${baseUrl}/${locale}`,
    inLanguage: locale === "ar" ? "ar-MA" : "fr-MA",
    publisher: {
      "@type": "Organization",
      name: "MCC Handmade",
    },
  };
}

/**
 * Returns JSON-LD BreadcrumbList schema.
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  locale: Locale
) {
  const baseUrl = getPublicBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}/${locale}${item.path}`,
    })),
  };
}

/**
 * Returns JSON-LD Product schema with Offer in MAD currency.
 * Contains only verified product data.
 */
export function getProductSchema(product: Product, locale: Locale) {
  const baseUrl = getPublicBaseUrl();
  const name = getLocalizedField(product.name, locale);
  const description =
    getLocalizedField(product.details?.shortDescription, locale) ||
    getLocalizedField(product.tagline, locale) ||
    name;

  const images = product.colourVariants.flatMap((variant) =>
    variant.images.map((img) =>
      img.src.startsWith("http") ? img.src : `${baseUrl}${img.src}`
    )
  );

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `MCC Handmade — ${name}`,
    image: images,
    description,
    brand: {
      "@type": "Brand",
      name: "MCC Handmade",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/${locale}/${product.id}`,
      priceCurrency: "MAD",
      price: product.price.amount,
      seller: {
        "@type": "Organization",
        name: "MCC Handmade",
      },
    },
  };
}
