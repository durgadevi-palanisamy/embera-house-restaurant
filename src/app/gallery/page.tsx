import prisma from "@/lib/prisma";
import GalleryExplorer from "@/components/gallery/GalleryExplorer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Gallery & Atmosphere",
  description:
    "Explore the visual archive of Embera House: open-fire cooking, dining room design, culinary plating, and wine cellar moments in Mayfair.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="label-caps text-[#C86E45] block">Visual Archive</span>
          <h1 className="hero-title text-[#F7F2E9]">
            The Visual <span className="italic font-light text-[#D3B98D]">Gallery.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed">
            Glimpses into our hearth, dining salons, seasonal ingredients, and intimate Mayfair moments.
          </p>
        </div>

        <GalleryExplorer items={images} />
      </div>
    </div>
  );
}
