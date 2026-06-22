import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
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

  const product = await prisma.product.update({
    where: { id },
    data: { 
      name, 
      description, 
      images, 
      price: price !== undefined ? Number(price) : undefined, 
      stock: stock !== undefined ? Number(stock) : undefined, 
      brandId, 
      isActive,
      categories: categories !== undefined ? {
        set: [], // Clear existing
        connect: categories.map((catId: string) => ({ id: catId })) // Add new
      } : undefined
    },
    include: { brand: true, categories: true, discounts: true }
  });

  if (discountPercentage !== undefined) {
    const pct = Number(discountPercentage);
    if (pct > 0) {
      const activeDiscount = await prisma.discount.findFirst({
        where: { productId: id, isActive: true },
      });
      const discountData = {
        type: (discountType === "TEMPORARY" ? "TEMPORARY" : "PERMANENT") as "TEMPORARY" | "PERMANENT",
        percentage: pct,
        startsAt: discountStartsAt ? new Date(discountStartsAt) : new Date(),
        endsAt: discountEndsAt ? new Date(discountEndsAt) : null,
        isActive: true,
      };

      if (activeDiscount) {
        await prisma.discount.update({
          where: { id: activeDiscount.id },
          data: discountData,
        });
      } else {
        await prisma.discount.create({
          data: {
            ...discountData,
            productId: id,
          },
        });
      }
    } else {
      await prisma.discount.updateMany({
        where: { productId: id, isActive: true },
        data: { isActive: false },
      });
    }
  }

  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "No se puede eliminar: ya tiene ventas registradas. Desactívalo en su lugar." },
      { status: 409 }
    );
  }
}