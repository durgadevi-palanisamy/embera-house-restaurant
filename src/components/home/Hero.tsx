"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Flame } from "lucide-react";
import EmberCanvas from "./EmberCanvas";

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-[#11100E]">
      {/* Background Media with Ambient Zoom & Depth Gradient */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center animate-ambient-zoom opacity-40 scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/70 to-black/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#11100E]/40 to-[#11100E]" />
      </div>

      {/* Interactive 3D Ember Particle Canvas */}
      <EmberCanvas />

      {/* Foreground Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-24 pb-16 space-y-8">
        {/* Live Service Status & Location Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#191714]/80 backdrop-blur-md border border-white/10 text-[11px] uppercase tracking-widest text-[#F7F2E9]"
        >
          <span className="flex items-center gap-1.5 text-[#C86E45]">
            <span className="w-2 h-2 rounded-full bg-[#C86E45] animate-ping inline-block" />
            <Flame className="w-3.5 h-3.5" />
            <span>Service Live Tonight</span>
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1 text-[#D3B98D]">
            <MapPin className="w-3 h-3" />
            Lower Parel, Mumbai
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="space-y-4"
        >
          <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#F7F2E9] font-light leading-[1.05]">
            Fire. Flavour. <br />
            <span className="italic font-light text-[#D3B98D]">Moments.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#A9A095] font-normal leading-relaxed tracking-wide">
            An ode to ancestral wood-fired craftsmanship, heirloom Indian botanicals, and coastal charcoal embers. Unhurried luxury in the heart of Mumbai.
          </p>
        </motion.div>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/reserve"
            className="btn-terracotta w-full sm:w-auto text-xs flex items-center justify-center gap-2 group"
          >
            <span>Reserve Table</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/menu"
            className="btn-outline-luxury w-full sm:w-auto text-xs flex items-center justify-center gap-2"
          >
            <span>Explore Menu</span>
          </Link>
        </motion.div>

        {/* Key Highlights Sub-bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-white/10 text-left"
        >
          <div>
            <span className="label-caps text-[#C86E45] block text-[9px]">Culinary Style</span>
            <span className="text-xs font-medium text-[#F7F2E9]">Ancestral Wood-Fire</span>
          </div>
          <div>
            <span className="label-caps text-[#C86E45] block text-[9px]">Sourcing</span>
            <span className="text-xs font-medium text-[#F7F2E9]">Hyper-Local Indian Terroir</span>
          </div>
          <div>
            <span className="label-caps text-[#C86E45] block text-[9px]">Wine & Spirits</span>
            <span className="text-xs font-medium text-[#F7F2E9]">Biodynamic Cellar</span>
          </div>
          <div>
            <span className="label-caps text-[#C86E45] block text-[9px]">Dining Rooms</span>
            <span className="text-xs font-medium text-[#F7F2E9]">4 Curated Salons</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[10px] text-[#A9A095] uppercase tracking-widest">
        <span>Scroll to Explore</span>
        <div className="w-4 h-7 border border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-1.5 bg-[#C86E45] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
