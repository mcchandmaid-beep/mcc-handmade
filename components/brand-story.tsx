import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface BrandStoryProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function BrandStory({ dictionary, locale }: BrandStoryProps) {
  const isArabic = locale === "ar";
  const s = dictionary.story;

  return (
    <section className="brand-story-section" aria-labelledby="brand-story-title" id="story">
      <div className="brand-story-section__top-bar">
        <span className="mono-label">[ {s.eyebrow} ]</span>
        <span className="mono-label">
          {isArabic ? "دار MCC · إصدار 2026" : "MAISON MCC · ÉDITION 2026"}
        </span>
      </div>

      <div className="brand-story-grid">
        <div className="brand-story-content">
          <h2 id="brand-story-title" className="brand-story-title">
            {s.title}
          </h2>
          <p className="brand-story-subtitle">{s.subtitle}</p>
          <p className="brand-story-text">{s.text}</p>

          <div className="brand-story-specs">
            <div className="brand-story-spec-item">
              <span className="mono-label brand-story-spec-label">
                {isArabic ? "القصة" : "COUPE"}
              </span>
              <span className="brand-story-spec-val">
                {isArabic ? "قصات واسعة ومريحة بحشمة راقية" : "Coupes amples & tombé fluide"}
              </span>
            </div>
            <div className="brand-story-spec-item">
              <span className="mono-label brand-story-spec-label">
                {isArabic ? "الرؤية" : "ALLURE"}
              </span>
              <span className="brand-story-spec-val">
                {isArabic ? "أناقة يومية معاصرة" : "Élégance modeste au quotidien"}
              </span>
            </div>
          </div>

          <div className="brand-story-cta">
            <Link href={`/${locale}/collection`} className="action-btn action-btn--outline">
              <span>{isArabic ? "اكتشفي المجموعة الكاملة" : "DÉCOUVRIR LE VESTIAIRE"}</span>
              <span className="action-btn__arrow" aria-hidden="true">
                {isArabic ? "←" : "→"}
              </span>
            </Link>
          </div>
        </div>

        <div className="brand-story-media">
          <div className="brand-story-image-wrap">
            <Image
              src="/products/model-02/vert-kaki-02.png"
              alt={
                isArabic
                  ? "تفاصيل قماش Scopa وقصة الطقم النسائي بقبعة — MCC Handmade"
                  : "Détails du tombé et du tissu Scopa de l'Ensemble Capuche — MCC Handmade"
              }
              fill
              className="brand-story-image"
              sizes="(max-width: 900px) 100vw, 45vw"
              loading="lazy"
            />
            <div className="brand-story-image-caption mono-label">
              [ {isArabic ? "الموديل 02 · أخضر كاكي" : "MODÈLE 02 · VERT KAKI"} ]
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
