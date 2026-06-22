import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { 
        discounts: { where: { isActive: true } },
        categories: true,
      },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const activeDiscount = product.discounts[0];
  const discountPercentage = activeDiscount ? activeDiscount.percentage.toString() : "";
  const discountType = activeDiscount ? activeDiscount.type : "PERMANENT";

  const formatDateTimeLocal = (date: Date | null | undefined) => {
    if (!date) return "";
    const pad = (num: number) => String(num).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const discountStartsAt = activeDiscount ? formatDateTimeLocal(new Date(activeDiscount.startsAt)) : "";
  const discountEndsAt = activeDiscount ? formatDateTimeLocal(activeDiscount.endsAt ? new Date(activeDiscount.endsAt) : null) : "";

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Editar producto</h1>
      <ProductForm
        brands={brands}
        categories={categories}
        productId={product.id}
        defaultValues={{
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          stock: product.stock.toString(),
          brandId: product.brandId,
          categories: product.categories.map(c => c.id),
          isActive: product.isActive,
          images: product.images.join(", "),
          discountPercentage,
          discountType,
          discountStartsAt,
          discountEndsAt,
        }}
      />
    </div>
  );
}