import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      modifications: {
        orderBy: { price: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(categories);
}
