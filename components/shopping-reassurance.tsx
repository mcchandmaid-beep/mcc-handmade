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
              <span>+212 689 532 341</span>
              <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
