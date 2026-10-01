"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CELULAS = [
  { id: "segmentados", nombre: "Neutrófilos segmentados", nombreCorto: "Segmentados", grupo: "maduras", tecla: "1", incluyeDiferencial: true, acento: "#5b8ca3", suave: "#1d2127" },
  { id: "linfocitos", nombre: "Linfocitos", nombreCorto: "Linfocitos", grupo: "maduras", tecla: "2", incluyeDiferencial: true, acento: "#8a76c4", suave: "#1d2127" },
  { id: "monocitos", nombre: "Monocitos", nombreCorto: "Monocitos", grupo: "maduras", tecla: "3", incluyeDiferencial: true, acento: "#8a95a0", suave: "#1d2127" },
  { id: "eosinofilos", nombre: "Eosinófilos", nombreCorto: "Eosinófilos", grupo: "maduras", tecla: "4", incluyeDiferencial: true, acento: "#cf8552", suave: "#1d2127" },
  { id: "basofilos", nombre: "Basófilos", nombreCorto: "Basófilos", grupo: "maduras", tecla: "5", incluyeDiferencial: true, acento: "#937fb3", suave: "#1d2127" },
  { id: "baciliformes", nombre: "Neutrófilos baciliformes", nombreCorto: "Baciliformes", grupo: "inmaduras", tecla: "6", incluyeDiferencial: true, acento: "#5f9c7f", suave: "#1d2127" },
  { id: "metamielocitos", nombre: "Metamielocitos", nombreCorto: "Metamielocitos", grupo: "inmaduras", tecla: "7", incluyeDiferencial: true, acento: "#7fa465", suave: "#1d2127" },
  { id: "mielocitos", nombre: "Mielocitos", nombreCorto: "Mielocitos", grupo: "inmaduras", tecla: "8", incluyeDiferencial: true, acento: "#9d9f60", suave: "#1d2127" },
  { id: "promielocitos", nombre: "Promielocitos", nombreCorto: "Promielocitos", grupo: "inmaduras", tecla: "9", incluyeDiferencial: true, acento: "#bd865c", suave: "#1d2127" },
  { id: "blastos", nombre: "Blastos", nombreCorto: "Blastos", grupo: "inmaduras", tecla: "0", incluyeDiferencial: true, acento: "#c96b60", suave: "#1d2127" },
  { id: "eritroblastos", nombre: "Eritroblastos", nombreCorto: "Eritroblastos", grupo: "otras", tecla: null, incluyeDiferencial: false, acento: "#bd7183", suave: "#1d2127" },
  { id: "linfocitosReactivos", nombre: "Linfocitos reactivos", nombreCorto: "Linfocitos reactivos", grupo: "otras", tecla: null, incluyeDiferencial: true, acento: "#7f8fc2", suave: "#1d2127" },
  { id: "otras", nombre: "Otras células", nombreCorto: "Otras células", grupo: "otras", tecla: null, incluyeDiferencial: true, acento: "#8b8f98", suave: "#1d2127" },
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
    citoplasma: "#fafafa",
    borde: "#d6d9de",
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
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: <circle cx="21" cy="22" r="10" fill="#443a85" />,
  },
  monocitos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: (
      <g>
        <circle cx="24" cy="22" r="9" fill="#574a9e" />
        <circle cx="16.5" cy="22" r="4.6" fill="#fafafa" />
      </g>
    ),
  },
  eosinofilos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: (
      <g fill="#493d82">
        <circle cx="18.5" cy="20" r="6.4" />
        <circle cx="26.5" cy="24" r="5.8" />
      </g>
    ),
    granulos: { color: "#d9663d", radio: 2, puntos: [[14, 15], [28, 13], [33, 22], [27, 30], [16, 30], [11, 23], [22, 10], [33, 28], [12, 17]] },
  },
  basofilos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: <circle cx="21" cy="22" r="7.5" fill="#3f3378" />,
    granulos: { color: "#2e2a5c", radio: 2.6, puntos: [[17, 17], [26, 15], [31, 22], [24, 27], [16, 26], [28, 30], [13, 21], [21, 33]] },
  },
  baciliformes: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: <path d="M16.5 27.5 C13.5 20 19 14 25.5 15.5 C31 17 31.5 24 27 26.8" fill="none" stroke="#5a4da3" strokeWidth="5.4" strokeLinecap="round" />,
  },
  metamielocitos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: (
      <g>
        <circle cx="24.5" cy="22" r="8" fill="#6053a9" />
        <circle cx="17.5" cy="22" r="4" fill="#fafafa" />
      </g>
    ),
    granulos: { color: "#c2b2e2", radio: 1.5, puntos: [[14, 15], [29, 13], [33, 23], [27, 31], [13, 26], [21, 34]] },
  },
  mielocitos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: <circle cx="21.5" cy="21.5" r="8.2" fill="#6a5cb0" />,
    granulos: { color: "#c8b9e6", radio: 1.6, puntos: [[13, 16], [29, 13], [33, 24], [26, 31], [14, 28], [21, 10], [34, 17]] },
  },
  promielocitos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: <circle cx="20.5" cy="21" r="9.4" fill="#7263b8" />,
    granulos: { color: "#a98fd6", radio: 2, puntos: [[30, 14], [33, 24], [28, 31], [13, 28], [12, 17], [24, 34], [34, 19]] },
  },
  blastos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: (
      <g>
        <circle cx="21" cy="21.5" r="10.5" fill="#4a3c8e" />
        <circle cx="18.5" cy="19" r="1.5" fill="#8d7fc6" />
        <circle cx="24" cy="24.5" r="1.3" fill="#8d7fc6" />
      </g>
    ),
  },
  eritroblastos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: <circle cx="22" cy="22" r="7.2" fill="#342a60" />,
  },
  linfocitosReactivos: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: <circle cx="20" cy="21" r="8.6" fill="#443a85" />,
    granulos: { color: "#b3aade", radio: 1.6, puntos: [[29, 15], [32, 24], [27, 30], [13, 27]] },
  },
  otras: {
    citoplasma: "#fafafa",
    borde: "#d6d9de",
    nucleo: <circle cx="22" cy="22" r="7.8" fill="#6c6c8e" />,
  },
};

