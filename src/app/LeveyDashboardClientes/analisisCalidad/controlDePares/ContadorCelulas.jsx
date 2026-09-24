"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const CELULAS = [
  { id: "segmentados", nombre: "Neutrófilos segmentados", nombreCorto: "Segmentados", grupo: "maduras", tecla: "1", incluyeDiferencial: true, acento: "#31708c", suave: "#e8f1f5" },
  { id: "linfocitos", nombre: "Linfocitos", nombreCorto: "Linfocitos", grupo: "maduras", tecla: "2", incluyeDiferencial: true, acento: "#604ca7", suave: "#efeafb" },
  { id: "monocitos", nombre: "Monocitos", nombreCorto: "Monocitos", grupo: "maduras", tecla: "3", incluyeDiferencial: true, acento: "#5c6873", suave: "#edf0f3" },
  { id: "eosinofilos", nombre: "Eosinófilos", nombreCorto: "Eosinófilos", grupo: "maduras", tecla: "4", incluyeDiferencial: true, acento: "#b05f24", suave: "#fff0e6" },
  { id: "basofilos", nombre: "Basófilos", nombreCorto: "Basófilos", grupo: "maduras", tecla: "5", incluyeDiferencial: true, acento: "#65547f", suave: "#eeeaf7" },
  { id: "baciliformes", nombre: "Neutrófilos baciliformes", nombreCorto: "Baciliformes", grupo: "inmaduras", tecla: "6", incluyeDiferencial: true, acento: "#3a7258", suave: "#eaf3ee" },
  { id: "metamielocitos", nombre: "Metamielocitos", nombreCorto: "Metamielocitos", grupo: "inmaduras", tecla: "7", incluyeDiferencial: true, acento: "#567a42", suave: "#edf5e9" },
  { id: "mielocitos", nombre: "Mielocitos", nombreCorto: "Mielocitos", grupo: "inmaduras", tecla: "8", incluyeDiferencial: true, acento: "#73783d", suave: "#f3f4e8" },
  { id: "promielocitos", nombre: "Promielocitos", nombreCorto: "Promielocitos", grupo: "inmaduras", tecla: "9", incluyeDiferencial: true, acento: "#96603a", suave: "#f9eee6" },
  { id: "blastos", nombre: "Blastos", nombreCorto: "Blastos", grupo: "inmaduras", tecla: "0", incluyeDiferencial: true, acento: "#ae4036", suave: "#fce9e7" },
  { id: "eritroblastos", nombre: "Eritroblastos", nombreCorto: "Eritroblastos", grupo: "otras", tecla: null, incluyeDiferencial: false, acento: "#9c4d61", suave: "#faecef" },
  { id: "linfocitosReactivos", nombre: "Linfocitos reactivos", nombreCorto: "Linfocitos reactivos", grupo: "otras", tecla: null, incluyeDiferencial: true, acento: "#5568a4", suave: "#edf0fa" },
  { id: "otras", nombre: "Otras células", nombreCorto: "Otras células", grupo: "otras", tecla: null, incluyeDiferencial: true, acento: "#62626c", suave: "#f1f1f3" },
];

const ATAJOS = {
  Digit1: "segmentados",
  Numpad1: "segmentados",
  Digit2: "linfocitos",
  Numpad2: "linfocitos",
  Digit3: "monocitos",
  Numpad3: "monocitos",
  Digit4: "eosinofilos",
  Numpad4: "eosinofilos",
  Digit5: "basofilos",
  Numpad5: "basofilos",
  Digit6: "baciliformes",
  Numpad6: "baciliformes",
  Digit7: "metamielocitos",
  Numpad7: "metamielocitos",
  Digit8: "mielocitos",
  Numpad8: "mielocitos",
  Digit9: "promielocitos",
  Numpad9: "promielocitos",
  Digit0: "blastos",
  Numpad0: "blastos",
};

const CELULAS_POR_ID = new Map(CELULAS.map((celula) => [celula.id, celula]));
const SEGMENTOS_PROGRESO = Array.from({ length: 20 }, (_, indice) => indice);

