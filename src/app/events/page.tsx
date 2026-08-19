import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import { Calendar, Clock, MapPin, Users, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Special Events & Masterclasses",
  description:
    "Explore upcoming culinary dinners, guest chef residencies, wine tastings, and hearth masterclasses at Embera House Mayfair.",
};

export const revalidate = 60;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { date: "asc" },
  });

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="label-caps text-[#C86E45] block">Intimate Gatherings</span>
          <h1 className="hero-title text-[#F7F2E9]">
            Curated <span className="italic font-light text-[#D3B98D]">Events.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed">
            One-of-a-kind culinary evenings, winemaker dinners, masterclasses, and seasonal celebrations at our Mayfair residence.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const seatsLeft = Math.max(0, event.capacity - event.bookedCount);

            return (
              <div
                key={event.id}
                className="group flex flex-col bg-[#191714] border border-white/5 hover:border-[#C86E45]/40 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#24201C]">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/85 backdrop-blur-md text-xs uppercase tracking-wider text-[#D3B98D] border border-white/10 font-semibold">
                    {formatShortDate(event.date)}
                  </div>
                  {seatsLeft <= 5 && seatsLeft > 0 && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#C86E45]/90 text-white text-[10px] uppercase tracking-wider font-semibold">
                      Only {seatsLeft} Seats Left
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#A9A095] mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C86E45]" />
                        {event.time}
                      </span>
                      <span>•</span>
                      <span>{event.duration}</span>
                    </div>

                    <Link href={`/events/${event.slug}`}>
                      <h3 className="font-editorial text-2xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#A9A095] leading-relaxed line-clamp-3 mb-4">
                      {event.excerpt}
                    </p>

                    <div className="text-[11px] text-[#A9A095] flex items-center gap-1.5 pt-2 border-t border-white/5">
                      <MapPin className="w-3 h-3 text-[#778064]" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="label-caps text-[#A9A095] block text-[9px]">Price per cover</span>
                      <span className="font-editorial text-xl text-[#C86E45] font-semibold">
                        {event.price ? formatCurrency(event.price) : "Complimentary"}
                      </span>
                    </div>

                    <Link
                      href={`/events/${event.slug}`}
                      className="btn-terracotta text-xs px-4 py-2"
                    >
                      <span>Reserve Seat</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
