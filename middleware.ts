import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const rol = request.cookies.get("rol")?.value;
  const { pathname } = request.nextUrl;

  const rutasOperario = ["/tareas", "/reportes"];
  const rutasAdministrador = ["/dashboard", "/maquinas"];

  const esRutaProtegida =
  rutasOperario.includes(pathname) || rutasAdministrador.includes(pathname);

  //Sin token, redirigir a login
    if (esRutaProtegida && !token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    //Diferente roles, redirigir a la ruta correspondiente
    if (rutasAdministrador.includes(pathname) && rol !== "administrador") {
        return NextResponse.redirect(new URL("/tareas", request.url));
    }
    if (rutasOperario.includes(pathname) && rol !== "operario") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    //ok
    return NextResponse.next();
}

export const config = {
  matcher: ["/tareas/:path*", "/reportes/:path*", "/dashboard/:path*", "/maquinas/:path*"],
};