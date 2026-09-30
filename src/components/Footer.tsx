import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal-ink w-full px-6 sm:px-12 md:px-20 py-8 sm:py-12 text-white mt-auto">
      <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="md:col-span-1">
          <span className="font-display text-headline-md text-white block mb-4 font-bold">
            Stallion Stainless
          </span>
          <p className="font-sans text-stainless-silver text-sm">
            Architectural Furniture for Modern Living. Built on Grade 304 Stainless Steel foundations.
          </p>
        </div>
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-6 md:mt-0">
          <div>
            <h4 className="font-display text-xs tracking-widest text-slate-400 uppercase mb-4">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="#" className="font-sans text-sm text-stainless-silver hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="font-sans text-sm text-stainless-silver hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-xs tracking-widest text-slate-400 uppercase mb-4">Services</h4>
            <div className="flex flex-col gap-2">
              <Link href="#" className="font-sans text-sm text-stainless-silver hover:text-white transition-colors">Shipping & Returns</Link>
              <Link href="#" className="font-sans text-sm text-stainless-silver hover:text-white transition-colors">Warranty & PVD Care</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-xs tracking-widest text-slate-400 uppercase mb-4">Company</h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="font-sans text-sm text-stainless-silver hover:text-white transition-colors">About Us</Link>
              <Link href="#" className="font-sans text-sm text-stainless-silver hover:text-white transition-colors">Showrooms</Link>
              <Link href="#" className="font-sans text-sm text-stainless-silver hover:text-white transition-colors">Sustainability</Link>
              <Link href="#" className="font-sans text-sm text-stainless-silver hover:text-white transition-colors">Careers</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-xs tracking-widest text-slate-400 uppercase mb-4">Contact</h4>
            <p className="font-sans text-sm text-stainless-silver">
              Precision Engineering Studio<br />
              info@stallionstainless.com
            </p>
          </div>
        </div>
        <div className="col-span-1 md:col-span-4 border-t border-surface-tint/30 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-stainless-silver">
          <p>© 2026 Stallion Stainless. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed beyond Imagination</p>
        </div>
      </div>
    </footer>
  );
}
