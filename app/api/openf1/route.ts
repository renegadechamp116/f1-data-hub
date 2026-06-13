import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Build the OpenF1 URL from query params
  const path = searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }

  // Remove 'path' from params and pass the rest to OpenF1
  const params = new URLSearchParams(searchParams);
  params.delete("path");

  const url = `https://api.openf1.org/v1/${path}?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "OpenF1 error" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}