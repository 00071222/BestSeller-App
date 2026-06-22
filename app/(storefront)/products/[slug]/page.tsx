import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/data/products";
import { getActiveDiscount, calculateFinalPrice } from "@/lib/pricing";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ShieldCheck, Truck } from "lucide-react";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const discount = getActiveDiscount(product.discounts);
  const price = Number(product.price);
  const finalPrice = calculateFinalPrice(price, discount);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Lado Izquierdo: Galería de Imágenes */}
        <div className="relative">
          <ProductImageGallery images={product.images} alt={product.name} />
          {discount && (
            <Badge className="absolute top-4 right-4 z-10 bg-red-500 text-white hover:bg-red-600 shadow-lg px-3 py-1 text-sm font-bold tracking-wide rounded-full">
              -{discount.percentage.toString()}% OFF
            </Badge>
          )}
        </div>

        {/* Lado Derecho: Detalles del Producto */}
        <div className="flex flex-col">
          {/* Marca y Categorías */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-sm font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {product.brand?.name}
            </span>
            {product.categories?.map(cat => (
              <Badge key={cat.id} variant="secondary" className="text-[10px] font-semibold text-muted-foreground bg-secondary/50">
                {cat.name}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Precio y Descuentos */}
          <div className="mt-6 p-4 rounded-2xl bg-muted/30 border border-border/50 shadow-sm">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-black text-foreground">
                ${finalPrice.toFixed(2)}
              </span>
              {discount && (
                <span className="text-lg font-semibold text-muted-foreground line-through opacity-70">
                  ${price.toFixed(2)}
                </span>
              )}
            </div>

            {discount && discount.type === "TEMPORARY" && discount.endsAt && (
              <div className="mt-4 border-t border-border/50 pt-4">
                <CountdownTimer endsAt={discount.endsAt} variant="large" />
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="mt-8">
            <h3 className="text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Acerca de este producto</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Beneficios */}
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-xl border border-border/40">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span>Compra protegida y garantizada</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/30 p-3 rounded-xl border border-border/40">
              <Truck className="h-5 w-5 text-blue-500" />
              <span>Envío seguro y rápido a todo el país</span>
            </div>
          </div>

          {/* Botón y Stock */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-bold ${product.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
                {product.stock > 0 ? `Stock disponible: ${product.stock} unidades` : "Agotado temporalmente"}
              </span>
            </div>
            
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={product.images[0] ?? "https://placehold.co/600x600?text=Sin+imagen"}
              price={finalPrice}
              stock={product.stock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}