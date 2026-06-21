"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useCartStore } from "@/app/store/cart-store";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  stock: number;
}

export function AddToCartButton(props: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  function handleAdd() {
    addItem(props, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (props.stock === 0) {
    return (
      <Button className="mt-6 w-full" size="lg" disabled>
        Agotado temporalmente
      </Button>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2 w-fit border rounded-md">
        <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input className="w-12 text-center border-0" value={quantity} readOnly />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setQuantity((q) => Math.min(props.stock, q + 1))}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button className="w-full" size="lg" onClick={handleAdd}>
        {added ? "¡Agregado!" : "Agregar al carrito"}
      </Button>
    </div>
  );
}