"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Landmark, Compass, Award, ShieldCheck } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: "Airports & Infrastructure" | "Monuments & Temples" | "Corporate & Hospitality" | "PVD Luxury Furniture";
  year: string;
  location: string;
  specs: string;
  description: string;
  image: string;
  highlights: string[];
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "proj-1",
    title: "International Airport Concourse & Canopies",
    category: "Airports & Infrastructure",
    year: "1994 – Present",
    location: "Bangalore & Delhi Terminals",
    specs: "AISI 316 Marine-Grade · Mirror-Polished · Heavy Structural Steel",
    description:
      "Pioneered massive column claddings, seamless fascia, and pedestrian space frames designed to endure 24/7 footfall while maintaining pristine lustre.",
    image: "/hero_cad.jpg",
    highlights: ["Over 25,000 sq.ft Cladding", "Zero Corrosion in 30+ Years", "Civil Aviation Certified"],
  },
  {
    id: "proj-2",
    title: "Sacred Temple Sanctum & Architectural Railings",
    category: "Monuments & Temples",
    year: "1988 – Present",
    location: "South India Pilgrimage Sites",
    specs: "Titanium Gold PVD · 430 & 304 Stainless Steel · Hand-Chiseled Detailing",
    description:
      "Designed sacred enclosure balustrades and golden canopies resistant to incense, high humidity, and weathering, combining ritual elegance with unyielding permanence.",
    image: "/gold_finish.png",
    highlights: ["Custom Spiritual Filigree", "PVD High-Vacuum Coating", "Engineered for 100-Year Life"],
  },
  {
    id: "proj-3",
    title: "SAIL Corporate Headquarter Architectural Facades",
    category: "Corporate & Hospitality",
    year: "2002",
    location: "New Delhi & Salem",
    specs: "Steel Authority of India Collaboration · Satin Hairline Finish",
    description:
      "National benchmark collaboration showcasing India's prowess in domestic architectural stainless steel, featuring monolithic lobby claddings and cantilevered fascias.",
    image: "/aura-front.jpg",
    highlights: ["SAIL Official Partnership", "Laser Precision Joining", "Thermal Expansion Compensated"],
  },
  {
    id: "proj-4",
    title: "Monolithic Titanium PVD Dining & Presidential Tables",
    category: "PVD Luxury Furniture",
    year: "2020 – Present",
    location: "Private Mansions · Bangalore & Delhi",
    specs: "AISI 304 Laser Cut · Champagne Gold & Rose Pink PVD · Italian Marble Tops",
    description:
      "Bespoke residential centerpieces engineered with hidden weight-bearing internal ribs, laser-beveled chamfers, and zero-distortion physical vapor deposition finishes.",
    image: "/hero_dining.jpg",
    highlights: ["Zero Weld Seam Visibility", "Diamond-Grade Scratch Resistance", "Custom Handcrafted in India"],
  },
  {
    id: "proj-5",
    title: "Civic Transit Street Furniture & Architectural Canopies",
    category: "Airports & Infrastructure",
    year: "1998",
    location: "Metropolitan Highways & Expressways",
    specs: "Heavy Gauge 304 Stainless Steel · Vandal-Resistant Fasteners",
    description:
      "Engineered streetscape furniture, weather canopies, and industrial cable trays deployed across high-density arterial transport corridors.",
    image: "/hero_chair.jpg",
    highlights: ["Vandal-Resistant Construction", "Impact Engineered", "All-Weather Resilient"],
  },
  {
    id: "proj-6",
    title: "Signature Bespoke Lounge & Accent Credenzas",
    category: "PVD Luxury Furniture",
    year: "2024",
    location: "Luxury Penthouses & Flagship Studios",
    specs: "Brushed Graphite & Gold PVD · Solid Stainless Plate Joinery",
    description:
      "Sculptural furniture fusing raw industrial resilience with refined Parisian haute-couture proportions, designed for connoisseurs of timeless metal craftsmanship.",
    image: "/hero_sofa.jpg",
    highlights: ["Custom Sizing & Finishes", "Signature Stallion Emblem", "Lifetime Structural Guarantee"],
  },
];

const CATEGORIES = [
  "All Projects",
  "Airports & Infrastructure",
  "Monuments & Temples",
  "Corporate & Hospitality",
  "PVD Luxury Furniture",
] as const;

export default function AboutPortfolioShowcase() {
  const [activeTab, setActiveTab] = useState<string>("All Projects");

  const filteredItems =
    activeTab === "All Projects"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section className="w-full bg-[#111111] py-24 sm:py-32 px-6 sm:px-12 lg:px-20 border-t border-b border-white/10 text-white relative overflow-hidden">
      
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(197,155,39,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(197,155,39,0.3) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#C59B27]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#C59B27]">
                Master Archives · 1985 to Present
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
              Signature <span className="text-[#C59B27]">Portfolio</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-white/50 mt-4 max-w-xl leading-relaxed">
              From international aviation gateways to sacred temple sanctums and high-end luxury residences, explore four decades of bespoke stainless steel engineering.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-6 bg-white/[0.04] border border-white/10 rounded-2xl p-4 sm:p-5 shrink-0 backdrop-blur-md">
            <div>
              <p className="font-display text-2xl sm:text-3xl font-black text-white leading-none">500+</p>
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/40 mt-1">Completed Works</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="font-display text-2xl sm:text-3xl font-black text-[#C59B27] leading-none">40 Yrs</p>
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/40 mt-1">Zero Failure Rate</p>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-12 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-[#C59B27] text-[#111111] font-bold shadow-lg shadow-[#C59B27]/20 border border-[#C59B27]"
                    : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-[#181818] border border-white/10 hover:border-[#C59B27]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:shadow-[#C59B27]/10"
            >
              {/* Image Preview Container */}
              <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-black/40">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Top Badge: Year & Location */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider bg-black/70 text-[#C59B27] border border-[#C59B27]/30 px-2.5 py-1 rounded-md backdrop-blur-md">
                    {item.year}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-black/60 text-white/70 border border-white/10 px-2.5 py-1 rounded-md backdrop-blur-md">
                    {item.location}
                  </span>
                </div>

                {/* Dark Bottom Fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#C59B27] uppercase tracking-widest mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
                    {item.category}
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-[#C59B27] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-white/50 mt-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-wide">
                      <strong className="text-white/60">Spec:</strong> {item.specs}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="space-y-2 pt-2">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 font-mono text-[10px] text-white/55">
                      <span className="w-1 h-1 rounded-full bg-[#C59B27] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 group-hover:text-white transition-colors">
                    Stallion Master Archive
                  </span>
                  <Link
                    href="/collections"
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#C59B27] group-hover:text-[#111111] group-hover:border-[#C59B27] flex items-center justify-center transition-all duration-300"
                    aria-label={`Explore works for ${item.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