const ILUSTRACIONES_CELULAS = {
  segmentados: {
    citoplasma: "#ece5f6",
    borde: "#d9cdec",
    nucleo: (
      <g fill="#4a3d8c">
        <circle cx="17" cy="19" r="6" />
        <circle cx="25" cy="18" r="5.4" />
        <circle cx="27" cy="25.5" r="5.2" />
        <circle cx="19" cy="27" r="5" />
        <circle cx="22.5" cy="22.5" r="5.6" />
      </g>
    ),
    granulos: { color: "#b9a6dd", radio: 1.4, puntos: [[13, 14], [30, 13], [34, 23], [29, 31], [12, 25], [22, 34], [34, 17]] },
  },
  linfocitos: {
    citoplasma: "#e0e6f8",
    borde: "#c8d2ee",
    nucleo: <circle cx="21" cy="22" r="10" fill="#443a85" />,
  },
  monocitos: {
    citoplasma: "#e4e9f2",
    borde: "#ccd5e2",
    nucleo: (
      <g>
        <circle cx="24" cy="22" r="9" fill="#574a9e" />
        <circle cx="16.5" cy="22" r="4.6" fill="#e4e9f2" />
      </g>
    ),
  },
  eosinofilos: {
    citoplasma: "#fbe7e2",
    borde: "#f2cec5",
    nucleo: (
      <g fill="#493d82">
        <circle cx="18.5" cy="20" r="6.4" />
        <circle cx="26.5" cy="24" r="5.8" />
      </g>
    ),
    granulos: { color: "#d9663d", radio: 2, puntos: [[14, 15], [28, 13], [33, 22], [27, 30], [16, 30], [11, 23], [22, 10], [33, 28], [12, 17]] },
  },
  basofilos: {
    citoplasma: "#e9e4f6",
    borde: "#d3cbee",
    nucleo: <circle cx="21" cy="22" r="7.5" fill="#3f3378" />,
    granulos: { color: "#2e2a5c", radio: 2.6, puntos: [[17, 17], [26, 15], [31, 22], [24, 27], [16, 26], [28, 30], [13, 21], [21, 33]] },
  },
  baciliformes: {
    citoplasma: "#e9edf6",
    borde: "#cfdae8",
    nucleo: <path d="M16.5 27.5 C13.5 20 19 14 25.5 15.5 C31 17 31.5 24 27 26.8" fill="none" stroke="#5a4da3" strokeWidth="5.4" strokeLinecap="round" />,
  },
  metamielocitos: {
    citoplasma: "#ede9f5",
    borde: "#d9d2ec",
    nucleo: (
      <g>
        <circle cx="24.5" cy="22" r="8" fill="#6053a9" />
        <circle cx="17.5" cy="22" r="4" fill="#ede9f5" />
      </g>
    ),
    granulos: { color: "#c2b2e2", radio: 1.5, puntos: [[14, 15], [29, 13], [33, 23], [27, 31], [13, 26], [21, 34]] },
  },
  mielocitos: {
    citoplasma: "#f1ecf6",
    borde: "#ded5ec",
    nucleo: <circle cx="21.5" cy="21.5" r="8.2" fill="#6a5cb0" />,
    granulos: { color: "#c8b9e6", radio: 1.6, puntos: [[13, 16], [29, 13], [33, 24], [26, 31], [14, 28], [21, 10], [34, 17]] },
  },
  promielocitos: {
    citoplasma: "#f2eaf6",
    borde: "#e0d2ec",
    nucleo: <circle cx="20.5" cy="21" r="9.4" fill="#7263b8" />,
    granulos: { color: "#a98fd6", radio: 2, puntos: [[30, 14], [33, 24], [28, 31], [13, 28], [12, 17], [24, 34], [34, 19]] },
  },
  blastos: {
    citoplasma: "#ece4f4",
    borde: "#d8caea",
    nucleo: (
      <g>
        <circle cx="21" cy="21.5" r="10.5" fill="#4a3c8e" />
        <circle cx="18.5" cy="19" r="1.5" fill="#8d7fc6" />
        <circle cx="24" cy="24.5" r="1.3" fill="#8d7fc6" />
      </g>
    ),
  },
  eritroblastos: {
    citoplasma: "#f6e2e2",
    borde: "#eac8c9",
    nucleo: <circle cx="22" cy="22" r="7.2" fill="#342a60" />,
  },
  linfocitosReactivos: {
    citoplasma: "#e2e9f8",
    borde: "#c9d4ef",
    nucleo: <circle cx="20" cy="21" r="8.6" fill="#443a85" />,
    granulos: { color: "#b3aade", radio: 1.6, puntos: [[29, 15], [32, 24], [27, 30], [13, 27]] },
  },
  otras: {
    citoplasma: "#ededf0",
    borde: "#d8d8de",
    nucleo: <circle cx="22" cy="22" r="7.8" fill="#6c6c8e" />,
  },
};

