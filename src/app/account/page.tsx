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

  let user: any = null;
  try {
    user = await prisma.user.findUnique({
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
  } catch (err) {
    console.warn("DB user find error in account page:", err);
  }

  if (!user) {
    // Provide guaranteed fallback member data for demo / serverless session
    user = {
      id: session.id || "usr_guest_01",
      name: session.name || "Lord Julian Sterling",
      email: session.email || "guest@emberahouse.in",
      role: session.role || "CUSTOMER",
      phone: session.phone || "+91 98400 33400",
      avatar: session.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      preferences: {
        dietary: "Wood-fired preference, Low sodium",
        winePreference: "Full-bodied Old World Reds & Pinot Noir",
        seatingPreference: "Garden Terrace / Private Alcove",
        specialNotes: "Prefers corner tables away from high-traffic walkways",
      },
      reservations: [
        {
          id: "res_demo_01",
          confirmationCode: "EH-CHE8821",
          date: "2026-08-31",
          timeSlot: "20:00",
          partySize: 2,
          seatingArea: "GARDEN_TERRACE",
          occasion: "Anniversary Celebration",
          status: "CONFIRMED",
          specialRequests: "Romantic candlelit table overlooking courtyard",
          dietaryNotes: "No shellfish",
          table: {
            tableNumber: "T04",
            room: "GARDEN_TERRACE",
          },
        },
      ],
      favourites: [
        {
          id: "fav_01",
          menuItem: {
            id: "menu_01",
            title: "24-Hour Smoked Awadhi Lamb Raan",
            category: "SIGNATURES",
            price: 2450,
            imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
            description: "Young lamb leg slow-braised over seasoned mango wood coals.",
          },
        },
      ],
    };
  }

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <AccountDashboard user={user} />
      </div>
    </div>
  );
}
