"use client";

import { Check, Pencil, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const REGLO_AVISO = 6;
const REGLO_CRITICO = 3;

// Catálogo de ejemplo entregado por el laboratorio. Cuando exista la API,
// reemplazar INVENTARIO por la respuesta del backend.
const CATALOGO = [
  {
    categoria: "Microbiología",
    items: [
      "Agar sangre", "Agar MacConkey", "Agar chocolate", "Agar Mueller-Hinton", "Agar CLED",
      "Agar Sabouraud", "Agar manitol salado", "Agar XLD", "Agar SS", "Agar EMB", "Agar TCBS",
      "Agar Hektoen", "Agar cetrimida", "Agar cromogénico para orina", "Caldo tioglicolato",
      "Caldo BHI", "Caldo selenito", "Caldo tripticasa soya", "Medio Stuart", "Medio Amies",
      "Discos de antibiograma", "Tiras de gradiente MIC", "Reactivo de oxidasa", "Reactivo de catalasa",
      "Reactivo de indol", "Reactivo de Kovacs", "Plasma para coagulasa", "Colorantes para tinción de Gram",
      "Azul de metileno", "Fucsina", "Lugol", "Alcohol-acetona", "Aceite de inmersión",
    ],
  },
  {
    categoria: "Insumos para microbiología",
    items: [
      "Placas de Petri estériles", "Asas bacteriológicas desechables", "Asas calibradas de 1 µL",
      "Asas calibradas de 10 µL", "Hisopos estériles", "Tubos estériles", "Tubos con tapa rosca",
      "Frascos para hemocultivo", "Frascos recolectores de orina", "Portaobjetos", "Cubreobjetos",
      "Pipetas Pasteur", "Puntas de micropipeta", "Gradillas", "Bolsas para muestras biológicas",
    ],
  },
  {
    categoria: "Hematología",
    items: [
      "Reactivo diluyente hematológico", "Reactivo lisante", "Reactivo para hemoglobina",
      "Reactivo limpiador de analizador hematológico", "Control hematológico nivel bajo",
      "Control hematológico nivel normal", "Control hematológico nivel alto", "Colorante Wright",
      "Colorante Wright-Giemsa", "May-Grünwald", "Giemsa", "Azul de cresil brillante",
      "Solución salina", "Aceite de inmersión", "Capilares para hematocrito", "Sellador para capilares",
    ],
  },
  {
    categoria: "Coagulación",
    items: [
      "Tromboplastina para TP", "Reactivo para TTPa", "Reactivo de fibrinógeno",
      "Reactivo para tiempo de trombina", "D-dímero", "Controles de coagulación",
      "Plasma control normal", "Plasma control patológico", "Cloruro de calcio", "Cubetas para coagulómetro",
    ],
  },
  {
    categoria: "Bioquímica clínica",
    items: [
      "Glucosa", "Urea", "Creatinina", "Ácido úrico", "Colesterol total", "HDL colesterol",
      "LDL colesterol", "Triglicéridos", "Bilirrubina total", "Bilirrubina directa", "Proteínas totales",
      "Albúmina", "Calcio", "Fósforo", "Magnesio", "Hierro", "AST / GOT", "ALT / GPT",
      "Fosfatasa alcalina", "GGT", "LDH", "CK", "CK-MB", "Amilasa", "Lipasa", "Proteína C reactiva",
      "Lactato", "Amonio", "Electrolitos", "Calibradores bioquímicos", "Controles bioquímicos nivel 1",
      "Controles bioquímicos nivel 2", "Controles bioquímicos nivel 3",
    ],
  },
  {
    categoria: "Inmunología / serología",
    items: [
      "Reactivo para PCR", "Factor reumatoideo", "ASO", "VDRL", "RPR", "Test de embarazo hCG",
      "VIH", "HBsAg", "Anti-HCV", "Toxoplasma IgG/IgM", "Rubéola IgG/IgM", "CMV IgG/IgM",
      "Ferritina", "Troponina", "Procalcitonina", "TSH", "T4 libre", "PSA",
    ],
  },
];

const UBICACIONES_BASE = {
  "Microbiología": "Refrigerador de medios",
  "Insumos para microbiología": "Temp. ambiente",
  "Hematología": "Refrigerador A",
  "Coagulación": "Refrigerador B",
  "Bioquímica clínica": "Refrigerador C",
  "Inmunología / serología": "Congelador -20°",
};

const CONDICIONES_BASE = {
  "Microbiología": "2–8 °C · protegido de la luz",
  "Insumos para microbiología": "Temp. ambiente · zona seca",
  "Hematología": "2–8 °C",
  "Coagulación": "2–8 °C",
  "Bioquímica clínica": "2–8 °C",
  "Inmunología / serología": "Congelado a -20 °C",
};

// Stock demo determinístico (mismos valores en cada carga) hasta conectar API.
const INVENTARIO = CATALOGO.flatMap((grupo, indiceGrupo) =>
  grupo.items.map((nombre, indiceItem) => ({
    id: `${indiceGrupo}-${indiceItem}`,
    nombre,
    categoria: grupo.categoria,
    stock: ((indiceGrupo * 7 + indiceItem * 13) % 28) + 1,
    minimo: REGLO_AVISO,
    ubicacion: `${UBICACIONES_BASE[grupo.categoria]} · Estante ${(indiceItem % 4) + 1}`,
    condiciones: CONDICIONES_BASE[grupo.categoria],
  }))
);

function claseDeEstado(stock, minimo) {
  if (stock <= REGLO_CRITICO) {
    return { chip: "Por agotarse", chipClase: "border-status-alert/30 bg-status-alert-soft text-status-alert", valorClase: "font-semibold text-status-alert" };
  }
  if (stock <= minimo) {
    return { chip: "Bajo mínimo", chipClase: "border-[#f0dcc0] bg-status-warn-soft text-status-warn", valorClase: "font-semibold text-status-warn" };
  }
  return null;
}

function BotonAccion({ etiqueta, tono, onClick, children }) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={onClick}
        aria-label={etiqueta}
        className={`flex size-7 items-center justify-center rounded-lg border border-line/60 bg-white text-ink-faint shadow-[0_1px_2px_rgb(15_23_42_/_0.05)] transition-all duration-200 ${EASE_PREMIUM} focus-visible:outline-2 focus-visible:outline-offset-1 ${tono}`}
      >
        {children}
      </button>
      <span className="pointer-events-none absolute -top-7 left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-[#11141c] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white opacity-0 shadow-[0_6px_18px_rgb(15_23_42_/_0.3)] transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        {etiqueta}
      </span>
    </span>
  );
}

