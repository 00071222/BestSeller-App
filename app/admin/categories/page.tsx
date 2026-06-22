"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useBrands, useCreateBrand, useDeleteBrand, Brand } from "@/hooks/use-brands";
import { useCategories, useCreateCategory, useDeleteCategory, Category } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Search, Layers, Award } from "lucide-react";
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
  const queryClient = useQueryClient();

  // Queries & Mutations for Brands
  const { data: brands, isLoading: isLoadingBrands, isError: isErrorBrands } = useBrands();
  const createBrand = useCreateBrand();
  const deleteBrand = useDeleteBrand();

  // Queries & Mutations for Categories
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  // State for Brand management
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  // State for Category management
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Brand Handlers
  const openNewBrand = () => {
    setEditingBrand(null);
    setBrandName("");
    setIsBrandDialogOpen(true);
  };

  const openEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setIsBrandDialogOpen(true);
  };

  const handleSaveBrand = async () => {
    if (!brandName.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (editingBrand) {
      try {
        const response = await fetch(`/api/admin/brands/${editingBrand.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: brandName }),
        });
        if (!response.ok) throw new Error();
        toast.success("Marca actualizada");
        setIsBrandDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
      } catch {
        toast.error("Error al actualizar la marca");
      }
    } else {
      createBrand.mutate({ name: brandName }, {
        onSuccess: () => {
          toast.success("Marca creada");
          setIsBrandDialogOpen(false);
        },
        onError: () => toast.error("Error al crear la marca"),
      });
    }
  };

  const handleDeleteBrand = (id: string) => {
    deleteBrand.mutate(id, {
      onSuccess: () => toast.success("Marca eliminada"),
      onError: () => toast.error("No se pudo eliminar la marca. Es posible que tenga productos asociados."),
    });
  };

  // Category Handlers
  const openNewCategory = () => {
    setEditingCategory(null);
    setCategoryName("");
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (editingCategory) {
      try {
        const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: categoryName }),
        });
        if (!response.ok) throw new Error();
        toast.success("Categoría actualizada");
        setIsCategoryDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      } catch {
        toast.error("Error al actualizar la categoría");
      }
    } else {
      createCategory.mutate({ name: categoryName }, {
        onSuccess: () => {
          toast.success("Categoría creada");
          setIsCategoryDialogOpen(false);
        },
        onError: () => toast.error("Error al crear la categoría"),
      });
    }
  };

  const handleDeleteCategory = (id: string) => {
    deleteCategory.mutate(id, {
      onSuccess: () => toast.success("Categoría eliminada"),
      onError: () => toast.error("No se pudo eliminar la categoría."),
    });
  };

  // Local filtering
  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase()) ||
    brand.slug.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    category.slug.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="pb-5 border-b border-border flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Layers className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Categorías y Marcas</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona las categorías y marcas de tus productos desde una sola vista unificada.</p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Brands (Marcas) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Marcas</h2>
            </div>
            <Button onClick={openNewBrand} size="sm" className="rounded-xl bg-gradient-to-r from-primary to-accent shadow-md cursor-pointer">
              <Plus className="h-4 w-4 mr-1.5" />
              Nueva Marca
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar marcas..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>

          <div className="border border-border/40 rounded-2xl overflow-hidden shadow-lg bg-card/60 backdrop-blur-sm">
            {isLoadingBrands ? (
              <div className="p-6 text-center text-muted-foreground">Cargando marcas...</div>
            ) : isErrorBrands ? (
              <div className="p-6 text-center text-destructive">Error al cargar marcas.</div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="py-4">Nombre</TableHead>
                    <TableHead className="py-4">Slug</TableHead>
                    <TableHead className="text-right py-4 pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBrands?.map(brand => (
                    <TableRow key={brand.id}>
                      <TableCell className="py-4 font-bold">{brand.name}</TableCell>
                      <TableCell className="py-4 text-muted-foreground">{brand.slug}</TableCell>
                      <TableCell className="text-right py-4 pr-6 space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openEditBrand(brand)} className="rounded-xl border-border/80 hover:bg-muted transition-colors h-8 w-8">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-xl border-destructive/20 hover:bg-destructive/10 text-destructive transition-colors h-8 w-8">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar esta marca?</AlertDialogTitle>
                              <AlertDialogDescription>Esta acción no se puede deshacer. Se validará que no posea productos vinculados.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteBrand(brand.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredBrands?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No se encontraron marcas.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Column 2: Categories (Categorías) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Categorías</h2>
            </div>
            <Button onClick={openNewCategory} size="sm" className="rounded-xl bg-gradient-to-r from-primary to-accent shadow-md cursor-pointer">
              <Plus className="h-4 w-4 mr-1.5" />
              Nueva Categoría
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar categorías..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>

          <div className="border border-border/40 rounded-2xl overflow-hidden shadow-lg bg-card/60 backdrop-blur-sm">
            {isLoadingCategories ? (
              <div className="p-6 text-center text-muted-foreground">Cargando categorías...</div>
            ) : isErrorCategories ? (
              <div className="p-6 text-center text-destructive">Error al cargar categorías.</div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="py-4">Nombre</TableHead>
                    <TableHead className="py-4">Slug</TableHead>
                    <TableHead className="text-right py-4 pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories?.map(category => (
                    <TableRow key={category.id}>
                      <TableCell className="py-4 font-bold">{category.name}</TableCell>
                      <TableCell className="py-4 text-muted-foreground">{category.slug}</TableCell>
                      <TableCell className="text-right py-4 pr-6 space-x-2">
                        <Button variant="outline" size="icon" onClick={() => openEditCategory(category)} className="rounded-xl border-border/80 hover:bg-muted transition-colors h-8 w-8">
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-xl border-destructive/20 hover:bg-destructive/10 text-destructive transition-colors h-8 w-8">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar esta categoría?</AlertDialogTitle>
                              <AlertDialogDescription>Esta acción no se puede deshacer. Se validará que no posea productos vinculados.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)} className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCategories?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No se encontraron categorías.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

      </div>

      {/* Brand Dialog */}
      <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Editar Marca" : "Nueva Marca"}</DialogTitle>
            <DialogDescription>
              Ingresa el nombre de la marca.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="brand-name">Nombre</Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ej. Avon"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBrandDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleSaveBrand} className="rounded-xl bg-gradient-to-r from-primary to-accent">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
            <DialogDescription>
              Ingresa el nombre de la categoría o etiqueta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Nombre</Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Ej. Maquillaje"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleSaveCategory} className="rounded-xl bg-gradient-to-r from-primary to-accent">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
