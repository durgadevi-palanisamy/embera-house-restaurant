import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER")) {
      return NextResponse.json({ success: false, error: { message: "Unauthorized." } }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");

    const where: any = {};
    if (date) where.date = date;
    if (status && status !== "ALL") where.status = status;

    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: [{ date: "asc" }, { timeSlot: "asc" }],
      include: {
        table: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    const tables = await prisma.restaurantTable.findMany({
      where: { isActive: true },
      orderBy: { tableNumber: "asc" },
    });

    return NextResponse.json({ success: true, reservations, tables });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Failed to fetch reservations." } }, { status: 500 });
  }
}
