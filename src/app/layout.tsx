import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Dentora — Thoughtfully designed dental care", template: "%s | Dentora" },
  description: "Discover a patient-focused dental care concept, designed around comfort, confidence, and long-term oral health. Demonstration website.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body><a href="#main-content" className="skip-link">Skip to content</a>{children}</body>
    </html>
  );
}
