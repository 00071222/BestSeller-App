import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true, discounts: true }
  });
  console.dir(products, { depth: null });
}

main().catch(console.error);
