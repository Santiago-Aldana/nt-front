"use client";

import { useState } from "react";

export default function LoginForm() {
    const [codigo, setCodigo] = useState("");
    const [password, setPassword] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setCargando(true);

        //Strapi conexión
        console.log("Iniciando sesión de:", codigo, password);

        setCargando(false);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="text-sm text-trenza-azul block mb1">
                    Código de operario
                </label>
                <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="OP-01"
                    className="w-full h-10 rounded-lg border-trenza-indigo bg-white px-3 text-sm text-trenza-azul focus:outline-none focus:ring-2 focus:ring-trenza-ocre"
                    required
                />
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={cargando}
                className="h-10 rounded-lg bg-trenza-ocre text-trenza-crema text-sm font-medium mt-2 disabled:opacity-60"
            >
                {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
        </form>
    );
}