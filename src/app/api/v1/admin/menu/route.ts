import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    });
    const categories = await prisma.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, items, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Failed to load menu items." } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    if (!name || !price || !categoryId) {
      return NextResponse.json({ success: false, error: { message: "Name, price, and category are required." } }, { status: 400 });
    }

    let slug = slugify(name);
    // Ensure unique slug
    const existing = await prisma.menuItem.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        slug,
        description: description || "",
        price: parseFloat(price),
        categoryId,
        dietaryFlags: dietaryFlags || "",
        allergens: allergens || "",
        ingredients: ingredients || "",
        winePairing: winePairing || "",
        chefNote: chefNote || "",
        imageUrl: imageUrl || null,
        isChefPick: Boolean(isChefPick),
        isSignature: Boolean(isSignature),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, item, message: "Dish created successfully." });
  } catch (error: any) {
    console.error("Create menu item error:", error);
    return NextResponse.json({ success: false, error: { message: "Failed to create dish." } }, { status: 500 });
  }
}
