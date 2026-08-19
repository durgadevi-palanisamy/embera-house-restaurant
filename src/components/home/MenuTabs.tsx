"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, ArrowRight, Flame } from "lucide-react";

interface MenuItemPreview {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  dietaryFlags: string;
  isChefPick: boolean;
  isSignature: boolean;
  imageUrl?: string | null;
}

interface CategoryWithItems {
  id: string;
  name: string;
  slug: string;
  items: MenuItemPreview[];
}

export default function MenuTabs({ categories }: { categories: CategoryWithItems[] }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!categories || categories.length === 0) return null;

  const currentCategory = categories[activeTab] || categories[0];

  return (
    <section className="py-28 bg-[#191714] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="label-caps text-[#C86E45] block mb-3">The Culinary Repertoire</span>
            <h2 className="section-title text-[#F7F2E9]">
              Menu <span className="italic font-light text-[#D3B98D]">Selection.</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="btn-outline-luxury text-xs flex items-center gap-2 self-start md:self-auto"
          >
            <span>View Full Menu & Cellar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab Buttons */}
        <div className="flex overflow-x-auto pb-4 gap-2 sm:gap-3 border-b border-white/10 scrollbar-none mb-10">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-3 text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition-all ${
                activeTab === idx
                  ? "bg-[#C86E45] text-[#F7F2E9] shadow-lg"
                  : "bg-[#24201C] text-[#A9A095] hover:text-[#F7F2E9] hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-fade-in">
          {currentCategory.items.map((item) => {
            const flags = item.dietaryFlags
              ? item.dietaryFlags.split(",").map((f) => f.trim()).filter(Boolean)
              : [];

            return (
              <Link
                key={item.id}
                href={`/menu/${item.slug}`}
                className="group flex flex-col sm:flex-row gap-5 p-5 bg-[#11100E] border border-white/5 hover:border-[#C86E45]/40 transition-all"
              >
                {item.imageUrl && (
                  <div className="relative w-full sm:w-32 h-32 sm:h-auto shrink-0 overflow-hidden bg-[#24201C]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <h3 className="font-editorial text-xl font-medium text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-editorial text-lg font-medium text-[#C86E45] shrink-0">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <p className="text-xs text-[#A9A095] leading-relaxed line-clamp-2 mb-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Dietary & Chef Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {item.isChefPick && (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-[#C86E45]/20 text-[#C86E45] border border-[#C86E45]/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Chef&apos;s Selection
                      </span>
                    )}
                    {item.isSignature && (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-[#D3B98D]/20 text-[#D3B98D] border border-[#D3B98D]/30 flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" /> Signature
                      </span>
                    )}
                    {flags.map((flag) => (
                      <span
                        key={flag}
                        className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium bg-white/5 text-[#A9A095]"
                      >
                        {flag.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
