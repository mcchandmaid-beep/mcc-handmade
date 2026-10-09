import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { model02, getLocalizedField } from "@/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/seo";

interface ProductPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "fr";
  const isArabic = locale === "ar";

  const title = isArabic
    ? "الموديل 02 طقم نسائي بقبعة قماش Scopa (299 درهم) — MCC Handmade"
    : "Modèle 02 Ensemble à Capuche Femme Tissu Scopa (299 DH) — MCC Handmade";

  const description = isArabic
    ? "طقم نسائي أنيق بقبعة وقماش Scopa الفاخر. قصة واسعة غير متناظرة، 4 ألوان (بورغندي، أخضر كاكي، أسود، أبيض / أوف وايت)، 3 مقاسات مجمعة. طلب عبر واتساب."
    : "Ensemble femme à capuche en tissu Scopa haut de gamme. Coupe ample et asymétrique, 4 nuances (Bordeaux, Vert kaki, Noir, Blanc / Écru), Tailles 1 à 3. Commande WhatsApp.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/model-02`,
      languages: {
        fr: "/fr/model-02",
        ar: "/ar/model-02",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/model-02`,
      locale: isArabic ? "ar_AR" : "fr_FR",
      type: "website",
      images: [
        {
          url: "/products/model-02/bordeaux-01.png",
          width: 964,
          height: 1632,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/products/model-02/bordeaux-01.png"],
    },
  };
}

export default async function Model02Page({ params }: ProductPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const dictionary = getDictionary(locale);
  const isArabic = locale === "ar";

  const productSchema = getProductSchema(model02, locale);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: isArabic ? "الرئيسية" : "Accueil", path: "" },
      { name: dictionary.nav.collection, path: "/collection" },
      { name: getLocalizedField(model02.name, locale), path: "/model-02" },
    ],
    locale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetail dictionary={dictionary} locale={locale} product={model02} />
    </>
  );
}
