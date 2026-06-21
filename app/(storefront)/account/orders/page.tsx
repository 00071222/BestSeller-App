import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium">Pagado</span>;
      case "PENDING":
        return <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 text-xs px-2.5 py-0.5 rounded-full font-medium">Pendiente</span>;
      case "CANCELLED":
        return <span className="bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 text-xs px-2.5 py-0.5 rounded-full font-medium">Cancelado</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 dark:bg-gray-850 dark:text-gray-400 text-xs px-2.5 py-0.5 rounded-full font-medium">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>
      
      {orders.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Aún no has realizado ninguna compra.</p>
            <Button asChild>
              <Link href="/products">Ver catálogo de productos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 border-b flex flex-row flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Fecha del pedido</p>
                    <p className="font-medium mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Total</p>
                    <p className="font-semibold text-primary mt-0.5">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Código de Pedido</p>
                    <p className="font-mono mt-0.5 text-xs text-muted-foreground">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.productNameSnapshot}</p>
                        <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
