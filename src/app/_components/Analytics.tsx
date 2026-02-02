"use client";

import Script from "next/script";
import { useEffect, useCallback, useRef } from "react";
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

/**
 * Track a custom event with Umami analytics
 */
export function trackEvent(event: string, data?: Record<string, unknown>) {
  window.umami?.track(event, data);
}

/**
 * Hook for tracking custom events with Umami
 */
export function useTrackEvent() {
  return useCallback((event: string, data?: Record<string, unknown>) => {
    trackEvent(event, data);
  }, []);
}

/**
 * Check if a URL is external (different host)
 */
function isExternalLink(href: string): boolean {
  try {
    const url = new URL(href, window.location.origin);
    return url.host !== window.location.host;
  } catch {
    return false;
  }
}

export function Analytics() {
  const websiteId = env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const scriptUrl = env.NEXT_PUBLIC_UMAMI_SCRIPT_URL;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollDepthTracked = useRef<Set<number>>(new Set());

  // Track page views on route change
  useEffect(() => {
    if (!websiteId) return;
    const search = searchParams.toString();
    const url = pathname + (search ? `?${search}` : "");
    window.umami?.trackView?.(url);
    // Reset scroll depth tracking on page change
    scrollDepthTracked.current = new Set();
  }, [websiteId, pathname, searchParams]);

  // Track link clicks with external link detection
  useEffect(() => {
    if (!websiteId) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (anchor instanceof HTMLAnchorElement && anchor.href) {
        const isExternal = isExternalLink(anchor.href);
        window.umami?.track(isExternal ? "external_link_click" : "link_click", {
          href: anchor.href,
          text: anchor.textContent?.trim().slice(0, 50) ?? "",
        });
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [websiteId]);

  // Track scroll depth at 25%, 50%, 75%, and 100%
  useEffect(() => {
    if (!websiteId) return;
    const thresholds = [25, 50, 75, 100];

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of thresholds) {
        if (
          scrollPercent >= threshold &&
          !scrollDepthTracked.current.has(threshold)
        ) {
          scrollDepthTracked.current.add(threshold);
          window.umami?.track("scroll_depth", {
            depth: threshold,
            path: pathname,
          });
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [websiteId, pathname]);

  if (!websiteId || !scriptUrl) return null;

  return (
    <Script
      src={scriptUrl}
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
