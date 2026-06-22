"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useBrands, useCreateBrand, useDeleteBrand, Brand } from "@/hooks/use-brands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function AdminBrandsPage() {
  const { data: brands, isLoading, isError } = useBrands();
  const createBrand = useCreateBrand();
  const deleteBrand = useDeleteBrand();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [name, setName] = useState("");

  const openNew = () => {
    setEditingBrand(null);
    setName("");
    setIsDialogOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setName(brand.name);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (editingBrand) {
      try {
        await fetch(`/api/admin/brands/${editingBrand.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        toast.success("Marca actualizada");
        setIsDialogOpen(false);
        // Force reload by window location or invalidate manually.
        // Since we are not using the hook properly for update here due to dynamic id, simple fetch is okay.
        window.location.reload();
      } catch {
        toast.error("Error al actualizar la marca");
      }
    } else {
      createBrand.mutate({ name }, {
        onSuccess: () => {
          toast.success("Marca creada");
          setIsDialogOpen(false);
        },
        onError: () => toast.error("Error al crear la marca"),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteBrand.mutate(id, {
      onSuccess: () => toast.success("Marca eliminada"),
      onError: () => toast.error("No se pudo eliminar la marca. Es posible que tenga productos asociados."),
    });
  };

  if (isLoading) return <p className="text-muted-foreground">Cargando marcas...</p>;
  if (isError) return <p className="text-red-500">Error al cargar marcas.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Marcas</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona las marcas de tus productos (Avon, L&apos;Bel, etc).</p>
        </div>
        <Button onClick={openNew} className="rounded-xl bg-gradient-to-r from-primary to-accent shadow-md cursor-pointer">
          <Plus className="h-4.5 w-4.5 mr-2" />
          Nueva Marca
        </Button>
      </div>

      <div className="border border-border/40 rounded-2xl overflow-hidden shadow-lg bg-card/60 backdrop-blur-sm max-w-3xl">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="py-4">Nombre</TableHead>
              <TableHead className="py-4">Slug</TableHead>
              <TableHead className="text-right py-4 pr-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands?.map(brand => (
              <TableRow key={brand.id}>
                <TableCell className="py-4 font-bold">{brand.name}</TableCell>
                <TableCell className="py-4 text-muted-foreground">{brand.slug}</TableCell>
                <TableCell className="text-right py-4 pr-6 space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(brand)} className="rounded-xl border-border/80 hover:bg-muted transition-colors">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-xl border-destructive/20 hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar esta marca?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(brand.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {brands?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No hay marcas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Editar Marca" : "Nueva Marca"}</DialogTitle>
            <DialogDescription>
              Ingresa el nombre de la marca.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Avon"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleSave} className="rounded-xl bg-gradient-to-r from-primary to-accent">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
