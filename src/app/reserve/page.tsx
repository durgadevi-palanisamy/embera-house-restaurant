import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import ReservationFlow from "@/components/reserve/ReservationFlow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Table Reservations | Embera House Mayfair",
  description:
    "Reserve an intimate table, Chef's Table counter seat, or Private Dining Salon at Embera House Mayfair.",
};

export default async function ReservePage() {
  const session = await getSessionUser();

  const userProfile = session
    ? await prisma.user.findUnique({
        where: { id: session.id },
        include: { preferences: true },
      })
    : null;

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="label-caps text-[#C86E45] block">Table Reservation</span>
          <h1 className="hero-title text-[#F7F2E9]">
            Book Your <span className="italic font-light text-[#D3B98D]">Table.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed">
            Experience wood-fired gastronomy and thoughtful hospitality in the heart of Mayfair.
          </p>
        </div>

        {/* Interactive 7-Step Stepper */}
        <ReservationFlow user={userProfile} />
      </div>
    </div>
  );
}
