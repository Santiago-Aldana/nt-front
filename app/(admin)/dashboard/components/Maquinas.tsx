"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";

import { apiFetch } from "@/lib/api";
import MaquinaModal from "./MaquinaModal";

type Usuario = {
  id: number;
  username: string;
  avatar?: {
    url: string;
  } | null;
};

type TareaPendiente = {
  id: number;
  documentId: string;
  referenciaNueva: string;
  estado: "pendiente" | "completada";
  createdAt: string;
  creadoPor: Usuario | null;
};

type Maquina = {
  id: number;
  documentId: string;
  nombre: string;
  referenciaActual: string | null;
  estado: "activa" | "detenida" | "mantenimiento";
  maquinasAsignadas: Usuario[];
  tareas: TareaPendiente[];
};

function obtenerNumeroMaquina(nombre: string) {
  const coincidencia = nombre.match(/\d+/);

  return coincidencia
    ? Number(coincidencia[0])
    : 0;
}

const solidos = [
  {
    nombre: "Solido 1",
    inicio: 1,
    fin: 22,
  },
  {
    nombre: "Solido 2",
    inicio: 23,
    fin: 44,
  },
  {
    nombre: "Solido 3",
    inicio: 45,
    fin: 72,
  },
];

export default function Maquinas() {
  const [maquinas, setMaquinas] = useState<
    Maquina[]
  >([]);

  const [cargando, setCargando] =
    useState(true);

  const [maquinaSeleccionada, setMaquinaSeleccionada] =
    useState<Maquina | null>(null);

  useEffect(() => {
    async function cargarMaquinas() {
      try {
        const res = await apiFetch(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/maquinas?populate[maquinasAsignadas]=true&populate[tareas][filters][estado][$eq]=pendiente&populate[tareas][populate] [creadoPor][populate]=avatar&sort=nombre:asc&pagination[pageSize]=100`
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

  function obtenerMaquinasDelSolido(
    inicio: number,
    fin: number
  ) {
    return maquinas
      .filter((maquina) => {
        const numero = obtenerNumeroMaquina(
          maquina.nombre
        );

        return numero >= inicio && numero <= fin;
      })
      .sort(
        (a, b) =>
          obtenerNumeroMaquina(a.nombre) -
          obtenerNumeroMaquina(b.nombre)
      );
  }

  return (
    <section>
      <div className="mb-7">
        <h1 className="font-display text-3xl font-medium text-trenza-texto">
          Máquinas
        </h1>

        <p className="text-sm text-trenza-texto/60 mt-1">
          Estado actual de las máquinas de producción
        </p>
      </div>

      {cargando ? (
        <p className="text-sm text-trenza-texto/60">
          Cargando máquinas...
        </p>
      ) : maquinas.length === 0 ? (
        <p className="text-sm text-trenza-texto/60">
          No hay máquinas registradas.
        </p>
      ) : (
        <div className="flex flex-col gap-10">
          {solidos.map((solido) => {
            const maquinasDelSolido =
              obtenerMaquinasDelSolido(
                solido.inicio,
                solido.fin
              );

            return (
              <section key={solido.nombre}>
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="font-display text-lg font-medium text-trenza-texto">
                    {solido.nombre}
                  </h2>

                  <div className="h-px flex-1 bg-black/10" />
                </div>

                {maquinasDelSolido.length === 0 ? (
                  <p className="text-sm text-trenza-texto/50">
                    No hay máquinas en este sólido.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                    {maquinasDelSolido.map(
                      (maquina) => {
                        const numero =
                          obtenerNumeroMaquina(
                            maquina.nombre
                          );

                        const tieneTareaPendiente =
                          maquina.tareas?.some(
                            (tarea) =>
                              tarea.estado ===
                              "pendiente"
                          );

                        return (
                          <button
                            key={maquina.id}
                            onClick={() =>
                              setMaquinaSeleccionada(
                                maquina
                              )
                            }
                            className="bg-white rounded-xl border border-black/5 p-3.5 text-left hover:border-trenza-indigo/30 hover:shadow-sm transition flex gap-3"
                          >
                            <div
                              className={`w-1.5 self-stretch rounded-full shrink-0 ${
                                maquina.estado ===
                                "activa"
                                  ? "bg-green-500"
                                  : maquina.estado ===
                                      "detenida"
                                    ? "bg-red-500"
                                    : "bg-trenza-ocre"
                              }`}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-display text-base font-medium text-trenza-texto truncate">
                                  {maquina.nombre}
                                </h3>

                                {tieneTareaPendiente && (
                                  <ClipboardList
                                    size={17}
                                    className="text-trenza-ocre shrink-0"
                                    aria-label="Cambio de referencia pendiente"
                                  />
                                )}
                              </div>

                              <p className="text-xs text-trenza-texto/55 mt-0.5 truncate">
                                {maquina.referenciaActual ||
                                  "Sin referencia"}
                              </p>

                              <p className="text-[11px] text-trenza-texto/45 mt-2">
                                Máquina {numero}
                              </p>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {maquinaSeleccionada && (
        <MaquinaModal
          maquina={maquinaSeleccionada}
          onCerrar={() =>
            setMaquinaSeleccionada(null)
          }
        />
      )}
    </section>
  );
}