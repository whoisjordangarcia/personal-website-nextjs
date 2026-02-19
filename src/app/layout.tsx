import "@/styles/globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";

import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "./_components/Analytics";

const siteUrl = "https://jordangarcia.dev";

const description =
  "Jordan Garcia — Software Engineer specializing in TypeScript and Python. Building distributed systems from Miami, Australia-born.";

export const metadata: Metadata = {
  title: "Jordan Garcia",
  description,
  keywords: [
    "Jordan Garcia",
    "Software Engineer",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Jordan Garcia",
    description,
  },
};

// Static JSON-LD structured data for Google Knowledge Panel
// Content is a build-time constant, not user input — safe to serialize directly
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jordan Garcia",
  jobTitle: "Software Engineer",
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
    <html lang="en" className={`${GeistSans.variable}`}>
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
