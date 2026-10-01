"use client";

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PaginaAnalitosControlados() {
  const [popupCalibrar, setPopupCalibrar] = useState(false);
  const [analitoSeleccionado, setAnalitoSeleccionado] = useState(null);
  const [calibradorSeleccionado, setCalibradorSeleccionado] = useState("");
  const [anotacion, setAnotacion] = useState("");
  const [estadoCalibracion, setEstadoCalibracion] = useState("calibrado");
  const [calibraciones, setCalibraciones] = useState({
    glucosa: { calibrador: "Human1 Multicalibrador", estado: "calibrado", anotacion: "" },
    colesterol: { calibrador: "RADOX Monocalibrador", estado: "calibrado", anotacion: "" },
  });
  const dialogoCalibrar = useRef(null);

  useEffect(() => {
    if (popupCalibrar) {
      dialogoCalibrar.current?.showModal();
    } else {
      dialogoCalibrar.current?.close();
    }
  }, [popupCalibrar]);

  function abrirCalibracion(analito) {
    setAnalitoSeleccionado(analito);
    setCalibradorSeleccionado(calibraciones[analito].calibrador);
    setAnotacion(calibraciones[analito].anotacion);
    setEstadoCalibracion(calibraciones[analito].estado);
    setPopupCalibrar(true);
  }

  const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";
  const CLASE_CONTROL = `h-12 w-full rounded-xl border border-line bg-white shadow-[0_2px_8px_rgb(15_23_42_/_0.06)] outline-none transition-all duration-300 ${EASE_PREMIUM} hover:border-line-strong placeholder:text-ink-faint focus-visible:border-status-info focus-visible:ring-4 focus-visible:ring-status-info/10`;

  return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
            ANALISIS QC / ANALITOS CONTROLADOS
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
            Analitos Controlados
          </h1>
        </header>

        <div className="flex flex-wrap gap-3 sm:justify-end">
          <button
            type="button"
            className={`inline-flex h-12 items-center justify-center rounded-xl border border-line-strong bg-white px-5 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(15_23_42_/_0.06)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info/40 hover:bg-surface-muted hover:shadow-[0_10px_24px_rgb(15_23_42_/_0.10)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            Ver Analitos
          </button>
          <button
            type="button"
            className={`inline-flex h-12 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            Ingresar Control
          </button>
        </div>
      </div>

      <div className="mt-10 grid max-w-[1200px] gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div>
          <label htmlFor="nombre-control" className="mb-2 block text-sm font-medium text-ink-muted">
            Nombre del control
          </label>
          <div className="relative">
            <select
              id="nombre-control"
              defaultValue=""
              className={`${CLASE_CONTROL} appearance-none px-4 pr-9 text-sm font-medium text-ink`}
            >
              <option value="">Todos los controles</option>
              <option value="glucosa">BioRad Glucosa</option>
              <option value="colesterol">BioRad Colesterol</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </div>
        </div>
        <div>
          <label htmlFor="nombre-analito" className="mb-2 block text-sm font-medium text-ink-muted">
            Nombre del analito
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              id="nombre-analito"
              type="search"
              placeholder="Ej. Glucosa"
              className={`${CLASE_CONTROL} pl-10 pr-4 text-sm font-medium text-ink`}
            />
          </div>
        </div>
        <div>
          <label htmlFor="fecha-caducidad" className="mb-2 block text-sm font-medium text-ink-muted">
            Fecha de caducidad
          </label>
          <input
            id="fecha-caducidad"
            type="date"
            className={`${CLASE_CONTROL} px-4 text-sm font-medium text-ink`}
          />
        </div>
      </div>

      <section
        aria-label="Analitos controlados de química"
        className="mt-9 overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]"
      >
        <table className="w-full min-w-[900px] table-auto border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-[#f8f9fb]">
              <th scope="col" className="px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Analito controlado</th>
              <th scope="col" className="px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Control</th>
              <th scope="col" className="px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Calibrador usado</th>
              <th scope="col" className="px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Caducidad</th>
              <th scope="col" className="px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Estado</th>
              <th scope="col" className="px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`border-b border-line transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#f8f9fb]`}>
              <td className="px-3 py-3 align-middle text-[13px] text-ink-muted">
                <p className="font-medium text-ink">Glucosa</p>
                <p className="mt-1 text-[11px] leading-4 text-ink-faint">Hexoquinasa</p>
              </td>
              <td className="px-3 py-3 align-middle">
                <p className="text-[13px] font-medium text-ink">BioRad Glucosa</p>
                <p className="mt-1 whitespace-nowrap text-[11px] text-ink-faint">Lote: GLO090</p>
              </td>
              <td className="px-3 py-3 align-middle">
                <p className="text-[13px] font-medium text-ink">{calibraciones.glucosa.calibrador || "Sin calibrador seleccionado"}</p>
                <p className={`mt-1 text-[11px] ${calibraciones.glucosa.estado === "calibrado" ? "text-status-ok" : "text-ink-muted"}`}>
                  {calibraciones.glucosa.estado === "calibrado" ? "Calibrado" : "Sin calibrar"}
                </p>
              </td>
              <td className="px-3 py-3 align-middle">
                <p className="text-[13px] font-medium tabular-nums text-ink">10/11/2026</p>
                <p className="mt-1 text-[11px] text-ink-faint">Activo</p>
              </td>
              <td className="px-3 py-3 align-middle">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-status-alert">
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                  Desactivado
                </span>
              </td>
              <td className="px-3 py-3 align-middle">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Ver BioRad Glucosa"
                    className={`inline-flex h-8 items-center rounded-lg border border-line-strong bg-white px-3 text-[13px] font-medium text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.16)] active:translate-y-0 active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                  >
                    Ver
                  </button>
                  <button
                    type="button"
                    aria-label="Calibrar BioRad Glucosa"
                    onClick={() => abrirCalibracion("glucosa")}
                    className={`inline-flex h-8 items-center rounded-lg bg-black px-3 text-[13px] font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.12)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.32)] active:translate-y-0 active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                  >
                    Calibrar
                  </button>
                </div>
              </td>
            </tr>
            <tr className={`transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#f8f9fb]`}>
              <td className="px-3 py-3 align-middle text-[13px] text-ink-muted">
                <p className="font-medium text-ink">Colesterol</p>
                <p className="mt-1 text-[11px] leading-4 text-ink-faint">CHOD-PAP</p>
              </td>
              <td className="px-3 py-3 align-middle">
                <p className="text-[13px] font-medium text-ink">BioRad Colesterol</p>
                <p className="mt-1 whitespace-nowrap text-[11px] text-ink-faint">Lote: CO0044</p>
              </td>
              <td className="px-3 py-3 align-middle">
                <p className="text-[13px] font-medium text-ink">{calibraciones.colesterol.calibrador || "Sin calibrador seleccionado"}</p>
                <p className={`mt-1 text-[11px] ${calibraciones.colesterol.estado === "calibrado" ? "text-status-ok" : "text-ink-muted"}`}>
                  {calibraciones.colesterol.estado === "calibrado" ? "Calibrado" : "Sin calibrar"}
                </p>
              </td>
              <td className="px-3 py-3 align-middle">
                <p className="text-[13px] font-medium tabular-nums text-ink">10/11/2026</p>
                <p className="mt-1 text-[11px] text-ink-faint">Activo</p>
              </td>
              <td className="px-3 py-3 align-middle">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-status-ok">
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                  Activado
                </span>
              </td>
              <td className="px-3 py-3 align-middle">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Ver BioRad Colesterol"
                    className={`inline-flex h-8 items-center rounded-lg border border-line-strong bg-white px-3 text-[13px] font-medium text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.16)] active:translate-y-0 active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                  >
                    Ver
                  </button>
                  <button
                    type="button"
                    aria-label="Calibrar BioRad Colesterol"
                    onClick={() => abrirCalibracion("colesterol")}
                    className={`inline-flex h-8 items-center rounded-lg bg-black px-3 text-[13px] font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.12)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.32)] active:translate-y-0 active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                  >
                    Calibrar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <dialog
        ref={dialogoCalibrar}
        id="seleccionar-calibrador"
        aria-labelledby="titulo-seleccionar-calibrador"
        onClose={() => setPopupCalibrar(false)}
        className="m-auto max-h-[calc(100dvh-3rem)] w-[min(520px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-white p-0 text-ink shadow-2xl backdrop:bg-black/45 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line bg-canvas px-6 py-5">
          <div>
            <h2 id="titulo-seleccionar-calibrador" className="text-xl font-semibold tracking-[-0.025em]">Calibrar analito</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {analitoSeleccionado === "glucosa" ? "Glucosa · Hexoquinasa" : "Colesterol · CHOD-PAP"}
            </p>
          </div>
          <button type="button" onClick={() => setPopupCalibrar(false)} aria-label="Cerrar calibración" className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xl text-ink-muted hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-status-info">×</button>
        </div>
        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            if (!analitoSeleccionado) return;
            setCalibraciones((actuales) => ({
              ...actuales,
              [analitoSeleccionado]: {
                calibrador: calibradorSeleccionado,
                estado: estadoCalibracion,
                anotacion,
              },
            }));
            setPopupCalibrar(false);
          }}
          className="space-y-5 p-6"
        >
          <div>
            <label htmlFor="calibrador" className="mb-2 block text-sm font-medium text-ink-muted">Calibrador</label>
            <div className="relative">
              <select id="calibrador" name="calibrador" value={calibradorSeleccionado} onChange={(evento) => setCalibradorSeleccionado(evento.target.value)} required={estadoCalibracion === "calibrado"} className={`${CLASE_CONTROL} appearance-none px-3 pr-9 text-sm text-ink`}>
                <option value="">Selecciona un calibrador</option>
                <option value="Human1 Multicalibrador">Human1 Multicalibrador</option>
                <option value="RADOX Monocalibrador">RADOX Monocalibrador</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            </div>
          </div>
          <div>
            <label htmlFor="estado-calibracion" className="mb-2 block text-sm font-medium text-ink-muted">Estado de calibración</label>
            <div className="relative">
              <select id="estado-calibracion" name="estadoCalibracion" value={estadoCalibracion} onChange={(evento) => setEstadoCalibracion(evento.target.value)} className={`${CLASE_CONTROL} appearance-none px-3 pr-9 text-sm text-ink`}>
                <option value="sinCalibrar">Sin calibrar</option>
                <option value="calibrado">Calibrado</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            </div>
          </div>
          <div>
            <label htmlFor="anotacion-calibracion" className="mb-2 block text-sm font-medium text-ink-muted">Anotación <span className="text-xs font-normal text-ink-faint">(opcional)</span></label>
            <textarea id="anotacion-calibracion" name="anotacion" value={anotacion} onChange={(evento) => setAnotacion(evento.target.value)} rows={4} placeholder="Escribe una observación sobre la calibración…" className="w-full resize-y rounded-xl border border-line bg-white px-3 py-3 text-sm text-ink shadow-sm outline-none placeholder:text-ink-faint focus:border-status-info focus:ring-4 focus:ring-status-info/10" />
          </div>
          <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-5">
            <button type="button" onClick={() => setPopupCalibrar(false)} className="h-11 rounded-xl border border-line bg-white px-4 text-sm font-medium text-ink hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-status-info">Cancelar</button>
            <button type="submit" className="h-11 rounded-xl bg-ink px-4 text-sm font-medium text-white hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">Guardar cambios</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
