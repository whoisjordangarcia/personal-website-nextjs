"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { env } from "@/env";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
      trackView?: (url: string) => void;
    };
  }
}

export function Analytics() {
  const websiteId = env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptUrl = env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!websiteId) return;
    const search = searchParams.toString();
    const url = pathname + (search ? `?${search}` : "");
    window.umami?.trackView?.(url);
  }, [websiteId, pathname, searchParams]);

  useEffect(() => {
    if (!websiteId) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (anchor instanceof HTMLAnchorElement && anchor.href) {
        window.umami?.track("link_click", { href: anchor.href });
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [websiteId]);

  if (!websiteId || !scriptUrl) return null;

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
