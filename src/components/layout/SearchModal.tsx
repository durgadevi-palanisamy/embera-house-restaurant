"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Utensils, Calendar, BookOpen, ArrowRight } from "lucide-react";

interface SearchResult {
  type: "dish" | "event" | "journal";
  title: string;
  subtitle: string;
  url: string;
}

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#191714] border border-white/10 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-[#C86E45]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes, fire events, stories, experiences..."
              className="w-full bg-transparent text-lg text-[#F7F2E9] placeholder-[#A9A095] outline-none font-sans"
              autoFocus
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A9A095] hover:text-[#F7F2E9] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-6 max-h-[60vh] overflow-y-auto space-y-3">
          {loading && (
            <p className="text-sm text-[#A9A095] py-4 text-center">Searching Embera archive...</p>
          )}

          {!loading && query && results.length === 0 && (
            <p className="text-sm text-[#A9A095] py-8 text-center">
              No matching culinary items or stories found for &ldquo;{query}&rdquo;.
            </p>
          )}

          {!loading && !query && (
            <div className="py-6">
              <span className="label-caps text-[#A9A095] block mb-3">Popular Inquiries</span>
              <div className="flex flex-wrap gap-2">
                {["Dry-Aged Ribeye", "Scallops", "Chef Mateo", "Wine & Fire", "Tasting Menu", "Cocktails"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 text-xs bg-[#24201C] text-[#F7F2E9] hover:bg-[#C86E45] hover:text-white transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {results.map((item, idx) => (
            <Link
              key={idx}
              href={item.url}
              onClick={onClose}
              className="group flex items-center justify-between p-3.5 bg-[#24201C]/60 hover:bg-[#24201C] border border-white/5 hover:border-[#C86E45]/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 bg-[#11100E] text-[#D3B98D]">
                  {item.type === "dish" && <Utensils className="w-4 h-4 text-[#C86E45]" />}
                  {item.type === "event" && <Calendar className="w-4 h-4 text-[#D3B98D]" />}
                  {item.type === "journal" && <BookOpen className="w-4 h-4 text-[#778064]" />}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#F7F2E9] group-hover:text-[#C86E45] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#A9A095] line-clamp-1">{item.subtitle}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#A9A095] group-hover:text-[#F7F2E9] group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
