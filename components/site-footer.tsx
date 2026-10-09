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
                <Link href={`/${locale}/collection`}>{dictionary.nav.collection}</Link>
              </li>
              <li>
                <Link href={`/${locale}/model-01`}>{dictionary.nav.model01}</Link>
              </li>
              <li>
                <Link href={`/${locale}/model-02`}>{dictionary.nav.model02}</Link>
              </li>
              <li>
                <Link href={`/${locale}/model-03`}>{dictionary.nav.model03}</Link>
              </li>
            </ul>
          </div>

          <div className="editorial-footer__col">
            <span className="mono-label editorial-footer__col-label">
              [ {locale === "ar" ? "الخدمات والتواصل" : "SERVICES & CONTACT"} ]
            </span>
            <ul className="editorial-footer__list">
              <li>
                <Link href={`/${locale}#order-process`}>
                  {locale === "ar" ? "خطوات الطلب" : "Parcours de Commande"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#story`}>
                  {locale === "ar" ? "رؤية الدار" : "Philosophie de Maison"}
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/212689532341"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="editorial-footer__link-item"
                >
                  {locale === "ar" ? "واتساب : 2341 532 689 212+" : "WhatsApp : +212 689 532 341"}
                </a>
              </li>
              <li>
                <Link href={`/${locale}#concierge`}>{dictionary.nav.concierge}</Link>
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
