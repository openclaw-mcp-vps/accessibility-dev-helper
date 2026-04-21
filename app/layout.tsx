import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://accessibility-dev-helper.com"),
  title: {
    default: "accessibility-dev-helper | Screen reader simulation for blind developers",
    template: "%s | accessibility-dev-helper"
  },
  description:
    "Simulate real screen reader output during development, catch accessibility regressions before release, and ship inclusive interfaces with confidence.",
  keywords: [
    "screen reader simulator",
    "accessibility testing",
    "frontend QA",
    "WCAG",
    "blind users",
    "a11y tooling"
  ],
  openGraph: {
    title: "accessibility-dev-helper",
    description:
      "A developer tool that shows exactly how blind users experience your web app, in real time.",
    url: "https://accessibility-dev-helper.com",
    siteName: "accessibility-dev-helper",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "accessibility-dev-helper",
    description:
      "Catch screen-reader accessibility issues before they hit production."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
