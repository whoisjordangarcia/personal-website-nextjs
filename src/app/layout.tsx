import "@/styles/globals.css";

import type { Metadata } from "next";
import {
  Fira_Code,
  Geist_Mono,
  IBM_Plex_Mono,
  JetBrains_Mono,
} from "next/font/google";
import { Suspense } from "react";

import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "./_components/Analytics";
import { FONT_BOOT_SCRIPT } from "./_components/theme/font";
import { THEME_BOOT_SCRIPT } from "./_components/theme/theme";

// Optional fonts for the /config Font tab. preload: false means none of
// these download until a visitor actually picks one.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  preload: false,
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  preload: false,
});
const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  preload: false,
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-plex-mono",
  preload: false,
});
const fontVars = [geistMono, jetbrainsMono, firaCode, plexMono]
  .map((f) => f.variable)
  .join(" ");

const siteUrl = "https://jordangarcia.me";

const description =
  "Jordan Garcia — Senior Software Engineer specializing in TypeScript and Python. Building distributed systems from Miami, Australia-born.";

export const metadata: Metadata = {
  title: "Jordan Garcia",
  description,
  keywords: [
    "Jordan Garcia",
    "Senior Software Engineer",
    "TypeScript",
    "Python",
    "distributed systems",
    "Miami",
    "full-stack developer",
  ],
  authors: [{ name: "Jordan Garcia", url: siteUrl }],
  creator: "Jordan Garcia",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jordan Garcia",
    description,
    url: siteUrl,
    siteName: "Jordan Garcia",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Jordan Garcia — Senior Software Engineer specializing in TypeScript, Python, and distributed systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jordan Garcia",
    description,
    site: "@whoisjordangarcia",
    creator: "@whoisjordangarcia",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Jordan Garcia — Senior Software Engineer specializing in TypeScript, Python, and distributed systems",
      },
    ],
  },
};

// Static JSON-LD structured data for Google Knowledge Panel
// Content is a build-time constant, not user input — safe to serialize directly
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jordan Garcia",
  jobTitle: "Senior Software Engineer",
  url: siteUrl,
  sameAs: [
    "https://linkedin.com/in/whoisjordangarcia",
    "https://github.com/whoisjordangarcia",
    "https://instagram.com/whoisjordangarcia",
  ],
  knowsAbout: ["TypeScript", "Python", "distributed systems"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Miami",
    addressRegion: "FL",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        {/* Static build-time strings: apply saved theme/font before paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_BOOT_SCRIPT + FONT_BOOT_SCRIPT,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
