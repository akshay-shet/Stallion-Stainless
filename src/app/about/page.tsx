"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import AboutFounderCinematic from "@/components/AboutFounderCinematic";
import AboutPortfolioShowcase from "@/components/AboutPortfolioShowcase";

/* ── animated counter hook ────────────────────────────────────────── */
function useCounter(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(Math.round(eased * target));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value;
}

/* ── data ─────────────────────────────────────────────────────────── */
const milestones = [
  { year: "1985", event: "First-ever use of stainless steel in architecture and interiors in India" },
  { year: "1987", event: "Full range of office chairs launched; wall-cladding interiors introduced" },
  { year: "1987", event: "Building fascia and column cladding completed" },
  { year: "1988", event: "Door & window frames developed for sale through Salem Steel Plant" },
  { year: "1988", event: "Pioneered use of 430-grade stainless steel in architectural railings" },
  { year: "1990s", event: "Expanded into airports, temples, hospitals, restaurants & offices nationwide" },
  { year: "2000s", event: "Steel Authority of India Limited partnership — promoted architectural steel" },
  { year: "Today", event: "Stallion operates from Bangalore & Delhi, recognized across the country" },
];

const applications = [
  "Column & Fascia Cladding",
  "Space Frames & Canopies",
  "Door & Window Frames",
  "Architectural Railings",
  "Custom Signage Systems",
  "Street Furniture",
  "Visual Merchandising Fixtures",
  "Domestic & Office Furniture",
  "Accessories & Décor",
  "Industrial Cable Trays",
];

