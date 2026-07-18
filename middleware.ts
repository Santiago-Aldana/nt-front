import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const rol = request.cookies.get("rol")?.value;
  const { pathname } = request.nextUrl;

  const rutasOperario = ["/bienvenida", "/tareas", "/reportes", "/chat"];
  const rutasJefa = ["/dashboard", "/maquinas"];

  const esRutaProtegida = rutasOperario.includes(pathname) || rutasJefa.includes(pathname);

  if (esRutaProtegida && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (rutasJefa.includes(pathname) && rol !== "administrador") {
    return NextResponse.redirect(new URL("/bienvenida", request.url));
  }

  if (rutasOperario.includes(pathname) && rol !== "operario") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/bienvenida/:path*",
    "/tareas/:path*",
    "/reportes/:path*",
    "/chat/:path*",
    "/dashboard/:path*",
    "/maquinas/:path*",
  ],
};