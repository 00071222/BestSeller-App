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
import { cn } from "@/lib/utils";

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
  discountType: string;
  discountStartsAt: string;
  discountEndsAt: string;
}

interface ProductFormProps {
  categories: Category[];
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
}

function isValidUrl(str: string): boolean {
  try {
    if (str.startsWith("/")) return true;
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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
    discountType: defaultValues?.discountType ?? "PERMANENT",
    discountStartsAt: defaultValues?.discountStartsAt ?? "",
    discountEndsAt: defaultValues?.discountEndsAt ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct(productId ?? "");
  const mutation = isEditing ? updateProduct : createProduct;

  // Split images for dynamic preview
  const imageUrls = form.images
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  const activePreviewUrl = imageUrls[activeImageIndex] || imageUrls[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) {
      newErrors.name = "El nombre del producto es obligatorio";
    }
    if (!form.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
    }
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) < 0) {
      newErrors.price = "El precio debe ser un número válido mayor o igual a 0";
    }
    if (!form.stock.trim() || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      newErrors.stock = "El stock debe ser un número entero mayor o igual a 0";
    }
    if (!form.categoryId) {
      newErrors.categoryId = "La categoría / marca es obligatoria";
    }

    // Validate URLs if entered
    const invalidUrls = imageUrls.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      newErrors.images = "Una o más URLs de imagen no son válidas";
    }

    const discountVal = form.discountPercentage ? Number(form.discountPercentage) : 0;
    if (discountVal < 0 || discountVal > 100) {
      newErrors.discountPercentage = "El descuento debe estar entre 0 y 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Por favor, corrige los errores en el formulario");
      return;
    }
    setErrors({});

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      isActive: form.isActive,
      images: imageUrls,
      discountPercentage: discountVal,
      discountType: form.discountType as "PERMANENT" | "TEMPORARY",
      discountStartsAt: form.discountStartsAt || undefined,
      discountEndsAt: form.discountEndsAt || undefined,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success(isEditing ? "Producto actualizado" : "Producto creado");
        router.push("/admin/products");
      },
      onError: (err: unknown) => {
        const errMsg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          "Ocurrió un error al guardar el producto";
        toast.error(errMsg);
      },
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full">
      {/* Left side: Product edit form */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 space-y-6 bg-card border border-border/40 p-8 rounded-2xl shadow-xl backdrop-blur-md transition-all duration-300 w-full"
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
              Nombre del Producto <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ej. Labial Mate Intenso Avon"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={cn(
                "bg-background border-slate-300 dark:border-slate-700 focus-visible:ring-primary transition-all duration-200 rounded-xl",
                errors.name && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
              )}
            />
            {errors.name && <p className="text-xs text-red-500 font-semibold mt-1">{errors.name}</p>}
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe las características principales del producto..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={cn(
                "bg-background border-slate-300 dark:border-slate-700 focus-visible:ring-primary transition-all duration-200 rounded-xl",
                errors.description && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
              )}
            />
            {errors.description && <p className="text-xs text-red-500 font-semibold mt-1">{errors.description}</p>}
          </div>

          {/* Price, Stock and Discount Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-semibold flex items-center gap-1">
                Precio ($) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={cn(
                  "bg-background border-slate-300 dark:border-slate-700 focus-visible:ring-primary transition-all duration-200 rounded-xl",
                  errors.price && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                )}
              />
              {errors.price && <p className="text-xs text-red-500 font-semibold mt-1">{errors.price}</p>}
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
                className={cn(
                  "bg-background border-slate-300 dark:border-slate-700 focus-visible:ring-primary transition-all duration-200 rounded-xl",
                  errors.discountPercentage && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                )}
              />
              {errors.discountPercentage && <p className="text-xs text-red-500 font-semibold mt-1">{errors.discountPercentage}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock" className="text-sm font-semibold">
                Stock Disponible <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className={cn(
                  "bg-background border-slate-300 dark:border-slate-700 focus-visible:ring-primary transition-all duration-200 rounded-xl",
                  errors.stock && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                )}
              />
              {errors.stock && <p className="text-xs text-red-500 font-semibold mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Discount Settings Section (only if discount > 0) */}
          {Number(form.discountPercentage) > 0 && (
            <div className="p-4 border border-border/40 bg-muted/10 rounded-xl space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="discountType" className="text-xs font-semibold text-muted-foreground">
                  Tipo de Descuento
                </Label>
                <Select
                  value={form.discountType}
                  onValueChange={(val) => setForm({ ...form, discountType: val })}
                >
                  <SelectTrigger id="discountType" className="w-full bg-background border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between px-3 py-2 h-9">
                    <SelectValue placeholder="Selecciona tipo de descuento" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="PERMANENT">Permanente</SelectItem>
                    <SelectItem value="TEMPORARY">Tiempo Limitado (Temporal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.discountType === "TEMPORARY" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountStartsAt" className="text-xs font-semibold text-muted-foreground">
                      Fecha y Hora de Inicio
                    </Label>
                    <Input
                      id="discountStartsAt"
                      type="datetime-local"
                      value={form.discountStartsAt}
                      onChange={(e) => setForm({ ...form, discountStartsAt: e.target.value })}
                      className="bg-background border-slate-300 dark:border-slate-700 focus-visible:ring-primary rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountEndsAt" className="text-xs font-semibold text-muted-foreground">
                      Fecha y Hora de Fin
                    </Label>
                    <Input
                      id="discountEndsAt"
                      type="datetime-local"
                      value={form.discountEndsAt}
                      onChange={(e) => setForm({ ...form, discountEndsAt: e.target.value })}
                      className="bg-background border-slate-300 dark:border-slate-700 focus-visible:ring-primary rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Category selection */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold">
              Categoría / Marca <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.categoryId}
              onValueChange={(value) => setForm({ ...form, categoryId: value })}
            >
              <SelectTrigger
                id="category"
                className={cn(
                  "w-full bg-background border-slate-300 dark:border-slate-700 rounded-xl flex items-center justify-between px-3 py-2 h-9",
                  errors.categoryId && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                )}
              >
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
            {errors.categoryId && <p className="text-xs text-red-500 font-semibold mt-1">{errors.categoryId}</p>}
          </div>

          {/* Image URLs input */}
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
              onChange={(e) => {
                setForm({ ...form, images: e.target.value });
                setActiveImageIndex(0); // Reset preview index
              }}
              className={cn(
                "bg-background border-slate-300 dark:border-slate-700 focus-visible:ring-primary transition-all duration-200 rounded-xl text-xs font-mono",
                errors.images && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
              )}
            />
            {errors.images && <p className="text-xs text-red-500 font-semibold mt-1">{errors.images}</p>}
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

      {/* Right side: Large dedicated preview module */}
      <div className="lg:col-span-5 lg:sticky lg:top-8 bg-card border border-border/40 rounded-2xl p-6 shadow-xl flex flex-col gap-4 min-h-[480px] w-full justify-center items-center">
        {imageUrls.length > 0 ? (
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-border/40">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Eye className="h-4.5 w-4.5 text-primary" />
                Previsualización de Galería
              </h3>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-lg font-mono">
                {activeImageIndex + 1} / {imageUrls.length}
              </span>
            </div>

            {/* Large Active Display Container */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-border/60 bg-background/50 shadow-inner flex items-center justify-center p-4">
              {isValidUrl(activePreviewUrl) ? (
                <Image
                  src={activePreviewUrl}
                  alt="Active Preview Image"
                  fill
                  unoptimized
                  className="object-contain p-4 transition-all duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/600x600?text=Error+al+Cargar+Imagen";
                  }}
                />
              ) : (
                <div className="text-center p-4 text-muted-foreground flex flex-col items-center gap-2">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
                  <p className="text-xs">URL de imagen inválida o incompleta</p>
                </div>
              )}
            </div>

            {/* Thumbnail Carousel list below */}
            {imageUrls.length > 1 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Otras imágenes:</span>
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url, index) => {
                    const isUrlValid = isValidUrl(url);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative h-16 w-16 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                          activeImageIndex === index
                            ? "border-primary ring-2 ring-primary/20 scale-105"
                            : "border-border/60 hover:border-primary/60"
                        }`}
                      >
                        {isUrlValid ? (
                          <Image
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/150x150?text=Error";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center border border-dashed border-border animate-pulse">
              <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-semibold text-foreground">Sin imágenes agregadas</p>
            <p className="text-xs text-muted-foreground max-w-[260px] leading-relaxed">
              Ingresa una o más URLs de imágenes separadas por comas en el formulario de la izquierda para ver el carrusel de previsualización aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}