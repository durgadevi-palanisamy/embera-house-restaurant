import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import AccountDashboard from "@/components/account/AccountDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Portal & Reservations | Embera House",
  description: "Manage your dining reservations, profile, and saved favourite dishes.",
};

export default async function AccountPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: {
      preferences: true,
      reservations: {
        orderBy: { date: "desc" },
        include: { table: true },
      },
      favourites: {
        include: { menuItem: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <AccountDashboard user={user} />
      </div>
    </div>
  );
}
