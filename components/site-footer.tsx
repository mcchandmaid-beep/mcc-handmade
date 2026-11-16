import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { NewsletterSignup } from "@/components/newsletter-signup";
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
          <Link className="editorial-footer__brand-mark" href={`/${locale}`} aria-label="MCC Handmade">
            <Image alt="MCC Handmade" height={44} src="/mcc-handmade-logo-trimmed.png" width={144} />
          </Link>
          <p className="editorial-footer__tagline">{dictionary.footer.brandTagline}</p>
          <div className="editorial-footer__social" aria-label={dictionary.nav.concierge}>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label={dictionary.nav.concierge}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width={20} height={20}>
                <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
                <path d="M9 8.5c.5 2.5 2 4 4.5 4.5" />
              </svg>
            </a>
            <a href={`mailto:${dictionary.concierge.contactEmail}`} aria-label={dictionary.concierge.contactEmailLabel}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width={20} height={20}>
                <rect x="3.5" y="5.5" width="17" height="13" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          </div>
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
                  {locale === "ar" ? <>واتساب : <span dir="ltr" className="inline-block">+212 689 532 341</span></> : "WhatsApp : +212 689 532 341"}
                </a>
              </li>
              <li>
                <Link href={`/${locale}#order-process`}>{dictionary.nav.concierge}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="editorial-footer__contact-col">
          <span className="mono-label editorial-footer__col-label">
            [ {dictionary.footer.conciergeTitle} ]
          </span>
          <h2 className="footer-newsletter__title">{dictionary.concierge.title}</h2>
          <p className="footer-newsletter__subtitle">{dictionary.concierge.description}</p>
          <a className="editorial-footer__contact-link" href={`mailto:${dictionary.concierge.contactEmail}`}>
            {dictionary.concierge.contactEmail}
          </a>
          <a className="editorial-footer__contact-link" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            <span dir="ltr" className="inline-block">+212 689 532 341</span>
          </a>
          <NewsletterSignup dictionary={dictionary} locale={locale} />
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
