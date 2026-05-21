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
      { name: "Negru Profund", price: 120, categoryId: culori.id },
      { name: "Roșu Tornado", price: 180, categoryId: culori.id },
      { name: "Albastru Metalic", price: 160, categoryId: culori.id },
      { name: "Gri Antracit", price: 140, categoryId: culori.id },

      { name: 'Jante OZ Racing 17"', price: 580, categoryId: jante.id },
      { name: 'Jante BBS CH-R 18"', price: 920, categoryId: jante.id },
      { name: 'Jante Rays Volk TE37 17"', price: 1050, categoryId: jante.id },
      { name: 'Jante OEM Sport 16"', price: 290, categoryId: jante.id },

      { name: "Spoiler spate GTI", price: 280, categoryId: spoilere.id },
      { name: "Lip față RS", price: 210, categoryId: spoilere.id },
      { name: "Difuzor spate Carbon", price: 450, categoryId: spoilere.id },
      { name: "Eleron portbagaj", price: 360, categoryId: spoilere.id },

      { name: "Foliere totală", price: 850, categoryId: accesorii.id },
      { name: "Faruri LED Matrix", price: 440, categoryId: accesorii.id },
      { name: "Praguri laterale", price: 170, categoryId: accesorii.id },
      { name: "Sistem evacuare sport", price: 540, categoryId: accesorii.id },
      { name: "Geamuri fumurii", price: 200, categoryId: accesorii.id },
      { name: "Volan sport", price: 270, categoryId: accesorii.id },
    ],
  });

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@customride.ro" },
    update: { password: adminPassword, name: "Administrator", role: "ADMIN" },
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
