"use client";

import { useUser } from "@clerk/nextjs";
import { CalendarDays, CircleAlert, Check, ClipboardList, Eye, Hammer, Microscope, Plus, UserRound, X } from "lucide-react";
import { useCallback, useState } from "react";
import ContadorCelulas from "./ContadorCelulas";

const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const CLASE_CAMPO = `h-9 w-full rounded-lg border border-line bg-white px-3 text-[13px] text-ink shadow-[0_1px_3px_rgb(15_23_42_/_0.04)] outline-none transition-all duration-300 ${EASE_PREMIUM} placeholder:text-ink-faint hover:border-line-strong focus-visible:border-status-info focus-visible:ring-4 focus-visible:ring-status-info/10`;
const CLASE_AREA_TEXTO = `min-h-20 w-full resize-none rounded-lg border border-line bg-white px-3 py-2.5 text-[13px] leading-4 text-ink shadow-[0_1px_3px_rgb(15_23_42_/_0.04)] outline-none transition-all duration-300 ${EASE_PREMIUM} placeholder:text-ink-faint hover:border-line-strong focus-visible:border-status-info focus-visible:ring-4 focus-visible:ring-status-info/10`;
const CLASE_ETIQUETA = "mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted";

const PROFESIONALES = {
  BOL: "Bárbara Olivos",
  FDI: "Fernando Díaz",
  AMH: "Ana María Hernández",
  RSO: "Rosa Soto",
  MVE: "María Vega",
};

function EtiquetaTecnico({ codigo }) {
  return (
    <div className="mt-1.5 min-w-0">
      <p className="truncate text-[10px] font-semibold text-ink">{PROFESIONALES[codigo] ?? codigo}</p>
      <p className="mt-px text-[9px] font-bold uppercase tracking-[0.1em] text-status-info/80">TM {codigo}</p>
    </div>
  );
}

function Recuento({ children }) {
  return (
    <div className="rounded-lg border border-line/60 bg-[#fafbfc] px-2 py-1.5">
      <p className="text-[9px] font-medium leading-3.5 text-ink-muted">{children}</p>
    </div>
  );
}

function NoAplica() {
  return (
    <span className="inline-flex rounded-full border border-line/60 bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-ink-faint">
      No aplica
    </span>
  );
}

function BotonAccion({ etiqueta, tono, children }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={etiqueta}
        className={`flex size-7 items-center justify-center rounded-lg border border-line/60 bg-white text-ink-faint shadow-[0_1px_2px_rgb(15_23_42_/_0.05)] transition-all duration-300 ${EASE_PREMIUM} focus-visible:outline-2 focus-visible:outline-offset-1 ${tono}`}
      >
        {children}
      </button>
      <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-[#11141c] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white opacity-0 shadow-[0_6px_18px_rgb(15_23_42_/_0.3)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        {etiqueta}
      </span>
    </span>
  );
}

const CELDA_ACCIONES = (
  <td className="px-3 py-3 align-top">
    <div className="flex items-center justify-center gap-1.5">
      <BotonAccion
        etiqueta="Corregir"
        tono="hover:border-status-warn/40 hover:bg-status-warn-soft hover:text-status-warn focus-visible:outline-status-warn"
      >
        <Hammer className="size-3.5" aria-hidden="true" />
      </BotonAccion>
      <BotonAccion
        etiqueta="Detalle"
        tono="hover:border-status-info/40 hover:bg-status-info-soft hover:text-status-info focus-visible:outline-status-info"
      >
        <Eye className="size-3.5" aria-hidden="true" />
      </BotonAccion>
    </div>
  </td>
);

function derivarIniciales(nombre) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "US";
  if (partes.length === 1) return partes[0].slice(0, 3).toUpperCase();
  return (partes[0][0] + (partes[1]?.[0] ?? "") + (partes[2]?.[0] ?? partes[1]?.[1] ?? "")).toUpperCase();
}

