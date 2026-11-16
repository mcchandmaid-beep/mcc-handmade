import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

interface ShoppingReassuranceProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function ShoppingReassurance({ dictionary, locale }: ShoppingReassuranceProps) {
  const isArabic = locale === "ar";
  const r = dictionary.reassurance;

  return (
    <section
      className="reassurance-section"
      aria-labelledby="reassurance-title"
      id="order-process"
    >
      <div className="reassurance-section__top-bar">
        <span className="mono-label">[ {r.eyebrow} ]</span>
        <span className="mono-label">
          {isArabic ? "خدمة مخصصة · واتساب مباشر" : "SERVICE CONCIERGE · WHATSAPP DIRECT"}
        </span>
      </div>

      <div className="reassurance-section__intro reveal-on-scroll">
        <h2 id="reassurance-title" className="reassurance-section__title">
          {r.title}
        </h2>
        <p className="reassurance-section__subtitle">{r.subtitle}</p>
      </div>

      <div className="reassurance-grid">
        {/* Step 1 */}
        <article className="reassurance-card reveal-on-scroll reveal-delay-1">
          <div className="reassurance-card__header">
            <span className="mono-label reassurance-card__step-num">01</span>
            <svg className="reassurance-card__icon" aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
            <span className="reassurance-card__step-badge mono-label">
              {isArabic ? "الموديلات" : "CATALOGUE"}
            </span>
          </div>
          <h3 className="reassurance-card__title">{r.step1Title}</h3>
          <p className="reassurance-card__desc">{r.step1Desc}</p>
          <div className="reassurance-card__link-wrap">
            <Link href={`/${locale}/collection`} className="reassurance-card__link mono-label">
              <span>{isArabic ? "استكشفي الموديلات الثلاثة" : "VOIR LES 3 SILHOUETTES"}</span>
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </Link>
          </div>
        </article>

        {/* Step 2 */}
        <article className="reassurance-card reveal-on-scroll reveal-delay-2">
          <div className="reassurance-card__header">
            <span className="mono-label reassurance-card__step-num">02</span>
            <svg className="reassurance-card__icon" aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>
              <path d="M4 7v10m0-8h4m-4 4h7m-7 4h10m6-10v10M4 12h16" />
            </svg>
            <span className="reassurance-card__step-badge mono-label">
              {isArabic ? "التفاصيل" : "GUIDE MESURES"}
            </span>
          </div>
          <h3 className="reassurance-card__title">{r.step2Title}</h3>
          <p className="reassurance-card__desc">{r.step2Desc}</p>
          <div className="reassurance-card__link-wrap">
            <Link href={`/${locale}/model-02`} className="reassurance-card__link mono-label">
              <span>{isArabic ? "دليل مقاسات الموديل 02" : "EXEMPLE MESURES MODÈLE 02"}</span>
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </Link>
          </div>
        </article>

        {/* Step 3 */}
        <article className="reassurance-card reassurance-card--highlight reveal-on-scroll reveal-delay-3">
          <div className="reassurance-card__header">
            <span className="mono-label reassurance-card__step-num">03</span>
            <svg className="reassurance-card__icon" aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>
              <path d="M4 5.5h16v11H9l-5 3v-14Z" />
              <path d="M8 10h8M8 13h5" />
            </svg>
            <span className="reassurance-card__step-badge mono-label">
              {isArabic ? "واتساب" : "WHATSAPP"}
            </span>
          </div>
          <h3 className="reassurance-card__title">{r.step3Title}</h3>
          <p className="reassurance-card__desc">{r.step3Desc}</p>
          <div className="reassurance-card__link-wrap">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="reassurance-card__link reassurance-card__link--whatsapp mono-label"
            >
              <span dir="ltr" className="inline-block">+212 689 532 341</span>
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </a>
          </div>
        </article>
        <article className="reassurance-card reveal-on-scroll reveal-delay-4">
          <div className="reassurance-card__header">
            <svg className="reassurance-card__icon" aria-hidden="true" viewBox="0 0 24 24" width={24} height={24}>
              <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
              <path d="M4 12h3v6H5a1 1 0 0 1-1-1v-5Zm16 0h-3v6h2a1 1 0 0 0 1-1v-5Z" />
              <path d="M17 18a5 5 0 0 1-5 3h-1" />
            </svg>
            <span className="mono-label reassurance-card__step-badge">{dictionary.nav.concierge}</span>
          </div>
          <h3 className="reassurance-card__title">{dictionary.concierge.title}</h3>
          <p className="reassurance-card__desc">{dictionary.concierge.description}</p>
          <div className="reassurance-card__link-wrap">
            <a className="reassurance-card__link mono-label" href={`mailto:${dictionary.concierge.contactEmail}`}>
              <span>{dictionary.concierge.contactEmail}</span>
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
