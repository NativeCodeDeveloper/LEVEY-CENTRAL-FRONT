"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Eye, Gauge, Hammer, Search } from "lucide-react";

const REGISTROS = [
  {
    analito: "Glucosa",
    nivel: "Nivel 1",
    control: "BioRad Glucosa",
    lote: "GLO090",
    calibrado: true,
    ultimoValor: "98,6",
    estado: { texto: "Aceptado", tono: "ok" },
    unidad: "mg/dL",
    media: "100,0",
    mediaAnterior: "99,8",
    desviacion: "2,1",
    desviacionAnterior: "2,0",
    cov: "2,1 %",
    covAnterior: "2,0 %",
    sesgo: "+0,8 %",
    sesgoAnterior: "+0,6 %",
    validadoPor: "y6",
    fechaValidacion: "21/09/2026",
  },
  {
    analito: "Colesterol",
    nivel: "Nivel 2",
    control: "BioRad Colesterol",
    lote: "CO0044",
    calibrado: false,
    ultimoValor: "201,4",
    estado: { texto: "Rechazado", tono: "alert" },
    unidad: "mg/dL",
    media: "200,0",
    mediaAnterior: "199,6",
    desviacion: "4,2",
    desviacionAnterior: "4,0",
    cov: "2,1 %",
    covAnterior: "2,0 %",
    sesgo: "−0,5 %",
    sesgoAnterior: "−0,4 %",
    validadoPor: "y6",
    fechaValidacion: "20/09/2026",
  },
  {
    analito: "Hemoglobina",
    nivel: "Nivel 3",
    control: "BioRad Hemoglobina",
    lote: "HEM012",
    calibrado: true,
    ultimoValor: "13,2",
    estado: { texto: "Aceptado", tono: "ok" },
    unidad: "g/dL",
    media: "13,5",
    mediaAnterior: "13,4",
    desviacion: "0,3",
    desviacionAnterior: "0,3",
    cov: "2,2 %",
    covAnterior: "2,2 %",
    sesgo: "+0,4 %",
    sesgoAnterior: "+0,3 %",
    validadoPor: "y6",
    fechaValidacion: "19/09/2026",
  },
];

const TONO_ESTADO = {
  ok: "text-status-ok",
  alert: "text-status-alert",
};

// Transición premium: desaceleración suave al entrar/soltar, respuesta inmediata al presionar (active:duration-75).
const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const CONTROLES = [...new Set(REGISTROS.map((r) => r.control))];
const LOTES = [...new Set(REGISTROS.map((r) => r.lote))];

// Similitud de nombre: sin mayúsculas ni tildes.
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Referencia del valor anterior: una sola línea, sin saltos, alineada en horizontal.
function CeldaEstadistica({ valor, valorPrevio }) {
  return (
    <td className="px-3 py-4 align-top">
      <p className="text-[13px] font-semibold tabular-nums text-ink">{valor}</p>
      <p className="mt-1 whitespace-nowrap text-[11px] leading-4 tabular-nums text-ink-faint">{valorPrevio}</p>
    </td>
  );
}

