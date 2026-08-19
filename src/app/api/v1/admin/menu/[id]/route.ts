import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER")) {
      return NextResponse.json({ success: false, error: { message: "Unauthorized." } }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      categoryId,
      dietaryFlags,
      allergens,
      ingredients,
      winePairing,
      chefNote,
      imageUrl,
      isChefPick,
      isSignature,
      isAvailable,
    } = body;

    const updated = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(categoryId && { categoryId }),
        ...(dietaryFlags !== undefined && { dietaryFlags }),
        ...(allergens !== undefined && { allergens }),
        ...(ingredients !== undefined && { ingredients }),
        ...(winePairing !== undefined && { winePairing }),
        ...(chefNote !== undefined && { chefNote }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isChefPick !== undefined && { isChefPick: Boolean(isChefPick) }),
        ...(isSignature !== undefined && { isSignature: Boolean(isSignature) }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, item: updated, message: "Dish updated successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Failed to update dish." } }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: { message: "Only Super Admins can delete items." } }, { status: 403 });
    }

    await prisma.menuItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Dish deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Failed to delete dish." } }, { status: 500 });
  }
}
