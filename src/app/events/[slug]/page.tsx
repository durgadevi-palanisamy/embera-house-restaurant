import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, Clock, MapPin, Users, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
  });

  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.title} | Embera House Events`,
    description: event.excerpt,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
  });

  if (!event) notFound();

  const seatsRemaining = Math.max(0, event.capacity - event.bookedCount);

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#A9A095] mb-8">
          <Link href="/events" className="hover:text-[#F7F2E9] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> All Special Evenings
          </Link>
          <span>/</span>
          <span className="text-[#F7F2E9] truncate">{event.title}</span>
        </div>

        {/* Hero Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full overflow-hidden bg-[#191714] border border-white/10 mb-12 shadow-2xl">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="label-caps text-[#D3B98D] block mb-2">{formatDate(event.date)}</span>
              <h1 className="font-editorial text-3xl sm:text-5xl text-[#F7F2E9] font-medium max-w-2xl">
                {event.title}
              </h1>
            </div>
            <div className="bg-[#191714]/90 backdrop-blur-md p-4 border border-white/10 text-right">
              <span className="label-caps text-[#A9A095] block text-[9px]">Admission</span>
              <span className="font-editorial text-3xl text-[#C86E45] font-semibold">
                {event.price ? formatCurrency(event.price) : "Complimentary"}
              </span>
            </div>
          </div>
        </div>

        {/* Event Narrative & Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="label-caps text-[#C86E45] block">About the Evening</span>
              <p className="text-base sm:text-lg text-[#F7F2E9] font-normal leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="p-8 bg-[#191714] border border-white/10 space-y-6">
              <h3 className="font-editorial text-2xl text-[#F7F2E9]">Evening Programme & Inclusions</h3>
              <ul className="space-y-3 text-xs sm:text-sm text-[#A9A095]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C86E45] shrink-0 mt-0.5" />
                  <span>Curated multi-course gastronomic menu paired with rare library wines.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C86E45] shrink-0 mt-0.5" />
                  <span>Opening Champagne reception and intimate dialogue with Chef Mateo Vane.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C86E45] shrink-0 mt-0.5" />
                  <span>Commemorative embossed menu and bespoke gift from our hearth bakery.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Booking Summary Box */}
          <div className="lg:col-span-4 bg-[#191714] border border-white/10 p-6 sm:p-8 space-y-6 sticky top-28">
            <h3 className="font-editorial text-2xl text-[#F7F2E9]">Event Details</h3>

            <div className="space-y-3.5 text-xs text-[#A9A095] border-b border-white/10 pb-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C86E45]" /> Date
                </span>
                <span className="text-[#F7F2E9] font-medium">{event.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C86E45]" /> Service Time
                </span>
                <span className="text-[#F7F2E9] font-medium">{event.time} ({event.duration})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C86E45]" /> Location
                </span>
                <span className="text-[#F7F2E9] font-medium text-right">{event.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C86E45]" /> Capacity
                </span>
                <span className="text-[#D3B98D] font-medium">{seatsRemaining} seats remaining</span>
              </div>
            </div>

            <Link
              href={`/reserve?date=${event.date}&time=${event.time}`}
              className="btn-terracotta text-xs w-full py-4 justify-center"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Table for Event</span>
            </Link>

            <p className="text-[10px] text-[#A9A095] text-center">
              Credit card guarantee required. Cancellation allowed up to 72 hours prior to special events.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
