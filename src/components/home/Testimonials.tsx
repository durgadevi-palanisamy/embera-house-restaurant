"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Chef Mateo Vane has orchestrated something sublime in Lower Parel. Intimate, atmospheric, and free of typical culinary pretension. The Wood-Fired Malabar Scallops in bone marrow dashi and smoked morel galouti are sheer mastery.",
    author: "Vir Sanghvi",
    role: "Culinary Columnist & Critic",
    outlet: "The Mint Lounge",
    rating: 5,
  },
  {
    quote:
      "Eating at the Chef's Hearth Counter at Embera House feels like witnessing an ancestral fire ritual elevated to Michelin-grade precision. Outstanding biodynamic cellar list.",
    author: "Rashmi Uday Singh",
    role: "Gastronomy Author & Critic",
    outlet: "Gourmet Guide",
    rating: 5,
  },
  {
    quote:
      "Mumbai's most evocative dining room. The aroma of sweet birch and coastal charcoal greets you at the door. Every single course tells a story of Indian terroir and fire.",
    author: "Rohan & Tara Singhania",
    role: "Patrons since Opening",
    outlet: "Private Dining Salon Guest",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  };

  const next = () => {
    setCurrentIndex((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 bg-[#11100E] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="flex items-center justify-center gap-2">
          <Quote className="w-10 h-10 text-[#C86E45]/40" />
        </div>

        <div className="min-h-[160px] flex items-center justify-center">
          <p className="font-editorial text-2xl sm:text-3xl md:text-4xl text-[#F7F2E9] font-light leading-relaxed italic">
            &ldquo;{current.quote}&rdquo;
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-center gap-1 text-[#D3B98D]">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <h4 className="text-sm font-medium text-[#F7F2E9]">{current.author}</h4>
          <p className="text-xs text-[#A9A095]">
            {current.role} &bull; <span className="text-[#C86E45]">{current.outlet}</span>
          </p>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={prev}
            className="p-2.5 rounded-full border border-white/10 hover:border-[#C86E45] hover:text-[#C86E45] text-[#A9A095] transition-colors"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#A9A095] font-mono">
            0{currentIndex + 1} / 0{testimonials.length}
          </span>
          <button
            onClick={next}
            className="p-2.5 rounded-full border border-white/10 hover:border-[#C86E45] hover:text-[#C86E45] text-[#A9A095] transition-colors"
            aria-label="Next quote"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
