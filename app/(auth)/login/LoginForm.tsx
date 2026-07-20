"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  guardarToken,
  guardarRol,
} from "../../../lib/cookies";

export default function LoginForm() {
  const router = useRouter();

  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setCargando(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            identifier: codigo,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      guardarToken(data.jwt);
      guardarRol(data.user.rol);

      if (data.user.rol === "administrador") {
        router.replace("/dashboard");
      } else {
        router.replace("/bienvenida");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full"
    >
      <div>
        <label className="text-xs text-trenza-azul/70 block mb-1">
          Código de operario
        </label>

        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Ej: OP-014"
          className="w-full h-12 rounded-lg border border-trenza-indigo/20 bg-white px-4 text-base text-trenza-azul focus:outline-none focus:ring-2 focus:ring-[#C97D2E]"
          required
        />
      </div>

      <div>
        <label className="text-xs text-trenza-azul/70 block mb-1">
          Contraseña
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          className="w-full h-12 rounded-lg border border-trenza-indigo/20 bg-white px-4 text-base text-trenza-azul focus:outline-none focus:ring-2 focus:ring-[#C97D2E]"
          required
        />
      </div>

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="h-12 rounded-lg bg-trenza-ocre text-trenza-crema text-sm font-medium mt-2 disabled:opacity-60"
      >
        {cargando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}