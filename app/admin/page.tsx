import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminPanel } from "@/components/admin/admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [cars, modifications, categories, configurations] = await Promise.all([
    prisma.car.findMany({ orderBy: { brand: "asc" } }),
    prisma.modification.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.userConfiguration.findMany({
      include: {
        car: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminPanel
      initialCars={cars}
      initialModifications={modifications}
      initialCategories={categories}
      initialConfigurations={configurations.map((c) => ({
        id: c.id,
        totalPrice: c.totalPrice,
        createdAt: c.createdAt.toISOString(),
        modifications: c.modifications,
        car: c.car,
        user: c.user,
      }))}
    />
  );
}
