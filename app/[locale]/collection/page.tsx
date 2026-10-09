import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allProducts, formatPrice, getLocalizedField } from "@/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n";

interface CollectionPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "fr";
  const dictionary = getDictionary(locale);

  const title = dictionary.meta.collectionTitle || `MCC Handmade — ${dictionary.nav.collection}`;
  const description =
    dictionary.meta.collectionDescription ||
    (locale === "ar"
      ? "المجموعة الدائمة لمخزن MCC Handmade للأزياء المحتشمة المعاصرة. ثلاثة تصاميم أصيلة بصياغة متقنة."
      : "Collection permanente MCC Handmade. Vestiaire modeste contemporain incarné par le Modèle 01, l'Ensemble Capuche et la Robe-Tunique Longue Casual.");

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/collection`,
      languages: {
        fr: "/fr/collection",
        ar: "/ar/collection",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/collection`,
      locale: locale === "ar" ? "ar_AR" : "fr_FR",
      type: "website",
      images: [
        {
          url: "/products/model-01/burgundy-01.png",
          width: 928,
          height: 1695,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/products/model-01/burgundy-01.png"],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const dictionary = getDictionary(locale);
  const isArabic = locale === "ar";

  const breadcrumbs = [
    { name: isArabic ? "الرئيسية" : "Accueil", path: "" },
    { name: dictionary.nav.collection, path: "/collection" },
  ];

  return (
    <main className="collection-page">
      {/* JSON-LD Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((b, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: b.name,
              item: `https://mcc-handmade.vercel.app/${locale}${b.path}`,
            })),
          }),
        }}
      />
      {/* Header Banner */}
      <section className="collection-hero">
        <div className="collection-hero__inner">
          <div className="collection-hero__meta">
            <span className="mono-label eyebrow">
              [ {isArabic ? "المجموعة الدائمة · إصدار 2026" : "COLLECTION PERMANENTE · ÉDITION 2026"} ]
            </span>
            <span className="mono-label">
              {isArabic ? "03 تصاميم أساسية" : "03 PIÈCES FONDATRICES"}
            </span>
          </div>

          <h1 className="collection-hero__title">
            {isArabic ? "المجموعة الكاملة" : "LA COLLECTION"}
          </h1>
          <p className="collection-hero__subtitle">
            {isArabic
              ? "تصاميم خالدة مصاغة بحرفية عالية وحشمة معاصرة، تمنح قواماً مهيباً وراحة طبيعية."
              : "Des silhouettes pensées pour un port altier et une liberté naturelle de mouvement. Tombé souverain et précision d'atelier."}
          </p>
        </div>
      </section>

      {/* Editorial Two-Product Grid */}
      <section className="collection-grid-section" aria-label={dictionary.nav.collection}>
        <div className="collection-grid">
          {allProducts.map((product, idx) => {
            const firstVariant = product.colourVariants[0]!;
            const heroImage = firstVariant.images[0]!;
            const totalVariants = product.colourVariants.length;
            const productNum = String(idx + 1).padStart(2, "0");

            return (
              <article
                key={product.id}
                className="collection-card"
                data-cursor="discover"
              >
                <Link
                  href={`/${locale}/${product.id}`}
                  className="collection-card__media-link"
                  aria-label={`${getLocalizedField(product.name, locale)} — ${formatPrice(product, locale)}`}
                >
                  <div className="collection-card__media">
                    <Image
                      alt={`${getLocalizedField(product.name, locale)} — MCC Handmade`}
                      className="collection-card__image"
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      src={heroImage.src}
                    />
                    <div className="collection-card__media-overlay">
                      <span className="collection-card__view-btn action-btn action-btn--primary">
                        <span>{dictionary.collection.viewDetails}</span>
                        <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
                      </span>
                    </div>

                    <div className="collection-card__badge" aria-hidden="true">
                      <span className="mono-label">[ {productNum} / 03 ]</span>
                    </div>
                  </div>
                </Link>

                <div className="collection-card__info">
                  <div className="collection-card__header">
                    <div>
                      <span className="mono-label collection-card__index-tag">
                        [ {isArabic ? `0${idx + 1} · تصميم أساسي` : `0${idx + 1} · PIÈCE MAÎTRESSE`} ]
                      </span>
                      <h2 className="collection-card__title">
                        <Link href={`/${locale}/${product.id}`}>
                          {getLocalizedField(product.name, locale)}
                        </Link>
                      </h2>
                    </div>
                    <span className="collection-card__price mono-label">
                      {formatPrice(product, locale)}
                    </span>
                  </div>

                  {product.tagline && (
                    <p className="collection-card__tagline">
                      {getLocalizedField(product.tagline, locale)}
                    </p>
                  )}

                  {product.details?.shortDescription && (
                    <p className="collection-card__desc">
                      {getLocalizedField(product.details.shortDescription, locale)}
                    </p>
                  )}

                  <div className="collection-card__specs">
                    <div className="collection-spec-pill">
                      <span className="mono-label">
                        {isArabic ? `${totalVariants} ألوان` : `${totalVariants} TEINTES`}
                      </span>
                    </div>
                    <div className="collection-spec-pill">
                      <span className="mono-label">
                        {product.id === "model-02"
                          ? isArabic ? "3 مقاسات مجمعة" : "TAILLES 1 · 2 · 3"
                          : "S · M · L · XL"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
