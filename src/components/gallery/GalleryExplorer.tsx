"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryItemData {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string | null;
}

export default function GalleryExplorer({ items }: { items: GalleryItemData[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const categories = [
    { id: "ALL", label: "All Imagery" },
    { id: "FOOD", label: "Plated Dishes" },
    { id: "INTERIOR", label: "Atmosphere & Dining" },
    { id: "KITCHEN", label: "Fire & Hearth" },
    { id: "DRINKS", label: "Cellar & Cocktails" },
    { id: "EVENTS", label: "Moments & Evenings" },
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === "ALL") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowRight") setSelectedIdx((prev) => (prev! + 1) % filteredItems.length);
      if (e.key === "ArrowLeft")
        setSelectedIdx((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    if (selectedIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedIdx, filteredItems.length]);

  return (
    <div className="space-y-12">
      {/* Category Filter Tabs */}
      <div className="flex justify-center overflow-x-auto gap-2 pb-4 border-b border-white/10 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setActiveCategory(c.id);
              setSelectedIdx(null);
            }}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap ${
              activeCategory === c.id
                ? "bg-[#C86E45] text-[#F7F2E9] shadow-lg"
                : "bg-[#191714] text-[#A9A095] hover:text-[#F7F2E9] hover:bg-[#24201C]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Masonry / Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedIdx(idx)}
            className="group relative aspect-[4/3] overflow-hidden bg-[#191714] border border-white/10 cursor-pointer shadow-xl"
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span className="label-caps text-[#C86E45] block mb-1">{item.category}</span>
              <h3 className="font-editorial text-2xl text-[#F7F2E9] font-medium">{item.title}</h3>
              {item.caption && (
                <p className="text-xs text-[#A9A095] line-clamp-2 mt-1">{item.caption}</p>
              )}
              <div className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white/80">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accessible Fullscreen Lightbox */}
      {selectedIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 animate-fade-in"
        >
          <button
            onClick={() => setSelectedIdx(null)}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 z-50 p-2.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setSelectedIdx((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length)
            }
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 z-50 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full h-[65vh] sm:h-[70vh]">
              <Image
                src={filteredItems[selectedIdx].imageUrl}
                alt={filteredItems[selectedIdx].title}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center mt-4 space-y-1">
              <span className="label-caps text-[#C86E45] block">
                {filteredItems[selectedIdx].category} • {selectedIdx + 1} of {filteredItems.length}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#F7F2E9] font-medium">
                {filteredItems[selectedIdx].title}
              </h3>
              {filteredItems[selectedIdx].caption && (
                <p className="text-sm text-[#A9A095] max-w-xl mx-auto">
                  {filteredItems[selectedIdx].caption}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedIdx((prev) => (prev! + 1) % filteredItems.length)}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 z-50 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