function AccionesFila({ analito, nivel }) {
  return (
    <div className="flex h-7 items-center gap-1.5">
      <button
        type="button"
        aria-label={`Validar ${analito}, ${nivel}`}
        title="Validar"
        className={`group flex size-7 items-center justify-center rounded-lg bg-black text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.12)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.32)] active:translate-y-0 active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
      >
        <Check className={`size-3.5 transition-transform duration-300 ${EASE_PREMIUM} group-hover:scale-110`} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`Acciones correctivas para ${analito}, ${nivel}`}
        title="Acciones correctivas"
        className={`group flex size-7 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.16)] active:translate-y-0 active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
      >
        <Hammer className={`size-3.5 transition-transform duration-300 ${EASE_PREMIUM} group-hover:scale-110`} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`Ver ${analito}, ${nivel}`}
        title="Ver detalle"
        className={`group flex size-7 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.16)] active:translate-y-0 active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
      >
        <Eye className={`size-3.5 transition-transform duration-300 ${EASE_PREMIUM} group-hover:scale-110`} aria-hidden="true" />
      </button>
    </div>
  );
}

// Control premium de toolbar: misma altura y radio para buscador, selectores y botones.
const CLASE_CONTROL = `h-12 rounded-xl border border-line bg-white shadow-[0_2px_8px_rgb(15_23_42_/_0.06)] transition-all duration-300 ${EASE_PREMIUM} hover:border-line-strong focus-visible:border-status-info focus-visible:ring-4 focus-visible:ring-status-info/10 outline-none`;

export default function PaginaRegistroControles() {
  const [nombreBuscado, setNombreBuscado] = useState("");
  const [controlFiltro, setControlFiltro] = useState("");
  const [loteFiltro, setLoteFiltro] = useState("");

  const registrosVisibles = useMemo(() => {
    const termino = normalizar(nombreBuscado.trim());
    return REGISTROS.filter((r) => {
      const coincideNombre =
        !termino || normalizar(r.analito).includes(termino) || normalizar(r.control).includes(termino);
      const coincideControl = !controlFiltro || r.control === controlFiltro;
      const coincideLote = !loteFiltro || r.lote === loteFiltro;
      return coincideNombre && coincideControl && coincideLote;
    });
  }, [nombreBuscado, controlFiltro, loteFiltro]);

  return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
          ANÁLISIS QC / REGISTRO
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
          Registro de Controles
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Ingresa el valor medido del día. La unidad de medida se muestra como referencia.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label
            className={`group flex items-center gap-3 py-1.5 pl-2.5 pr-3.5 focus-within:border-status-info focus-within:ring-4 focus-within:ring-status-info/10 md:w-[300px] ${CLASE_CONTROL}`}
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-muted transition group-focus-within:bg-status-info-soft group-focus-within:text-status-info">
              <Search className="size-4" aria-hidden="true" />
            </span>
            <input
              value={nombreBuscado}
              onChange={(e) => setNombreBuscado(e.target.value)}
              type="search"
              placeholder="Buscar por similitud de nombre…"
              aria-label="Buscar analito o control por similitud de nombre"
              className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
            />
          </label>

          <div className="relative md:w-[220px]">
            <select
              value={controlFiltro}
              onChange={(e) => setControlFiltro(e.target.value)}
              aria-label="Filtrar por control"
              className={`w-full appearance-none py-0 pl-3.5 pr-9 text-sm font-medium ${controlFiltro ? "text-ink" : "text-ink-muted"} ${CLASE_CONTROL}`}
            >
              <option value="">Todos los controles</option>
              {CONTROLES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </div>

          <div className="relative md:w-[170px]">
            <select
              value={loteFiltro}
              onChange={(e) => setLoteFiltro(e.target.value)}
              aria-label="Filtrar por lote"
              className={`w-full appearance-none py-0 pl-3.5 pr-9 text-sm font-medium ${loteFiltro ? "text-ink" : "text-ink-muted"} ${CLASE_CONTROL}`}
            >
              <option value="">Todos los lotes</option>
              {LOTES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <button
            type="button"
            className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            <Gauge className={`size-4 transition-transform duration-500 ${EASE_PREMIUM} group-hover:rotate-90`} aria-hidden="true" />
            Calibrar
          </button>
          <Link
            href="/LeveyDashboardClientes/analisisCalidad/analitosControlados"
            className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white px-5 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(15_23_42_/_0.06)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info/40 hover:bg-surface-muted hover:shadow-[0_10px_24px_rgb(15_23_42_/_0.10)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            <ArrowUpRight className={`size-4 text-ink-muted transition-all duration-300 ${EASE_PREMIUM} group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-status-info`} aria-hidden="true" />
            Ir a Analitos Controlados
          </Link>
        </div>
      </div>

      <section
        aria-label="Registro diario de controles"
        className="mt-5 overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]"
      >
        <table className="w-full table-fixed border-collapse text-left [&_tbody_td]:align-top [&_tbody_td>p:first-child]:flex [&_tbody_td>p:first-child]:h-7 [&_tbody_td>p:first-child]:items-center">
          <colgroup>
            <col className="w-[12%]" />
            <col className="w-[8%]" />
            <col className="w-[7%]" />
            <col className="w-[7%]" />
            <col className="w-[6%]" />
            <col className="w-[7%]" />
            <col className="w-[8%]" />
            <col className="w-[9%]" />
            <col className="w-[15%]" />
            <col className="w-[9%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-[#f8f9fb]">
              <th scope="col" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Analito</th>
              <th scope="col" title="Valor del día" className="whitespace-nowrap px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Valor</th>
              <th scope="col" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Unidad</th>
              <th scope="col" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Media</th>
              <th scope="col" title="Desviación estándar" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">D.E</th>
              <th scope="col" title="Coeficiente de variación" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">C.V</th>
              <th scope="col" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Sesgo</th>
              <th scope="col" title="Última validación" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Última</th>
              <th scope="col" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Control</th>
              <th scope="col" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Lote</th>
              <th scope="col" className="px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registrosVisibles.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-5 py-14 text-center">
                  <p className="text-sm font-medium text-ink">Sin resultados</p>
                  <p className="mt-1 text-xs text-ink-faint">
                    Ajusta la búsqueda o los filtros para encontrar el analito.
                  </p>
                </td>
              </tr>
            ) : (
              registrosVisibles.map((r) => (
                <tr
                  key={`${r.analito}-${r.nivel}`}
                  className={`border-b border-line transition-colors duration-200 ${EASE_PREMIUM} last:border-b-0 hover:bg-[#f8f9fb]`}
                >
                  <td className="px-3 py-4 align-top">
                    <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{r.analito}</p>
                    <span className="mt-1.5 block whitespace-nowrap text-[9px] font-medium uppercase leading-none tracking-[0.04em] text-status-info">
                      {r.nivel}
                    </span>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label={`Valor del día para ${r.analito}, ${r.nivel}`}
                      placeholder="Valor"
                      className={`h-7 w-full max-w-[64px] rounded-md border border-line-strong bg-white px-1.5 text-xs font-medium tabular-nums text-ink shadow-[inset_0_1px_2px_rgb(15_23_42_/_0.03)] outline-none transition-all duration-200 ${EASE_PREMIUM} placeholder:font-normal placeholder:text-ink-faint focus-visible:border-status-info focus-visible:ring-[3px] focus-visible:ring-status-info/15`}
                    />
                    <p className="mt-1 whitespace-nowrap text-[11px] font-medium leading-4 tabular-nums text-ink-muted">
                      {r.ultimoValor}
                    </p>
                  </td>
                  <CeldaEstadistica valor={r.unidad} valorPrevio={r.unidad} />
                  <CeldaEstadistica valor={r.media} valorPrevio={r.mediaAnterior} />
                  <CeldaEstadistica valor={r.desviacion} valorPrevio={r.desviacionAnterior} />
                  <CeldaEstadistica valor={r.cov} valorPrevio={r.covAnterior} />
                  <CeldaEstadistica valor={r.sesgo} valorPrevio={r.sesgoAnterior} />
                  <td className="px-3 py-4 align-top">
                    <p className="text-[13px] font-medium text-ink">{r.validadoPor}</p>
                    <p className="mt-1 whitespace-nowrap text-[11px] leading-4 tabular-nums text-ink-faint">{r.fechaValidacion}</p>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <p className="text-[13px] font-medium text-ink">{r.control}</p>
                    <p className={`mt-1 whitespace-nowrap text-[11px] font-medium leading-4 ${TONO_ESTADO[r.estado.tono]}`}>
                      {r.estado.texto}
                    </p>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <p className="text-[13px] font-medium tabular-nums text-ink">{r.lote}</p>
                    <p className={`mt-1 whitespace-nowrap text-[11px] font-medium leading-4 ${r.calibrado ? "text-status-ok" : "text-status-alert"}`}>
                      {r.calibrado ? "Calibrado" : "Descalibrado"}
                    </p>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <AccionesFila analito={r.analito} nivel={r.nivel} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