let contextoAudio = null;

function reproducirClic() {
  try {
    const ConstructorAudio = window.AudioContext ?? window.webkitAudioContext;
    if (!ConstructorAudio) return;

    contextoAudio ??= new ConstructorAudio();
    if (contextoAudio.state === "suspended") void contextoAudio.resume();

    const tiempo = contextoAudio.currentTime;

    const golpe = contextoAudio.createOscillator();
    const volumenGolpe = contextoAudio.createGain();
    golpe.type = "triangle";
    golpe.frequency.setValueAtTime(2200, tiempo);
    golpe.frequency.exponentialRampToValueAtTime(900, tiempo + 0.045);
    volumenGolpe.gain.setValueAtTime(0.0001, tiempo);
    volumenGolpe.gain.exponentialRampToValueAtTime(0.14, tiempo + 0.005);
    volumenGolpe.gain.exponentialRampToValueAtTime(0.0001, tiempo + 0.075);
    golpe.connect(volumenGolpe).connect(contextoAudio.destination);
    golpe.start(tiempo);
    golpe.stop(tiempo + 0.08);

    const cuerpo = contextoAudio.createOscillator();
    const volumenCuerpo = contextoAudio.createGain();
    cuerpo.type = "square";
    cuerpo.frequency.setValueAtTime(340, tiempo);
    volumenCuerpo.gain.setValueAtTime(0.0001, tiempo);
    volumenCuerpo.gain.exponentialRampToValueAtTime(0.05, tiempo + 0.004);
    volumenCuerpo.gain.exponentialRampToValueAtTime(0.0001, tiempo + 0.05);
    cuerpo.connect(volumenCuerpo).connect(contextoAudio.destination);
    cuerpo.start(tiempo);
    cuerpo.stop(tiempo + 0.06);
  } catch {
    return;
  }
}

function reproducirMeta() {
  try {
    const ConstructorAudio = window.AudioContext ?? window.webkitAudioContext;
    if (!ConstructorAudio) return;

    contextoAudio ??= new ConstructorAudio();
    if (contextoAudio.state === "suspended") void contextoAudio.resume();

    const tiempo = contextoAudio.currentTime;

    [[784, 0], [1175, 0.12]].forEach(([frecuencia, retardo]) => {
      const oscilador = contextoAudio.createOscillator();
      const ganancia = contextoAudio.createGain();
      const inicio = tiempo + retardo;

      oscilador.type = "sine";
      oscilador.frequency.setValueAtTime(frecuencia, inicio);
      ganancia.gain.setValueAtTime(0.0001, inicio);
      ganancia.gain.exponentialRampToValueAtTime(0.16, inicio + 0.02);
      ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.45);
      oscilador.connect(ganancia).connect(contextoAudio.destination);
      oscilador.start(inicio);
      oscilador.stop(inicio + 0.5);
    });
  } catch {
    return;
  }
}

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

