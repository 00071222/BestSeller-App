import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";
import { getAllProducts, getCategories } from "@/lib/data/products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getAllProducts(category),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Catálogo</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        <Link
          href="/products"
          className={cn(
            "px-3 py-1 rounded-full text-sm border",
            !category && "bg-primary text-primary-foreground"
          )}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={cn(
              "px-3 py-1 rounded-full text-sm border",
              category === cat.slug && "bg-primary text-primary-foreground"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-muted-foreground">No hay productos en esta categoría.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}