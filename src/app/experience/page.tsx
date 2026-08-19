import Image from "next/image";
import Link from "next/link";
import { Calendar, Wine, Flame, Sparkles, Sprout, HeartHandshake, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dining Experiences & Spaces",
  description:
    "Explore the architectural spaces and culinary settings of Embera House: Main Dining Salon, Heated Garden Terrace, Chef's Hearth Counter, and Private Dining.",
};

export default function ExperiencePage() {
  const spaces = [
    {
      id: "main-dining",
      title: "The Main Dining Salon",
      tagline: "Atmospheric warmth and Italian bronze lighting.",
      description:
        "Designed by Studio Vane, the Main Dining Room is anchored by centuries-old reclaimed oak tables, deep charcoal textured plaster, and low-level ambient lighting. Every table functions as its own intimate stage, offering gentle sightlines to the glowing hearth pass without intruding on table privacy.",
      capacity: "Up to 55 Guests",
      vibe: "Intimate, romantic, celebratory fine dining.",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: "chefs-table",
      title: "Chef's Hearth Counter",
      tagline: "Front-row culinary theatre before live embers.",
      description:
        "An intimate 8-seat counter carved from Welsh slate, situated directly before our open wood-fire hearth. Guests experience an unscripted multi-course tasting menu curated and served directly by Executive Chef Mateo Vane and the senior brigade, paired with rare cellar library pours.",
      capacity: "Strictly 8 Seats",
      vibe: "Engaging, immersive gastronomic storytelling.",
      imageUrl:
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: "terrace",
      title: "The Garden Terrace",
      tagline: "Heated botanical alfresco sanctuary.",
      description:
        "A hidden Mayfair oasis framed by climbing jasmine, wild rosemary, and sweet bay leaves. Fitted with radiant heated floors, a retractable glass conservatory roof, and wood-burning outdoor chimineas for year-round alfresco dining and Sunday jazz lunches.",
      capacity: "Up to 30 Guests",
      vibe: "Relaxed botanical luxury and breezy open air.",
      imageUrl:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: "private-dining",
      title: "The Private Dining Salon",
      tagline: "Discreet chamber for bespoke celebrations.",
      description:
        "An exclusive private haven with its own private bar, dedicated sommelier, discrete service entrance, and customized acoustics. Accommodating intimate boardroom dinners or celebratory banquets with tailored bespoke printed menus.",
      capacity: "8 to 16 Guests",
      vibe: "Private, distinguished, and exceptionally discreet.",
      imageUrl:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="label-caps text-[#C86E45] block">Spaces of Warmth & Fire</span>
          <h1 className="hero-title text-[#F7F2E9]">
            The Dining <span className="italic font-light text-[#D3B98D]">Experience.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed">
            Every room at Embera House offers a distinct rhythm, united by open-fire craftsmanship and genuine, unhurried hospitality.
          </p>
        </div>

        {/* Detailed Space Cards */}
        <div className="space-y-24">
          {spaces.map((space, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={space.id}
                id={space.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
              >
                {/* Image */}
                <div
                  className={`lg:col-span-6 relative ${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#191714] border border-white/10 shadow-2xl">
                    <Image
                      src={space.imageUrl}
                      alt={space.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/70 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`lg:col-span-6 space-y-6 ${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <span className="label-caps text-[#C86E45] block">{space.tagline}</span>
                  <h2 className="section-title text-[#F7F2E9]">{space.title}</h2>
                  <p className="text-sm sm:text-base text-[#A9A095] leading-relaxed">
                    {space.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-y border-white/10 text-xs">
                    <div>
                      <span className="label-caps text-[#A9A095] block mb-1">Capacity</span>
                      <span className="text-[#F7F2E9] font-medium">{space.capacity}</span>
                    </div>
                    <div>
                      <span className="label-caps text-[#A9A095] block mb-1">Atmosphere</span>
                      <span className="text-[#D3B98D] font-medium">{space.vibe}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/reserve?area=${space.id === "chefs-table" ? "CHEFS_TABLE" : space.id === "terrace" ? "TERRACE" : space.id === "private-dining" ? "PRIVATE_DINING" : "MAIN_DINING"}`}
                      className="btn-terracotta text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Reserve in {space.title}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pillars / The Embera Standard */}
        <div className="mt-32 pt-20 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="label-caps text-[#C86E45] block mb-3">Our Standards</span>
            <h3 className="section-title text-[#F7F2E9]">
              The Hospitality <span className="italic font-light text-[#D3B98D]">Pillars.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#191714] border border-white/5 space-y-4">
              <Wine className="w-8 h-8 text-[#C86E45]" />
              <h4 className="font-editorial text-2xl text-[#F7F2E9]">Biodynamic Cellar</h4>
              <p className="text-xs text-[#A9A095] leading-relaxed">
                Over 1,200 bottles focused strictly on low-intervention, volcanic terroir, and living biodynamic vineyards from ancient European regions.
              </p>
            </div>
            <div className="p-8 bg-[#191714] border border-white/5 space-y-4">
              <Flame className="w-8 h-8 text-[#D3B98D]" />
              <h4 className="font-editorial text-2xl text-[#F7F2E9]">Hardwood Embers</h4>
              <p className="text-xs text-[#A9A095] leading-relaxed">
                We burn seasoned sweet chestnut, birch, and applewood from managed British woodlands, treating aromatic heat as our primary botanical seasoning.
              </p>
            </div>
            <div className="p-8 bg-[#191714] border border-white/5 space-y-4">
              <HeartHandshake className="w-8 h-8 text-[#778064]" />
              <h4 className="font-editorial text-2xl text-[#F7F2E9]">Unhurried Grace</h4>
              <p className="text-xs text-[#A9A095] leading-relaxed">
                Never rushed, never stiff. Our team anticipates every need with warmth, knowledge, and quiet discretion from first arrival to final farewell.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
