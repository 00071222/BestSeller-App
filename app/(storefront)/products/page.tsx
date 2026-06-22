import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";
import { getAllProducts, getCategories, getBrands } from "@/lib/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    brand?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const { search, brand, category, minPrice, maxPrice } = await searchParams;
  
  const filters = {
    search,
    brandSlug: brand,
    categorySlug: category,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  };

  const [products, categories, brands] = await Promise.all([
    getAllProducts(filters),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 tracking-tight text-foreground">Catálogo</h1>

      {/* Advanced Filters */}
      <form className="mb-8 p-4 bg-muted/30 border border-border/40 rounded-2xl flex flex-col md:flex-row gap-4 items-end">
        {/* We use hidden inputs or let the form submit natively to update URL params */}
        
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-semibold text-muted-foreground ml-1">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={search}
              placeholder="Producto, descripción..."
              className="pl-9 bg-background rounded-xl"
            />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-semibold text-muted-foreground ml-1">Marca</label>
          <select name="brand" defaultValue={brand || ""} className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">Todas las marcas</option>
            {brands.map(b => (
              <option key={b.id} value={b.slug}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-semibold text-muted-foreground ml-1">Etiqueta</label>
          <select name="category" defaultValue={category || ""} className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="">Todas</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="space-y-1 w-full md:w-24">
            <label className="text-xs font-semibold text-muted-foreground ml-1">Min $</label>
            <Input name="minPrice" type="number" defaultValue={minPrice} placeholder="0" className="bg-background rounded-xl" />
          </div>
          <span className="text-muted-foreground mt-6">-</span>
          <div className="space-y-1 w-full md:w-24">
            <label className="text-xs font-semibold text-muted-foreground ml-1">Max $</label>
            <Input name="maxPrice" type="number" defaultValue={maxPrice} placeholder="1000" className="bg-background rounded-xl" />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button type="submit" className="rounded-xl bg-gradient-to-r from-primary to-accent shadow-md w-full md:w-auto">
            <Search className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          {(search || brand || category || minPrice || maxPrice) && (
            <Button asChild variant="outline" className="rounded-xl w-full md:w-auto">
              <Link href="/products">
                <FilterX className="h-4 w-4 mr-2" />
                Limpiar
              </Link>
            </Button>
          )}
        </div>
      </form>

      {/* Tags quick links (Optional, keeping it for visual richness) */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Link
          href="/products"
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm transition-colors",
            !category && !brand ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
          )}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border shadow-sm transition-colors",
              category === cat.slug ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 border border-border/40 rounded-2xl">
          <p className="text-muted-foreground text-lg">No se encontraron productos con estos filtros.</p>
          <Button asChild variant="outline" className="mt-4 rounded-xl">
            <Link href="/products">Ver todos los productos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}