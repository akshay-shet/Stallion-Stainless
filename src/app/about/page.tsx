"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Image as ImageIcon, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Hammer, 
  Compass, 
  User,
  Building2
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-charcoal-ink">
      <Header />

      <main className="flex-1 pt-[72px] sm:pt-[88px] w-full pb-24">
        {/* Top Breadcrumb Bar */}
        <div className="border-b border-outline-variant/60 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-3.5 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500">
            <Link href="/" className="hover:text-charcoal-ink transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-charcoal-ink font-semibold">About</span>
            <span className="ml-auto text-[11px] text-stone-400 font-mono tracking-wider hidden sm:inline-block">
              [ PAGE SKELETAL WIREFRAME ]
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-10 space-y-20">
          
          {/* SECTION: HERO / BRAND INTRO SKELETON */}
          <section className="space-y-8">
            {/* Header Tag / Eyebrow */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-stone-300 bg-stone-100/70 text-[11px] font-mono tracking-widest uppercase text-stone-500">
                <Sparkles className="w-3 h-3 text-stone-400" />
                <span>[ Eyebrow / Brand Classification Slot ]</span>
              </div>

              {/* Main Headline Skeleton */}
              <div className="space-y-3">
                <div className="h-10 md:h-14 w-3/4 max-w-2xl bg-stone-200/80 rounded animate-pulse" />
                <div className="h-10 md:h-14 w-1/2 max-w-lg bg-stone-200/60 rounded animate-pulse" />
              </div>

              {/* Subheading / Abstract Lines Skeleton */}
              <div className="pt-2 space-y-2 max-w-2xl">
                <div className="h-4 w-full bg-stone-200/70 rounded" />
                <div className="h-4 w-5/6 bg-stone-200/60 rounded" />
                <div className="h-4 w-2/3 bg-stone-200/50 rounded" />
              </div>
            </div>

            {/* Hero Visual / Media Frame Placeholder */}
            <div className="w-full aspect-[21/9] min-h-[280px] md:min-h-[420px] rounded-xl border-2 border-dashed border-stone-300 bg-stone-100/60 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-500 shadow-sm">
                  <ImageIcon className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div className="font-mono text-xs md:text-sm font-semibold text-stone-600 tracking-wider uppercase">
                  [ Hero Visual / Cinematic Studio Showcase Media Slot ]
                </div>
                <p className="font-mono text-[11px] text-stone-400 max-w-md">
                  Recommended: High-Resolution 21:9 Architectural Photograph or Video Loop
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 01: BRAND NARRATIVE & DESIGN ETHOS (TWO COLUMN) */}
          <section className="pt-4 border-t border-stone-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Narrative Wireframe Slots */}
              <div className="lg:col-span-6 space-y-6">
                <div className="text-[11px] font-mono tracking-widest text-stone-400 uppercase">
                  [ 01 / Philosophy & Architectural Ethos ]
                </div>

                {/* Section Title Placeholder */}
                <div className="h-8 md:h-10 w-4/5 bg-stone-200/80 rounded" />

                {/* Paragraph 1 Skeleton */}
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full bg-stone-200/70 rounded" />
                  <div className="h-4 w-11/12 bg-stone-200/65 rounded" />
                  <div className="h-4 w-4/5 bg-stone-200/55 rounded" />
                </div>

                {/* Paragraph 2 Skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-stone-200/70 rounded" />
                  <div className="h-4 w-5/6 bg-stone-200/60 rounded" />
                  <div className="h-4 w-3/4 bg-stone-200/50 rounded" />
                </div>

                {/* Quote / Highlight Callout Box */}
                <div className="p-6 rounded-lg border-l-4 border-charcoal-ink/30 bg-stone-100/80 border border-stone-200/60 space-y-3">
                  <div className="font-mono text-[11px] text-stone-400 uppercase tracking-wider">
                    [ Founder / Chief Architect Statement Slot ]
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-stone-200/80 rounded italic" />
                    <div className="h-4 w-4/5 bg-stone-200/70 rounded italic" />
                  </div>
                  <div className="h-3 w-1/3 bg-stone-300/60 rounded pt-1" />
                </div>
              </div>

              {/* Right Column: Visual Feature Image Slot */}
              <div className="lg:col-span-6">
                <div className="w-full aspect-[4/5] min-h-[380px] rounded-xl border-2 border-dashed border-stone-300 bg-stone-100/60 flex flex-col items-center justify-center p-8 text-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-500 shadow-sm">
                      <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="font-mono text-xs md:text-sm font-semibold text-stone-600 tracking-wider uppercase">
                      [ Brand Atelier / Crafting Process Media Slot ]
                    </div>
                    <p className="font-mono text-[11px] text-stone-400">
                      Recommended: 4:5 Vertical Artisan Craftsmanship Visual
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 02: CORE PILLARS & CRAFTSMANSHIP STANDARDS (4-CARD GRID) */}
          <section className="pt-4 border-t border-stone-200 space-y-8">
            <div className="space-y-2">
              <div className="text-[11px] font-mono tracking-widest text-stone-400 uppercase">
                [ 02 / Core Pillars & Engineering Standards ]
              </div>
              <div className="h-8 w-64 bg-stone-200/80 rounded" />
              <div className="h-4 w-96 max-w-full bg-stone-200/60 rounded" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: ShieldCheck, label: "Pillar 01 / Structural Integrity" },
                { icon: Hammer, label: "Pillar 02 / Precision Fabrication" },
                { icon: Sparkles, label: "Pillar 03 / Surface Finishing" },
                { icon: Compass, label: "Pillar 04 / Ergonomic Architecture" }
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-xl border border-dashed border-stone-300 bg-white shadow-sm flex flex-col justify-between space-y-6 relative group"
                  >
                    <div className="space-y-4">
                      {/* Icon Slot */}
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 border border-stone-200">
                        <IconComp className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      {/* Title Slot */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">
                          [ {item.label} ]
                        </div>
                        <div className="h-5 w-3/4 bg-stone-200/80 rounded" />
                      </div>
                      {/* Description Skeleton */}
                      <div className="space-y-2 pt-2">
                        <div className="h-3.5 w-full bg-stone-200/70 rounded" />
                        <div className="h-3.5 w-5/6 bg-stone-200/60 rounded" />
                        <div className="h-3.5 w-4/6 bg-stone-200/50 rounded" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span>[ Spec Code Slot ]</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 03: HERITAGE & EVOLUTION MILESTONES */}
          <section className="pt-4 border-t border-stone-200 space-y-8">
            <div className="space-y-2">
              <div className="text-[11px] font-mono tracking-widest text-stone-400 uppercase">
                [ 03 / Heritage & Evolution Milestones ]
              </div>
              <div className="h-8 w-72 bg-stone-200/80 rounded" />
              <div className="h-4 w-80 max-w-full bg-stone-200/60 rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="p-6 rounded-xl border border-stone-200 bg-white/70 space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-stone-400 uppercase">
                      [ Phase 0{step} ]
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-mono text-stone-500 border border-stone-200">
                      [ Year Slot ]
                    </span>
                  </div>
                  <div className="h-5 w-4/5 bg-stone-200/80 rounded" />
                  <div className="space-y-2 pt-2">
                    <div className="h-3.5 w-full bg-stone-200/70 rounded" />
                    <div className="h-3.5 w-5/6 bg-stone-200/60 rounded" />
                    <div className="h-3.5 w-3/4 bg-stone-200/50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 04: ARCHITECTURAL WORKSHOP & ATELIER GALLERY SKELETON */}
          <section className="pt-4 border-t border-stone-200 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="text-[11px] font-mono tracking-widest text-stone-400 uppercase">
                  [ 04 / Studio Atelier & Precision Gallery ]
                </div>
                <div className="h-8 w-80 bg-stone-200/80 rounded" />
                <div className="h-4 w-96 max-w-full bg-stone-200/60 rounded" />
              </div>
              <div className="h-9 w-40 border border-dashed border-stone-300 rounded-lg flex items-center justify-center font-mono text-xs text-stone-400">
                [ Action / Filter Slot ]
              </div>
            </div>

            {/* Gallery Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Fabrication Facility Slot", ratio: "aspect-[4/3]" },
                { label: "Material Metallurgy Lab Slot", ratio: "aspect-[4/3]" },
                { label: "Assembly & Finish Studio Slot", ratio: "aspect-[4/3]" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`w-full ${item.ratio} rounded-xl border-2 border-dashed border-stone-300 bg-stone-100/60 flex flex-col items-center justify-center p-6 text-center relative group`}
                >
                  <div className="w-10 h-10 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-500 mb-3">
                    <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="font-mono text-xs font-semibold text-stone-600 tracking-wider uppercase">
                    [ {item.label} ]
                  </div>
                  <div className="text-[10px] font-mono text-stone-400 mt-1">
                    Image Placeholder Slot
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 05: LEADERSHIP & MASTER CRAFTSPEOPLE SKELETON */}
          <section className="pt-4 border-t border-stone-200 space-y-8">
            <div className="space-y-2">
              <div className="text-[11px] font-mono tracking-widest text-stone-400 uppercase">
                [ 05 / Artisans, Engineers & Leadership ]
              </div>
              <div className="h-8 w-72 bg-stone-200/80 rounded" />
              <div className="h-4 w-80 max-w-full bg-stone-200/60 rounded" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((member) => (
                <div key={member} className="space-y-4">
                  <div className="w-full aspect-square rounded-xl border-2 border-dashed border-stone-300 bg-stone-100/60 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-400 mb-2">
                      <User className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <span className="font-mono text-[10px] text-stone-400 uppercase">
                      [ Portrait Slot ]
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-4 w-3/4 bg-stone-200/80 rounded" />
                    <div className="h-3.5 w-1/2 bg-stone-200/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 06: INQUIRY & STUDIO VISIT CTA CARD SKELETON */}
          <section className="pt-4 border-t border-stone-200">
            <div className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-100/50 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
              <div className="space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-stone-400">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>[ CTA Section Slot ]</span>
                </div>
                <div className="h-8 md:h-10 w-3/4 bg-stone-200/80 rounded mx-auto md:mx-0" />
                <div className="space-y-2 pt-1">
                  <div className="h-4 w-full bg-stone-200/60 rounded" />
                  <div className="h-4 w-4/5 bg-stone-200/50 rounded mx-auto md:mx-0" />
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
                <div className="h-12 w-48 rounded-md bg-stone-300/80 border border-stone-300 flex items-center justify-center font-mono text-xs uppercase tracking-wider text-stone-600">
                  [ Primary Action Slot ]
                </div>
                <div className="h-12 w-48 rounded-md border border-stone-300 bg-white/60 flex items-center justify-center font-mono text-xs uppercase tracking-wider text-stone-500">
                  [ Secondary Action Slot ]
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
