import prisma from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Calendar,
  Users,
  Utensils,
  Mail,
  TrendingUp,
  Sparkles,
  Clock,
  ArrowRight,
} from "lucide-react";

export const revalidate = 0; // Live admin dashboard

export default async function AdminOverviewPage() {
  const todayStr = new Date().toISOString().split("T")[0];

  const [
    todayReservations,
    allReservations,
    dishesCount,
    eventsCount,
    subscribersCount,
    unreadEnquiries,
    recentReservations,
  ] = await Promise.all([
    prisma.reservation.findMany({
      where: { date: todayStr },
      include: { table: true },
    }),
    prisma.reservation.count({ where: { status: "CONFIRMED" } }),
    prisma.menuItem.count(),
    prisma.event.count(),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.contactEnquiry.count({ where: { status: "UNREAD" } }),
    prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { table: true },
    }),
  ]);

  const todayCovers = todayReservations.reduce((sum, r) => sum + r.partySize, 0);

  return (
    <div className="space-y-10">
      <div>
        <span className="label-caps text-[#C86E45] block mb-1">Executive Overview</span>
        <h1 className="font-editorial text-4xl text-[#F7F2E9]">
          Restaurant <span className="italic font-light text-[#D3B98D]">Operations.</span>
        </h1>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Covers */}
        <div className="p-6 bg-[#191714] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[#A9A095]">
            <span className="label-caps text-[10px]">Today&apos;s Covers</span>
            <Users className="w-4 h-4 text-[#C86E45]" />
          </div>
          <div className="font-editorial text-4xl text-[#F7F2E9] font-medium">
            {todayCovers} <span className="text-xs font-sans text-[#A9A095]">guests</span>
          </div>
          <p className="text-[11px] text-[#778064]">
            {todayReservations.length} total bookings today
          </p>
        </div>

        {/* Confirmed Bookings */}
        <div className="p-6 bg-[#191714] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[#A9A095]">
            <span className="label-caps text-[10px]">Upcoming Bookings</span>
            <Calendar className="w-4 h-4 text-[#D3B98D]" />
          </div>
          <div className="font-editorial text-4xl text-[#F7F2E9] font-medium">
            {allReservations}
          </div>
          <p className="text-[11px] text-[#A9A095]">Active confirmed tables</p>
        </div>

        {/* Menu Dishes */}
        <div className="p-6 bg-[#191714] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[#A9A095]">
            <span className="label-caps text-[10px]">Menu Items</span>
            <Utensils className="w-4 h-4 text-[#778064]" />
          </div>
          <div className="font-editorial text-4xl text-[#F7F2E9] font-medium">
            {dishesCount}
          </div>
          <p className="text-[11px] text-[#A9A095]">Active culinary dishes</p>
        </div>

        {/* Newsletter & Enquiries */}
        <div className="p-6 bg-[#191714] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[#A9A095]">
            <span className="label-caps text-[10px]">Guest Registry</span>
            <Mail className="w-4 h-4 text-[#C86E45]" />
          </div>
          <div className="font-editorial text-4xl text-[#F7F2E9] font-medium">
            {subscribersCount}
          </div>
          <p className="text-[11px] text-[#D3B98D]">
            {unreadEnquiries} unread guest enquiries
          </p>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="p-6 sm:p-8 bg-[#191714] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-2xl text-[#F7F2E9]">Recent Booking Inquiries</h3>
            <p className="text-xs text-[#A9A095]">Latest table reservations across all dining rooms</p>
          </div>
          <Link
            href="/admin/reservations"
            className="btn-outline-luxury text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <span>Open Booking Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#A9A095] label-caps">
                <th className="pb-3">Ref</th>
                <th className="pb-3">Guest</th>
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Party</th>
                <th className="pb-3">Room / Table</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#F7F2E9]">
              {recentReservations.map((res) => (
                <tr key={res.id} className="hover:bg-[#24201C] transition-colors">
                  <td className="py-3.5 font-mono text-[#C86E45]">{res.confirmationCode}</td>
                  <td className="py-3.5">
                    <strong className="block font-medium">{res.guestName}</strong>
                    <span className="text-[11px] text-[#A9A095]">{res.guestEmail}</span>
                  </td>
                  <td className="py-3.5">
                    <span>{res.date}</span>
                    <span className="text-[#D3B98D] block">{res.timeSlot}</span>
                  </td>
                  <td className="py-3.5">{res.partySize} Guests</td>
                  <td className="py-3.5">
                    <span className="text-[#A9A095] block">{res.seatingArea.replace("_", " ")}</span>
                    <span className="text-[11px] text-[#778064]">
                      Table {res.table ? res.table.tableNumber : "Unassigned"}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-semibold border ${
                        res.status === "CONFIRMED"
                          ? "bg-[#778064]/20 text-[#778064] border-[#778064]/30"
                          : res.status === "CANCELLED"
                          ? "bg-[#C86E45]/20 text-[#C86E45] border-[#C86E45]/30"
                          : "bg-white/10 text-white/70 border-white/10"
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
