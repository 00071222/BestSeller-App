import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const products = await prisma.product.findMany({
    include: { category: true, discounts: true },
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
    categoryId,
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
  if (!categoryId || categoryId.trim() === "") {
    return NextResponse.json({ error: "La categoría / marca es obligatoria" }, { status: 400 });
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
      categoryId,
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