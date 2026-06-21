import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { getFeaturedProducts } from "@/lib/data/products";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <div>
      <section className="bg-muted py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-bold">
          Belleza original, a un clic de distancia
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Avon, Lbel, Cyzone y más, con envíos directos a tu puerta.
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link href="/productos">Ver catálogo</Link>
        </Button>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold mb-6">Productos destacados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}