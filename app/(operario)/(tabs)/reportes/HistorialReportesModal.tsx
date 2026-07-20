"use client";

import { X } from "lucide-react";

type Maquina = {
  id: number;
  nombre: string;
};

type Problema = {
  id: number;
  nombre: string;
};

type Reporte = {
  id: number;
  detalles: string;
  createdAt: string;
  fechaSolucion: string | null;
  maquina: Maquina;
  problema: Problema;
  creadoPor: {
    id: number;
    username: string;
  };
  solucionadoPor?: {
    id: number;
    username: string;
  } | null;
};

type Props = {
  reportes: Reporte[];
  onCerrar: () => void;
};

export default function HistorialReportesModal({
  reportes,
  onCerrar,
}: Props) {
  const reportesOrdenados = [...reportes].sort((a, b) => {
    const fechaA = new Date(a.fechaSolucion ?? a.createdAt).getTime();
    const fechaB = new Date(b.fechaSolucion ?? b.createdAt).getTime();

    return fechaB - fechaA;
  });

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
      onClick={onCerrar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[80vh] bg-white rounded-2xl p-5 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-base font-medium text-trenza-texto">
            Historial de reportes
          </p>

          <button
            onClick={onCerrar}
            aria-label="Cerrar historial"
          >
            <X size={20} className="text-trenza-texto/60" />
          </button>
        </div>

        <div className="overflow-y-auto flex flex-col gap-2.5 pr-1">
          {reportesOrdenados.length === 0 && (
            <p className="text-sm text-trenza-texto/60">
              No tienes reportes solucionados.
            </p>
          )}

          {reportesOrdenados.map((reporte) => {
            const fechaCreacion = new Date(
              reporte.createdAt
            ).toLocaleString("es-CO", {
              day: "2-digit",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            });

            const fechaSolucion = reporte.fechaSolucion
              ? new Date(reporte.fechaSolucion).toLocaleString("es-CO", {
                  day: "2-digit",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : null;

            return (
              <div
                key={reporte.id}
                className="bg-trenza-fondo/40 rounded-xl p-3.5 border border-black/5"
              >
                <p className="text-sm font-medium text-trenza-texto">
                  Máquina {reporte.maquina?.nombre}
                </p>

                <p className="text-xs text-trenza-ocre mt-0.5">
                  {reporte.problema?.nombre}
                </p>

                <p className="text-sm text-trenza-texto/80 mt-2">
                  {reporte.detalles}
                </p>

                <div className="mt-2.5 flex flex-col gap-0.5">
                  <p className="text-[11px] text-trenza-texto/40">
                    Creado por {reporte.creadoPor?.username} · {fechaCreacion}
                  </p>

                  {fechaSolucion && (
                    <p className="text-[11px] text-green-700/70">
                      Solucionado por{" "}
                      {reporte.solucionadoPor?.username ?? "—"} ·{" "}
                      {fechaSolucion}
                    </p>
                  )}
                </div>

                <div className="mt-3">
                  <span className="inline-flex text-[11px] px-2.5 py-1 rounded-lg bg-green-50 text-green-700">
                    Solucionado
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}