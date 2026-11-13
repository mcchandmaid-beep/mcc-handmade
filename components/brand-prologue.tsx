import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface BrandPrologueProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function BrandPrologue({ dictionary }: BrandPrologueProps) {
  return (
    <section className="brand-prologue" aria-labelledby="prologue-title">
      <div className="brand-prologue__inner">
        <p className="eyebrow" id="prologue-title">
          {dictionary.prologue.eyebrow}
        </p>
        <blockquote className="brand-prologue__statement">
          <p>{dictionary.prologue.statement}</p>
        </blockquote>
        <div className="brand-prologue__mark" aria-hidden="true">
          <span className="brand-prologue__line" />
        </div>
      </div>
    </section>
  );
}
