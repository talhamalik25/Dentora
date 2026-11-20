import type { MetadataRoute } from "next";
import { clinicConfig } from "@/config/clinic.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = clinicConfig.seo.siteUrl;
  const now = new Date();
  return [
    { url: base, lastModified: now },
    { url: `${base}/about`, lastModified: now },
    { url: `${base}/services`, lastModified: now },
    { url: `${base}/specialists`, lastModified: now },
    { url: `${base}/contact`, lastModified: now },
    { url: `${base}/faq`, lastModified: now },
    { url: `${base}/book`, lastModified: now },
    { url: `${base}/privacy`, lastModified: now },
    { url: `${base}/booking-policies`, lastModified: now },
  ];
}
