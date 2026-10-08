import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface SiteFooterProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function SiteFooter({ dictionary, locale }: SiteFooterProps) {
  return (
    <footer className="editorial-footer">
      <div className="editorial-footer__top-bar">
        <span className="mono-label">[ {locale === "ar" ? "إصدار 2026" : "ÉDITION 2026"} ]</span>
        <span className="mono-label">{locale === "ar" ? "دار MCC · أناقة محتشمة معاصرة" : "MCC HANDMADE · HAUTE ÉLÉGANCE MODESTE"}</span>
        <span className="mono-label">{locale === "ar" ? "دار MCC · 2026" : "MAISON MCC · 2026"}</span>
      </div>

      <div className="editorial-footer__main">
        <div className="editorial-footer__brand-col">
          <h2 className="editorial-footer__brand-title">MCC HANDMADE</h2>
          <p className="editorial-footer__tagline">{dictionary.footer.brandTagline}</p>
          <div className="editorial-footer__lang">
            <LanguageSwitcher label={dictionary.languageSwitcherLabel} locale={locale} />
          </div>
        </div>

        <div className="editorial-footer__nav-cols">
          <div className="editorial-footer__col">
            <span className="mono-label editorial-footer__col-label">
              [ {dictionary.footer.navigationTitle} ]
            </span>
            <ul className="editorial-footer__list">
              <li>
                <Link href={`/${locale}#collection`}>{dictionary.nav.collection}</Link>
              </li>
              <li>
                <Link href={`/${locale}/model-01`}>{dictionary.nav.model01}</Link>
              </li>
              <li>
                <Link href={`/${locale}#statement`}>{dictionary.nav.atelier}</Link>
              </li>
              <li>
                <Link href={`/${locale}#tones`}>{dictionary.nav.tones}</Link>
              </li>
              <li>
                <Link href={`/${locale}#concierge`}>{dictionary.nav.concierge}</Link>
              </li>
            </ul>
          </div>

          <div className="editorial-footer__col">
            <span className="mono-label editorial-footer__col-label">
              [ {dictionary.footer.legalTitle} ]
            </span>
            <ul className="editorial-footer__list">
              <li>
                <span className="editorial-footer__link-item">{dictionary.footer.legalLinks.sizing}</span>
              </li>
              <li>
                <span className="editorial-footer__link-item">{dictionary.footer.legalLinks.shipping}</span>
              </li>
              <li>
                <span className="editorial-footer__link-item">{dictionary.footer.legalLinks.terms}</span>
              </li>
              <li>
                <span className="editorial-footer__link-item">{dictionary.footer.legalLinks.privacy}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="editorial-footer__bottom-bar">
        <p className="editorial-footer__copyright mono-label">
          © {new Date().getFullYear()} {dictionary.footer.rights}
        </p>
        <span className="mono-label">{locale === "ar" ? "أناقة محتشمة · سيادة الخطوط" : "HAUTE ÉLÉGANCE · SOUVERAINETÉ DE LA LIGNE"}</span>
      </div>
    </footer>
  );
}
