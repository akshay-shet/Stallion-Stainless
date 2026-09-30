import type { Metadata } from "next";
import { Inter, Montserrat, Geist } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/SmoothScroll";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Stallion Stainless | Precision Architectural Furniture",
  description: "Luxury & Precision Architectural Furniture Designs beyond Imagination. Sofa Sets, Dining Sets, Coffee & Side Tables, Chairs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, montserrat.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-warm-ivory text-on-surface font-sans overflow-x-clip w-full max-w-full">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

