import { ConfiguratorClient } from "@/components/configurator/configurator-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConfiguratorPage() {
  const [cars, categories] = await Promise.all([
    prisma.car.findMany({ orderBy: { basePrice: "asc" } }),
    prisma.category.findMany({
      include: {
        modifications: { orderBy: { price: "asc" } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return <ConfiguratorClient cars={cars} categories={categories} />;
}
