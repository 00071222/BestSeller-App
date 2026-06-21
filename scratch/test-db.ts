import { prisma } from "../lib/prisma";

async function test() {
  try {
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        language: true,
        theme: true,
      }
    });
    console.log("Success! User found:", user);
  } catch (error) {
    console.error("Prisma query failed:", error);
  }
}

test();
