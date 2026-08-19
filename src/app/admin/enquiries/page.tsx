import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Mail, MessageSquare, CheckCircle2, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest Enquiries & Newsletter | Embera Admin",
};

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const [enquiries, subscribers] = await Promise.all([
    prisma.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <span className="label-caps text-[#C86E45] block mb-1">Communication Hub</span>
        <h1 className="font-editorial text-4xl text-[#F7F2E9]">
          Enquiries & <span className="italic font-light text-[#D3B98D]">Dispatch.</span>
        </h1>
      </div>

      {/* Enquiries Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-2xl text-[#F7F2E9]">
            Guest Enquiries ({enquiries.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-6 bg-[#191714] border border-white/10 space-y-4 relative"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="label-caps text-[#C86E45] block text-[9px]">
                    {enq.enquiryType}
                  </span>
                  <h4 className="font-editorial text-xl text-[#F7F2E9]">{enq.name}</h4>
                  <span className="text-xs text-[#A9A095] block">{enq.email}</span>
                  {enq.phone && (
                    <span className="text-[11px] text-[#A9A095]">{enq.phone}</span>
                  )}
                </div>
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider bg-white/10 text-white/80">
                  {enq.status}
                </span>
              </div>

              <p className="text-xs text-[#F7F2E9]/90 bg-[#11100E] p-4 border border-white/5 leading-relaxed">
                {enq.message}
              </p>

              <span className="text-[10px] text-[#A9A095] block">
                Received on {formatDate(enq.createdAt.toISOString())}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Subscribers Section */}
      <div className="p-8 bg-[#191714] border border-white/10 space-y-6">
        <div>
          <h2 className="font-editorial text-2xl text-[#F7F2E9]">
            Newsletter Registry ({subscribers.length} Patrons)
          </h2>
          <p className="text-xs text-[#A9A095]">
            Verified email addresses subscribed to the occasional culinary dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {subscribers.map((sub) => (
            <div
              key={sub.id}
              className="p-3 bg-[#11100E] border border-white/5 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C86E45]" />
                <span className="text-[#F7F2E9] truncate">{sub.email}</span>
              </div>
              <span className="text-[9px] text-[#778064] uppercase font-semibold">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
