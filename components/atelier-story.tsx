import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface AtelierStoryProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function AtelierStory({ dictionary }: AtelierStoryProps) {
  return (
    <section className="atelier-story" id="atelier" aria-labelledby="atelier-title">
      <div className="atelier-story__inner">
        <header className="atelier-story__header">
          <p className="eyebrow">{dictionary.atelier.eyebrow}</p>
          <h2 id="atelier-title" className="atelier-story__title">
            {dictionary.atelier.title}
          </h2>
          <p className="atelier-story__subtitle">{dictionary.atelier.subtitle}</p>
        </header>

        <div className="atelier-story__pillars">
          {dictionary.atelier.pillars.map((pillar, index) => (
            <article className="pillar-card" key={pillar.title}>
              <span className="pillar-card__index" aria-hidden="true">
                0{index + 1}
              </span>
              <h3 className="pillar-card__heading">{pillar.title}</h3>
              <p className="pillar-card__body">{pillar.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
