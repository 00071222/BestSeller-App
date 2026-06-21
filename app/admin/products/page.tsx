"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus, Percent } from "lucide-react";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
import { getActiveDiscount, calculateFinalPrice } from "@/lib/pricing";

export default function AdminProductosPage() {
  const { data: products, isLoading, isError } = useProducts();
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

  if (isLoading) return <p className="text-muted-foreground">Cargando productos...</p>;
  if (isError) return <p className="text-red-500">Error al cargar los productos.</p>;

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

      <div className="border border-border/40 rounded-2xl overflow-hidden shadow-lg bg-card/60 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[100px] py-4">Imagen</TableHead>
              <TableHead className="py-4">Nombre y Detalle</TableHead>
              <TableHead className="py-4">Categoría</TableHead>
              <TableHead className="py-4">Precio</TableHead>
              <TableHead className="py-4">Stock</TableHead>
              <TableHead className="py-4">Estado</TableHead>
              <TableHead className="text-right py-4 pr-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => {
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
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground border border-border/30">
                      {product.category.name}
                    </span>
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
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-md mt-1 w-fit">
                          <Percent className="h-2.5 w-2.5" />
                          {activeDiscount.percentage.toString()}% OFF
                        </span>
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
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}