function crearConteosVacios() {
  return Object.fromEntries(CELULAS.map((celula) => [celula.id, 0]));
}

function crearEstadoInicial(sesionInicial) {
  return {
    conteos: sesionInicial?.conteos ?? crearConteosVacios(),
    historial: sesionInicial?.historial ?? [],
  };
}

function totalDiferencialDesde(conteos) {
  return CELULAS.reduce(
    (acumulado, celula) => acumulado + (celula.incluyeDiferencial ? conteos[celula.id] : 0),
    0,
  );
}

function formatearPorcentaje(valor) {
  if (Number.isInteger(valor)) return `${valor}%`;
  return `${valor.toFixed(1).replace(".", ",")}%`;
}

function IlustracionCelula({ id, className }) {
  const ilustracion = ILUSTRACIONES_CELULAS[id];

  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className={className}>
      <circle cx="22" cy="22" r="19" fill={ilustracion.citoplasma} stroke={ilustracion.borde} strokeWidth="1.5" />
      {ilustracion.nucleo}
      {ilustracion.granulos ? (
        <g fill={ilustracion.granulos.color}>
          {ilustracion.granulos.puntos.map(([x, y], indice) => (
            <circle key={indice} cx={x} cy={y} r={ilustracion.granulos.radio} />
          ))}
        </g>
      ) : null}
    </svg>
  );
}

function IconoTeclado({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6 13h.01M9.5 13h.01M13 13h.01M16.5 13h.01M8 15.8h8" strokeLinecap="round" />
    </svg>
  );
}

function BotonCelula({ celula, cantidad, porcentaje, bloqueado, onIncrementar, onDisminuir }) {
  const activa = cantidad > 0;

  return (
    <article
      className={`relative overflow-hidden rounded-xl border bg-white shadow-[0_4px_14px_rgb(15_23_42_/_0.05)] transition duration-200 hover:shadow-[0_8px_22px_rgb(15_23_42_/_0.08)] ${activa ? "" : "border-line"}`}
      style={activa ? { borderColor: celula.acento } : undefined}
    >
      <span className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: celula.acento }} aria-hidden="true" />

      <button
        type="button"
        onClick={() => onIncrementar(celula.id)}
        disabled={bloqueado}
        aria-label={`Añadir ${celula.nombre}`}
        aria-keyshortcuts={celula.tecla ?? undefined}
        className="flex w-full items-center gap-1.5 py-0.5 pl-2.5 pr-1.5 text-left outline-none transition focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-status-info/20 disabled:cursor-not-allowed disabled:opacity-55"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: celula.suave }}>
          <IlustracionCelula id={celula.id} className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-1">
            <span className="truncate text-[9px] font-semibold leading-2.5 text-ink">{celula.nombreCorto}</span>
            {celula.tecla ? (
              <kbd className="rounded border border-line bg-[#f4f5f6] px-0.5 text-[8px] font-bold leading-2.5 text-ink-faint">{celula.tecla}</kbd>
            ) : null}
          </span>
          <span className="flex items-end justify-between gap-1">
            <strong className="font-mono text-sm font-semibold leading-4 tabular-nums text-ink">{cantidad}</strong>
            <span className="text-[8px] font-semibold tabular-nums text-ink-faint">{porcentaje}</span>
          </span>
        </span>
      </button>

      <div className="grid grid-cols-2 border-t border-line bg-[#fafbfc]">
        <button
          type="button"
          onClick={() => onDisminuir(celula.id)}
          disabled={cantidad === 0}
          aria-label={`Restar ${celula.nombre}`}
          className="flex h-4 items-center justify-center text-xs font-medium text-ink-muted transition hover:bg-white hover:text-ink focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-status-info disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onIncrementar(celula.id)}
          disabled={bloqueado}
          aria-label={`Sumar ${celula.nombre}`}
          className="flex h-4 items-center justify-center border-l border-line text-xs font-semibold text-ink transition hover:bg-[#24406b] hover:text-white focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-status-info disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>
    </article>
  );
}

