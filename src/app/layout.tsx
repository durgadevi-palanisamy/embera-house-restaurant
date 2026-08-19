import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "EMBERA HOUSE | Fire. Flavour. Moments. | Mumbai",
    template: "%s | EMBERA HOUSE",
  },
  description:
    "An ode to ancestral wood-fired craftsmanship, heirloom Indian botanicals, and coastal charcoal embers. Reserve a table at Embera House Mumbai for an unforgettable luxury dining experience.",
  keywords: [
    "Embera House",
    "Mumbai fine dining",
    "wood-fired restaurant Mumbai",
    "Lower Parel restaurants",
    "progressive Indian cuisine",
    "luxury dining India",
  ],
  authors: [{ name: "Chef Mateo Vane" }],
  openGraph: {
    title: "EMBERA HOUSE — Mumbai",
    description:
      "Ancestral wood-fired cooking, heirloom botanicals and thoughtful hospitality in the heart of Lower Parel, Mumbai.",
    url: "https://emberahouse.com",
    siteName: "EMBERA HOUSE",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Embera House",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Block 4, The Mills, Senapati Bapat Marg",
      addressLocality: "Lower Parel",
      addressRegion: "Mumbai, Maharashtra",
      postalCode: "400013",
      addressCountry: "IN",
    },
    telephone: "+912267894400",
    servesCuisine: ["Progressive Indian", "Wood-Fired Gastronomy", "Seasonal Fine Dining"],
    priceRange: "₹₹₹₹",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "12:00",
        closes: "15:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "17:30",
        closes: "00:00",
      },
    ],
    acceptsReservations: "True",
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#11100E] text-[#F7F2E9] antialiased selection:bg-[#C86E45] selection:text-[#F7F2E9]">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
