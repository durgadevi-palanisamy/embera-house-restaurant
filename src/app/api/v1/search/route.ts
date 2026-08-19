import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
      return NextResponse.json({ success: true, results: [] });
    }

    const [dishes, events, posts] = await Promise.all([
      prisma.menuItem.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { ingredients: { contains: q } },
          ],
        },
        take: 4,
      }),
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { description: { contains: q } },
          ],
          isPublished: true,
        },
        take: 3,
      }),
      prisma.journalPost.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { excerpt: { contains: q } },
            { tags: { contains: q } },
          ],
          isPublished: true,
        },
        take: 3,
      }),
    ]);

    const results = [
      ...dishes.map((d) => ({
        type: "dish" as const,
        title: d.name,
        subtitle: `£${d.price} • ${d.description.slice(0, 70)}...`,
        url: `/menu/${d.slug}`,
      })),
      ...events.map((e) => ({
        type: "event" as const,
        title: e.title,
        subtitle: `${e.date} at ${e.time} • ${e.excerpt.slice(0, 60)}...`,
        url: `/events/${e.slug}`,
      })),
      ...posts.map((p) => ({
        type: "journal" as const,
        title: p.title,
        subtitle: `${p.readingTimeMinutes} min read • ${p.excerpt.slice(0, 60)}...`,
        url: `/journal/${p.slug}`,
      })),
    ];

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Failed to perform search." } },
      { status: 500 }
    );
  }
}
