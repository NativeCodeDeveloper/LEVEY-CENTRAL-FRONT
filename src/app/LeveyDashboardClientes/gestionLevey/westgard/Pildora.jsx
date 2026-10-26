// Píldora de estado del módulo Westgard: fondo suave + texto del mismo tono,
// mismo lenguaje visual que las píldoras de Análisis QC. El tono nunca va solo:
// el texto de la píldora nombra el estado.

export const TONOS_PILDORA = {
  ok: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warn: "bg-amber-50 text-amber-700 ring-amber-600/20",
  alert: "bg-red-50 text-red-600 ring-red-500/20",
  info: "bg-status-info-soft text-status-info",
  neutral: "bg-gray-100 text-gray-500 ring-gray-400/20",
};

export default function Pildora({ tono = "neutral", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.02em] ring ring-inset ${
        TONOS_PILDORA[tono] ?? TONOS_PILDORA.neutral
      }`}
    >
      {children}
    </span>
  );
}
