This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Arquitecture
```
bestseller/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── app/
│   ├── generated/
│   │   └── prisma/                  # cliente generado (tu output actual)
│   │
│   ├── (storefront)/                # grupo público — no agrega segmento a la URL
│   │   ├── layout.tsx               # navbar + footer de la tienda
│   │   ├── page.tsx                 # "/"  → landing
│   │   ├── productos/
│   │   │   ├── page.tsx             # "/productos"
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # "/productos/labial-mate-rojo"
│   │   ├── categorias/
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # "/categorias/avon"
│   │   ├── carrito/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx             # simulación de pago exitoso
│   │   └── cuenta/                  # requiere sesión (cliente logueado)
│   │       ├── layout.tsx           # valida sesión, redirige a /login si no hay
│   │       ├── page.tsx             # resumen de perfil
│   │       ├── pedidos/
│   │       │   └── page.tsx         # historial de compras
│   │       └── favoritos/
│   │           └── page.tsx
│   │
│   ├── (auth)/                      # grupo de autenticación, layout minimalista
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── registro/
│   │       └── page.tsx
│   │
│   ├── admin/                       # segmento real "/admin", protegido por rol
│   │   ├── layout.tsx               # sidebar admin + valida role === "ADMIN"
│   │   ├── page.tsx                 # "/admin" → dashboard de ventas
│   │   ├── productos/
│   │   │   ├── page.tsx             # listado + stock
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── editar/
│   │   │           └── page.tsx
│   │   ├── ventas/
│   │   │   └── page.tsx             # historial completo de órdenes
│   │   └── usuarios/
│   │       └── page.tsx             # gestión de clientes registrados
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── register/
│   │   │   └── route.ts
│   │   └── checkout/
│   │       └── route.ts             # simula confirmación de pago
│   │
│   ├── layout.tsx                   # layout raíz: <html>, <body>, Providers
│   ├── providers.tsx                # QueryClientProvider + SessionProvider
│   └── globals.css
│
├── components/
│   ├── ui/                          # generado por shadcn (button, card, dialog...)
│   ├── layout/                      # Navbar, Footer, AdminSidebar
│   ├── products/                    # ProductCard, ProductGrid, ProductForm
│   ├── cart/                        # CartItem, CartSummary
│   └── admin/                       # SalesChart, UsersTable, etc.
│
├── lib/
│   ├── prisma.ts                    # singleton del PrismaClient
│   ├── auth.config.ts               # config liviana (pages, callbacks.authorized)
│   ├── auth.ts                      # NextAuth() con el provider de Credentials
│   └── utils.ts                     # helpers (formatear precio, slugify, etc.)
│
├── store/
│   └── cart-store.ts                # store de Zustand del carrito
│
├── hooks/
│   ├── use-products.ts              # queries de TanStack Query
│   ├── use-favorites.ts
│   └── use-orders.ts
│
├── types/
│   └── index.ts                     # tipos compartidos (Product, CartItem, etc.)
│
├── proxy.ts                         # reemplazo de middleware.ts en Next 16
└── .env
```

### Alternativo desde app/

```
app/
├── (storefront)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx                  # skeleton de la landing
│   ├── error.tsx
│   ├── productos/
│   │   ├── page.tsx
│   │   ├── loading.tsx              # grid de skeletons mientras carga el catálogo
│   │   ├── error.tsx
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── not-found.tsx        # producto inexistente o slug inválido
│   ├── categorias/
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       ├── loading.tsx
│   │       └── not-found.tsx
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── error.tsx                # si falla la simulación de pago
│   └── cuenta/
│       ├── layout.tsx
│       ├── loading.tsx
│       ├── error.tsx
│       ├── pedidos/
│       │   └── loading.tsx
│       └── favoritos/
│           └── loading.tsx
│
├── (auth)/
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── registro/
│       └── page.tsx
│
├── admin/
│   ├── layout.tsx
│   ├── loading.tsx                  # spinner del dashboard
│   ├── error.tsx                    # boundary general del panel admin
│   ├── page.tsx
│   ├── productos/
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── [id]/
│   │       └── editar/
│   │           ├── page.tsx
│   │           ├── loading.tsx
│   │           └── not-found.tsx
│   ├── ventas/
│   │   ├── page.tsx
│   │   └── loading.tsx
│   └── usuarios/
│       ├── page.tsx
│       └── loading.tsx
│
├── layout.tsx
├── loading.tsx                      # fallback global (poco común usarlo, pero existe)
├── error.tsx
├── global-error.tsx                 # único catch-all si falla el layout raíz
├── not-found.tsx                    # 404 genérico del sitio
├── providers.tsx
└── globals.css
```
