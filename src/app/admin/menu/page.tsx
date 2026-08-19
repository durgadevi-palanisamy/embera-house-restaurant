import prisma from "@/lib/prisma";
import MenuManager from "@/components/admin/MenuManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu & Dish CMS | Embera Admin",
};

export const revalidate = 0;

export default async function AdminMenuPage() {
  const [items, categories] = await Promise.all([
    prisma.menuItem.findMany({
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    }),
    prisma.menuCategory.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <span className="label-caps text-[#C86E45] block mb-1">Culinary CMS</span>
        <h1 className="font-editorial text-4xl text-[#F7F2E9]">
          Menu & <span className="italic font-light text-[#D3B98D]">Dishes.</span>
        </h1>
        <p className="text-xs text-[#A9A095] mt-1">
          Add new seasonal courses, update pricing, toggle 86&apos;d availability, and assign sommelier pairings.
        </p>
      </div>

      <MenuManager initialItems={items} categories={categories} />
    </div>
  );
}
