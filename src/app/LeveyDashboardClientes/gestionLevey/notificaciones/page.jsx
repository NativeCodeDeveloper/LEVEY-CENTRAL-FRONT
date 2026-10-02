"use client";

// Notificaciones: canales de alerta (correo / WhatsApp) y listado de
// encargados que las reciben. Datos ficticios por ahora; los switches son
// estado local hasta conectar el backend.

import { Mail, MessageCircle, Search } from "lucide-react";
import { useState } from "react";

// ------------------------------ Datos ficticios ------------------------------
const ENCARGADOS = [
  {
    id: 1,
    nombre: "María Fernández",
    correo: "maria.fernandez@laboratorio.cl",
    telefono: "+56 9 8123 4567",
    cargo: "Bioquímica · Jefa de Laboratorio",
    jefe: true,
  },
  {
    id: 2,
    nombre: "Rodrigo Salas",
    correo: "rodrigo.salas@laboratorio.cl",
    telefono: "+56 9 7654 3210",
    cargo: "Tecnólogo Médico",
    jefe: false,
  },
  {
    id: 3,
    nombre: "Camila Rojas",
    correo: "camila.rojas@laboratorio.cl",
    telefono: "+56 9 5555 1234",
    cargo: "Tecnólogo Médico",
    jefe: false,
  },
  {
    id: 4,
    nombre: "Diego Herrera",
    correo: "diego.herrera@laboratorio.cl",
    telefono: "+56 9 3444 7788",
    cargo: "Supervisor de Calidad",
    jefe: true,
  },
];

// Iniciales para el avatar: "María Fernández" -> "MF".
function iniciales(nombre) {
  return nombre
    .split(" ")
    .map((palabra) => palabra[0])
    .slice(0, 2)
    .join("");
}

