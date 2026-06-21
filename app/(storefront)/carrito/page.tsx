"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CarritoPage() {
    const { items, updateQuantity, removeItem, totalPrice } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-xl font-semibold">Tu carrito está vacío</h1>
                <Button asChild className="mt-4">
                    <Link href="/productos">Ver productos</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold">Tu carrito</h1>
                {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 border-b pb-4">
                        <div className="relative h-20 w-20 bg-muted rounded-md overflow-hidden shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                            <Link href={`/productos/${item.slug}`} className="font-medium hover:underline">
                                {item.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} c/u</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-sm">{item.quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                    disabled={item.quantity >= item.stock}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end justify-between">
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.productId)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border rounded-lg p-6 h-fit space-y-4">
                <h2 className="font-semibold">Resumen</h2>
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice().toFixed(2)}</span>
                </div>
                <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceder al pago</Link>
                </Button>
            </div>
        </div>
    );
}