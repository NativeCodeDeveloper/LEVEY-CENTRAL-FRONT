"use client";

// Módulo Reglas de Westgard: consulta educativa de los criterios estadísticos
// del control de calidad interno. Todos los datos provienen del arreglo
// hardcodeado en reglasWestgard.js (sin backend): la búsqueda, los filtros, el
// interruptor de estado y el panel de detalle son interacciones de demostración.

import { useCallback, useMemo, useState } from "react";
import { Eye, Info, Search } from "lucide-react";
import { REGLAS_WESTGARD } from "./reglasWestgard";
import Pildora from "./Pildora";
import PanelDetalleRegla from "./PanelDetalleRegla";

const TEXTO_TIPO_ERROR = { ALEATORIO: "Aleatorio", SISTEMATICO: "Sistemático", AMBOS: "Ambos" };
const TEXTO_INTERPRETACION = { ADVERTENCIA: "Advertencia", RECHAZO: "Rechazo", TENDENCIA: "Tendencia" };
const TONO_INTERPRETACION = { ADVERTENCIA: "warn", RECHAZO: "alert", TENDENCIA: "info" };
const TEXTO_ESQUEMA = { CLASICA: "Clásica", COMPLEMENTARIA: "Complementaria" };

const CLASES_ENCABEZADO = "whitespace-nowrap px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-muted";

