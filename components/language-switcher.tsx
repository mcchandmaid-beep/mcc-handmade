"use client";

import { usePathname } from "next/navigation";
import { localeCookieName, type Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
}

const localeLabels: Record<Locale, string> = {
  fr: "FR",
  ar: "العربية",
};

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    const nextPath = (pathname || `/${locale}`).replace(/^\/(fr|ar)(?=\/|$)/, `/${nextLocale}`);
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.assign(nextPath);
  }

  return (
    <div className="language-switcher" aria-label={label} dir="ltr">
      {(["fr", "ar"] as const).map((option, index) => (
        <span className="language-switcher__item" key={option}>
          {index > 0 && <span aria-hidden="true">|</span>}
          <button
            aria-pressed={locale === option}
            lang={option}
            type="button"
            onClick={() => changeLocale(option)}
          >
            {localeLabels[option]}
          </button>
        </span>
      ))}
    </div>
  );
}
