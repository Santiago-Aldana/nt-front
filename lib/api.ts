import {
  obtenerCookie,
  guardarToken,
  borrarCookiesSesion,
} from "./cookies";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

let refreshEnCurso: Promise<string | null> | null = null;

async function renovarToken(): Promise<string | null> {
  if (refreshEnCurso) {
    return refreshEnCurso;
  }

  refreshEnCurso = (async () => {
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        borrarCookiesSesion();
        return null;
      }

      const data = await response.json();

      if (!data.jwt) {
        borrarCookiesSesion();
        return null;
      }

      guardarToken(data.jwt);

      return data.jwt;
    } catch (error) {
      console.error("Error al renovar la sesión:", error);
      borrarCookiesSesion();
      return null;
    } finally {
      refreshEnCurso = null;
    }
  })();

  return refreshEnCurso;
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token: string | null | undefined = obtenerCookie("token");

  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  token = await renovarToken();

  if (!token) {
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }

    return response;
  }

  const headersReintento = new Headers(options.headers);

  headersReintento.set(
    "Authorization",
    `Bearer ${token}`
  );

  response = await fetch(url, {
    ...options,
    headers: headersReintento,
    credentials: "include",
  });

  return response;
}

export async function cerrarSesionAPI() {
  const token = obtenerCookie("token");

  try {
    await fetch(
      `${STRAPI_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Error al cerrar sesión en Strapi:", error);
  } finally {
    borrarCookiesSesion();
  }
}