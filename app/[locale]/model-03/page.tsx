import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { model03, getLocalizedField } from "@/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n";

interface ProductPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function getProductMetadata(locale: Locale): Metadata {
  const title = `MCC Handmade — ${getLocalizedField(model03.name, locale)}`;
  const description = getLocalizedField(model03.details?.shortDescription, locale);

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
      images: [
        {
          url: "/products/model-03/blanc-casse-01.png",
          width: 1039,
          height: 1513,
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

export default async function Model03Page({ params }: ProductPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  return <ProductDetail dictionary={getDictionary(locale)} locale={locale} product={model03} />;
}
