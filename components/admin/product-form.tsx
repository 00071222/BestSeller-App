"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";

interface Category {
  id: string;
  name: string;
}

interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  isActive: boolean;
  images: string;
}

interface ProductFormProps {
  categories: Category[];
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
}

export function ProductForm({ categories, productId, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!productId;

  const [form, setForm] = useState<ProductFormValues>({
    name: defaultValues?.name ?? "",
    description: defaultValues?.description ?? "",
    price: defaultValues?.price ?? "",
    stock: defaultValues?.stock ?? "",
    categoryId: defaultValues?.categoryId ?? "",
    isActive: defaultValues?.isActive ?? true,
    images: defaultValues?.images ?? "",
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(productId ?? "");
  const mutation = isEditing ? updateProduct : createProduct;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      isActive: form.isActive,
      images: form.images.split(",").map((url) => url.trim()).filter(Boolean),
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(isEditing ? "Producto actualizado" : "Producto creado");
        router.push("/admin/products");
      },
      onError: () => toast.error("Ocurrió un error al guardar el producto"),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Precio</Label>
          <Input id="price" type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" min="0" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoría</Label>
        <Select value={form.categoryId} onValueChange={(value) => setForm({ ...form, categoryId: value })}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">URLs de imágenes (separadas por coma)</Label>
        <Textarea id="images" rows={2} placeholder="https://ejemplo.com/foto1.jpg, https://ejemplo.com/foto2.jpg" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="isActive" checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
        <Label htmlFor="isActive">Producto activo (visible en la tienda)</Label>
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear producto"}
      </Button>
    </form>
  );
}