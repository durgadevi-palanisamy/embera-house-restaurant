import prisma from "@/lib/prisma";
import { Grid, Users, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Table Layout Management | Embera Admin",
};

export const revalidate = 0;

export default async function AdminTablesPage() {
  const tables = await prisma.restaurantTable.findMany({
    orderBy: [{ room: "asc" }, { tableNumber: "asc" }],
    include: {
      _count: {
        select: { reservations: { where: { status: "CONFIRMED" } } },
      },
    },
  });

  const rooms = ["MAIN_DINING", "TERRACE", "CHEFS_TABLE", "PRIVATE_DINING"];

  return (
    <div className="space-y-10">
      <div>
        <span className="label-caps text-[#C86E45] block mb-1">Floor Plan</span>
        <h1 className="font-editorial text-4xl text-[#F7F2E9]">
          Restaurant <span className="italic font-light text-[#D3B98D]">Tables.</span>
        </h1>
        <p className="text-xs text-[#A9A095] mt-1">
          Active table allocation across Main Dining, Garden Terrace, Chef&apos;s Hearth, and Private Salon.
        </p>
      </div>

      <div className="space-y-8">
        {rooms.map((room) => {
          const roomTables = tables.filter((t) => t.room === room);
          return (
            <div key={room} className="p-6 bg-[#191714] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-editorial text-2xl text-[#F7F2E9]">
                  {room.replace("_", " ")}
                </h3>
                <span className="text-xs text-[#A9A095]">{roomTables.length} Active Tables</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {roomTables.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 bg-[#11100E] border border-white/5 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-[#C86E45] font-semibold">
                        {t.tableNumber}
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#778064]" />
                    </div>
                    <div className="text-xs text-[#A9A095] flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#D3B98D]" />
                      <span>
                        {t.minCapacity}–{t.maxCapacity} Covers
                      </span>
                    </div>
                    <div className="text-[10px] text-[#A9A095]">
                      {t._count.reservations} Active Bookings
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
