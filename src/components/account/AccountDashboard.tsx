"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Heart,
  User,
  LogOut,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Utensils,
  ArrowRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  preferences?: {
    dietaryNotes?: string | null;
    allergies?: string | null;
    seatingPreference?: string | null;
    specialNotes?: string | null;
  } | null;
  reservations: any[];
  favourites: any[];
}

export default function AccountDashboard({ user }: { user: AccountUser }) {
  const [activeTab, setActiveTab] = useState<"bookings" | "favourites" | "profile">("bookings");
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleCancelBooking = async (reservationId: string) => {
    if (!confirm("Are you sure you wish to cancel this dining reservation?")) return;

    setCancelLoadingId(reservationId);
    setCancelError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/v1/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage("Reservation has been successfully cancelled.");
        router.refresh();
      } else {
        setCancelError(data.error?.message || "Could not cancel reservation.");
      }
    } catch (err) {
      setCancelError("A network error occurred. Please contact the concierge directly.");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const upcomingBookings = user.reservations.filter(
    (r) => r.status === "CONFIRMED" || r.status === "PENDING"
  );
  const pastBookings = user.reservations.filter(
    (r) => r.status === "COMPLETED" || r.status === "CANCELLED" || r.status === "NO_SHOW"
  );

  return (
    <div className="space-y-10">
      {/* Top Welcome Bar */}
      <div className="p-8 bg-[#191714] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#24201C] border border-[#C86E45]/40 flex items-center justify-center text-[#D3B98D] font-editorial text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <span className="label-caps text-[#C86E45] block">Embera Patron</span>
            <h1 className="font-editorial text-3xl text-[#F7F2E9]">{user.name}</h1>
            <p className="text-xs text-[#A9A095]">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/reserve" className="btn-terracotta text-xs py-3 px-5">
            <Calendar className="w-3.5 h-3.5" />
            <span>New Reservation</span>
          </Link>
          <button
            onClick={handleLogout}
            className="btn-outline-luxury text-xs py-3 px-4 flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 pb-4">
        {[
          { id: "bookings", label: `Reservations (${user.reservations.length})`, icon: Calendar },
          { id: "favourites", label: `Favourite Dishes (${user.favourites.length})`, icon: Heart },
          { id: "profile", label: "Preferences & Profile", icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-[#C86E45] text-[#F7F2E9]"
                  : "bg-[#191714] text-[#A9A095] hover:text-[#F7F2E9]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback Messages */}
      {successMessage && (
        <div className="p-4 bg-[#778064]/20 border border-[#778064] text-xs text-[#F7F2E9] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#778064] shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {cancelError && (
        <div className="p-4 bg-[#C86E45]/20 border border-[#C86E45] text-xs text-[#F7F2E9] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#C86E45] shrink-0" />
          <span>{cancelError}</span>
        </div>
      )}

      {/* TAB 1: RESERVATIONS */}
      {activeTab === "bookings" && (
        <div className="space-y-10 animate-fade-in">
          {/* Upcoming */}
          <div className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F7F2E9]">Upcoming Reservations</h2>

            {upcomingBookings.length === 0 ? (
              <div className="p-8 bg-[#191714] border border-white/5 text-center text-xs text-[#A9A095] space-y-3">
                <Calendar className="w-6 h-6 text-[#C86E45] mx-auto opacity-70" />
                <p>You have no upcoming dining reservations scheduled.</p>
                <Link href="/reserve" className="btn-terracotta text-xs inline-flex mt-2">
                  Reserve a Table
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingBookings.map((res) => (
                  <div
                    key={res.id}
                    className="p-6 bg-[#191714] border border-white/10 space-y-4 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="label-caps text-[#C86E45] block text-[9px]">
                          Ref: {res.confirmationCode}
                        </span>
                        <h3 className="font-editorial text-2xl text-[#F7F2E9]">
                          {formatDate(res.date)}
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold bg-[#778064]/20 text-[#778064] border border-[#778064]/30">
                        {res.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#A9A095]">
                      <p>
                        <strong className="text-[#F7F2E9]">Time:</strong> {res.timeSlot}
                      </p>
                      <p>
                        <strong className="text-[#F7F2E9]">Party:</strong> {res.partySize} Guests
                      </p>
                      <p>
                        <strong className="text-[#F7F2E9]">Area:</strong>{" "}
                        {res.seatingArea.replace("_", " ")}
                      </p>
                      {res.specialRequests && (
                        <p>
                          <strong className="text-[#F7F2E9]">Notes:</strong> {res.specialRequests}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-[#A9A095]">
                        Cancel free up to 6 hours prior
                      </span>
                      <button
                        onClick={() => handleCancelBooking(res.id)}
                        disabled={cancelLoadingId === res.id}
                        className="text-xs text-[#C86E45] hover:text-red-400 font-medium transition-colors flex items-center gap-1"
                      >
                        {cancelLoadingId === res.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Booking</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="font-editorial text-2xl text-[#A9A095]">Reservation History</h2>
              <div className="space-y-3">
                {pastBookings.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 bg-[#11100E] border border-white/5 flex items-center justify-between text-xs text-[#A9A095]"
                  >
                    <div>
                      <span className="text-[#F7F2E9] font-medium block">
                        {formatDate(res.date)} at {res.timeSlot}
                      </span>
                      <span>
                        {res.partySize} Guests • {res.confirmationCode}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-white/5">
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAVOURITES */}
      {activeTab === "favourites" && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="font-editorial text-2xl text-[#F7F2E9]">Saved Favourite Dishes</h2>

          {user.favourites.length === 0 ? (
            <div className="p-8 bg-[#191714] border border-white/5 text-center text-xs text-[#A9A095] space-y-3">
              <Heart className="w-6 h-6 text-[#C86E45] mx-auto opacity-70" />
              <p>Your favourite dishes will appear here.</p>
              <Link href="/menu" className="btn-outline-luxury text-xs inline-flex mt-2">
                Explore the Menu
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.favourites.map((fav) => {
                const item = fav.menuItem;
                return (
                  <Link
                    key={fav.id}
                    href={`/menu/${item.slug}`}
                    className="group flex gap-4 p-5 bg-[#191714] border border-white/10 hover:border-[#C86E45]/40 transition-all"
                  >
                    {item.imageUrl && (
                      <div className="relative w-24 h-24 shrink-0 overflow-hidden bg-[#24201C]">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-editorial text-xl text-[#F7F2E9] group-hover:text-[#D3B98D]">
                            {item.name}
                          </h3>
                          <span className="font-editorial text-base text-[#C86E45]">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                        <p className="text-xs text-[#A9A095] line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-xs text-[#C86E45] font-medium flex items-center gap-1 pt-2">
                        View Dish <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE & PREFERENCES */}
      {activeTab === "profile" && (
        <div className="p-8 bg-[#191714] border border-white/10 space-y-6 max-w-2xl animate-fade-in">
          <div>
            <span className="label-caps text-[#C86E45] block mb-1">Guest Profile</span>
            <h2 className="font-editorial text-3xl text-[#F7F2E9]">Personal Details</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="label-caps text-[#A9A095] block mb-1">Name</span>
                <span className="text-[#F7F2E9] text-sm font-medium">{user.name}</span>
              </div>
              <div>
                <span className="label-caps text-[#A9A095] block mb-1">Email</span>
                <span className="text-[#F7F2E9] text-sm font-medium">{user.email}</span>
              </div>
            </div>

            <div>
              <span className="label-caps text-[#A9A095] block mb-1">Telephone</span>
              <span className="text-[#F7F2E9] text-sm font-medium">
                {user.phone || "Not provided"}
              </span>
            </div>

            {user.preferences && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="label-caps text-[#D3B98D] block">Saved Dining Notes</span>
                <p>
                  <strong className="text-[#F7F2E9]">Dietary:</strong>{" "}
                  {user.preferences.dietaryNotes || "None"}
                </p>
                <p>
                  <strong className="text-[#F7F2E9]">Allergies:</strong>{" "}
                  {user.preferences.allergies || "None"}
                </p>
                <p>
                  <strong className="text-[#F7F2E9]">Seating:</strong>{" "}
                  {user.preferences.seatingPreference || "No preference"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
