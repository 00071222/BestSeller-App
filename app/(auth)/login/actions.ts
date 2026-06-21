"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas. Verifica tu correo y contraseña.";
        default:
          return "Algo salió mal. Intenta de nuevo.";
      }
    }
    throw error; // re-lanza el error interno de redirect de Auth.js
  }
}
