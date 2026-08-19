"use client";

import { useState } from "react";
import Image from "next/image";
import { Flame, Sparkles, Sprout, Hammer, Wine } from "lucide-react";

export default function Philosophy() {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      keyword: "SEASON",
      title: "Hyper-Seasonal British Terroir",
      description:
        "We allow nature's micro-seasons to dictate our kitchen. Wild ramps in April, Scottish morels in May, game roasts in October. Our menu morphs weekly in response to what our partner farms harvest at dawn.",
      icon: Sprout,
    },
    {
      keyword: "FIRE",
      title: "Ancestral Hardwood Embers",
      description:
        "We cook with seasoned sweet chestnut, birch, and applewood. Fire is treated not as blunt heat, but as a subtle botanical ingredient that imparts delicate smoke, caramelized natural sugars, and velvety moisture.",
      icon: Flame,
    },
    {
      keyword: "CRAFT",
      title: "Uncompromising Technique",
      description:
        "Every sauce begins with 48-hour bone and vegetable reductions. Sourdoughs proof over three days with native wild yeasts. We honor slow, classical disciplines without modern culinary shortcuts.",
      icon: Hammer,
    },
    {
      keyword: "GARDEN",
      title: "Organic Soil & Foraging",
      description:
        "Partnering with organic biodynamic growers in Sussex and foraged coastal succulents from the Scottish shoreline ensures produce bursting with vivid natural vitality and clean minerality.",
      icon: Sparkles,
    },
    {
      keyword: "TABLE",
      title: "Thoughtful, Gracious Hospitality",
      description:
        "Luxury is never cold or pretentious. Our service is instinctive, warm, and tailored to the rhythm of your evening, creating a serene sanctuary away from the city's haste.",
      icon: Wine,
    },
  ];

  return (
    <section className="py-28 bg-[#11100E] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Atmospheric Image Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85"
                alt="Open hearth fire cooking"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#191714]/85 backdrop-blur-md border border-white/10">
                <span className="label-caps text-[#C86E45] block mb-1">Live Hearth</span>
                <p className="text-xs text-[#F7F2E9] italic font-serif">
                  &ldquo;Fire demands complete humility. You cannot rush an ember.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Right: Philosophy & Animated Pillars */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="label-caps text-[#C86E45] block mb-3">Our Philosophy</span>
              <h2 className="section-title text-[#F7F2E9] mb-6">
                Ingredients first. <br />
                <span className="italic font-light text-[#D3B98D]">Technique second.</span> <br />
                Everything else follows.
              </h2>
              <p className="text-[#A9A095] text-base leading-relaxed max-w-xl">
                At Embera House, we believe true luxury lies in restraint and respect. We do not mask ingredients under heavy sauces or artificial culinary theatre. Every dish celebrates provenance, flame, and deep craftsmanship.
              </p>
            </div>

            {/* Interactive Pillar Selector */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-wrap gap-2 sm:gap-3 border-b border-white/10 pb-4">
                {pillars.map((pillar, idx) => (
                  <button
                    key={pillar.keyword}
                    onClick={() => setActivePillar(idx)}
                    className={`px-4 py-2 text-xs tracking-widest uppercase font-semibold transition-all ${
                      activePillar === idx
                        ? "bg-[#C86E45] text-[#F7F2E9] shadow-lg"
                        : "bg-[#191714] text-[#A9A095] hover:text-[#F7F2E9] hover:bg-[#24201C]"
                    }`}
                  >
                    {pillar.keyword}
                  </button>
                ))}
              </div>

              {/* Active Pillar Card */}
              <div className="p-6 bg-[#191714] border border-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  {(() => {
                    const Icon = pillars[activePillar].icon;
                    return <Icon className="w-5 h-5 text-[#C86E45]" />;
                  })()}
                  <h3 className="text-lg font-editorial text-[#F7F2E9] font-medium">
                    {pillars[activePillar].title}
                  </h3>
                </div>
                <p className="text-sm text-[#A9A095] leading-relaxed">
                  {pillars[activePillar].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
