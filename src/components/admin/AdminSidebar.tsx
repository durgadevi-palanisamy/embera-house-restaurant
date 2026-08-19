"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Utensils,
  Grid,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Users,
  Settings,
  Flame,
  ArrowLeft,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/reservations", label: "Reservations", icon: Calendar },
    { href: "/admin/menu", label: "Menu & Dishes", icon: Utensils },
    { href: "/admin/tables", label: "Table Layout", icon: Grid },
    { href: "/admin/enquiries", label: "Enquiries & Dispatch", icon: Mail },
  ];

  return (
    <aside className="w-64 bg-[#191714] border-r border-white/10 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Admin Brand Header */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-[#C86E45]" />
            <div>
              <span className="font-editorial text-xl font-medium tracking-wide text-[#F7F2E9] block">
                EMBERA HOUSE
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#D3B98D] font-semibold">
                Control Console
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5">
          <span className="label-caps text-[#A9A095] px-3 block text-[10px] mb-2">Management</span>
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-sm transition-all ${
                  isActive
                    ? "bg-[#C86E45] text-[#F7F2E9] shadow-md"
                    : "text-[#A9A095] hover:text-[#F7F2E9] hover:bg-[#24201C]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation Back to Site */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-[#A9A095] hover:text-[#F7F2E9] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </Link>
      </div>
    </aside>
  );
}
