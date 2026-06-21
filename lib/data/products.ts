import { prisma } from "@/lib/prisma";

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true, discounts: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getAllProducts(categorySlug?: string) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true, discounts: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, discounts: true },
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}