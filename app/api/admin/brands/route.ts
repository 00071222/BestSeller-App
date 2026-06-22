import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(brands);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { name } = await request.json();

  if (!name || name.trim() === "") {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.brand.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const brand = await prisma.brand.create({
    data: { name, slug },
  });

  return NextResponse.json(brand, { status: 201 });
}
