## Parte 1: Guía Práctica del Desarrollador (Next.js + Modern Stack)

### 1. Inicialización del Proyecto

Iniciaremos con la última versión de Next.js utilizando el App Router, TypeScript y Tailwind CSS.

```bash
npx create-next-app@latest mi-proyecto
```

**Configuración recomendada en el prompt interactivo:**

* TypeScript: `Yes`
* ESLint: `Yes`
* Tailwind CSS: `Yes`
* `src/` directory: `Yes` *(Ayuda a separar el código fuente de la configuración)*
* App Router: `Yes`
* Customize default import alias (`@/*`): `Yes`

### 2. Instalación de la Pila de Herramientas (Stack)

Instala las dependencias clave que mencionaste.

```bash
# Estado de servidor, cliente y peticiones
npm install @tanstack/react-query zustand axios

# Autenticación (Auth.js / NextAuth v5)
npm install next-auth@beta

# ORM y Base de Datos
npm install prisma --save-dev
npm install @prisma/client
```

### 3. Buenas Prácticas con TypeScript

Para mantener un código escalable y predecible, TS debe ser estricto.

* **`interface` vs `type`:** * Usa **`interface`** para declarar la forma de los objetos, modelos de base de datos o propiedades de componentes (`Props`). Las interfaces son extensibles y mejores para la programación orientada a objetos.
* Usa **`type`** para alias, uniones (`TypeA | TypeB`), intersecciones (`TypeA & TypeB`) y tuplas.


* **Estructura de archivos:** Crea una carpeta `src/types/` para tus declaraciones globales.

```typescript
// src/types/user.ts
export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export type UserRole = 'ADMIN' | 'USER' | 'GUEST';
```

### 4. Prisma: Inicialización y Esquema

Prisma es excelente para la seguridad de tipos desde la base de datos hasta el frontend.

1. **Inicializar Prisma:**
```bash
npx prisma init
```


Esto creará un archivo `prisma/schema.prisma` y un `.env`.
2. **Definir el Esquema (Ejemplo):**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // o mysql, sqlite
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```


3. **Sincronizar y Generar Tipos:**
```bash
# Para desarrollo: empuja el esquema a la DB
npx prisma db push 

# Genera el cliente tipado para TypeScript
npx prisma generate
```


*Nota de oro para Next.js:* Crea un archivo `src/lib/prisma.ts` que instancie el cliente de Prisma globalmente para evitar agotar las conexiones a la base de datos durante el hot-reload en desarrollo.

### 5. Arquitectura de Estado y Peticiones

La separación de responsabilidades es crucial aquí:

* **Zustand (Estado del Cliente):** Úsalo *solo* para estados de UI síncronos globales (ej. abrir/cerrar modales, preferencias de usuario, carrito de compras temporal).
* **TanStack Query + Axios (Estado del Servidor):** Úsalo para todo el *fetching* de datos asíncronos en el cliente. Axios maneja la petición (y los interceptores de tokens), y React Query maneja el caché, los reintentos y la revalidación.
* **Server Components:** Siempre que sea posible, haz fetching directamente en el componente de servidor (`async/await` en `page.tsx`) usando Prisma o `fetch`. Deja TanStack Query solo para componentes interactivos (`'use client'`).

### 6. Diseño Web Moderno y Responsivo

* **Mobile-First:** Con Tailwind, siempre diseña primero para pantallas pequeñas (ej. `p-4`) y luego usa prefijos para pantallas grandes (`md:p-8 lg:p-12`).
* **Librería de Componentes recomendada:** Considera usar **shadcn/ui**. No es una dependencia instalable, sino componentes construidos sobre Tailwind y Radix UI que copias a tu proyecto. Es el estándar actual para diseños limpios y accesibles.

## Parte 2: Prompt de Contexto para el Agente de IA

> **System Role:** Eres un Ingeniero de Software Senior experto en desarrollo Fullstack utilizando Next.js (App Router), TypeScript, Tailwind CSS, Prisma, TanStack Query, Zustand y Auth.js. Tu objetivo es generar código de calidad de producción, mantenible, seguro y escalable.
> **Directrices Arquitectónicas y Buenas Prácticas (Reglas Estrictas):**
> 1. **Next.js App Router:** Utiliza exclusivamente el paradigma del App Router (`app/`). No utilices el Pages Router (`pages/`).
> 2. **React Server Components (RSC):** Prioriza los Server Components. Usa la directiva `'use client'` únicamente en los componentes hojas (leaf components) que requieran interactividad (hooks, eventos del DOM) o manejen estado del cliente.
> 3. **TypeScript Estricto:** Prohibido el uso de `any`. Todo debe estar tipado. Usa `interface` para objetos y modelos, y `type` para uniones o tipos primitivos.
> 4. **Manejo de Estado:**
> * Usa **Zustand** exclusivamente para el estado global del cliente (UI, modales, etc.).
> * Usa **TanStack Query (React Query)** combinado con **Axios** para el estado del servidor en el cliente (mutaciones, polling, caché).
> 
> 
> 5. **Base de Datos (Prisma):** Al proveer código interactuando con la base de datos, asume el uso de Prisma ORM. Mantén el código de acceso a datos en la capa del servidor (Server Actions o Route Handlers).
> 6. **Diseño y Estilos:** Usa **Tailwind CSS**. Aplica siempre un enfoque "Mobile-First" para el diseño responsivo. Genera interfaces modernas, limpias y accesibles.
> 7. **Estructura de Archivos:** Asume un directorio `src/` con la siguiente estructura lógica: `app/`, `components/` (dividido en `ui/` y `shared/`), `lib/`, `hooks/`, `store/` (para Zustand) y `types/`.
> 8. **Clean Code:** Mantén funciones pequeñas y modulares. Sigue los principios SOLID. Extrae la lógica de negocio compleja fuera de los componentes de UI.
> 
> 
> Cuando te pida generar una funcionalidad, incluye el código de los componentes necesarios, los tipos/interfaces involucrados y la lógica de estado o base de datos correspondiente, explicando brevemente el "por qué" de las decisiones tomadas.
