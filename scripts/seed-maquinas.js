// Comunicacion
require("dotenv").config();
const STRAPI_URL=process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN=process.env.STRAPI_API_TOKEN;

// Lista para crear
const maquinas = [
    {nombre: "M-01", referenciaActual: "122B0612", estado: "activa"},
    {nombre: "M-02", referenciaActual: "120M2010", estado: "activa"},
    {nombre: "M-03", referenciaActual: "125M0510", estado: "activa"},
    {nombre: "M-04", referenciaActual: "120M2010", estado: "activa"},
    {nombre: "M-05", referenciaActual: "122T0508", estado: "activa"},
    {nombre: "M-06", referenciaActual: "122B0408", estado: "activa"},
    {nombre: "M-07", referenciaActual: "120M2008", estado: "activa"},
    {nombre: "M-08", referenciaActual: "122B0610", estado: "activa"},
    {nombre: "M-09", referenciaActual: "NULL", estado: "mantenimiento"},
    {nombre: "M-10", referenciaActual: "122B0312", estado: "activa"},
    {nombre: "M-11", referenciaActual: "120M2008", estado: "activa"},
    {nombre: "M-12", referenciaActual: "125M0510", estado: "activa"},
    {nombre: "M-13", referenciaActual: "122B0410", estado: "activa"},
    {nombre: "M-14", referenciaActual: "122B0412", estado: "activa"},
    {nombre: "M-15", referenciaActual: "122T0508", estado: "activa"},
    {nombre: "M-16", referenciaActual: "120M2008", estado: "activa"},
    {nombre: "M-17", referenciaActual: "120M2008", estado: "activa"},
    {nombre: "M-18", referenciaActual: "122T0510", estado: "activa"},
    {nombre: "M-19", referenciaActual: "125M0514", estado: "activa"},
    {nombre: "M-20", referenciaActual: "NULL", estado: "mantenimiento"},
    {nombre: "M-21", referenciaActual: "122R2510", estado: "activa"},
    {nombre: "M-22", referenciaActual: "124C0206", estado: "activa"},
    {nombre: "M-23", referenciaActual: "122B0608", estado: "activa"},
    {nombre: "M-24", referenciaActual: "125M0508", estado: "activa"},
];

// Crear maquinas
async function crearMaquina(maquina) {
    const respuesta = await fetch(`${STRAPI_URL}/api/maquinas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({data: maquina}),
    });
    
    if (!respuesta.ok) {
        const error = await respuesta.text();
        console.log(`❌ Error creando ${maquina.nombre}:`, error);
        return;
    }

    console.log(`✅ Máquina creada: ${maquina.nombre}`);
}

// Crear lista
async function main() {
    for (const maquina of maquinas) {
        await crearMaquina(maquina);
    }
    console.log("🎉 Listo, todas las máquinas fueron procesadas.");
}

main();