import "@/styles/globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";

import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "./_components/Analytics";

const siteUrl = "https://jordangarcia.dev";

export const metadata: Metadata = {
  title: "Jordan Garcia",
  description: "Personal Portfolio",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Jordan Garcia",
    description: "Personal Portfolio",
    url: siteUrl,
    siteName: "Jordan Garcia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jordan Garcia",
    description: "Personal Portfolio",
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
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
