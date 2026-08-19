"use client";

import { useRouter } from "next/navigation";
import { LogOut, Bell, Shield } from "lucide-react";

export default function AdminTopbar({
  user,
}: {
  user: { name: string; email: string; role: string };
}) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Admin logout error:", err);
    }
  };

  return (
    <header className="h-16 bg-[#191714] border-b border-white/10 px-8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#C86E45]/20 text-[#C86E45] border border-[#C86E45]/30">
          {user.role.replace("_", " ")}
        </span>
        <span className="text-xs text-[#A9A095] hidden sm:inline">
          Live Restaurant Operations
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <span className="text-xs font-medium text-[#F7F2E9] block">{user.name}</span>
          <span className="text-[10px] text-[#A9A095]">{user.email}</span>
        </div>

        <button
          onClick={handleLogout}
          title="Sign Out"
          className="p-2 text-[#A9A095] hover:text-[#F7F2E9] hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
