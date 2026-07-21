// Comunicacion
require("dotenv").config();

const STRAPI_URL =
  process.env.STRAPI_URL ||
  "http://localhost:1337";

const STRAPI_API_TOKEN =
  process.env.STRAPI_API_TOKEN;

// Crear las 72 maquinas
const maquinas = Array.from(
  { length: 72 },
  (_, indice) => {
    const numero = String(indice + 1).padStart(
      2,
      "0"
    );

    return {
      nombre: `Máquina ${numero}`,
      referenciaActual: "Referencia por asignar",
      estado: "activa",
    };
  }
);

// Crear maquina
async function crearMaquina(maquina) {
  const respuesta = await fetch(
    `${STRAPI_URL}/api/maquinas`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: maquina,
      }),
    }
  );

  if (!respuesta.ok) {
    const error = await respuesta.text();

    console.log(
      `❌ Error creando ${maquina.nombre}:`,
      error
    );

    return;
  }

  console.log(
    `✅ Máquina creada: ${maquina.nombre}`
  );
}

// Crear lista
async function main() {
  for (const maquina of maquinas) {
    await crearMaquina(maquina);
  }

  console.log(
    "🎉 Listo, las 72 máquinas fueron procesadas."
  );
}

main();