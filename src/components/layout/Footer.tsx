import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0D0C0A] text-[#F7F2E9] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Story */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-editorial text-2xl tracking-wider text-[#F7F2E9] block font-medium">
                EMBERA HOUSE
              </span>
              <span className="label-caps text-[#C86E45] text-[9px] tracking-[0.3em]">
                Fire • Flavour • Moments
              </span>
            </Link>
            <p className="text-xs text-[#A9A095] leading-relaxed">
              Open embers, rare heirloom Indian botanicals, and unhurried hospitality in the heart of Nungambakkam, Chennai.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#A9A095] hover:text-[#C86E45] hover:border-[#C86E45] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#A9A095] hover:text-[#C86E45] hover:border-[#C86E45] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Dining & Menus */}
          <div className="space-y-4">
            <span className="label-caps text-[#C86E45] block">Culinary Journey</span>
            <ul className="space-y-2.5 text-xs text-[#A9A095]">
              <li>
                <Link href="/menu" className="hover:text-[#F7F2E9] transition-colors">
                  A La Carte Menu
                </Link>
              </li>
              <li>
                <Link href="/#tasting" className="hover:text-[#F7F2E9] transition-colors">
                  Solstice Tasting Experience
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-[#F7F2E9] transition-colors">
                  The Four Dining Salons
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#F7F2E9] transition-colors">
                  Culinary Events & Residencies
                </Link>
              </li>
              <li>
                <Link href="/reserve" className="hover:text-[#F7F2E9] transition-colors">
                  Table Reservations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: The House */}
          <div className="space-y-4">
            <span className="label-caps text-[#C86E45] block">The House</span>
            <ul className="space-y-2.5 text-xs text-[#A9A095]">
              <li>
                <Link href="/about" className="hover:text-[#F7F2E9] transition-colors">
                  Our Philosophy & Story
                </Link>
              </li>
              <li>
                <Link href="/about#team" className="hover:text-[#F7F2E9] transition-colors">
                  Kitchen Leadership
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[#F7F2E9] transition-colors">
                  The Hearth Journal
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#F7F2E9] transition-colors">
                  Visual Archive
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#F7F2E9] transition-colors">
                  Guest Portal & Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Hours */}
          <div className="space-y-4">
            <span className="label-caps text-[#C86E45] block">Location & Hours</span>
            <div className="space-y-3 text-xs text-[#A9A095]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C86E45] shrink-0 mt-0.5" />
                <span>No. 42, Khader Nawaz Khan Road, Nungambakkam, Chennai, Tamil Nadu 600006</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C86E45] shrink-0" />
                <span>+91 44 4890 5500 / +91 98400 33400</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C86E45] shrink-0" />
                <span>reservations@emberahouse.in</span>
              </div>
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#D3B98D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#F7F2E9]">Lunch: Tue–Sun 12:00–15:30</p>
                  <p className="text-[#F7F2E9]">Dinner: Mon–Sun 18:30–23:30</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A9A095]">
          <div>
            © {currentYear} EMBERA HOUSE PRIVATE LIMITED. All rights reserved. Handcrafted Chennai Fine Dining.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-[#F7F2E9] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#F7F2E9] transition-colors">
              Terms & Cancellation Policy
            </Link>
            <Link href="/contact" className="hover:text-[#F7F2E9] transition-colors">
              Concierge Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
