"use client";

import React, { useState, useEffect } from "react";
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
  RotateCw, 
  CheckCircle2, 
  Calendar, 
  Clock,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import ParticleDrift from "@/components/originkit/ui/particle-drift";
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

  // Intro video state: runs when launched on desktop, never on Android
  const [showIntro, setShowIntro] = useState(() => {
    if (isAndroid) return false;
    return true;
  });
  const [fadeOut, setFadeOut] = useState(false);
  const [isIntroLogoPhase, setIsIntroLogoPhase] = useState(false);
  const introVideoRef = React.useRef<HTMLVideoElement>(null);
  const skippedRef = React.useRef(false);

  // Detect Android/mobile screens on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || "";
      const isMobile = /Android/i.test(ua) || window.innerWidth < 768;
      if (isMobile) {
        setIsAndroidView(true);
        // Suppress intro video completely on Android/mobile
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
      if (el) {
        el.classList.add("stallion-dismissed");
      }
    }

    lenis?.start();

    if (introVideoRef.current) {
      try {
        introVideoRef.current.pause();
      } catch (e) {}
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

  // Lock scroll while intro is playing on desktop
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

  // Desktop Intro Video Playback Control
  useEffect(() => {
    if (isAndroid || !showIntro) return;

    const vid = introVideoRef.current;
    if (vid) {
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playsInline = true;

      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay promise note - retry muted
          console.warn("Desktop intro autoplay note:", err);
          if (vid) {
            vid.muted = true;
            vid.play().catch(() => {});
          }
        });
      }
    }

    // Fail-safe transition after ~10.5 seconds (video duration is ~10.2s)
    const timer = setTimeout(() => {
      handleSkip();
    }, 10800);

    return () => {
      clearTimeout(timer);
    };
  }, [showIntro, handleSkip, isAndroid]);

  const playHeroVideo = !showIntro;

  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  useEffect(() => {
    setProductList(getMergedProducts());
  }, []);

  // State for mobile flip cards toggle
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  const toggleCardFlip = (id: string) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  // Get specific subsets of products for display cards - expanded list for rich horizontal scrolling
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

  const proScrollRef = React.useRef<HTMLDivElement>(null);
  const bestSellingScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollSection = React.useCallback((ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -el.clientWidth * 0.75 : el.clientWidth * 0.75;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  // Furnicom "What We Offer" 3D Flip Cards Data (Prices removed, images matched)
  const offerCards = [
    {
      id: "chairs",
      title: "Chairs & Lounges",
      subtitle: "Surgical 304 Stainless • Italian Upholstery",
      image: "/lineups/architectural_lounge_chairs.jpg",
      badge: "Ergonomic Craft",
      description: "Sculptural armchairs engineered with surgical-grade 304 stainless steel framing, high-density comfort core, and Italian upholstery.",
      bullets: [
        "Solid 304 Stainless Steel Frame",
        "PVD Gold, Rose & Silver Finishes",
        "12+ Velvet & Bouclé Swatches",
        "High-Density Ergonomic Core",
        "Hand-Polished Seamless Joints",
        "Load Tested to 250kg Capacity",
        "Scratch & Fingerprint Resistant Coating",
        "Custom Millimeter Dimensions Available"
      ],
      href: "/collections?category=chairs"
    },
    {
      id: "dining",
      title: "Dining Tables",
      subtitle: "Natural Italian Marble • Chamfered Trestles",
      image: "/lineups/architectural_dining_table.jpg",
      badge: "Italian Marble & PVD",
      description: "Dramatic geometric centerpieces featuring imported Italian marble tops, chamfered precision edges, and indestructible stainless steel trestles.",
      bullets: [
        "Italian Natural & Engineered Marble",
        "Nano-Sealed Scratch Resistance",
        "Custom 6, 8 & 10 Seater Lengths",
        "Heavy-Duty 304 Stainless Steel Base",
        "Chamfered Polished Edge Profiles",
        "Heat & Stain Impervious Surface",
        "Anti-Deflection Structural Steel Core",
        "Seamless Mirror & Brushed PVD Finishes"
      ],
      href: "/collections?category=dining-table"
    },
    {
      id: "sofas",
      title: "Modular Sofas",
      subtitle: "Multi-Density Cushioning • Tailored Sectionals",
      image: "/lineups/sofa.jpg",
      badge: "Deep Modular Seating",
      description: "Expansive luxury sectionals with cloud-like multi-density cushioning, reinforced stainless steel substructures, and tailored silhouette lines.",
      bullets: [
        "High-Resilience Cold-Cure Foam",
        "Hand-Polished Mirror Welds",
        "Stain-Repellent Belgian Velvets",
        "Internal Reinforced Steel Chassis",
        "Modular Multi-Configuration Layouts",
        "Sag-Free Sinuous Spring System",
        "Hypoallergenic Reversible Cushions",
        "Double-Stitched Reinforced Seams"
      ],
      href: "/collections?category=sofa"
    },
    {
      id: "partitions",
      title: "Partitions & Consoles",
      subtitle: "Laser-Cut Filigree • Floor-to-Ceiling Mounts",
      image: "/lineups/architectural_partition_console.jpg",
      badge: "Spatial Dividers",
      description: "Architectural laser-cut stainless screens and entryway consoles designed to create light-permeable boundaries in open-concept spaces.",
      bullets: [
        "Parametric Laser-Cut Filigree",
        "Floor-to-Ceiling Tension Mounts",
        "Titanium PVD Scratch-Free Finish",
        "Integrated Warm LED Channel Ready",
        "Acoustic Dampening Infill Option",
        "CNC-Engineered Sub-Millimeter Fit",
        "Double-Sided Architectural Profile",
        "Zero Exposed Fastener Engineering"
      ],
      href: "/collections?category=partition-console"
    },
    {
      id: "coffee",
      title: "Coffee & Accent Tables",
      subtitle: "12mm Toughened Fluted Glass • Titanium PVD",
      image: "/lineups/architectural_coffee_table.jpg",
      badge: "Geometric Glass & Metal",
      description: "Fluted tempered glass and brushed titanium coffee tables anchoring living spaces with architectural weight and visual clarity.",
      bullets: [
        "12mm Toughened Fluted Glass",
        "Dual-Tier Architectural Storage",
        "Anti-Corrosion Vacuum Plating",
        "Mirror-Polished Stainless Steel Legs",
        "Shatterproof Safety Lamination",
        "Water-Ring & Thermal Shock Proof",
        "Concealed Silicone Shock Mounts",
        "Geometric Nesting Configurations"
      ],
      href: "/collections?category=coffee-corner-table"
    },
    {
      id: "themed",
      title: "Bespoke Themed Concepts",
      subtitle: "Custom 3D CAD Blueprinting • Master Fabrication",
      image: "/lineups/architectural_themed_credenza.jpg",
      badge: "Architectural Series",
      description: "Commissioned concepts co-created with architects and interior designers for one-of-a-kind luxury penthouses and hospitality suites.",
      bullets: [
        "Full CAD & 3D Visual Curation",
        "Bespoke Millimeter Dimensions",
        "On-Site White-Glove Installation",
        "Architectural Penthouse Curation",
        "Direct Master Fabricator Consultation",
        "Structural Lifetime Guarantee",
        "Custom Emblem & Crest Engraving",
        "Certified Metallurgy & Finish Dossier"
      ],
      href: "/collections?category=themed"
    }
  ];

  // Architectural Lineups (Images accurately match each category)
  const lineups = [
    {
      name: "Sofa",
      href: "/collections?category=sofa",
      image: "/lineups/sofa.jpg",
      subtitle: "Modular Sectionals & Deep Living",
      category: "sofas"
    },
    {
      name: "Accent & Recliner",
      href: "/collections?category=accent-recliner",
      image: "/lineups/accent_recliner.png",
      subtitle: "Sculptural Armchairs & Lounges",
      category: "chairs"
    },
    {
      name: "Coffee & Corner Table",
      href: "/collections?category=coffee-corner-table",
      image: "/lineups/architectural_coffee_table.jpg",
      subtitle: "Geometric Glass & Stainless Craft",
      category: "tables"
    },
    {
      name: "Dining Table",
      href: "/collections?category=dining-table",
      image: "/lineups/architectural_dining_table.jpg",
      subtitle: "Italian Marble & PVD Stainless",
      category: "dining"
    },
    {
      name: "Partition & Console",
      href: "/collections?category=partition-console",
      image: "/lineups/architectural_partition_console.jpg",
      subtitle: "Spatial Screens & Entryway Consoles",
      category: "partitions"
    },
    {
      name: "Chairs",
      href: "/collections?category=chairs",
      image: "/lineups/architectural_lounge_chairs.jpg",
      subtitle: "Stainless Steel Pillars & Velvet",
      category: "chairs"
    },
    {
      name: "Themed",
      href: "/collections?category=themed",
      image: "/lineups/architectural_merchandising.jpg",
      subtitle: "Bespoke Architectural Concepts",
      category: "themed"
    },
    {
      name: "Merchandising",
      href: "/collections?category=merchandising",
      image: "/lineups/architectural_themed_credenza.jpg",
      subtitle: "Signature Curated Series",
      category: "tables"
    }
  ];

  // Design News / Insights
  const articles = [
    {
      title: "The Art of PVD Stainless Steel: Why Titanium Coatings Outlast Traditional Metalwork",
      date: "September 18, 2026",
      readTime: "4 min read",
      image: "/lineups/architectural_pvd_craft.jpg",
      tag: "Material Science",
      snippet: "Discover how physical vapor deposition embeds titanium alloys into 304 steel at the atomic level, delivering lifelong luster and zero tarnishing."
    },
    {
      title: "Sectional Sophistication: Choosing Between Modular Chaises and Traditional Lounges",
      date: "September 12, 2026",
      readTime: "6 min read",
      image: "/lineups/sofa.jpg",
      tag: "Living Design",
      snippet: "How to balance open floor circulation, deep seat ergonomics, and architectural metal sightlines in contemporary open-plan spaces."
    },
    {
      title: "Spatial Separation: How Decorative Metal Partitions Transform Open-Plan Living",
      date: "August 29, 2026",
      readTime: "5 min read",
      image: "/lineups/architectural_partition_console.jpg",
      tag: "Space Planning",
      snippet: "Parametric laser-cut screens introduce intimate entertaining zones while allowing natural sunlight and open sightlines to breathe."
    }
  ];

  // Full-bleed Showcase Gallery (Images match category names precisely)
  const galleryImages = [
    { src: "/lineups/sofa.jpg", title: "Modular Sectional Lounge", tag: "Living Space" },
    { src: "/lineups/architectural_dining_table.jpg", title: "Italian Marble Dining Suite", tag: "Dining Architecture" },
    { src: "/lineups/architectural_lounge_chairs.jpg", title: "Sculptural Velvet Armchairs", tag: "Accent Seating" },
    { src: "/lineups/architectural_coffee_table.jpg", title: "Geometric Glass Coffee Table", tag: "Centerpiece" },
    { src: "/lineups/architectural_partition_console.jpg", title: "Architectural Partition & Console", tag: "Foyer Screen" },
    { src: "/lineups/architectural_themed_credenza.jpg", title: "Bespoke Architectural Suite", tag: "Themed Series" }
  ];

  // Quadruple/triple loop images for seamless infinite scroll on mobile
  const loopedGalleryImages = [...galleryImages, ...galleryImages, ...galleryImages];
  const galleryScrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAndroidView) return;
    const el = galleryScrollRef.current;
    const timer = setTimeout(() => {
      if (el) {
        const loopWidth = el.scrollWidth / 3;
        if (loopWidth > 0) {
          el.scrollLeft = loopWidth;
        }
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [isAndroidView]);

  const handleGalleryScroll = React.useCallback(() => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const loopWidth = el.scrollWidth / 3;
    if (loopWidth <= 0) return;

    if (el.scrollLeft >= loopWidth * 2) {
      el.scrollLeft -= loopWidth;
    } else if (el.scrollLeft <= 5) {
      el.scrollLeft += loopWidth;
    }
  }, []);

  const scrollGallery = React.useCallback((direction: "left" | "right") => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const itemWidth = el.clientWidth / 3;
    const scrollAmount = direction === "left" ? -itemWidth : itemWidth;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-warm-ivory text-on-surface relative overflow-x-hidden w-full max-w-full">
      {/* Rich Multi-Layer Architectural Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none w-full h-full max-w-full">
        {/* Layer 1: Ambient Metallic Lighting Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(197,155,39,0.08),transparent_70%),radial-gradient(ellipse_60%_50%_at_90%_40%,rgba(94,96,108,0.06),transparent_60%),radial-gradient(ellipse_70%_50%_at_10%_75%,rgba(197,155,39,0.06),transparent_60%)]" />

        {/* Layer 2: Architectural CAD Blueprint Grid */}
        <div 
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(94, 96, 108, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(94, 96, 108, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 95% 95% at 50% 50%, black 50%, transparent 98%)",
            WebkitMaskImage: "radial-gradient(ellipse 95% 95% at 50% 50%, black 50%, transparent 98%)"
          }}
        />

        {/* Layer 3: Architectural Guide Lines */}
        <div className="absolute inset-0 max-w-container-max mx-auto px-6 sm:px-12 md:px-20 flex justify-between opacity-[0.16] overflow-hidden">
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#5e606c] to-transparent" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#5e606c] to-transparent hidden md:block" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#5e606c] to-transparent" />
        </div>

        {/* Layer 4: Interactive Particle Drift */}
        <ParticleDrift
          background="transparent"
          baseColor="#5e606c"
          accentColor="#C59B27"
          density={45}
          dotSize={2.4}
          speed={18}
          hover={130}
          linkDistance={90}
          linkThickness={0.8}
        />
      </div>

      {/* Intro Video Overlay (Desktop View Only - Completely excluded on Android) */}
      {!isAndroid && showIntro && (
        <div 
          id="stallion-intro-screen"
          className={`stallion-intro-container stallion-intro-anim fixed inset-0 z-[9999] bg-[#f1f3f3] flex items-center justify-center transition-opacity duration-700 select-none overflow-hidden w-screen h-screen ${
            fadeOut ? "opacity-0 pointer-events-none stallion-dismissed" : "opacity-100 pointer-events-auto"
          }`}
        >

          {/* Spinner underneath */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-stone-400 pointer-events-none z-0">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 animate-spin rounded-full" />
            <span className="font-sans text-xs tracking-wider uppercase text-stone-500">Loading Stallion Intro...</span>
          </div>

          {/* Video Player - Full screen cover during horse run, uncropped contain during logo */}
          <div className={`relative w-full h-full max-w-full max-h-full flex items-center justify-center z-10 pointer-events-none transition-all duration-700 ${
            isIntroLogoPhase ? "p-2 sm:p-4" : "p-0"
          }`}>
            <video
              id="stallion-intro-video"
              ref={introVideoRef}
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
              onTimeUpdate={(e) => {
                const vid = e.currentTarget;
                if (vid.currentTime >= 6.1) {
                  if (!isIntroLogoPhase) setIsIntroLogoPhase(true);
                } else {
                  if (isIntroLogoPhase) setIsIntroLogoPhase(false);
                }
              }}
              onEnded={handleSkip}
              className={`w-full h-full max-w-full max-h-full pointer-events-auto transition-all duration-500 ${
                isIntroLogoPhase ? "object-contain" : "object-cover"
              }`}
            />
          </div>

          {/* Click anywhere to skip */}
          <div
            id="stallion-touch-shield"
            onClick={handleSkip}
            className="absolute inset-0 z-20 w-full h-full cursor-pointer bg-transparent"
          />
        </div>
      )}

      <Header />

      <main className="flex-grow relative z-10 w-full min-w-0 overflow-x-hidden">
        {/* =========================================================================
            SECTION 0: EDITORIAL HERO VIDEO (STRICTLY PRESERVED AS REQUIRED)
            ========================================================================= */}
        <section
          className={`relative w-full ${
            isAndroidView
              ? "h-auto aspect-video"
              : "h-auto lg:h-[calc(100vh-88px)]"
          } bg-stone-950 flex items-center justify-center overflow-hidden border-b border-outline-variant`}
        >
          <div className={isAndroidView ? "relative w-full h-auto aspect-video" : "absolute inset-0"}>
            {playHeroVideo && (
              <>
                <video
                  src="/hero_video.mp4"
                  autoPlay
                  muted
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                  controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                  className={`w-full ${
                    isAndroidView
                      ? "h-auto aspect-video block object-contain"
                      : "h-auto lg:absolute lg:inset-0 lg:w-full lg:h-full lg:object-cover"
                  } pointer-events-none`}
                />
                {/* Transparent overlay capturing mouse hover/clicks so browser does not show PiP / Video Enhance hover button */}
                <div className="absolute inset-0 z-10 pointer-events-auto" />
              </>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: "ABOUT US" & 3-FEATURE SPLIT SECTION (bg-[#f0f0f0])
            ========================================================================= */}
        <section className={`w-full bg-[#f0f0f0] border-b border-[#d7d8d2] ${isAndroidView ? "py-6 sm:py-20 px-2 sm:px-6" : "py-14 sm:py-20 px-4 sm:px-6"} lg:px-12 relative overflow-hidden`}>
          {/* Subtle decorative schematic backing */}
          <div className="absolute right-0 top-0 w-96 h-96 opacity-[0.03] pointer-events-none select-none hidden lg:block">
            <Image src="/schematics/three_seater.png" alt="" fill className="object-contain" />
          </div>

          <div className={`max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 ${isAndroidView ? "gap-4 sm:gap-10" : "gap-10"} lg:gap-14 items-center`}>
            {/* Left Column: About Us Editorial (Center-aligned title as requested) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <h2 className={`font-display ${isAndroidView ? "text-xl mb-2.5" : "text-2xl sm:text-3xl lg:text-4xl mb-5"} sm:text-3xl lg:text-4xl font-bold text-charcoal-ink tracking-tight leading-snug text-center`}>
                Authentic, Quality &amp; Luxury Interior Furniture
              </h2>

              <p className={`font-sans ${isAndroidView ? "text-xs mb-3" : "text-sm sm:text-base mb-6"} text-stone-600 leading-relaxed font-normal text-center sm:text-left`}>
                Stallion Stainless represents the synthesis of architectural rigor and luxurious domestic living. 
                We combine surgical-grade 304 stainless steel framing, vacuum PVD finishes, and bespoke Italian upholstery 
                to engineer furniture that transcends trends. Every joint is hand-polished, every cushion calibrated for ergonomic perfection.
              </p>

              <div className={`${isAndroidView ? "p-2.5" : "p-4"} rounded-xl bg-white/70 border border-[#dcd7d1] shadow-xs`}>
                <p className={`font-sans ${isAndroidView ? "text-[11px]" : "text-xs sm:text-sm"} text-[#5e606c] italic font-medium text-center`}>
                  &ldquo;Where heavy-duty structural steel meets cloud-soft tailored upholstery for multi-generational spaces.&rdquo;
                </p>
              </div>
            </div>

            {/* Right Column: 3 Feature Cards */}
            <div className={`lg:col-span-7 grid ${isAndroidView ? "grid-cols-3 gap-1.5 sm:gap-6" : "grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6"}`}>
              {/* Feature 1 */}
              <div className={`bg-white rounded-lg sm:rounded-xl ${isAndroidView ? "p-2 sm:p-6" : "p-6"} border border-[#dcd7d1] shadow-xs hover:shadow-md hover:border-[#5e606c]/40 transition-all duration-300 flex flex-col justify-between h-full group`}>
                <div>
                  <div className={`${isAndroidView ? "w-7 h-7 sm:w-12 sm:h-12 mb-2 sm:mb-5" : "w-12 h-12 mb-5"} rounded-lg bg-[#f6f5f1] border border-[#e5e3dd] flex items-center justify-center text-[#5e606c] mx-auto group-hover:bg-[#5e606c] group-hover:text-white transition-colors duration-300`}>
                    <Sparkles className={`${isAndroidView ? "w-3.5 h-3.5 sm:w-6 sm:h-6" : "w-6 h-6"} text-[#C59B27] group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className={`font-display ${isAndroidView ? "text-[10px] sm:text-base mb-1.5 sm:mb-2.5" : "text-base mb-2.5"} font-bold text-charcoal-ink uppercase tracking-tight sm:tracking-wider text-center leading-tight`}>
                    Exclusive Design
                  </h3>
                  <p className={`font-sans ${isAndroidView ? "text-[8px] sm:text-[13px] leading-tight sm:leading-relaxed" : "text-xs sm:text-[13px] leading-relaxed"} text-stone-500 text-center`}>
                    A harmonious mixture of imagination, structural engineering, and artisan perfection is the secret behind our signature silhouettes.
                  </p>
                </div>
                <div className={`${isAndroidView ? "pt-1.5 mt-2 sm:pt-4 sm:mt-4 text-[7.5px] sm:text-xs" : "pt-4 mt-4 text-xs"} border-t border-stone-100 flex items-center justify-center font-mono text-[#5e606c] uppercase tracking-tight sm:tracking-wider`}>
                  <span>Precision CAD</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className={`bg-white rounded-lg sm:rounded-xl ${isAndroidView ? "p-2 sm:p-6" : "p-6"} border border-[#dcd7d1] shadow-xs hover:shadow-md hover:border-[#5e606c]/40 transition-all duration-300 flex flex-col justify-between h-full group`}>
                <div>
                  <div className={`${isAndroidView ? "w-7 h-7 sm:w-12 sm:h-12 mb-2 sm:mb-5" : "w-12 h-12 mb-5"} rounded-lg bg-[#f6f5f1] border border-[#e5e3dd] flex items-center justify-center text-[#5e606c] mx-auto group-hover:bg-[#5e606c] group-hover:text-white transition-colors duration-300`}>
                    <ShieldCheck className={`${isAndroidView ? "w-3.5 h-3.5 sm:w-6 sm:h-6" : "w-6 h-6"} text-[#C59B27] group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className={`font-display ${isAndroidView ? "text-[10px] sm:text-base mb-1.5 sm:mb-2.5" : "text-base mb-2.5"} font-bold text-charcoal-ink uppercase tracking-tight sm:tracking-wider text-center leading-tight`}>
                    Professional Team
                  </h3>
                  <p className={`font-sans ${isAndroidView ? "text-[8px] sm:text-[13px] leading-tight sm:leading-relaxed" : "text-xs sm:text-[13px] leading-relaxed"} text-stone-500 text-center`}>
                    We are proud of our dedicated, amicable, and consistently evolving team of master fabricators, welders, and interior designers.
                  </p>
                </div>
                <div className={`${isAndroidView ? "pt-1.5 mt-2 sm:pt-4 sm:mt-4 text-[7.5px] sm:text-xs" : "pt-4 mt-4 text-xs"} border-t border-stone-100 flex items-center justify-center font-mono text-[#5e606c] uppercase tracking-tight sm:tracking-wider`}>
                  <span>Master Artisans</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className={`bg-white rounded-lg sm:rounded-xl ${isAndroidView ? "p-2 sm:p-6" : "p-6"} border border-[#dcd7d1] shadow-xs hover:shadow-md hover:border-[#5e606c]/40 transition-all duration-300 flex flex-col justify-between h-full group`}>
                <div>
                  <div className={`${isAndroidView ? "w-7 h-7 sm:w-12 sm:h-12 mb-2 sm:mb-5" : "w-12 h-12 mb-5"} rounded-lg bg-[#f6f5f1] border border-[#e5e3dd] flex items-center justify-center text-[#5e606c] mx-auto group-hover:bg-[#5e606c] group-hover:text-white transition-colors duration-300`}>
                    <HeartHandshake className={`${isAndroidView ? "w-3.5 h-3.5 sm:w-6 sm:h-6" : "w-6 h-6"} text-[#C59B27] group-hover:text-white transition-colors`} />
                  </div>
                  <h3 className={`font-display ${isAndroidView ? "text-[10px] sm:text-base mb-1.5 sm:mb-2.5" : "text-base mb-2.5"} font-bold text-charcoal-ink uppercase tracking-tight sm:tracking-wider text-center leading-tight`}>
                    Reasonable Prices
                  </h3>
                  <p className={`font-sans ${isAndroidView ? "text-[8px] sm:text-[13px] leading-tight sm:leading-relaxed" : "text-xs sm:text-[13px] leading-relaxed"} text-stone-500 text-center`}>
                    Direct manufacturer-to-home luxury with transparent, fair pricing and zero retail markups without ever compromising quality.
                  </p>
                </div>
                <div className={`${isAndroidView ? "pt-1.5 mt-2 sm:pt-4 sm:mt-4 text-[7.5px] sm:text-xs" : "pt-4 mt-4 text-xs"} border-t border-stone-100 flex items-center justify-center font-mono text-[#5e606c] uppercase tracking-tight sm:tracking-wider`}>
                  <span>Factory Direct</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: "WHAT WE OFFER" - 3D FLIP CATEGORY CARDS (bg-[#c4c4be])
            ========================================================================= */}
        <section className={`w-full bg-[#c4c4be] ${isAndroidView ? "py-6 sm:py-20 px-2.5 sm:px-6" : "py-16 sm:py-20 px-4 sm:px-6"} lg:px-12 border-b border-[#b0b0a8] relative overflow-hidden`}>
          {/* Cindermane Atmospheric Golden Embers */}
          <ArchitecturalEmbers />

          <div className="max-w-[1600px] mx-auto relative z-10">
            {/* Section Header (Center-aligned) */}
            <div className={`text-center max-w-2xl mx-auto ${isAndroidView ? "mb-4 sm:mb-16" : "mb-12 sm:mb-16"}`}>
              <h2 className={`font-display ${isAndroidView ? "text-xl sm:text-3xl lg:text-4xl" : "text-2xl sm:text-3xl lg:text-4xl"} font-bold text-[#2d394b] tracking-tight uppercase text-center`}>
                Bespoke Architectural Collections
              </h2>
              <p className={`font-sans ${isAndroidView ? "text-[11px] mt-1" : "text-xs sm:text-sm mt-2"} text-stone-700 font-medium text-center`}>
                {isAndroidView 
                  ? "Tap any collection card to flip and view structural specifications."
                  : "Hover or click any collection card to inspect architectural details & materials."}
              </p>
            </div>

            {/* 6 Dual-Sided 3D Holo Cards Grid - 2 in a row on Android view */}
            <div className={`grid ${isAndroidView ? "grid-cols-2 gap-2 sm:gap-8" : "grid-cols-1 sm:grid-cols-2"} lg:grid-cols-3 gap-6 sm:gap-8`}>
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

        {/* =========================================================================
            SECTION 3: OUR ARCHITECTURAL LINEUPS & COLLECTIONS (bg-[#f6f5f1])
            ========================================================================= */}
        <section className={`w-full bg-[#f6f5f1] ${isAndroidView ? "py-6 sm:py-20 px-2 sm:px-6" : "py-16 sm:py-20 px-4 sm:px-6"} lg:px-12 border-b border-[#e5e3dd]`}>
          <div className="max-w-[1680px] mx-auto">
            {/* Header (Center-aligned) */}
            <div className={`text-center max-w-2xl mx-auto ${isAndroidView ? "mb-4 sm:mb-12" : "mb-8 sm:mb-12"}`}>
              <h2 className={`font-display ${isAndroidView ? "text-xl sm:text-3xl lg:text-4xl" : "text-2xl sm:text-3xl lg:text-4xl"} font-bold text-charcoal-ink uppercase tracking-tight text-center`}>
                Our Architectural Lineups
              </h2>
            </div>

            {/* Lineups Grid Display */}
            {isAndroidView ? (
              /* Android View: 3 - 3 - 2 Center Aligned Layout */
              <div className={`flex flex-wrap justify-center gap-2 relative z-10 ${isAndroidView ? "mb-6" : "mb-12"}`}>
                {lineups.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="w-[calc((100%-16px)/3)] group relative bg-white rounded-lg overflow-hidden border border-stone-200/90 hover:border-stone-400/90 shadow-2xs transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        sizes="33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    <div className="py-1.5 px-1 text-center flex-1 flex flex-col justify-center bg-white relative">
                      <h3 className="font-display text-[10px] leading-tight font-semibold text-charcoal-ink uppercase tracking-wider group-hover:text-stone-600 transition-colors line-clamp-2 text-center">
                        {item.name}
                      </h3>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop View: 4-Column Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
                {lineups.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="group relative bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-[#5e606c] shadow-xs hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white text-charcoal-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-sm">
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#C59B27]" />
                      </div>
                    </div>

                    <div className="py-3 sm:py-4 px-3 sm:px-4 flex-1 flex flex-col justify-center bg-white relative">
                      <h3 className="font-display text-xs sm:text-base font-bold text-charcoal-ink uppercase tracking-wider group-hover:text-[#5e606c] transition-colors line-clamp-1 text-center">
                        {item.name}
                      </h3>
                      <p className="font-sans text-[11px] sm:text-xs text-stone-500 tracking-wide mt-1 line-clamp-1 text-center">
                        {item.subtitle}
                      </p>

                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CURATED: PREMIER GRADE SHOWCASE */}
            <div id="pro-collection" className={`${isAndroidView ? "pt-3 pb-6" : "pt-4 pb-12"} border-t border-stone-200/80`}>
              <div className={`flex items-center justify-between ${isAndroidView ? "mb-2.5" : "mb-6"}`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link href="/pro-collection" className="group inline-block">
                    <h3 className={`font-display ${isAndroidView ? "text-base sm:text-xl" : "text-xl sm:text-2xl"} sm:text-2xl font-bold text-charcoal-ink uppercase tracking-widest group-hover:text-[#5e606c] transition-colors`}>
                      PREMIER GRADE
                    </h3>
                  </Link>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#f6f5f1] border border-stone-200 text-[10px] font-mono uppercase tracking-wider text-stone-600">
                    Scroll Series →
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                  <Link
                    href="/pro-collection"
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-sans font-semibold text-[#5e606c] hover:text-charcoal-ink tracking-wider uppercase transition-colors mr-0.5 sm:mr-2"
                  >
                    <span>View Full Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Horizontal Scroll Navigation Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => scrollSection(proScrollRef, "left")}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-charcoal-ink shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
                      aria-label="Scroll Premier Grade left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollSection(proScrollRef, "right")}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-charcoal-ink shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
                      aria-label="Scroll Premier Grade right"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontal Right Scrollable Strip */}
              <div
                ref={proScrollRef}
                data-lenis-prevent
                className={`flex overflow-x-auto ${isAndroidView ? "gap-2" : "gap-4 sm:gap-6"} pb-3 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory no-scrollbar w-full`}
              >
                {proProducts.map((product) => (
                  isAndroidView ? (
                    /* Android Card: 3 in a row viewport scale, right scrollable */
                    <article
                      key={product.id}
                      className="w-[calc((100vw-3.2rem)/3)] min-w-[108px] max-w-[130px] shrink-0 snap-start bg-white rounded-lg overflow-hidden border border-stone-200 shadow-2xs flex flex-col"
                    >
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image
                            src={product.images?.[0] || "/products/aris/H.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="33vw"
                          />
                        </div>

                        <div className="py-1.5 px-1 sm:py-2 sm:px-2 flex-1 flex flex-col justify-between bg-white relative">
                          <div>
                            <h4 className="font-display text-[9.5px] sm:text-xs font-bold text-charcoal-ink uppercase tracking-wider truncate text-center">
                              {product.name}
                            </h4>
                          </div>

                          <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-1 border-t border-stone-100">
                            {product.colors.slice(0, 4).map((color) => (
                              <div
                                key={color.name}
                                className="w-2 h-2 rounded-full border border-stone-300 shadow-2xs"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                            {product.colors.length > 4 && (
                              <span className="text-[7.5px] sm:text-[8px] font-mono text-stone-400">+{product.colors.length - 4}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ) : (
                    /* Desktop Card: ~4 in a row scale, right scrollable with rich info */
                    <article
                      key={product.id}
                      className="w-[calc((100%-4.5rem)/4)] min-w-[270px] max-w-[340px] shrink-0 snap-start group bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-[#5e606c] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-1.5"
                    >
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image
                            src={product.images?.[0] || "/products/aris/H.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                            sizes="(max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                          <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white text-charcoal-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-sm">
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#C59B27]" />
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between bg-white relative">
                          <div>
                            <div className="mb-1">
                              <h4 className="font-display text-base font-bold text-charcoal-ink uppercase tracking-wider group-hover:text-[#5e606c] transition-colors text-center">
                                {product.name}
                              </h4>
                            </div>
                            <p className="font-sans text-xs text-stone-500 tracking-wide line-clamp-1 mb-3 text-center">
                              {product.tagline}
                            </p>
                          </div>

                          <div className="flex items-center justify-center pt-2.5 border-t border-stone-100">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {product.colors.slice(0, 5).map((color) => (
                                <div
                                  key={color.name}
                                  className="w-3 h-3 rounded-full border border-stone-300 shadow-2xs transition-transform group-hover:scale-110"
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                />
                              ))}
                              {product.colors.length > 5 && (
                                <span className="text-[9px] font-mono text-stone-400">+{product.colors.length - 5}</span>
                              )}
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                      </Link>
                    </article>
                  )
                ))}
              </div>
            </div>

            {/* CURATED: BEST SELLING SHOWCASE */}
            <div id="best-selling" className={`${isAndroidView ? "pt-4" : "pt-8"} border-t border-stone-200/80`}>
              <div className={`flex items-center justify-between ${isAndroidView ? "mb-2.5" : "mb-6"}`}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link href="/best-selling" className="group inline-block">
                    <h3 className={`font-display ${isAndroidView ? "text-base sm:text-xl" : "text-xl sm:text-2xl"} sm:text-2xl font-bold text-charcoal-ink uppercase tracking-widest group-hover:text-[#5e606c] transition-colors`}>
                      BEST SELLING
                    </h3>
                  </Link>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#f6f5f1] border border-stone-200 text-[10px] font-mono uppercase tracking-wider text-stone-600">
                    Scroll Series →
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                  <Link
                    href="/best-selling"
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-sans font-semibold text-[#5e606c] hover:text-charcoal-ink tracking-wider uppercase transition-colors mr-0.5 sm:mr-2"
                  >
                    <span>View Full Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Horizontal Scroll Navigation Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => scrollSection(bestSellingScrollRef, "left")}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-charcoal-ink shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
                      aria-label="Scroll Best Selling left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollSection(bestSellingScrollRef, "right")}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-charcoal-ink shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
                      aria-label="Scroll Best Selling right"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontal Right Scrollable Strip */}
              <div
                ref={bestSellingScrollRef}
                data-lenis-prevent
                className={`flex overflow-x-auto ${isAndroidView ? "gap-2" : "gap-4 sm:gap-6"} pb-3 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory no-scrollbar w-full`}
              >
                {bestSellingProducts.map((product) => (
                  isAndroidView ? (
                    /* Android Card: 3 in a row viewport scale, right scrollable */
                    <article
                      key={product.id}
                      className="w-[calc((100vw-3.2rem)/3)] min-w-[108px] max-w-[130px] shrink-0 snap-start bg-white rounded-lg overflow-hidden border border-stone-200 shadow-2xs flex flex-col"
                    >
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image
                            src={product.images?.[0] || "/products/aris/H.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="33vw"
                          />
                        </div>

                        <div className="py-1.5 px-1 sm:py-2 sm:px-2 flex-1 flex flex-col justify-between bg-white relative">
                          <div>
                            <h4 className="font-display text-[9.5px] sm:text-xs font-bold text-charcoal-ink uppercase tracking-wider truncate text-center">
                              {product.name}
                            </h4>
                          </div>

                          <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-1 border-t border-stone-100">
                            {product.colors.slice(0, 4).map((color) => (
                              <div
                                key={color.name}
                                className="w-2 h-2 rounded-full border border-stone-300 shadow-2xs"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                            {product.colors.length > 4 && (
                              <span className="text-[7.5px] sm:text-[8px] font-mono text-stone-400">+{product.colors.length - 4}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ) : (
                    /* Desktop Card: ~4 in a row scale, right scrollable with rich info */
                    <article
                      key={product.id}
                      className="w-[calc((100%-4.5rem)/4)] min-w-[270px] max-w-[340px] shrink-0 snap-start group bg-white rounded-xl overflow-hidden border border-stone-200 hover:border-[#5e606c] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-1.5"
                    >
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image
                            src={product.images?.[0] || "/products/aris/H.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                            sizes="(max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                          <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white text-charcoal-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-sm">
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#C59B27]" />
                          </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between bg-white relative">
                          <div>
                            <div className="mb-1">
                              <h4 className="font-display text-base font-bold text-charcoal-ink uppercase tracking-wider group-hover:text-[#5e606c] transition-colors text-center">
                                {product.name}
                              </h4>
                            </div>
                            <p className="font-sans text-xs text-stone-500 tracking-wide line-clamp-1 mb-3 text-center">
                              {product.tagline}
                            </p>
                          </div>

                          <div className="flex items-center justify-center pt-2.5 border-t border-stone-100">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {product.colors.slice(0, 5).map((color) => (
                                <div
                                  key={color.name}
                                  className="w-3 h-3 rounded-full border border-stone-300 shadow-2xs transition-transform group-hover:scale-110"
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                />
                              ))}
                              {product.colors.length > 5 && (
                                <span className="text-[9px] font-mono text-stone-400">+{product.colors.length - 5}</span>
                              )}
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                        </div>
                      </Link>
                    </article>
                  )
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: DESIGN NEWS & INSIGHTS (bg-[#e8e8e3]) - HIDDEN ON ANDROID VIEW
            ========================================================================= */}
        {!isAndroidView && (
          <section className="w-full bg-[#e8e8e3] py-16 sm:py-20 px-4 sm:px-6 lg:px-12 border-b border-[#d2d2cc]">
            <div className="max-w-[1600px] mx-auto">
              {/* Header (Center-aligned) */}
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-ink uppercase tracking-tight text-center">
                  News &amp; Craft Journal
                </h2>
              </div>

              {/* 3 Editorial News Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {articles.map((art, idx) => (
                  <article
                    key={idx}
                    className="bg-white rounded-xl overflow-hidden border border-[#d2d2cc] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={art.image}
                        alt={art.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono font-bold uppercase tracking-wider text-[#5e606c]">
                          {art.tag}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-center gap-3 text-stone-400 text-[11px] font-mono mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#C59B27]" />
                            {art.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {art.readTime}
                          </span>
                        </div>

                        <h3 className="font-display text-base font-bold text-charcoal-ink group-hover:text-[#5e606c] transition-colors mb-2.5 line-clamp-2 text-center">
                          {art.title}
                        </h3>

                        <p className="font-sans text-xs sm:text-[13px] text-stone-500 leading-relaxed line-clamp-3 text-center sm:text-left">
                          {art.snippet}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 5: FULL-BLEED LIVING GALLERY / SHOWCASE STRIP
            ========================================================================= */}
        <section className={`w-full bg-[#393f44] text-white ${isAndroidView ? "pt-5 sm:pt-8" : "pt-8"} pb-0 overflow-hidden`}>
          <div className={`max-w-[1600px] mx-auto px-4 sm:px-6 ${isAndroidView ? "mb-3 sm:mb-6" : "mb-6"} text-center`}>
            <h3 className={`font-display ${isAndroidView ? "text-base sm:text-xl" : "text-lg sm:text-xl"} font-bold uppercase tracking-wider text-white text-center`}>
              Architectural Living Spaces
            </h3>
          </div>

          {/* Desktop Showcase View: Exact 6-Column Strip (Compact & smaller as before) */}
          <div className={`${isAndroidView ? "hidden lg:grid" : "hidden sm:grid"} grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full`}>
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-square w-full overflow-hidden bg-stone-900 cursor-pointer"
                onClick={() => router.push("/collections")}
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
                {/* Hover Dark Overlay with Details */}
                <div className="absolute inset-0 bg-[#393f44]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white">
                  <div className="text-right">
                    <ArrowUpRight className="w-5 h-5 text-[#C59B27] inline-block" />
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#C59B27] block">
                      {img.tag}
                    </span>
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-center">
                      {img.title}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View: 3 in a row, left & right loop scrollable */}
          <div className={`${isAndroidView ? "block lg:hidden" : "block sm:hidden"} relative w-full overflow-hidden`}>
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={() => scrollGallery("left")}
              aria-label="Scroll left"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg active:scale-90 border border-white/20"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={() => scrollGallery("right")}
              aria-label="Scroll right"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg active:scale-90 border border-white/20"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            {/* Loop Scroll Container (3 in a row on mobile: w-1/3 per item) */}
            <div
              ref={galleryScrollRef}
              data-lenis-prevent
              onScroll={handleGalleryScroll}
              className="flex overflow-x-auto no-scrollbar w-full select-none touch-pan-x"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loopedGalleryImages.map((img, i) => (
                <div
                  key={i}
                  className="w-1/3 shrink-0 relative aspect-square overflow-hidden bg-stone-900 cursor-pointer border-r border-stone-800/40"
                  onClick={() => router.push("/collections")}
                >
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                  {/* Bottom overlay with tag & title */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-1.5 py-1 text-center pointer-events-none">
                    <span className="font-mono text-[7px] uppercase tracking-wider text-[#C59B27] block truncate">
                      {img.tag}
                    </span>
                    <h4 className="font-display text-[8.5px] font-bold uppercase tracking-tight text-white truncate leading-tight">
                      {img.title}
                    </h4>
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
