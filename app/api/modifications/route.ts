import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const modifications = await prisma.modification.findMany({
    include: { category: true },
    orderBy: [{ category: { name: "asc" } }, { price: "asc" }],
  });
  return NextResponse.json(modifications);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces interzis." }, { status: 403 });
  }

  const body = await request.json();
  const { name, price, description, imageUrl, categoryId } = body;

  if (!name || price === undefined || !categoryId) {
    return NextResponse.json(
      { error: "Date incomplete pentru modificare." },
      { status: 400 },
    );
  }

  const modification = await prisma.modification.create({
    data: {
      name,
      price: Number(price),
      description: description || null,
      imageUrl: imageUrl || null,
      categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json(modification);
}
