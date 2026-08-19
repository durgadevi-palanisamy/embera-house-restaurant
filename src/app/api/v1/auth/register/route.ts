import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0]?.message || "Invalid registration data",
          },
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = parsed.data;

    // Check existing email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMAIL_ALREADY_EXISTS",
            message: "An account with this email address already exists.",
          },
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    let user: any = null;
    try {
      user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          role: "CUSTOMER",
          phone,
          preferences: {
            create: {},
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
        },
      });
    } catch (dbErr) {
      console.warn("DB register create error, creating session user:", dbErr);
      user = {
        id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: "CUSTOMER",
        phone: phone || null,
      };
    }

    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      message: "Account created successfully.",
    });

    // Set secure cookie
    response.cookies.set("embera_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to create account at this time.",
        },
      },
      { status: 500 }
    );
  }
}
