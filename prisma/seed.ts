import bcrypt from "bcryptjs";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL lipsește din .env");
}

const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.userConfiguration.deleteMany();
  await prisma.modification.deleteMany();
  await prisma.category.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  const culori = await prisma.category.create({
    data: { name: "Culori", slug: "culori" },
  });

  const jante = await prisma.category.create({
    data: { name: "Jante", slug: "jante" },
  });

  const spoilere = await prisma.category.create({
    data: { name: "Spoilere", slug: "spoilere" },
  });

  const accesorii = await prisma.category.create({
    data: { name: "Accesorii", slug: "accesorii" },
  });

  await prisma.modification.createMany({
    data: [
      { name: "Alb Polar", price: 0, categoryId: culori.id },
      { name: "Negru Profund", price: 500, categoryId: culori.id },
      { name: "Roșu Tornado", price: 800, categoryId: culori.id },
      { name: "Albastru Metalic", price: 750, categoryId: culori.id },
      { name: "Gri Antracit", price: 600, categoryId: culori.id },
      {
        name: 'Jante OZ Racing 17"',
        price: 2400,
        categoryId: jante.id,
      },
      {
        name: 'Jante BBS CH-R 18"',
        price: 3800,
        categoryId: jante.id,
      },
      {
        name: 'Jante Rays Volk TE37 17"',
        price: 4200,
        categoryId: jante.id,
      },
      {
        name: 'Jante OEM Sport 16"',
        price: 1200,
        categoryId: jante.id,
      },
      {
        name: "Spoiler spate GTI",
        price: 1200,
        categoryId: spoilere.id,
      },
      { name: "Lip față RS", price: 900, categoryId: spoilere.id },
      {
        name: "Difuzor spate Carbon",
        price: 1800,
        categoryId: spoilere.id,
      },
      {
        name: "Eleron portbagaj",
        price: 1500,
        categoryId: spoilere.id,
      },
      {
        name: "Foliere totală",
        price: 3500,
        categoryId: accesorii.id,
      },
      {
        name: "Faruri LED Matrix",
        price: 1800,
        categoryId: accesorii.id,
      },
      { name: "Praguri laterale", price: 700, categoryId: accesorii.id },
      {
        name: "Sistem evacuare sport",
        price: 2200,
        categoryId: accesorii.id,
      },
      { name: "Geamuri fumurii", price: 850, categoryId: accesorii.id },
      { name: "Volan sport", price: 1100, categoryId: accesorii.id },
    ],
  });

  await prisma.car.createMany({
    data: [
      {
        brand: "Volkswagen",
        model: "Golf 7",
        year: 2018,
        basePrice: 12000,
        imageUrl:
          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      },
      {
        brand: "BMW",
        model: "Seria 3 (F30)",
        year: 2019,
        basePrice: 18000,
        imageUrl:
          "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      },
      {
        brand: "Audi",
        model: "A4 B9",
        year: 2020,
        basePrice: 22000,
        imageUrl:
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      },
    ],
  });

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@customride.ro" },
    update: {},
    create: {
      email: "admin@customride.ro",
      password: adminPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  console.log("Baza de date a fost populată cu succes.");
  console.log("Admin: admin@customride.ro / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
