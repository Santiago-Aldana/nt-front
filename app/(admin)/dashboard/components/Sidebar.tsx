"use client";

import {
  Play,
  ListChecks,
  FileWarning,
  Users,
  MessageCircle,
} from "lucide-react";
import PerfilAdmin from "./PerfilAdmin";
import Image from "next/image";

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
    icono: Play,
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
      <div className="flex items-center gap-3 px-3 py-4 mb-6">
  <Image
    src="/images/logo-01.png"
    alt="Logo Nacional de Trenzados"
    width={52}
    height={52}
    priority
  />

  <div>
    <p className="font-display text-lg leading-none tracking-wide text-trenza-crema">
      NACIONAL DE
    </p>

    <p className="font-display text-lg leading-none tracking-wide text-trenza-crema mt-1">
      TRENZADOS
    </p>
  </div>
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