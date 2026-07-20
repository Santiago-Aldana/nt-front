"use client";

import { useState } from "react";
import { apiFetch } from "../../../../lib/api";

type Maquina = {
  id: number;
  nombre: string;
};

type Props = {
  maquinas: Maquina[];
  usuarioId: number;
  onCreada: (tarea: any) => void;
  onCancelar: () => void;
};

export default function NuevaTareaModal({
  maquinas,
  usuarioId,
  onCreada,
  onCancelar,
}: Props) {
  const [maquinaId, setMaquinaId] = useState(
    maquinas[0]?.id ?? ""
  );

  const [referencia, setReferencia] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setGuardando(true);

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tareas?populate[maquina]=true&populate[creadoPor]=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              maquina: maquinaId,
              referenciaNueva: referencia,
              estado: "pendiente",
              creadoPor: usuarioId,
            },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.data) {
        console.log(
          "Error al crear tarea:",
          data
        );

        alert(
          "No se pudo crear la tarea. Revisa la consola para más detalle."
        );

        return;
      }

      console.log(
        "Respuesta de Strapi al crear tarea:",
        data
      );

      onCreada(data.data);
    } catch (error) {
      console.error(
        "Error de red al crear tarea:",
        error
      );

      alert(
        "No se pudo conectar con el servidor."
      );
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
          Nueva tarea
        </p>

        <div>
          <label className="text-xs text-trenza-texto/70 block mb-1">
            Máquina
          </label>

          <select
            value={maquinaId}
            onChange={(e) =>
              setMaquinaId(Number(e.target.value))
            }
            className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm"
            required
          >
            {maquinas.map((m) => (
              <option
                key={m.id}
                value={m.id}
              >
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-trenza-texto/70 block mb-1">
            Nueva referencia
          </label>

          <input
            type="text"
            value={referencia}
            onChange={(e) =>
              setReferencia(e.target.value)
            }
            placeholder="Ej: 122B0610"
            className="w-full h-11 rounded-lg border border-black/10 px-3 text-sm"
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
            {guardando
              ? "Guardando..."
              : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}