import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cars = await prisma.car.findMany({
    orderBy: { basePrice: "asc" },
  });
  return NextResponse.json(cars);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces interzis." }, { status: 403 });
  }

  const body = await request.json();
  const { brand, model, year, basePrice, imageUrl } = body;

  if (!brand || !model || !year || basePrice === undefined) {
    return NextResponse.json(
      { error: "Date incomplete pentru mașină." },
      { status: 400 },
    );
  }

  const car = await prisma.car.create({
    data: {
      brand,
      model,
      year: Number(year),
      basePrice: Number(basePrice),
      imageUrl: imageUrl || null,
    },
  });

  return NextResponse.json(car);
}
