export interface PricingDiscount {
  id: string;
  type: "PERMANENT" | "TEMPORARY";
  percentage: string | number | { toString(): string };
  startsAt: string | Date;
  endsAt: string | Date | null;
  isActive: boolean;
  productId: string;
}

export function getActiveDiscount(discounts: PricingDiscount[]): PricingDiscount | null {
  const now = new Date();
  return (
    discounts.find((d) => {
      if (!d.isActive) return false;
      const starts = new Date(d.startsAt);
      const ends = d.endsAt ? new Date(d.endsAt) : null;
      if (starts > now) return false;
      if (ends && ends < now) return false;
      return true;
    }) ?? null
  );
}

export function calculateFinalPrice(price: number, discount: PricingDiscount | null) {
  if (!discount) return price;
  const amount = price * (Number(discount.percentage) / 100);
  return Number((price - amount).toFixed(2));
}