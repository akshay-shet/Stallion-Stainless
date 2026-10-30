"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLenis } from "@/components/SmoothScroll";

interface ScrollVideoHeroProps {
  isAndroidView?: boolean;
}

export default function ScrollVideoHero({
  isAndroidView = false,
}: ScrollVideoHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lenis = useLenis();

  const [frameUrls, setFrameUrls] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Helper: Draw frame and fit canvas properly
  const drawImageOnCanvas = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // Full-bleed Cover calculation
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let drawWidth = w;
    let drawHeight = h;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = w / imgRatio;
      offsetY = (h - drawHeight) / 2;
    } else {
      drawWidth = h * imgRatio;
      offsetX = (w - drawWidth) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const drawFrame = useCallback(
    (frameIndex: number) => {
      const img = imagesRef.current[frameIndex];
      if (img) drawImageOnCanvas(img);
    },
    [drawImageOnCanvas]
  );

  // 1. Fetch frames list
  useEffect(() => {
    let active = true;
    fetch("/api/frames")
      .then((res) => res.json())
      .then((data) => {
        if (active && data.frames && data.frames.length > 0) {
          setFrameUrls(data.frames);
        }
      })
      .catch((err) => console.error("Error loading frames index:", err));

    return () => {
      active = false;
    };
  }, []);

  // 2. Preload frames
  useEffect(() => {
    if (frameUrls.length === 0) return;
    let mounted = true;
    const total = frameUrls.length;
    const images: HTMLImageElement[] = new Array(total);
    let loadedCount = 0;

    // Immediately render frame 0 so visual appears instantly
    const firstImg = new Image();
    firstImg.src = frameUrls[0];
    firstImg.onload = () => {
      if (mounted) {
        images[0] = firstImg;
        drawImageOnCanvas(firstImg);
      }
    };
    images[0] = firstImg;

    const onLoad = () => {
      loadedCount++;
      if (mounted) {
        setLoadProgress(Math.round((loadedCount / total) * 100));
      }
      if (loadedCount === total && mounted) {
        imagesRef.current = images;
        setLoaded(true);
        drawFrame(currentFrameRef.current);
      }
    };

    frameUrls.forEach((url, i) => {
      if (i === 0) {
        loadedCount++;
        return;
      }
      const img = new Image();
      img.src = url;
      img.onload = onLoad;
      img.onerror = onLoad;
      images[i] = img;
    });

    return () => {
      mounted = false;
    };
  }, [frameUrls, drawImageOnCanvas, drawFrame]);

  // Handle window resize
  useEffect(() => {
    const onResize = () => {
      if (imagesRef.current[currentFrameRef.current]) {
        drawFrame(currentFrameRef.current);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [drawFrame]);

  // 3. Frame scrub mapped to scroll
  useEffect(() => {
    if (frameUrls.length === 0) return;

    const updateFrameOnScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrolled = -rect.top;
      const scrollableDistance = containerHeight - viewportHeight;

      if (scrollableDistance <= 0) return;

      const finalFrameHoldDistance = viewportHeight * 0.3;
      const frameScrollDistance = Math.max(
        1,
        scrollableDistance - finalFrameHoldDistance
      );
      const progress = Math.max(0, Math.min(1, scrolled / frameScrollDistance));
      const totalFrames = frameUrls.length;
      const frameIndex = Math.round(progress * (totalFrames - 1));

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    window.addEventListener("scroll", updateFrameOnScroll, { passive: true });
    if (lenis) {
      lenis.on("scroll", updateFrameOnScroll);
    }

    updateFrameOnScroll();

    return () => {
      window.removeEventListener("scroll", updateFrameOnScroll);
      if (lenis) {
        lenis.off("scroll", updateFrameOnScroll);
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frameUrls, drawFrame, lenis]);

  if (frameUrls.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#111111]"
      // 310vh total gives the sequence 180vh to play, then holds the final frame for 30vh.
      style={{ height: isAndroidView ? "100vh" : "310vh" }}
    >
      <div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#111111] z-10"
      >
        {/* Subtle Top Gold Loading Indicator */}
        {!loaded && frameUrls.length > 0 && (
          <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#C59B27] transition-all duration-150 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        )}

        {/* Full-bleed Video Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block"
        />

        {/* Cinematic Overlays */}
        {!isAndroidView && (
          <>
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(17,17,17,0.5) 100%)",
              }}
            />

            {/* Corner brackets */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none hidden lg:block">
              <div className="w-10 h-10 border-t-2 border-l-2 border-[#C59B27]/70" />
            </div>
            <div className="absolute top-8 right-8 z-20 pointer-events-none hidden lg:block">
              <div className="w-10 h-10 border-t-2 border-r-2 border-[#C59B27]/70" />
            </div>
            <div className="absolute bottom-8 left-8 z-20 pointer-events-none hidden lg:block">
              <div className="w-10 h-10 border-b-2 border-l-2 border-[#C59B27]/70" />
            </div>
            <div className="absolute bottom-8 right-8 z-20 pointer-events-none hidden lg:block">
              <div className="w-10 h-10 border-b-2 border-r-2 border-[#C59B27]/70" />
            </div>

            {/* Bottom gold accent line */}
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
              <div className="h-[3px] bg-gradient-to-r from-transparent via-[#C59B27] to-transparent opacity-80" />
            </div>

            {/* Ticks */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex flex-col gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/30"
                  style={{ width: i === 2 ? "20px" : "10px", height: "1px" }}
                />
              ))}
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex flex-col gap-2 items-end">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white/30"
                  style={{ width: i === 2 ? "20px" : "10px", height: "1px" }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
