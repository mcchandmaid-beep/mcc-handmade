import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { model01, getLocalizedField } from "@/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales, type Locale } from "@/lib/i18n";

interface ProductPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function getProductMetadata(locale: Locale): Metadata {
  const title = `MCC Handmade — ${getLocalizedField(model01.name, locale)}`;

  return {
    title,
    alternates: {
      canonical: `/${locale}/model-01`,
      languages: {
        fr: "/fr/model-01",
        ar: "/ar/model-01",
      },
    },
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale } = await params;
  return getProductMetadata(isLocale(locale) ? locale : "fr");
}

export default async function Model01Page({ params }: ProductPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  return <ProductDetail dictionary={getDictionary(locale)} locale={locale} product={model01} />;
}
