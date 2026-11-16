import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandStory } from "@/components/brand-story";
import { CollectionSection } from "@/components/collection-section";
import { CinematicHero } from "@/components/cinematic-hero";
import { ShoppingReassurance } from "@/components/shopping-reassurance";
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
          url: "/images/hero-desktop.jpg",
          width: 2752,
          height: 1536,
          alt: dictionary.hero.headline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.homeTitle,
      description: dictionary.meta.homeDescription,
      images: ["/images/hero-desktop.jpg"],
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

      <CinematicHero dictionary={dictionary} locale={locale} />

      <CollectionSection dictionary={dictionary} locale={locale} />

      <section className="brand-marquee" aria-label={dictionary.brandMarquee}>
        <p className="brand-marquee__accessibility-text">{dictionary.brandMarquee}</p>
        <div className="brand-marquee__viewport" aria-hidden="true">
          <div className="brand-marquee__track">
            <span>{dictionary.brandMarquee}</span>
            <span>{dictionary.brandMarquee}</span>
          </div>
        </div>
      </section>

      <BrandStory dictionary={dictionary} locale={locale} />
      <ShoppingReassurance dictionary={dictionary} locale={locale} />
    </div>
  );
}
