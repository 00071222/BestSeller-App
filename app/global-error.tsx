"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center font-sans dark:bg-gray-900">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
            ¡Algo salió mal a nivel global!
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Ocurrió un error inesperado en la aplicación.
          </p>
          <button
            onClick={() => reset()}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
