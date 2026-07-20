"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

type Maquina = {
  id: number;
  nombre: string;
};

type Problema = {
  id: number;
  nombre: string;
};

type Props = {
  maquinas: Maquina[];
  problemas: Problema[];
  usuarioId: number;
  onCreado: () => void;
  onCancelar: () => void;
};

export default function NuevoReporteModal({
  maquinas,
  problemas,
  usuarioId,
  onCreado,
  onCancelar,
}: Props) {
  const [maquinaId, setMaquinaId] = useState<number | "">(
    maquinas[0]?.id ?? ""
  );

  const [problemaId, setProblemaId] = useState<number | "">(
    problemas[0]?.id ?? ""
  );

  const [detalles, setDetalles] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!maquinaId || !problemaId || !detalles.trim()) {
      return;
    }

    setGuardando(true);

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reportes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              detalles: detalles.trim(),
              estado: "pendiente",
              maquina: maquinaId,
              problema: problemaId,
              creadoPor: usuarioId,
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.data) {
        console.error("Error al crear reporte:", {
          status: res.status,
          respuesta: data,
        });

        alert("No se pudo crear el reporte.");
        return;
      }

      onCreado();
    } catch (error) {
      console.error("Error de red al crear reporte:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
      onClick={onCancelar}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-80 bg-white rounded-2xl p-5 flex flex-col gap-3.5"
      >
        <p className="text-base font-medium text-trenza-texto">
          Nuevo reporte
        </p>

        <div>
          <label className="text-xs text-trenza-texto/70 block mb-1">
            Máquina
          </label>

          <select
            value={maquinaId}
            onChange={(e) => setMaquinaId(Number(e.target.value))}
            className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm"
            required
          >
            {maquinas.map((maquina) => (
              <option key={maquina.id} value={maquina.id}>
                {maquina.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-trenza-texto/70 block mb-1">
            Problema
          </label>

          <select
            value={problemaId}
            onChange={(e) => setProblemaId(Number(e.target.value))}
            className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm"
            required
          >
            {problemas.map((problema) => (
              <option key={problema.id} value={problema.id}>
                {problema.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-trenza-texto/70 block mb-1">
            Detalles
          </label>

          <textarea
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
            placeholder="Describe lo ocurrido..."
            className="w-full min-h-24 rounded-lg border border-black/10 px-3 py-2 text-sm resize-none"
            required
          />
        </div>

        <div className="flex gap-2 mt-1.5">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 h-11 rounded-lg border border-black/10 text-sm"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={guardando}
            className="flex-1 h-11 rounded-lg bg-trenza-ocre text-trenza-crema text-sm font-medium disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Continuar"}
          </button>
        </div>
      </form>
    </div>
  );
}