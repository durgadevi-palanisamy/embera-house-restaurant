import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, Flame, Wine, Calendar, ArrowLeft, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const dish = await prisma.menuItem.findUnique({
    where: { slug: params.slug },
  });

  if (!dish) {
    return { title: "Dish Not Found" };
  }

  return {
    title: `${dish.name} | Embera House Menu`,
    description: dish.description,
    openGraph: {
      title: `${dish.name} — Embera House Mayfair`,
      description: dish.description,
      images: dish.imageUrl ? [{ url: dish.imageUrl }] : [],
    },
  };
}

export default async function DishDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const dish = await prisma.menuItem.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!dish) {
    notFound();
  }

  const relatedDishes = await prisma.menuItem.findMany({
    where: {
      categoryId: dish.categoryId,
      id: { not: dish.id },
      isAvailable: true,
    },
    take: 3,
  });

  const flags = dish.dietaryFlags
    ? dish.dietaryFlags.split(",").map((f) => f.trim()).filter(Boolean)
    : [];

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#A9A095] mb-8">
          <Link href="/menu" className="hover:text-[#F7F2E9] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Full Menu
          </Link>
          <span>/</span>
          <span className="text-[#C86E45]">{dish.category.name}</span>
          <span>/</span>
          <span className="text-[#F7F2E9] truncate">{dish.name}</span>
        </div>

        {/* Main Dish Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-20 border-b border-white/10">
          {/* Left: Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[1/1] overflow-hidden bg-[#191714] border border-white/10 shadow-2xl">
              {dish.imageUrl ? (
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#A9A095]">
                  <Flame className="w-16 h-16 text-[#C86E45]" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {dish.isChefPick && (
                  <span className="px-3 py-1 bg-[#11100E]/90 text-[#D3B98D] text-xs font-semibold uppercase tracking-widest border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Chef&apos;s Selection
                  </span>
                )}
                {dish.isSignature && (
                  <span className="px-3 py-1 bg-[#C86E45]/90 text-white text-xs font-semibold uppercase tracking-widest border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" /> House Signature
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Dish Narrative & Details */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="label-caps text-[#C86E45] block mb-2">{dish.category.name}</span>
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-[#F7F2E9] mb-4">
                {dish.name}
              </h1>
              <span className="font-editorial text-3xl text-[#C86E45] font-semibold">
                {formatCurrency(dish.price)}
              </span>
            </div>

            <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed font-normal">
              {dish.description}
            </p>

            {/* Chef Note */}
            {dish.chefNote && (
              <div className="p-6 bg-[#191714] border-l-2 border-[#C86E45] space-y-2">
                <span className="label-caps text-[#D3B98D] block">From the Kitchen Pass</span>
                <p className="text-xs sm:text-sm text-[#F7F2E9] italic font-serif leading-relaxed">
                  &ldquo;{dish.chefNote}&rdquo;
                </p>
                <span className="block text-[11px] text-[#A9A095]">— Chef Mateo Vane</span>
              </div>
            )}

            {/* Ingredients Breakdown */}
            {dish.ingredients && (
              <div className="space-y-2">
                <span className="label-caps text-[#A9A095] block">Provenance & Sourcing</span>
                <p className="text-xs sm:text-sm text-[#F7F2E9] bg-[#191714] p-4 border border-white/5 leading-relaxed">
                  {dish.ingredients}
                </p>
              </div>
            )}

            {/* Sommelier Wine Pairing */}
            {dish.winePairing && (
              <div className="p-5 bg-[#24201C] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-[#D3B98D] text-xs font-semibold uppercase tracking-wider">
                  <Wine className="w-4 h-4 text-[#C86E45]" />
                  <span>Sommelier Pairing Recommendation</span>
                </div>
                <p className="text-xs sm:text-sm text-[#F7F2E9] font-serif italic">
                  {dish.winePairing}
                </p>
              </div>
            )}

            {/* Dietary & Allergen Specifications */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {flags.map((flag) => (
                  <span
                    key={flag}
                    className="px-3 py-1 bg-white/5 border border-white/10 text-xs uppercase tracking-wider text-[#A9A095]"
                  >
                    {flag.replace("_", " ")}
                  </span>
                ))}
              </div>

              {dish.allergens && (
                <p className="text-xs text-[#A9A095]">
                  <span className="text-[#F7F2E9] font-medium">Allergen Information:</span> {dish.allergens}.
                  Please inform your server of any severe dietary intolerances.
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link href="/reserve" className="btn-terracotta text-xs flex-1 justify-center py-4">
                <Calendar className="w-4 h-4" />
                <span>Reserve a Table for This Dish</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Dishes */}
        {relatedDishes.length > 0 && (
          <div className="mt-20 space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-editorial text-3xl text-[#F7F2E9]">
                Complementary <span className="italic font-light text-[#D3B98D]">Selections.</span>
              </h3>
              <Link href="/menu" className="text-xs text-[#C86E45] hover:text-[#D3B98D]">
                View All Menu →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDishes.map((item) => (
                <Link
                  key={item.id}
                  href={`/menu/${item.slug}`}
                  className="group flex flex-col bg-[#191714] border border-white/5 hover:border-[#C86E45]/40 transition-all p-5"
                >
                  <div className="relative aspect-[16/10] overflow-hidden mb-4 bg-[#24201C]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-editorial text-xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors">
                      {item.name}
                    </h4>
                    <span className="font-editorial text-base text-[#C86E45] shrink-0">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                  <p className="text-xs text-[#A9A095] line-clamp-2">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
