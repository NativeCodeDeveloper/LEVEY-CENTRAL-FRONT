"use client";

import { useState } from "react";

// Página Controles — TODO el componente vive en esta única función:
// estilos, datos mock, ícono benceno y popup de ingreso. Sin funciones
// externas ni estilos fuera de aquí, listo para conectar lógica.
export default function PaginaControles() {
  // Estado que abre/cierra el POPUP DE INGRESO DE CONTROL.
  const [estadoInputsIngreso, setEstadoInputsIngreso] = useState(false);

  // Estado que abre/cierra el POPUP DE EDICIÓN DE CONTROL (inputs propios).
  const [estadoInputsEdicion, setEstadoInputsEdicion] = useState(false);
  // Copia gráfica del control en edición.
  const [datosEdicion, setDatosEdicion] = useState(null);

  // Estado que abre/cierra el POPUP DE TÉCNICAS (analitos y niveles por control).
  const [estadoInputsTecnicas, setEstadoInputsTecnicas] = useState(false);
  // Control seleccionado al que se le añaden analitos y niveles.
  const [controlTecnicas, setControlTecnicas] = useState(null);
  // Filas de analitos del popup de técnicas: cada analito con sus niveles (máx. 3).
  const [analitosTecnicas, setAnalitosTecnicas] = useState([]);
  // Fila cuyo selector de analito está desplegado (null = todos cerrados).
  const [indiceListaAbiertaTecnicas, setIndiceListaAbiertaTecnicas] = useState(null);

  // ------------------------- Estilos premium (internos) -------------------------
  const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";

  const TONO_ESTADO = {
    ok: "font-medium text-status-ok",
    alert: "font-bold text-red-600",
  };

  const CLASE_BTN_ACCION = `inline-flex h-9 w-full items-center gap-2 rounded-lg border border-line-strong bg-white px-3 text-[13px] font-medium text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:shadow-[0_6px_16px_rgb(15_23_42_/_0.10)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`;

  const CLASE_CONTROL = `h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm font-medium text-ink shadow-[0_2px_8px_rgb(15_23_42_/_0.06)] outline-none transition-all duration-300 ${EASE_PREMIUM} placeholder:font-normal placeholder:text-ink-faint hover:border-line-strong focus-visible:border-status-info focus-visible:ring-4 focus-visible:ring-status-info/10`;
  const CLASE_ETIQUETA = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted";

  // ------------------- Acciones internas del popup (gráficas) -------------------
  const abrirIngreso = () => setEstadoInputsIngreso(true);
  const cerrarIngreso = () => setEstadoInputsIngreso(false);


  // ---------------- Acciones internas del popup de edición (gráficas) ----------------
  const abrirEdicion = (control) => {
    setDatosEdicion({ ...control });
    setEstadoInputsEdicion(true);
  };
  const cerrarEdicion = () => setEstadoInputsEdicion(false);

  // "dd/mm/aaaa" -> "aaaa-mm-dd" para los inputs date del popup de edición.
  const aIso = (fecha) => {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes}-${dia}`;
  };

  // ------------- Acciones internas del popup de técnicas (gráficas) -------------
  const abrirTecnicas = (control) => {
    setControlTecnicas({ ...control });
    setAnalitosTecnicas(control.analitos.map((a) => ({ ...a, niveles: [...a.niveles] })));
    setEstadoInputsTecnicas(true);
  };
  const cerrarTecnicas = () => setEstadoInputsTecnicas(false);

  const anadirAnalitoTecnicas = () =>
    setAnalitosTecnicas((filas) => [...filas, { nombre: "", niveles: [1] }]);

  const quitarAnalitoTecnicas = (indice) => {
    setIndiceListaAbiertaTecnicas(null);
    setAnalitosTecnicas((filas) => filas.filter((_, i) => i !== indice));
  };

  const renombrarAnalitoTecnicas = (indice, nombre) =>
    setAnalitosTecnicas((filas) => filas.map((fila, i) => (i === indice ? { ...fila, nombre } : fila)));

  const alternarNivelTecnicas = (indice, nivel) =>
    setAnalitosTecnicas((filas) =>
      filas.map((fila, i) =>
        i === indice
          ? {
              ...fila,
              niveles: fila.niveles.includes(nivel)
                ? fila.niveles.filter((n) => n !== nivel)
                : [...fila.niveles, nivel].sort(),
            }
          : fila
      )
    );

  // Similitud de nombre para el buscador de analitos (sin mayúsculas ni tildes).
  const normalizar = (texto) => texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Catálogo mock de analitos para el selector con buscador (nombre + abreviatura).
  const ANALITOS_CATALOGO = [
    { nombre: "Glucosa", abrev: "GLU" },
    { nombre: "Colesterol", abrev: "COL" },
    { nombre: "HDL", abrev: "HDL" },
    { nombre: "LDL", abrev: "LDL" },
    { nombre: "Bilirrubina total", abrev: "BT" },
    { nombre: "Hemoglobina", abrev: "HGB" },
    { nombre: "Urea", abrev: "URE" },
    { nombre: "Creatinina", abrev: "CRE" },
    { nombre: "Ácido úrico", abrev: "AU" },
    { nombre: "Triglicéridos", abrev: "TRI" },
    { nombre: "GOT", abrev: "GOT" },
    { nombre: "GPT", abrev: "GPT" },
    { nombre: "Proteínas totales", abrev: "PT" },
    { nombre: "Albúmina", abrev: "ALB" },
  ];

  // Opciones del selector de analito de una fila: filtra por similitud (nombre
  // o abreviatura) y excluye los ya asignados en otras filas.
  const opcionesAnalitoTecnicas = (indice) => {
    const termino = normalizar((analitosTecnicas[indice]?.nombre ?? "").trim());
    const usados = analitosTecnicas
      .filter((_, i) => i !== indice)
      .map((fila) => normalizar(fila.nombre.trim()))
      .filter(Boolean);
    return ANALITOS_CATALOGO.filter((opcion) => {
      const nombre = normalizar(opcion.nombre);
      const abrev = normalizar(opcion.abrev);
      return !usados.includes(nombre) && (!termino || nombre.includes(termino) || abrev.includes(termino));
    });
  };


  // ------------------------------ Datos de ejemplo ------------------------------
  const CONTROLES = [
    {
      nombre: "BioRad Glucosa",
      proveedor: "BioRad",
      lote: "GLO090",
      creacion: "15/03/2026",
      matriz: "Suero",
      categoria: "Química clínica",
      stock: 15,
      ultimaModificacion: "y6",
      caducidad: "10/11/2026",
      estado: { texto: "En Uso", tono: "ok" },
      analitos: [
        { nombre: "Glucosa", niveles: [1, 2, 3] },
      ],
    },
    {
      nombre: "BioRad Colesterol",
      proveedor: "BioRad",
      lote: "CO0044",
      creacion: "02/04/2026",
      matriz: "Suero",
      categoria: "Química clínica",
      stock: 8,
      ultimaModificacion: "y6",
      caducidad: "05/12/2026",
      estado: { texto: "En Uso", tono: "ok" },
      analitos: [
        { nombre: "Colesterol", niveles: [1, 2, 3] },
        { nombre: "HDL", niveles: [1, 2] },
        { nombre: "LDL", niveles: [1] },
      ],
    },
    {
      nombre: "RADOX Hemoglobina",
      proveedor: "RADOX",
      lote: "HEM012",
      creacion: "20/05/2026",
      matriz: "Sangre total",
      categoria: "Hematología",
      stock: 6,
      ultimaModificacion: "y6",
      caducidad: "15/01/2027",
      estado: { texto: "En Uso", tono: "ok" },
      analitos: [
        { nombre: "Hemoglobina", niveles: [1] },
      ],
    },
    {
      nombre: "Human1 Multicalibrador",
      proveedor: "Human1",
      lote: "H1M330",
      creacion: "10/01/2026",
      matriz: "Suero",
      categoria: "Química clínica",
      stock: 20,
      ultimaModificacion: "y6",
      caducidad: "28/08/2026",
      estado: { texto: "Desactivado", tono: "alert" },
      analitos: [
        { nombre: "Glucosa", niveles: [1, 2] },
        { nombre: "Colesterol", niveles: [1, 2, 3] },
        { nombre: "Hemoglobina", niveles: [1] },
        { nombre: "Urea", niveles: [1, 2] },
      ],
    },
  ];

  return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
            ANÁLISIS QC / CONTROLES
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
            Controles
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Catálogo de controles con su lote, caducidad, analitos asociados y niveles disponibles.
          </p>
        </header>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          {/* BOTÓN QUE ABRE EL POPUP DE INGRESO (ver bloque POPUP al final del archivo) */}
          <button
            type="button"
            onClick={abrirIngreso}
            className={`group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            {/* Mismo trazo que el icono "controlesQc" del sidebar: anillo bencenico de Kekule */}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`size-6 transition-transform duration-700 ${EASE_PREMIUM} group-hover:rotate-[360deg]`} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3.5l6.9 4v8l-6.9 4-6.9-4v-8z" />
              <path d="M12.5 5.9l4.1 2.4M16.6 14.7l-4.1 2.4M6.9 9.1v4.8" />
            </svg>
            Ingresar Control
          </button>
        </div>
      </div>

      <section
        aria-label="Controles de calidad"
        className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]"
      >
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[29%]" />
            <col className="w-[19%]" />
            <col className="w-[31%]" />
            <col className="w-[21%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-[#f8f9fb]">
              <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Control</th>
              <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Condición control</th>
              <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Analitos y niveles</th>
              <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {CONTROLES.map((c) => (
              <tr
                key={`${c.nombre}-${c.lote}`}
                className={`border-b border-line transition-colors duration-200 ${EASE_PREMIUM} last:border-b-0 hover:bg-[#f8f9fb]`}
              >
                <td className="px-5 py-4 align-top">
                  <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{c.nombre}</p>
                  <p className="mt-2 whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Proveedor: <span className="font-medium text-ink-muted">{c.proveedor}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Lote: <span className="font-medium tabular-nums text-ink-muted">{c.lote}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Matriz: <span className="font-medium text-ink-muted">{c.matriz}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Categoría: <span className="font-medium text-ink-muted">{c.categoria}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Stock: <span className="font-medium tabular-nums text-ink-muted">{c.stock}</span>
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Creación: <span className="tabular-nums">{c.creacion}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Caducidad: <span className="tabular-nums">{c.caducidad}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Estado: <span className={TONO_ESTADO[c.estado.tono]}>{c.estado.texto}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Últ. Modificación: <span className="font-medium text-ink-muted">{c.ultimaModificacion}</span>
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  {/* Cada analito con SUS propios niveles, en línea junto al nombre */}
                  <ul className="flex w-[200px] flex-col gap-1.5">
                    {c.analitos.map((a) => (
                      <li
                        key={a.nombre}
                        className="flex w-full items-center gap-2 rounded-lg border border-line-strong bg-white px-2.5 py-1.5 text-[12px] font-medium text-ink shadow-[0_1px_3px_rgb(15_23_42_/_0.08)]"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-status-info" aria-hidden="true" />
                        <span className="min-w-0 truncate">{a.nombre}</span>
                        <span className="ml-auto shrink-0 text-[10px] font-bold tabular-nums text-status-info">
                          {a.niveles.length} {a.niveles.length === 1 ? "Nivel" : "Niveles"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="flex w-full flex-col items-stretch gap-1.5">
                    {/* BOTÓN QUE ABRE EL POPUP DE EDICIÓN (ver bloque POPUP DE EDICIÓN al final del archivo) */}
                    <button
                      type="button"
                      aria-label={`Editar ${c.nombre}`}
                      onClick={() => abrirEdicion(c)}
                      className={`${CLASE_BTN_ACCION} hover:border-status-info hover:text-status-info`}
                    >
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4 shrink-0" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11.5 4.5l4 4L7.3 16.7H3.3v-4l8.2-8.2z" />
                        <path d="M9.9 6.1l4 4" />
                      </svg>
                      Editar
                    </button>
                    {/* BOTÓN QUE ABRE EL POPUP DE TÉCNICAS (ver bloque POPUP DE TÉCNICAS al final del archivo) */}
                    <button
                      type="button"
                      aria-label={`Añadir técnicas a ${c.nombre}`}
                      onClick={() => abrirTecnicas(c)}
                      className={`${CLASE_BTN_ACCION} hover:border-status-info hover:text-status-info`}
                    >
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4 shrink-0" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
                        <path d="M10 4v12M4 10h12" />
                      </svg>
                      Añadir Técnicas
                    </button>
                    <button
                      type="button"
                      aria-label={`Desactivar ${c.nombre}`}
                      className={`${CLASE_BTN_ACCION} hover:border-status-alert hover:text-status-alert`}
                    >
                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4 shrink-0" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 3v6" />
                        <path d="M6.3 5.3a5.5 5.5 0 1 0 7.4 0" />
                      </svg>
                      Desactivar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ==================================================================
          INICIO POPUP DE INGRESO DE CONTROL — EXCLUSIVO DE INGRESO
          Componente 100% gráfico: NO está conectado al backend.
          Cuando conectes la lógica:
            - Abrir/cerrar: estado `estadoInputsIngreso` (useState arriba).
            - Datos del control: inputs con id "campo-ingreso-*".
          ================================================================== */}
      {estadoInputsIngreso ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-ingresar-control"
        >
          {/* Fondo clickeable para cerrar */}
          <button
            type="button"
            aria-label="Cerrar popup"
            onClick={cerrarIngreso}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative max-h-[calc(100dvh-4rem)] w-[min(620px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-2xl">
            {/* Encabezado del popup */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  Nuevo registro
                </p>
                <h2 id="titulo-ingresar-control" className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink">
                  Ingresar Control
                </h2>
              </div>
              <button
                type="button"
                onClick={cerrarIngreso}
                aria-label="Cerrar"
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-alert hover:text-status-alert active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Datos del control (los mismos que muestra la tabla) */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="campo-ingreso-nombre" className={CLASE_ETIQUETA}>
                  Nombre del control
                </label>
                <input
                  id="campo-ingreso-nombre"
                  type="text"
                  placeholder="Ej. BioRad Glucosa"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-ingreso-proveedor" className={CLASE_ETIQUETA}>
                  Proveedor
                </label>
                <select id="campo-ingreso-proveedor" defaultValue="" className={CLASE_CONTROL}>
                  <option value="" disabled>
                    Selecciona proveedor
                  </option>
                  <option value="biorad">BioRad</option>
                  <option value="radox">RADOX</option>
                  <option value="human1">Human1</option>
                  <option value="roche">Roche</option>
                  <option value="abbott">Abbott</option>
                  <option value="siemens">Siemens</option>
                </select>
              </div>
              <div>
                <label htmlFor="campo-ingreso-lote" className={CLASE_ETIQUETA}>
                  Lote
                </label>
                <input
                  id="campo-ingreso-lote"
                  type="text"
                  placeholder="Ej. GLO090"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-ingreso-matriz" className={CLASE_ETIQUETA}>
                  Matriz
                </label>
                <select id="campo-ingreso-matriz" defaultValue="" className={CLASE_CONTROL}>
                  <option value="" disabled>
                    Selecciona matriz
                  </option>
                  <option value="Suero">Suero</option>
                  <option value="Orina">Orina</option>
                  <option value="Sangre total">Sangre total</option>
                  <option value="Plasma">Plasma</option>
                  <option value="LCR">LCR</option>
                </select>
              </div>
              <div>
                <label htmlFor="campo-ingreso-categoria" className={CLASE_ETIQUETA}>
                  Categoría
                </label>
                <select id="campo-ingreso-categoria" defaultValue="" className={CLASE_CONTROL}>
                  <option value="" disabled>
                    Selecciona categoría
                  </option>
                  <option value="Química clínica">Química clínica</option>
                  <option value="Hematología">Hematología</option>
                  <option value="Inmunología">Inmunología</option>
                  <option value="Microbiología">Microbiología</option>
                  <option value="Coagulación">Coagulación</option>
                </select>
              </div>
              <div>
                <label htmlFor="campo-ingreso-stock" className={CLASE_ETIQUETA}>
                  Stock
                </label>
                <input
                  id="campo-ingreso-stock"
                  type="number"
                  min="0"
                  placeholder="Ej. 10"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-ingreso-caducidad" className={CLASE_ETIQUETA}>
                  Caducidad
                </label>
                <input
                  id="campo-ingreso-caducidad"
                  type="date"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-ingreso-estado" className={CLASE_ETIQUETA}>
                  Estado del control
                </label>
                <select id="campo-ingreso-estado" defaultValue="en-uso" className={CLASE_CONTROL}>
                  <option value="en-uso">En Uso</option>
                  <option value="desactivado">Desactivado</option>
                </select>
              </div>
            </div>


            {/* Pie del popup */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarIngreso}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-line-strong bg-white px-5 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(15_23_42_/_0.06)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-surface-muted hover:shadow-[0_10px_24px_rgb(15_23_42_/_0.10)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                Cancelar
              </button>
              {/* Gráfico solamente: aquí conectarás el guardado */}
              <button
                type="button"
                onClick={cerrarIngreso}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                Guardar Control
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* ================== FIN POPUP DE INGRESO DE CONTROL ================== */}

      {/* ==================================================================
          INICIO POPUP DE EDICIÓN DE CONTROL — EXCLUSIVO DE EDICIÓN
          Componente 100% gráfico: NO está conectado al backend.
          Se abre desde el botón "Editar" de una fila, precargado con
          los datos de ese control. Cuando conectes la lógica:
            - Abrir/cerrar: estado `estadoInputsEdicion` (useState arriba).
            - Datos del control: inputs con id "campo-edicion-*".
          ================================================================== */}
      {estadoInputsEdicion && datosEdicion ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-editar-control"
        >
          {/* Fondo clickeable para cerrar */}
          <button
            type="button"
            aria-label="Cerrar popup"
            onClick={cerrarEdicion}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative max-h-[calc(100dvh-4rem)] w-[min(620px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-2xl">
            {/* Encabezado del popup de edición */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  Editando: {datosEdicion.nombre}
                </p>
                <h2 id="titulo-editar-control" className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink">
                  Editar Control
                </h2>
              </div>
              <button
                type="button"
                onClick={cerrarEdicion}
                aria-label="Cerrar"
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-alert hover:text-status-alert active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Datos del control en edición (inputs propios del popup) */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="campo-edicion-nombre" className={CLASE_ETIQUETA}>
                  Nombre del control
                </label>
                <input
                  id="campo-edicion-nombre"
                  type="text"
                  defaultValue={datosEdicion.nombre}
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-edicion-proveedor" className={CLASE_ETIQUETA}>
                  Proveedor
                </label>
                <select
                  id="campo-edicion-proveedor"
                  defaultValue={datosEdicion.proveedor.toLowerCase()}
                  className={CLASE_CONTROL}
                >
                  <option value="biorad">BioRad</option>
                  <option value="radox">RADOX</option>
                  <option value="human1">Human1</option>
                  <option value="roche">Roche</option>
                  <option value="abbott">Abbott</option>
                  <option value="siemens">Siemens</option>
                </select>
              </div>
              <div>
                <label htmlFor="campo-edicion-lote" className={CLASE_ETIQUETA}>
                  Lote
                </label>
                <input
                  id="campo-edicion-lote"
                  type="text"
                  defaultValue={datosEdicion.lote}
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-edicion-matriz" className={CLASE_ETIQUETA}>
                  Matriz
                </label>
                <select
                  id="campo-edicion-matriz"
                  defaultValue={datosEdicion.matriz}
                  className={CLASE_CONTROL}
                >
                  <option value="Suero">Suero</option>
                  <option value="Orina">Orina</option>
                  <option value="Sangre total">Sangre total</option>
                  <option value="Plasma">Plasma</option>
                  <option value="LCR">LCR</option>
                </select>
              </div>
              <div>
                <label htmlFor="campo-edicion-categoria" className={CLASE_ETIQUETA}>
                  Categoría
                </label>
                <select
                  id="campo-edicion-categoria"
                  defaultValue={datosEdicion.categoria}
                  className={CLASE_CONTROL}
                >
                  <option value="Química clínica">Química clínica</option>
                  <option value="Hematología">Hematología</option>
                  <option value="Inmunología">Inmunología</option>
                  <option value="Microbiología">Microbiología</option>
                  <option value="Coagulación">Coagulación</option>
                </select>
              </div>
              <div>
                <label htmlFor="campo-edicion-stock" className={CLASE_ETIQUETA}>
                  Stock
                </label>
                <input
                  id="campo-edicion-stock"
                  type="number"
                  min="0"
                  defaultValue={datosEdicion.stock}
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-edicion-creacion" className={CLASE_ETIQUETA}>
                  Creación
                </label>
                <input
                  id="campo-edicion-creacion"
                  type="date"
                  defaultValue={aIso(datosEdicion.creacion)}
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-edicion-caducidad" className={CLASE_ETIQUETA}>
                  Caducidad
                </label>
                <input
                  id="campo-edicion-caducidad"
                  type="date"
                  defaultValue={aIso(datosEdicion.caducidad)}
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-edicion-estado" className={CLASE_ETIQUETA}>
                  Estado del control
                </label>
                <select
                  id="campo-edicion-estado"
                  defaultValue={datosEdicion.estado.texto.toLowerCase().replace(" ", "-")}
                  className={CLASE_CONTROL}
                >
                  <option value="en-uso">En Uso</option>
                  <option value="desactivado">Desactivado</option>
                </select>
              </div>
            </div>


            {/* Pie del popup de edición */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarEdicion}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-line-strong bg-white px-5 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(15_23_42_/_0.06)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-surface-muted hover:shadow-[0_10px_24px_rgb(15_23_42_/_0.10)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                Cancelar
              </button>
              {/* Gráfico solamente: aquí conectarás la actualización */}
              <button
                type="button"
                onClick={cerrarEdicion}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* ================== FIN POPUP DE EDICIÓN DE CONTROL ================== */}

      {/* ==================================================================
          INICIO POPUP DE TÉCNICAS — EXCLUSIVO DE ANALITOS Y NIVELES
          Componente 100% gráfico: NO está conectado al backend.
          Se abre desde el botón "Añadir Técnicas" de una fila y siempre
          indica a qué control se le están añadiendo los analitos.
          Cuando conectes la lógica:
            - Abrir/cerrar: estado `estadoInputsTecnicas` (useState arriba).
            - Control destino: estado `controlTecnicas`.
            - Analitos y niveles por analito: estado `analitosTecnicas`.
          ================================================================== */}
      {estadoInputsTecnicas && controlTecnicas ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-anadir-tecnicas"
        >
          {/* Fondo clickeable para cerrar */}
          <button
            type="button"
            aria-label="Cerrar popup"
            onClick={cerrarTecnicas}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative max-h-[calc(100dvh-4rem)] w-[min(620px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-2xl">
            {/* Encabezado: indica a qué control se le añaden analitos y niveles */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  Añadiendo analitos y niveles
                </p>
                <h2 id="titulo-anadir-tecnicas" className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink">
                  Añadir Técnicas
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Control: <span className="font-semibold text-ink">{controlTecnicas.nombre}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={cerrarTecnicas}
                aria-label="Cerrar"
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-alert hover:text-status-alert active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Analitos asociados: cada analito recibe SUS propios niveles (hasta 3) */}
            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  Analitos asociados
                </p>
                <button
                  type="button"
                  onClick={anadirAnalitoTecnicas}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 text-[12px] font-medium text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-info hover:text-status-info active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                >
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                  Añadir analito
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-3">
                {analitosTecnicas.map((fila, indice) => (
                  <div key={indice} className="rounded-xl border border-line bg-canvas/60 p-3.5">
                    <div className="flex items-center gap-2">
                      {/* Selector de analito con buscador (combobox gráfico) */}
                      <div
                        className="relative flex-1"
                        onBlur={(evento) => {
                          if (!evento.currentTarget.contains(evento.relatedTarget)) setIndiceListaAbiertaTecnicas(null);
                        }}
                        onKeyDown={(evento) => {
                          if (evento.key === "Escape") setIndiceListaAbiertaTecnicas(null);
                        }}
                      >
                        <input
                          value={fila.nombre}
                          onChange={(evento) => {
                            renombrarAnalitoTecnicas(indice, evento.target.value);
                            setIndiceListaAbiertaTecnicas(indice);
                          }}
                          onFocus={() => setIndiceListaAbiertaTecnicas(indice)}
                          type="text"
                          placeholder="Buscar analito…"
                          aria-label={`Buscar analito ${indice + 1}`}
                          role="combobox"
                          aria-expanded={indiceListaAbiertaTecnicas === indice}
                          aria-controls={`lista-analito-tecnicas-${indice}`}
                          className={`${CLASE_CONTROL} pr-9`}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label="Desplegar opciones"
                          onClick={() => setIndiceListaAbiertaTecnicas(indiceListaAbiertaTecnicas === indice ? null : indice)}
                          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-faint transition-colors duration-150 hover:text-ink-muted"
                        >
                          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 7.5l5 5 5-5" />
                          </svg>
                        </button>

                        {indiceListaAbiertaTecnicas === indice ? (
                          <ul
                            id={`lista-analito-tecnicas-${indice}`}
                            role="listbox"
                            aria-label={`Opciones de analito ${indice + 1}`}
                            className="absolute inset-x-0 top-[calc(100%+4px)] z-10 max-h-48 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-[0_16px_40px_rgb(15_23_42_/_0.16)]"
                          >
                            {opcionesAnalitoTecnicas(indice).length === 0 ? (
                              <li className="px-3 py-2.5 text-[12px] text-ink-faint">
                                Sin resultados para tu búsqueda
                              </li>
                            ) : (
                              opcionesAnalitoTecnicas(indice).map((opcion) => (
                                <li key={opcion.nombre} role="option" aria-selected={fila.nombre === opcion.nombre}>
                                  <button
                                    type="button"
                                    onMouseDown={(evento) => evento.preventDefault()}
                                    onClick={() => {
                                      renombrarAnalitoTecnicas(indice, opcion.nombre);
                                      setIndiceListaAbiertaTecnicas(null);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-150 ${
                                      fila.nombre === opcion.nombre
                                        ? "bg-status-info-soft font-medium text-status-info"
                                        : "text-ink hover:bg-canvas"
                                    }`}
                                  >
                                    <span className="min-w-0 truncate">
                                      {opcion.nombre} <span className="font-bold text-status-info">- {opcion.abrev}</span>
                                    </span>
                                    {fila.nombre === opcion.nombre ? (
                                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 10.5l4 4 8-9" />
                                      </svg>
                                    ) : null}
                                  </button>
                                </li>
                              ))
                            )}
                          </ul>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => quitarAnalitoTecnicas(indice)}
                        aria-label={`Quitar ${fila.nombre || "analito"}`}
                        title="Quitar analito"
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-alert hover:text-status-alert active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                      >
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                          <path d="M5 5l10 10M15 5L5 15" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      <span className="mr-1 text-[11px] font-medium text-ink-faint">Niveles:</span>
                      {[1, 2, 3].map((nivel) => {
                        const activo = fila.niveles.includes(nivel);
                        return (
                          <button
                            key={nivel}
                            type="button"
                            onClick={() => alternarNivelTecnicas(indice, nivel)}
                            aria-pressed={activo}
                            className={`h-7 rounded-full border px-2.5 text-[10px] font-semibold uppercase tracking-[0.04em] transition-all duration-200 ${EASE_PREMIUM} ${
                              activo
                                ? "border-status-info/40 bg-status-info-soft text-status-info"
                                : "border-line bg-white text-ink-faint hover:border-line-strong hover:text-ink-muted"
                            } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                          >
                            Nivel {nivel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie del popup de técnicas */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarTecnicas}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-line-strong bg-white px-5 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(15_23_42_/_0.06)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-surface-muted hover:shadow-[0_10px_24px_rgb(15_23_42_/_0.10)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                Cancelar
              </button>
              {/* Gráfico solamente: aquí conectarás el guardado de técnicas */}
              <button
                type="button"
                onClick={cerrarTecnicas}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* ================== FIN POPUP DE TÉCNICAS ================== */}
    </div>
  );
}
