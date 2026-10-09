"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";

interface MccHeaderProps {
  dictionary: Dictionary;
  locale: Locale;
}

export function MccHeader({ dictionary, locale }: MccHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function closeMenu() {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        {/* Left: Nav items on desktop */}
        <nav className="site-nav" aria-label="Navigation principale">
          <ul className="site-nav__list">
            <li>
              <Link href={`/${locale}/collection`} className="site-nav__link">
                {dictionary.nav.collection}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/model-01`}
                className="site-nav__link"
                title={dictionary.nav.model01}
              >
                {locale === "ar" ? "الموديل 01" : "Modèle 01"}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/model-02`}
                className="site-nav__link"
                title={dictionary.nav.model02}
              >
                {locale === "ar" ? "الموديل 02" : "Modèle 02"}
              </Link>
            </li>
            <li>
              <Link
                href={`/${locale}/model-03`}
                className="site-nav__link"
                title={dictionary.nav.model03}
              >
                {locale === "ar" ? "الموديل 03" : "Modèle 03"}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#atelier`} className="site-nav__link">
                {dictionary.nav.atelier}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#tones`} className="site-nav__link">
                {dictionary.nav.tones}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#concierge`} className="site-nav__link">
                {dictionary.nav.concierge}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Center: Brand Mark */}
        <div className="site-header__center">
          <Link
            className="brand-mark"
            href={`/${locale}`}
            aria-label="MCC Handmade"
            onClick={closeMenu}
          >
            <Image
              alt="MCC Handmade"
              height={32}
              priority
              src="/mcc-handmade-logo-trimmed.png"
              width={105}
              className="brand-mark__img"
            />
          </Link>
        </div>

        {/* Right: Language switch + WhatsApp order action + Mobile toggle */}
        <div className="site-header__actions">
          <a
            href="https://wa.me/212689532341"
            target="_blank"
            rel="noopener noreferrer"
            className="header-whatsapp-btn mono-label"
            aria-label={locale === "ar" ? "طلب عبر واتساب" : "Commander sur WhatsApp"}
          >
            <span className="header-whatsapp-btn__dot" aria-hidden="true" />
            <span>{locale === "ar" ? "واتساب" : "WHATSAPP"}</span>
          </a>

          <LanguageSwitcher label={dictionary.languageSwitcherLabel} locale={locale} />

          <button
            aria-controls="mobile-nav-drawer"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? dictionary.nav.closeMenu : dictionary.nav.menu}
            className="mobile-nav-toggle"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="mobile-nav-toggle__label">
              {isMobileMenuOpen ? dictionary.nav.closeMenu : dictionary.nav.menu}
            </span>
          </button>
        </div>
      </div>

      {/* Full-Screen Editorial Mobile Menu Drawer */}
      <div
        className={`mobile-nav-drawer ${isMobileMenuOpen ? "mobile-nav-drawer--open" : ""}`}
        id="mobile-nav-drawer"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-nav-drawer__header">
          <span className="mono-label">[ MENU ÉDITORIAL ]</span>
          <button
            aria-label={dictionary.nav.closeMenu}
            className="mobile-nav-drawer__close mono-label"
            onClick={closeMenu}
            type="button"
          >
            ✕ {dictionary.nav.closeMenu}
          </button>
        </div>

        <nav className="mobile-nav" aria-label="Navigation mobile">
          <ul className="mobile-nav__list">
            <li className="mobile-nav__item">
              <span className="mono-label mobile-nav__idx">01</span>
              <Link href={`/${locale}/collection`} className="mobile-nav__link" onClick={closeMenu}>
                {dictionary.nav.collection}
              </Link>
            </li>
            <li className="mobile-nav__item">
              <span className="mono-label mobile-nav__idx">02</span>
              <Link href={`/${locale}/model-01`} className="mobile-nav__link" onClick={closeMenu}>
                {dictionary.nav.model01}
              </Link>
            </li>
            <li className="mobile-nav__item">
              <span className="mono-label mobile-nav__idx">03</span>
              <Link href={`/${locale}/model-02`} className="mobile-nav__link" onClick={closeMenu}>
                {dictionary.nav.model02}
              </Link>
            </li>
            <li className="mobile-nav__item">
              <span className="mono-label mobile-nav__idx">04</span>
              <Link href={`/${locale}/model-03`} className="mobile-nav__link" onClick={closeMenu}>
                {dictionary.nav.model03}
              </Link>
            </li>
            <li className="mobile-nav__item">
              <span className="mono-label mobile-nav__idx">05</span>
              <Link href={`/${locale}#atelier`} className="mobile-nav__link" onClick={closeMenu}>
                {dictionary.nav.atelier}
              </Link>
            </li>
            <li className="mobile-nav__item">
              <span className="mono-label mobile-nav__idx">06</span>
              <Link href={`/${locale}#tones`} className="mobile-nav__link" onClick={closeMenu}>
                {dictionary.nav.tones}
              </Link>
            </li>
            <li className="mobile-nav__item">
              <span className="mono-label mobile-nav__idx">07</span>
              <Link href={`/${locale}#concierge`} className="mobile-nav__link" onClick={closeMenu}>
                {dictionary.nav.concierge}
              </Link>
            </li>
            <li className="mobile-nav__item mobile-nav__item--whatsapp">
              <span className="mono-label mobile-nav__idx">08</span>
              <a
                href="https://wa.me/212689532341"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav__link mobile-nav__link--whatsapp"
                onClick={closeMenu}
              >
                {locale === "ar" ? "الطلب عبر واتساب" : "COMMANDE WHATSAPP"}
              </a>
            </li>
          </ul>
        </nav>

        <div className="mobile-nav-drawer__footer">
          <LanguageSwitcher label={dictionary.languageSwitcherLabel} locale={locale} />
          <p className="mono-label mobile-nav-drawer__tagline">
            MCC HANDMADE · {locale === "ar" ? "أناقة محتشمة معاصرة" : "HAUTE ÉLÉGANCE MODESTE"}
          </p>
        </div>
      </div>
    </header>
  );
}
