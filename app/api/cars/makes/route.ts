import { NextResponse } from "next/server";
import { BRANDS } from "@/lib/brands";

export function GET() {
  return NextResponse.json(
    BRANDS.map(({ slug, name, tier }) => ({ slug, name, tier })),
  );
}
