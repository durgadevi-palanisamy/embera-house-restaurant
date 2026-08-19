import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER")) {
      return NextResponse.json({ success: false, error: { message: "Unauthorized admin access." } }, { status: 403 });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const [
      todayReservations,
      allReservationsCount,
      confirmedCount,
      menuItemsCount,
      eventsCount,
      subscribersCount,
      unreadEnquiriesCount,
      recentReservations,
      categories,
    ] = await Promise.all([
      prisma.reservation.findMany({
        where: { date: todayStr },
        include: { table: true },
      }),
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: "CONFIRMED" } }),
      prisma.menuItem.count(),
      prisma.event.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.contactEnquiry.count({ where: { status: "UNREAD" } }),
      prisma.reservation.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { table: true },
      }),
      prisma.menuCategory.findMany({
        include: { _count: { select: { items: true } } },
      }),
    ]);

    const todayCovers = todayReservations.reduce((sum, r) => sum + r.partySize, 0);

    return NextResponse.json({
      success: true,
      stats: {
        todayReservationsCount: todayReservations.length,
        todayCovers,
        allReservationsCount,
        confirmedCount,
        menuItemsCount,
        eventsCount,
        subscribersCount,
        unreadEnquiriesCount,
      },
      recentReservations,
      categories,
    });
  } catch (error: any) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ success: false, error: { message: "Failed to load dashboard metrics." } }, { status: 500 });
  }
}
