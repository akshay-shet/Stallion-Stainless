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
  CheckCircle2,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
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

  // Intro video state
  const [showIntro, setShowIntro] = useState(() => {
    if (isAndroid) return false;
    return true;
  });
  const [fadeOut, setFadeOut] = useState(false);
  const [isIntroLogoPhase, setIsIntroLogoPhase] = useState(false);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const skippedRef = useRef(false);

  // Active chapter chip
  const [activeChapter, setActiveChapter] = useState(0);

  // Detect Android/mobile screens on client
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
      if (el) {
        el.classList.add("stallion-dismissed");
      }
    }

    lenis?.start();

    if (introVideoRef.current) {
      try {
        introVideoRef.current.pause();
      } catch {}
    }

    setTimeout(() => setShowIntro(false), 700);
  }, [lenis]);

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
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Desktop intro autoplay note:", err);
          if (vid) { vid.muted = true; vid.play().catch(() => {}); }
        });
      }
    }
    const timer = setTimeout(() => { handleSkip(); }, 10800);
    return () => { clearTimeout(timer); };
  }, [showIntro, handleSkip, isAndroid]);

  const playHeroVideo = !showIntro;

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

  const lineups = [
    { name: "Sofa", href: "/collections?category=sofa", image: "/lineups/sofa.jpg", subtitle: "Modular Sectionals & Deep Living", category: "sofas" },
    { name: "Accent & Recliner", href: "/collections?category=accent-recliner", image: "/lineups/accent_recliner.png", subtitle: "Sculptural Armchairs & Lounges", category: "chairs" },
    { name: "Coffee & Corner Table", href: "/collections?category=coffee-corner-table", image: "/lineups/architectural_coffee_table.jpg", subtitle: "Geometric Glass & Stainless Craft", category: "tables" },
    { name: "Dining Table", href: "/collections?category=dining-table", image: "/lineups/architectural_dining_table.jpg", subtitle: "Italian Marble & PVD Stainless", category: "dining" },
    { name: "Partition & Console", href: "/collections?category=partition-console", image: "/lineups/architectural_partition_console.jpg", subtitle: "Spatial Screens & Entryway Consoles", category: "partitions" },
    { name: "Chairs", href: "/collections?category=chairs", image: "/lineups/architectural_lounge_chairs.jpg", subtitle: "Stainless Steel Pillars & Velvet", category: "chairs" },
    { name: "Themed", href: "/collections?category=themed", image: "/lineups/architectural_merchandising.jpg", subtitle: "Bespoke Architectural Concepts", category: "themed" },
    { name: "Merchandising", href: "/collections?category=merchandising", image: "/lineups/architectural_themed_credenza.jpg", subtitle: "Signature Curated Series", category: "tables" }
  ];

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
    if (el.scrollLeft >= loopWidth * 2) { el.scrollLeft -= loopWidth; }
    else if (el.scrollLeft <= 5) { el.scrollLeft += loopWidth; }
  }, []);

  const scrollGallery = React.useCallback((direction: "left" | "right") => {
    const el = galleryScrollRef.current;
    if (!el) return;
    const itemWidth = el.clientWidth / 3;
    const scrollAmount = direction === "left" ? -itemWidth : itemWidth;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  // Chapter chips data (Kage-inspired navigation)
  const chapters = [
    { label: "Craft", icon: "✦" },
    { label: "Collections", icon: "◈" },
    { label: "Premier", icon: "◆" },
    { label: "Gallery", icon: "◉" },
  ];

  const chapterRefs = [
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
    useRef<HTMLElement>(null),
  ];

  const scrollToChapter = (idx: number) => {
    setActiveChapter(idx);
    const el = chapterRefs[idx]?.current;
    if (el) {
      const offset = 88; // header height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      if (lenis) {
        lenis.scrollTo(top, { duration: 1.4 });
      } else {
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  // Intersection observer for chapter tracking
  useEffect(() => {
    if (typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = chapterRefs.findIndex((r) => r.current === entry.target);
            if (idx !== -1) setActiveChapter(idx);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-88px 0px 0px 0px" }
    );
    chapterRefs.forEach((r) => { if (r.current) obs.observe(r.current); });
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f7f4] text-[#1a1a1a] relative overflow-x-hidden w-full max-w-full">

      {/* ─── INTRO VIDEO OVERLAY ─────────────────────────────────────────────── */}
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
              autoPlay
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
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

        {/* ═══════════════════════════════════════════════════════════════════════
            HERO: KAGE-INSPIRED FULL-VIEWPORT CINEMATIC SCENE
            ═══════════════════════════════════════════════════════════════════════ */}
        <section
          className={`relative w-full ${
            isAndroidView ? "h-auto" : "min-h-[100svh]"
          } overflow-hidden flex flex-col`}
          style={{ background: "linear-gradient(160deg, #ffffff 0%, #f4f2ed 55%, #ece9e1 100%)" }}
        >
          {/* Fine grid layer (CAD blueprint feel) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(94,96,108,0.07) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(94,96,108,0.07) 1px, transparent 1px)
              `,
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse 100% 90% at 50% 0%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 100% 90% at 50% 0%, black 40%, transparent 100%)",
            }}
          />

          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 70% 50% at 80% 30%, rgba(197,155,39,0.07), transparent 65%), radial-gradient(ellipse 50% 40% at 10% 70%, rgba(94,96,108,0.05), transparent 60%)"
          }} />

          {/* Particle drift */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleDrift
              background="transparent"
              baseColor="#5e606c"
              accentColor="#C59B27"
              density={isAndroidView ? 20 : 40}
              dotSize={2}
              speed={16}
              hover={110}
              linkDistance={85}
              linkThickness={0.7}
            />
          </div>

          {/* Hero video (plays after intro, desktop) */}
          {playHeroVideo && !isAndroidView && (
            <div className="absolute inset-0 pointer-events-none">
              <video
                src="/hero_video.mp4"
                autoPlay
                muted
                playsInline
                loop
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7f4]/60 via-transparent to-[#f8f7f4]/80" />
            </div>
          )}

          {/* Mobile: hero chair image */}
          {isAndroidView && (
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <Image src="/hero_chair.jpg" alt="Stallion Stainless" fill className="object-cover" priority sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#f8f7f4]/40 to-[#f8f7f4]/90" />
            </div>
          )}

          {/* Hero Content: split layout (Kage-style) */}
          <div className={`relative z-10 flex flex-col ${isAndroidView ? "px-4 pt-6 pb-8" : "flex-grow px-6 sm:px-12 lg:px-20 pt-16 pb-12 lg:pb-0 lg:flex-row lg:items-center lg:justify-between"}`}>

            {/* Left: Main hero text */}
            <div className={`${isAndroidView ? "text-center" : "max-w-[640px] lg:max-w-[560px]"} flex flex-col`}>
              {/* Eyebrow tag */}
              <div className={`inline-flex items-center gap-2 ${isAndroidView ? "justify-center mb-3" : "mb-5"}`}>
                <span className="w-5 h-[1px] bg-[#C59B27]" />
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#5e606c]">Est. 2018 · Mumbai, India</span>
                <span className="w-5 h-[1px] bg-[#C59B27]" />
              </div>

              {/* Main heading — Kage-style large editorial */}
              <h1 className={`font-display font-black tracking-tight leading-[0.92] text-[#1a1a1a] ${
                isAndroidView
                  ? "text-[2.4rem] mb-4"
                  : "text-[3.8rem] sm:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem] mb-6"
              }`}>
                <span className="block">STALLION</span>
                <span className="block text-transparent bg-clip-text" style={{
                  backgroundImage: "linear-gradient(135deg, #b8860b 0%, #C59B27 40%, #e8c84a 70%, #C59B27 100%)"
                }}>
                  STAINLESS
                </span>
              </h1>

              <p className={`font-sans text-stone-600 leading-relaxed font-light ${isAndroidView ? "text-sm mb-6 text-center" : "text-base sm:text-lg mb-8 max-w-[420px]"}`}>
                Architectural-grade stainless steel furniture. Precision-engineered for India&apos;s most discerning interiors.
              </p>

              {/* CTA Buttons */}
              <div className={`flex gap-3 ${isAndroidView ? "justify-center flex-wrap" : ""}`}>
                <Link
                  href="/collections"
                  className={`inline-flex items-center gap-2 bg-[#1a1a1a] text-white font-sans font-semibold tracking-wide uppercase rounded-full transition-all duration-300 hover:bg-[#C59B27] hover:scale-105 active:scale-95 ${
                    isAndroidView ? "text-xs px-5 py-2.5" : "text-sm px-8 py-4"
                  }`}
                >
                  Explore Collections
                  <ArrowRight className={isAndroidView ? "w-3.5 h-3.5" : "w-4 h-4"} />
                </Link>
                <Link
                  href="/collections?category=themed"
                  className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-[#1a1a1a] border border-[#e0ddd6] font-sans font-medium tracking-wide uppercase rounded-full transition-all duration-300 hover:border-[#C59B27] hover:bg-white hover:scale-105 active:scale-95 ${
                    isAndroidView ? "text-xs px-5 py-2.5" : "text-sm px-8 py-4"
                  }`}
                >
                  Bespoke Order
                </Link>
              </div>

              {/* Stats row */}
              {!isAndroidView && (
                <div className="flex items-center gap-8 mt-12 pt-8 border-t border-[#e0ddd6]">
                  {[
                    { val: "304", label: "Grade Stainless" },
                    { val: "500+", label: "Projects Delivered" },
                    { val: "8+", label: "Collections" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col">
                      <span className="font-display text-2xl font-black text-[#1a1a1a] tracking-tight">{s.val}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 mt-0.5">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Hero chair image (desktop only) */}
            {!isAndroidView && (
              <div className="hidden lg:flex flex-col items-end justify-center flex-1 pl-16 xl:pl-24 relative">
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    width: "min(52vw, 680px)",
                    height: "min(52vh, 520px)",
                    minHeight: 320,
                  }}
                >
                  <Image
                    src="/hero_chair.jpg"
                    alt="Sculptural Stainless Steel Chair"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1280px) 50vw, 700px"
                  />
                  {/* Frosted bottom label */}
                  <div className="absolute bottom-0 inset-x-0 px-5 py-3 bg-white/70 backdrop-blur-md border-t border-white/50 flex items-center justify-between">
                    <span className="font-display text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">Signature Collection</span>
                    <span className="font-mono text-[10px] text-[#C59B27] uppercase tracking-wider">304 Stainless · PVD Gold</span>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute top-6 -left-6 bg-white rounded-xl px-4 py-2.5 shadow-xl border border-[#e8e5de] flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stone-700">Architect-Approved</span>
                </div>
              </div>
            )}
          </div>

          {/* Chapter Chips (Kage-inspired navigation) — desktop only */}
          {!isAndroidView && (
            <div className="relative z-10 px-6 sm:px-12 lg:px-20 pb-8 mt-auto hidden lg:flex items-center gap-3">
              {chapters.map((ch, i) => (
                <button
                  key={ch.label}
                  onClick={() => scrollToChapter(i)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 border ${
                    activeChapter === i
                      ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                      : "bg-white/70 backdrop-blur-sm text-stone-600 border-[#e0ddd6] hover:border-[#C59B27] hover:text-[#C59B27]"
                  }`}
                >
                  <span className="text-[#C59B27] text-[10px]">{ch.icon}</span>
                  {ch.label}
                </button>
              ))}
              <span className="ml-auto font-mono text-[10px] text-stone-400 uppercase tracking-wider hidden xl:block">Scroll to explore ↓</span>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            CHAPTER 1: CRAFT & IDENTITY — "ABOUT US" SPLIT SCENE
            ═══════════════════════════════════════════════════════════════════════ */}
        <section
          ref={chapterRefs[0] as React.RefObject<HTMLElement>}
          className={`w-full relative overflow-hidden ${isAndroidView ? "py-10 px-4" : "py-24 sm:py-32 px-6 sm:px-12 lg:px-20"}`}
          style={{ background: "linear-gradient(180deg, #f4f2ed 0%, #ffffff 100%)" }}
        >
          {/* CAD schematic watermark */}
          <div className="absolute right-0 top-0 w-[600px] h-[600px] opacity-[0.035] pointer-events-none select-none hidden lg:block">
            <Image src="/hero_cad.jpg" alt="" fill className="object-contain" />
          </div>

          <div className={`max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 ${isAndroidView ? "gap-8" : "gap-16 lg:gap-24"} items-center`}>

            {/* Left: Image */}
            <div className={`relative ${isAndroidView ? "aspect-[16/9] w-full" : "aspect-[4/3] w-full max-w-[600px]"} rounded-2xl overflow-hidden shadow-xl`}>
              <Image
                src="/hero_dining.jpg"
                alt="Stallion Stainless Dining Suite"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Overlay label */}
              <div className="absolute bottom-0 inset-x-0 bg-white/85 backdrop-blur-sm px-5 py-3 flex items-center justify-between border-t border-white/60">
                <span className="font-mono text-[10px] uppercase tracking-widest text-stone-600">Italian Marble · Stainless Trestle</span>
                <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
              </div>
            </div>

            {/* Right: Text */}
            <div className="flex flex-col justify-center">
              {/* Section label */}
              <div className={`flex items-center gap-3 ${isAndroidView ? "mb-3" : "mb-5"}`}>
                <div className="w-8 h-[1px] bg-[#C59B27]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C59B27]">Chapter I · Craft</span>
              </div>

              <h2 className={`font-display font-black tracking-tight text-[#1a1a1a] leading-[0.95] ${isAndroidView ? "text-3xl mb-4" : "text-4xl sm:text-5xl lg:text-6xl mb-6"}`}>
                Authentic,<br />
                <span className="text-stone-400 font-light">Quality &</span><br />
                Luxury.
              </h2>

              <p className={`font-sans text-stone-600 leading-relaxed font-light ${isAndroidView ? "text-sm mb-6" : "text-base sm:text-lg mb-10 max-w-[460px]"}`}>
                Stallion Stainless represents the synthesis of architectural rigor and luxurious domestic living.
                We combine surgical-grade 304 stainless steel framing, vacuum PVD finishes, and bespoke Italian upholstery
                to engineer furniture that transcends trends.
              </p>

              {/* Three pillars */}
              <div className={`grid grid-cols-3 ${isAndroidView ? "gap-2" : "gap-4"}`}>
                {[
                  { icon: <Sparkles className="w-5 h-5 text-[#C59B27]" />, title: "Exclusive Design", sub: "Precision CAD" },
                  { icon: <ShieldCheck className="w-5 h-5 text-[#C59B27]" />, title: "Master Artisans", sub: "Professional Team" },
                  { icon: <HeartHandshake className="w-5 h-5 text-[#C59B27]" />, title: "Factory Direct", sub: "Fair Pricing" },
                ].map((p) => (
                  <div
                    key={p.title}
                    className={`bg-white border border-[#e8e5de] rounded-xl flex flex-col items-center text-center hover:border-[#C59B27]/50 hover:shadow-md transition-all duration-300 group ${
                      isAndroidView ? "p-3" : "p-5"
                    }`}
                  >
                    <div className={`rounded-lg bg-[#f8f7f4] flex items-center justify-center mb-3 ${isAndroidView ? "w-8 h-8" : "w-11 h-11"}`}>
                      {p.icon}
                    </div>
                    <h3 className={`font-display font-bold uppercase tracking-wide text-[#1a1a1a] ${isAndroidView ? "text-[9px] mb-1" : "text-[11px] mb-1.5"}`}>{p.title}</h3>
                    <span className={`font-mono text-stone-400 uppercase tracking-wider ${isAndroidView ? "text-[7px]" : "text-[9px]"}`}>{p.sub}</span>
                  </div>
                ))}
              </div>

              {/* Quote */}
              {!isAndroidView && (
                <div className="mt-8 pl-5 border-l-2 border-[#C59B27]/40">
                  <p className="font-sans text-sm text-stone-500 italic leading-relaxed">
                    &ldquo;Where heavy-duty structural steel meets cloud-soft tailored upholstery for multi-generational spaces.&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            CHAPTER 2: COLLECTIONS — BESPOKE HOLO CARDS + ARCHITECTURAL LINEUPS
            ═══════════════════════════════════════════════════════════════════════ */}
        <section
          ref={chapterRefs[1] as React.RefObject<HTMLElement>}
          className={`w-full relative overflow-hidden ${isAndroidView ? "py-10 px-3" : "py-24 sm:py-32 px-6 sm:px-12 lg:px-20"}`}
          style={{ background: "linear-gradient(180deg, #ededea 0%, #e4e2dc 100%)" }}
        >
          <ArchitecturalEmbers />

          {/* Sofa hero image strip — full bleed behind (desktop) */}
          {!isAndroidView && (
            <div className="absolute inset-0 pointer-events-none">
              <Image src="/hero_sofa.jpg" alt="" fill className="object-cover opacity-[0.06]" sizes="100vw" />
            </div>
          )}

          <div className="max-w-[1600px] mx-auto relative z-10">
            {/* Section header */}
            <div className={`flex flex-col ${isAndroidView ? "items-center text-center mb-6" : "lg:flex-row lg:items-end lg:justify-between mb-14 sm:mb-20"}`}>
              <div>
                <div className={`flex items-center gap-3 ${isAndroidView ? "justify-center mb-2" : "mb-4"}`}>
                  <div className="w-8 h-[1px] bg-[#C59B27]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C59B27]">Chapter II · Collections</span>
                </div>
                <h2 className={`font-display font-black tracking-tight text-[#2d394b] leading-[0.95] ${isAndroidView ? "text-2xl mb-2" : "text-4xl sm:text-5xl lg:text-6xl"}`}>
                  Bespoke<br />
                  <span className="italic font-light text-stone-500">Architectural</span><br />
                  Collections
                </h2>
              </div>
              <p className={`font-sans text-stone-600 font-light leading-relaxed ${isAndroidView ? "text-xs mt-1 mb-5" : "text-sm max-w-[320px] text-right hidden lg:block"}`}>
                {isAndroidView
                  ? "Tap any collection card to flip and view structural specifications."
                  : "Hover or click any collection card to inspect architectural details & materials."}
              </p>
            </div>

            {/* 6 Dual-Sided 3D Holo Cards Grid */}
            <div className={`grid ${isAndroidView ? "grid-cols-2 gap-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"} mb-16 sm:mb-24`}>
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

            {/* ─── ARCHITECTURAL LINEUPS GRID ─────────────────────────────────── */}
            <div className={`flex items-center gap-3 ${isAndroidView ? "mb-4" : "mb-8"}`}>
              <div className="w-8 h-[1px] bg-[#C59B27]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2d394b]">Our Architectural Lineups</span>
            </div>

            {isAndroidView ? (
              <div className="flex flex-wrap justify-center gap-2">
                {lineups.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="w-[calc((100%-8px)/3)] group relative bg-white rounded-lg overflow-hidden border border-stone-200 shadow-2xs transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="33vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>
                    <div className="py-1.5 px-1 text-center bg-white">
                      <h3 className="font-display text-[9px] leading-tight font-semibold text-[#1a1a1a] uppercase tracking-wider line-clamp-2 text-center">{item.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {lineups.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => router.push(item.href)}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-[#e8e5de] hover:border-[#C59B27]/50 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-1.5"
                  >
                    <div className="relative aspect-[3/2] w-full overflow-hidden bg-stone-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="25vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                        <ArrowUpRight className="w-4 h-4 text-[#C59B27]" />
                      </div>
                    </div>
                    <div className="py-3 px-4 flex flex-col bg-white relative">
                      <h3 className="font-display text-sm font-bold text-[#1a1a1a] uppercase tracking-wide group-hover:text-[#5e606c] transition-colors line-clamp-1">{item.name}</h3>
                      <p className="font-sans text-[11px] text-stone-500 tracking-wide mt-1 line-clamp-1">{item.subtitle}</p>
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-stone-300 via-[#C59B27] to-stone-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════════
            CHAPTER 3: PREMIER GRADE & BEST SELLING PRODUCT STRIPS
            ═══════════════════════════════════════════════════════════════════════ */}
        <section
          ref={chapterRefs[2] as React.RefObject<HTMLElement>}
          className={`w-full relative ${isAndroidView ? "py-8 px-3" : "py-20 sm:py-28 px-6 sm:px-12 lg:px-20"}`}
          style={{ background: "#f8f7f4" }}
        >
          <div className="max-w-[1680px] mx-auto">

            {/* Section label */}
            <div className={`flex items-center gap-3 ${isAndroidView ? "mb-4" : "mb-10"}`}>
              <div className="w-8 h-[1px] bg-[#C59B27]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5e606c]">Chapter III · Premier</span>
            </div>

            {/* ─── PREMIER GRADE ──────────────────────────────────────────────── */}
            <div id="pro-collection" className={`${isAndroidView ? "mb-8" : "mb-16 sm:mb-20"}`}>
              <div className={`flex items-center justify-between ${isAndroidView ? "mb-3" : "mb-6"}`}>
                <div className="flex items-center gap-3">
                  <Link href="/pro-collection" className="group inline-block">
                    <h3 className={`font-display font-black tracking-tight text-[#1a1a1a] uppercase group-hover:text-[#C59B27] transition-colors ${isAndroidView ? "text-xl" : "text-3xl sm:text-4xl"}`}>
                      PREMIER GRADE
                    </h3>
                  </Link>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#1a1a1a] text-white text-[9px] font-mono uppercase tracking-wider">Scroll Series →</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/pro-collection" className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-sans font-semibold text-[#5e606c] hover:text-[#C59B27] tracking-wider uppercase transition-colors mr-1 sm:mr-2">
                    <span>View Full Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => scrollSection(proScrollRef, "left")} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#e8e5de] bg-white hover:bg-[#1a1a1a] hover:border-[#1a1a1a] hover:text-white flex items-center justify-center text-[#1a1a1a] shadow-sm transition-all active:scale-95 cursor-pointer" aria-label="Scroll left">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => scrollSection(proScrollRef, "right")} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#e8e5de] bg-white hover:bg-[#1a1a1a] hover:border-[#1a1a1a] hover:text-white flex items-center justify-center text-[#1a1a1a] shadow-sm transition-all active:scale-95 cursor-pointer" aria-label="Scroll right">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div ref={proScrollRef} className={`flex overflow-x-auto ${isAndroidView ? "gap-2" : "gap-4 sm:gap-5"} pb-3 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory no-scrollbar w-full`}>
                {proProducts.map((product) => (
                  isAndroidView ? (
                    <article key={product.id} className="w-[calc((100vw-3rem)/3)] min-w-[108px] max-w-[130px] shrink-0 snap-start bg-white rounded-lg overflow-hidden border border-stone-200 shadow-2xs flex flex-col">
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image src={product.images?.[0] || "/products/aris/H.jpg"} alt={product.name} fill className="object-cover" sizes="33vw" />
                        </div>
                        <div className="py-1.5 px-1 flex-1 flex flex-col justify-between bg-white">
                          <h4 className="font-display text-[9.5px] font-bold text-[#1a1a1a] uppercase tracking-wider truncate text-center">{product.name}</h4>
                          <div className="flex items-center justify-center gap-1 pt-1 border-t border-stone-100">
                            {product.colors.slice(0, 4).map((color) => (
                              <div key={color.name} className="w-2 h-2 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: color.hex }} title={color.name} />
                            ))}
                            {product.colors.length > 4 && <span className="text-[7.5px] font-mono text-stone-400">+{product.colors.length - 4}</span>}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ) : (
                    <article key={product.id} className="w-[calc((100%-4.5rem)/4)] min-w-[260px] max-w-[320px] shrink-0 snap-start group bg-white rounded-2xl overflow-hidden border border-[#e8e5de] hover:border-[#C59B27]/50 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-2">
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image src={product.images?.[0] || "/products/aris/H.jpg"} alt={product.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="25vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                            <ArrowUpRight className="w-4 h-4 text-[#C59B27]" />
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between bg-white relative">
                          <h4 className="font-display text-base font-bold text-[#1a1a1a] uppercase tracking-wide group-hover:text-[#5e606c] transition-colors text-center">{product.name}</h4>
                          <p className="font-sans text-xs text-stone-500 tracking-wide line-clamp-1 mt-1 mb-3 text-center">{product.tagline}</p>
                          <div className="flex items-center justify-center pt-2.5 border-t border-stone-100">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {product.colors.slice(0, 5).map((color) => (
                                <div key={color.name} className="w-3 h-3 rounded-full border border-stone-300 shadow-2xs transition-transform group-hover:scale-110" style={{ backgroundColor: color.hex }} title={color.name} />
                              ))}
                              {product.colors.length > 5 && <span className="text-[9px] font-mono text-stone-400">+{product.colors.length - 5}</span>}
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

            {/* ─── BEST SELLING ────────────────────────────────────────────────── */}
            <div id="best-selling" className={`${isAndroidView ? "pt-4" : "pt-8"} border-t border-[#e8e5de]`}>
              <div className={`flex items-center justify-between ${isAndroidView ? "mb-3" : "mb-6"}`}>
                <div className="flex items-center gap-3">
                  <Link href="/best-selling" className="group inline-block">
                    <h3 className={`font-display font-black tracking-tight text-[#1a1a1a] uppercase group-hover:text-[#C59B27] transition-colors ${isAndroidView ? "text-xl" : "text-3xl sm:text-4xl"}`}>
                      BEST SELLING
                    </h3>
                  </Link>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#C59B27] text-white text-[9px] font-mono uppercase tracking-wider">Scroll Series →</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/best-selling" className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-sans font-semibold text-[#5e606c] hover:text-[#C59B27] tracking-wider uppercase transition-colors mr-1 sm:mr-2">
                    <span>View Full Series</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => scrollSection(bestSellingScrollRef, "left")} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#e8e5de] bg-white hover:bg-[#1a1a1a] hover:border-[#1a1a1a] hover:text-white flex items-center justify-center text-[#1a1a1a] shadow-sm transition-all active:scale-95 cursor-pointer" aria-label="Scroll left">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => scrollSection(bestSellingScrollRef, "right")} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#e8e5de] bg-white hover:bg-[#1a1a1a] hover:border-[#1a1a1a] hover:text-white flex items-center justify-center text-[#1a1a1a] shadow-sm transition-all active:scale-95 cursor-pointer" aria-label="Scroll right">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div ref={bestSellingScrollRef} className={`flex overflow-x-auto ${isAndroidView ? "gap-2" : "gap-4 sm:gap-5"} pb-3 pt-1 px-0.5 scroll-smooth snap-x snap-mandatory no-scrollbar w-full`}>
                {bestSellingProducts.map((product) => (
                  isAndroidView ? (
                    <article key={product.id} className="w-[calc((100vw-3rem)/3)] min-w-[108px] max-w-[130px] shrink-0 snap-start bg-white rounded-lg overflow-hidden border border-stone-200 shadow-2xs flex flex-col">
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image src={product.images?.[0] || "/products/aris/H.jpg"} alt={product.name} fill className="object-cover" sizes="33vw" />
                        </div>
                        <div className="py-1.5 px-1 flex-1 flex flex-col justify-between bg-white">
                          <h4 className="font-display text-[9.5px] font-bold text-[#1a1a1a] uppercase tracking-wider truncate text-center">{product.name}</h4>
                          <div className="flex items-center justify-center gap-1 pt-1 border-t border-stone-100">
                            {product.colors.slice(0, 4).map((color) => (
                              <div key={color.name} className="w-2 h-2 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: color.hex }} title={color.name} />
                            ))}
                            {product.colors.length > 4 && <span className="text-[7.5px] font-mono text-stone-400">+{product.colors.length - 4}</span>}
                          </div>
                        </div>
                      </Link>
                    </article>
                  ) : (
                    <article key={product.id} className="w-[calc((100%-4.5rem)/4)] min-w-[260px] max-w-[320px] shrink-0 snap-start group bg-white rounded-2xl overflow-hidden border border-[#e8e5de] hover:border-[#C59B27]/50 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col hover:-translate-y-2">
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                          <Image src={product.images?.[0] || "/products/aris/H.jpg"} alt={product.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="25vw" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/85 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
                            <ArrowUpRight className="w-4 h-4 text-[#C59B27]" />
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between bg-white relative">
                          <h4 className="font-display text-base font-bold text-[#1a1a1a] uppercase tracking-wide group-hover:text-[#5e606c] transition-colors text-center">{product.name}</h4>
                          <p className="font-sans text-xs text-stone-500 tracking-wide line-clamp-1 mt-1 mb-3 text-center">{product.tagline}</p>
                          <div className="flex items-center justify-center pt-2.5 border-t border-stone-100">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              {product.colors.slice(0, 5).map((color) => (
                                <div key={color.name} className="w-3 h-3 rounded-full border border-stone-300 shadow-2xs transition-transform group-hover:scale-110" style={{ backgroundColor: color.hex }} title={color.name} />
                              ))}
                              {product.colors.length > 5 && <span className="text-[9px] font-mono text-stone-400">+{product.colors.length - 5}</span>}
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

        {/* ═══════════════════════════════════════════════════════════════════════
            DESIGN NEWS & INSIGHTS (desktop only)
            ═══════════════════════════════════════════════════════════════════════ */}
        {!isAndroidView && (
          <section className="w-full py-20 sm:py-28 px-6 sm:px-12 lg:px-20 border-b border-[#e4e2dc]" style={{ background: "#f0ede7" }}>
            <div className="max-w-[1600px] mx-auto">
              <div className={`flex items-center gap-3 mb-12`}>
                <div className="w-8 h-[1px] bg-[#C59B27]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5e606c]">Craft Journal</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl text-[#1a1a1a] tracking-tight uppercase mb-12 leading-[0.95]">
                News &<br /><span className="italic font-light text-stone-400">Insights</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {articles.map((art, idx) => (
                  <article key={idx} className="bg-white rounded-2xl overflow-hidden border border-[#e4e2dc] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                      <Image src={art.image} alt={art.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-mono font-bold uppercase tracking-wider text-[#5e606c]">{art.tag}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-stone-400 text-[11px] font-mono mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#C59B27]" />{art.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{art.readTime}</span>
                      </div>
                      <h3 className="font-display text-base font-bold text-[#1a1a1a] group-hover:text-[#5e606c] transition-colors mb-2.5 line-clamp-2">{art.title}</h3>
                      <p className="font-sans text-xs sm:text-[13px] text-stone-500 leading-relaxed line-clamp-3">{art.snippet}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            CHAPTER 4: FULL-BLEED LIVING GALLERY
            ═══════════════════════════════════════════════════════════════════════ */}
        <section
          ref={chapterRefs[3] as React.RefObject<HTMLElement>}
          className={`w-full overflow-hidden ${isAndroidView ? "pt-6" : "pt-0"}`}
        >
          {/* Section header */}
          <div className={`px-6 sm:px-12 lg:px-20 ${isAndroidView ? "mb-4 pt-2" : "mb-8 pt-20"}`} style={{ background: "#f8f7f4" }}>
            <div className={`flex items-center gap-3 ${isAndroidView ? "mb-2" : "mb-4"}`}>
              <div className="w-8 h-[1px] bg-[#C59B27]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#5e606c]">Chapter IV · Gallery</span>
            </div>
            <h2 className={`font-display font-black tracking-tight text-[#1a1a1a] leading-[0.95] ${isAndroidView ? "text-2xl mb-4" : "text-4xl sm:text-5xl mb-8"}`}>
              Architectural<br />
              <span className="italic font-light text-stone-400">Living Spaces</span>
            </h2>
          </div>

          {/* Desktop: 6-column grid */}
          <div className={`${isAndroidView ? "hidden lg:grid" : "hidden sm:grid"} grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full`}>
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-square w-full overflow-hidden bg-stone-900 cursor-pointer"
                onClick={() => router.push("/collections")}
              >
                <Image src={img.src} alt={img.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="16vw" />
                <div className="absolute inset-0 bg-[#1a1a1a]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between text-white">
                  <div className="text-right">
                    <ArrowUpRight className="w-5 h-5 text-[#C59B27] inline-block" />
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#C59B27] block">{img.tag}</span>
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-center">{img.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: loop scroll */}
          <div className={`${isAndroidView ? "block lg:hidden" : "block sm:hidden"} relative w-full overflow-hidden`}>
            <button type="button" onClick={() => scrollGallery("left")} aria-label="Scroll left" className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg active:scale-90 border border-white/20">
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button type="button" onClick={() => scrollGallery("right")} aria-label="Scroll right" className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs text-white flex items-center justify-center shadow-lg active:scale-90 border border-white/20">
              <ChevronRight className="w-4 h-4 text-white" />
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