function ConfirmacionReinicio({ onCancelar, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#11141c]/65 p-4 backdrop-blur-sm">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmar-reinicio"
        className="w-full max-w-md rounded-[22px] border border-white/60 bg-white p-6 shadow-[0_30px_90px_rgb(15_23_42_/_0.35)]"
      >
        <span className="flex size-11 items-center justify-center rounded-2xl bg-status-alert-soft text-xl font-semibold text-status-alert" aria-hidden="true">!</span>
        <h3 id="titulo-confirmar-reinicio" className="mt-5 text-xl font-semibold tracking-[-0.025em] text-ink">¿Reiniciar el recuento?</h3>
        <p className="mt-2 text-sm leading-6 text-ink-muted">Se eliminarán todos los conteos y el historial de esta lectura. Esta acción no se puede deshacer.</p>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onCancelar} className="h-11 rounded-xl border border-line-strong bg-white px-4 text-sm font-medium text-ink transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            Conservar recuento
          </button>
          <button type="button" onClick={onConfirmar} className="h-11 rounded-xl bg-status-alert px-4 text-sm font-medium text-white shadow-sm transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-alert">
            Sí, reiniciar
          </button>
        </div>
      </section>
    </div>
  );
}

export default function ContadorCelulas({ control, sesionInicial, onCerrar, onAplicar }) {
  const [estado, setEstado] = useState(() => crearEstadoInicial(sesionInicial));
  const [metaSeleccionada, setMetaSeleccionada] = useState(sesionInicial?.metaSeleccionada ?? "100");
  const [metaPersonalizada, setMetaPersonalizada] = useState(sesionInicial?.metaPersonalizada ?? "100");
  const [confirmarReinicio, setConfirmarReinicio] = useState(false);

  const objetivo = metaSeleccionada === "personalizada"
    ? Math.max(1, Math.floor(Number(metaPersonalizada) || 1))
    : Number(metaSeleccionada);

  const totalDiferencial = useMemo(() => totalDiferencialDesde(estado.conteos), [estado.conteos]);
  const recuentoCompleto = totalDiferencial >= objetivo;
  const segmentosCompletos = Math.ceil(Math.min(1, totalDiferencial / objetivo) * SEGMENTOS_PROGRESO.length);

  const porcentajeDe = useCallback(
    (id) => {
      if (totalDiferencial === 0) return "0%";
      return formatearPorcentaje((estado.conteos[id] / totalDiferencial) * 100);
    },
    [estado.conteos, totalDiferencial],
  );

  const incrementarCelula = useCallback((id) => {
    const celula = CELULAS_POR_ID.get(id);
    if (!celula) return;

    setEstado((estadoActual) => {
      const totalActual = totalDiferencialDesde(estadoActual.conteos);
      if (celula.incluyeDiferencial && totalActual >= objetivo) return estadoActual;

      return {
        conteos: {
          ...estadoActual.conteos,
          [id]: estadoActual.conteos[id] + 1,
        },
        historial: [...estadoActual.historial, id],
      };
    });
  }, [objetivo]);

  const disminuirCelula = useCallback((id) => {
    setEstado((estadoActual) => {
      if (!estadoActual.conteos[id]) return estadoActual;

      const indiceHistorial = estadoActual.historial.lastIndexOf(id);
      const nuevoHistorial = indiceHistorial === -1
        ? estadoActual.historial
        : [
            ...estadoActual.historial.slice(0, indiceHistorial),
            ...estadoActual.historial.slice(indiceHistorial + 1),
          ];

      return {
        conteos: {
          ...estadoActual.conteos,
          [id]: estadoActual.conteos[id] - 1,
        },
        historial: nuevoHistorial,
      };
    });
  }, []);

  const deshacerUltimaCelula = useCallback(() => {
    setEstado((estadoActual) => {
      if (estadoActual.historial.length === 0) return estadoActual;

      const ultimoId = estadoActual.historial[estadoActual.historial.length - 1];
      return {
        conteos: {
          ...estadoActual.conteos,
          [ultimoId]: Math.max(0, estadoActual.conteos[ultimoId] - 1),
        },
        historial: estadoActual.historial.slice(0, -1),
      };
    });
  }, []);

  const reiniciarConteo = useCallback(() => {
    setEstado(crearEstadoInicial());
    setConfirmarReinicio(false);
  }, []);

  useEffect(() => {
    const manejarTeclado = (evento) => {
      if (confirmarReinicio || evento.repeat) return;

      const etiquetaActiva = evento.target?.tagName;
      if (etiquetaActiva === "INPUT" || etiquetaActiva === "SELECT" || etiquetaActiva === "TEXTAREA") return;

      if (evento.code === "Escape") {
        onCerrar();
        return;
      }

      const idCelula = ATAJOS[evento.code];
      if (!idCelula) return;

      evento.preventDefault();
      incrementarCelula(idCelula);
    };

    window.addEventListener("keydown", manejarTeclado);
    return () => window.removeEventListener("keydown", manejarTeclado);
  }, [confirmarReinicio, incrementarCelula, onCerrar]);

  const aplicarDiferencial = () => {
    const resumen = CELULAS
      .filter((celula) => estado.conteos[celula.id] > 0)
      .map((celula) => `${celula.nombre}: ${estado.conteos[celula.id]} (${porcentajeDe(celula.id)})`)
      .join(" · ");

    onAplicar({
      conteos: estado.conteos,
      historial: estado.historial,
      metaSeleccionada,
      metaPersonalizada,
      totalDiferencial,
      resumen: resumen || "Sin células contabilizadas",
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#11141c]/70 p-0 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-contador-celulas"
        className="flex h-dvh w-full flex-col overflow-hidden bg-[#f6f7f8] text-ink shadow-[0_30px_100px_rgb(0_0_0_/_0.38)] sm:h-auto sm:min-h-[460px] sm:max-h-[calc(100dvh-48px)] sm:max-w-[1180px] sm:rounded-[22px] sm:border sm:border-white/60"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line bg-white px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fdecea] text-[#c0392b]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                <path d="M9.2 3.1c2 2.4 4.1 4.9 4.1 7.3a4.1 4.1 0 1 1-8.2 0c0-2.4 2-4.9 4.1-7.3Z" />
                <path d="M16.6 8.5c1.5 1.9 3.1 3.8 3.1 5.7a3.2 3.2 0 1 1-6.4 0c0-1.9 1.5-3.8 3.3-5.7Z" opacity="0.8" />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="titulo-contador-celulas" className="truncate text-base font-semibold tracking-[-0.02em] sm:text-lg">Contador diferencial hematológico</h2>
                <span className="rounded-full bg-[#a9d5ca] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#173f36]">{control}</span>
              </div>
              <p className="mt-0.5 truncate text-[11px] text-ink-muted">Microscopía manual · Meta de {objetivo} células · Teclado numérico habilitado</p>
            </div>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar contador celular" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-base text-ink-muted transition hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            ×
          </button>
        </header>

        <div className="shrink-0 border-b border-line bg-white px-4 py-2.5 sm:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-5">
            <div className="min-w-0 flex-1 xl:max-w-[340px]">
              <div className="flex items-end justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">Total contado</p>
                <p className="font-mono text-lg font-semibold leading-5 tabular-nums text-ink">
                  {totalDiferencial} <span className="text-xs font-medium text-ink-faint">/ {objetivo}</span>
                </p>
              </div>
              <div
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax={objetivo}
                aria-valuenow={Math.min(totalDiferencial, objetivo)}
                aria-label={`Progreso del recuento: ${totalDiferencial} de ${objetivo}`}
                className="mt-1.5 grid h-2 grid-cols-[repeat(20,minmax(0,1fr))] gap-0.5 overflow-hidden rounded-full"
              >
                {SEGMENTOS_PROGRESO.map((segmento) => (
                  <span
                    key={segmento}
                    className={segmento < segmentosCompletos ? (recuentoCompleto ? "bg-status-ok" : "bg-[#4f7180]") : "bg-[#e7eaed]"}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-faint">Meta</span>
              <div className="grid flex-1 grid-cols-4 rounded-lg border border-line bg-[#f4f5f6] p-0.5 sm:flex-none">
                {["100", "200", "500"].map((meta) => (
                  <button
                    key={meta}
                    type="button"
                    onClick={() => setMetaSeleccionada(meta)}
                    className={`h-7 rounded-md px-3 text-xs font-semibold tabular-nums transition ${metaSeleccionada === meta ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}
                  >
                    {meta}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setMetaSeleccionada("personalizada")}
                  className={`h-7 rounded-md px-2.5 text-[11px] font-semibold transition ${metaSeleccionada === "personalizada" ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"}`}
                >
                  Personalizada
                </button>
              </div>
              {metaSeleccionada === "personalizada" ? (
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={metaPersonalizada}
                  onChange={(evento) => setMetaPersonalizada(evento.target.value)}
                  aria-label="Cantidad personalizada de células"
                  className="h-8 w-20 rounded-lg border border-line bg-white px-2.5 text-sm font-semibold tabular-nums text-ink outline-none focus:border-status-info focus:ring-4 focus:ring-status-info/10"
                />
              ) : null}
            </div>

            <div className="flex gap-2 xl:ml-auto">
              <button type="button" onClick={deshacerUltimaCelula} disabled={estado.historial.length === 0} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 text-[11px] font-semibold text-ink-muted shadow-sm transition hover:border-[#9eabb2] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40">
                <span className="text-sm" aria-hidden="true">↶</span>
                Deshacer
              </button>
              <button type="button" onClick={() => setConfirmarReinicio(true)} disabled={estado.historial.length === 0} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 text-[11px] font-semibold text-status-alert shadow-sm transition hover:border-status-alert/35 hover:bg-status-alert-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-alert disabled:cursor-not-allowed disabled:opacity-40">
                <span className="text-sm" aria-hidden="true">⟳</span>
                Reiniciar
              </button>
            </div>
          </div>

          {recuentoCompleto ? (
            <div role="status" className="mt-2.5 flex items-center gap-2 rounded-lg border border-[#b9ddc5] bg-status-ok-soft px-3 py-1.5 text-status-ok">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-status-ok text-xs font-bold text-white" aria-hidden="true">✓</span>
              <div>
                <p className="text-xs font-semibold">Recuento diferencial completo</p>
                <p className="text-[10px] opacity-80">Meta de {objetivo} leucocitos alcanzada. Puedes revisar, corregir o aplicar.</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="grid flex-1 gap-2 px-4 py-5 content-center sm:grid-cols-2 sm:px-5 md:grid-cols-3 lg:grid-cols-7">
            {CELULAS.map((celula) => (
              <BotonCelula
                key={celula.id}
                celula={celula}
                cantidad={estado.conteos[celula.id]}
                porcentaje={porcentajeDe(celula.id)}
                bloqueado={celula.incluyeDiferencial && recuentoCompleto}
                onIncrementar={incrementarCelula}
                onDisminuir={disminuirCelula}
              />
            ))}
            <div className="flex items-center gap-2 rounded-xl border border-line bg-[#eef1f4] px-3 py-1.5 sm:col-span-2 md:col-span-3 lg:col-span-7">
              <IconoTeclado className="size-4 shrink-0 text-ink-muted" />
              <p className="text-[10px] leading-3.5 text-ink-muted">
                <strong className="font-semibold text-ink">Teclado numérico habilitado</strong> — fila superior o Numpad (1–9, 0) para contar directo · Escape cierra.
              </p>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-line bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-[10px] leading-4 text-ink-faint sm:text-left">Fila numérica y Numpad habilitados · Mantener una tecla presionada no repite el conteo.</p>
          <div className="flex gap-2">
            <button type="button" onClick={onCerrar} className="h-9 flex-1 rounded-lg border border-line-strong bg-white px-4 text-xs font-medium text-ink transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:flex-none">
              Cancelar
            </button>
            <button type="button" onClick={aplicarDiferencial} disabled={estado.historial.length === 0} className="h-9 flex-1 rounded-lg bg-[#24406b] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2d4f80] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24406b] disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none">
              Aplicar conteo
            </button>
          </div>
        </footer>
      </section>

      {confirmarReinicio ? (
        <ConfirmacionReinicio onCancelar={() => setConfirmarReinicio(false)} onConfirmar={reiniciarConteo} />
      ) : null}
    </div>
  );
}
