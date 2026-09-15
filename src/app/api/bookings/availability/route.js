import { NextResponse } from "next/server";
import { getSlotAvailabilityForDate } from "@/lib/bookingService";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date query parameter is required (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const availability = await getSlotAvailabilityForDate(date);

    return NextResponse.json({
      success: true,
      date,
      ...availability,
    });
  } catch (err) {
    console.error("Availability API error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve slot availability", details: err.message },
      { status: 500 }
    );
  }
}
