import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  DashboardClient,
  type DashboardConfig,
} from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const configurations = await prisma.userConfiguration.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized: DashboardConfig[] = configurations.map((c) => ({
    id: c.id,
    totalPrice: c.totalPrice,
    createdAt: c.createdAt.toISOString(),
    modifications: (c.modifications as DashboardConfig["modifications"]) ?? [],
    carBrand: c.carBrand,
    carModel: c.carModel,
    carYear: c.carYear,
    carBasePrice: c.carBasePrice,
  }));

  return <DashboardClient initialConfigs={serialized} />;
}
