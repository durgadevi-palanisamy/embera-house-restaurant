import prisma from "@/lib/prisma";
import ReservationConsole from "@/components/admin/ReservationConsole";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservations Console | Embera Admin",
};

export const revalidate = 0;

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: [{ date: "desc" }, { timeSlot: "asc" }],
    include: { table: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="label-caps text-[#C86E45] block mb-1">Bookings Hub</span>
        <h1 className="font-editorial text-4xl text-[#F7F2E9]">
          Table <span className="italic font-light text-[#D3B98D]">Reservations.</span>
        </h1>
        <p className="text-xs text-[#A9A095] mt-1">
          Monitor service flow, modify guest statuses, and allocate tables across all rooms.
        </p>
      </div>

      <ReservationConsole initialReservations={reservations} />
    </div>
  );
}
