import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: { message: "Please sign in to save favourites." } },
        { status: 401 }
      );
    }

    const { menuItemId } = await req.json();
    if (!menuItemId) {
      return NextResponse.json(
        { success: false, error: { message: "Missing menuItemId" } },
        { status: 400 }
      );
    }

    const existing = await prisma.favouriteDish.findUnique({
      where: {
        userId_menuItemId: {
          userId: session.id,
          menuItemId,
        },
      },
    });

    if (existing) {
      await prisma.favouriteDish.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({
        success: true,
        isFavourited: false,
        message: "Removed from your favourites.",
      });
    } else {
      await prisma.favouriteDish.create({
        data: {
          userId: session.id,
          menuItemId,
        },
      });
      return NextResponse.json({
        success: true,
        isFavourited: true,
        message: "Saved to your favourite dishes.",
      });
    }
  } catch (error: any) {
    console.error("Favourite toggle error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to update favourites." } },
      { status: 500 }
    );
  }
}
