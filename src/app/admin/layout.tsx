import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MANAGER")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#11100E] text-[#F7F2E9]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminTopbar user={session} />
        <main className="p-6 sm:p-8 lg:p-10 flex-1">{children}</main>
      </div>
    </div>
  );
}
