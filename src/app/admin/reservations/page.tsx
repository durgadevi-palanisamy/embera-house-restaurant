import prisma from "@/lib/prisma";
import ReservationConsole from "@/components/admin/ReservationConsole";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reservations Console | Embera Admin",
};

export const revalidate = 0;

export default async function AdminReservationsPage() {
  let reservations: any[] = [];
  try {
    reservations = await prisma.reservation.findMany({
      orderBy: [{ date: "desc" }, { timeSlot: "asc" }],
      include: { table: true },
    });
  } catch (err) {
    console.warn("DB query error in admin reservations page:", err);
  }

  if (reservations.length === 0) {
    reservations = [
      {
        id: "res_01",
        confirmationCode: "EH-CHE4412",
        guestName: "Priya Sundaram",
        guestEmail: "priya.s@chennai.in",
        guestPhone: "+91 98400 11223",
        partySize: 4,
        date: "2026-08-31",
        timeSlot: "19:30",
        seatingArea: "CHEF_COUNTER",
        status: "CONFIRMED",
        specialRequests: "Chef's Table tasting pairing",
        table: { tableNumber: "C01", room: "CHEF_COUNTER" },
      },
      {
        id: "res_02",
        confirmationCode: "EH-CHE8821",
        guestName: "Lord Julian Sterling",
        guestEmail: "guest@emberahouse.in",
        guestPhone: "+91 98400 33400",
        partySize: 2,
        date: "2026-08-31",
        timeSlot: "20:00",
        seatingArea: "GARDEN_TERRACE",
        status: "CONFIRMED",
        specialRequests: "Anniversary celebration",
        table: { tableNumber: "T04", room: "GARDEN_TERRACE" },
      },
      {
        id: "res_03",
        confirmationCode: "EH-CHE9910",
        guestName: "Vikramaditya Rao",
        guestEmail: "vikram.rao@enterprise.co.in",
        guestPhone: "+91 98840 55667",
        partySize: 8,
        date: "2026-09-02",
        timeSlot: "20:30",
        seatingArea: "PRIVATE_SALON",
        status: "CONFIRMED",
        specialRequests: "Sommelier wine selection",
        table: { tableNumber: "P01", room: "PRIVATE_SALON" },
      },
    ];
  }

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
