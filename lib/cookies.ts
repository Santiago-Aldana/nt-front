export function obtenerCookie(nombre: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie
    .split("; ")
    .find((fila) => fila.startsWith(`${nombre}=`));

  return match?.split("=")[1];
}

export function guardarToken(token: string) {
  document.cookie = `token=${token}; path=/;`;
}

export function guardarRol(rol: string) {
  document.cookie = `rol=${rol}; path=/;`;
}

export function borrarCookiesSesion() {
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "rol=; path=/; max-age=0";
}