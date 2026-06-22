"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCategories, useCreateCategory, useDeleteCategory, Category } from "@/hooks/use-categories";
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

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const openNew = () => {
    setEditingCategory(null);
    setName("");
    setIsDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (editingCategory) {
      try {
        await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        toast.success("Categoría actualizada");
        setIsDialogOpen(false);
        window.location.reload();
      } catch {
        toast.error("Error al actualizar la categoría");
      }
    } else {
      createCategory.mutate({ name }, {
        onSuccess: () => {
          toast.success("Categoría creada");
          setIsDialogOpen(false);
        },
        onError: () => toast.error("Error al crear la categoría"),
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success("Categoría eliminada"),
      onError: () => toast.error("No se pudo eliminar la categoría."),
    });
  };

  if (isLoading) return <p className="text-muted-foreground">Cargando categorías...</p>;
  if (isError) return <p className="text-red-500">Error al cargar categorías.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Categorías / Etiquetas</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona las etiquetas (Hombre, Hogar, Niños, etc).</p>
        </div>
        <Button onClick={openNew} className="rounded-xl bg-gradient-to-r from-primary to-accent shadow-md cursor-pointer">
          <Plus className="h-4.5 w-4.5 mr-2" />
          Nueva Categoría
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
            {categories?.map(category => (
              <TableRow key={category.id}>
                <TableCell className="py-4 font-bold">{category.name}</TableCell>
                <TableCell className="py-4 text-muted-foreground">{category.slug}</TableCell>
                <TableCell className="text-right py-4 pr-6 space-x-2">
                  <Button variant="outline" size="icon" onClick={() => openEdit(category)} className="rounded-xl border-border/80 hover:bg-muted transition-colors">
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
                        <AlertDialogTitle>¿Eliminar esta categoría?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(category.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {categories?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No hay categorías registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
            <DialogDescription>
              Ingresa el nombre de la categoría o etiqueta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Hogar"
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
