"use client";

import { useEffect } from "react";
import { ClipboardList, X } from "lucide-react";

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
  nombre: string;
  referenciaActual: string | null;
  estado: "activa" | "detenida" | "mantenimiento";
  maquinasAsignadas: Usuario[];
  tareas: TareaPendiente[];
};

type MaquinaModalProps = {
  maquina: Maquina;
  onCerrar: () => void;
};

export default function MaquinaModal({
  maquina,
  onCerrar,
}: MaquinaModalProps) {
  useEffect(() => {
    function manejarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCerrar();
      }
    }

    document.addEventListener(
      "keydown",
      manejarTecla
    );

    return () => {
      document.removeEventListener(
        "keydown",
        manejarTecla
      );
    };
  }, [onCerrar]);

  function manejarClickFondo(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    if (e.target === e.currentTarget) {
      onCerrar();
    }
  }

  const colorEstado =
    maquina.estado === "activa"
      ? "bg-green-500"
      : maquina.estado === "detenida"
        ? "bg-red-500"
        : "bg-trenza-ocre";

  const textoEstado =
    maquina.estado === "activa"
      ? "Activa"
      : maquina.estado === "detenida"
        ? "Detenida"
        : "Mantenimiento";

  const tareaPendiente =
    maquina.tareas?.find(
      (tarea) =>
        tarea.estado === "pendiente"
    );

  const urlAvatar =
    tareaPendiente?.creadoPor?.avatar?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${tareaPendiente.creadoPor.avatar.url}`
      : null;

  const iniciales =
    tareaPendiente?.creadoPor?.username
      ?.slice(0, 2)
      .toUpperCase() ?? "";

  const fechaTarea = tareaPendiente
    ? new Date(
        tareaPendiente.createdAt
      ).toLocaleString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div
      onClick={manejarClickFondo}
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-trenza-texto">
              {maquina.nombre}
            </h2>

            <p className="text-sm text-trenza-texto/50 mt-1">
              Información de la máquina
            </p>
          </div>

          <button
            onClick={onCerrar}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 transition"
            aria-label="Cerrar"
          >
            <X
              size={18}
              className="text-trenza-texto/60"
            />
          </button>
        </div>

        <div className="h-px bg-black/5 my-5" />

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-trenza-texto/45">
              Nombre de la máquina
            </p>

            <p className="text-sm font-medium text-trenza-texto mt-1">
              {maquina.nombre}
            </p>
          </div>

          <div>
            <p className="text-xs text-trenza-texto/45">
              Referencia de la máquina
            </p>

            <p className="text-sm font-medium text-trenza-texto mt-1">
              {maquina.referenciaActual ||
                "Sin referencia"}
            </p>
          </div>

          <div>
            <p className="text-xs text-trenza-texto/45">
              Estado
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${colorEstado}`}
              />

              <span className="text-sm font-medium text-trenza-texto">
                {textoEstado}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs text-trenza-texto/45">
              Operarios asignados
            </p>

            {maquina.maquinasAsignadas?.length ===
            0 ? (
              <p className="text-sm text-trenza-texto/50 mt-2">
                No hay operarios asignados.
              </p>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                {maquina.maquinasAsignadas.map(
                  (operario) => (
                    <div
                      key={operario.id}
                      className="bg-trenza-crema rounded-lg px-3 py-2"
                    >
                      <p className="text-sm text-trenza-texto">
                        {operario.username}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {tareaPendiente && (
          <>
            <div className="h-px bg-black/5 my-5" />

            <div className="rounded-xl bg-trenza-crema p-4">
              <div className="flex items-center gap-2">
                <ClipboardList
                  size={18}
                  className="text-trenza-ocre"
                />

                <h3 className="text-sm font-medium text-trenza-texto">
                  Cambio de referencia pendiente
                </h3>
              </div>

              <div className="mt-4">
                <p className="text-xs text-trenza-texto/50">
                  Nueva referencia
                </p>

                <p className="text-base font-medium text-trenza-texto mt-1">
                  {tareaPendiente.referenciaNueva}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-trenza-texto/50">
                  Tarea creada por
                </p>

                <div className="flex items-center gap-3 mt-2">
                  {urlAvatar ? (
                    <img
                      src={urlAvatar}
                      alt="Avatar del creador de la tarea"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-trenza-ocre flex items-center justify-center text-xs font-medium text-trenza-crema">
                      {iniciales}
                    </div>
                  )}

                  <p className="text-sm font-medium text-trenza-texto">
                    {tareaPendiente.creadoPor
                      ?.username ?? "Usuario desconocido"}
                  </p>
                </div>
              </div>

              {fechaTarea && (
                <div className="mt-4">
                  <p className="text-xs text-trenza-texto/50">
                    Fecha y hora de creación
                  </p>

                  <p className="text-sm text-trenza-texto mt-1">
                    {fechaTarea}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        <button
          onClick={onCerrar}
          className="w-full h-11 rounded-lg bg-trenza-indigo text-trenza-crema text-sm font-medium mt-6 hover:opacity-90 transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}