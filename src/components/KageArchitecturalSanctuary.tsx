"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sparkles, Maximize2, Minimize2, Compass, Layers, ShieldCheck, Flame, X } from "lucide-react";
import "@designcodeio/threeui/style.css";

// Dynamic import with SSR disabled to guarantee smooth client-side iframe initialization
const KageLandingPage = dynamic(
  () => import("@/shaders/landing-pages/LandingPages").then((mod) => mod.KageLandingPage),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[580px] flex flex-col items-center justify-center bg-[#070709] text-stone-400 gap-3">
        <div className="w-9 h-9 border-2 border-[#C59B27] border-t-transparent animate-spin rounded-full" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#E5C378]">
          Loading Kage Temple 3D World...
        </span>
      </div>
    ),
  }
);

interface KageArchitecturalSanctuaryProps {
  isAndroidView?: boolean;
}

export default function KageArchitecturalSanctuary({ isAndroidView = false }: KageArchitecturalSanctuaryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  return (
    <section className="w-full bg-[#0a0a0c] text-white py-14 sm:py-24 px-3 sm:px-6 lg:px-12 border-b border-stone-800/80 relative overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(224,35,28,0.12),transparent_70%)]" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(197,155,39,0.08),transparent_70%)]" />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 border-b border-white/10 pb-6 sm:pb-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#e0231c]/15 border border-[#e0231c]/30 text-[#ff5a52] font-mono text-[10px] sm:text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-[#e0231c]" />
                Interactive Three.js Sanctuary
              </span>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-400 font-mono text-[10px] sm:text-xs uppercase tracking-wider">
                Spatial Architecture • 借景
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Architectural Sanctuary: Kage Temple
            </h2>
            <p className="font-sans text-xs sm:text-sm lg:text-base text-stone-400 mt-2 sm:mt-3 leading-relaxed">
              Where stillness reveals the unseen. Commissioned architectural pavilion concepts co-created for luxury retreats, zen courtyards, and bespoke estates. Explore the interactive 3D temple landscape—featuring borrowed scenery (借景), charred yakisugi wood, stone lantern courts, and moonwater reflections.
            </p>
          </div>

          {/* Interactive Actions & Spec Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 bg-stone-900/80 border border-stone-800 px-3 py-1.5 rounded-lg text-stone-400 font-mono text-xs">
              <Compass className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Scroll to navigate scenes</span>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md active:scale-98"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 text-[#E5C378]" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 text-[#E5C378]" />
                  <span>Immersive View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Embedded ThreeUI KageLandingPage Frame */}
        <div
          className={`shader-frame relative w-full rounded-2xl overflow-hidden border border-stone-800 shadow-2xl bg-[#080808] transition-all duration-300 ${
            isFullscreen
              ? "fixed inset-0 z-[99999] rounded-none border-0 h-screen w-screen"
              : isAndroidView
              ? "h-[500px] sm:h-[680px]"
              : "h-[620px] sm:h-[780px] lg:h-[880px]"
          }`}
        >
          {isFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-50 px-4 py-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/30 text-xs font-mono tracking-wider uppercase flex items-center gap-1.5 shadow-2xl cursor-pointer backdrop-blur-md"
            >
              <X className="w-4 h-4 text-[#e0231c]" />
              <span>Close Immersive View (ESC)</span>
            </button>
          )}

          <KageLandingPage
            headingFont="onest"
            bodyFont="onest"
            headingWeight="400"
            bodyWeight="300"
            primaryColor="#e0231c"
            headingSize={46}
            bodySize={17}
            headingLetterSpacing={-0.012}
          />
        </div>

        {/* Footer Architectural Caption */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-stone-500 font-mono tracking-wider pt-2 border-t border-white/5">
          <span>Stallion Stainless Spatial Architecture Series</span>
          <span className="hidden sm:inline">Engineered with Three.js WebGL &amp; Architectural Cadence</span>
          <span>Tokyo • Kyoto • Architectural Bespoke</span>
        </div>
      </div>
    </section>
  );
}

export { Scene } from "@/shaders/landing-pages/LandingPages";
