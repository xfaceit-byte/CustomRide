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
      car: true,
      user: isAdmin ? { select: { name: true, email: true } } : false,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(configurations);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Trebuie să fii autentificat." }, { status: 401 });
  }

  const body = await request.json();
  const { carId, modifications, totalPrice } = body;

  if (!carId || !modifications || totalPrice === undefined) {
    return NextResponse.json(
      { error: "Configurația este incompletă." },
      { status: 400 },
    );
  }

  const configuration = await prisma.userConfiguration.create({
    data: {
      userId: session.user.id,
      carId,
      modifications,
      totalPrice: Number(totalPrice),
    },
    include: { car: true },
  });

  return NextResponse.json(configuration);
}
