import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getActiveDiscount, calculateFinalPrice } from "@/lib/pricing";
import type { Product, Discount, Category } from "@/app/generated/prisma/client";

type ProductWithRelations = Product & { category: Category; discounts: Discount[] };

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const discount = getActiveDiscount(product.discounts);
  const price = Number(product.price);
  const finalPrice = calculateFinalPrice(price, discount);
  const cover = product.images[0] ?? "https://placehold.co/600x600?text=Sin+imagen";

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="overflow-hidden h-full transition-shadow hover:shadow-lg">
        <div className="relative aspect-square bg-muted">
          <Image
            src={cover}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {discount && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-500">
              -{discount.percentage.toString()}%
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">{product.category.name}</p>
          <h3 className="font-medium line-clamp-2">{product.name}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-baseline gap-2">
          {discount ? (
            <>
              <span className="font-semibold">${finalPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-semibold">${price.toFixed(2)}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}