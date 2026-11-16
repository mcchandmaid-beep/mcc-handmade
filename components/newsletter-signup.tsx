"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface NewsletterSignupProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function NewsletterSignup({ dictionary, locale }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isArabic = locale === "ar";

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  }

  return (
    <div className="concierge-card">
      <span className="mono-label">[ {dictionary.concierge.newsletterEyebrow} ]</span>
      <h3 className="concierge-card__title">{dictionary.concierge.newsletterTitle}</h3>
      <p className="concierge-card__subtitle">{dictionary.concierge.newsletterSubtitle}</p>

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
              onChange={(event) => setEmail(event.target.value)}
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
  );
}
