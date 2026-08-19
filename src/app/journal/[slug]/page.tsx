import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatShortDate } from "@/lib/utils";
import { BookOpen, Clock, ArrowLeft, ArrowRight, Share2, Calendar } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await prisma.journalPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | Embera House Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default async function JournalDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.journalPost.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!post) notFound();

  const relatedPosts = await prisma.journalPost.findMany({
    where: {
      categoryId: post.categoryId,
      id: { not: post.id },
      isPublished: true,
    },
    include: { category: true },
    take: 2,
  });

  return (
    <div className="pt-32 pb-28 bg-[#11100E] min-h-screen text-[#F7F2E9]">
      <article className="max-w-4xl mx-auto px-5 sm:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#A9A095] mb-8">
          <Link href="/journal" className="hover:text-[#F7F2E9] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
          </Link>
          <span>/</span>
          <span className="text-[#C86E45]">{post.category?.name}</span>
        </div>

        {/* Title Header */}
        <div className="space-y-6 mb-10">
          <span className="label-caps text-[#C86E45] block">
            {post.category?.name} • {post.readingTimeMinutes} Min Read
          </span>
          <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl text-[#F7F2E9] leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between border-y border-white/10 py-4 text-xs text-[#A9A095]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-[#24201C] relative border border-white/10">
                {post.authorAvatar && (
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <span className="block font-medium text-[#F7F2E9]">{post.authorName}</span>
                <span className="text-[11px] text-[#A9A095]">{post.authorRole}</span>
              </div>
            </div>
            <span>Published {formatShortDate(post.publishedAt.toISOString())}</span>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#191714] border border-white/10 mb-12 shadow-2xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Rich Article Prose */}
        <div className="prose prose-invert max-w-none space-y-6 text-sm sm:text-base text-[#F7F2E9]/90 font-normal leading-relaxed">
          {post.content.split("\n\n").map((para, idx) => {
            if (para.startsWith("### ")) {
              return (
                <h3
                  key={idx}
                  className="font-editorial text-2xl sm:text-3xl text-[#F7F2E9] font-medium pt-4 pb-1"
                >
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("> ")) {
              return (
                <blockquote
                  key={idx}
                  className="p-6 bg-[#191714] border-l-2 border-[#C86E45] font-editorial text-xl italic text-[#D3B98D] my-6"
                >
                  {para.replace("> ", "")}
                </blockquote>
              );
            }
            return <p key={idx}>{para}</p>;
          })}
        </div>

        {/* Article Footer & Reservation CTA */}
        <div className="mt-16 pt-8 border-t border-white/10 p-8 bg-[#191714] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-editorial text-2xl text-[#F7F2E9]">Taste the Philosophy</h4>
            <p className="text-xs text-[#A9A095] mt-1">
              Join us at the hearth and experience these flavours firsthand.
            </p>
          </div>
          <Link href="/reserve" className="btn-terracotta text-xs shrink-0">
            <Calendar className="w-4 h-4" />
            <span>Reserve a Table</span>
          </Link>
        </div>

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 space-y-8">
            <h3 className="font-editorial text-3xl text-[#F7F2E9]">
              More from the <span className="italic font-light text-[#D3B98D]">Hearth.</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/journal/${rel.slug}`}
                  className="group p-6 bg-[#191714] border border-white/5 hover:border-[#C86E45]/40 transition-all space-y-3"
                >
                  <span className="label-caps text-[#C86E45] block text-[10px]">
                    {rel.category?.name}
                  </span>
                  <h4 className="font-editorial text-xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-[#A9A095] line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
