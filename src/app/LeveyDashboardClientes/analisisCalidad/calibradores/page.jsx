"use client";

import { useState } from "react";

export default function Calibradores() {
  const [popupInsertar, setPopupInsertar] = useState(false);
  const [popupEditar, setPopupEditar] = useState(false);

  return (
    <main className="min-h-dvh bg-canvas px-5 py-8 text-ink sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-line pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted">
            Análisis de calidad
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.035em] text-ink sm:text-4xl">
                Calibradores
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                Consulta la disponibilidad y las condiciones de resguardo de los calibradores del laboratorio.
              </p>
            </div>
            <div className="flex w-fit flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-status-info/20 bg-status-info-soft px-3 py-1 text-xs font-semibold text-status-info">
                Inventario activo
              </span>
              <button type="button" onClick={() => setPopupInsertar(true)} className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-ink/85">
                <span className="text-base leading-none" aria-hidden="true">+</span>
                Agregar calibrador
              </button>
            </div>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]">
          <div className="border-b border-line bg-[#f8f9fb] px-5 py-4 sm:px-6">
            <h2 className="text-sm font-bold text-ink">Listado de calibradores</h2>
            <p className="mt-1 text-xs text-ink-muted">Información de control para la operación diaria.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[19%]" />
                <col className="w-[25%]" />
                <col className="w-[14%]" />
                <col className="w-[17%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-line bg-[#fcfcfd]">
                  <th scope="col" className="px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Nombre calibrador</th>
                  <th scope="col" className="px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Detalle</th>
                  <th scope="col" className="px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Condiciones de almacenamiento</th>
                  <th scope="col" className="px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Estado</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.1em] text-ink-faint">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                <tr className="transition-colors hover:bg-[#fbfbfc]">
                  <td className="px-6 py-5 align-middle">
                    <p className="text-sm font-bold text-ink">Chemistry Sera-1</p>
                    <p className="mt-1 text-xs text-ink-muted">Roche</p>
                  </td>
                  <td className="px-6 py-5 align-middle text-sm text-ink-muted">
                    <p>Lote CS-2026-014</p>
                    <p className="mt-1 text-xs">Vence: 30 nov. 2026</p>
                  </td>
                  <td className="px-6 py-5 align-middle text-sm text-ink-muted">
                    <p className="font-medium text-ink">2 °C a 8 °C</p>
                    <p className="mt-1 text-xs">Refrigerador A · Estante 2</p>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-status-ok-soft px-2.5 py-1 text-xs font-bold text-status-ok">
                      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                      Activo
                    </span>
                    <p className="mt-1.5 text-[10px] text-ink-muted"><span className="text-[8px] font-bold uppercase tracking-[0.1em] text-ink-faint">Stock</span> · 8 unidades</p>
                  </td>
                  <td className="px-6 py-5 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <button type="button" onClick={() => setPopupEditar(true)} className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-ink-muted hover:bg-[#f8f9fb]">Editar</button>
                      <button type="button" aria-label="Desactivar calibrador" title="Desactivar calibrador" className="flex size-9 items-center justify-center rounded-lg border border-status-alert/25 bg-status-alert-soft text-status-alert transition-colors hover:border-status-alert/50">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="size-4" aria-hidden="true"><path d="M12 2v10" strokeLinecap="round" /><path d="M6.2 4.8a9 9 0 1 0 11.6 0" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="transition-colors hover:bg-[#fbfbfc]">
                  <td className="px-6 py-5 align-middle">
                    <p className="text-sm font-bold text-ink">Multianalito Hormone II</p>
                    <p className="mt-1 text-xs text-ink-muted">Abbott</p>
                  </td>
                  <td className="px-6 py-5 align-middle text-sm text-ink-muted">
                    <p>Lote HM-2025-087</p>
                    <p className="mt-1 text-xs">Vence: 01 feb. 2027</p>
                  </td>
                  <td className="px-6 py-5 align-middle text-sm text-ink-muted">
                    <p className="font-medium text-ink">2 °C a 8 °C</p>
                    <p className="mt-1 text-xs">Refrigerador B · Estante 1</p>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-status-ok-soft px-2.5 py-1 text-xs font-bold text-status-ok">
                      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                      Activo
                    </span>
                    <p className="mt-1.5 text-[10px] text-ink-muted"><span className="text-[8px] font-bold uppercase tracking-[0.1em] text-ink-faint">Stock</span> · 12 unidades</p>
                  </td>
                  <td className="px-6 py-5 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <button type="button" onClick={() => setPopupEditar(true)} className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-ink-muted hover:bg-[#f8f9fb]">Editar</button>
                      <button type="button" aria-label="Desactivar calibrador" title="Desactivar calibrador" className="flex size-9 items-center justify-center rounded-lg border border-status-alert/25 bg-status-alert-soft text-status-alert transition-colors hover:border-status-alert/50">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="size-4" aria-hidden="true"><path d="M12 2v10" strokeLinecap="round" /><path d="M6.2 4.8a9 9 0 1 0 11.6 0" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="transition-colors hover:bg-[#fbfbfc]">
                  <td className="px-6 py-5 align-middle">
                    <p className="text-sm font-bold text-ink">HbA1c Calibrator Set</p>
                    <p className="mt-1 text-xs text-ink-muted">Siemens</p>
                  </td>
                  <td className="px-6 py-5 align-middle text-sm text-ink-muted">
                    <p>Lote HB-2026-031</p>
                    <p className="mt-1 text-xs">Vence: 10 oct. 2026</p>
                  </td>
                  <td className="px-6 py-5 align-middle text-sm text-ink-muted">
                    <p className="font-medium text-ink">2 °C a 8 °C</p>
                    <p className="mt-1 text-xs">Refrigerador A · Estante 3</p>
                  </td>
                  <td className="px-6 py-5 align-middle">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-status-alert-soft px-2.5 py-1 text-xs font-bold text-status-alert">
                      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                      Inactivo
                    </span>
                    <p className="mt-1.5 text-[10px] text-ink-muted"><span className="text-[8px] font-bold uppercase tracking-[0.1em] text-ink-faint">Stock</span> · 4 unidades</p>
                  </td>
                  <td className="px-6 py-5 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <button type="button" onClick={() => setPopupEditar(true)} className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-ink transition-colors hover:border-ink-muted hover:bg-[#f8f9fb]">Editar</button>
                      <button type="button" aria-label="Activar calibrador" title="Activar calibrador" className="flex size-9 items-center justify-center rounded-lg border border-status-ok/25 bg-status-ok-soft text-status-ok transition-colors hover:border-status-ok/50">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="size-4" aria-hidden="true"><path d="M12 2v10" strokeLinecap="round" /><path d="M6.2 4.8a9 9 0 1 0 11.6 0" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {popupInsertar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-insertar-calibrador">
            <div className="max-h-[calc(100dvh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-line px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">Nuevo registro</p>
                  <h2 id="titulo-insertar-calibrador" className="mt-1 text-2xl font-bold tracking-[-0.03em] text-ink">Agregar calibrador</h2>
                  <p className="mt-2 text-sm text-ink-muted">Completa los datos para registrar un calibrador en el inventario.</p>
                </div>
                <button type="button" onClick={() => setPopupInsertar(false)} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-ink-muted transition-colors hover:bg-[#f3f4f6] hover:text-ink" aria-label="Cerrar formulario">×</button>
              </div>

              <form onSubmit={(evento) => evento.preventDefault()} className="grid gap-5 px-6 py-6 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Nombre del calibrador</span>
                  <input name="nombre" type="text" placeholder="Ej. Chemistry Sera-1" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Fabricante</span>
                  <input name="fabricante" type="text" placeholder="Ej. Roche" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Número de lote</span>
                  <input name="lote" type="text" placeholder="Ej. CS-2026-014" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Fecha de vencimiento</span>
                  <input name="vencimiento" type="date" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Stock inicial</span>
                  <input name="stock" type="number" min="0" placeholder="0" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Condiciones de almacenamiento</span>
                  <input name="condicionesAlmacenamiento" type="text" placeholder="Ej. 2 °C a 8 °C" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Ubicación</span>
                  <input name="ubicacion" type="text" placeholder="Ej. Refrigerador A · Estante 2" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Estado inicial</span>
                  <select name="estado" defaultValue="activo" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink-muted">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </label>

                <div className="flex items-end justify-end gap-3 sm:col-span-2">
                  <button type="button" onClick={() => setPopupInsertar(false)} className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-[#f8f9fb]">Cancelar</button>
                  <button type="submit" className="rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-ink/85">Guardar calibrador</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {popupEditar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-editar-calibrador">
            <div className="max-h-[calc(100dvh-3rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-white shadow-2xl">
              <div className="flex items-start justify-between border-b border-line px-6 py-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">Edición de registro</p>
                  <h2 id="titulo-editar-calibrador" className="mt-1 text-2xl font-bold tracking-[-0.03em] text-ink">Editar calibrador</h2>
                  <p className="mt-2 text-sm text-ink-muted">Actualiza los datos del calibrador seleccionado.</p>
                </div>
                <button type="button" onClick={() => setPopupEditar(false)} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-xl leading-none text-ink-muted transition-colors hover:bg-[#f3f4f6] hover:text-ink" aria-label="Cerrar edición">×</button>
              </div>

              <form onSubmit={(evento) => evento.preventDefault()} className="grid gap-5 px-6 py-6 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Nombre del calibrador</span>
                  <input name="nombreEditar" type="text" placeholder="Ingresa el nombre actualizado" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Fabricante</span>
                  <input name="fabricanteEditar" type="text" placeholder="Ingresa el fabricante" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Número de lote</span>
                  <input name="loteEditar" type="text" placeholder="Ingresa el lote" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Fecha de vencimiento</span>
                  <input name="vencimientoEditar" type="date" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Stock</span>
                  <input name="stockEditar" type="number" min="0" placeholder="Ingresa el stock" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Condiciones de almacenamiento</span>
                  <input name="condicionesAlmacenamientoEditar" type="text" placeholder="Ingresa las condiciones" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Ubicación</span>
                  <input name="ubicacionEditar" type="text" placeholder="Ingresa la ubicación" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-muted" />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">Estado</span>
                  <select name="estadoEditar" defaultValue="activo" className="mt-2 h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-ink-muted">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </label>

                <div className="flex items-end justify-end gap-3 sm:col-span-2">
                  <button type="button" onClick={() => setPopupEditar(false)} className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-[#f8f9fb]">Cancelar</button>
                  <button type="submit" className="rounded-lg bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-ink/85">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
