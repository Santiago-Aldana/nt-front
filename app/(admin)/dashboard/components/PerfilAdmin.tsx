"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { apiFetch, cerrarSesionAPI } from "@/lib/api";
import { borrarCookiesSesion } from "@/lib/cookies";

type Usuario = {
  username: string;
  rol: string;
  avatar?: {
    url: string;
  };
};

export default function PerfilAdmin() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [menuAbierto, setMenuAbierto] =
    useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const res = await apiFetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=avatar`
        );

        if (!res.ok) {
          return;
        }

        const data = await res.json();

        setUsuario(data);
      } catch (error) {
        console.error(
          "Error al cargar usuario:",
          error
        );
      }
    }

    cargarUsuario();
  }, []);

  useEffect(() => {
    function manejarClickAfuera(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener(
      "mousedown",
      manejarClickAfuera
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        manejarClickAfuera
      );
    };
  }, []);

  async function cerrarSesion() {
    await cerrarSesionAPI();

    borrarCookiesSesion();

    router.replace("/login");
  }

  const urlAvatar = usuario?.avatar
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${usuario.avatar.url}`
    : null;

  const iniciales =
    usuario?.username?.slice(0, 2).toUpperCase() ?? "";

  return (
    <div
      className="mt-auto relative"
      ref={menuRef}
    >
      {menuAbierto && usuario && (
        <div className="absolute left-full bottom-0 ml-3 z-30">
          <div className="w-72 bg-white rounded-2xl border border-black/5 shadow-lg p-5">
            <button
              onClick={() => setMenuAbierto(false)}
              className="flex justify-end w-full mb-1"
              aria-label="Cerrar"
            >
              <X
                size={18}
                className="text-trenza-texto/60"
              />
            </button>

            <div className="flex flex-col items-center -mt-2">
              {urlAvatar ? (
                <img
                  src={urlAvatar}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-4 border-trenza-crema"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-trenza-ocre flex items-center justify-center text-2xl font-medium text-trenza-crema border-4 border-trenza-crema">
                  {iniciales}
                </div>
              )}

              <p className="text-lg font-medium text-trenza-texto mt-3">
                {usuario.username}
              </p>

              <span className="mt-2 text-xs bg-trenza-crema text-trenza-indigo px-3 py-1 rounded-lg">
                {usuario.rol === "administrador"
                  ? "Administrador"
                  : "Operario"}
              </span>
            </div>

            <div className="h-px bg-black/5 my-4" />

            <button
              onClick={cerrarSesion}
              className="w-full h-11 rounded-lg bg-pink-50 text-red-700 text-sm font-medium flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() =>
          setMenuAbierto((abierto) => !abierto)
        }
        className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-white/5 transition"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-trenza-crema flex items-center justify-center bg-trenza-ocre shrink-0">
          {urlAvatar ? (
            <img
              src={urlAvatar}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-trenza-crema">
              {iniciales}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm text-trenza-crema truncate">
            {usuario?.username ?? "Cargando..."}
          </p>

          <p className="text-[11px] text-trenza-crema/40">
            Administrador
          </p>
        </div>
      </button>
    </div>
  );
}