import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  const { id } = await params;
  const config = await prisma.userConfiguration.findUnique({ where: { id } });

  if (!config) {
    return NextResponse.json(
      { error: "Configurația nu a fost găsită." },
      { status: 404 },
    );
  }

  if (
    session.user.role !== "ADMIN" &&
    config.userId !== session.user.id
  ) {
    return NextResponse.json({ error: "Acces interzis." }, { status: 403 });
  }

  await prisma.userConfiguration.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
