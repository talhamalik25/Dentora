import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://dentora-dusky.vercel.app";
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
