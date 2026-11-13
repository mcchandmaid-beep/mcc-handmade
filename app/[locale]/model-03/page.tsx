import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { model03, getLocalizedField } from "@/data/products";
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
    ? "الموديل 03 فستان تونك طويل كاجوال نسائي (219 درهم) — MCC Handmade"
    : "Modèle 03 Robe-Tunique Longue Casual Femme (219 DH) — MCC Handmade";

  const description = isArabic
    ? "فستان تونك طويل كاجوال أنيق وعملي. ياقة مرتفعة بأزرار، أكمام قابلة للطي، وجيوب عملية. 3 ألوان (أوف وايت، أخضر كاكي، بني)، مقاسات S إلى XL (219 درهم)."
    : "Robe-tunique longue casual chic pour femme. Col montant boutonné, manches ajustables, coupe ample et poches pratiques. 3 nuances (Blanc cassé, Vert kaki, Marron), tailles S à XL (219 DH).";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/model-03`,
      languages: {
        fr: "/fr/model-03",
        ar: "/ar/model-03",
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/model-03`,
      locale: isArabic ? "ar_AR" : "fr_FR",
      type: "website",
      images: [
        {
          url: "/products/model-03/blanc-casse-01.png",
          width: 1039,
          height: 1513,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/products/model-03/blanc-casse-01.png"],
    },
  };
}

export default async function Model03Page({ params }: ProductPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const dictionary = getDictionary(locale);
  const isArabic = locale === "ar";

  const productSchema = getProductSchema(model03, locale);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: isArabic ? "الرئيسية" : "Accueil", path: "" },
      { name: dictionary.nav.collection, path: "/collection" },
      { name: getLocalizedField(model03.name, locale), path: "/model-03" },
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
      <ProductDetail dictionary={dictionary} locale={locale} product={model03} />
    </>
  );
}
