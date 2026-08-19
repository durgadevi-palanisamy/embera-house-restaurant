import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatShortDate } from "@/lib/utils";
import { BookOpen, Clock, ArrowRight, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Journal | Culinary Essays & Sourcing Notes",
  description:
    "Editorial essays on wood-fire gastronomy, British foraging, biodynamic viticulture, and behind-the-scenes craft at Embera House.",
};

export const revalidate = 60;

export default async function JournalPage() {
  const [posts, categories] = await Promise.all([
    prisma.journalPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      include: { category: true },
    }),
    prisma.journalCategory.findMany(),
  ]);

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="label-caps text-[#C86E45] block">Culinary Journal</span>
          <h1 className="hero-title text-[#F7F2E9]">
            The Embera <span className="italic font-light text-[#D3B98D]">Dispatch.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed">
            Essays on open flame, wild foraging, terroir, and the philosophies that shape our daily kitchen service.
          </p>
        </div>

        {/* Featured Editorial Banner */}
        {featuredPost && (
          <Link
            href={`/journal/${featuredPost.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#191714] border border-white/10 hover:border-[#C86E45]/40 transition-all p-6 sm:p-10 mb-20 shadow-2xl"
          >
            <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-[#24201C]">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md text-xs uppercase tracking-widest text-[#D3B98D]">
                Featured Article
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <span className="label-caps text-[#C86E45] block">
                {featuredPost.category?.name} • {featuredPost.readingTimeMinutes} min read
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-sm text-[#A9A095] leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-[#A9A095]">
                <span>By {featuredPost.authorName}</span>
                <span>•</span>
                <span>{formatShortDate(featuredPost.publishedAt.toISOString())}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/journal/${post.slug}`}
              className="group flex flex-col bg-[#191714] border border-white/5 hover:border-[#C86E45]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#24201C]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[9px] uppercase tracking-wider text-[#D3B98D]">
                  {post.category?.name}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] text-[#A9A095] flex items-center gap-1 mb-2">
                    <Clock className="w-3 h-3 text-[#C86E45]" />
                    {post.readingTimeMinutes} min read
                  </span>
                  <h3 className="font-editorial text-2xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-[#A9A095] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#A9A095]">
                  <span>{post.authorName}</span>
                  <span className="text-[#C86E45] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
