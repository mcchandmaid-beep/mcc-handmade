"use client";

import { usePathname } from "next/navigation";
import { localeCookieName, type Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
}

const localesConfig: ReadonlyArray<{ code: Locale; label: string; ariaLabel: string }> = [
  { code: "fr", label: "FR", ariaLabel: "Version française" },
  { code: "ar", label: "العربية", ariaLabel: "النسخة العربية" },
];

export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const pathname = usePathname();

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    const nextPath = (pathname || `/${locale}`).replace(/^\/(fr|ar)(?=\/|$)/, `/${nextLocale}`);
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.assign(nextPath);
  }

  return (
    <div
      className="lang-segmented"
      aria-label={label}
      role="group"
      dir="ltr"
    >
      {localesConfig.map((item) => {
        const isActive = locale === item.code;
        return (
          <button
            key={item.code}
            aria-pressed={isActive}
            aria-label={item.ariaLabel}
            className={`lang-segmented__btn ${isActive ? "lang-segmented__btn--active" : ""}`}
            lang={item.code}
            onClick={() => changeLocale(item.code)}
            type="button"
          >
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
