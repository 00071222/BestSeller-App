import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NuevoProductoPage() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Nuevo producto</h1>
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}