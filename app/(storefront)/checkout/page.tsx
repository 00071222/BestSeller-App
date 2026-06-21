"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { createOrder } from "./actions";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setIsProcessing(true);
    setError(null);
    try {
      const orderId = await createOrder(
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );
      clearCart();
      router.push(`/checkout/confirmation/${orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al procesar el pago.");
      setIsProcessing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-semibold">No hay nada que pagar</h1>
        <p className="text-muted-foreground mt-2">Tu carrito está vacío.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold">Confirmar compra</h1>
        {items.map((item) => (
          <div key={item.productId} className="flex gap-4 border-b pb-4 items-center">
            <div className="relative h-16 w-16 bg-muted rounded-md overflow-hidden shrink-0">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.quantity} x ${item.price.toFixed(2)}
              </p>
            </div>
            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6 h-fit space-y-4">
        <h2 className="font-semibold">Resumen del pedido</h2>
        <div className="flex justify-between text-sm">
          <span>Total</span>
          <span className="font-semibold">${totalPrice().toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Esta es una pasarela de pago simulada con fines de aprendizaje. Al confirmar, la
          compra se marcará automáticamente como pagada.
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button className="w-full" size="lg" onClick={handlePay} disabled={isProcessing}>
          {isProcessing ? "Procesando pago..." : "Pagar ahora"}
        </Button>
      </div>
    </div>
  );
}