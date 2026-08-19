"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Search, Sparkles, Flame, Heart, Wine, AlertCircle, Check } from "lucide-react";

interface MenuItemData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  dietaryFlags: string;
  allergens: string;
  ingredients?: string | null;
  winePairing?: string | null;
  chefNote?: string | null;
  isChefPick: boolean;
  isSignature: boolean;
  isAvailable: boolean;
  imageUrl?: string | null;
  categoryId: string;
}

interface MenuCategoryData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  items: MenuItemData[];
}

export default function MenuExplorer({
  categories,
  initialFavourites = [],
}: {
  categories: MenuCategoryData[];
  initialFavourites?: string[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [dietaryFilter, setDietaryFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [favourites, setFavourites] = useState<Set<string>>(new Set(initialFavourites));
  const [favMessage, setFavMessage] = useState<string | null>(null);

  const toggleFavourite = async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/v1/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId: itemId }),
      });
      const data = await res.json();

      if (res.ok) {
        setFavourites((prev) => {
          const next = new Set(prev);
          if (data.isFavourited) next.add(itemId);
          else next.delete(itemId);
          return next;
        });
        setFavMessage(data.message);
        setTimeout(() => setFavMessage(null), 3000);
      } else if (res.status === 401) {
        setFavMessage("Please sign in to save favourite dishes.");
        setTimeout(() => setFavMessage(null), 3500);
      }
    } catch (err) {
      console.error("Favourite error:", err);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        if (selectedCategory !== "ALL" && cat.id !== selectedCategory) {
          return null;
        }

        const filteredItems = cat.items.filter((item) => {
          // Search query
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matches =
              item.name.toLowerCase().includes(q) ||
              item.description.toLowerCase().includes(q) ||
              (item.ingredients && item.ingredients.toLowerCase().includes(q));
            if (!matches) return false;
          }

          // Dietary filter
          if (dietaryFilter === "VEGETARIAN") {
            return item.dietaryFlags.includes("VEGETARIAN") || item.dietaryFlags.includes("VEGAN");
          }
          if (dietaryFilter === "VEGAN") {
            return item.dietaryFlags.includes("VEGAN");
          }
          if (dietaryFilter === "GLUTEN_FREE") {
            return item.dietaryFlags.includes("GLUTEN_FREE");
          }
          if (dietaryFilter === "CHEF_PICK") {
            return item.isChefPick || item.isSignature;
          }

          return true;
        });

        return {
          ...cat,
          items: filteredItems,
        };
      })
      .filter((cat): cat is MenuCategoryData => cat !== null && cat.items.length > 0);
  }, [categories, selectedCategory, dietaryFilter, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Toast Notification */}
      {favMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#191714] border border-[#C86E45] px-4 py-3 text-xs text-[#F7F2E9] shadow-2xl flex items-center gap-2 animate-fade-in">
          <Heart className="w-4 h-4 text-[#C86E45] fill-[#C86E45]" />
          <span>{favMessage}</span>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-[#191714] border border-white/10 p-6 md:p-8 space-y-6">
        {/* Search & Dietary Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A9A095]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ingredient, dish or wine..."
              className="w-full bg-[#11100E] border border-white/10 px-4 py-2.5 pl-10 text-xs text-[#F7F2E9] placeholder-[#A9A095] focus:outline-none focus:border-[#C86E45] transition-colors"
            />
          </div>

          {/* Dietary Badges Filter */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "ALL", label: "All Items" },
              { id: "CHEF_PICK", label: "Chef's Picks" },
              { id: "VEGETARIAN", label: "Vegetarian" },
              { id: "VEGAN", label: "Vegan" },
              { id: "GLUTEN_FREE", label: "Gluten-Conscious" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDietaryFilter(f.id)}
                className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all ${
                  dietaryFilter === f.id
                    ? "bg-[#C86E45] text-[#F7F2E9]"
                    : "bg-[#24201C] text-[#A9A095] hover:text-[#F7F2E9] hover:bg-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex overflow-x-auto gap-2 pt-2 border-t border-white/10 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap font-medium transition-all ${
              selectedCategory === "ALL"
                ? "text-[#D3B98D] border-b-2 border-[#D3B98D]"
                : "text-[#A9A095] hover:text-[#F7F2E9]"
            }`}
          >
            All Courses ({categories.reduce((acc, c) => acc + c.items.length, 0)})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat.id
                  ? "text-[#D3B98D] border-b-2 border-[#D3B98D]"
                  : "text-[#A9A095] hover:text-[#F7F2E9]"
              }`}
            >
              {cat.name} ({cat.items.length})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Categories & Items List */}
      {filteredCategories.length === 0 ? (
        <div className="py-20 text-center bg-[#191714] border border-white/5 p-8">
          <AlertCircle className="w-8 h-8 text-[#C86E45] mx-auto mb-3" />
          <h3 className="font-editorial text-2xl text-[#F7F2E9]">No Dishes Match Your Filter</h3>
          <p className="text-xs text-[#A9A095] mt-1 max-w-sm mx-auto">
            Try resetting your search query or dietary preferences to view our complete culinary repertoire.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setDietaryFilter("ALL");
              setSelectedCategory("ALL");
            }}
            className="btn-outline-luxury text-xs mt-6"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-8">
              {/* Category Header */}
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <span className="label-caps text-[#C86E45] block">Course Section</span>
                  <h2 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9]">
                    {category.name}
                  </h2>
                </div>
                {category.description && (
                  <p className="text-xs text-[#A9A095] italic font-serif max-w-md">
                    {category.description}
                  </p>
                )}
              </div>

              {/* Dish Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {category.items.map((dish) => {
                  const flags = dish.dietaryFlags
                    ? dish.dietaryFlags.split(",").map((f) => f.trim()).filter(Boolean)
                    : [];
                  const isFav = favourites.has(dish.id);

                  return (
                    <div
                      key={dish.id}
                      className="group relative flex flex-col bg-[#191714] border border-white/5 hover:border-[#C86E45]/40 transition-all duration-300 overflow-hidden"
                    >
                      {/* Image & Price */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#24201C]">
                        {dish.imageUrl ? (
                          <Image
                            src={dish.imageUrl}
                            alt={dish.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#A9A095]">
                            <Flame className="w-10 h-10 text-[#C86E45]" />
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {dish.isChefPick && (
                            <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold bg-[#11100E]/90 text-[#D3B98D] border border-white/10 backdrop-blur-md flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> Chef&apos;s Pick
                            </span>
                          )}
                          {dish.isSignature && (
                            <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold bg-[#C86E45]/90 text-[#F7F2E9] border border-white/10 backdrop-blur-md flex items-center gap-1">
                              <Flame className="w-2.5 h-2.5" /> Signature
                            </span>
                          )}
                        </div>

                        {/* Favourite Toggle Button */}
                        <button
                          onClick={(e) => toggleFavourite(dish.id, e)}
                          aria-label="Save to favourites"
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[#F7F2E9] transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isFav ? "text-[#C86E45] fill-[#C86E45]" : "text-white/80"
                            }`}
                          />
                        </button>

                        {/* Price Badge */}
                        <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#11100E]/95 backdrop-blur-md text-[#C86E45] font-editorial text-xl font-medium border border-white/10">
                          {formatCurrency(dish.price)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <Link href={`/menu/${dish.slug}`}>
                            <h3 className="font-editorial text-2xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors mb-2">
                              {dish.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-[#A9A095] leading-relaxed mb-3">
                            {dish.description}
                          </p>

                          {/* Ingredients */}
                          {dish.ingredients && (
                            <p className="text-[11px] text-[#778064] font-medium leading-relaxed">
                              <span className="text-[#A9A095]">Ingredients:</span> {dish.ingredients}
                            </p>
                          )}
                        </div>

                        {/* Sommelier & Allergen Info */}
                        <div className="space-y-2 pt-3 border-t border-white/5 text-[11px]">
                          {dish.winePairing && (
                            <div className="flex items-start gap-1.5 text-[#D3B98D]">
                              <Wine className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>Pairing: {dish.winePairing}</span>
                            </div>
                          )}

                          {dish.allergens && (
                            <div className="text-[#A9A095]">
                              <span className="font-semibold text-white/50">Allergens:</span> {dish.allergens}
                            </div>
                          )}

                          {/* Dietary Badges */}
                          <div className="flex flex-wrap items-center justify-between pt-2">
                            <div className="flex flex-wrap gap-1.5">
                              {flags.map((flag) => (
                                <span
                                  key={flag}
                                  className="text-[9px] uppercase tracking-wider text-[#A9A095] bg-[#11100E] px-2 py-0.5 border border-white/5"
                                >
                                  {flag.replace("_", " ")}
                                </span>
                              ))}
                            </div>

                            <Link
                              href={`/menu/${dish.slug}`}
                              className="text-xs text-[#C86E45] hover:text-[#D3B98D] font-medium flex items-center gap-1 transition-colors"
                            >
                              Details & Tasting Notes →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