// Interruptor demostrativo de activación: sin backend, solo estado local.
function InterruptorDemo({ activa, deshabilitada, alAlternar, titulo }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activa}
      aria-label={titulo}
      disabled={deshabilitada}
      title={titulo}
      onClick={alAlternar}
      className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        deshabilitada
          ? "cursor-not-allowed bg-gray-200 opacity-60"
          : activa
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-gray-300 hover:bg-gray-400"
      }`}
    >
      <span
        className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform duration-200 ${
          activa ? "translate-x-[16px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

export default function ReglasDeWestgard() {
  const [reglas, setReglas] = useState(REGLAS_WESTGARD);
  const [consulta, setConsulta] = useState("");
  const [filtroImplementacion, setFiltroImplementacion] = useState("TODAS");
  const [filtroTipoError, setFiltroTipoError] = useState("TODOS");
  const [filtroEsquema, setFiltroEsquema] = useState("TODOS");
  const [reglaDetalle, setReglaDetalle] = useState(null);

  const cerrarDetalle = useCallback(() => setReglaDetalle(null), []);

  const reglasFiltradas = useMemo(() => {
    const termino = consulta.trim().toLowerCase();
    return reglas.filter((regla) => {
      const coincideTermino =
        !termino || `${regla.codigo} ${regla.nombre} ${regla.descripcion}`.toLowerCase().includes(termino);
      const coincideImplementacion =
        filtroImplementacion === "TODAS" || regla.implementacion === filtroImplementacion;
      const coincideTipo = filtroTipoError === "TODOS" || regla.tipoError === filtroTipoError;
      const coincideEsquema = filtroEsquema === "TODOS" || regla.esquema === filtroEsquema;
      return coincideTermino && coincideImplementacion && coincideTipo && coincideEsquema;
    });
  }, [reglas, consulta, filtroImplementacion, filtroTipoError, filtroEsquema]);

  // Alternancia demostrativa del estado; las no implementadas no se pueden activar.
  function alternarEstado(idRegla) {
    setReglas((actuales) =>
      actuales.map((regla) => (regla.id === idRegla ? { ...regla, activa: !regla.activa } : regla))
    );
  }

  function tituloInterruptor(regla) {
    if (regla.implementacion === "NO_IMPLEMENTADA") {
      return "Regla no implementada: activación no disponible en esta demostración";
    }
    if (regla.implementacion === "PARCIAL") {
      return "Implementación parcial: consulte las modalidades pendientes en el detalle";
    }
    return regla.activa ? "Desactivar regla (demostrativo)" : "Activar regla (demostrativo)";
  }

  return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
          GESTIÓN / REGLAS DE WESTGARD
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
          Reglas de Westgard
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-ink-muted">
          Consulte los criterios estadísticos utilizados para evaluar el control de calidad interno de los
          procedimientos analíticos.
        </p>
      </header>

      {/* Nota sobre esquemas clásicos y complementarios */}
      <div className="mt-8 flex items-start gap-2.5 rounded-2xl border border-line bg-[#f8f9fb] px-4 py-3.5">
        <Info className="mt-px size-4 shrink-0 text-status-info" aria-hidden="true" />
        <p className="m-0 text-[12px] leading-5 text-ink-muted">
          Las reglas <strong className="font-semibold text-ink">clásicas</strong> pertenecen al esquema multirregla
          original de Westgard; las <strong className="font-semibold text-ink">complementarias</strong> provienen de
          esquemas ampliados y no forman parte del esquema clásico. La selección de reglas debe responder al diseño del
          procedimiento de control de calidad de cada laboratorio: no se recomienda activarlas todas en simultáneo.
        </p>
      </div>

      {/* Búsqueda y filtros */}
      <section aria-label="Búsqueda y filtros" className="mt-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="block min-w-0 md:col-span-2 xl:col-span-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Buscar regla</span>
            <span className="relative mt-2 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
              <input
                value={consulta}
                onChange={(evento) => setConsulta(evento.target.value)}
                type="search"
                placeholder="Buscar por nombre o código..."
                className="h-10 w-full rounded-lg border border-line-strong bg-white pl-9 pr-3 text-[12px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-status-info focus:ring-4 focus:ring-status-info/10"
              />
            </span>
          </label>
          <label className="block min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Implementación</span>
            <select
              value={filtroImplementacion}
              onChange={(evento) => setFiltroImplementacion(evento.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-line-strong bg-white px-3 text-[12px] text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10"
            >
              <option value="TODAS">Todas</option>
              <option value="IMPLEMENTADA">Implementadas</option>
              <option value="PARCIAL">Parcialmente implementadas</option>
              <option value="NO_IMPLEMENTADA">No implementadas</option>
            </select>
          </label>
          <label className="block min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Tipo de error</span>
            <select
              value={filtroTipoError}
              onChange={(evento) => setFiltroTipoError(evento.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-line-strong bg-white px-3 text-[12px] text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10"
            >
              <option value="TODOS">Todos</option>
              <option value="ALEATORIO">Aleatorio</option>
              <option value="SISTEMATICO">Sistemático</option>
              <option value="AMBOS">Ambos</option>
            </select>
          </label>
          <label className="block min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Esquema</span>
            <select
              value={filtroEsquema}
              onChange={(evento) => setFiltroEsquema(evento.target.value)}
              className="mt-2 h-10 w-full rounded-lg border border-line-strong bg-white px-3 text-[12px] text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10"
            >
              <option value="TODOS">Todos</option>
              <option value="CLASICA">Clásicas</option>
              <option value="COMPLEMENTARIA">Complementarias</option>
            </select>
          </label>
        </div>
      </section>

      {/* Tabla de reglas */}
      <section
        aria-label="Reglas de Westgard"
        className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]"
      >
        <table className="w-full min-w-[1280px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[17%]" />
            <col className="w-[16%]" />
            <col className="w-[17%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-[#f8f9fb] align-middle">
              <th scope="col" title="Nombre de la regla" className={CLASES_ENCABEZADO}>Regla</th>
              <th scope="col" title="Tipo de error detectado" className={CLASES_ENCABEZADO}>Tipo de error</th>
              <th scope="col" title="Interpretación estadística" className={CLASES_ENCABEZADO}>Interpretación</th>
              <th scope="col" title="Estado de la regla (demostrativo)" className={CLASES_ENCABEZADO}>Estado</th>
              <th scope="col" title="Fecha de modificación (demostrativa)" className={CLASES_ENCABEZADO}>Modificación</th>
              <th scope="col" className={`${CLASES_ENCABEZADO} text-center`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reglasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[12px] text-ink-muted">
                  Sin resultados para la búsqueda y los filtros seleccionados.
                </td>
              </tr>
            ) : (
              reglasFiltradas.map((regla) => (
                <tr
                  key={regla.id}
                  className="border-b border-line align-middle transition-colors duration-200 last:border-b-0 hover:bg-[#f8f9fb]"
                >
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
                      <span className="text-[13px] font-semibold tabular-nums text-ink">{regla.codigo}</span>
                      <span
                        title={regla.esquema === "CLASICA" ? "Regla clásica del esquema multirregla" : "Regla complementaria de esquema ampliado"}
                        className="truncate rounded bg-gray-100 px-1 py-px text-[8px] font-semibold uppercase tracking-[0.04em] text-gray-500"
                      >
                        {TEXTO_ESQUEMA[regla.esquema]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Pildora tono="neutral">{TEXTO_TIPO_ERROR[regla.tipoError]}</Pildora>
                  </td>
                  <td className="px-4 py-3">
                    <Pildora tono={TONO_INTERPRETACION[regla.interpretacion]}>
                      {TEXTO_INTERPRETACION[regla.interpretacion]}
                    </Pildora>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <InterruptorDemo
                        activa={regla.activa}
                        deshabilitada={regla.implementacion === "NO_IMPLEMENTADA"}
                        alAlternar={() => alternarEstado(regla.id)}
                        titulo={tituloInterruptor(regla)}
                      />
                      <span className={`text-[10.5px] font-medium ${regla.activa ? "text-emerald-600" : "text-gray-400"}`}>
                        {regla.activa ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="m-0 whitespace-nowrap text-[10.5px] font-medium tabular-nums text-ink" title={regla.fechaModificacion ? "Fecha demostrativa" : "Sin modificación registrada"}>
                      {regla.fechaModificacion ?? "—"}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => setReglaDetalle(regla)}
                      aria-label={`Ver detalles de la regla ${regla.nombre}`}
                      aria-haspopup="dialog"
                      title="Ver detalles"
                      className="group flex size-8 shrink-0 items-center justify-center rounded-lg bg-black text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.12)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:bg-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.32)] active:translate-y-0 active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      <Eye className="size-3.5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <p className="mt-8 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400">
        LeveyQC · Reglas de Westgard · Datos demostrativos sin conexión al backend
      </p>

      {reglaDetalle ? <PanelDetalleRegla regla={reglaDetalle} alCerrar={cerrarDetalle} /> : null}
    </div>
  );
}
