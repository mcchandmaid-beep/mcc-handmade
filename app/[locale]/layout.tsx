import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CustomCursor } from "@/components/custom-cursor";
import { MccHeader } from "@/components/mcc-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/dictionaries";
import { getDirection, isLocale, locales } from "@/lib/i18n";
import { getPublicBaseUrl } from "@/lib/whatsapp";
import { ScrollReveal } from "@/components/scroll-reveal";
import "../globals.css";

export const metadata = {
  metadataBase: new URL(getPublicBaseUrl()),
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) notFound();

  const locale = localeParam;
  const dictionary = getDictionary(locale);

  return (
    <html dir={getDirection(locale)} lang={locale} suppressHydrationWarning>
      <body>
        <CustomCursor />
        <ScrollReveal />
        <MccHeader dictionary={dictionary} locale={locale} />
        {children}
        <SiteFooter dictionary={dictionary} locale={locale} />
      </body>
    </html>
  );
}
