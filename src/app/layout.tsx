import type { Metadata } from "next";
import type { ReactNode, CSSProperties } from "react";
import { clinicConfig } from "@/config/clinic.config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: clinicConfig.seo.defaultTitle,
    template: clinicConfig.seo.titleTemplate,
  },
  description: clinicConfig.seo.description,
  openGraph: {
    title: clinicConfig.seo.defaultTitle,
    description: clinicConfig.seo.description,
    siteName: clinicConfig.identity.name,
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const themeStyles = {
    "--clinic-brand": clinicConfig.theme.brandColor,
    "--clinic-brand-hover": clinicConfig.theme.brandHoverColor,
    "--clinic-ice": clinicConfig.theme.iceColor,
    "--clinic-ink": clinicConfig.theme.inkColor,
    "--clinic-muted": clinicConfig.theme.mutedColor,
  } as CSSProperties;

  return (
    <html
      lang="en"
      className="h-full antialiased"
      style={themeStyles}
    >
      <body><a href="#main-content" className="skip-link">Skip to content</a>{children}</body>
    </html>
  );
}
