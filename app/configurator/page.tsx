import { getServerSession } from "next-auth";
import {
  ConfiguratorClient,
  type InitialConfig,
} from "@/components/configurator/configurator-client";
import { prisma } from "@/lib/prisma";
import { BRANDS } from "@/lib/brands";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ edit?: string }>;

export default async function ConfiguratorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { edit } = await searchParams;

  const categories = await prisma.category.findMany({
    include: {
      modifications: { orderBy: { price: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  const brands = BRANDS.map(({ slug, name, tier }) => ({ slug, name, tier }));

  let initialConfig: InitialConfig | null = null;

  if (edit) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      const config = await prisma.userConfiguration.findUnique({
        where: { id: edit },
      });
      if (
        config &&
        (session.user.role === "ADMIN" || config.userId === session.user.id)
      ) {
        const matchedBrand = BRANDS.find(
          (b) => b.name.toLowerCase() === config.carBrand.toLowerCase(),
        );
        if (matchedBrand) {
          initialConfig = {
            id: config.id,
            brandSlug: matchedBrand.slug,
            brandName: matchedBrand.name,
            model: config.carModel,
            year: config.carYear,
            basePrice: config.carBasePrice,
            modifications:
              (config.modifications as InitialConfig["modifications"]) ?? [],
          };
        }
      }
    }
  }

  return (
    <ConfiguratorClient
      brands={brands}
      categories={categories}
      initialConfig={initialConfig}
    />
  );
}
