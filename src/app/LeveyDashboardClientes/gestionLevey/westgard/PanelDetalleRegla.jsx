"use client";

// Panel lateral de detalle clínico de una regla de Westgard: gráfico
// demostrativo, fundamento estadístico, ejemplo en Z-Score, interpretación y
// acción recomendada. Es el componente central de la experiencia del módulo.

import { useEffect } from "react";
import { X } from "lucide-react";
import Pildora from "./Pildora";
import GraficoLeveyJennings, { formatearZ } from "./GraficoLeveyJennings";

const TEXTO_INTERPRETACION = { ADVERTENCIA: "Advertencia", RECHAZO: "Rechazo", TENDENCIA: "Tendencia" };
const TONO_INTERPRETACION = { ADVERTENCIA: "warn", RECHAZO: "alert", TENDENCIA: "info" };
const TEXTO_TIPO_ERROR = { ALEATORIO: "Error aleatorio", SISTEMATICO: "Error sistemático", AMBOS: "Error aleatorio y sistemático" };
const TEXTO_IMPLEMENTACION = { IMPLEMENTADA: "Implementada", PARCIAL: "Implementación parcial", NO_IMPLEMENTADA: "No implementada" };
const TONO_IMPLEMENTACION = { IMPLEMENTADA: "ok", PARCIAL: "warn", NO_IMPLEMENTADA: "neutral" };
const TEXTO_ESQUEMA = { CLASICA: "Esquema clásico", COMPLEMENTARIA: "Esquema ampliado" };
const TONO_ESQUEMA = { CLASICA: "info", COMPLEMENTARIA: "neutral" };

function EtiquetaSeccion({ children }) {
  return <h3 className="m-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">{children}</h3>;
}

function ParrafoSeccion({ children }) {
  return <p className="m-0 text-[13px] leading-6 text-ink">{children}</p>;
}

export default function PanelDetalleRegla({ regla, alCerrar }) {
  // Cierre con la tecla Escape: suscripción a un sistema externo (el teclado).
  useEffect(() => {
    function alPresionarTecla(evento) {
      if (evento.key === "Escape") alCerrar();
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [alCerrar]);

  const secciones = [
    { titulo: "Objetivo", cuerpo: regla.descripcion },
    { titulo: "Fundamento estadístico", cuerpo: regla.fundamentoEstadistico },
    { titulo: "Interpretación clínica", cuerpo: regla.interpretacionClinica },
    { titulo: "Acción recomendada", cuerpo: regla.accionRecomendada },
  ];

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="titulo-detalle-regla">
      <button
        type="button"
        aria-label="Cerrar detalle de la regla"
        onClick={alCerrar}
        className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-sm"
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-y-auto bg-white shadow-2xl">
        {/* Encabezado con identidad de la regla */}
        <div className="sticky top-0 z-10 border-b border-line bg-white/95 px-6 py-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">Westgard · {regla.codigo}</p>
              <h2 id="titulo-detalle-regla" className="mt-1 text-[22px] font-bold tracking-[-0.03em] text-ink">
                {regla.nombre}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Pildora tono={TONO_INTERPRETACION[regla.interpretacion]}>{TEXTO_INTERPRETACION[regla.interpretacion]}</Pildora>
                <Pildora tono="neutral">{TEXTO_TIPO_ERROR[regla.tipoError]}</Pildora>
                <Pildora tono={TONO_ESQUEMA[regla.esquema]}>{TEXTO_ESQUEMA[regla.esquema]}</Pildora>
              </div>
            </div>
            <button
              type="button"
              onClick={alCerrar}
              aria-label="Cerrar detalle"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Contenido clínico */}
        <div className="flex-1 space-y-7 px-6 py-6">
          <section>
            <EtiquetaSeccion>Representación gráfica (demostrativa)</EtiquetaSeccion>
            <div className="mt-2 rounded-xl border border-line bg-white p-4 shadow-sm">
              <GraficoLeveyJennings zScores={regla.ejemplo.zScores} />
            </div>
          </section>

          <section>
            <EtiquetaSeccion>Ejemplo clínico</EtiquetaSeccion>
            <ParrafoSeccion>{regla.ejemplo.descripcion}</ParrafoSeccion>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {regla.ejemplo.zScores.map((z, i) => (
                <span
                  key={`${z}-${i}`}
                  className="inline-flex items-center rounded-md border border-line bg-[#f8f9fb] px-2 py-1 text-[10.5px] font-semibold tabular-nums text-ink"
                >
                  Z {formatearZ(z)}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] leading-4 text-ink-muted">Valores de control expresados en Z-Score (datos demostrativos).</p>
          </section>

          {secciones.map((seccion) => (
            <section key={seccion.titulo}>
              <EtiquetaSeccion>{seccion.titulo}</EtiquetaSeccion>
              <div className="mt-2">
                <ParrafoSeccion>{seccion.cuerpo}</ParrafoSeccion>
              </div>
            </section>
          ))}

          <section>
            <EtiquetaSeccion>Estado de implementación</EtiquetaSeccion>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Pildora tono={TONO_IMPLEMENTACION[regla.implementacion]}>{TEXTO_IMPLEMENTACION[regla.implementacion]}</Pildora>
              <span className="text-[11px] text-ink-muted">
                {regla.fechaModificacion
                  ? `Última modificación (demostrativa): ${regla.fechaModificacion}`
                  : "Sin fecha de modificación: la regla aún no está implementada."}
              </span>
            </div>
            {regla.implementacion === "PARCIAL" && regla.notaImplementacion ? (
              <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3 text-[12px] leading-5 text-amber-800">
                <strong className="font-semibold">Atención: </strong>
                {regla.notaImplementacion}
              </p>
            ) : null}
            {regla.implementacion === "NO_IMPLEMENTADA" ? (
              <p className="mt-3 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-3 text-[12px] leading-5 text-gray-600">
                Esta regla todavía no cuenta con evaluación estadística en el sistema, por lo que su activación permanece deshabilitada en esta demostración.
              </p>
            ) : null}
          </section>
        </div>

        <div className="sticky bottom-0 mt-auto border-t border-line bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={alCerrar}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-line-strong bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Cerrar
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
