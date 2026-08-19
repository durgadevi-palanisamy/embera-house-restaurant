import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const partySize = parseInt(searchParams.get("partySize") || "2", 10);
    const seatingArea = searchParams.get("seatingArea") || "NO_PREFERENCE";

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "MISSING_DATE", message: "Date parameter is required (YYYY-MM-DD)." },
        },
        { status: 400 }
      );
    }

    const availability = await getAvailableSlots(date, partySize, seatingArea);

    return NextResponse.json({
      success: true,
      data: availability,
    });
  } catch (error: any) {
    console.error("Availability calculation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "CALCULATION_ERROR", message: "Failed to calculate slot availability." },
      },
      { status: 500 }
    );
  }
}
