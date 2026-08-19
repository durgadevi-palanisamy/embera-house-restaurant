"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Calendar as CalendarIcon,
  Clock,
  User,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Download,
  Flame,
  Sparkles,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface SlotData {
  time: string;
  mealType: "LUNCH" | "DINNER";
  available: boolean;
  remainingCovers: number;
  reason?: string;
}

export default function ReservationFlow({
  user,
}: {
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    preferences?: {
      dietaryNotes?: string | null;
      allergies?: string | null;
      seatingPreference?: string | null;
    } | null;
  } | null;
}) {
  const [step, setStep] = useState(1);

  // Form State
  const [partySize, setPartySize] = useState<number>(2);
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    // Format YYYY-MM-DD
    return today.toISOString().split("T")[0];
  });
  const [seatingArea, setSeatingArea] = useState<string>(
    user?.preferences?.seatingPreference || "NO_PREFERENCE"
  );
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [guestName, setGuestName] = useState<string>(user?.name || "");
  const [guestEmail, setGuestEmail] = useState<string>(user?.email || "");
  const [guestPhone, setGuestPhone] = useState<string>(user?.phone || "");
  const [occasion, setOccasion] = useState<string>("NONE");
  const [dietaryNotes, setDietaryNotes] = useState<string>(user?.preferences?.dietaryNotes || "");
  const [accessibilityNotes, setAccessibilityNotes] = useState<string>("");
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Availability State
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<SlotData[]>([]);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  // Booking Execution State
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<any>(null);

  // Fetch slots whenever date, partySize, or seatingArea changes
  useEffect(() => {
    if (!date) return;
    setSlotsLoading(true);
    setTimeSlot("");
    setAvailabilityMessage(null);

    const fetchSlots = async () => {
      try {
        const res = await fetch(
          `/api/v1/reservations/availability?date=${date}&partySize=${partySize}&seatingArea=${seatingArea}`
        );
        const data = await res.json();

        if (res.ok && data.success) {
          if (!data.data.isOpen) {
            setAvailableSlots([]);
            setAvailabilityMessage(data.data.closureReason || "Restaurant is closed on this date.");
          } else {
            setAvailableSlots(data.data.slots);
          }
        } else {
          setAvailableSlots([]);
          setAvailabilityMessage("Could not retrieve availability for this date.");
        }
      } catch (err) {
        console.error("Availability error:", err);
        setAvailableSlots([]);
        setAvailabilityMessage("Failed to connect to the reservation engine.");
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [date, partySize, seatingArea]);

  // Execute Booking
  const handleCompleteBooking = async () => {
    setBookingLoading(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/v1/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestEmail,
          guestPhone,
          partySize,
          date,
          timeSlot,
          seatingArea,
          occasion: occasion !== "NONE" ? occasion : undefined,
          dietaryNotes: dietaryNotes || undefined,
          accessibilityNotes: accessibilityNotes || undefined,
          specialRequests: specialRequests || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmation(data.reservation);
        setStep(7); // Go to confirmation step
      } else {
        setBookingError(data.error?.message || "Failed to confirm reservation.");
      }
    } catch (err) {
      setBookingError("A network error occurred. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Download .ics Calendar File
  const downloadCalendarFile = () => {
    if (!confirmation) return;
    const startDateTime = `${confirmation.date.replace(/-/g, "")}T${confirmation.timeSlot.replace(":", "")}00`;
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Embera House//Reservations//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Dinner at Embera House (${confirmation.confirmationCode})`,
      `DESCRIPTION:Table reservation for ${confirmation.partySize} guests at Embera House Chennai.\\nConfirmation: ${confirmation.confirmationCode}`,
      `LOCATION:Embera House, No. 42, Khader Nawaz Khan Road, Nungambakkam, Chennai 600006`,
      `DTSTART:${startDateTime}`,
      `DTEND:${startDateTime}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `embera-house-${confirmation.confirmationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Min and max selectable dates
  const todayStr = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto bg-[#191714] border border-white/10 p-6 sm:p-10 shadow-2xl">
      {/* Step Indicator Header (Steps 1 to 6) */}
      {step < 7 && (
        <div className="mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center justify-between text-xs text-[#A9A095] mb-4">
            <span className="label-caps text-[#C86E45]">Step {step} of 6</span>
            <span className="hidden sm:inline">
              {step === 1 && "Guest Count"}
              {step === 2 && "Select Date"}
              {step === 3 && "Select Service Time"}
              {step === 4 && "Guest Details"}
              {step === 5 && "Dining Preferences"}
              {step === 6 && "Review & Confirm"}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div
                key={s}
                className={`h-1 transition-all ${
                  step >= s ? "bg-[#C86E45]" : "bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: PARTY SIZE */}
      {step === 1 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <span className="label-caps text-[#C86E45] block mb-1">Party Size</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
              How many guests will be joining us?
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A095] mt-2">
              For parties larger than 8 guests, our Private Dining Salon will be allocated.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPartySize(num)}
                className={`py-5 px-4 text-center font-editorial text-2xl border transition-all ${
                  partySize === num
                    ? "bg-[#C86E45] text-white border-[#C86E45] shadow-lg scale-105"
                    : "bg-[#11100E] text-[#F7F2E9] border-white/10 hover:border-[#C86E45]/50"
                }`}
              >
                <span>{num}</span>
                <span className="block text-[10px] font-sans uppercase tracking-widest text-[#A9A095] mt-0.5">
                  {num === 1 ? "Guest" : "Guests"}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-terracotta text-xs"
            >
              <span>Continue to Date</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE SELECTION */}
      {step === 2 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <span className="label-caps text-[#C86E45] block mb-1">Reservation Date</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
              Select your dining date
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A095] mt-2">
              Reservations are opened 90 days in advance.
            </p>
          </div>

          <div className="max-w-md">
            <label className="label-caps text-[#A9A095] block mb-2">Calendar Date</label>
            <input
              type="date"
              min={todayStr}
              max={maxDateStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#11100E] border border-white/15 px-4 py-3.5 text-sm text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
            />
            {date && (
              <p className="text-xs text-[#D3B98D] mt-2 font-serif italic">
                Selected: {formatDate(date)}
              </p>
            )}
          </div>

          {/* Seating Room Preference */}
          <div className="space-y-3">
            <label className="label-caps text-[#A9A095] block">Seating Area Preference</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: "NO_PREFERENCE", label: "No Preference", sub: "Best available table" },
                { id: "MAIN_DINING", label: "Main Dining", sub: "Warm amber room" },
                { id: "TERRACE", label: "Garden Terrace", sub: "Heated botanical" },
                { id: "CHEFS_TABLE", label: "Chef's Hearth", sub: "Counterfront" },
              ].map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSeatingArea(area.id)}
                  className={`p-4 text-left border transition-all ${
                    seatingArea === area.id
                      ? "bg-[#24201C] border-[#C86E45] text-[#F7F2E9]"
                      : "bg-[#11100E] border-white/10 text-[#A9A095] hover:border-white/25"
                  }`}
                >
                  <strong className="block text-xs uppercase tracking-wider text-[#F7F2E9] mb-0.5">
                    {area.label}
                  </strong>
                  <span className="text-[11px] text-[#A9A095]">{area.sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-outline-luxury text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!date}
              className="btn-terracotta text-xs"
            >
              <span>View Available Times</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TIME SLOT SELECTION */}
      {step === 3 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <span className="label-caps text-[#C86E45] block mb-1">Service Time</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
              Choose your arrival time
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A095] mt-2">
              For {partySize} guests on {formatDate(date)}.
            </p>
          </div>

          {slotsLoading ? (
            <div className="py-16 text-center text-[#A9A095] flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#C86E45]" />
              <span className="text-xs tracking-wider uppercase">
                Calculating table availability & covers...
              </span>
            </div>
          ) : availabilityMessage ? (
            <div className="p-6 bg-[#24201C] border border-white/10 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-[#C86E45] mx-auto" />
              <p className="text-sm text-[#F7F2E9]">{availabilityMessage}</p>
              <button
                onClick={() => setStep(2)}
                className="btn-outline-luxury text-xs mt-3"
              >
                Choose Another Date
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Lunch Slots */}
              {availableSlots.some((s) => s.mealType === "LUNCH") && (
                <div>
                  <span className="label-caps text-[#D3B98D] block mb-3">Lunch Service</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {availableSlots
                      .filter((s) => s.mealType === "LUNCH")
                      .map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setTimeSlot(s.time)}
                          className={`py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider border transition-all ${
                            !s.available
                              ? "bg-black/40 text-white/20 border-white/5 cursor-not-allowed line-through"
                              : timeSlot === s.time
                              ? "bg-[#C86E45] text-white border-[#C86E45] shadow-lg"
                              : "bg-[#11100E] text-[#F7F2E9] border-white/10 hover:border-[#C86E45]"
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Dinner Slots */}
              {availableSlots.some((s) => s.mealType === "DINNER") && (
                <div className="pt-2">
                  <span className="label-caps text-[#C86E45] block mb-3">Dinner Service</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                    {availableSlots
                      .filter((s) => s.mealType === "DINNER")
                      .map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setTimeSlot(s.time)}
                          className={`py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider border transition-all ${
                            !s.available
                              ? "bg-black/40 text-white/20 border-white/5 cursor-not-allowed line-through"
                              : timeSlot === s.time
                              ? "bg-[#C86E45] text-white border-[#C86E45] shadow-lg"
                              : "bg-[#11100E] text-[#F7F2E9] border-white/10 hover:border-[#C86E45]"
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-6 border-t border-white/10 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-outline-luxury text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!timeSlot}
              className="btn-terracotta text-xs"
            >
              <span>Guest Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: GUEST DETAILS */}
      {step === 4 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <span className="label-caps text-[#C86E45] block mb-1">Contact Information</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
              Lead Guest Details
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A095] mt-2">
              Your confirmation and digital reservation token will be dispatched to this email.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="label-caps text-[#A9A095] block">Full Name *</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Lord Julian Sterling"
                className="w-full bg-[#11100E] border border-white/15 px-4 py-3.5 text-sm text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label-caps text-[#A9A095] block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="julian@sterling.co.uk"
                  className="w-full bg-[#11100E] border border-white/15 px-4 py-3.5 text-sm text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                />
              </div>

              <div className="space-y-2">
                <label className="label-caps text-[#A9A095] block">Telephone Number *</label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 98400 33400"
                  className="w-full bg-[#11100E] border border-white/15 px-4 py-3.5 text-sm text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-outline-luxury text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              disabled={!guestName || !guestEmail || !guestPhone}
              className="btn-terracotta text-xs"
            >
              <span>Dining Preferences</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PREFERENCES */}
      {step === 5 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <span className="label-caps text-[#C86E45] block mb-1">Bespoke Experience</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
              Special Requests & Dietary
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A095] mt-2">
              Help us tailor your table service to perfection.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="label-caps text-[#A9A095] block">Occasion</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-[#11100E] border border-white/15 px-4 py-3.5 text-xs text-[#F7F2E9] focus:outline-none focus:border-[#C86E45]"
              >
                <option value="NONE">Regular Dining / Evening Out</option>
                <option value="BIRTHDAY">Birthday Celebration</option>
                <option value="ANNIVERSARY">Wedding Anniversary</option>
                <option value="DATE_NIGHT">Romantic Date Night</option>
                <option value="BUSINESS">Business / Client Dinner</option>
                <option value="CELEBRATION">Special Milestone Celebration</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="label-caps text-[#A9A095] block">
                Dietary Requirements & Severe Allergies
              </label>
              <textarea
                rows={3}
                value={dietaryNotes}
                onChange={(e) => setDietaryNotes(e.target.value)}
                placeholder="e.g. 1 guest is gluten-conscious, 1 guest with severe shellfish allergy..."
                className="w-full bg-[#11100E] border border-white/15 px-4 py-3 text-xs text-[#F7F2E9] placeholder-[#A9A095]/60 focus:outline-none focus:border-[#C86E45] resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="label-caps text-[#A9A095] block">
                Accessibility & Special Seating Requests
              </label>
              <textarea
                rows={2}
                value={accessibilityNotes}
                onChange={(e) => setAccessibilityNotes(e.target.value)}
                placeholder="e.g. Require step-free table access, quiet corner table preferred..."
                className="w-full bg-[#11100E] border border-white/15 px-4 py-3 text-xs text-[#F7F2E9] placeholder-[#A9A095]/60 focus:outline-none focus:border-[#C86E45] resize-none"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="btn-outline-luxury text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(6)}
              className="btn-terracotta text-xs"
            >
              <span>Review Reservation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: REVIEW & CANCELLATION POLICY */}
      {step === 6 && (
        <div className="space-y-8 animate-fade-in">
          <div>
            <span className="label-caps text-[#C86E45] block mb-1">Final Review</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
              Review Your Dining Reservation
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A095] mt-2">
              Please verify your reservation details below prior to confirmation.
            </p>
          </div>

          {/* Summary Card */}
          <div className="p-6 sm:p-8 bg-[#11100E] border border-white/10 space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="label-caps text-[#A9A095] block mb-1">Guests</span>
                <span className="font-editorial text-2xl text-[#F7F2E9]">{partySize} Guests</span>
              </div>
              <div>
                <span className="label-caps text-[#A9A095] block mb-1">Date</span>
                <span className="font-editorial text-2xl text-[#F7F2E9]">{date}</span>
              </div>
              <div>
                <span className="label-caps text-[#A9A095] block mb-1">Time</span>
                <span className="font-editorial text-2xl text-[#C86E45]">{timeSlot}</span>
              </div>
              <div>
                <span className="label-caps text-[#A9A095] block mb-1">Seating Room</span>
                <span className="font-editorial text-2xl text-[#D3B98D]">
                  {seatingArea.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-[#A9A095]">
              <p>
                <strong className="text-[#F7F2E9]">Lead Guest:</strong> {guestName} ({guestEmail}, {guestPhone})
              </p>
              {occasion !== "NONE" && (
                <p>
                  <strong className="text-[#F7F2E9]">Occasion:</strong> {occasion}
                </p>
              )}
              {dietaryNotes && (
                <p>
                  <strong className="text-[#F7F2E9]">Dietary:</strong> {dietaryNotes}
                </p>
              )}
            </div>
          </div>

          {/* Cancellation Policy Box */}
          <div className="p-6 bg-[#24201C] border-l-2 border-[#C86E45] space-y-2 text-xs text-[#A9A095] leading-relaxed">
            <strong className="text-[#F7F2E9] block text-xs uppercase tracking-wider">
              Embera House Cancellation & Table Policy
            </strong>
            <p>
              We hold reserved tables for up to 15 minutes past scheduled arrival time. Modifications or cancellations are permitted without charge up to <strong>6 hours prior</strong> to reservation time via your account portal or concierge hotline.
            </p>
          </div>

          {bookingError && (
            <div className="p-4 bg-[#C86E45]/15 border border-[#C86E45] text-xs text-[#F7F2E9] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C86E45] shrink-0" />
              <span>{bookingError}</span>
            </div>
          )}

          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="btn-outline-luxury text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleCompleteBooking}
              disabled={bookingLoading}
              className="btn-terracotta text-xs px-8 py-4"
            >
              {bookingLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Reservation</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: CONFIRMATION SUCCESS */}
      {step === 7 && confirmation && (
        <div className="text-center py-10 space-y-8 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#778064]/20 border border-[#778064]/40 flex items-center justify-center mx-auto text-[#778064]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <span className="label-caps text-[#D3B98D] block">Booking Confirmed</span>
            <h2 className="hero-title text-4xl sm:text-5xl text-[#F7F2E9]">
              Your Table Is <span className="italic font-light text-[#D3B98D]">Secured.</span>
            </h2>
            <p className="text-sm text-[#A9A095] max-w-md mx-auto">
              We look forward to welcoming you, {confirmation.guestName}. A confirmation has been dispatched to {confirmation.guestEmail}.
            </p>
          </div>

          {/* Booking Token Card */}
          <div className="p-8 bg-[#11100E] border border-white/10 max-w-lg mx-auto text-left space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="label-caps text-[#A9A095] block text-[9px]">Confirmation Reference</span>
                <span className="font-editorial text-2xl text-[#C86E45] font-semibold tracking-wider">
                  {confirmation.confirmationCode}
                </span>
              </div>
              <div className="text-right">
                <span className="label-caps text-[#A9A095] block text-[9px]">Party</span>
                <span className="font-editorial text-xl text-[#F7F2E9]">
                  {confirmation.partySize} Guests
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#A9A095]">
              <p>
                <strong className="text-[#F7F2E9]">Date & Time:</strong> {formatDate(confirmation.date)} at {confirmation.timeSlot}
              </p>
              <p>
                <strong className="text-[#F7F2E9]">Venue:</strong> No. 42, Khader Nawaz Khan Road, Nungambakkam, Chennai 600006
              </p>
              <p>
                <strong className="text-[#F7F2E9]">Seating Area:</strong> {confirmation.seatingArea.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={downloadCalendarFile}
              className="btn-terracotta text-xs flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Add to Calendar (.ics)</span>
            </button>
            <Link href="/account" className="btn-outline-luxury text-xs">
              View in Member Portal
            </Link>
            <Link href="/" className="btn-outline-luxury text-xs">
              Return to Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