function BotonCelula({ celula, cantidad, porcentaje, bloqueado, onIncrementar, onDisminuir }) {
  const activa = cantidad > 0;
  const [presionada, setPresionada] = useState(false);

  const sombra = presionada
    ? `0 0 0 1px ${celula.acento}, 0 10px 30px rgb(0 0 0 / 0.35), 0 0 38px -2px ${celula.acento}d9`
    : activa
      ? `0 10px 30px rgb(0 0 0 / 0.35), 0 0 24px -8px ${celula.acento}73`
      : null;

  return (
    <article
      onPointerDown={() => setPresionada(true)}
      onPointerUp={() => setPresionada(false)}
      onPointerLeave={() => setPresionada(false)}
      onPointerCancel={() => setPresionada(false)}
      className={`relative overflow-hidden rounded-xl border bg-[#121419] shadow-[0_10px_30px_rgb(0_0_0_/_0.35)] transition duration-200 hover:shadow-[0_14px_36px_rgb(0_0_0_/_0.5)] ${activa ? "" : "border-white/10 hover:border-white/25"}`}
      style={sombra ? { borderColor: celula.acento, boxShadow: sombra } : undefined}
    >
      <span
        className="absolute inset-y-0 left-0 w-1 transition duration-200"
        style={{ backgroundColor: celula.acento, boxShadow: activa || presionada ? `0 0 14px ${celula.acento}` : undefined }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => onIncrementar(celula.id)}
        disabled={bloqueado}
        aria-label={`Añadir ${celula.nombre}`}
        aria-keyshortcuts={celula.tecla ?? undefined}
        className="flex w-full items-center gap-1.5 py-0.5 pl-2.5 pr-1.5 text-left outline-none transition focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#7c5cff]/25 disabled:cursor-not-allowed disabled:opacity-55"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: celula.suave }}>
          <IlustracionCelula id={celula.id} className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-1">
            <span className="truncate text-[9px] font-semibold leading-2.5 text-[#f4f4f5]">{celula.nombreCorto}</span>
            {celula.tecla ? (
              <kbd className="rounded border border-white/10 bg-white/[0.07] px-0.5 text-[8px] font-bold leading-2.5 text-[#8b8f98]">{celula.tecla}</kbd>
            ) : null}
          </span>
          <span className="flex items-end justify-between gap-1">
            <strong className="font-mono text-sm font-semibold leading-4 tabular-nums text-white">{cantidad}</strong>
            <span className="text-[8px] font-semibold tabular-nums text-[#6b7078]">{porcentaje}</span>
          </span>
        </span>
      </button>

      <div className="grid grid-cols-2 border-t border-white/10 bg-white/[0.03]">
        <button
          type="button"
          onClick={() => onDisminuir(celula.id)}
          disabled={cantidad === 0}
          aria-label={`Restar ${celula.nombre}`}
          className="flex h-4 items-center justify-center text-xs font-medium text-[#8b8f98] transition hover:bg-white/10 hover:text-white focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7c5cff] disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onIncrementar(celula.id)}
          disabled={bloqueado}
          aria-label={`Sumar ${celula.nombre}`}
          className="flex h-4 items-center justify-center border-l border-white/10 text-xs font-semibold text-[#c7cad1] transition hover:bg-white hover:text-[#0a0b0e] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#7c5cff] disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>
    </article>
  );
}