export default function PaginaInventarioLaboratorio() {
  const [stocks, setStocks] = useState(() => Object.fromEntries(INVENTARIO.map((item) => [item.id, item.stock])));
  const [editando, setEditando] = useState(false);
  const [editandoStockId, setEditandoStockId] = useState(null);

  const items = useMemo(
    () => INVENTARIO.map((item) => ({ ...item, stock: stocks[item.id] ?? item.stock })),
    [stocks],
  );

  // Solo los ítems bajo la regla de aviso o próximos a acabarse.
  const criticos = useMemo(
    () => items.filter((item) => item.stock <= item.minimo).sort((a, b) => a.stock - b.stock),
    [items],
  );

  const cambiarStock = (id, valor) => {
    const stock = Math.max(0, Math.floor(Number(valor) || 0));
    setStocks((actuales) => ({ ...actuales, [id]: stock }));
  };

  return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
      <header className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
            Análisis QC / Inventario Laboratorio
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
            Inventario Laboratorio
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
            Ítems bajo la regla de aviso: próximos a acabarse o bajo su stock mínimo, con sus condiciones de almacenamiento.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          {editando ? (
            <button
              type="button"
              onClick={() => setEditando(false)}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:bg-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
            >
              Guardar cambios
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditando(true)}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:bg-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              Editar inventario
            </button>
          )}
        </div>
      </header>

      <section aria-labelledby="titulo-regla-aviso" className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <h2 id="titulo-regla-aviso" className="text-[11px] font-bold uppercase tracking-[0.14em] text-status-info">Bajo la regla de aviso</h2>
            <p className="mt-1 truncate text-xs text-ink-muted">Ítems próximos a acabarse o bajo su stock mínimo.</p>
          </div>
          <span className="inline-flex h-7 items-center rounded-full bg-status-info-soft px-3 text-[11px] font-semibold text-status-info">
            {criticos.length} ítems
          </span>
        </div>

        {criticos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[9%]" />
                <col className="w-[10%]" />
                <col className="w-[22%]" />
                <col className="w-[24%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-line/60 bg-[#f8f9fb]">
                  <th scope="col" className="border-r border-line/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Reactivo</th>
                  <th scope="col" className="border-r border-line/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Cantidad</th>
                  <th scope="col" className="border-r border-line/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Stock mínimo</th>
                  <th scope="col" className="border-r border-line/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Condiciones de almacenamiento</th>
                  <th scope="col" className="border-r border-line/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Ubicación en el laboratorio</th>
                  <th scope="col" className="px-4 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {criticos.map((item) => {
                  const estado = claseDeEstado(item.stock, item.minimo);
                  return (
                    <tr key={item.id} className={`border-b border-line/60 transition-colors duration-200 ${EASE_PREMIUM} last:border-0 hover:bg-[#fbfbfc]`}>
                      <td className="border-r border-line/60 px-4 py-2 align-top">
                        <p className="truncate text-[12px] font-medium leading-4 text-ink">{item.nombre}</p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] leading-2.5 text-ink-faint">
                          <span className="truncate">{item.categoria}</span>
                          <span className={`inline-flex shrink-0 whitespace-nowrap rounded-full border px-1 py-px text-[7px] font-bold uppercase leading-2.5 tracking-[0.06em] ${estado.chipClase}`}>{estado.chip}</span>
                        </p>
                      </td>
                      <td className="border-r border-line/60 px-4 py-2 align-top">
                        {editando || editandoStockId === item.id ? (
                          <input
                            type="number"
                            min="0"
                            step="1"
                            autoFocus
                            value={item.stock}
                            onChange={(evento) => cambiarStock(item.id, evento.target.value)}
                            aria-label={`Stock de ${item.nombre}`}
                            className="h-7 w-16 rounded-md border border-status-info bg-white px-2 text-right font-mono text-[11px] font-semibold tabular-nums text-ink outline-none focus:ring-4 focus:ring-status-info/10"
                          />
                        ) : (
                          <strong className={`font-mono text-[13px] tabular-nums ${estado.valorClase}`}>{item.stock}</strong>
                        )}
                      </td>
                      <td className="border-r border-line/60 px-4 py-2 align-top font-mono text-[12px] tabular-nums text-ink-muted">{item.minimo}</td>
                      <td className="border-r border-line/60 px-4 py-2 align-top text-[11px] leading-4 text-ink-muted">{item.condiciones}</td>
                      <td className="border-r border-line/60 px-4 py-2 align-top text-[11px] leading-4 text-ink-muted">{item.ubicacion}</td>
                      <td className="px-3 py-2 align-top">
                        <div className="flex items-center justify-center gap-1.5">
                          {editandoStockId === item.id ? (
                            <BotonAccion
                              etiqueta="Listo"
                              tono="hover:border-status-ok/40 hover:bg-status-ok-soft hover:text-status-ok focus-visible:outline-status-ok"
                              onClick={() => setEditandoStockId(null)}
                            >
                              <Check className="size-3.5" aria-hidden="true" />
                            </BotonAccion>
                          ) : (
                            <BotonAccion
                              etiqueta="Editar stock"
                              tono="hover:border-status-info/40 hover:bg-status-info-soft hover:text-status-info focus-visible:outline-status-info"
                              onClick={() => setEditandoStockId(item.id)}
                            >
                              <Pencil className="size-3.5" aria-hidden="true" />
                            </BotonAccion>
                          )}
                          <BotonAccion
                            etiqueta={editando ? "Terminar edición" : "Editar todo"}
                            tono="hover:border-status-info/40 hover:bg-status-info-soft hover:text-status-info focus-visible:outline-status-info"
                            onClick={() => setEditando((actual) => !actual)}
                          >
                            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                          </BotonAccion>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-ink-muted">Ningún ítem está bajo la regla de aviso. Todo el inventario está sobre su stock mínimo.</p>
          </div>
        )}
      </section>

      <p className="mt-6 text-[11px] leading-4 text-ink-faint">
        Los cambios hechos en modo edición se mantienen en la sesión; aún no se guardan en el servidor.
      </p>
    </div>
  );
}
