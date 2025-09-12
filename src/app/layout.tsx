import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Suspense } from "react";

import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "./_components/Analytics";

export const metadata = {
  title: "Jordan Garcia",
  description: "Personal Portfolio",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
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
