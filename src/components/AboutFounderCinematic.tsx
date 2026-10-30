"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface AboutFounderCinematicProps {
  className?: string;
  variant?: "hero" | "full";
  autoPlayOnVisible?: boolean;
  isAndroidView?: boolean;
}

export default function AboutFounderCinematic({
  className = "",
  variant = "hero",
  autoPlayOnVisible = true,
  isAndroidView = false,
}: AboutFounderCinematicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isEnded, setIsEnded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasTriggeredPlayRef = useRef(false);

  // Video Ended Handler -> Strictly freeze at final frame
  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = video.duration;
    }
    setIsEnded(true);
  }, []);

  // Play video once
  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay notice:", err);
      });
    }
  }, []);

  // Immediate start on mount (especially for Android at top of page)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  // Auto-play when scrolled into view (runs ONCE and stops at end frame)
  useEffect(() => {
    if (!autoPlayOnVisible) return;
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggeredPlayRef.current) {
          hasTriggeredPlayRef.current = true;
          setTimeout(() => {
            playVideo();
          }, 200);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [autoPlayOnVisible, playVideo]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col justify-center items-center bg-[#141418] overflow-hidden select-none ${className}`}
      style={{
        background: "radial-gradient(circle at 50% 40%, #3d3d44 0%, #202025 50%, #101014 90%, #0e0e10 100%)",
      }}
    >
      {/* Cinematic Frame Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Subtle Ambient Gold Backlight Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#C59B27]/10 via-transparent to-[#e8c84a]/5 pointer-events-none" />

        {/* Video Canvas Element */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
            poster="/chairman-final-pose.png"
            onEnded={handleEnded}
            onLoadedData={() => setIsLoaded(true)}
            className="w-full h-full object-cover pointer-events-none transition-opacity duration-500"
            style={{ maxHeight: isAndroidView ? "auto" : "calc(100vh - 100px)" }}
          >
            <source src="/chairman-entrance.webm" type="video/webm" />
            <source src="/chairman-entrance.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>

          {/* Fallback Static Poster Overlay when ended for ultra-crisp permanent final pose */}
          {isEnded && (
            <div className="absolute inset-0 pointer-events-none opacity-0 animate-fade-in transition-opacity duration-700">
              <Image
                src="/chairman-final-pose.png"
                alt="Chairman & Co-Founder, Stallion Stainless"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {/* Vignette & studio depth gradient overlays */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0e0e10] via-transparent to-[#0e0e10]/40" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0e0e10] via-transparent to-[#0e0e10]/30 hidden lg:block" />
        </div>

        {/* Bottom Executive Caption Plate */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 z-20 bg-gradient-to-t from-[#0e0e10] via-[#0e0e10]/85 to-transparent pointer-events-none">
          <div className="border-l-2 border-[#C59B27] pl-3 sm:pl-3.5">
            <h3 className="font-display text-sm sm:text-base lg:text-lg font-black uppercase tracking-wider text-[#C59B27] leading-none">
              KAMALESH MEHTA
            </h3>
            <p className="font-mono text-[9px] sm:text-[11px] lg:text-xs font-semibold text-white/90 uppercase tracking-[0.2em] mt-1 sm:mt-1.5">
              CHAIRMAN &amp; CO-FOUNDER
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
