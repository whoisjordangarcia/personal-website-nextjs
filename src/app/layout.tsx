import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";

import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "./_components/Analytics";

const siteUrl = "https://jordangarcia.me";

const description =
  "Jordan Garcia — Senior Software Engineer in Miami specializing in TypeScript, Python, and distributed systems. Available for freelance and contract development work in South Florida.";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Jordan Garcia",
  description,
  keywords: [
    "Jordan Garcia",
    "Senior Software Engineer",
    "Software Engineer Miami",
    "Miami web developer",
    "Miami software developer",
    "freelance developer Miami",
    "South Florida developer",
    "TypeScript",
    "Python",
    "distributed systems",
    "Miami",
    "full-stack developer",
    "remote software engineer",
    "contract developer Florida",
    "web development Miami",
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
    title: "Jordan Garcia — Senior Software Engineer in Miami",
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
        alt: "Jordan Garcia — Senior Software Engineer in Miami specializing in TypeScript, Python, and distributed systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jordan Garcia — Senior Software Engineer in Miami",
    description,
    site: "@whoisjordangarcia",
    creator: "@whoisjordangarcia",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Jordan Garcia — Senior Software Engineer in Miami specializing in TypeScript, Python, and distributed systems",
      },
    ],
  },
};

// Static JSON-LD structured data for Google Knowledge Panel & Local SEO
// Content is a build-time constant, not user input — safe to serialize directly
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Person", "ProfessionalService"],
  name: "Jordan Garcia",
  jobTitle: "Senior Software Engineer",
  url: siteUrl,
  sameAs: [
    "https://linkedin.com/in/whoisjordangarcia",
    "https://github.com/whoisjordangarcia",
    "https://instagram.com/whoisjordangarcia",
  ],
  knowsAbout: [
    "TypeScript",
    "Python",
    "distributed systems",
    "web development",
    "software engineering",
    "full-stack development",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Miami",
    addressRegion: "FL",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "Place",
    name: "Miami, FL",
  },
  serviceType: [
    "Web Development",
    "Software Engineering",
    "TypeScript Development",
    "Python Development",
    "Distributed Systems Architecture",
  ],
  priceRange: "$$",
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
