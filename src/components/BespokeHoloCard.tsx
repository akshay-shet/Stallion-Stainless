"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export interface BespokeCardData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  description: string;
  bullets: string[];
  href: string;
}

interface BespokeHoloCardProps {
  card: BespokeCardData;
  isAndroidView?: boolean;
  isFlipped?: boolean;
  onToggleFlip?: (id: string) => void;
}

export default function BespokeHoloCard({
  card,
  isAndroidView = false,
  isFlipped = false,
  onToggleFlip,
}: BespokeHoloCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [coords, setCoords] = useState({ x: 50, y: 50, rx: 0, ry: 0 });
  const animFrameRef = useRef<number | null>(null);
  const targetRotRef = useRef({ rx: 0, ry: 0, px: 50, py: 50 });
  const currentRotRef = useRef({ rx: 0, ry: 0, px: 50, py: 50 });

  // Spring physics loop for buttery smooth tactile tilt
  const updateSpring = useCallback(() => {
    const factor = 0.14; // Lerp smoothing factor
    currentRotRef.current.rx += (targetRotRef.current.rx - currentRotRef.current.rx) * factor;
    currentRotRef.current.ry += (targetRotRef.current.ry - currentRotRef.current.ry) * factor;
    currentRotRef.current.px += (targetRotRef.current.px - currentRotRef.current.px) * factor;
    currentRotRef.current.py += (targetRotRef.current.py - currentRotRef.current.py) * factor;

    setCoords({
      x: currentRotRef.current.px,
      y: currentRotRef.current.py,
      rx: currentRotRef.current.rx,
      ry: currentRotRef.current.ry,
    });

    const isMoving =
      Math.abs(targetRotRef.current.rx - currentRotRef.current.rx) > 0.01 ||
      Math.abs(targetRotRef.current.ry - currentRotRef.current.ry) > 0.01;

    if (isMoving || isHovered) {
      animFrameRef.current = requestAnimationFrame(updateSpring);
    } else {
      animFrameRef.current = null;
    }
  }, [isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isAndroidView) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = Math.min(100, Math.max(0, (x / rect.width) * 100));
    const py = Math.min(100, Math.max(0, (y / rect.height) * 100));

    // Pointer-reactive rotation limits (tilt toward cursor)
    const maxTilt = 14;
    const dx = (x / rect.width) - 0.5;
    const dy = (y / rect.height) - 0.5;

    targetRotRef.current = {
      rx: -dy * maxTilt * 2,
      ry: dx * maxTilt * 2,
      px,
      py,
    };

    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updateSpring);
    }
  }, [isAndroidView, updateSpring]);

  const handleMouseEnter = useCallback(() => {
    if (isAndroidView) return;
    setIsHovered(true);
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updateSpring);
    }
  }, [isAndroidView, updateSpring]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    targetRotRef.current = { rx: 0, ry: 0, px: 50, py: 50 };
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updateSpring);
    }
  }, [updateSpring]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Compute rotation with 180deg flip
  const currentYRot = isFlipped ? 180 + coords.ry : coords.ry;
  const currentXRot = coords.rx;

  // Dynamic foil reflection angle
  const foilAngle = Math.round(115 + coords.ry * 2);

  return (
    <div
      ref={cardRef}
      onClick={() => onToggleFlip?.(card.id)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group perspective-1000 ${
        isAndroidView ? "h-[200px] sm:h-[420px]" : "h-[380px] sm:h-[420px]"
      } w-full cursor-pointer select-none relative`}
      style={{
        perspective: "1200px",
      }}
    >
      {/* 3D Transform Body */}
      <div
        className="relative w-full h-full rounded-2xl transition-transform duration-500 ease-out will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${currentXRot}deg) rotateY(${currentYRot}deg)`,
        }}
      >
        {/* =========================================================================
            FRONT FACE (Tactile Holo Finish)
            ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-white border border-stone-200/90 overflow-hidden flex flex-col justify-between shadow-md transition-shadow duration-300"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg) translateZ(1px)",
            boxShadow: isHovered
              ? "0 22px 35px -10px rgba(0,0,0,0.18), 0 10px 15px -6px rgba(197, 155, 39, 0.2)"
              : "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Photo Container with Depth */}
          <div
            className={`relative w-full ${isAndroidView ? "h-[76%] sm:h-[80%]" : "h-[80%]"} overflow-hidden bg-stone-100`}
            style={{ transform: "translateZ(8px)" }}
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 pointer-events-none" />

            {/* Top Badges with 3D Parallax */}
            <div
              className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10 flex items-center"
              style={{ transform: "translateZ(24px)" }}
            >
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/95 backdrop-blur-md font-mono font-semibold text-[7.5px] sm:text-[11px] uppercase tracking-wider text-charcoal-ink border border-stone-200/80 shadow-xs whitespace-nowrap">
                {card.badge}
              </span>
            </div>

            {/* Holographic Foil Layer 1: Cindermane Prismatic Sheen */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge z-20"
              style={{
                opacity: isHovered ? (isAndroidView ? 0.25 : 0.65) : 0,
                background: `linear-gradient(${foilAngle}deg, 
                  transparent 18%, 
                  rgba(197, 155, 39, 0.35) 32%, 
                  rgba(255, 235, 170, 0.45) 40%, 
                  rgba(94, 96, 108, 0.25) 47%, 
                  rgba(50, 205, 255, 0.28) 54%, 
                  rgba(230, 140, 255, 0.28) 61%, 
                  rgba(197, 155, 39, 0.4) 69%, 
                  transparent 84%)`,
                backgroundSize: "220% 220%",
                backgroundPosition: `${coords.x}% ${coords.y}%`,
              }}
            />

            {/* Holographic Foil Layer 2: Pointer-Reactive Specular Glare */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay z-20"
              style={{
                opacity: isHovered ? (isAndroidView ? 0.3 : 0.75) : 0,
                background: `radial-gradient(circle 280px at ${coords.x}% ${coords.y}%, 
                  rgba(255, 255, 255, 0.85) 0%, 
                  rgba(255, 240, 210, 0.4) 30%, 
                  transparent 65%)`,
              }}
            />
          </div>

          {/* Front Card Info */}
          <div
            className="py-1 px-1.5 sm:py-3 sm:px-4 flex-1 flex flex-col justify-center bg-white relative z-10"
            style={{ transform: "translateZ(14px)" }}
          >
            <div className="text-center">
              <h3 className="font-display text-[9.5px] sm:text-base lg:text-lg font-bold text-charcoal-ink uppercase tracking-wider text-center line-clamp-1">
                {card.title}
              </h3>
              {card.subtitle && !isAndroidView && (
                <p className="hidden sm:block font-sans text-[11px] text-stone-500 tracking-wide mt-0.5 line-clamp-1 text-center font-normal">
                  {card.subtitle}
                </p>
              )}
            </div>

            {/* Android View Only: Tap to flip hint */}
            {isAndroidView && (
              <div className="flex sm:hidden items-center justify-center pt-0.5 mt-0.5 border-t border-stone-100 text-[6.5px] font-sans text-stone-400">
                <span className="italic">Tap to flip</span>
              </div>
            )}

            {/* Bottom Active Metallic Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5e606c] via-[#C59B27] to-[#5e606c]" />
          </div>

          {/* Holographic Foil Micro-Border Gleam */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent transition-opacity duration-300 z-30"
            style={{
              opacity: isHovered ? 0.85 : 0,
              background: `linear-gradient(${foilAngle}deg, rgba(197,155,39,0.5), transparent 45%, rgba(255,255,255,0.7) 65%, transparent 85%) border-box`,
              WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </div>

        {/* =========================================================================
            BACK FACE (Flipped Architectural Specs + Holo Sheen)
            ========================================================================= */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl bg-[#5e606c] text-white p-2 sm:p-5 lg:p-6 flex flex-col justify-between border border-[#454a4f] shadow-xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg) translateZ(1px)",
            boxShadow: isHovered
              ? "0 22px 35px -10px rgba(0,0,0,0.3), 0 10px 15px -6px rgba(197, 155, 39, 0.25)"
              : "0 6px 16px rgba(0,0,0,0.15)",
          }}
        >
          {/* Background Metallic Shimmer & Noise */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none blur-2xl" />

          {/* Reverse Holographic Sheen on Back Face */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-color-dodge z-0"
            style={{
              opacity: isHovered ? 0.35 : 0,
              background: `radial-gradient(circle 300px at ${100 - coords.x}% ${coords.y}%, 
                rgba(255, 235, 170, 0.4) 0%, 
                rgba(197, 155, 39, 0.2) 35%, 
                transparent 65%)`,
            }}
          />

          <div
            className="overflow-hidden flex flex-col justify-between h-full relative z-10"
            style={{ transform: "translateZ(16px)" }}
          >
            <div>
              {/* Header: Title + Specs badge */}
              <div className="flex items-center justify-between mb-0.5 pb-0.5 sm:mb-2 sm:pb-1.5 border-b border-white/15">
                <div className="flex-1 text-left sm:text-center pr-1 sm:pr-0">
                  <h3 className="font-display text-[9.5px] sm:text-base lg:text-lg font-bold text-white uppercase tracking-tight sm:tracking-wider truncate">
                    {card.title}
                  </h3>
                </div>
                <span className="px-1 py-0.5 sm:px-2.5 sm:py-1 text-[6px] sm:text-[10px] rounded bg-white/15 font-mono uppercase tracking-widest text-[#E5C378] sm:text-white/90 shrink-0 font-semibold ml-1">
                  {isAndroidView ? card.badge : "Specs"}
                </span>
              </div>

              {/* Description */}
              <p
                className={`${
                  isAndroidView
                    ? "text-[6.8px] line-clamp-2 mb-1 text-stone-200/95"
                    : "hidden sm:block text-xs text-stone-200/90 mb-2.5"
                } font-sans leading-tight text-left`}
              >
                {card.description}
              </p>

              {/* Mobile Bullet Points (< 640px) */}
              <div className="space-y-0.5 sm:hidden my-0.5">
                {card.bullets.slice(0, 3).map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[6.8px] leading-tight font-sans text-stone-100">
                    <CheckCircle2 className="w-2 h-2 text-[#C59B27] shrink-0" />
                    <span className="truncate">{bullet}</span>
                  </div>
                ))}
                {card.bullets.length > 3 && (
                  <div className="text-[6px] font-mono text-[#E5C378] pl-3 pt-0.5">
                    +{card.bullets.length - 3} more architectural specs
                  </div>
                )}
              </div>

              {/* Desktop & Tablet Bullet Points (>= 640px) */}
              <div className="hidden sm:block space-y-1 sm:space-y-1.5 mb-2.5">
                {card.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs lg:text-[12px] font-sans text-stone-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                    <span className="truncate">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Link to collection */}
            <div className="pt-1 sm:pt-2.5 border-t border-white/15">
              <Link
                href={card.href}
                onClick={(e) => e.stopPropagation()}
                className="w-full py-1 text-[8px] sm:py-2.5 sm:text-xs rounded-lg bg-white hover:bg-[#f6f5f1] text-[#393f44] font-sans font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm active:scale-98"
              >
                <span>Explore Collection</span>
                <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#C59B27]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