/* ══════════════════════════════════════════════════════════════════════
   HERO — Cinematic Executive Suite matching the Monochrome Studio Frames
   Desktop: 2 columns (Left: Information, Right: Video)
   Android: Video starts at the TOP (order-1), Information starts NEXT (order-2)
══════════════════════════════════════════════════════════════════════ */
function AboutHero({ isAndroidView = false }: { isAndroidView?: boolean }) {
  return (
    <section
      className="relative w-full bg-[#0e0e10] overflow-hidden"
      style={{
        minHeight: isAndroidView ? "auto" : "calc(100vh - 88px)",
        background: "radial-gradient(circle at 72% 40%, rgba(95,95,105,0.22) 0%, rgba(24,24,28,0.7) 48%, #0e0e10 100%)",
      }}
    >
      {/* Subtle architectural millimeter grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main layout: on Desktop grid-cols-2; on Android single column */}
      <div
        className={`relative z-10 h-full ${
          isAndroidView
            ? "flex flex-col"
            : "flex flex-col lg:grid lg:grid-cols-2"
        }`}
        style={{ minHeight: isAndroidView ? "auto" : "calc(100vh - 88px)" }}
      >
        {/* ── VIDEO: On Android it starts at the TOP (order-1); On Desktop it is on the Right (order-2) ── */}
        <div
          className={`relative overflow-hidden w-full bg-[#0e0e10] flex items-center justify-center ${
            isAndroidView
              ? "order-1 aspect-video min-h-[220px] max-h-[460px]"
              : "order-1 lg:order-2 min-h-[460px] sm:min-h-[540px] lg:min-h-full"
          }`}
        >
          <AboutFounderCinematic variant="hero" autoPlayOnVisible={true} isAndroidView={isAndroidView} />
        </div>

        {/* ── INFORMATION: On Android it starts NEXT below video (order-2); On Desktop it is on the Left (order-1) ── */}
        <div
          className={`flex flex-col justify-between ${
            isAndroidView
              ? "order-2 px-5 sm:px-10 py-8"
              : "order-2 lg:order-1 px-8 sm:px-14 lg:px-16 xl:px-20 py-12 lg:py-16"
          }`}
        >
          {/* Giant STALLION title */}
          <div className={`flex flex-col gap-5 sm:gap-6 my-auto ${isAndroidView ? "py-4 sm:py-6" : "py-10"}`}>
            <h1
              className="font-display font-black uppercase text-white leading-none select-none drop-shadow-md"
              style={{
                fontSize: isAndroidView ? "clamp(2.75rem, 11vw, 4.5rem)" : "clamp(3.5rem, 8vw, 8rem)",
                letterSpacing: "-0.03em",
              }}
            >
              STALL<span className="text-[#C59B27]">ION</span>
            </h1>

            <div className="h-px bg-gradient-to-r from-[#C59B27] via-[#e8c84a]/50 to-transparent w-3/4" />

            <p className="font-sans text-sm sm:text-base text-zinc-300/80 leading-relaxed max-w-md">
              Four decades of pioneering stainless steel architecture in India — from airports to monuments,
              residences to highways. Recognized by the Steel Authority of India Limited.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              {["Architectural Steel", "PVD Furniture", "Bespoke Fabrication", "SAIL Partner"].map((t) => (
                <span key={t} className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  <span className="w-4 h-px bg-[#C59B27]/80 shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom info row */}
          <div className="flex flex-wrap gap-6 items-center pt-4 border-t border-white/10">
            {[
              { num: "40+", label: "Years Mastery" },
              { num: "500+", label: "Landmark Works" },
              { num: "50+", label: "Cities Nationwide" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="font-display font-black text-2xl text-white">{s.num}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ══ PAGE ═════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  const [isAndroidView, setIsAndroidView] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent || "";
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua) ||
        window.location.search.includes("android") ||
        window.location.search.includes("view=android") ||
        window.innerWidth < 1024;
      if (isMobile) {
        setIsAndroidView(true);
      }
    }
  }, []);

  /* counters */
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const years    = useCounter(40,  2000, statsVisible);
  const cities   = useCounter(50,  1800, statsVisible);
  const projects = useCounter(500, 2200, statsVisible);
  const clients  = useCounter(98,  1600, statsVisible);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  /* milestone scroll-reveal */
  const [visibleMs, setVisibleMs] = useState<number[]>([]);
  const msRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const idx = Number(e.target.getAttribute("data-idx"));
          if (e.isIntersecting) setVisibleMs((prev) => [...new Set([...prev, idx])]);
        });
      },
      { threshold: 0.15 }
    );
    msRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0e0e10] text-[#f4f4f5]">
      <Header />

      <main className="flex-1 pt-[72px] sm:pt-[88px] w-full overflow-x-hidden">

        {/* ══ 1. HERO ══════════════════════════════════════════════════ */}
        <AboutHero isAndroidView={isAndroidView} />

        {/* ══ 2. STATS ═════════════════════════════════════════════════ */}
        <section
          ref={statsRef}
          className="w-full bg-[#121216] py-12 sm:py-16 px-6 sm:px-12 lg:px-20 border-y border-white/10"
        >
          <div className="max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            {[
              { value: years,    suffix: "+", label: "Years of Mastery" },
              { value: cities,   suffix: "+", label: "Cities Across India" },
              { value: projects, suffix: "+", label: "Landmark Projects" },
              { value: clients,  suffix: "%", label: "Client Satisfaction" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="font-display font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-none tabular-nums">
                  {s.value}<span className="text-[#C59B27]">{s.suffix}</span>
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 3. ORIGIN STORY ══════════════════════════════════════════ */}
        <section className="w-full bg-[#0e0e10] py-20 sm:py-28 px-6 sm:px-12 lg:px-20 border-b border-white/10">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left sticky label */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C59B27] flex items-center gap-2">
                <span className="inline-block w-8 h-px bg-[#C59B27]" />
                Our Origin Story
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Born from<br />Bold Vision
              </h2>
              <div className="h-px bg-gradient-to-r from-[#C59B27]/60 via-[#e8c84a]/30 to-transparent" />

              {/* Quote card */}
              <div className="bg-gradient-to-br from-[#18181f] to-[#121216] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl">
                <p className="font-sans text-sm text-zinc-300 italic leading-relaxed">
                  &ldquo;The metal seemed to melt in their hands, taking whatever shape they conceived — energetic, full of gallop and movement. Thus began Stallion.&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 border border-[#C59B27]/50 shadow-md">
                    <Image src="/chairman-final-pose.png" alt="Chairman" fill className="object-cover object-top" sizes="40px" />
                  </div>
                  <div>
                    <p className="font-display text-[12px] font-bold text-white uppercase tracking-wider">Kamalesh Mehta</p>
                    <p className="font-sans text-[10px] text-zinc-300 font-medium">Chairman &amp; Co-Founder</p>
                    <p className="font-mono text-[9px] text-[#C59B27] uppercase tracking-wide mt-0.5">Stallion Stainless · Est. 1985</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: story paragraphs */}
            <div className="lg:col-span-8 space-y-6 font-sans text-sm sm:text-base text-zinc-400 leading-relaxed">
              <p>
                From the <strong className="text-white font-semibold">mid-1980s</strong>, India&apos;s architecture, building, and construction industries opened their arms to stainless steel. The opportunities were unlimited, and the applications were challenging. Handling and crafting stainless steel for architectural purposes was an entirely new field — there were no fabricators specialising in this space.
              </p>
              <p>
                One family of <strong className="text-white font-semibold">adventurous businessmen</strong> foresaw the potential of stainless steel and was captivated by its durable beauty. Their imaginations ran wild, and they refused to stop experimenting with the material — consistently transforming bold ideas into extraordinary reality.
              </p>
              <p>
                This venture came to be called <strong className="text-white font-semibold">Stallion</strong> — energetic, full of gallop and movement. Thus began Stallion&apos;s relationship with stainless steel, and eventually with all metals.
              </p>
              <p>
                The <strong className="text-white font-semibold">Steel Authority of India Limited</strong> recognised Stallion&apos;s talent and partnered with the company to promote the use of steel. This association led to remarkable applications across architecture, furniture, and accessories.
              </p>
              <p>
                Over the next two decades, Stallion left its mark in places as varied as <strong className="text-white font-semibold">airports and temples, hospitals and restaurants, offices and gardens, historical monuments and modern shopping complexes, factories and residences, streets and highways.</strong>
              </p>
              <p>
                Galloping ahead, Stallion — now based in <strong className="text-white font-semibold">Bangalore and Delhi</strong> — is recognised for its craftsmanship with metal and its ability to accomplish the impossible. Design inputs are reviewed by in-house experts to ensure perfection at every stage, from concept to execution.
              </p>
            </div>
          </div>
        </section>

        {/* ══ 3.5 LANDMARK PORTFOLIO SHOWCASE ═════════════════════════════ */}
        <AboutPortfolioShowcase />

        {/* ══ 4. APPLICATIONS ══════════════════════════════════════════ */}
        <section className="w-full bg-[#121216] py-20 sm:py-24 px-6 sm:px-12 lg:px-20 border-b border-white/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C59B27] flex items-center gap-2 mb-4">
                <span className="inline-block w-8 h-px bg-[#C59B27]" />
                What We Build
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight">
                Applications
              </h2>
              <div className="mt-4 h-px bg-gradient-to-r from-white/20 via-[#C59B27]/50 to-transparent" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {applications.map((app, i) => (
                <div
                  key={i}
                  className="group bg-[#18181f] border border-white/10 hover:border-[#C59B27]/80 hover:bg-[#1f1f28] hover:shadow-xl hover:shadow-[#C59B27]/5 rounded-xl p-5 transition-all duration-300 cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] text-[#C59B27] mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-sm font-semibold text-zinc-200 uppercase tracking-wide leading-tight group-hover:text-white transition-colors">
                      {app}
                    </span>
                  </div>
                  <div className="mt-3 h-px bg-gradient-to-r from-[#C59B27]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 5. MILESTONE TIMELINE ════════════════════════════════════ */}
        <section className="w-full bg-[#0e0e10] py-20 sm:py-28 px-6 sm:px-12 lg:px-20 border-b border-white/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-14">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C59B27] flex items-center gap-2 mb-4">
                <span className="inline-block w-8 h-px bg-[#C59B27]" />
                Stallion Milestones
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase tracking-tight">
                40 Years of Firsts
              </h2>
              <div className="mt-4 h-px bg-gradient-to-r from-white/20 via-[#C59B27]/50 to-transparent" />
            </div>

            <div className="relative">
              {/* Vertical spine */}
              <div className="absolute left-[68px] sm:left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-[#C59B27]/70 via-white/15 to-transparent hidden sm:block" />

              <div className="flex flex-col gap-6">
                {milestones.map((m, i) => (
                  <div
                    key={i}
                    ref={(el) => { msRefs.current[i] = el; }}
                    data-idx={i}
                    className={`flex gap-6 sm:gap-10 transition-all duration-700 ${
                      visibleMs.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="shrink-0 w-[72px] sm:w-[88px] text-right">
                      <span className="inline-block font-mono font-bold text-sm sm:text-base text-[#C59B27] bg-[#18181f] border border-[#C59B27]/30 rounded-lg px-2.5 py-1 tracking-wider shadow-md">
                        {m.year}
                      </span>
                    </div>
                    <div className="hidden sm:flex items-start pt-2.5 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-[#C59B27] ring-4 ring-[#0e0e10] relative z-10" />
                    </div>
                    <div className="flex-1 pb-6 border-b border-white/10 last:border-0">
                      <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 6. FOUNDER CARD (dark studio) ═════════════════════════════ */}
        <section className="w-full bg-[#121216] py-20 sm:py-24 px-6 sm:px-12 lg:px-20 border-b border-white/10">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Portrait */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div className="relative w-64 h-80 sm:w-72 sm:h-96">
                <div className="absolute -top-2 -left-2 w-full h-full border border-[#C59B27]/40 rounded-xl z-0" />
                <div className="relative w-full h-full rounded-xl overflow-hidden z-10 border border-white/10 shadow-2xl bg-black">
                  <Image
                    src="/chairman-final-pose.png"
                    alt="Chairman & Co-Founder, Stallion Stainless"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 256px, 288px"
                  />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C59B27] flex items-center gap-2">
                <span className="inline-block w-8 h-px bg-[#C59B27]" />
                Founding Vision
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                The Man Behind<br />
                <span className="text-[#C59B27]">The Stallion</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-zinc-300/80 leading-relaxed max-w-2xl">
                Intuitive creation supported by technical expertise, and visualization made possible through technological advances. From the very first application of stainless steel in Indian architecture in 1985, the founder&apos;s vision has shaped an entire industry.
              </p>
              <p className="font-sans text-sm text-zinc-400 leading-relaxed max-w-2xl">
                At Stallion, innovation is a constant endeavour as we shape the future — introducing a complete range of lifestyle products designed to add beauty and utility to every living space.
              </p>
              <div className="h-px bg-white/10" />
              <div className="flex flex-col gap-1">
                <p className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                  Kamalesh Mehta
                </p>
                <p className="font-display text-sm font-bold text-zinc-300 uppercase tracking-widest">
                  Chairman &amp; Co-Founder
                </p>
                <p className="font-mono text-[11px] text-[#C59B27] uppercase tracking-[0.2em]">
                  Stallion Stainless · Est. 1985
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 7. CTA STRIP ═════════════════════════════════════════════ */}
        <section className="w-full bg-[#18181f] py-16 sm:py-20 px-6 sm:px-12 lg:px-20 border-t border-white/10">
          <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
                Experience the Stallion Difference
              </h3>
              <p className="font-sans text-sm text-zinc-400 mt-1.5">
                Explore our full range of architectural stainless steel furniture.
              </p>
            </div>
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#C59B27] text-[#0e0e10] font-display font-bold text-xs uppercase tracking-widest hover:bg-[#d4a82e] hover:shadow-lg hover:shadow-[#C59B27]/25 transition-all duration-300 shrink-0"
            >
              Browse Collections
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
