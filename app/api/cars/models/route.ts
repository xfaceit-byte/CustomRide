import { NextResponse } from "next/server";
import { getBrand } from "@/lib/brands";

type NhtsaResponse = {
  Results: Array<{ Model_Name: string }>;
};

export const revalidate = 86400;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandSlug = searchParams.get("brand");

  if (!brandSlug) {
    return NextResponse.json(
      { error: "Brandul este obligatoriu." },
      { status: 400 },
    );
  }

  const brand = getBrand(brandSlug);
  if (!brand) {
    return NextResponse.json(
      { error: "Brandul nu a fost găsit." },
      { status: 404 },
    );
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(
        brand.apiName,
      )}?format=json`,
      { next: { revalidate: 86400 } },
    );

    if (!res.ok) {
      throw new Error("Eroare la sursa de date.");
    }

    const data: NhtsaResponse = await res.json();

    const motorcyclePattern =
      /^(F|R|K|G|S|C|HP)[\s-]?\d{2,4}/i;

    const models = Array.from(
      new Set(
        data.Results.map((r) => r.Model_Name.trim()).filter(
          (name) =>
            name.length > 0 &&
            !motorcyclePattern.test(name) &&
            !/sport\s?bike|motorcycle|scooter/i.test(name),
        ),
      ),
    ).sort((a, b) => a.localeCompare(b, "ro"));

    return NextResponse.json({ brand: brand.name, models });
  } catch {
    return NextResponse.json(
      { error: "Nu am putut încărca modelele. Încearcă din nou." },
      { status: 502 },
    );
  }
}
