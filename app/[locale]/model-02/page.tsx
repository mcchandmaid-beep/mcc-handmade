import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { model02, getLocalizedField } from "@/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n";

interface ProductPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function getProductMetadata(locale: Locale): Metadata {
  const title = `MCC Handmade — ${getLocalizedField(model02.name, locale)}`;
  const description = getLocalizedField(model02.details?.shortDescription, locale);

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
      images: [
        {
          url: "/products/model-02/bordeaux-01.png",
          width: 964,
          height: 1632,
          alt: title,
        },
      ],
    },
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getProductMetadata(isLocale(locale) ? locale : "fr");
}

export default async function Model02Page({ params }: ProductPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  return <ProductDetail dictionary={getDictionary(locale)} locale={locale} product={model02} />;
}
