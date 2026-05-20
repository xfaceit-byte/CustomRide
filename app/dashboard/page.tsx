import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const configurations = await prisma.userConfiguration.findMany({
    where: { userId: session.user.id },
    include: { car: true },
    orderBy: { createdAt: "desc" },
  });

  const serialized = configurations.map((c) => ({
    id: c.id,
    totalPrice: c.totalPrice,
    createdAt: c.createdAt.toISOString(),
    modifications: c.modifications as {
      id: string;
      name: string;
      price: number;
    }[],
    car: c.car,
  }));

  return <DashboardClient initialConfigs={serialized} />;
}
