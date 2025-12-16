import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const input = searchParams.get("input") || "";

    if (!input || input.length < 3) {
      return NextResponse.json({ predictions: [] }, { status: 200 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { predictions: [], error: "Missing Google Maps API key" },
        { status: 500 }
      );
    }

    const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=address&key=${apiKey}`;

    const res = await fetch(googleUrl);

    if (!res.ok) {
      const text = await res.text();
      console.error("Google Places API error:", res.status, text);
      return NextResponse.json(
        { predictions: [], error: "Failed to fetch suggestions" },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json(
      {
        predictions: data?.predictions || [],
        status: data?.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google Places proxy error:", error);
    return NextResponse.json(
      { predictions: [], error: "Unexpected server error" },
      { status: 500 }
    );
  }
}


