import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency, formatShortDate } from "@/lib/utils";
import Hero from "@/components/home/Hero";
import Philosophy from "@/components/home/Philosophy";
import MenuTabs from "@/components/home/MenuTabs";
import GallerySection from "@/components/home/GallerySection";
import Testimonials from "@/components/home/Testimonials";
import NewsletterForm from "@/components/home/NewsletterForm";
import {
  Calendar,
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  MapPin,
  Phone,
  Check,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  // Fetch dynamic content from Prisma
  const [signatureDishes, categories, experiences, events, galleryImages, journalPosts] =
    await Promise.all([
      // Signature Dishes (top 6)
      prisma.menuItem.findMany({
        where: { isSignature: true, isAvailable: true },
        take: 6,
        include: { category: true },
      }),
      // Menu categories with items for interactive tabs
      prisma.menuCategory.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        take: 6,
        include: {
          items: {
            where: { isAvailable: true },
            take: 4,
          },
        },
      }),
      // Experiences list
      [
        {
          title: "Main Dining Room",
          subtitle: "Intimate, atmospheric sanctuary bathed in amber light.",
          description:
            "Reclaimed dark oak tables, Italian bronze fixtures, and sightlines to the open hearth pass. Ideal for memorable dinners and celebrations.",
          imageUrl:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
          link: "/experience#main-dining",
        },
        {
          title: "The Garden Terrace",
          subtitle: "Heated botanical alfresco dining surrounded by aromatic herbs.",
          description:
            "A secluded Mayfair courtyard with retractable glass canopy and custom wood-burning chimineas for all seasons.",
          imageUrl:
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85",
          link: "/experience#terrace",
        },
        {
          title: "Chef's Hearth Counter",
          subtitle: "Front-row culinary theatre directly before glowing embers.",
          description:
            "An exclusive 8-seat tasting counter where Executive Chef Mateo Vane curates a bespoke multi-course journey.",
          imageUrl:
            "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
          link: "/experience#chefs-table",
        },
        {
          title: "The Private Dining Salon",
          subtitle: "Exclusive secluded chamber for up to 16 guests.",
          description:
            "Custom mahogany table, dedicated sommelier service, private hearth grill, and tailored bespoke menus.",
          imageUrl:
            "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
          link: "/experience#private-dining",
        },
      ],
      // Upcoming events (4)
      prisma.event.findMany({
        where: { isPublished: true },
        orderBy: { date: "asc" },
        take: 4,
      }),
      // Gallery images (6 for homepage)
      prisma.galleryImage.findMany({
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
      // Recent Journal articles (3)
      prisma.journalPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
        include: { category: true },
      }),
    ]);

  return (
    <div className="flex flex-col bg-[#11100E] text-[#F7F2E9]">
      {/* SECTION 1: HERO */}
      <Hero />

      {/* SECTION 2: INTRODUCTION */}
      <section id="about" className="py-28 bg-[#11100E] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Editorial Copy */}
            <div className="lg:col-span-6 space-y-6">
              <span className="label-caps text-[#C86E45] block">Welcome to Embera House</span>
              <h2 className="section-title text-[#F7F2E9]">
                Cooking inspired by <br />
                <span className="italic font-light text-[#D3B98D]">season, terroir</span> and wood-fire.
              </h2>
              <p className="text-base sm:text-lg text-[#A9A095] leading-relaxed font-normal">
                Conceived as a sanctuary of gastronomic warmth on Khader Nawaz Khan Road, Nungambakkam, Embera House unites ancestral wood-fired techniques with the finest biodynamic harvests across India.
              </p>
              <p className="text-sm text-[#A9A095] leading-relaxed">
                From coal-roasted Malabar scallops kissed by sweet tamarind and curry leaf to slow-fire Awadhi raan and smoked Kashmiri morels, every course reflects deep reverence for raw ingredients, honest craftsmanship, and gracious South Indian hospitality.
              </p>
              <div className="pt-4 flex items-center gap-6">
                <Link href="/about" className="btn-terracotta text-xs">
                  <span>Discover Our Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <div className="text-xs text-[#A9A095]">
                  <span className="block font-semibold text-[#F7F2E9]">Chef Mateo Vane</span>
                  Executive Chef & Founder
                </div>
              </div>
            </div>

            {/* Asymmetrical Overlapping Images */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] w-4/5 overflow-hidden border border-white/10 shadow-2xl ml-auto">
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85"
                  alt="Embera kitchen hearth"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-4 sm:left-0 w-3/5 aspect-square overflow-hidden border-2 border-[#191714] shadow-2xl z-10 hidden sm:block">
                <Image
                  src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=85"
                  alt="Chalk stream trout plating"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SIGNATURE DISHES */}
      <section id="menu" className="py-28 bg-[#191714] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="label-caps text-[#C86E45] block mb-3">Culinary Highlights</span>
              <h2 className="section-title text-[#F7F2E9]">
                Signature <span className="italic font-light text-[#D3B98D]">Creations.</span>
              </h2>
            </div>
            <Link href="/menu" className="btn-outline-luxury text-xs flex items-center gap-2">
              <span>View Full Menu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Asymmetric 6-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {signatureDishes.map((dish) => {
              const flags = dish.dietaryFlags
                ? dish.dietaryFlags.split(",").map((f) => f.trim()).filter(Boolean)
                : [];

              return (
                <Link
                  key={dish.id}
                  href={`/menu/${dish.slug}`}
                  className="group flex flex-col bg-[#11100E] border border-white/5 hover:border-[#C86E45]/40 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#24201C]">
                    {dish.imageUrl ? (
                      <Image
                        src={dish.imageUrl}
                        alt={dish.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#A9A095]">
                        <Flame className="w-8 h-8 text-[#C86E45]" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {dish.isChefPick && (
                        <span className="px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold bg-[#11100E]/90 text-[#D3B98D] border border-white/10 backdrop-blur-md">
                          Chef&apos;s Pick
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#11100E]/90 backdrop-blur-md text-[#C86E45] font-editorial text-lg font-medium border border-white/10">
                      {formatCurrency(dish.price)}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="label-caps text-[#A9A095] block mb-1">
                        {dish.category?.name || "Hearth Dish"}
                      </span>
                      <h3 className="font-editorial text-2xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors mb-2">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-[#A9A095] leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                      <div className="flex gap-1.5">
                        {flags.slice(0, 2).map((f) => (
                          <span
                            key={f}
                            className="text-[9px] uppercase tracking-wider text-[#A9A095] bg-[#191714] px-2 py-0.5"
                          >
                            {f.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[#C86E45] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: OUR PHILOSOPHY */}
      <div id="philosophy">
        <Philosophy />
      </div>

      {/* SECTION 5: MENU PREVIEW (INTERACTIVE TABS) */}
      <MenuTabs categories={categories} />

      {/* SECTION 6: DINING EXPERIENCES */}
      <section id="experience" className="py-28 bg-[#11100E] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="label-caps text-[#C86E45] block mb-3">Our Spaces</span>
            <h2 className="section-title text-[#F7F2E9]">
              Dining <span className="italic font-light text-[#D3B98D]">Experiences.</span>
            </h2>
            <p className="text-sm text-[#A9A095] mt-4 leading-relaxed">
              Each room at Embera House has been deliberately designed to evoke a distinct mood, from intimate hearthside tables to private dining salons in Nungambakkam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((exp) => (
              <div
                key={exp.title}
                className="group relative bg-[#191714] border border-white/5 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={exp.imageUrl}
                    alt={exp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#191714] via-transparent to-transparent" />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between -mt-6 relative z-10">
                  <div>
                    <span className="label-caps text-[#C86E45] block mb-2">{exp.subtitle}</span>
                    <h3 className="font-editorial text-3xl text-[#F7F2E9] mb-3">{exp.title}</h3>
                    <p className="text-sm text-[#A9A095] leading-relaxed mb-6">
                      {exp.description}
                    </p>
                  </div>
                  <Link
                    href={exp.link}
                    className="btn-outline-luxury text-xs self-start flex items-center gap-2"
                  >
                    <span>Discover Space</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: CHEF STORY */}
      <section id="chef" className="py-28 bg-[#191714] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Chef Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85"
                  alt="Executive Chef Mateo Vane"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#11100E]/85 backdrop-blur-md border border-white/10">
                  <h4 className="font-editorial text-2xl text-[#F7F2E9]">Chef Mateo Vane</h4>
                  <p className="text-xs text-[#C86E45] uppercase tracking-wider font-semibold">
                    Executive Chef & Founder
                  </p>
                </div>
              </div>
            </div>

            {/* Chef Biography & Quote */}
            <div className="lg:col-span-7 space-y-6">
              <span className="label-caps text-[#C86E45] block">Culinary Leadership</span>
              <h2 className="section-title text-[#F7F2E9]">
                Cooking with <br />
                <span className="italic font-light text-[#D3B98D]">patience & intention.</span>
              </h2>
              <blockquote className="font-editorial text-xl sm:text-2xl text-[#D3B98D] italic border-l-2 border-[#C86E45] pl-6 my-6">
                &ldquo;Fire is unpredictable and alive. It forces you to cook with all five senses, paying total attention to the sound of sizzling charcoal and the fragrant aroma of seasoned wood.&rdquo;
              </blockquote>
              <p className="text-sm sm:text-base text-[#A9A095] leading-relaxed">
                Raised with deep appreciation for heritage culinary disciplines, Mateo Vane spent two decades mastering firecraft before establishing Embera House in Chennai. His approach strips away pretension, allowing the natural flavours of India&apos;s rich soil and seas to shine.
              </p>
              <p className="text-sm text-[#A9A095] leading-relaxed">
                Mateo works intimately with organic spice estates in the Western Ghats, artisanal coastal fishermen, and regional farmers, ensuring every dish honors sustainable biodiversity.
              </p>
              <div className="pt-4">
                <Link href="/about" className="btn-outline-luxury text-xs">
                  Meet the Kitchen Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: SEASONAL EXPERIENCE FEATURE */}
      <section id="tasting" className="py-28 bg-[#11100E] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="relative overflow-hidden bg-[#191714] border border-white/10 p-8 sm:p-12 lg:p-16">
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#C86E45]/10 blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C86E45]/20 text-[#C86E45] border border-[#C86E45]/30 text-xs font-semibold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> Limited Season Feature
                </div>
                <h2 className="section-title text-[#F7F2E9]">
                  Royal Fire <br />
                  <span className="italic font-light text-[#D3B98D]">Gastronomic Tasting.</span>
                </h2>
                <p className="text-sm sm:text-base text-[#A9A095] leading-relaxed">
                  A curated 7-course gastronomic progression celebrating charred Himalayan morels, coastal scallops in tamarind embers, 24-hour slow-cooked Awadhi raan, and hearth-smoked Mysore jaggery tart.
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div>
                    <span className="label-caps text-[#A9A095] block">7-Course Tasting</span>
                    <span className="font-editorial text-2xl text-[#C86E45] font-semibold">
                      ₹6,500 <span className="text-xs text-[#A9A095] font-sans">/ guest</span>
                    </span>
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div>
                    <span className="label-caps text-[#A9A095] block">Sommelier Pairing</span>
                    <span className="font-editorial text-2xl text-[#D3B98D] font-semibold">
                      ₹3,800 <span className="text-xs text-[#A9A095] font-sans">/ guest</span>
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Link href="/reserve" className="btn-terracotta text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reserve Tasting Table</span>
                  </Link>
                  <Link href="/menu" className="btn-outline-luxury text-xs">
                    <span>View Course Details</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative aspect-square overflow-hidden border border-white/10 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85"
                    alt="Gastronomic Tasting Feast"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: VISUAL GALLERY */}
      <div id="gallery">
        <GallerySection items={galleryImages} />
      </div>

      {/* SECTION 10: EVENTS */}
      <section id="events" className="py-28 bg-[#191714] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="label-caps text-[#C86E45] block mb-3">Special Evenings</span>
              <h2 className="section-title text-[#F7F2E9]">
                Upcoming <span className="italic font-light text-[#D3B98D]">Evenings.</span>
              </h2>
            </div>
            <Link href="/events" className="btn-outline-luxury text-xs flex items-center gap-2">
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group flex flex-col bg-[#11100E] border border-white/5 hover:border-[#C86E45]/40 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-[10px] uppercase tracking-wider text-[#D3B98D] border border-white/10">
                    {formatShortDate(event.date)}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#A9A095] flex items-center gap-1 mb-2">
                      <Clock className="w-3 h-3 text-[#C86E45]" />
                      {event.time} • {event.duration}
                    </span>
                    <h3 className="font-editorial text-xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-[#A9A095] line-clamp-2">{event.excerpt}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                    <span className="font-editorial text-lg text-[#C86E45]">
                      {event.price ? formatCurrency(event.price) : "Complimentary"}
                    </span>
                    <span className="text-xs text-[#F7F2E9] group-hover:text-[#C86E45] flex items-center gap-1 transition-colors">
                      Details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11: TESTIMONIALS */}
      <div id="testimonials">
        <Testimonials />
      </div>

      {/* SECTION 12: RESERVATION CTA */}
      <section id="reserve" className="py-28 bg-[#11100E] border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="relative bg-gradient-to-r from-[#24201C] via-[#191714] to-[#11100E] border border-white/10 p-8 sm:p-14 lg:p-20 text-center flex flex-col items-center">
            <span className="label-caps text-[#C86E45] block mb-3">Reservations</span>
            <h2 className="hero-title text-[#F7F2E9] mb-4">
              Your table is <span className="italic font-light text-[#D3B98D]">waiting.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#A9A095] max-w-xl mx-auto mb-10 leading-relaxed">
              Join us for an evening of seasonal food, warm hospitality and memorable conversation in Nungambakkam, Chennai.
            </p>

            <Link
              href="/reserve"
              className="btn-terracotta text-sm px-10 py-4 shadow-2xl flex items-center gap-2 mb-12"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Your Table</span>
            </Link>

            {/* Quick Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10 w-full max-w-3xl text-xs text-[#A9A095]">
              <div className="flex flex-col items-center gap-1">
                <MapPin className="w-4 h-4 text-[#C86E45]" />
                <span className="text-[#F7F2E9] font-medium">Nungambakkam, Chennai</span>
                <span>No. 42, Khader Nawaz Khan Rd, 600006</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Clock className="w-4 h-4 text-[#D3B98D]" />
                <span className="text-[#F7F2E9] font-medium">Service Hours</span>
                <span>Lunch 12:00–15:30 • Dinner 18:30–23:30</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Phone className="w-4 h-4 text-[#778064]" />
                <span className="text-[#F7F2E9] font-medium">Concierge Direct</span>
                <span>+91 44 4890 5500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: JOURNAL PREVIEW */}
      <section id="journal" className="py-28 bg-[#191714] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="label-caps text-[#C86E45] block mb-3">Stories & Terroir</span>
              <h2 className="section-title text-[#F7F2E9]">
                The Embera <span className="italic font-light text-[#D3B98D]">Journal.</span>
              </h2>
            </div>
            <Link href="/journal" className="btn-outline-luxury text-xs flex items-center gap-2">
              <span>Read All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journalPosts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="group flex flex-col bg-[#11100E] border border-white/5 hover:border-[#C86E45]/40 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
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
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#A9A095] flex items-center gap-1 mb-2">
                      <BookOpen className="w-3 h-3 text-[#C86E45]" />
                      {post.readingTimeMinutes} min read
                    </span>
                    <h3 className="font-editorial text-2xl text-[#F7F2E9] group-hover:text-[#D3B98D] transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#A9A095] leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-white/5 mt-6 flex items-center justify-between text-xs text-[#A9A095]">
                    <span>{post.authorName}</span>
                    <span className="text-[#C86E45] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Read Story <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 14: NEWSLETTER & CONTACT ANCHOR */}
      <div id="contact">
        <NewsletterForm />
      </div>
    </div>
  );
}
