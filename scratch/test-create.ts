import "dotenv/config";
import { prisma } from "../lib/prisma";
import { slugify } from "../lib/utils";

async function main() {
  const name = "Test Product " + Date.now();
  const description = "This is a test product";
  const category = await prisma.category.findFirst();
  if (!category) {
    console.error("No category found");
    return;
  }
  const categoryId = category.id;
  const price = 12.99;
  const stock = 10;
  const images = ["https://placehold.co/600x600?text=TestProduct"];
  const isActive = true;

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  console.log("Creating product with slug:", slug);
  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      images,
      price,
      stock,
      categoryId,
      isActive,
    },
  });
  console.log("Created successfully:", product);
}

main().catch(console.error);