function ConfirmacionReinicio({ onCancelar, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmar-reinicio"
        className="w-full max-w-md rounded-[22px] border border-white/10 bg-[#101318] p-6 shadow-[0_30px_90px_rgb(0_0_0_/_0.6)]"
      >
        <span className="flex size-11 items-center justify-center rounded-2xl bg-[#7c5cff]/15 text-xl font-semibold text-[#a78bfa]" aria-hidden="true">!</span>
        <h3 id="titulo-confirmar-reinicio" className="mt-5 text-xl font-semibold tracking-[-0.025em] text-white">¿Reiniciar el recuento?</h3>
        <p className="mt-2 text-sm leading-6 text-[#8b8f98]">Se eliminarán todos los conteos y el historial de esta lectura. Esta acción no se puede deshacer.</p>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onCancelar} className="h-11 rounded-xl border border-white/15 bg-transparent px-4 text-sm font-medium text-[#c7cad1] transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Conservar recuento
          </button>
          <button type="button" onClick={onConfirmar} className="h-11 rounded-xl bg-white px-4 text-sm font-medium text-[#0a0b0e] shadow-sm transition hover:bg-[#d6d9de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
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
  const sonidoMetaReproducido = useRef(recuentoCompleto);

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
    if (celula.incluyeDiferencial && totalDiferencial >= objetivo) return;

    reproducirClic();

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
  }, [objetivo, totalDiferencial]);

  const disminuirCelula = useCallback((id) => {
    reproducirClic();

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
    if (!recuentoCompleto) {
      sonidoMetaReproducido.current = false;
      return;
    }
    if (sonidoMetaReproducido.current) return;

    sonidoMetaReproducido.current = true;
    reproducirMeta();
  }, [recuentoCompleto]);

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-0 backdrop-blur-sm sm:p-6">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Contador diferencial hematológico"
        className="flex h-dvh w-full flex-col overflow-hidden bg-[#0a0b0e] text-white shadow-[0_30px_100px_rgb(0_0_0_/_0.6)] sm:h-auto sm:min-h-[460px] sm:max-h-[calc(100dvh-48px)] sm:max-w-[1180px] sm:rounded-[22px] sm:border sm:border-white/10"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 py-3 sm:px-6">
          <Image src="/leveyLetras.png" alt="LeveyQC" width={2172} height={724} priority className="h-auto w-32 object-contain sm:w-44" />
          <button type="button" onClick={onCerrar} aria-label="Cerrar contador celular" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-transparent text-base text-[#8b8f98] transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            ×
          </button>
        </header>

        <div className="shrink-0 border-b border-white/10 px-4 py-2.5 sm:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-5">
            <div className="min-w-0 flex-1 xl:max-w-[340px]">
              <div className="flex items-end justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8b8f98]">Total contado</p>
                <p className="font-mono text-lg font-semibold leading-5 tabular-nums text-[#a78bfa]">
                  {totalDiferencial} <span className="text-xs font-medium text-[#565a63]">/ {objetivo}</span>
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
                    className={segmento < segmentosCompletos ? (recuentoCompleto ? "bg-[#34d399]" : "bg-[#7c5cff]") : "bg-white/10"}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#565a63]">Meta</span>
              <div className="grid flex-1 grid-cols-4 rounded-lg border border-white/10 bg-white/[0.06] p-0.5 sm:flex-none">
                {["100", "200", "500"].map((meta) => (
                  <button
                    key={meta}
                    type="button"
                    onClick={() => setMetaSeleccionada(meta)}
                    className={`h-7 rounded-md px-3 text-xs font-semibold tabular-nums transition ${metaSeleccionada === meta ? "bg-white text-[#0a0b0e] shadow-sm" : "text-[#8b8f98] hover:text-white"}`}
                  >
                    {meta}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setMetaSeleccionada("personalizada")}
                  className={`h-7 rounded-md px-2.5 text-[11px] font-semibold transition ${metaSeleccionada === "personalizada" ? "bg-white text-[#0a0b0e] shadow-sm" : "text-[#8b8f98] hover:text-white"}`}
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
                  className="h-8 w-20 rounded-lg border border-white/15 bg-white/[0.06] px-2.5 text-sm font-semibold tabular-nums text-white outline-none focus:border-[#7c5cff] focus:ring-4 focus:ring-[#7c5cff]/15"
                />
              ) : null}
            </div>

            <div className="flex gap-2 xl:ml-auto">
              <button type="button" onClick={deshacerUltimaCelula} disabled={estado.historial.length === 0} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-transparent px-3 text-[11px] font-semibold text-[#a1a1aa] transition hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40">
                <span className="text-sm" aria-hidden="true">↶</span>
                Deshacer
              </button>
              <button type="button" onClick={() => setConfirmarReinicio(true)} disabled={estado.historial.length === 0} className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-transparent px-3 text-[11px] font-semibold text-[#a1a1aa] transition hover:border-white/30 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40">
                <span className="text-sm" aria-hidden="true">⟳</span>
                Reiniciar
              </button>
            </div>
          </div>

          {recuentoCompleto ? (
            <div role="status" className="mt-2.5 flex items-center gap-2 rounded-lg border border-[#34d399]/25 bg-[#34d399]/10 px-3 py-1.5 text-[#34d399]">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#34d399] text-xs font-bold text-[#0a0b0e]" aria-hidden="true">✓</span>
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
          </div>
        </div>

        <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-center text-[10px] leading-4 text-[#565a63] sm:text-left">Contador celular y hematológico</p>
          <div className="flex gap-2">
            <button type="button" onClick={onCerrar} className="h-9 flex-1 rounded-lg border border-white/15 bg-transparent px-4 text-xs font-medium text-[#c7cad1] transition hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none">
              Cancelar
            </button>
            <button type="button" onClick={aplicarDiferencial} disabled={estado.historial.length === 0} className="h-9 flex-1 rounded-lg bg-white px-5 text-xs font-semibold text-[#0a0b0e] shadow-sm transition hover:bg-[#d6d9de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-45 sm:flex-none">
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
