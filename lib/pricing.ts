import type { Discount } from "@/app/generated/prisma/client";

export function getActiveDiscount(discounts: Discount[]): Discount | null {
  const now = new Date();
  return (
    discounts.find((d) => {
      if (!d.isActive) return false;
      if (d.startsAt > now) return false;
      if (d.endsAt && d.endsAt < now) return false;
      return true;
    }) ?? null
  );
}

export function calculateFinalPrice(price: number, discount: Discount | null) {
  if (!discount) return price;
  const amount = price * (Number(discount.percentage) / 100);
  return Number((price - amount).toFixed(2));
}