import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: true, user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        preferences: true,
        reservations: {
          orderBy: { date: "desc" },
          take: 5,
        },
        favourites: {
          include: { menuItem: true },
        },
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to load user profile." } },
      { status: 500 }
    );
  }
}
