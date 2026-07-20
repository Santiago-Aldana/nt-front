"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Trash2,
  Plus,
} from "lucide-react";

import ConfirmModal from "./ConfirmModal";
import NuevaTareaModal from "./NuevaTareaModal";

import { apiFetch } from "../../../../lib/api";

type Maquina = {
  id: number;
  nombre: string;
};

type Tarea = {
  id: number;
  documentId: string;
  referenciaNueva: string;
  estado: "pendiente" | "completada";
  maquina: Maquina;
  creadoPor: {
    id: number;
    username: string;
  };
  createdAt: string;
};

type Usuario = {
  id: number;
  maquinasAsignadas: Maquina[];
};

export default function TareasPage() {
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [tareas, setTareas] =
    useState<Tarea[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [tareaACompletar, setTareaACompletar] =
    useState<Tarea | null>(null);

  const [tareaAEliminar, setTareaAEliminar] =
    useState<Tarea | null>(null);

  const [mostrarNuevaTarea, setMostrarNuevaTarea] =
    useState(false);

  async function cargarTodo() {
    setCargando(true);

    try {
      const resUsuario = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=maquinasAsignadas`
      );

      if (!resUsuario.ok) {
        return;
      }

      const datosUsuario = await resUsuario.json();

      const maquinasUnicas = Array.from(
        new Map(
          (
            datosUsuario.maquinasAsignadas ?? []
          ).map((m: any) => [
            m.documentId,
            m,
          ])
        ).values()
      ) as Maquina[];

      const usuarioActual: Usuario = {
        ...datosUsuario,
        maquinasAsignadas: maquinasUnicas,
      };

      setUsuario(usuarioActual);

      const idsMaquinas =
        maquinasUnicas.map(
          (m) => m.id
        );

      if (idsMaquinas.length === 0) {
        setTareas([]);
        return;
      }

      const params = new URLSearchParams();

      idsMaquinas.forEach((id) => {
        params.append(
          "filters[maquina][id][$in]",
          String(id)
        );
      });

      params.append(
        "filters[estado][$eq]",
        "pendiente"
      );

      params.append(
        "populate[maquina]",
        "true"
      );

      params.append(
        "populate[creadoPor]",
        "true"
      );

      params.append(
        "sort",
        "createdAt:desc"
      );

      const resTareas = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tareas?${params.toString()}`
      );

      if (!resTareas.ok) {
        return;
      }

      const datosTareas =
        await resTareas.json();

      setTareas(
        datosTareas.data ?? []
      );
    } catch (error) {
      console.error(
        "Error al cargar tareas:",
        error
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  async function confirmarCompletar() {
    if (
      !tareaACompletar ||
      !usuario
    ) {
      return;
    }

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tareas/${tareaACompletar.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              estado: "completada",
              completadoPor: usuario.id,
            },
          }),
        }
      );

      if (!res.ok) {
  const texto = await res.text();

  console.error(
    "Error al completar tarea:",
    {
      status: res.status,
      statusText: res.statusText,
      respuesta: texto,
    }
  );

  return;
}

      setTareas((actuales) =>
        actuales.filter(
          (t) =>
            t.id !== tareaACompletar.id
        )
      );

      setTareaACompletar(null);
    } catch (error) {
      console.error(
        "Error de red al completar tarea:",
        error
      );
    }
  }

  async function confirmarEliminar() {
    if (!tareaAEliminar) {
      return;
    }

    try {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tareas/${tareaAEliminar.documentId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();

        console.error(
          "Error al eliminar tarea:",
          data
        );

        return;
      }

      setTareas((actuales) =>
        actuales.filter(
          (t) =>
            t.id !== tareaAEliminar.id
        )
      );

      setTareaAEliminar(null);
    } catch (error) {
      console.error(
        "Error de red al eliminar tarea:",
        error
      );
    }
  }

  if (cargando) {
    return (
      <main className="p-5 text-sm text-trenza-texto/60">
        Cargando tareas...
      </main>
    );
  }

  return (
    <main className="p-4 pb-24">
      <h1 className="font-display font-medium text-lg text-trenza-texto mb-4">
        Mis tareas
      </h1>

      {tareas.length === 0 && (
        <p className="text-sm text-trenza-texto/60">
          No tienes tareas pendientes.
        </p>
      )}

      <div className="flex flex-col gap-2.5">
        {tareas.map((tarea) => {
          const esCreador =
            tarea.creadoPor?.id ===
            usuario?.id;

          const fecha = new Date(
            tarea.createdAt
          ).toLocaleString("es-CO", {
            day: "2-digit",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
          });

          return (
            <div
              key={tarea.id}
              className="bg-white rounded-xl p-3.5 border border-black/5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-trenza-texto">
                    Máquina{" "}
                    {tarea.maquina?.nombre}
                  </p>

                  <p className="text-xs text-trenza-texto/70 mt-0.5">
                    Cambiar a referencia{" "}
                    {tarea.referenciaNueva}
                  </p>

                  <p className="text-[11px] text-trenza-texto/40 mt-1.5">
                    Creado por{" "}
                    {tarea.creadoPor?.username}
                    {" · "}
                    {fecha}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setTareaACompletar(tarea)
                    }
                    aria-label="Completar tarea"
                  >
                    <CheckCircle2
                      size={22}
                      className="text-trenza-indigo"
                    />
                  </button>

                  {esCreador && (
                    <button
                      onClick={() =>
                        setTareaAEliminar(tarea)
                      }
                      aria-label="Eliminar tarea"
                    >
                      <Trash2
                        size={22}
                        className="text-trenza-ocre"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() =>
          setMostrarNuevaTarea(true)
        }
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-trenza-ocre flex items-center justify-center"
        aria-label="Agregar tarea"
      >
        <Plus
          size={26}
          className="text-trenza-crema"
        />
      </button>

      {tareaACompletar && (
        <ConfirmModal
          titulo="Completar tarea"
          mensaje={`¿Confirmas que ya cambiaste la máquina ${tareaACompletar.maquina?.nombre} a la referencia ${tareaACompletar.referenciaNueva}?`}
          textoConfirmar="Sí, completar"
          onConfirmar={confirmarCompletar}
          onCancelar={() =>
            setTareaACompletar(null)
          }
        />
      )}

      {tareaAEliminar && (
        <ConfirmModal
          titulo="Eliminar tarea"
          mensaje="Esta acción no se puede deshacer. ¿Seguro que quieres eliminarla?"
          textoConfirmar="Sí, eliminar"
          colorConfirmar="rojo"
          onConfirmar={confirmarEliminar}
          onCancelar={() =>
            setTareaAEliminar(null)
          }
        />
      )}

      {mostrarNuevaTarea && usuario && (
        <NuevaTareaModal
          maquinas={usuario.maquinasAsignadas}
          usuarioId={usuario.id}
          onCreada={(t) => {
            setTareas((actuales) => [
              t,
              ...actuales,
            ]);

            setMostrarNuevaTarea(false);
          }}
          onCancelar={() =>
            setMostrarNuevaTarea(false)
          }
        />
      )}
    </main>
  );
}