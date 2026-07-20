"use client";

import {
  Factory,
  ListChecks,
  FileWarning,
  Users,
  MessageCircle,
} from "lucide-react";
import PerfilAdmin from "./PerfilAdmin";

export type Seccion =
  | "maquinas"
  | "tareas"
  | "reportes"
  | "operarios"
  | "chat";

type SidebarProps = {
  seccionActiva: Seccion;
  onCambiarSeccion: (seccion: Seccion) => void;
};

const secciones = [
  {
    id: "maquinas" as Seccion,
    nombre: "Máquinas",
    icono: Factory,
  },
  {
    id: "tareas" as Seccion,
    nombre: "Tareas",
    icono: ListChecks,
  },
  {
    id: "reportes" as Seccion,
    nombre: "Reportes",
    icono: FileWarning,
  },
  {
    id: "operarios" as Seccion,
    nombre: "Operarios",
    icono: Users,
  },
  {
    id: "chat" as Seccion,
    nombre: "Chat",
    icono: MessageCircle,
  },
];

export default function Sidebar({
  seccionActiva,
  onCambiarSeccion,
}: SidebarProps) {
  return (
    <aside className="w-64 h-screen shrink-0 bg-trenza-fondo p-4 flex flex-col">
      <div className="px-3 py-4 mb-6">
        <p className="font-display text-xl tracking-wide text-trenza-crema">
          NACIONAL DE
        </p>

        <p className="font-display text-xl tracking-wide text-trenza-ocre">
          TRENZADOS
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {secciones.map((seccion) => {
          const Icono = seccion.icono;
          const activa =
            seccionActiva === seccion.id;

          return (
            <button
              key={seccion.id}
              onClick={() =>
                onCambiarSeccion(seccion.id)
              }
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                activa
                  ? "bg-trenza-indigo text-trenza-crema"
                  : "text-trenza-crema/65 hover:bg-white/5 hover:text-trenza-crema"
              }`}
            >
              <Icono size={19} />
              <span>{seccion.nombre}</span>
            </button>
          );
        })}
      </nav>

      <PerfilAdmin />
    </aside>
  );
}