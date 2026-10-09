import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DominoGallery } from "@/components/ui/domino-gallery";
import { EditorialStatement } from "@/components/editorial-statement";
import { AtelierStory } from "@/components/atelier-story";
import { CollectionSection } from "@/components/collection-section";
import { TheFourTones } from "@/components/the-four-tones";
import { ShoppingReassurance } from "@/components/shopping-reassurance";
import { ClientConcierge } from "@/components/client-concierge";
import { model01 } from "@/data/products";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";

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
          alt: dictionary.hero.headline,
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

  const orgSchema = getOrganizationSchema();
  const siteSchema = getWebSiteSchema(locale);

  return (
    <div className="editorial-homepage">
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
      />

      {/* 01. Hero — The Domino Fashion Gallery with Real MCC Photography */}
      <DominoGallery
        locale={locale}
        eyebrow={dictionary.hero.eyebrow}
        headline={dictionary.hero.headline}
        supportingText={dictionary.hero.supporting}
        primaryCtaText={dictionary.hero.primaryCta}
        secondaryCtaText={dictionary.hero.secondaryCta}
      />

      {/* 02. Editorial Statement — Manifesto & House Philosophy */}
      <EditorialStatement dictionary={dictionary} locale={locale} />

      {/* 03. Atelier Story — Multi-Stop Luxury Color Gradient & Foundational Pillars */}
      <AtelierStory dictionary={dictionary} locale={locale} />

      {/* 04. Collection Discovery — The 3 Real Permanent Silhouettes */}
      <div id="collection-preview">
        <CollectionSection dictionary={dictionary} locale={locale} />
      </div>

      {/* 05. The Four Tones — Study of Chromatic Balance */}
      <TheFourTones dictionary={dictionary} locale={locale} product={model01} />

      {/* 06. Shopping Reassurance — 3-Step Verified WhatsApp Order Flow */}
      <ShoppingReassurance dictionary={dictionary} locale={locale} />

      {/* 07. Client Concierge — Atelier Dialogue & Orders */}
      <ClientConcierge dictionary={dictionary} locale={locale} />
    </div>
  );
}
