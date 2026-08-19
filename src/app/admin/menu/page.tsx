import prisma from "@/lib/prisma";
import MenuManager from "@/components/admin/MenuManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu & Dish CMS | Embera Admin",
};

export const revalidate = 0;

export default async function AdminMenuPage() {
  let items: any[] = [];
  let categories: any[] = [];

  try {
    const [fetchedItems, fetchedCategories] = await Promise.all([
      prisma.menuItem.findMany({
        include: { category: true },
        orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      }),
      prisma.menuCategory.findMany({
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true },
      }),
    ]);
    items = fetchedItems;
    categories = fetchedCategories;
  } catch (err) {
    console.warn("DB query error in admin menu page:", err);
  }

  if (categories.length === 0) {
    categories = [
      { id: "cat_01", name: "Starters & Small Plates" },
      { id: "cat_02", name: "The Hearth & Mains" },
      { id: "cat_03", name: "Desserts & Confections" },
      { id: "cat_04", name: "Botanical Libations" },
    ];
  }

  if (items.length === 0) {
    items = [
      {
        id: "item_01",
        title: "24-Hour Smoked Awadhi Lamb Raan",
        slug: "smoked-awadhi-lamb-raan",
        description: "Young lamb leg slow-braised over seasoned mango wood coals with saffron jus.",
        price: 2450,
        currency: "INR",
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isChefSpecial: true,
        isAvailable: true,
        category: { id: "cat_02", name: "The Hearth & Mains" },
      },
      {
        id: "item_02",
        title: "Wood-Fired Portobello & Morel Korma",
        slug: "wood-fired-portobello-morel-korma",
        description: "Charred Himalayan morels simmered in a velvet cashew emulsion with smoked paprika.",
        price: 1650,
        currency: "INR",
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isChefSpecial: false,
        isAvailable: true,
        category: { id: "cat_02", name: "The Hearth & Mains" },
      },
    ];
  }

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
