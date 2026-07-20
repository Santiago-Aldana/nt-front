"use client";

import { useEffect, useState } from "react";
import { Circle, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Maquina = {
  id: number;
  nombre: string;
  referenciaActual: string | null;
  estado:
    | "activa"
    | "detenida"
    | "mantenimiento";
};

export default function Maquinas() {
  const [maquinas, setMaquinas] = useState<
    Maquina[]
  >([]);

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {
    async function cargarMaquinas() {
      try {
        const res = await apiFetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/maquinas?sort=nombre:asc`
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(
            "Error al cargar máquinas:",
            data
          );

          return;
        }

        setMaquinas(data.data ?? []);
      } catch (error) {
        console.error(
          "Error de red al cargar máquinas:",
          error
        );
      } finally {
        setCargando(false);
      }
    }

    cargarMaquinas();
  }, []);

  return (
    <section>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-medium text-trenza-texto">
          Máquinas
        </h1>

        <p className="text-sm text-trenza-texto/60 mt-1">
          Estado actual de las máquinas de producción
        </p>
      </div>

      {cargando ? (
        <div className="flex items-center gap-2 text-sm text-trenza-texto/60">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Cargando máquinas...
        </div>
      ) : maquinas.length === 0 ? (
        <p className="text-sm text-trenza-texto/60">
          No hay máquinas registradas.
        </p>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {maquinas.map((maquina) => (
            <div
              key={maquina.id}
              className="bg-white rounded-2xl border border-black/5 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-medium text-trenza-texto">
                    {maquina.nombre}
                  </h2>

                  <p className="text-sm text-trenza-texto/55 mt-1">
                    {maquina.referenciaActual ||
                      "Sin referencia"}
                  </p>
                </div>

                <Circle
                  size={13}
                  fill="currentColor"
                  className={
                    maquina.estado === "activa"
                      ? "text-green-500"
                      : maquina.estado === "detenida"
                        ? "text-red-500"
                        : "text-trenza-ocre"
                  }
                />
              </div>

              <div className="mt-5">
                <span className="inline-flex rounded-lg bg-trenza-crema px-3 py-1.5 text-xs text-trenza-texto">
                  {maquina.estado === "activa"
                    ? "Activa"
                    : maquina.estado === "detenida"
                      ? "Detenida"
                      : "Mantenimiento"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}