"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CheckoutItem {
  productId: string;
  quantity: number;
}

export async function createOrder(items: CheckoutItem[]) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Debes iniciar sesión para completar la compra.");
  }
  if (items.length === 0) {
    throw new Error("El carrito está vacío.");
  }

  const order = await prisma.$transaction(async (tx) => {
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: { discounts: true },
      });

      if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);
      if (product.stock < item.quantity) {
        throw new Error(`Stock insuficiente para "${product.name}"`);
      }

      // recalculamos el precio en el servidor, nunca confiamos en el del cliente
      const now = new Date();
      const activeDiscount = product.discounts.find(
        (d) => d.isActive && d.startsAt <= now && (!d.endsAt || d.endsAt >= now)
      );
      const basePrice = Number(product.price);
      const unitPrice = activeDiscount
        ? Number((basePrice * (1 - Number(activeDiscount.percentage) / 100)).toFixed(2))
        : basePrice;

      total += unitPrice * item.quantity;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        productNameSnapshot: product.name,
        productImageSnapshot: product.images[0] ?? null,
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Simulación de la pasarela de pago: una pequeña espera y siempre exitosa
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return tx.order.create({
      data: {
        userId: session.user.id,
        total,
        status: "PAID",
        items: { create: orderItemsData },
      },
    });
  });

  revalidatePath("/admin/ventas");
  revalidatePath("/cuenta/pedidos");

  return order.id;
}