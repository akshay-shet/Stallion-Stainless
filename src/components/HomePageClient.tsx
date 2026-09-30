"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PRODUCTS, getMergedProducts, Product } from "@/data/products";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
} from "lucide-react";
import { useLenis } from "@/components/SmoothScroll";
import BespokeHoloCard from "@/components/BespokeHoloCard";
import ArchitecturalEmbers from "@/components/ArchitecturalEmbers";

interface HomePageClientProps {
  isAndroid?: boolean;
}

export default function HomePageClient({ isAndroid = false }: HomePageClientProps) {
  const router = useRouter();
  const lenis = useLenis();
  const [isAndroidView, setIsAndroidView] = useState(isAndroid);

  // ── Intro video state ────────────────────────────────────────────────────────
  const [showIntro, setShowIntro] = useState(() => (isAndroid ? false : true));
  const [fadeOut, setFadeOut] = useState(false);
  const [isIntroLogoPhase, setIsIntroLogoPhase] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const skippedRef = useRef(false);

  // Detect mobile on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || "";
      const isMobile = /Android/i.test(ua) || window.innerWidth < 768;
      if (isMobile) {
        setIsAndroidView(true);
        setShowIntro(false);
        document.body.style.overflow = "unset";
      }
    }
  }, [isAndroid]);

  const handleSkip = React.useCallback(() => {
    if (skippedRef.current) return;
    skippedRef.current = true;
    setFadeOut(true);
    if (typeof window !== "undefined") {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.documentElement.classList.remove("intro-active");
      const el = document.getElementById("stallion-intro-screen");
      if (el) el.classList.add("stallion-dismissed");
    }
    lenis?.start();
    if (introVideoRef.current) {
      try { introVideoRef.current.pause(); } catch {}
    }
    setTimeout(() => {
      setShowIntro(false);
      setIsIntroLogoPhase(false);
      lenis?.start();
    }, 600);
  }, [lenis]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__stallionDismissIntro = handleSkip;
    }
  }, [handleSkip]);

  useEffect(() => {
    if (isAndroid) {
      setShowIntro(false);
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.documentElement.classList.remove("intro-active");
      lenis?.start();
      return;
    }
    if (showIntro && !fadeOut) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.classList.add("intro-active");
      lenis?.stop();
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.documentElement.classList.remove("intro-active");
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.documentElement.classList.remove("intro-active");
      lenis?.start();
    };
  }, [showIntro, fadeOut, isAndroid, lenis]);

  useEffect(() => {
    if (isAndroid || !showIntro) return;
    const vid = introVideoRef.current;
    if (vid) {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;
      const p = vid.play();
      if (p !== undefined) {
        p.catch(() => { if (vid) { vid.muted = true; vid.play().catch(() => {}); } });
      }
    }
    const timer = setTimeout(() => { handleSkip(); }, 10800);
    return () => clearTimeout(timer);
  }, [showIntro, handleSkip, isAndroid]);

  const playHeroVideo = !showIntro;

  // ── Products ─────────────────────────────────────────────────────────────────
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  useEffect(() => { setProductList(getMergedProducts()); }, []);

  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const toggleCardFlip = (id: string) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  const proProducts = Array.from(
    new Map(
      productList
        .filter((p) =>
          ["aston", "mesa", "belair", "capri", "baron", "bruno", "cairo", "bond"].includes(p.id) ||
          (p.id.startsWith("custom-") && (p as any).isPro)
        )
        .map((p) => [p.id, p])
    ).values()
  );

  const bestSellingProducts = Array.from(
    new Map(
      productList
        .filter((p) =>
          ["aris", "aura", "chester", "atlas", "brio", "bliss", "belair", "aston"].includes(p.id) ||
          (p.id.startsWith("custom-") && (p as any).isBestSelling)
        )
        .map((p) => [p.id, p])
    ).values()
  );

  const proScrollRef = useRef<HTMLDivElement>(null);
  const bestSellingScrollRef = useRef<HTMLDivElement>(null);

  const scrollSection = React.useCallback((ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  // ── Data ──────────────────────────────────────────────────────────────────────
  const offerCards = [
    {
      id: "chairs",
      title: "Chairs & Lounges",
      subtitle: "Surgical 304 Stainless • Italian Upholstery",
      image: "/lineups/architectural_lounge_chairs.jpg",
      badge: "Ergonomic Craft",
      description: "Sculptural armchairs engineered with surgical-grade 304 stainless steel framing, high-density comfort core, and Italian upholstery.",
      bullets: ["Solid 304 Stainless Steel Frame","PVD Gold, Rose & Silver Finishes","12+ Velvet & Bouclé Swatches","High-Density Ergonomic Core","Hand-Polished Seamless Joints","Load Tested to 250kg Capacity","Scratch & Fingerprint Resistant Coating","Custom Millimeter Dimensions Available"],
      href: "/collections?category=chairs"
    },
    {
      id: "dining",
      title: "Dining Tables",
      subtitle: "Natural Italian Marble • Chamfered Trestles",
      image: "/lineups/architectural_dining_table.jpg",
      badge: "Italian Marble & PVD",
      description: "Dramatic geometric centerpieces featuring imported Italian marble tops, chamfered precision edges, and indestructible stainless steel trestles.",
      bullets: ["Italian Natural & Engineered Marble","Nano-Sealed Scratch Resistance","Custom 6, 8 & 10 Seater Lengths","Heavy-Duty 304 Stainless Steel Base","Chamfered Polished Edge Profiles","Heat & Stain Impervious Surface","Anti-Deflection Structural Steel Core","Seamless Mirror & Brushed PVD Finishes"],
      href: "/collections?category=dining-table"
    },
    {
      id: "sofas",
      title: "Modular Sofas",
      subtitle: "Multi-Density Cushioning • Tailored Sectionals",
      image: "/lineups/sofa.jpg",
      badge: "Deep Modular Seating",
      description: "Expansive luxury sectionals with cloud-like multi-density cushioning, reinforced stainless steel substructures, and tailored silhouette lines.",
      bullets: ["High-Resilience Cold-Cure Foam","Hand-Polished Mirror Welds","Stain-Repellent Belgian Velvets","Internal Reinforced Steel Chassis","Modular Multi-Configuration Layouts","Sag-Free Sinuous Spring System","Hypoallergenic Reversible Cushions","Double-Stitched Reinforced Seams"],
      href: "/collections?category=sofa"
    },
    {
      id: "partitions",
      title: "Partitions & Consoles",
      subtitle: "Laser-Cut Filigree • Floor-to-Ceiling Mounts",
      image: "/lineups/architectural_partition_console.jpg",
      badge: "Spatial Dividers",
      description: "Architectural laser-cut stainless screens and entryway consoles designed to create light-permeable boundaries in open-concept spaces.",
      bullets: ["Parametric Laser-Cut Filigree","Floor-to-Ceiling Tension Mounts","Titanium PVD Scratch-Free Finish","Integrated Warm LED Channel Ready","Acoustic Dampening Infill Option","CNC-Engineered Sub-Millimeter Fit","Double-Sided Architectural Profile","Zero Exposed Fastener Engineering"],
      href: "/collections?category=partition-console"
    },
    {
      id: "coffee",
      title: "Coffee & Accent Tables",
      subtitle: "12mm Toughened Fluted Glass • Titanium PVD",
      image: "/lineups/architectural_coffee_table.jpg",
      badge: "Geometric Glass & Metal",
      description: "Fluted tempered glass and brushed titanium coffee tables anchoring living spaces with architectural weight and visual clarity.",
      bullets: ["12mm Toughened Fluted Glass","Dual-Tier Architectural Storage","Anti-Corrosion Vacuum Plating","Mirror-Polished Stainless Steel Legs","Shatterproof Safety Lamination","Water-Ring & Thermal Shock Proof","Concealed Silicone Shock Mounts","Geometric Nesting Configurations"],
      href: "/collections?category=coffee-corner-table"
    },
    {
      id: "themed",
      title: "Bespoke Themed Concepts",
      subtitle: "Custom 3D CAD Blueprinting • Master Fabrication",
      image: "/lineups/architectural_themed_credenza.jpg",
      badge: "Architectural Series",
      description: "Commissioned concepts co-created with architects and interior designers for one-of-a-kind luxury penthouses and hospitality suites.",
      bullets: ["Full CAD & 3D Visual Curation","Bespoke Millimeter Dimensions","On-Site White-Glove Installation","Architectural Penthouse Curation","Direct Master Fabricator Consultation","Structural Lifetime Guarantee","Custom Emblem & Crest Engraving","Certified Metallurgy & Finish Dossier"],
      href: "/collections?category=themed"
    }
  ];

  const lineups = [
    { name: "Sofa", href: "/collections?category=sofa", image: "/lineups/sofa.jpg", subtitle: "Modular Sectionals & Deep Living" },
    { name: "Accent & Recliner", href: "/collections?category=accent-recliner", image: "/lineups/accent_recliner.png", subtitle: "Sculptural Armchairs & Lounges" },
    { name: "Coffee & Corner Table", href: "/collections?category=coffee-corner-table", image: "/lineups/architectural_coffee_table.jpg", subtitle: "Geometric Glass & Stainless Craft" },
    { name: "Dining Table", href: "/collections?category=dining-table", image: "/lineups/architectural_dining_table.jpg", subtitle: "Italian Marble & PVD Stainless" },
    { name: "Partition & Console", href: "/collections?category=partition-console", image: "/lineups/architectural_partition_console.jpg", subtitle: "Spatial Screens & Entryway Consoles" },
    { name: "Chairs", href: "/collections?category=chairs", image: "/lineups/architectural_lounge_chairs.jpg", subtitle: "Stainless Steel Pillars & Velvet" },
    { name: "Themed", href: "/collections?category=themed", image: "/lineups/architectural_merchandising.jpg", subtitle: "Bespoke Architectural Concepts" },
    { name: "Merchandising", href: "/collections?category=merchandising", image: "/lineups/architectural_themed_credenza.jpg", subtitle: "Signature Curated Series" }
  ];

  const articles = [
    { title: "The Art of PVD Stainless Steel: Why Titanium Coatings Outlast Traditional Metalwork", date: "September 18, 2026", readTime: "4 min read", image: "/lineups/architectural_pvd_craft.jpg", tag: "Material Science", snippet: "Discover how physical vapor deposition embeds titanium alloys into 304 steel at the atomic level, delivering lifelong luster and zero tarnishing." },
    { title: "Sectional Sophistication: Choosing Between Modular Chaises and Traditional Lounges", date: "September 12, 2026", readTime: "6 min read", image: "/lineups/sofa.jpg", tag: "Living Design", snippet: "How to balance open floor circulation, deep seat ergonomics, and architectural metal sightlines in contemporary open-plan spaces." },
    { title: "Spatial Separation: How Decorative Metal Partitions Transform Open-Plan Living", date: "August 29, 2026", readTime: "5 min read", image: "/lineups/architectural_partition_console.jpg", tag: "Space Planning", snippet: "Parametric laser-cut screens introduce intimate entertaining zones while allowing natural sunlight and open sightlines to breathe." }
  ];

  const galleryImages = [
    { src: "/lineups/sofa.jpg", title: "Modular Sectional Lounge", tag: "Living Space" },
    { src: "/lineups/architectural_dining_table.jpg", title: "Italian Marble Dining Suite", tag: "Dining Architecture" },
    { src: "/lineups/architectural_lounge_chairs.jpg", title: "Sculptural Velvet Armchairs", tag: "Accent Seating" },
    { src: "/lineups/architectural_coffee_table.jpg", title: "Geometric Glass Coffee Table", tag: "Centerpiece" },
    { src: "/lineups/architectural_partition_console.jpg", title: "Architectural Partition & Console", tag: "Foyer Screen" },
    { src: "/lineups/architectural_themed_credenza.jpg", title: "Bespoke Architectural Suite", tag: "Themed Series" }
  ];

  const loopedGalleryImages = [...galleryImages, ...galleryImages, ...galleryImages];
  const galleryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAndroidView) return;
    const el = galleryScrollRef.current;
    const timer = setTimeout(() => {
      if (el) {
        const loopWidth = el.scrollWidth / 3;
        if (loopWidth > 0) el.scrollLeft = loopWidth;
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [isAndroidView]);

  const handleGalleryScroll = React.useCallback(() => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const loopWidth = el.scrollWidth / 3;
    if (loopWidth <= 0) return;
    if (el.scrollLeft >= loopWidth * 2) el.scrollLeft -= loopWidth;
    else if (el.scrollLeft <= 5) el.scrollLeft += loopWidth;
  }, []);

  const scrollGallery = React.useCallback((direction: "left" | "right") => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const itemWidth = el.clientWidth / 3;
    el.scrollBy({ left: direction === "left" ? -itemWidth : itemWidth, behavior: "smooth" });
  }, []);

  // ── Scroll-reveal animation state ────────────────────────────────────────────
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealedSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    const els = document.querySelectorAll("[data-reveal]");
    els.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const reveal = (id: string) =>
    revealedSections.has(id)
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-8";

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] text-[#111111] relative overflow-x-hidden w-full max-w-full">

      {/* ── Intro Video Overlay ─────────────────────────────────────────────── */}
      {!isAndroid && showIntro && (
        <div
          id="stallion-intro-screen"
          className={`stallion-intro-container stallion-intro-anim fixed inset-0 z-[9999] bg-[#f1f3f3] flex items-center justify-center transition-opacity duration-700 select-none overflow-hidden w-screen h-screen ${
            fadeOut ? "opacity-0 pointer-events-none stallion-dismissed" : "opacity-100 pointer-events-auto"
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-stone-400 pointer-events-none z-0">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 animate-spin rounded-full" />
            <span className="font-sans text-xs tracking-wider uppercase text-stone-500">Loading Stallion Intro...</span>
          </div>
          <div className={`relative w-full h-full max-w-full max-h-full flex items-center justify-center z-10 pointer-events-none transition-all duration-700 ${isIntroLogoPhase ? "p-2 sm:p-4" : "p-0"}`}>
            <video
              id="stallion-intro-video"
              ref={introVideoRef}
              src="/intro.mp4"
              autoPlay muted playsInline preload="auto"
              disablePictureInPicture disableRemotePlayback
              controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
              onTimeUpdate={(e) => {
                const vid = e.currentTarget;
                if (vid.currentTime >= 6.1) { if (!isIntroLogoPhase) setIsIntroLogoPhase(true); }
                else { if (isIntroLogoPhase) setIsIntroLogoPhase(false); }
              }}
              onEnded={handleSkip}
              className={`w-full h-full max-w-full max-h-full pointer-events-auto transition-all duration-500 ${isIntroLogoPhase ? "object-contain" : "object-cover"}`}
            />
          </div>
          <div id="stallion-touch-shield" onClick={handleSkip} className="absolute inset-0 z-20 w-full h-full cursor-pointer bg-transparent" />
        </div>
      )}

      <Header />

      <main className="flex-grow relative z-10 w-full min-w-0 overflow-x-hidden">

        {/* ══════════════════════════════════════════════════════════════════════
            HERO — Full-bleed cinematic video (Kage: full viewport presence)
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          className={`relative w-full ${
            isAndroidView ? "h-auto aspect-video" : "h-screen min-h-[600px]"
          } bg-stone-950 flex items-center justify-center overflow-hidden`}
        >
          {/* Video layer */}
          <div className={isAndroidView ? "relative w-full h-auto aspect-video" : "absolute inset-0"}>
            {playHeroVideo && (
              <>
                <video
                  src="/hero_video.mp4"
                  autoPlay muted playsInline loop
                  disablePictureInPicture disableRemotePlayback
                  controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                  className={`w-full ${
                    isAndroidView
                      ? "h-auto aspect-video block object-contain"
                      : "h-full object-cover absolute inset-0"
                  } pointer-events-none`}
                />
                <div className="absolute inset-0 z-10 pointer-events-auto" />
              </>
            )}
          </div>

          {/* Cinematic overlays — no text, pure architectural UI decoration */}
          {!isAndroidView && (
            <>
              {/* Radial vignette — dark edges, clear centre */}
              <div
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(17,17,17,0.55) 100%)",
                }}
              />

              {/* Top-left corner bracket */}
              <div className="absolute top-8 left-8 z-30 pointer-events-none hidden lg:block">
                <div className="w-10 h-10 border-t-2 border-l-2 border-[#C59B27]/70" />
              </div>
              {/* Top-right corner bracket */}
              <div className="absolute top-8 right-8 z-30 pointer-events-none hidden lg:block">
                <div className="w-10 h-10 border-t-2 border-r-2 border-[#C59B27]/70" />
              </div>
              {/* Bottom-left corner bracket */}
              <div className="absolute bottom-8 left-8 z-30 pointer-events-none hidden lg:block">
                <div className="w-10 h-10 border-b-2 border-l-2 border-[#C59B27]/70" />
              </div>
              {/* Bottom-right corner bracket */}
              <div className="absolute bottom-8 right-8 z-30 pointer-events-none hidden lg:block">
                <div className="w-10 h-10 border-b-2 border-r-2 border-[#C59B27]/70" />
              </div>

              {/* Centred crosshair reticle */}
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none hidden lg:flex">
                <div className="relative w-16 h-16">
                  {/* Horizontal arm */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2" />
                  {/* Vertical arm */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />
                  {/* Centre dot — pulsing gold */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#C59B27] animate-ping opacity-70" />
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
                  </div>
                </div>
              </div>

              {/* Bottom gold rule — full width accent line */}
              <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
                <div className="h-[3px] bg-gradient-to-r from-transparent via-[#C59B27] to-transparent opacity-80" />
              </div>

              {/* Left edge vertical tick marks — architectural detail */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden lg:flex flex-col gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white/30"
                    style={{ width: i === 2 ? "20px" : "10px", height: "1px" }}
                  />
                ))}
              </div>
              {/* Right edge vertical tick marks */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden lg:flex flex-col gap-2 items-end">
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
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            MANIFESTO STRIP — Kage-style full-width text ribbon
        ══════════════════════════════════════════════════════════════════════ */}
        {!isAndroidView && (
          <section className="w-full bg-[#111111] py-5 overflow-hidden border-y border-[#C59B27]/20">
            <div className="flex gap-16 items-center whitespace-nowrap animate-[marqueeScroll_30s_linear_infinite]" style={{ width: "max-content" }}>
              {["Precision Fabrication", "304 Surgical Steel", "PVD Titanium Finish", "Italian Marble", "Bespoke Commissioned", "Hand-Polished Joints", "Lifetime Guarantee", "Architectural Grade", "Precision Fabrication", "304 Surgical Steel", "PVD Titanium Finish", "Italian Marble", "Bespoke Commissioned", "Hand-Polished Joints", "Lifetime Guarantee", "Architectural Grade"].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                  {item}
                  <span className="text-[#C59B27] text-base">◆</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 1 — About Stallion (Kage: bold editorial split)
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          className={`w-full bg-[#f0f0f0] border-b border-[#d7d8d2] ${
            isAndroidView ? "py-8 px-4" : "py-20 sm:py-28 px-6 sm:px-12 lg:px-20"
          } relative overflow-hidden`}
        >
          {/* Decorative schematic ghost */}
          <div className="absolute right-0 top-0 w-[480px] h-[480px] opacity-[0.025] pointer-events-none select-none hidden lg:block">
            <Image src="/schematics/three_seater.png" alt="" fill className="object-contain" />
          </div>

          <div className="max-w-[1600px] mx-auto">
            {isAndroidView ? (
              /* ── Android layout ── */
              <div className="flex flex-col gap-5">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#C59B27]">Our Philosophy</span>
                  <h2 className="font-display text-2xl font-bold text-[#111111] tracking-tight mt-1 leading-tight">
                    Authentic, Quality &amp; Luxury Interior Furniture
                  </h2>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed mt-2">
                    Stallion Stainless represents the synthesis of architectural rigor and luxurious domestic living. We combine surgical-grade 304 stainless steel, vacuum PVD finishes, and bespoke Italian upholstery to engineer furniture that transcends trends.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: <Sparkles className="w-4 h-4 text-[#C59B27]" />, label: "Exclusive Design", sub: "Precision CAD" },
                    { icon: <ShieldCheck className="w-4 h-4 text-[#C59B27]" />, label: "Professional Team", sub: "Master Artisans" },
                    { icon: <HeartHandshake className="w-4 h-4 text-[#C59B27]" />, label: "Reasonable Prices", sub: "Factory Direct" },
                  ].map((f, i) => (
                    <div key={i} className="bg-white rounded-lg p-2.5 border border-[#dcd7d1] flex flex-col items-center text-center gap-1.5">
                      <div className="w-7 h-7 rounded-md bg-[#f6f5f1] border border-[#e5e3dd] flex items-center justify-center">{f.icon}</div>
                      <span className="font-display text-[9.5px] font-bold text-[#111111] uppercase tracking-tight leading-tight">{f.label}</span>
                      <span className="font-mono text-[7.5px] uppercase tracking-wide text-[#5e606c]">{f.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Desktop layout: Kage-style big number + split ── */
              <div className="grid grid-cols-12 gap-10 lg:gap-16 items-center">
                {/* Left: massive typographic number + label — Kage editorial */}
                <div className="col-span-5 flex flex-col">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#C59B27] flex items-center gap-2 mb-6">
                    <span className="inline-block w-8 h-px bg-[#C59B27]" />
                    Our Philosophy
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight leading-tight mb-6">
                    Authentic,<br />Quality &amp; Luxury<br />Interior Furniture
                  </h2>
                  <p className="font-sans text-sm text-stone-600 leading-relaxed mb-8 max-w-md">
                    Stallion Stainless represents the synthesis of architectural rigor and luxurious domestic living. We combine surgical-grade 304 stainless steel framing, vacuum PVD finishes, and bespoke Italian upholstery to engineer furniture that transcends trends.
                  </p>
                  <blockquote className="border-l-2 border-[#C59B27] pl-5 py-1">
                    <p className="font-sans text-sm text-[#5e606c] italic leading-relaxed">
                      &ldquo;Where heavy-duty structural steel meets cloud-soft tailored upholstery for multi-generational spaces.&rdquo;
                    </p>
                  </blockquote>
                </div>

                {/* Right: 3 Feature tiles — tall editorial cards */}
                <div className="col-span-7 grid grid-cols-3 gap-5">
                  {[
                    { icon: <Sparkles className="w-6 h-6 text-[#C59B27]" />, title: "Exclusive Design", body: "A harmonious mixture of imagination, structural engineering, and artisan perfection behind our signature silhouettes.", foot: "Precision CAD" },
                    { icon: <ShieldCheck className="w-6 h-6 text-[#C59B27]" />, title: "Professional Team", body: "We are proud of our dedicated team of master fabricators, welders, and interior designers — consistently evolving.", foot: "Master Artisans" },
                    { icon: <HeartHandshake className="w-6 h-6 text-[#C59B27]" />, title: "Reasonable Prices", body: "Direct manufacturer-to-home luxury with transparent, fair pricing and zero retail markups, without compromising quality.", foot: "Factory Direct" },
                  ].map((f, i) => (
                    <div key={i} className="group bg-white border border-[#dcd7d1] hover:border-[#C59B27]/50 hover:shadow-lg transition-all duration-400 flex flex-col p-6 rounded-xl gap-5">
                      <div className="w-11 h-11 rounded-lg bg-[#f6f5f1] border border-[#e5e3dd] flex items-center justify-center group-hover:bg-[#111111] transition-colors duration-300">
                        {f.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider mb-2">{f.title}</h3>
                        <p className="font-sans text-xs text-stone-500 leading-relaxed">{f.body}</p>
                      </div>
                      <div className="border-t border-stone-100 pt-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#5e606c]">{f.foot}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 2 — Bespoke Collections (Holo Cards, bg-[#c4c4be])
            Kage: immersive full-section experience
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          className={`w-full bg-[#c4c4be] ${
            isAndroidView ? "py-8 px-3 sm:px-6" : "py-20 sm:py-28 px-6 sm:px-12 lg:px-20"
          } border-b border-[#b0b0a8] relative overflow-hidden`}
        >
          <ArchitecturalEmbers />

          <div className="max-w-[1600px] mx-auto relative z-10">
            {/* Section header — Kage oversized label style */}
            <div className={`${isAndroidView ? "mb-6" : "mb-14 sm:mb-20"}`}>
              {!isAndroidView && (
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#5e606c] flex items-center gap-2 mb-4">
                  <span className="inline-block w-8 h-px bg-[#5e606c]" />
                  Collection Index
                </span>
              )}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <h2 className={`font-display ${isAndroidView ? "text-2xl" : "text-3xl sm:text-4xl lg:text-6xl"} font-bold text-[#2d394b] tracking-tight uppercase leading-none`}>
                  Bespoke Architectural<br className="hidden sm:block" /> Collections
                </h2>
                {!isAndroidView && (
                  <p className="font-sans text-xs text-stone-700 max-w-xs leading-relaxed text-right hidden sm:block">
                    Hover or click any collection card to inspect architectural details &amp; materials.
                  </p>
                )}
              </div>
              {isAndroidView && (
                <p className="font-sans text-[10px] text-stone-700 mt-1.5">
                  Tap any card to flip and view specifications.
                </p>
              )}
              {/* Kage-style horizontal rule */}
              <div className="mt-6 h-px bg-gradient-to-r from-[#2d394b]/40 via-[#C59B27]/50 to-transparent" />
            </div>

            {/* 6-card grid */}
            <div className={`grid ${isAndroidView ? "grid-cols-2 gap-2 sm:gap-6" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"}`}>
              {offerCards.map((card) => (
                <BespokeHoloCard
                  key={card.id}
                  card={card}
                  isAndroidView={isAndroidView}
                  isFlipped={flippedCardId === card.id}
                  onToggleFlip={(id) => toggleCardFlip(id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 3 — Architectural Lineups + Products (bg-[#f6f5f1])
            Kage: numbered index + cinematic reveal
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          className={`w-full bg-[#f6f5f1] ${
            isAndroidView ? "py-8 px-3 sm:px-6" : "py-20 sm:py-28 px-6 sm:px-12 lg:px-20"
          } border-b border-[#e5e3dd]`}
        >
          <div className="max-w-[1680px] mx-auto">
            {/* Section header */}
            <div className={`${isAndroidView ? "mb-5" : "mb-12 sm:mb-16"}`}>
              {!isAndroidView && (
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C59B27] flex items-center gap-2 mb-4">
                  <span className="inline-block w-8 h-px bg-[#C59B27]" />
                  Lineup Index
                </span>
              )}
              <h2 className={`font-display ${isAndroidView ? "text-2xl" : "text-3xl sm:text-4xl lg:text-5xl"} font-bold text-[#111111] uppercase tracking-tight`}>
                Our Architectural Lineups
              </h2>
              <div className="mt-4 h-px bg-gradient-to-r from-[#111111]/30 via-[#C59B27]/40 to-transparent" />
            </div>

            {/* Lineups grid */}
            {isAndroidView ? (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {lineups.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="w-[calc((100%-16px)/3)] group relative bg-white rounded-lg overflow-hidden border border-stone-200/90 hover:border-stone-400/90 shadow-2xs transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                    <div className="py-1.5 px-1 text-center flex-1 flex flex-col justify-center bg-white relative">
                      <h3 className="font-display text-[10px] leading-tight font-semibold text-[#111111] uppercase tracking-wider line-clamp-2 text-center">{item.name}</h3>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop: Kage-style numbered list grid */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-20">
                {lineups.map((item, idx) => (
                  <div
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="group relative bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-[#C59B27]/60 shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-2"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      {/* Kage-style index number overlay */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-white/60 bg-black/30 px-1.5 py-0.5 backdrop-blur-sm">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-sm">
                        <ArrowUpRight className="w-4 h-4 text-[#C59B27]" />
                      </div>
                    </div>
                    <div className="py-3 px-4 flex-1 flex flex-col justify-center bg-white relative">
                      <h3 className="font-display text-sm font-bold text-[#111111] uppercase tracking-wider group-hover:text-[#5e606c] transition-colors text-center">{item.name}</h3>
                      <p className="font-sans text-[11px] text-stone-500 tracking-wide mt-0.5 text-center">{item.subtitle}</p>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── PREMIER GRADE ──────────────────────────────────────────────── */}
            <div id="pro-collection" className={`${isAndroidView ? "pt-4 pb-6" : "pt-6 pb-14"} border-t border-stone-200/80`}>
              <div className={`flex items-center justify-between ${isAndroidView ? "mb-3" : "mb-6 sm:mb-8"}`}>
                <div className="flex flex-col gap-0.5">
                  {!isAndroidView && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#C59B27]">Curated Series</span>
                  )}
                  <Link href="/pro-collection" className="group inline-block">
                    <h3 className={`font-display ${isAndroidView ? "text-lg" : "text-2xl sm:text-3xl"} font-bold text-[#111111] uppercase tracking-widest group-hover:text-[#5e606c] transition-colors`}>
                      Premier Grade
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link href="/pro-collection" className="hidden sm:inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#5e606c] hover:text-[#111111] tracking-wider uppercase transition-colors">
                    <span>View Full Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => scrollSection(proScrollRef, "left")} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer" aria-label="Scroll left">
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
                    </button>
                    <button type="button" onClick={() => scrollSection(proScrollRef, "right")} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer" aria-label="Scroll right">
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
                    </button>
                  </div>
                </div>
              </div>

              <div ref={proScrollRef} className={`flex overflow-x-auto ${isAndroidView ? "gap-2" : "gap-5 sm:gap-6"} pb-3 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory no-scrollbar w-full`}>
                {proProducts.map((product) =>
                  isAndroidView ? (
                    <article key={product.id} className="w-[calc((100vw-3.2rem)/3)] min-w-[108px] max-w-[130px] shrink-0 snap-start bg-white rounded-lg overflow-hidden border border-stone-200 shadow-2xs flex flex-col">
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image src={product.images?.[0] || "/products/aris/H.jpg"} alt={product.name} fill className="object-cover" sizes="33vw" />
                        </div>
                        <div className="py-1.5 px-1 flex-1 flex flex-col justify-between bg-white">
                          <h4 className="font-display text-[9.5px] font-bold text-[#111111] uppercase tracking-wider truncate text-center">{product.name}</h4>
                          <div className="flex items-center justify-center gap-1 pt-1 border-t border-stone-100">
                            {product.colors.slice(0, 4).map((color) => (
                              <div key={color.name} className="w-2 h-2 rounded-full border border-stone-300" style={{ backgroundColor: color.hex }} title={color.name} />
                            ))}
                            {product.colors.length > 4 && <span className="text-[7.5px] font-mono text-stone-400">+{product.colors.length - 4}</span>}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ) : (
                    <article key={product.id} className="w-[calc((100%-4.5rem)/4)] min-w-[270px] max-w-[340px] shrink-0 snap-start group bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-[#C59B27]/50 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-2">
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image src={product.images?.[0] || "/products/aris/H.jpg"} alt={product.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="25vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-sm">
                            <ArrowUpRight className="w-4 h-4 text-[#C59B27]" />
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between bg-white relative">
                          <div>
                            <h4 className="font-display text-base font-bold text-[#111111] uppercase tracking-wider group-hover:text-[#5e606c] transition-colors text-center">{product.name}</h4>
                            <p className="font-sans text-xs text-stone-500 tracking-wide line-clamp-1 mt-0.5 mb-3 text-center">{product.tagline}</p>
                          </div>
                          <div className="flex items-center justify-center pt-2.5 border-t border-stone-100">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {product.colors.slice(0, 5).map((color) => (
                                <div key={color.name} className="w-3 h-3 rounded-full border border-stone-300 transition-transform group-hover:scale-110" style={{ backgroundColor: color.hex }} title={color.name} />
                              ))}
                              {product.colors.length > 5 && <span className="text-[9px] font-mono text-stone-400">+{product.colors.length - 5}</span>}
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                      </Link>
                    </article>
                  )
                )}
              </div>
            </div>

            {/* ── BEST SELLING ──────────────────────────────────────────────── */}
            <div id="best-selling" className={`${isAndroidView ? "pt-5" : "pt-8 sm:pt-10"} border-t border-stone-200/80`}>
              <div className={`flex items-center justify-between ${isAndroidView ? "mb-3" : "mb-6 sm:mb-8"}`}>
                <div className="flex flex-col gap-0.5">
                  {!isAndroidView && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#C59B27]">Top Performers</span>
                  )}
                  <Link href="/best-selling" className="group inline-block">
                    <h3 className={`font-display ${isAndroidView ? "text-lg" : "text-2xl sm:text-3xl"} font-bold text-[#111111] uppercase tracking-widest group-hover:text-[#5e606c] transition-colors`}>
                      Best Selling
                    </h3>
                  </Link>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link href="/best-selling" className="hidden sm:inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#5e606c] hover:text-[#111111] tracking-wider uppercase transition-colors">
                    <span>View Full Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => scrollSection(bestSellingScrollRef, "left")} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer" aria-label="Scroll left">
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
                    </button>
                    <button type="button" onClick={() => scrollSection(bestSellingScrollRef, "right")} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer" aria-label="Scroll right">
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
                    </button>
                  </div>
                </div>
              </div>

              <div ref={bestSellingScrollRef} className={`flex overflow-x-auto ${isAndroidView ? "gap-2" : "gap-5 sm:gap-6"} pb-3 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory no-scrollbar w-full`}>
                {bestSellingProducts.map((product) =>
                  isAndroidView ? (
                    <article key={product.id} className="w-[calc((100vw-3.2rem)/3)] min-w-[108px] max-w-[130px] shrink-0 snap-start bg-white rounded-lg overflow-hidden border border-stone-200 shadow-2xs flex flex-col">
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image src={product.images?.[0] || "/products/aris/H.jpg"} alt={product.name} fill className="object-cover" sizes="33vw" />
                        </div>
                        <div className="py-1.5 px-1 flex-1 flex flex-col justify-between bg-white">
                          <h4 className="font-display text-[9.5px] font-bold text-[#111111] uppercase tracking-wider truncate text-center">{product.name}</h4>
                          <div className="flex items-center justify-center gap-1 pt-1 border-t border-stone-100">
                            {product.colors.slice(0, 4).map((color) => (
                              <div key={color.name} className="w-2 h-2 rounded-full border border-stone-300" style={{ backgroundColor: color.hex }} title={color.name} />
                            ))}
                            {product.colors.length > 4 && <span className="text-[7.5px] font-mono text-stone-400">+{product.colors.length - 4}</span>}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ) : (
                    <article key={product.id} className="w-[calc((100%-4.5rem)/4)] min-w-[270px] max-w-[340px] shrink-0 snap-start group bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-[#C59B27]/50 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-2">
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image src={product.images?.[0] || "/products/aris/H.jpg"} alt={product.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="25vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 shadow-sm">
                            <ArrowUpRight className="w-4 h-4 text-[#C59B27]" />
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between bg-white relative">
                          <div>
                            <h4 className="font-display text-base font-bold text-[#111111] uppercase tracking-wider group-hover:text-[#5e606c] transition-colors text-center">{product.name}</h4>
                            <p className="font-sans text-xs text-stone-500 tracking-wide line-clamp-1 mt-0.5 mb-3 text-center">{product.tagline}</p>
                          </div>
                          <div className="flex items-center justify-center pt-2.5 border-t border-stone-100">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {product.colors.slice(0, 5).map((color) => (
                                <div key={color.name} className="w-3 h-3 rounded-full border border-stone-300 transition-transform group-hover:scale-110" style={{ backgroundColor: color.hex }} title={color.name} />
                              ))}
                              {product.colors.length > 5 && <span className="text-[9px] font-mono text-stone-400">+{product.colors.length - 5}</span>}
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                      </Link>
                    </article>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 4 — Full-width editorial mid-break (Kage: scene transition)
            Desktop only — full-bleed image with overlay text
        ══════════════════════════════════════════════════════════════════════ */}
        {!isAndroidView && (
          <section className="w-full h-[52vh] min-h-[380px] relative overflow-hidden border-b border-[#d2d2cc]">
            <Image
              src="/lineups/architectural_dining_table.jpg"
              alt="Stallion Stainless craftsmanship"
              fill
              className="object-cover scale-105"
              sizes="100vw"
            />
            {/* Kage-style editorial overlay — ivory tinted, not black */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FDFCFB]/88 via-[#FDFCFB]/50 to-transparent" />
            <div className="absolute inset-0 flex items-center px-12 lg:px-20">
              <div className="max-w-xl">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C59B27] flex items-center gap-2 mb-5">
                  <span className="inline-block w-8 h-px bg-[#C59B27]" />
                  The Stallion Standard
                </span>
                <h2 className="font-display text-4xl lg:text-5xl font-bold text-[#111111] leading-tight tracking-tight mb-5">
                  Crafted to<br />Outlast Generations
                </h2>
                <p className="font-sans text-sm text-stone-700 leading-relaxed mb-7 max-w-sm">
                  Every Stallion piece is engineered with surgical precision — 304 stainless steel substrates, vacuum-deposited PVD finishes, and hand-stitched Italian upholstery that holds its form through decades of daily living.
                </p>
                <Link
                  href="/collections"
                  className="group inline-flex items-center gap-2 text-xs font-display font-bold uppercase tracking-widest text-[#111111] border-b-2 border-[#C59B27] pb-0.5 hover:text-[#C59B27] transition-colors"
                >
                  Browse the Full Range
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 5 — News & Craft Journal (hidden on Android)
        ══════════════════════════════════════════════════════════════════════ */}
        {!isAndroidView && (
          <section className="w-full bg-[#e8e8e3] py-20 sm:py-24 px-6 sm:px-12 lg:px-20 border-b border-[#d2d2cc]">
            <div className="max-w-[1600px] mx-auto">
              <div className="mb-12 sm:mb-16">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#5e606c] flex items-center gap-2 mb-4">
                  <span className="inline-block w-8 h-px bg-[#5e606c]" />
                  Craft Journal
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] uppercase tracking-tight">
                  News &amp; Craft Journal
                </h2>
                <div className="mt-4 h-px bg-gradient-to-r from-[#111111]/30 via-[#C59B27]/40 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {articles.map((art, idx) => (
                  <article key={idx} className="group bg-white rounded-xl overflow-hidden border border-[#d2d2cc] hover:border-[#C59B27]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                      <Image src={art.image} alt={art.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono font-bold uppercase tracking-wider text-[#5e606c]">{art.tag}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-stone-400 text-[11px] font-mono">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#C59B27]" />{art.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{art.readTime}</span>
                      </div>
                      <h3 className="font-display text-sm font-bold text-[#111111] group-hover:text-[#5e606c] transition-colors line-clamp-2">{art.title}</h3>
                      <p className="font-sans text-xs text-stone-500 leading-relaxed line-clamp-3">{art.snippet}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            SECTION 6 — Living Gallery Strip (bg-[#393f44])
            Kage: full-bleed cinematic finale
        ══════════════════════════════════════════════════════════════════════ */}
        <section className={`w-full bg-[#393f44] text-white ${isAndroidView ? "pt-5 sm:pt-8" : "pt-12 sm:pt-16"} pb-0 overflow-hidden`}>
          <div className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 ${isAndroidView ? "mb-4" : "mb-8"}`}>
            {!isAndroidView && (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C59B27] flex items-center gap-2 mb-4">
                <span className="inline-block w-8 h-px bg-[#C59B27]" />
                Spatial Gallery
              </span>
            )}
            <div className="flex items-end justify-between">
              <h3 className={`font-display ${isAndroidView ? "text-base sm:text-xl" : "text-2xl sm:text-3xl"} font-bold uppercase tracking-wider text-white`}>
                Architectural Living Spaces
              </h3>
              {!isAndroidView && (
                <Link href="/collections" className="group inline-flex items-center gap-1 text-xs font-sans font-semibold text-white/50 hover:text-white tracking-wider uppercase transition-colors">
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-white/20 via-[#C59B27]/40 to-transparent" />
          </div>

          {/* Desktop: 6-column strip */}
          <div className={`${isAndroidView ? "hidden lg:grid" : "hidden sm:grid"} grid-cols-6 w-full`}>
            {galleryImages.map((img, i) => (
              <div key={i} className="group relative aspect-square w-full overflow-hidden bg-stone-900 cursor-pointer" onClick={() => router.push("/collections")}>
                <Image src={img.src} alt={img.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="16vw" />
                <div className="absolute inset-0 bg-[#393f44]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white">
                  <div className="text-right"><ArrowUpRight className="w-5 h-5 text-[#C59B27] inline-block" /></div>
                  <div className="text-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#C59B27] block">{img.tag}</span>
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-center">{img.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: loop scrollable */}
          <div className={`${isAndroidView ? "block lg:hidden" : "block sm:hidden"} relative w-full overflow-hidden`}>
            <button type="button" onClick={() => scrollGallery("left")} aria-label="Scroll left" className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg active:scale-90 border border-white/20">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => scrollGallery("right")} aria-label="Scroll right" className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg active:scale-90 border border-white/20">
              <ChevronRight className="w-4 h-4" />
            </button>
            <div ref={galleryScrollRef} onScroll={handleGalleryScroll} className="flex overflow-x-auto no-scrollbar w-full select-none touch-pan-x" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {loopedGalleryImages.map((img, i) => (
                <div key={i} className="w-1/3 shrink-0 relative aspect-square overflow-hidden bg-stone-900 cursor-pointer border-r border-stone-800/40" onClick={() => router.push("/collections")}>
                  <Image src={img.src} alt={img.title} fill className="object-cover" sizes="33vw" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-1.5 py-1 text-center pointer-events-none">
                    <span className="font-mono text-[7px] uppercase tracking-wider text-[#C59B27] block truncate">{img.tag}</span>
                    <h4 className="font-display text-[8.5px] font-bold uppercase tracking-tight text-white truncate leading-tight">{img.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
