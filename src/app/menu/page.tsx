import prisma from "@/lib/prisma";
import MenuExplorer from "@/components/menu/MenuExplorer";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import { Calendar, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seasonal Menu & Cellar List",
  description:
    "Explore the full Embera House menu: from wood-fired chalk stream trout and dry-aged Dexter beef to organic harvest plates and sommelier reserve pairings.",
};

export const revalidate = 60;

export default async function MenuPage() {
  const session = await getSessionUser();

  const [categories, userFavourites] = await Promise.all([
    prisma.menuCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { isAvailable: true },
          orderBy: [{ isSignature: "desc" }, { isChefPick: "desc" }, { sortOrder: "asc" }],
        },
      },
    }),
    session
      ? prisma.favouriteDish
          .findMany({ where: { userId: session.id }, select: { menuItemId: true } })
          .then((favs) => favs.map((f) => f.menuItemId))
      : Promise.resolve([]),
  ]);

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="label-caps text-[#C86E45] block">Culinary Archive</span>
          <h1 className="hero-title text-[#F7F2E9]">
            The Seasonal <span className="italic font-light text-[#D3B98D]">Menu.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A9A095] leading-relaxed max-w-2xl mx-auto">
            Grounded in British terroir and fired over English hardwoods. Every dish is seasoned with time, patience, and smoke.
          </p>
          <div className="pt-2">
            <Link
              href="/reserve"
              className="btn-terracotta text-xs px-6 py-3 shadow-lg inline-flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve a Dining Table</span>
            </Link>
          </div>
        </div>

        {/* Menu Explorer Interface */}
        <MenuExplorer categories={categories} initialFavourites={userFavourites} />
      </div>
    </div>
  );
}
