export const locales = ["fr", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";
export const localeCookieName = "mcc-locale";

export const directions: Record<Locale, "ltr" | "rtl"> = {
  fr: "ltr",
  ar: "rtl",
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getDirection(locale: Locale) {
  return directions[locale];
}
