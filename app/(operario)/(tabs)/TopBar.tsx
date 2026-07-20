"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { borrarCookiesSesion } from "../../../lib/cookies";
import { apiFetch, cerrarSesionAPI } from "../../../lib/api";

type Usuario = {
  username: string;
  rol: string;
  avatar?: { url: string };
};

export default function TopBar() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

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
        console.error("Error al cargar usuario:", error);
      }
    }

    cargarUsuario();
  }, []);

  useEffect(() => {
    function manejarClickAfuera(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
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
    <header className="fixed top-0 left-0 right-0 h-14 bg-trenza-indigo flex items-center justify-between px-4 z-20">
      <span className="text-trenza-crema font-display font-medium text-sm">
        NACIONAL DE TRENZADOS
      </span>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() =>
            setMenuAbierto((abierto) => !abierto)
          }
          className="w-9 h-9 rounded-full overflow-hidden border-2 border-trenza-crema flex items-center justify-center bg-trenza-ocre"
        >
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
        </button>

        {menuAbierto && usuario && (
          <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">
            <div
              ref={menuRef}
              className="pointer-events-auto w-72 bg-white rounded-2xl border border-black/5 shadow-lg p-5"
            >
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
      </div>
    </header>
  );
}