function PopupNuevoRegistro({
  onCerrar,
  onAbrirContador,
  recuentoControlUno,
  recuentoControlDos,
  onCambiarRecuentoControlUno,
  onCambiarRecuentoControlDos,
}) {
  const { user } = useUser();

  const [asignaciones, setAsignaciones] = useState({
    controlUno: null,
    controlDos: null,
  });

  const asignarUsuario = (control) => {
    const nombre = user?.fullName || user?.username || "Usuario autenticado";
    if (!nombre) return;

    setAsignaciones((actuales) => {
      if (actuales[control]) return actuales;
      return { ...actuales, [control]: { nombre, iniciales: derivarIniciales(nombre) } };
    });
  };

  const lecturaDuplicada = Boolean(
    asignaciones.controlUno
    && asignaciones.controlDos
    && asignaciones.controlUno.nombre === asignaciones.controlDos.nombre,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11141c]/60 p-4 backdrop-blur-sm">
      <section
        id="nuevo-registro-control-pares"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-nuevo-registro"
        className="max-h-[90dvh] w-full max-w-[960px] overflow-hidden rounded-[20px] border border-line bg-white text-ink shadow-[0_30px_100px_rgb(15_23_42_/_0.28)]"
      >
        <div className="max-h-[90dvh] overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-6 border-b border-line bg-white/95 px-4 py-3.5 backdrop-blur sm:px-6">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-status-info">Control de pares</p>
            <h2 id="titulo-nuevo-registro" className="mt-1 text-lg font-semibold tracking-[-0.025em] text-ink sm:text-xl">
              Nuevo registro
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-4 text-ink-muted">
              Registra las dos lecturas del examen y el detalle de los elementos observados por cada profesional.
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar nuevo registro"
            className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink-muted transition-all duration-300 ${EASE_PREMIUM} hover:border-line-strong hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-4 bg-[#fafbfc] p-4 sm:p-5">
          <section aria-labelledby="datos-examen" className="rounded-2xl border border-line bg-white p-4 shadow-[0_6px_20px_rgb(15_23_42_/_0.035)]">
            <div className="flex items-center gap-2.5 border-b border-line pb-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-status-info-soft text-status-info">
                <CalendarDays className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h3 id="datos-examen" className="text-sm font-semibold text-ink">Datos del examen</h3>
                <p className="mt-0.5 text-xs text-ink-muted">Identificación general del registro comparativo.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)_220px]">
              <div>
                <label htmlFor="fecha-control-pares" className={CLASE_ETIQUETA}>Fecha</label>
                <input id="fecha-control-pares" name="fecha" type="date" className={CLASE_CAMPO} />
              </div>
              <div>
                <label htmlFor="examen-control-pares" className={CLASE_ETIQUETA}>Examen</label>
                <select id="examen-control-pares" name="examen" defaultValue="" className={CLASE_CAMPO}>
                  <option value="" disabled>Selecciona un examen</option>
                  <option>Recuento de reticulocitos</option>
                  <option>Eosinófilos en secreción nasal</option>
                  <option>Frotis manual</option>
                  <option>Velocidad de hemosedimentación (VHS)</option>
                  <option>Examen parasitológico</option>
                </select>
              </div>
              <div>
                <label htmlFor="area-control-pares" className={CLASE_ETIQUETA}>Área del examen</label>
                <select id="area-control-pares" name="area" defaultValue="" className={CLASE_CAMPO}>
                  <option value="" disabled>Selecciona un área</option>
                  <option>Hematología</option>
                  <option>Microscopía</option>
                  <option>Parasitología</option>
                  <option>Microbiología</option>
                  <option>Orinas</option>
                </select>
              </div>
            </div>
          </section>

          <div className="grid gap-5 xl:grid-cols-2">
            <section aria-labelledby="datos-control-uno" className="rounded-2xl border border-line bg-white p-4 shadow-[0_6px_20px_rgb(15_23_42_/_0.035)]">
              <div className="flex items-center gap-2.5 border-b border-line pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#eef4f7] text-[#456575]">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">Primera lectura</p>
                  <h3 id="datos-control-uno" className="mt-0.5 text-sm font-semibold text-ink">Control 1</h3>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="profesional-control-uno" className={CLASE_ETIQUETA}>Profesional</label>
                  {asignaciones.controlUno ? (
                    <div id="profesional-control-uno" role="status" className="flex h-9 items-center gap-2 rounded-lg border border-[#b9ddc5] bg-status-ok-soft px-3">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-status-ok text-[8px] font-bold text-white">{asignaciones.controlUno.iniciales}</span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{asignaciones.controlUno.nombre}</span>
                      <Check className="size-4 shrink-0 text-status-ok" aria-hidden="true" />
                    </div>
                  ) : (
                    <select id="profesional-control-uno" name="profesionalControlUno" defaultValue="" className={CLASE_CAMPO}>
                      <option value="" disabled>Selecciona profesional</option>
                      <option>TM BOL · Bárbara Olivos</option>
                      <option>TM FDI · Fernando Díaz</option>
                      <option>TM AMH · Ana María Hernández</option>
                      <option>TM RSO · Rosa Soto</option>
                      <option>TM MVE · María Vega</option>
                    </select>
                  )}
                  <p className={`mt-1 text-[10px] leading-3.5 ${asignaciones.controlUno ? "font-semibold text-status-ok" : "text-ink-faint"}`}>
                    {asignaciones.controlUno ? "Tu usuario quedó registrado en esta lectura." : "Se registrará automáticamente con tu usuario al completar datos."}
                  </p>
                </div>
                <div>
                  <label htmlFor="resultado-control-uno" className={CLASE_ETIQUETA}>Resultado</label>
                  <input id="resultado-control-uno" name="resultadoControlUno" type="text" placeholder="Ej. 1,40 % o Negativo" className={CLASE_CAMPO} onChange={() => asignarUsuario("controlUno")} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="aplicacion-recuento-uno" className={CLASE_ETIQUETA}>Condición del recuento</label>
                  <select id="aplicacion-recuento-uno" name="aplicacionRecuentoUno" defaultValue="requerido" className={CLASE_CAMPO} onChange={() => asignarUsuario("controlUno")}>
                    <option value="requerido">Recuento requerido</option>
                    <option value="no-aplica">No aplica</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="recuento-control-uno" className={CLASE_ETIQUETA}>Elementos detectados / Recuento</label>
                  <textarea
                    id="recuento-control-uno"
                    name="recuentoControlUno"
                    rows={4}
                    value={recuentoControlUno}
                    onChange={(evento) => {
                      asignarUsuario("controlUno");
                      onCambiarRecuentoControlUno(evento.target.value);
                    }}
                    placeholder="Ej. Leucocitos: 5–10/campo · Eritrocitos: 0–3/campo"
                    className={CLASE_AREA_TEXTO}
                  />
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[11px] leading-4 text-ink-faint">Incluye células, parásitos u otros elementos observados.</p>
                    <button
                      type="button"
                      onClick={() => {
                        asignarUsuario("controlUno");
                        onAbrirContador("controlUno");
                      }}
                      className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#cbdde5] bg-[#eef5f8] px-3 text-xs font-semibold text-[#315b6d] transition hover:border-[#9fbac6] hover:bg-[#e2eef3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f7180]"
                    >
                      <Microscope className="size-3.5" aria-hidden="true" />
                      Abrir contador celular
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="datos-control-dos" className="rounded-2xl border border-line bg-white p-4 shadow-[0_6px_20px_rgb(15_23_42_/_0.035)]">
              <div className="flex items-center gap-2.5 border-b border-line pb-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-status-info-soft text-status-info">
                  <UserRound className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">Segunda lectura</p>
                  <h3 id="datos-control-dos" className="mt-0.5 text-sm font-semibold text-ink">Control 2</h3>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="profesional-control-dos" className={CLASE_ETIQUETA}>Profesional</label>
                  {asignaciones.controlDos ? (
                    <div id="profesional-control-dos" role="status" className="flex h-9 items-center gap-2 rounded-lg border border-[#b9ddc5] bg-status-ok-soft px-3">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-status-ok text-[8px] font-bold text-white">{asignaciones.controlDos.iniciales}</span>
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{asignaciones.controlDos.nombre}</span>
                      <Check className="size-4 shrink-0 text-status-ok" aria-hidden="true" />
                    </div>
                  ) : (
                    <select id="profesional-control-dos" name="profesionalControlDos" defaultValue="" className={CLASE_CAMPO}>
                      <option value="" disabled>Selecciona profesional</option>
                      <option>TM BOL · Bárbara Olivos</option>
                      <option>TM FDI · Fernando Díaz</option>
                      <option>TM AMH · Ana María Hernández</option>
                      <option>TM RSO · Rosa Soto</option>
                      <option>TM MVE · María Vega</option>
                    </select>
                  )}
                  <p className={`mt-1 text-[10px] leading-3.5 ${asignaciones.controlDos ? "font-semibold text-status-ok" : "text-ink-faint"}`}>
                    {asignaciones.controlDos ? "Tu usuario quedó registrado en esta lectura." : "Se registrará automáticamente con tu usuario al completar datos."}
                  </p>
                </div>
                <div>
                  <label htmlFor="resultado-control-dos" className={CLASE_ETIQUETA}>Resultado</label>
                  <input id="resultado-control-dos" name="resultadoControlDos" type="text" placeholder="Ej. 1,50 % o Negativo" className={CLASE_CAMPO} onChange={() => asignarUsuario("controlDos")} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="aplicacion-recuento-dos" className={CLASE_ETIQUETA}>Condición del recuento</label>
                  <select id="aplicacion-recuento-dos" name="aplicacionRecuentoDos" defaultValue="requerido" className={CLASE_CAMPO} onChange={() => asignarUsuario("controlDos")}>
                    <option value="requerido">Recuento requerido</option>
                    <option value="no-aplica">No aplica</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="recuento-control-dos" className={CLASE_ETIQUETA}>Elementos detectados / Recuento</label>
                  <textarea
                    id="recuento-control-dos"
                    name="recuentoControlDos"
                    rows={4}
                    value={recuentoControlDos}
                    onChange={(evento) => {
                      asignarUsuario("controlDos");
                      onCambiarRecuentoControlDos(evento.target.value);
                    }}
                    placeholder="Ej. Quistes: 2/campo · Trofozoítos: 0/campo"
                    className={CLASE_AREA_TEXTO}
                  />
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[11px] leading-4 text-ink-faint">Registra el recuento informado por el segundo profesional.</p>
                    <button
                      type="button"
                      onClick={() => {
                        asignarUsuario("controlDos");
                        onAbrirContador("controlDos");
                      }}
                      className="inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#dcd2f4] bg-status-info-soft px-3 text-xs font-semibold text-status-info transition hover:border-[#b9a9e6] hover:bg-[#e8e0fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info"
                    >
                      <Microscope className="size-3.5" aria-hidden="true" />
                      Abrir contador celular
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {lecturaDuplicada ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-status-alert/30 bg-status-alert-soft px-3.5 py-3 text-status-alert">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="text-xs leading-5">Ambas lecturas quedaron registradas a tu nombre. Un control de pares requiere dos profesionales distintos.</p>
            </div>
          ) : null}

          <section aria-labelledby="observaciones-registro" className="rounded-2xl border border-line bg-white p-4 shadow-[0_6px_20px_rgb(15_23_42_/_0.035)]">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-surface-muted text-ink-muted">
                <ClipboardList className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h3 id="observaciones-registro" className="text-sm font-semibold text-ink">Observaciones</h3>
                <p className="mt-0.5 text-xs text-ink-muted">Describe concordancias, diferencias o hallazgos relevantes.</p>
              </div>
            </div>
            <textarea
              id="observaciones-control-pares"
              name="observaciones"
              rows={3}
              placeholder="Ej. Lecturas concordantes o diferencia mayor a la esperada…"
              className={`mt-3 ${CLASE_AREA_TEXTO}`}
            />
          </section>
        </div>

        <footer className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-[10px] leading-3.5 text-ink-faint sm:text-left">El contador puede utilizarse de forma independiente para cada lectura.</p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onCerrar}
              className={`inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-line-strong bg-white px-4 text-[13px] font-medium text-ink transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:flex-none`}
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-black px-4 text-[13px] font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:flex-none`}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Guardar registro
            </button>
          </div>
        </footer>
        </div>
      </section>
    </div>
  );
}

export default function PaginaControlDePares() {
  const [popupAbierto, setPopupAbierto] = useState(false);
  const [contadorActivo, setContadorActivo] = useState(null);
  const [recuentoControlUno, setRecuentoControlUno] = useState("");
  const [recuentoControlDos, setRecuentoControlDos] = useState("");
  const [sesionesConteo, setSesionesConteo] = useState({
    controlUno: null,
    controlDos: null,
  });

  const cerrarPopup = useCallback(() => {
    setContadorActivo(null);
    setPopupAbierto(false);
  }, []);

  const cerrarContador = useCallback(() => {
    setContadorActivo(null);
  }, []);

  const aplicarDiferencial = useCallback((sesion) => {
    if (!contadorActivo) return;

    setSesionesConteo((sesionesActuales) => ({
      ...sesionesActuales,
      [contadorActivo]: sesion,
    }));

    if (contadorActivo === "controlUno") {
      setRecuentoControlUno(sesion.resumen);
    } else {
      setRecuentoControlDos(sesion.resumen);
    }

    setContadorActivo(null);
  }, [contadorActivo]);

  return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
      <header className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
            Gestión / Control de pares
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
            Control de Pares
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
            Compara el resultado de un mismo examen informado por dos profesionales y registra los elementos detectados en cada lectura.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <div className="inline-flex h-12 items-center gap-2.5 rounded-full border border-line bg-white px-4 text-sm font-medium text-ink-muted shadow-[0_2px_8px_rgb(15_23_42_/_0.04)]">
            <span className="size-2 rounded-full bg-status-ok" aria-hidden="true" />
            <span><strong className="font-semibold text-ink">11</strong> registros totales</span>
          </div>
          <button
            type="button"
            onClick={() => setPopupAbierto(true)}
            aria-haspopup="dialog"
            aria-controls="nuevo-registro-control-pares"
            className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            <Plus className={`size-4 transition-transform duration-300 ${EASE_PREMIUM} group-hover:rotate-90`} aria-hidden="true" />
            Nuevo registro
          </button>
        </div>
      </header>

      <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]">
        <div className="flex border-b border-line px-4 py-3 sm:px-6 lg:justify-end">
          <span className="inline-flex h-6 shrink-0 items-center justify-center rounded-full bg-status-info-soft px-2.5 text-[10px] font-semibold text-status-info">
            4 registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[9%]" />
              <col className="w-[21%]" />
              <col className="w-[15%]" />
              <col className="w-[16%]" />
              <col className="w-[15%]" />
              <col className="w-[16%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-line/60 bg-[#f8f9fb]">
                <th rowSpan={2} scope="col" className="border-r border-line px-4 py-3 align-middle text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Fecha
                </th>
                <th rowSpan={2} scope="col" className="border-r border-line px-4 py-3 align-middle text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Examen
                </th>
                <th colSpan={2} scope="colgroup" className="border-r border-line px-4 py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-status-info">
                  Control 1
                </th>
                <th colSpan={2} scope="colgroup" className="px-4 py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.14em] text-status-info">
                  Control 2
                </th>
                <th rowSpan={2} scope="col" className="px-3 py-3 align-middle text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Acciones
                </th>
              </tr>
              <tr className="border-b border-line/60 bg-[#f8f9fb]">
                <th scope="col" className="border-r border-t border-line/60 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Resultado</th>
                <th scope="col" className="border-r border-t border-line/60 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Recuento</th>
                <th scope="col" className="border-r border-t border-line/60 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Resultado</th>
                <th scope="col" className="border-t border-line/60 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Recuento</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border-b border-line/60 transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#fbfbfc]`}>
                <td className="border-r border-line/60 px-4 py-3 align-top whitespace-nowrap text-[10px] font-medium tabular-nums text-ink-muted">02-07-2026</td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="text-[12px] font-semibold leading-4 text-ink">Recuento de reticulocitos</p>
                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-status-info/80">Hematología</p>
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="font-mono text-[12px] font-semibold tabular-nums text-ink">1,40 %</p>
                  <EtiquetaTecnico codigo="BOL" />
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <Recuento>14 reticulocitos por 1.000 eritrocitos</Recuento>
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="font-mono text-[12px] font-semibold tabular-nums text-ink">1,50 %</p>
                  <EtiquetaTecnico codigo="FDI" />
                </td>
                <td className="px-4 py-3 align-top">
                  <Recuento>15 reticulocitos por 1.000 eritrocitos</Recuento>
                </td>
                {CELDA_ACCIONES}
              </tr>

              <tr className={`border-b border-line/60 transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#fbfbfc]`}>
                <td className="border-r border-line/60 px-4 py-3 align-top whitespace-nowrap text-[10px] font-medium tabular-nums text-ink-muted">02-07-2026</td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="text-[12px] font-semibold leading-4 text-ink">Eosinófilos en secreción nasal</p>
                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-status-info/80">Hematología</p>
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="text-[11px] font-semibold text-ink">Negativo</p>
                  <EtiquetaTecnico codigo="FDI" />
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <Recuento>0 eosinófilos detectados</Recuento>
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="text-[11px] font-semibold text-ink">Negativo</p>
                  <EtiquetaTecnico codigo="BOL" />
                </td>
                <td className="px-4 py-3 align-top">
                  <Recuento>0 eosinófilos detectados</Recuento>
                </td>
                {CELDA_ACCIONES}
              </tr>

              <tr className={`border-b border-line/60 transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#fbfbfc]`}>
                <td className="border-r border-line/60 px-4 py-3 align-top whitespace-nowrap text-[10px] font-medium tabular-nums text-ink-muted">09-07-2026</td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="text-[12px] font-semibold leading-4 text-ink">Frotis manual</p>
                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-status-info/80">Microscopía</p>
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="text-[11px] font-semibold text-ink">Tinción OK</p>
                  <EtiquetaTecnico codigo="BOL" />
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <Recuento>
                    Células epiteliales: abundantes<br />
                    Leucocitos: 5–10/campo<br />
                    Eritrocitos: 0–3/campo
                  </Recuento>
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="text-[11px] font-semibold text-ink">Tinción OK</p>
                  <EtiquetaTecnico codigo="AMH" />
                </td>
                <td className="px-4 py-3 align-top">
                  <Recuento>
                    Células epiteliales: abundantes<br />
                    Leucocitos: 5–10/campo<br />
                    Eritrocitos: 0–3/campo
                  </Recuento>
                </td>
                {CELDA_ACCIONES}
              </tr>

              <tr className={`transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#fbfbfc]`}>
                <td className="border-r border-line/60 px-4 py-3 align-top whitespace-nowrap text-[10px] font-medium tabular-nums text-ink-muted">18-07-2026</td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="text-[12px] font-semibold leading-4 text-ink">Velocidad de hemosedimentación (VHS)</p>
                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-status-info/80">Hematología</p>
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="font-mono text-[12px] font-semibold tabular-nums text-ink">10 mm/h</p>
                  <EtiquetaTecnico codigo="RSO" />
                </td>
                <td className="border-r border-line/60 px-4 py-3 align-top"><NoAplica /></td>
                <td className="border-r border-line/60 px-4 py-3 align-top">
                  <p className="font-mono text-[12px] font-semibold tabular-nums text-ink">18 mm/h</p>
                  <EtiquetaTecnico codigo="MVE" />
                </td>
                <td className="px-4 py-3 align-top"><NoAplica /></td>
                {CELDA_ACCIONES}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {popupAbierto ? (
        <PopupNuevoRegistro
          onCerrar={cerrarPopup}
          onAbrirContador={setContadorActivo}
          recuentoControlUno={recuentoControlUno}
          recuentoControlDos={recuentoControlDos}
          onCambiarRecuentoControlUno={setRecuentoControlUno}
          onCambiarRecuentoControlDos={setRecuentoControlDos}
        />
      ) : null}

      {contadorActivo ? (
        <ContadorCelulas
          key={contadorActivo}
          control={contadorActivo === "controlUno" ? "Control 1" : "Control 2"}
          sesionInicial={sesionesConteo[contadorActivo]}
          onCerrar={cerrarContador}
          onAplicar={aplicarDiferencial}
        />
      ) : null}
    </div>
  );
}
