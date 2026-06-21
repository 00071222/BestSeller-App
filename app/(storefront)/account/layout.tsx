// app/(storefront)/account/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return <>{children}</>;
}