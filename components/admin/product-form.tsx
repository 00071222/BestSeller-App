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
import Image from "next/image";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { Sparkles, Image as ImageIcon, Percent, Eye } from "lucide-react";

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
  discountPercentage: string;
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
    discountPercentage: defaultValues?.discountPercentage ?? "",
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(productId ?? "");
  const mutation = isEditing ? updateProduct : createProduct;

  // Split images for dynamic preview
  const imageUrls = form.images
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const discountVal = form.discountPercentage ? Number(form.discountPercentage) : 0;
    if (discountVal < 0 || discountVal > 100) {
      toast.error("El descuento debe estar entre 0 y 100");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      isActive: form.isActive,
      images: imageUrls,
      discountPercentage: discountVal,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl bg-card border border-border/40 p-8 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300"
    >
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {isEditing ? "Detalles del Producto" : "Nuevo Producto"}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Name field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-1.5">
            Nombre del Producto
          </Label>
          <Input
            id="name"
            required
            placeholder="Ej. Labial Mate Intenso Avon"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-background/50 focus-visible:ring-primary transition-all duration-200 rounded-xl"
          />
        </div>

        {/* Description field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold">
            Descripción
          </Label>
          <Textarea
            id="description"
            required
            rows={3}
            placeholder="Describe las características principales del producto..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-background/50 focus-visible:ring-primary transition-all duration-200 rounded-xl"
          />
        </div>

        {/* Price, Stock and Discount Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-semibold flex items-center gap-1">
              Precio ($)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="bg-background/50 focus-visible:ring-primary transition-all duration-200 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountPercentage" className="text-sm font-semibold flex items-center gap-1">
              <Percent className="h-3.5 w-3.5 text-muted-foreground" />
              Descuento (%)
            </Label>
            <Input
              id="discountPercentage"
              type="number"
              min="0"
              max="100"
              placeholder="Opcional"
              value={form.discountPercentage}
              onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
              className="bg-background/50 focus-visible:ring-primary transition-all duration-200 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock" className="text-sm font-semibold">
              Stock Disponible
            </Label>
            <Input
              id="stock"
              type="number"
              min="0"
              required
              placeholder="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="bg-background/50 focus-visible:ring-primary transition-all duration-200 rounded-xl"
            />
          </div>
        </div>

        {/* Category selection */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-semibold">
            Categoría / Marca
          </Label>
          <Select
            value={form.categoryId}
            onValueChange={(value) => setForm({ ...form, categoryId: value })}
          >
            <SelectTrigger id="category" className="bg-background/50 rounded-xl">
              <SelectValue placeholder="Selecciona una marca o categoría" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id} className="rounded-lg">
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image URLs input with preview integration */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="images" className="text-sm font-semibold flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              URLs de Imágenes (Separadas por comas)
            </Label>
            <Textarea
              id="images"
              rows={2}
              placeholder="https://ejemplo.com/foto1.jpg, https://ejemplo.com/foto2.jpg"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="bg-background/50 focus-visible:ring-primary transition-all duration-200 rounded-xl text-xs font-mono"
            />
          </div>

          {/* Dynamic Image Preview Module */}
          {imageUrls.length > 0 && (
            <div className="space-y-2 bg-muted/20 border border-border/40 p-4 rounded-xl transition-all duration-300">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                Vista previa de imágenes ({imageUrls.length})
              </span>
              <div className="flex flex-wrap gap-3 pt-2">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative h-20 w-20 rounded-xl overflow-hidden border border-border/60 bg-background shadow-md group hover:border-primary transition-all duration-200"
                  >
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/150x150?text=Error+Carga";
                      }}
                    />
                    <span className="absolute bottom-1 right-1 bg-black/75 text-[9px] text-white px-1.5 py-0.5 rounded-lg font-mono">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* IsActive Switch */}
        <div className="flex items-center gap-3 p-4 border border-border/30 bg-muted/10 rounded-xl">
          <Switch
            id="isActive"
            checked={form.isActive}
            onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
          />
          <div className="grid gap-0.5">
            <Label htmlFor="isActive" className="text-sm font-semibold cursor-pointer">
              Producto Activo
            </Label>
            <p className="text-xs text-muted-foreground">
              Determina si este producto estará visible y disponible para los clientes en la tienda.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          className="rounded-xl"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 shadow-md shadow-primary/20 rounded-xl transition-all duration-200 cursor-pointer"
        >
          {mutation.isPending
            ? "Guardando..."
            : isEditing
            ? "Guardar Cambios"
            : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
}