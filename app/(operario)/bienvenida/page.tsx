"use client";

import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../../lib/api";
import Image from "next/image";

export default function BienvenidaPage() {
  const [nombre, setNombre] = useState("");
  const [cantidadPendientes, setCantidadPendientes] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerDatosOperario() {
      try {
        const resUsuario = await apiFetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=maquinasAsignadas`
        );

        if (!resUsuario.ok) {
          return;
        }

        const usuario = await resUsuario.json();

        setNombre(usuario.username);

        const idsMaquinas = (
          usuario.maquinasAsignadas ?? []
        ).map((m: any) => m.id);

        if (idsMaquinas.length === 0) {
          setCantidadPendientes(0);
          return;
        }

        const params = new URLSearchParams();

        idsMaquinas.forEach((id: number) => {
          params.append(
            "filters[maquina][id][$in]",
            String(id)
          );
        });

        params.append(
          "filters[estado][$ne]",
          "completada"
        );

        params.append(
          "pagination[pageSize]",
          "1"
        );

        const resTareas = await apiFetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tareas?${params.toString()}`
        );

        if (!resTareas.ok) {
          return;
        }

        const dataTareas = await resTareas.json();

        setCantidadPendientes(
          dataTareas.meta.pagination.total
        );
      } catch (error) {
        console.error(
          "Error al cargar datos de bienvenida:",
          error
        );
      } finally {
        setCargando(false);
      }
    }

    obtenerDatosOperario();
  }, []);

  const mensaje =
    cantidadPendientes === 0
      ? "No tienes tareas pendientes"
      : `${cantidadPendientes} ${
          cantidadPendientes === 1
            ? "tarea pendiente"
            : "tareas pendientes"
        } asignadas a ti`;

  if (cargando) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-trenza-fondo p-4">
        <div className="w-full max-w-sm bg-trenza-indigo rounded-2xl flex flex-col items-center px-6 py-9">
          <p className="text-sm text-trenza-crema/70">
            Cargando...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4">

      <Image
        src="/images/loginBG.png"
       alt=""
      fill
      priority
      className="object-cover"
      />

   <div className="absolute inset-0 bg-trenza-fondo/40" />

    <div className="relative z-10 w-full max-w-sm bg-trenza-crema rounded-2xl flex flex-col items-center px-6 py-9">
        <p className="text-medium text-trenza-azul font-bold">
          Bienvenido
        </p>

        <p className="text-lg font-medium text-trenza-azul/90 mb-5">
          {nombre}
        </p>

        <svg
          width="130"
          height="12"
          viewBox="0 0 140 14"
          className="mb-6"
        >
          <path
            d="M0 7 Q17.5 0 35 7 T70 7 T105 7 T140 7"
            fill="none"
            stroke="#B90004"
            strokeWidth="2"
          />

          <path
            d="M0 7 Q17.5 14 35 7 T70 7 T105 7 T140 7"
            fill="none"
            stroke="#3A4A63"
            strokeWidth="2"
          />
        </svg>

        <div className="w-[90px] h-[90px] rounded-full bg-trenza-azul/70 flex items-center justify-center mb-4">
          <span className="text-3xl font-medium text-trenza-crema">
            {cantidadPendientes}
          </span>
        </div>

        <p className="text-sm text-trenza-azul text-center max-w-[220px] mb-7">
          {mensaje}
        </p>

        <Link
          href="/tareas"
          replace
          className="w-full h-12 rounded-lg bg-trenza-red/80 text-trenza-crema text-sm font-bold flex items-center justify-center"
        >
          Ver mis tareas
        </Link>
      </div>
    </main>
  );
}