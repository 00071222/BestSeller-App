import { prisma } from "@/lib/prisma";

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { brand: true, categories: true, discounts: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

interface ProductFilters {
  search?: string;
  brandSlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function getAllProducts(filters: ProductFilters = {}) {
  const { search, brandSlug, categorySlug, minPrice, maxPrice } = filters;
  const where: any = { isActive: true };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (brandSlug) {
    where.brand = { slug: brandSlug };
  }

  if (categorySlug) {
    where.categories = {
      some: { slug: categorySlug }
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  return prisma.product.findMany({
    where,
    include: { brand: true, categories: true, discounts: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { brand: true, categories: true, discounts: true },
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getBrands() {
  return prisma.brand.findMany({ orderBy: { name: "asc" } });
}