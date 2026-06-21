import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnAccount = nextUrl.pathname.startsWith("/cuenta");
      const isOnCheckout = nextUrl.pathname.startsWith("/checkout");

      if (isOnAdmin) {
        return isLoggedIn && auth.user.role === "ADMIN";
      }
      if (isOnAccount || isOnCheckout) {
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [], // los providers reales solo viven en auth.ts
} satisfies NextAuthConfig;