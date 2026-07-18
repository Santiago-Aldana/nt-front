export function obtenerCookie(nombre: string): string | undefined {
  const match = document.cookie
    .split("; ")
    .find((fila) => fila.startsWith(`${nombre}=`));

  return match?.split("=")[1];
}

export function borrarCookiesSesion() {
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "rol=; path=/; max-age=0";
}