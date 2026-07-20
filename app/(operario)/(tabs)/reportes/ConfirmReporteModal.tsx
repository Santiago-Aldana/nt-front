"use client";

type Props = {
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  colorConfirmar?: "ocre" | "rojo";
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ConfirmReporteModal({
  titulo,
  mensaje,
  textoConfirmar,
  colorConfirmar = "ocre",
  onConfirmar,
  onCancelar,
}: Props) {
  const colorBoton =
    colorConfirmar === "rojo"
      ? "bg-red-600 text-white"
      : "bg-trenza-ocre text-trenza-crema";

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
      onClick={onCancelar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-72 bg-white rounded-2xl p-5"
      >
        <p className="text-base font-medium text-trenza-texto mb-1.5">
          {titulo}
        </p>

        <p className="text-sm text-trenza-texto/70 mb-5">
          {mensaje}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancelar}
            className="flex-1 h-11 rounded-lg border border-black/10 text-sm text-trenza-texto"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirmar}
            className={`flex-1 h-11 rounded-lg text-sm font-medium ${colorBoton}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}