// ------------------------- Switch premium (interruptor) -------------------------
function Interruptor({ activado, alCambiar, etiqueta }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activado}
      aria-label={etiqueta}
      onClick={() => alCambiar(!activado)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        activado ? "border-status-ok/40 bg-status-ok" : "border-line-strong bg-line-strong/60"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block size-5 rounded-full bg-white shadow-[0_1px_3px_rgb(15_23_42_/_0.25)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          activado ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// Tarjeta de un canal de notificación: icono + nombre + estado + switch.
function CanalNotificacion({ id, icono: Icono, nombre, descripcion, activado, alCambiar }) {
  return (
    <div
      className={`flex min-w-[240px] flex-1 items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors duration-300 ${
        activado ? "border-status-ok/30 bg-status-ok-soft/50" : "border-line bg-canvas"
      }`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-colors duration-300 ${
          activado ? "bg-status-ok text-white" : "bg-surface-muted text-ink-muted"
        }`}
      >
        <Icono className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{nombre}</p>
        <p className="mt-0.5 text-[11px] text-ink-muted" aria-live="polite">
          {activado ? "Activado" : "Desactivado"} · {descripcion}
        </p>
      </div>
      <Interruptor activado={activado} alCambiar={alCambiar} etiqueta={`Notificaciones por ${nombre}`} />
    </div>
  );
}

export default function PaginaNotificaciones() {
  // Estado local de los canales: se conecta al backend cuando exista.
  const [notificarCorreo, setNotificarCorreo] = useState(true);
  const [notificarWhatsapp, setNotificarWhatsapp] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const encargadosVisibles = ENCARGADOS.filter((encargado) => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return true;
    return (
      encargado.nombre.toLowerCase().includes(termino) ||
      encargado.correo.toLowerCase().includes(termino) ||
      encargado.cargo.toLowerCase().includes(termino)
    );
  });

  return (
    <div className="min-h-dvh bg-canvas px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">
              <span>Gestión</span>
              <span className="text-line-strong">/</span>
              <span className="text-ink-muted">Notificaciones</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">
              Notificaciones
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Define por qué canal se envían las alertas de control de calidad y quién las recibe.
            </p>
          </div>
        </header>

        {/* ======================= CANALES DE NOTIFICACIÓN ======================= */}
        <section
          aria-label="Canales de notificación"
          className="mt-7 rounded-2xl border border-line bg-surface p-5 shadow-[0_14px_38px_rgb(15_23_42_/_0.07)]"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <h2 className="text-[17px] font-semibold tracking-[-0.025em] text-ink">
                Canales de notificación
              </h2>
              <p className="mt-1 text-sm text-ink-muted">
                Activa o desactiva el envío de alertas por cada canal. Se aplican a todas las
                notificaciones de Análisis QC.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:justify-end">
              <CanalNotificacion
                icono={Mail}
                nombre="Correo"
                descripcion="alertas al correo del encargado"
                activado={notificarCorreo}
                alCambiar={setNotificarCorreo}
              />
              <CanalNotificacion
                icono={MessageCircle}
                nombre="WhatsApp"
                descripcion="mensajes al teléfono del encargado"
                activado={notificarWhatsapp}
                alCambiar={setNotificarWhatsapp}
              />
            </div>
          </div>
        </section>
        {/* ===================== FIN CANALES DE NOTIFICACIÓN ===================== */}

        {/* ============================ ENCARGADOS ============================ */}
        <section
          aria-label="Encargados de recibir notificaciones"
          className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_14px_38px_rgb(15_23_42_/_0.07)]"
        >
          <div className="flex flex-col gap-4 border-b border-line bg-surface px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.025em] text-ink">
                Encargados
              </h2>
              <p className="mt-0.5 text-xs text-ink-muted">
                {encargadosVisibles.length} de {ENCARGADOS.length} encargados
              </p>
            </div>
            <label className="group flex h-12 min-w-0 items-center gap-3 rounded-2xl border border-line bg-canvas py-1.5 pl-2 pr-3 text-ink-muted shadow-[0_2px_8px_rgb(15_23_42_/_0.06)] transition-all duration-200 hover:border-line-strong hover:bg-surface focus-within:border-status-info focus-within:bg-surface focus-within:ring-4 focus-within:ring-status-info/10 sm:w-[380px]">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-ink-muted transition group-focus-within:bg-status-info-soft group-focus-within:text-status-info">
                <Search className="size-4" aria-hidden="true" />
              </span>
              <span className="sr-only">Buscar encargado</span>
              <input
                onChange={(e) => setBusqueda(e.target.value)}
                value={busqueda}
                type="search"
                placeholder="Buscar por nombre, correo o cargo..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
              />
            </label>
          </div>

          <div className="overflow-x-auto bg-surface">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-line bg-canvas text-[10px] font-bold uppercase tracking-[0.13em] text-ink-faint">
                <tr>
                  <th className="px-5 py-4">Nombre encargado</th>
                  <th className="px-5 py-4">Correo</th>
                  <th className="px-5 py-4">Teléfono</th>
                  <th className="px-5 py-4">Cargo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {encargadosVisibles.map((encargado) => (
                  <tr key={encargado.id} className="group transition-colors duration-150 hover:bg-[#f8f7ff]">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3.5">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-status-info-soft text-[12px] font-bold text-status-info shadow-sm transition group-hover:scale-105">
                          {iniciales(encargado.nombre)}
                        </span>
                        <p className="text-[15px] font-semibold tracking-[-0.015em] text-ink">
                          {encargado.nombre}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <p className="whitespace-nowrap text-sm font-medium text-ink-muted">
                        {encargado.correo}
                      </p>
                    </td>
                    <td className="px-5 py-5">
                      <p className="whitespace-nowrap text-sm font-medium tabular-nums text-ink-muted">
                        {encargado.telefono}
                      </p>
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-bold ${
                          encargado.jefe
                            ? "bg-status-info-soft text-status-info"
                            : "bg-surface-muted text-ink-muted"
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {encargado.cargo}
                      </span>
                    </td>
                  </tr>
                ))}
                {encargadosVisibles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-14 text-center">
                      <p className="text-sm font-semibold text-ink">Sin resultados</p>
                      <p className="mt-1 text-xs text-ink-muted">
                        Ajusta la búsqueda para encontrar al encargado.
                      </p>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
        {/* ========================== FIN ENCARGADOS ========================== */}
      </div>
    </div>
  );
}
