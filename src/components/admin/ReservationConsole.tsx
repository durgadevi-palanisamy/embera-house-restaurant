"use client";

import { useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ReservationItem {
  id: string;
  confirmationCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  partySize: number;
  date: string;
  timeSlot: string;
  seatingArea: string;
  status: string;
  occasion?: string | null;
  dietaryNotes?: string | null;
  specialRequests?: string | null;
  table?: { tableNumber: string; room: string } | null;
}

export default function ReservationConsole({
  initialReservations,
}: {
  initialReservations: ReservationItem[];
}) {
  const [reservations, setReservations] = useState<ReservationItem[]>(initialReservations);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/v1/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      } else {
        alert(data.error?.message || "Failed to update status.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = reservations.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.guestName.toLowerCase().includes(q) ||
        r.guestEmail.toLowerCase().includes(q) ||
        r.confirmationCode.toLowerCase().includes(q) ||
        r.date.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="p-6 bg-[#191714] border border-white/10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9A095]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, email, ref code or date..."
            className="w-full bg-[#11100E] border border-white/10 px-4 py-2.5 pl-10 text-xs text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold border transition-all ${
                statusFilter === st
                  ? "bg-[#C86E45] text-white border-[#C86E45]"
                  : "bg-[#11100E] text-[#A9A095] border-white/10 hover:border-white/25"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#191714] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#11100E] border-b border-white/10 text-[#A9A095] label-caps">
                <th className="p-4">Ref Code</th>
                <th className="p-4">Guest Details</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Party & Area</th>
                <th className="p-4">Notes / Dietary</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#F7F2E9]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#A9A095]">
                    No reservations matching current criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-[#24201C] transition-colors">
                    <td className="p-4 font-mono text-[#C86E45] font-medium">
                      {res.confirmationCode}
                    </td>
                    <td className="p-4">
                      <strong className="block text-sm font-medium">{res.guestName}</strong>
                      <span className="text-[11px] text-[#A9A095] block">{res.guestEmail}</span>
                      <span className="text-[11px] text-[#A9A095]">{res.guestPhone}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium block">{res.date}</span>
                      <span className="text-[#D3B98D]">{res.timeSlot}</span>
                    </td>
                    <td className="p-4">
                      <span className="block font-medium">{res.partySize} Guests</span>
                      <span className="text-[11px] text-[#A9A095]">
                        {res.seatingArea.replace("_", " ")}
                      </span>
                      {res.table && (
                        <span className="text-[10px] text-[#778064] block">
                          Table: {res.table.tableNumber}
                        </span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs text-[11px] text-[#A9A095]">
                      {res.dietaryNotes && (
                        <p className="text-[#C86E45] line-clamp-1">Diet: {res.dietaryNotes}</p>
                      )}
                      {res.specialRequests && (
                        <p className="line-clamp-1 text-white/80">Notes: {res.specialRequests}</p>
                      )}
                      {res.occasion && (
                        <span className="inline-block px-1.5 py-0.5 bg-white/5 text-[9px] uppercase tracking-wider text-[#D3B98D] mt-1">
                          {res.occasion}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold border ${
                          res.status === "CONFIRMED"
                            ? "bg-[#778064]/20 text-[#778064] border-[#778064]/30"
                            : res.status === "SEATED"
                            ? "bg-[#D3B98D]/20 text-[#D3B98D] border-[#D3B98D]/30"
                            : res.status === "CANCELLED"
                            ? "bg-[#C86E45]/20 text-[#C86E45] border-[#C86E45]/30"
                            : res.status === "COMPLETED"
                            ? "bg-white/10 text-white/60 border-white/10"
                            : "bg-red-900/20 text-red-400 border-red-800/30"
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {loadingId === res.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#C86E45] ml-auto" />
                      ) : (
                        <select
                          value={res.status}
                          onChange={(e) => handleUpdateStatus(res.id, e.target.value)}
                          className="bg-[#11100E] border border-white/15 text-[11px] px-2 py-1 text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                        >
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="SEATED">Mark Seated</option>
                          <option value="COMPLETED">Mark Completed</option>
                          <option value="CANCELLED">Cancel Booking</option>
                          <option value="NO_SHOW">Mark No-Show</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
