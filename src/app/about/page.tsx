import Image from "next/image";
import Link from "next/link";
import { Calendar, Sprout, Flame, Award, Heart, Shield, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Embera House | Story & Philosophy",
  description:
    "Discover the history, culinary philosophy, sustainable sourcing commitments, and kitchen team behind Embera House Mayfair.",
};

export default function AboutPage() {
  const team = [
    {
      name: "Mateo Vane",
      role: "Executive Chef & Founder",
      bio: "Trained across San Sebastián and Northumbria, Mateo founded Embera House to celebrate ancestral open-hearth cooking and hyper-seasonal British terroir.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Camille Laurent",
      role: "Head Sommelier & Cellar Master",
      bio: "Former lead sommelier in Burgundy, Camille oversees our 1,200-bottle cellar, focusing exclusively on biodynamic, low-intervention and volcanic estates.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Elena Rostova",
      role: "General Manager",
      bio: "With fifteen years directing world-class luxury hospitality in London and Paris, Elena leads our floor service with warmth, grace, and discreet precision.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Marcus Holloway",
      role: "Head Baker & Pastry Chef",
      bio: "Passionate about stone-ground heritage grains and native wild yeast ferments, Marcus oversees our 72-hour sourdough program and hearth-baked desserts.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const timeline = [
    {
      year: "2018",
      title: "The Seeds in the Basque Country",
      description: "Chef Mateo spends two years apprenticing in the mountain hearths of San Sebastián, discovering the power of single-hardwood fire.",
    },
    {
      year: "2021",
      title: "Securing the Mayfair Sanctuary",
      description: "Discovery of our historic 18th-century St. James's Place townhouse and bespoke hearth brick engineering.",
    },
    {
      year: "2023",
      title: "Embera House Opens Its Doors",
      description: "Welcoming our first guests with our signature 45-day dry-aged Dexter ribeye and hand-dived Hebridean scallops.",
    },
    {
      year: "2025",
      title: "The Rooftop Apiary & Urban Herb Garden",
      description: "Installing four beehives and heirloom botanical planters supplying our bar with raw honey and aromatic tinctures.",
    },
  ];

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="label-caps text-[#C86E45] block">Provenance & Vision</span>
          <h1 className="hero-title text-[#F7F2E9]">
            The Embera <span className="italic font-light text-[#D3B98D]">Story.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed">
            Born from an obsession with wood fire, ancient culinary techniques, and honest British terroir.
          </p>
        </div>

        {/* Narrative & Image Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32">
          <div className="lg:col-span-6 space-y-6">
            <span className="label-caps text-[#C86E45] block">Our Foundation</span>
            <h2 className="section-title text-[#F7F2E9]">
              Rooted in nature. <br />
              <span className="italic font-light text-[#D3B98D]">Guided by fire.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A9A095] leading-relaxed font-normal">
              Embera House was founded on a simple conviction: modern culinary art has grown overly reliant on industrial precision, losing the soulful connection between cook, produce, and heat.
            </p>
            <p className="text-sm text-[#A9A095] leading-relaxed">
              In our open kitchen, gas burners and electric circulators are replaced by custom hand-cranked Parrilla grills, wood-fired bread ovens, and glowing hardwood embers. Every dish is a dialogue with the flame.
            </p>
            <div className="pt-2">
              <Link href="/menu" className="btn-outline-luxury text-xs">
                Explore Current Menu
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#191714] border border-white/10 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
                alt="Chef in kitchen hearth"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="label-caps text-[#C86E45] block mb-2">The Brigade</span>
            <h2 className="section-title text-[#F7F2E9]">
              Leadership & <span className="italic font-light text-[#D3B98D]">Craftspeople.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="group flex flex-col bg-[#191714] border border-white/5 p-5 hover:border-[#C86E45]/40 transition-all duration-300"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-[#24201C]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-editorial text-2xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors">
                  {member.name}
                </h4>
                <span className="text-xs uppercase tracking-wider text-[#C86E45] font-semibold mb-2">
                  {member.role}
                </span>
                <p className="text-xs text-[#A9A095] leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sourcing & Sustainability Map */}
        <div className="p-8 sm:p-12 lg:p-16 bg-[#191714] border border-white/10 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="label-caps text-[#C86E45] block">Provenance Manifesto</span>
              <h3 className="section-title text-[#F7F2E9]">
                Zero Waste & <br />
                <span className="italic font-light text-[#D3B98D]">100% Regenerative Sourcing.</span>
              </h3>
              <p className="text-sm text-[#A9A095] leading-relaxed">
                We partner with certified organic farms, hand-divers, and native-breed farmers across the British Isles:
              </p>
              <ul className="space-y-3 text-xs text-[#F7F2E9]">
                <li className="flex items-start gap-2.5">
                  <Sprout className="w-4 h-4 text-[#778064] shrink-0 mt-0.5" />
                  <span><strong>Heritage Dexter Cattle:</strong> Grass-fed & 45-day salt aged from regenerative pastures in Yorkshire.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Flame className="w-4 h-4 text-[#C86E45] shrink-0 mt-0.5" />
                  <span><strong>Hebridean Scallops & Langoustines:</strong> Hand-dived in the Sound of Mull, Scotland.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-[#D3B98D] shrink-0 mt-0.5" />
                  <span><strong>Sweet Hardwood Charcoal:</strong> Sourced exclusively from managed coppiced woodlands in Sussex.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 relative aspect-square overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
                alt="Organic Harvest"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="label-caps text-[#C86E45] block mb-2">Chronology</span>
            <h2 className="section-title text-[#F7F2E9]">
              The Embera <span className="italic font-light text-[#D3B98D]">Journey.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="p-6 bg-[#191714] border-t-2 border-[#C86E45] space-y-3"
              >
                <span className="font-editorial text-3xl text-[#D3B98D] font-medium block">
                  {item.year}
                </span>
                <h4 className="text-sm font-semibold text-[#F7F2E9]">{item.title}</h4>
                <p className="text-xs text-[#A9A095] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
