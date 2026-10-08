import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CinematicHero } from "@/components/cinematic-hero";
import { EditorialStatement } from "@/components/editorial-statement";
import { FeaturedModel } from "@/components/featured-model";
import { TheFourTones } from "@/components/the-four-tones";
import { SculpturalMoment } from "@/components/sculptural-moment";
import { EditorialDiptych } from "@/components/editorial-diptych";
import { CollectionSection } from "@/components/collection-section";
import { ClientConcierge } from "@/components/client-concierge";
import { model01 } from "@/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : "fr";
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.meta.homeTitle,
    description: dictionary.meta.homeDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        ar: "/ar",
      },
    },
    openGraph: {
      title: dictionary.meta.homeTitle,
      description: dictionary.meta.homeDescription,
      url: `/${locale}`,
      locale: locale === "ar" ? "ar_AR" : "fr_FR",
      type: "website",
      images: [
        {
          url: "/products/model-01/burgundy-01.png",
          width: 928,
          height: 1695,
          alt: dictionary.hero.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.homeTitle,
      description: dictionary.meta.homeDescription,
      images: ["/products/model-01/burgundy-01.png"],
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const dictionary = getDictionary(locale);

  return (
    <div className="editorial-homepage">
      {/* 01. Hero — Dominant Photography & Architectural Type Sequence */}
      <CinematicHero dictionary={dictionary} locale={locale} />

      {/* 02. Editorial Statement — Typographic Pause in Warm Sand */}
      <EditorialStatement dictionary={dictionary} locale={locale} />

      {/* 03. Model 01 Reveal — Large Interactive Product Canvas */}
      <FeaturedModel dictionary={dictionary} locale={locale} product={model01} />

      {/* 04. Four Tones — Interactive Exhibition & Viewport Dominance */}
      <TheFourTones dictionary={dictionary} locale={locale} product={model01} />

      {/* 05. Signature Digital Moment — Kinetic Drape Sculpture */}
      <SculpturalMoment locale={locale} />

      {/* 06. Editorial Image Story — Asymmetric Parallax Diptych */}
      <EditorialDiptych dictionary={dictionary} locale={locale} />

      {/* 07. Collection — Single-Piece Atelier Showcase */}
      <CollectionSection dictionary={dictionary} locale={locale} />

      {/* 08. Client Concierge — Private Atelier Dialogue */}
      <ClientConcierge dictionary={dictionary} locale={locale} />
    </div>
  );
}
