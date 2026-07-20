"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, History, Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import ConfirmReporteModal from "./ConfirmReporteModal";
import NuevoReporteModal from "./NuevoReporteModal";
import HistorialReportesModal from "./HistorialReportesModal";

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
  documentId: string;
  detalles: string;
  estado: "pendiente" | "solucionado";
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

type Usuario = {
  id: number;
  username: string;
  maquinasAsignadas: Maquina[];
};

export default function ReportesPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarNuevoReporte, setMostrarNuevoReporte] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const [reporteASolucionar, setReporteASolucionar] =
    useState<Reporte | null>(null);

  async function cargarTodo() {
    setCargando(true);

    try {
      const resUsuario = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=maquinasAsignadas`
      );

      const datosUsuario = await resUsuario.json();

      if (!resUsuario.ok || !datosUsuario?.id) {
        console.error("Error al cargar usuario:", datosUsuario);
        return;
      }

      const maquinasUnicas = Array.from(
        new Map(
          (datosUsuario.maquinasAsignadas ?? []).map((maquina: Maquina) => [
            maquina.id,
            maquina,
          ])
        ).values()
      );

      const usuarioActual: Usuario = {
        ...datosUsuario,
        maquinasAsignadas: maquinasUnicas,
      };

      setUsuario(usuarioActual);

      const resProblemas = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/problemas?filters[activo][$eq]=true&sort=nombre:asc`
      );

      const datosProblemas = await resProblemas.json();

      if (resProblemas.ok) {
        setProblemas(datosProblemas.data ?? []);
      }

      const params = new URLSearchParams();

      params.append(
        "filters[creadoPor][id][$eq]",
        String(datosUsuario.id)
      );

      params.append("populate[maquina]", "true");
      params.append("populate[problema]", "true");
      params.append("populate[creadoPor]", "true");
      params.append("populate[solucionadoPor]", "true");
      params.append("sort", "createdAt:desc");

      const resReportes = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reportes?${params.toString()}`
      );

      const datosReportes = await resReportes.json();

      if (!resReportes.ok) {
        console.error("Error al cargar reportes:", datosReportes);
        setReportes([]);
        return;
      }

      setReportes(datosReportes.data ?? []);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  async function confirmarSolucionar() {
    if (!reporteASolucionar || !usuario) return;

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reportes/${reporteASolucionar.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              estado: "solucionado",
              solucionadoPor: usuario.id,
              fechaSolucion: new Date().toISOString(),
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.data) {
        console.error("Error al solucionar reporte:", {
          status: res.status,
          respuesta: data,
        });

        alert("No se pudo marcar el reporte como solucionado.");
        return;
      }

      setReporteASolucionar(null);
      await cargarTodo();
    } catch (error) {
      console.error("Error de red al solucionar reporte:", error);
      alert("No se pudo conectar con el servidor.");
    }
  }

  const reportesPendientes = reportes.filter(
    (reporte) => reporte.estado === "pendiente"
  );

  const reportesSolucionados = reportes.filter(
    (reporte) => reporte.estado === "solucionado"
  );

  if (cargando) {
    return (
      <main className="p-5 text-sm text-trenza-texto/60">
        Cargando reportes...
      </main>
    );
  }

  return (
    <main className="p-4 pb-24">
      <h1 className="font-display font-medium text-lg text-trenza-texto mb-4">
        Mis reportes
      </h1>

      {reportesPendientes.length === 0 && (
        <p className="text-sm text-trenza-texto/60">
          No tienes reportes pendientes.
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {reportesPendientes.map((reporte) => {
          const fechaCreacion = new Date(
            reporte.createdAt
          ).toLocaleString("es-CO", {
            day: "2-digit",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
          });

          return (
            <div
              key={reporte.id}
              className="bg-white rounded-xl p-3.5 border border-black/5"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-trenza-texto">
                    Máquina {reporte.maquina?.nombre}
                  </p>

                  <p className="text-xs text-trenza-ocre mt-0.5">
                    {reporte.problema?.nombre}
                  </p>

                  <p className="text-sm text-trenza-texto/80 mt-2">
                    {reporte.detalles}
                  </p>

                  <p className="text-[11px] text-trenza-texto/40 mt-2">
                    Creado por {reporte.creadoPor?.username} · {fechaCreacion}
                  </p>
                </div>

                <button
                  onClick={() => setReporteASolucionar(reporte)}
                  aria-label="Marcar reporte como solucionado"
                >
                  <CheckCircle2
                    size={22}
                    className="text-trenza-indigo"
                  />
                </button>
              </div>

              <div className="mt-3">
                <span className="inline-flex text-[11px] px-2.5 py-1 rounded-lg bg-trenza-crema text-trenza-ocre">
                  Pendiente
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-24 right-5 flex items-center gap-3">
        <button
          onClick={() => setMostrarHistorial(true)}
          className="fixed bottom-24 left-5 w-14 h-14 rounded-full bg-trenza-indigo flex items-center justify-center"
          aria-label="Ver historial de reportes"
        >
          <History size={25} className="text-trenza-crema" />
        </button>

        <button
          onClick={() => setMostrarNuevoReporte(true)}
           className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-trenza-ocre flex items-center justify-center"
          aria-label="Agregar reporte"
        >
          <Plus size={26} className="text-trenza-crema" />
        </button>
      </div>

      {reporteASolucionar && (
        <ConfirmReporteModal
          titulo="Solucionar reporte"
          mensaje={`¿Confirmas que el problema de la máquina ${reporteASolucionar.maquina?.nombre} ya fue solucionado?`}
          textoConfirmar="Sí, solucionar"
          onConfirmar={confirmarSolucionar}
          onCancelar={() => setReporteASolucionar(null)}
        />
      )}

      {mostrarNuevoReporte && usuario && (
        <NuevoReporteModal
          maquinas={usuario.maquinasAsignadas}
          problemas={problemas}
          usuarioId={usuario.id}
          onCreado={() => {
            setMostrarNuevoReporte(false);
            cargarTodo();
          }}
          onCancelar={() => setMostrarNuevoReporte(false)}
        />
      )}

      {mostrarHistorial && (
        <HistorialReportesModal
          reportes={reportesSolucionados}
          onCerrar={() => setMostrarHistorial(false)}
        />
      )}
    </main>
  );
}