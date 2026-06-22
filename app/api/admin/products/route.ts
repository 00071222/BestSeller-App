import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const brandId = searchParams.get("brandId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  
  // categoryId might be passed multiple times or as a comma separated string
  const categoryIds = searchParams.getAll("categoryId");

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (brandId) {
    where.brandId = brandId;
  }

  if (categoryIds.length > 0) {
    // If there is only one string with commas, split it
    const ids = categoryIds.length === 1 && categoryIds[0].includes(",") 
      ? categoryIds[0].split(",") 
      : categoryIds;
    
    where.categories = {
      some: {
        id: { in: ids }
      }
    };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const products = await prisma.product.findMany({
    where,
    include: { brand: true, categories: true, discounts: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const {
    name,
    description,
    images,
    price,
    stock,
    brandId,
    categories, // Array of category IDs
    isActive,
    discountPercentage,
    discountType,
    discountStartsAt,
    discountEndsAt,
  } = await request.json();

  if (!name || name.trim() === "") {
    return NextResponse.json({ error: "El nombre del producto es obligatorio" }, { status: 400 });
  }
  if (!description || description.trim() === "") {
    return NextResponse.json({ error: "La descripción del producto es obligatoria" }, { status: 400 });
  }
  if (price == null || isNaN(Number(price))) {
    return NextResponse.json({ error: "El precio debe ser un número válido" }, { status: 400 });
  }
  if (Number(price) < 0) {
    return NextResponse.json({ error: "El precio no puede ser negativo" }, { status: 400 });
  }
  if (stock == null || isNaN(Number(stock))) {
    return NextResponse.json({ error: "El stock debe ser un número válido" }, { status: 400 });
  }
  if (Number(stock) < 0) {
    return NextResponse.json({ error: "El stock no puede ser negativo" }, { status: 400 });
  }
  if (!brandId || brandId.trim() === "") {
    return NextResponse.json({ error: "La marca es obligatoria" }, { status: 400 });
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      images: Array.isArray(images) ? images : [],
      price: Number(price),
      stock: Number(stock),
      brandId,
      categories: Array.isArray(categories) && categories.length > 0
        ? { connect: categories.map((id: string) => ({ id })) }
        : undefined,
      isActive: isActive ?? true,
    },
  });

  if (discountPercentage && Number(discountPercentage) > 0) {
    await prisma.discount.create({
      data: {
        type: (discountType === "TEMPORARY" ? "TEMPORARY" : "PERMANENT") as "TEMPORARY" | "PERMANENT",
        percentage: Number(discountPercentage),
        startsAt: discountStartsAt ? new Date(discountStartsAt) : new Date(),
        endsAt: discountEndsAt ? new Date(discountEndsAt) : null,
        productId: product.id,
        isActive: true,
      },
    });
  }

  return NextResponse.json(product, { status: 201 });
}