import { NextRequest, NextResponse } from "next/server";
import { createReservationTransactional } from "@/lib/availability";
import { sendReservationConfirmationEmail } from "@/lib/email";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const reservationSchema = z.object({
  guestName: z.string().min(2, "Guest name is required"),
  guestEmail: z.string().email("Valid guest email is required"),
  guestPhone: z.string().min(6, "Valid phone number is required"),
  partySize: z.number().int().min(1).max(20),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  timeSlot: z.string().regex(/^\d{2}:\d{2}$/, "Time slot must be HH:MM"),
  seatingArea: z.string().optional(),
  occasion: z.string().optional(),
  dietaryNotes: z.string().optional(),
  accessibilityNotes: z.string().optional(),
  specialRequests: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message || "Invalid reservation parameters.",
          },
        },
        { status: 400 }
      );
    }

    const session = await getSessionUser();
    const payload = {
      ...parsed.data,
      userId: session?.id,
    };

    // Execute transactional booking with table assignment and capacity lock
    const reservation = await createReservationTransactional(payload);

    // Send confirmation email (async)
    sendReservationConfirmationEmail({
      guestName: reservation.guestName,
      guestEmail: reservation.guestEmail,
      confirmationCode: reservation.confirmationCode,
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      partySize: reservation.partySize,
      seatingArea: reservation.seatingArea,
      specialRequests: reservation.specialRequests || undefined,
    }).catch((err) => console.error("Email send warning:", err));

    return NextResponse.json({
      success: true,
      reservation,
      message: "Reservation confirmed successfully.",
    });
  } catch (error: any) {
    console.error("Booking error:", error);
    if (error.message === "RESERVATION_SLOT_FULL") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESERVATION_TIME_UNAVAILABLE",
            message: "That reservation time is no longer available. Please select another slot.",
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BOOKING_FAILED",
          message: error.message || "Failed to create reservation. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
