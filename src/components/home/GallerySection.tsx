"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Maximize2, ArrowRight } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption?: string | null;
}

export default function GallerySection({ items }: { items: GalleryItem[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === "Escape") setSelectedIdx(null);
      if (e.key === "ArrowRight") setSelectedIdx((prev) => (prev! + 1) % items.length);
      if (e.key === "ArrowLeft")
        setSelectedIdx((prev) => (prev! - 1 + items.length) % items.length);
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
  }, [selectedIdx, items.length]);

  return (
    <section className="py-28 bg-[#11100E] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="label-caps text-[#C86E45] block mb-3">Atmosphere & Visuals</span>
            <h2 className="section-title text-[#F7F2E9]">
              The Embera <span className="italic font-light text-[#D3B98D]">Gallery.</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="btn-outline-luxury text-xs flex items-center gap-2 self-start md:self-auto"
          >
            <span>Explore Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Masonry / Asymmetrical Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedIdx(idx)}
              className="group relative aspect-[4/3] overflow-hidden bg-[#191714] border border-white/10 cursor-pointer"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="label-caps text-[#C86E45] block mb-1">{item.category}</span>
                <h3 className="font-editorial text-xl text-[#F7F2E9] font-medium">{item.title}</h3>
                {item.caption && (
                  <p className="text-xs text-[#A9A095] line-clamp-1 mt-0.5">{item.caption}</p>
                )}
                <div className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white/80">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Fullscreen Lightbox */}
      {selectedIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8 animate-fade-in"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedIdx(null)}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Button */}
          <button
            onClick={() =>
              setSelectedIdx((prev) => (prev! - 1 + items.length) % items.length)
            }
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 z-50 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Lightbox Content */}
          <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center">
            <div className="relative w-full h-[65vh] sm:h-[70vh]">
              <Image
                src={items[selectedIdx].imageUrl}
                alt={items[selectedIdx].title}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center mt-4">
              <span className="label-caps text-[#C86E45] block mb-1">
                {items[selectedIdx].category} • {selectedIdx + 1} of {items.length}
              </span>
              <h3 className="font-editorial text-2xl text-[#F7F2E9] font-medium">
                {items[selectedIdx].title}
              </h3>
              {items[selectedIdx].caption && (
                <p className="text-sm text-[#A9A095] mt-1 max-w-xl mx-auto">
                  {items[selectedIdx].caption}
                </p>
              )}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setSelectedIdx((prev) => (prev! + 1) % items.length)}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 z-50 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
