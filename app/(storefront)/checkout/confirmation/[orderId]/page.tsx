import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ConfirmacionPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const session = await auth();
  if (!session?.user) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
      <h1 className="text-2xl font-bold mt-4">¡Pago exitoso!</h1>
      <p className="text-muted-foreground mt-2">
        Tu pedido #{order.id.slice(-8)} fue confirmado.
      </p>

      <div className="border rounded-lg mt-6 p-6 text-left space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity}x {item.productNameSnapshot}</span>
            <span>${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold pt-2 border-t">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center mt-8">
        <Button asChild variant="outline"><Link href="/products">Seguir comprando</Link></Button>
        <Button asChild><Link href="/account/orders">Ver mis pedidos</Link></Button>
      </div>
    </div>
  );
}