import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { model01, getLocalizedField } from "@/data/products";
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
    ? "الموديل 01 بدلة رياضية نسائية (249 درهم) — MCC Handmade"
    : "Modèle 01 Ensemble sport femme (249 DH) — MCC Handmade";

  const description = isArabic
    ? "بدلة رياضية نسائية محتشمة بقصة عملية وأنيقة. 4 ألوان (بورغندي، أسود، أخضر داكن، أبيض)، مقاسات S إلى XL. طلب مباشر عبر واتساب."
    : "Ensemble sport femme deux pièces en coupe sobre et ample. Allure modeste contemporaine, 4 nuances (Bordeaux, Noir, Vert foncé, Blanc), tailles S à XL. Commande WhatsApp.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/model-01`,
      languages: {
        fr: "/fr/model-01",
        ar: "/ar/model-01",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/model-01`,
      locale: isArabic ? "ar_AR" : "fr_FR",
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

export default async function Model01Page({ params }: ProductPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const dictionary = getDictionary(locale);
  const isArabic = locale === "ar";

  const productSchema = getProductSchema(model01, locale);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: isArabic ? "الرئيسية" : "Accueil", path: "" },
      { name: dictionary.nav.collection, path: "/collection" },
      { name: getLocalizedField(model01.name, locale), path: "/model-01" },
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
      <ProductDetail dictionary={dictionary} locale={locale} product={model01} />
    </>
  );
}
