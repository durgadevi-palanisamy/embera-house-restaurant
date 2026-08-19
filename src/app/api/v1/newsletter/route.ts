import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Please provide a valid email address."),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: parsed.error.issues[0]?.message || "Invalid email." },
        },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
        return NextResponse.json({
          success: true,
          message: "Welcome back! Your subscription has been reactivated.",
        });
      }
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to the Embera House dispatch.",
      });
    }

    await prisma.newsletterSubscriber.create({
      data: { email, isActive: true },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing. You have been added to our guest registry.",
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Unable to process subscription at this time." },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: "desc" },
    });
    return NextResponse.json({ success: true, count: subscribers.length, subscribers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: { message: "Failed to load subscribers." } }, { status: 500 });
  }
}
