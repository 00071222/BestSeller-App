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
  const { name, description, images, price, stock, categoryId, isActive, discountPercentage } =
    await request.json();

  const product = await prisma.product.update({
    where: { id },
    data: { name, description, images, price: price !== undefined ? Number(price) : undefined, stock: stock !== undefined ? Number(stock) : undefined, categoryId, isActive },
  });

  if (discountPercentage !== undefined) {
    const pct = Number(discountPercentage);
    if (pct > 0) {
      const activeDiscount = await prisma.discount.findFirst({
        where: { productId: id, isActive: true },
      });
      if (activeDiscount) {
        await prisma.discount.update({
          where: { id: activeDiscount.id },
          data: { percentage: pct },
        });
      } else {
        await prisma.discount.create({
          data: {
            type: "PERMANENT",
            percentage: pct,
            productId: id,
            isActive: true,
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