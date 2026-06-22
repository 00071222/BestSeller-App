"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, Percent, Search, FilterX } from "lucide-react";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import { useBrands } from "@/hooks/use-brands";
import { useCategories } from "@/hooks/use-categories";
import { getActiveDiscount, calculateFinalPrice } from "@/lib/pricing";
import { CountdownTimer } from "@/components/ui/countdown-timer";

export default function AdminProductosPage() {
  const [search, setSearch] = useState("");
  const [brandId, setBrandId] = useState<string>("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: brands } = useBrands();
  const { data: categories } = useCategories();

  const queryParams: Record<string, string | string[]> = {};
  if (search) queryParams.search = search;
  if (brandId && brandId !== "all") queryParams.brandId = brandId;
  if (categoryId && categoryId !== "all") queryParams.categoryId = [categoryId];
  if (minPrice) queryParams.minPrice = minPrice;
  if (maxPrice) queryParams.maxPrice = maxPrice;

  const { data: products, isLoading, isError } = useProducts(queryParams);
  const deleteProduct = useDeleteProduct();

  function handleDelete(id: string) {
    deleteProduct.mutate(id, {
      onSuccess: () => toast.success("Producto eliminado"),
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          "No se pudo eliminar el producto";
        toast.error(message);
      },
    });
  }

  function clearFilters() {
    setSearch("");
    setBrandId("all");
    setCategoryId("all");
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Catálogo de Productos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra tu stock, precios, marcas y descuentos de forma rápida.
          </p>
        </div>
        <Button asChild className="rounded-xl bg-gradient-to-r from-primary to-accent shadow-md cursor-pointer">
          <Link href="/admin/products/new">
            <Plus className="h-4.5 w-4.5 mr-2" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background rounded-xl"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={brandId} onValueChange={setBrandId}>
              <SelectTrigger className="w-full bg-background rounded-xl">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todas las marcas</SelectItem>
                {brands?.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full bg-background rounded-xl">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories?.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="number"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-20 md:w-24 bg-background rounded-xl"
            />
            <span className="text-muted-foreground text-sm">-</span>
            <Input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-20 md:w-24 bg-background rounded-xl"
            />
          </div>
          <Button variant="outline" onClick={clearFilters} className="rounded-xl w-full md:w-auto">
            <FilterX className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>

      <div className="border border-border/40 rounded-2xl overflow-hidden shadow-lg bg-card/60 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[100px] py-4">Imagen</TableHead>
              <TableHead className="py-4">Nombre y Detalle</TableHead>
              <TableHead className="py-4">Marca y Categorías</TableHead>
              <TableHead className="py-4">Precio</TableHead>
              <TableHead className="py-4">Stock</TableHead>
              <TableHead className="py-4">Estado</TableHead>
              <TableHead className="text-right py-4 pr-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-red-500">
                  Error al cargar los productos.
                </TableCell>
              </TableRow>
            ) : products?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No se encontraron productos con estos filtros.
                </TableCell>
              </TableRow>
            ) : (
              products?.map((product) => {
                const activeDiscount = product.discounts ? getActiveDiscount(product.discounts) : null;
                const originalPrice = Number(product.price);
                const finalPrice = calculateFinalPrice(originalPrice, activeDiscount);

                return (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4 pl-6">
                      <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-background border border-border/80 shadow-md group shrink-0">
                        <Image
                          src={product.images[0] ?? "https://placehold.co/150x150?text=Sin+Foto"}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-base tracking-tight hover:text-primary transition-colors">
                          {product.name}
                        </span>
                        <span className="text-xs text-muted-foreground max-w-sm truncate mt-0.5">
                          {product.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-primary/10 text-primary border border-primary/20 w-fit">
                          {product.brand?.name}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {product.categories?.map(cat => (
                            <span key={cat.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground border border-border/30">
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {activeDiscount ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                          <span className="text-base font-extrabold text-emerald-500">
                            ${finalPrice.toFixed(2)}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[24px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-md mt-1 w-fit">
                            <Percent className="h-4 w-4" />
                            {activeDiscount.percentage.toString()}% OFF
                          </span>
                          {activeDiscount.type === "TEMPORARY" && activeDiscount.endsAt && (
                            <CountdownTimer 
                              endsAt={activeDiscount.endsAt} 
                              variant="inline" 
                              className="mt-1.5 text-[24px] font-bold text-red-500" 
                            />
                          )}
                        </div>
                      ) : (
                        <span className="text-base font-bold text-foreground">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`font-semibold ${product.stock <= 5 ? "text-red-500 font-bold" : "text-foreground"}`}>
                        {product.stock} u.
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant={product.isActive ? "default" : "secondary"} className="rounded-lg px-2.5 py-1 font-semibold">
                        {product.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-4 pr-6 space-x-2">
                      <Button variant="outline" size="icon" asChild className="rounded-xl border-border/80 hover:bg-muted transition-colors">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon" className="rounded-xl border-destructive/20 hover:bg-destructive/10 text-destructive transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar este producto?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Si ya tiene ventas registradas, no
                              podrá eliminarse — considera desactivarlo en su lugar.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(product.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}