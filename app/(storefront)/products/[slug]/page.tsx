import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/data/products";
import { getActiveDiscount, calculateFinalPrice } from "@/lib/pricing";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

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
  const cover = product.images[0] ?? "https://placehold.co/600x600?text=Sin+imagen";

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
        <Image src={cover} alt={product.name} fill className="object-cover" />
        {discount && (
          <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-500">
            -{discount.percentage.toString()}%
          </Badge>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{product.brand?.name}</p>
        <h1 className="text-2xl font-bold mt-1">{product.name}</h1>

        <div className="mt-4 flex items-baseline gap-3">
          {discount ? (
            <>
              <span className="text-2xl font-semibold">${finalPrice.toFixed(2)}</span>
              <span className="text-muted-foreground line-through">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-semibold">${price.toFixed(2)}</span>
          )}
        </div>

        <p className="mt-6 text-muted-foreground">{product.description}</p>
        <p className="mt-4 text-sm">
          {product.stock > 0 ? `${product.stock} unidades disponibles` : "Agotado temporalmente"}
        </p>

        <AddToCartButton
          productId={product.id}
          slug={product.slug}
          name={product.name}
          image={cover}
          price={finalPrice}
          stock={product.stock}
        />
      </div>
    </div>
  );
}