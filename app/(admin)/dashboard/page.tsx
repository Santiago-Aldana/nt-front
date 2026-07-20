"use client";

import { useState } from "react";
import Sidebar, {
  type Seccion,
} from "./components/Sidebar";
import Maquinas from "./components/Maquinas";
import Tareas from "./components/Tareas";
import Reportes from "./components/Reportes";
import Operarios from "./components/Operarios";
import Chat from "./components/Chat";

export default function DashboardPage() {
  const [seccionActiva, setSeccionActiva] =
    useState<Seccion>("maquinas");

  function renderContenido() {
    switch (seccionActiva) {
      case "maquinas":
        return <Maquinas />;

      case "tareas":
        return <Tareas />;

      case "reportes":
        return <Reportes />;

      case "operarios":
        return <Operarios />;

      case "chat":
        return <Chat />;

      default:
        return <Maquinas />;
    }
  }

  return (
    <main className="h-screen bg-trenza-crema flex overflow-hidden">
      <Sidebar
        seccionActiva={seccionActiva}
        onCambiarSeccion={setSeccionActiva}
      />

      <div className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="p-8">
          {renderContenido()}
        </div>
      </div>
    </main>
  );
}