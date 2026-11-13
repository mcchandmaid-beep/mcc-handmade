import type { MetadataRoute } from "next";
import { getPublicBaseUrl } from "@/lib/whatsapp";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getPublicBaseUrl();
  const lastModified = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/collection", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/model-01", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/model-02", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/model-03", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    for (const locale of ["fr", "ar"]) {
      const url = `${baseUrl}/${locale}${route.path}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            fr: `${baseUrl}/fr${route.path}`,
            ar: `${baseUrl}/ar${route.path}`,
          },
        },
      });
    }
  }

  return entries;
}
