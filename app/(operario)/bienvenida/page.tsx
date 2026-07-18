import { cookies } from "next/headers";
import Link from "next/link";

async function obtenerDatosOperario() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const resUsuario = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=maquinasAsignadas`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  const usuario = await resUsuario.json();

  const idsMaquinas = (usuario.maquinasAsignadas ?? []).map((m: any) => m.id);

  if (idsMaquinas.length === 0) {
    return { nombre: usuario.username, cantidadPendientes: 0 };
  }

  const params = new URLSearchParams();
  idsMaquinas.forEach((id: number) => {
    params.append("filters[maquina][id][$in]", String(id));
  });
  params.append("filters[estado][$ne]", "completada");
  params.append("pagination[pageSize]", "1");

  const resTareas = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/tareas?${params.toString()}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );
  const dataTareas = await resTareas.json();

  return {
    nombre: usuario.username,
    cantidadPendientes: dataTareas.meta.pagination.total,
  };
}

export default async function BienvenidaPage() {
  const { nombre, cantidadPendientes } = await obtenerDatosOperario();

  const mensaje =
    cantidadPendientes === 0
      ? "No tienes tareas pendientes"
      : `${cantidadPendientes} ${cantidadPendientes === 1 ? "tarea pendiente" : "tareas pendientes"} asignadas a ti`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-trenza-fondo p-4">
      <div className="w-full max-w-sm bg-trenza-indigo rounded-2xl flex flex-col items-center px-6 py-9">
        <p className="text-sm text-trenza-crema/70">Bienvenido</p>
        <p className="text-lg font-medium text-trenza-crema mb-5">{nombre}</p>

        <svg width="130" height="12" viewBox="0 0 140 14" className="mb-6">
          <path d="M0 7 Q17.5 0 35 7 T70 7 T105 7 T140 7" fill="none" stroke="#C97D2E" strokeWidth="2" />
          <path d="M0 7 Q17.5 14 35 7 T70 7 T105 7 T140 7" fill="none" stroke="#7C8CA6" strokeWidth="2" />
        </svg>

        <div className="w-[90px] h-[90px] rounded-full bg-trenza-ocre flex items-center justify-center mb-4">
          <span className="text-3xl font-medium text-trenza-crema">{cantidadPendientes}</span>
        </div>
        <p className="text-sm text-trenza-crema text-center max-w-[220px] mb-7">{mensaje}</p>

        <Link
          href="/tareas"
          replace
          className="w-full h-12 rounded-lg bg-trenza-crema text-trenza-texto text-sm font-medium flex items-center justify-center"
        >
          Ver mis tareas
        </Link>
      </div>
    </main>
  );
}