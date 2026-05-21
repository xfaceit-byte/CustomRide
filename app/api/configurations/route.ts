import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";

  const configurations = await prisma.userConfiguration.findMany({
    where: isAdmin ? undefined : { userId: session.user.id },
    include: {
      user: isAdmin ? { select: { name: true, email: true } } : false,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(configurations);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Trebuie să fii autentificat." },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { carBrand, carModel, carYear, carBasePrice, modifications, totalPrice } =
    body;

  if (
    !carBrand ||
    !carModel ||
    !carYear ||
    carBasePrice === undefined ||
    !Array.isArray(modifications) ||
    totalPrice === undefined
  ) {
    return NextResponse.json(
      { error: "Configurația este incompletă." },
      { status: 400 },
    );
  }

  const configuration = await prisma.userConfiguration.create({
    data: {
      userId: session.user.id,
      carBrand: String(carBrand),
      carModel: String(carModel),
      carYear: Number(carYear),
      carBasePrice: Number(carBasePrice),
      modifications,
      totalPrice: Number(totalPrice),
    },
  });

  return NextResponse.json(configuration);
}
