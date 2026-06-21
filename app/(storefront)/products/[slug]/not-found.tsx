import Link from "next/link";

export default function ProductoNoEncontrado() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-xl font-semibold">Producto no encontrado</h2>
      <Link href="/products" className="underline mt-2 inline-block">
        Volver al catálogo
      </Link>
    </div>
  );
}