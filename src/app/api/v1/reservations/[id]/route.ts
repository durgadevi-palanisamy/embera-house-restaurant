import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { sendReservationCancellationEmail } from "@/lib/email";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [{ id: params.id }, { confirmationCode: params.id }],
      },
      include: {
        table: true,
        history: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: { message: "Reservation not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, reservation });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: "Failed to retrieve reservation." } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    const body = await req.json();
    const { status, specialRequests, dietaryNotes, partySize, timeSlot } = body;

    const reservation = await prisma.reservation.findFirst({
      where: {
        OR: [{ id: params.id }, { confirmationCode: params.id }],
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, error: { message: "Reservation not found." } },
        { status: 404 }
      );
    }

    // If customer is cancelling, verify cancellation window policy
    if (status === "CANCELLED") {
      const restaurant = await prisma.restaurant.findFirst();
      const limitHours = restaurant?.cancellationHoursLimit || 6;

      const bookingDateTime = new Date(`${reservation.date}T${reservation.timeSlot}:00`);
      const now = new Date();
      const diffMs = bookingDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // If less than cancellation limit and not an admin
      if (diffHours < limitHours && (!session || session.role === "CUSTOMER")) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "CANCELLATION_POLICY_WINDOW_EXPIRED",
              message: `Online cancellations are permitted up to ${limitHours} hours prior to arrival. Please contact our concierge directly at +44 (0) 20 7946 0888.`,
            },
          },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: status || reservation.status,
        specialRequests: specialRequests !== undefined ? specialRequests : reservation.specialRequests,
        dietaryNotes: dietaryNotes !== undefined ? dietaryNotes : reservation.dietaryNotes,
        partySize: partySize || reservation.partySize,
        timeSlot: timeSlot || reservation.timeSlot,
      },
      include: { table: true },
    });

    // Record status history
    if (status && status !== reservation.status) {
      await prisma.reservationStatusHistory.create({
        data: {
          reservationId: reservation.id,
          status,
          changedBy: session ? `${session.name} (${session.role})` : "GUEST",
          note: `Reservation status updated to ${status}.`,
        },
      });

      if (status === "CANCELLED") {
        sendReservationCancellationEmail({
          guestName: reservation.guestName,
          guestEmail: reservation.guestEmail,
          confirmationCode: reservation.confirmationCode,
          date: reservation.date,
          timeSlot: reservation.timeSlot,
          partySize: reservation.partySize,
        }).catch((err) => console.error("Cancel email log:", err));
      }
    }

    return NextResponse.json({
      success: true,
      reservation: updated,
      message: "Reservation successfully updated.",
    });
  } catch (error: any) {
    console.error("Update reservation error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to update reservation." } },
      { status: 500 }
    );
  }
}
