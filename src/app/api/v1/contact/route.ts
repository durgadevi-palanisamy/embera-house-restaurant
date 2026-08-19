import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactAcknowledgementEmail } from "@/lib/email";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  enquiryType: z.string().default("GENERAL"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: parsed.error.issues[0]?.message || "Invalid contact form input." },
        },
        { status: 400 }
      );
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        enquiryType: parsed.data.enquiryType,
        message: parsed.data.message,
        status: "UNREAD",
      },
    });

    sendContactAcknowledgementEmail(
      parsed.data.name,
      parsed.data.email,
      parsed.data.enquiryType
    ).catch((err) => console.error("Contact ack error:", err));

    return NextResponse.json({
      success: true,
      enquiry,
      message: "Thank you. Your message has been received by our concierge team.",
    });
  } catch (error: any) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Unable to submit enquiry at this time." },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const enquiries = await prisma.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Failed to load enquiries." } }, { status: 500 });
  }
}
