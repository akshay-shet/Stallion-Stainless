"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Detect scroll to switch between glass (on hero) and solid (scrolled)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // On non-home pages always show solid header
  const isHome = pathname === "/";
  const isGlass = isHome && !scrolled;

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Collections", href: "/collections" },
    { name: "Premier Grade", href: "/pro-collection" },
    { name: "Best Selling", href: "/best-selling" },
    { name: "Customization", href: "/customization" },
    { name: "Reviews", href: "/reviews" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        isGlass
          ? "bg-white/10 backdrop-blur-md border-b border-white/15 shadow-none"
          : "bg-white/95 backdrop-blur-md border-b border-[#d7d8d2] shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center w-full px-4 sm:px-8 md:px-20 py-3 sm:py-4 max-w-container-max mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0">
              <Image
                src="/logo_v2.png"
                alt="Stallion Stainless Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span
              className={`text-2xl sm:text-3xl transition-colors whitespace-nowrap group-hover:opacity-80 ${
                isGlass ? "text-white drop-shadow-sm" : "text-charcoal-ink"
              }`}
              style={{ fontFamily: "'Brush Script MT', 'Brush Script M7', cursive" }}
            >
              Stallion Stainless
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.name === "Collections" && pathname.startsWith("/collections"));
            return (
              <div key={link.name} className="relative">
                <Link
                  href={link.href}
                  className={`font-sans text-sm tracking-wider uppercase pb-1 transition-colors ${
                    isActive
                      ? isGlass
                        ? "text-[#C59B27] font-bold drop-shadow-sm"
                        : "text-black font-bold"
                      : isGlass
                      ? "text-white/80 hover:text-white font-medium drop-shadow-sm"
                      : "text-stone-800 hover:text-black font-medium"
                  }`}
                >
                  {link.name}
                </Link>
                {isActive && (
                  <div
                    className={`absolute bottom-[-24px] left-0 w-full h-[2px] ${
                      isGlass ? "bg-[#C59B27]" : "bg-charcoal-ink"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-6">
          <Link
            href="/cart"
            className={`p-1 transition-colors ${
              isGlass ? "text-white/80 hover:text-white" : "text-charcoal-ink hover:text-primary"
            }`}
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden p-1 transition-colors ${
              isGlass ? "text-white/80 hover:text-white" : "text-charcoal-ink"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop Dimmer */}
          <div
            className="md:hidden fixed inset-0 top-[57px] sm:top-[65px] bg-black/50 backdrop-blur-xs z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Floating Nav Card */}
          <div className="md:hidden absolute top-[calc(100%+8px)] left-3 right-3 sm:left-6 sm:right-6 z-50 bg-white rounded-2xl shadow-2xl border border-stone-300 py-4 px-3">
            <nav className="flex flex-col items-center justify-center text-center gap-1.5 w-full">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.name === "Collections" && pathname.startsWith("/collections"));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`w-full max-w-[280px] py-2.5 px-4 rounded-xl text-center font-display text-xs tracking-widest uppercase transition-all duration-200 ${
                      isActive
                        ? "bg-stone-900 text-white font-extrabold shadow-sm"
                        : "text-stone-900 hover:text-black hover:bg-stone-100 font-bold active:bg-stone-200"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}

