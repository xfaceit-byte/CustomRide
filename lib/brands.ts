export type BrandTier = "premium" | "standard" | "budget";

export type Brand = {
  slug: string;
  name: string;
  apiName: string;
  tier: BrandTier;
};

export const BRANDS: Brand[] = [
  { slug: "audi", name: "Audi", apiName: "audi", tier: "premium" },
  { slug: "bmw", name: "BMW", apiName: "bmw", tier: "premium" },
  { slug: "mercedes-benz", name: "Mercedes-Benz", apiName: "mercedes-benz", tier: "premium" },
  { slug: "porsche", name: "Porsche", apiName: "porsche", tier: "premium" },
  { slug: "volvo", name: "Volvo", apiName: "volvo", tier: "premium" },
  { slug: "lexus", name: "Lexus", apiName: "lexus", tier: "premium" },
  { slug: "volkswagen", name: "Volkswagen", apiName: "volkswagen", tier: "standard" },
  { slug: "toyota", name: "Toyota", apiName: "toyota", tier: "standard" },
  { slug: "honda", name: "Honda", apiName: "honda", tier: "standard" },
  { slug: "mazda", name: "Mazda", apiName: "mazda", tier: "standard" },
  { slug: "ford", name: "Ford", apiName: "ford", tier: "standard" },
  { slug: "nissan", name: "Nissan", apiName: "nissan", tier: "standard" },
  { slug: "hyundai", name: "Hyundai", apiName: "hyundai", tier: "budget" },
  { slug: "kia", name: "Kia", apiName: "kia", tier: "budget" },
  { slug: "skoda", name: "Skoda", apiName: "skoda", tier: "budget" },
];

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
