import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { getLocalizedField } from "@/data/products";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface CuratedDiscoveryProps {
  dictionary: Dictionary;
  locale: Locale;
  products: readonly Product[];
}

export function CuratedDiscovery({ dictionary, locale, products }: CuratedDiscoveryProps) {
  return (
    <section className="curated-discovery" aria-labelledby="discovery-title">
      <div className="curated-discovery__inner">
        <header className="curated-discovery__header">
          <p className="eyebrow">{dictionary.discovery.eyebrow}</p>
          <h2 id="discovery-title" className="curated-discovery__title">
            {dictionary.discovery.title}
          </h2>
          <p className="curated-discovery__subtitle">{dictionary.discovery.subtitle}</p>
        </header>

        <div className="curated-discovery__grid">
          {products.map((product) => {
            const primaryVariant = product.colourVariants[0]!;
            const primaryImage = primaryVariant.images[0]!;
            const localizedName = getLocalizedField(product.name, locale);

            return (
              <article className="discovery-card" key={product.id}>
                <Link
                  className="discovery-card__link"
                  href={`/${locale}/${product.id}`}
                  aria-label={`${localizedName} — ${dictionary.discovery.viewDetails}`}
                >
                  <figure className="discovery-card__figure">
                    <div className="discovery-card__media">
                      <Image
                        alt={localizedName}
                        className="discovery-card__image"
                        height={primaryImage.height ?? 1600}
                        loading="lazy"
                        sizes="(max-width: 800px) 100vw, (max-width: 1440px) 50vw, 600px"
                        src={primaryImage.src}
                        width={primaryImage.width ?? 1000}
                      />
                      <span className="discovery-card__badge">{dictionary.discovery.badge}</span>
                    </div>

                    <figcaption className="discovery-card__caption">
                      <div className="discovery-card__main-info">
                        <h3 className="discovery-card__name">{localizedName}</h3>
                        <div className="discovery-card__swatches" aria-label={dictionary.colour}>
                          {product.colourVariants.map((variant) => (
                            <span
                              className={`discovery-card__swatch discovery-card__swatch--${variant.id}`}
                              key={variant.id}
                              title={getLocalizedField(variant.name, locale)}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="discovery-card__cta">{dictionary.discovery.viewDetails}</span>
                    </figcaption>
                  </figure>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
