import { ChevronDown, Search } from "lucide-react";

// Transición premium: desaceleración suave al entrar/soltar, respuesta inmediata al presionar (active:duration-75).
const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// Control premium de formulario: misma altura y radio, foco morado.
const CLASE_CONTROL = `h-12 w-full rounded-xl border border-line bg-white shadow-[0_2px_8px_rgb(15_23_42_/_0.06)] outline-none transition-all duration-300 ${EASE_PREMIUM} hover:border-line-strong placeholder:text-ink-faint focus-visible:border-status-info focus-visible:ring-4 focus-visible:ring-status-info/10`;

export default function PaginaAnalitosControlados() {
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
        <table className="w-full min-w-[1280px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[11%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[13%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-[#f8f9fb]">
              <th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Analito controlado</th>
              <th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Control</th>
              <th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Calibrador usado</th>
              <th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Caducidad</th>
              <th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Estado</th>
              <th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Última modificación</th>
              <th scope="col" className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`border-b border-line transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#f8f9fb]`}>
              <td className="px-6 py-4 align-middle text-[14px] text-ink-muted">
                Glucosa
              </td>
              <td className="px-6 py-4 align-middle">
                <p className="text-[14px] font-medium text-ink">BioRad Glucosa</p>
                <p className="mt-1 whitespace-nowrap text-[11px] text-ink-faint">Lote: GLO090</p>
              </td>
              <td className="px-6 py-4 align-middle">
                <p className="text-[14px] font-medium text-ink">Human1 Multicalibrador</p>
                <p className="mt-1 whitespace-nowrap text-[11px] text-ink-faint">Calibrado <span className="tabular-nums">10/06/2026</span></p>
              </td>
              <td className="px-6 py-4 align-middle">
                <p className="text-[13px] font-medium tabular-nums text-ink">10/11/2026</p>
                <p className="mt-1 text-[11px] text-ink-faint">Activo</p>
              </td>
              <td className="px-6 py-4 align-middle">
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium text-status-alert">
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                  Desactivado
                </span>
              </td>
              <td className="px-6 py-4 align-middle">
                <p className="text-[13px] font-medium text-ink">y6</p>
                <p className="mt-1 whitespace-nowrap text-[11px] tabular-nums text-ink-faint">22/09/2026</p>
              </td>
              <td className="px-6 py-4 align-middle">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Ver BioRad Glucosa"
                    className={`inline-flex h-8 items-center rounded-lg border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.16)] active:translate-y-0 active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                  >
                    Ver
                  </button>
                  <button
                    type="button"
                    aria-label="Calibrar BioRad Glucosa"
                    className={`inline-flex h-8 items-center rounded-lg bg-black px-3.5 text-[13px] font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.12)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.32)] active:translate-y-0 active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                  >
                    Calibrar
                  </button>
                </div>
              </td>
            </tr>
            <tr className={`transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#f8f9fb]`}>
              <td className="px-6 py-4 align-middle text-[14px] text-ink-muted">
                Colesterol
              </td>
              <td className="px-6 py-4 align-middle">
                <p className="text-[14px] font-medium text-ink">BioRad Colesterol</p>
                <p className="mt-1 whitespace-nowrap text-[11px] text-ink-faint">Lote: CO0044</p>
              </td>
              <td className="px-6 py-4 align-middle">
                <p className="text-[14px] font-medium text-ink">RADOX Monocalibrador</p>
                <p className="mt-1 whitespace-nowrap text-[11px] text-ink-faint">Calibrado <span className="tabular-nums">10/06/2026</span></p>
              </td>
              <td className="px-6 py-4 align-middle">
                <p className="text-[13px] font-medium tabular-nums text-ink">10/11/2026</p>
                <p className="mt-1 text-[11px] text-ink-faint">Activo</p>
              </td>
              <td className="px-6 py-4 align-middle">
                <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium text-status-ok">
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                  Activado
                </span>
              </td>
              <td className="px-6 py-4 align-middle">
                <p className="text-[13px] font-medium text-ink">y6</p>
                <p className="mt-1 whitespace-nowrap text-[11px] tabular-nums text-ink-faint">21/09/2026</p>
              </td>
              <td className="px-6 py-4 align-middle">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Ver BioRad Colesterol"
                    className={`inline-flex h-8 items-center rounded-lg border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.16)] active:translate-y-0 active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                  >
                    Ver
                  </button>
                  <button
                    type="button"
                    aria-label="Calibrar BioRad Colesterol"
                    className={`inline-flex h-8 items-center rounded-lg bg-black px-3.5 text-[13px] font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.12)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.32)] active:translate-y-0 active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
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
        id="seleccionar-calibrador"
        aria-labelledby="titulo-seleccionar-calibrador"
        className="w-[min(440px,calc(100vw-2rem))] rounded-2xl border border-line bg-white p-0 text-ink shadow-2xl backdrop:bg-black/45"
      >
        <div className="p-6">
          <h2 id="titulo-seleccionar-calibrador" className="text-xl font-semibold tracking-[-0.025em]">
            Seleccione calibrador
          </h2>
          <label htmlFor="calibrador" className="mt-6 block text-sm font-medium text-ink-muted">
            Calibrador
          </label>
          <div className="relative mt-2">
            <select
              id="calibrador"
              defaultValue=""
              className={`${CLASE_CONTROL} h-11 appearance-none px-3 pr-9 text-sm font-medium text-ink-muted`}
            >
              <option value="" disabled>Selecciona un calibrador</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className={`inline-flex h-12 items-center justify-center rounded-xl border border-line-strong bg-white px-4 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(15_23_42_/_0.06)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-surface-muted hover:shadow-[0_10px_24px_rgb(15_23_42_/_0.10)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
            >
              Cancelar
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
