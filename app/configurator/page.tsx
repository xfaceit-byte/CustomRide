import { ConfiguratorClient } from "@/components/configurator/configurator-client";
import { prisma } from "@/lib/prisma";
import { BRANDS } from "@/lib/brands";

export const dynamic = "force-dynamic";

export default async function ConfiguratorPage() {
  const categories = await prisma.category.findMany({
    include: {
      modifications: { orderBy: { price: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  const brands = BRANDS.map(({ slug, name, tier }) => ({ slug, name, tier }));

  return <ConfiguratorClient brands={brands} categories={categories} />;
}
