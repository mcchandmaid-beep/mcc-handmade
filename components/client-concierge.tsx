"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface ClientConciergeProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function ClientConcierge({ dictionary, locale }: ClientConciergeProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isArabic = locale === "ar";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  }

  return (
    <section className="client-concierge" id="concierge" aria-labelledby="concierge-title">
      {/* Top Hairline Bar */}
      <div className="client-concierge__top-bar">
        <span className="mono-label">[ {dictionary.concierge.eyebrow} ]</span>
        <span className="mono-label">CONTACT DIRECT & NOUVELLES DE MAISON</span>
      </div>

      <div className="client-concierge__grid">
        {/* Left Column: Direct Atelier Inquiries */}
        <div className="client-concierge__inquiry-col reveal-on-scroll reveal-delay-1">
          <h2 id="concierge-title" className="client-concierge__title">
            {dictionary.concierge.title}
          </h2>
          <p className="client-concierge__description">
            {dictionary.concierge.description}
          </p>

          <div className="client-concierge__direct-link">
            <span className="mono-label client-concierge__email-label">
              {dictionary.concierge.contactEmailLabel}
            </span>
            <a
              className="client-concierge__email"
              href={`mailto:${dictionary.concierge.contactEmail}`}
            >
              {dictionary.concierge.contactEmail}
            </a>
          </div>
        </div>

        {/* Right Column: Private Gazette / Newsletter */}
        <div className="client-concierge__newsletter-col reveal-on-scroll reveal-delay-2">
          <div className="concierge-card">
            <span className="mono-label">[ GAZETTE ÉDITORIALE ]</span>
            <h3 className="concierge-card__title">
              {dictionary.concierge.newsletterTitle}
            </h3>
            <p className="concierge-card__subtitle">
              {dictionary.concierge.newsletterSubtitle}
            </p>

            {isSubscribed ? (
              <div className="concierge-card__feedback" role="status">
                <span className="mono-label">✓ {dictionary.concierge.subscribedNote}</span>
              </div>
            ) : (
              <form className="concierge-form" onSubmit={handleSubmit}>
                <div className="concierge-form__field">
                  <input
                    aria-label={dictionary.concierge.placeholder}
                    className="concierge-form__input"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={dictionary.concierge.placeholder}
                    required
                    type="email"
                    value={email}
                  />
                  <button className="action-btn action-btn--primary client-concierge__submit" type="submit">
                    <span>{dictionary.concierge.subscribe}</span>
                    <span className="action-btn__arrow" aria-hidden="true">
                      {isArabic ? "←" : "→"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
