"use client";

import React, { Suspense, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

function LenisScrollHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  // Scroll to top on route change, or scroll smoothly to hash if present
  useEffect(() => {
    if (!lenis) return;

    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const target = document.querySelector(hash);
      if (target) {
        const timer = setTimeout(() => {
          lenis.scrollTo(target as HTMLElement, {
            offset: -80,
            duration: 1.2,
          });
        }, 60);
        return () => clearTimeout(timer);
      }
    }

    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  // Intercept local hash anchor clicks for silky smooth scrolling
  useEffect(() => {
    if (!lenis) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") && href.length > 1) {
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, {
            offset: -80,
            duration: 1.2,
          });
          if (typeof window !== "undefined" && window.history?.pushState) {
            window.history.pushState(null, "", href);
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
        syncTouch: false,
        autoResize: true,
      }}
    >
      <Suspense fallback={null}>
        <LenisScrollHandler />
      </Suspense>
      {children}
    </ReactLenis>
  );
}

export { useLenis };
