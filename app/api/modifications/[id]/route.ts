import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces interzis." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const modification = await prisma.modification.update({
    where: { id },
    data: {
      name: body.name,
      price: Number(body.price),
      description: body.description || null,
      imageUrl: body.imageUrl || null,
      categoryId: body.categoryId,
    },
    include: { category: true },
  });

  return NextResponse.json(modification);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acces interzis." }, { status: 403 });
  }

  const { id } = await params;
  await prisma.modification.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
