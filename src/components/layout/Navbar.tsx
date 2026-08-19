"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User as UserIcon, Menu as MenuIcon, X, Calendar } from "lucide-react";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "Experience", href: "/experience" },
    { label: "About", href: "/about" },
    { label: "Events", href: "/events" },
    { label: "Journal", href: "/journal" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null; // Admin has its dedicated sidebar header

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#11100E]/85 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
            : "bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex flex-col items-start focus:outline-none"
          >
            <span className="font-editorial text-2xl md:text-3xl font-medium tracking-wide text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors">
              EMBERA HOUSE
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#C86E45] font-semibold">
              Lower Parel • Mumbai
            </span>
          </Link>

          {/* Desktop Center Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.16em] font-medium transition-all relative py-1 ${
                    isActive
                      ? "text-[#C86E45] font-semibold"
                      : "text-[#F7F2E9]/80 hover:text-[#F7F2E9]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C86E45] animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Utilities & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search website"
              className="p-2 text-[#F7F2E9]/80 hover:text-[#D3B98D] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              href="/account"
              aria-label="Customer Account"
              className="p-2 text-[#F7F2E9]/80 hover:text-[#D3B98D] transition-colors"
            >
              <UserIcon className="w-4 h-4" />
            </Link>

            <Link
              href="/reserve"
              className="btn-terracotta text-xs px-5 py-2.5 shadow-lg flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Reserve Table</span>
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="p-2 text-[#F7F2E9]/80 hover:text-[#D3B98D]"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/reserve"
              className="text-[11px] font-semibold uppercase tracking-wider bg-[#C86E45] text-[#F7F2E9] px-3.5 py-1.5"
            >
              Reserve
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-[#F7F2E9] hover:text-[#C86E45] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Animated Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#11100E] pt-24 pb-8 px-6 flex flex-col justify-between overflow-y-auto lg:hidden animate-fade-in">
          <div className="space-y-6 text-center pt-4">
            <div className="text-xs uppercase tracking-[0.25em] text-[#C86E45] font-semibold mb-4">
              Fire • Flavour • Moments
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-editorial text-3xl transition-colors ${
                      isActive ? "text-[#C86E45]" : "text-[#F7F2E9] hover:text-[#D3B98D]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="font-editorial text-2xl text-[#A9A095] hover:text-[#F7F2E9] pt-2"
              >
                Guest Portal & Account
              </Link>
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-4 text-center">
            <Link
              href="/reserve"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full btn-terracotta py-4 text-sm justify-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reserve a Table
            </Link>
            <p className="text-xs text-[#A9A095]">
              Block 4, The Mills, Lower Parel, Mumbai • +91 22 6789 4400
            </p>
          </div>
        </div>
      )}

      {/* Universal Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
