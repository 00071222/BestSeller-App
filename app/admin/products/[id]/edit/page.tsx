import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar producto</h1>
      <ProductForm
        categories={categories}
        productId={product.id}
        defaultValues={{
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock.toString(),
          categoryId: product.categoryId,
          isActive: product.isActive,
          images: product.images.join(", "),
        }}
      />
    </div>
  );
}