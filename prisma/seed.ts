import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Admin único
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bestseller.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@bestseller.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // 2. Categorías
  const categoriesData = [
    { name: "Avon", slug: "avon" },
    { name: "Lbel", slug: "lbel" },
    { name: "Cyzone", slug: "cyzone" },
  ];

  const categories = await Promise.all(
    categoriesData.map((c) =>
      prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
    )
  );
  const avon = categories.find((c) => c.slug === "avon")!;
  const lbel = categories.find((c) => c.slug === "lbel")!;
  const cyzone = categories.find((c) => c.slug === "cyzone")!;

  // 3. Productos
  const labial = await prisma.product.upsert({
    where: { slug: "labial-mate-rojo-avon" },
    update: {},
    create: {
      name: "Labial Mate Rojo Pasión",
      slug: "labial-mate-rojo-avon",
      description: "Labial de larga duración con acabado mate, tono rojo intenso.",
      images: ["https://placehold.co/600x600?text=Labial+Rojo"],
      price: 8.99,
      stock: 25,
      categoryId: avon.id,
    },
  });

  const perfume = await prisma.product.upsert({
    where: { slug: "perfume-femenino-lbel" },
    update: {},
    create: {
      name: "Perfume Femenino Essenza",
      slug: "perfume-femenino-lbel",
      description: "Fragancia floral de larga duración, 50ml.",
      images: ["https://placehold.co/600x600?text=Perfume"],
      price: 24.5,
      stock: 12,
      categoryId: lbel.id,
    },
  });

  await prisma.product.upsert({
    where: { slug: "paleta-sombras-cyzone" },
    update: {},
    create: {
      name: "Paleta de Sombras Glow",
      slug: "paleta-sombras-cyzone",
      description: "Paleta de 12 tonos shimmer y mate.",
      images: ["https://placehold.co/600x600?text=Sombras"],
      price: 15.0,
      stock: 18,
      categoryId: cyzone.id,
    },
  });

  // 4. Descuento de ejemplo (solo si no existe ya uno para ese producto)
  const existingDiscount = await prisma.discount.findFirst({
    where: { productId: perfume.id },
  });

  if (!existingDiscount) {
    await prisma.discount.create({
      data: {
        type: "TEMPORARY",
        percentage: 20,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 días
        productId: perfume.id,
      },
    });
  }

  console.log("Seed completado. Admin:", admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });