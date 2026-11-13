import type { MetadataRoute } from "next";
import { getPublicBaseUrl } from "@/lib/whatsapp";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getPublicBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
