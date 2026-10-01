"use client";

import { Check, Pencil, Plus, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export default function PaginaInventarioLaboratorio() {
  const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";
  const REGLO_AVISO = 6;
  const REGLO_CRITICO = 3;
  const CLASE_CAMPO = "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-status-info focus:ring-4 focus:ring-status-info/10";
  const CLASE_ACCION = `flex size-7 items-center justify-center rounded-lg border border-line/60 bg-white text-ink-faint shadow-[0_1px_2px_rgb(15_23_42_/_0.05)] transition-all duration-200 ${EASE_PREMIUM} focus-visible:outline-2 focus-visible:outline-offset-1`;
  const [INVENTARIO, setInventario] = useState(() => {
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
    return CATALOGO.flatMap((grupo, indiceGrupo) =>
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
  });
  const [stocks, setStocks] = useState(() => Object.fromEntries(INVENTARIO.map((item) => [item.id, item.stock])));
  const [editando, setEditando] = useState(false);
  const [editandoStockId, setEditandoStockId] = useState(null);
  const [popiuopInsertar, setPopiuopInsertar] = useState(false);
  const [mensajeIngreso, setMensajeIngreso] = useState("");
  const dialogoInsertar = useRef(null);

  useEffect(() => {
    const dialogo = dialogoInsertar.current;
    if (popiuopInsertar) {
      if (!dialogo.open) dialogo.showModal();
    } else if (dialogo.open) {
      dialogo.close();
    }
  }, [popiuopInsertar]);

  const items = useMemo(
    () => INVENTARIO.map((item) => ({ ...item, stock: stocks[item.id] ?? item.stock })),
    [INVENTARIO, stocks],
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
          <button
            type="button"
            onClick={() => {
              setMensajeIngreso("");
              setPopiuopInsertar(true);
            }}
            aria-haspopup="dialog"
            aria-controls="dialogo-ingresar-reactivo"
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white px-4 text-sm font-medium text-ink shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:border-status-info hover:text-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info`}
          >
            <Plus className="size-4" aria-hidden="true" />
            Ingresar
          </button>
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

      <p role="status" className={mensajeIngreso ? "mt-5 rounded-xl border border-status-ok/20 bg-status-ok-soft px-4 py-3 text-sm text-status-ok" : "sr-only"}>
        {mensajeIngreso}
      </p>

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
                  const estado = item.stock <= REGLO_CRITICO
                    ? { chip: "Por agotarse", chipClase: "border-status-alert/30 bg-status-alert-soft text-status-alert", valorClase: "font-semibold text-status-alert" }
                    : { chip: "Bajo mínimo", chipClase: "border-[#f0dcc0] bg-status-warn-soft text-status-warn", valorClase: "font-semibold text-status-warn" };
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
                            <button
                              type="button"
                              aria-label="Listo"
                              title="Listo"
                              className={`${CLASE_ACCION} hover:border-status-ok/40 hover:bg-status-ok-soft hover:text-status-ok focus-visible:outline-status-ok`}
                              onClick={() => setEditandoStockId(null)}
                            >
                              <Check className="size-3.5" aria-hidden="true" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              aria-label="Editar stock"
                              title="Editar stock"
                              className={`${CLASE_ACCION} hover:border-status-info/40 hover:bg-status-info-soft hover:text-status-info focus-visible:outline-status-info`}
                              onClick={() => setEditandoStockId(item.id)}
                            >
                              <Pencil className="size-3.5" aria-hidden="true" />
                            </button>
                          )}
                          <button
                            type="button"
                            aria-label={editando ? "Terminar edición" : "Editar todo"}
                            title={editando ? "Terminar edición" : "Editar todo"}
                            className={`${CLASE_ACCION} hover:border-status-info/40 hover:bg-status-info-soft hover:text-status-info focus-visible:outline-status-info`}
                            onClick={() => setEditando((actual) => !actual)}
                          >
                            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                          </button>
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
        Los ingresos y cambios se mantienen mientras esta página esté abierta; se pierden al recargar y aún no se guardan en el servidor.
      </p>

      <dialog
        id="dialogo-ingresar-reactivo"
        ref={dialogoInsertar}
        aria-labelledby="titulo-ingresar-reactivo"
        aria-describedby="descripcion-ingresar-reactivo"
        onCancel={(evento) => {
          evento.preventDefault();
          setPopiuopInsertar(false);
        }}
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border border-line bg-white p-0 text-ink shadow-2xl backdrop:bg-black/45 backdrop:backdrop-blur-sm"
      >
        <form
          onSubmit={(evento) => {
            evento.preventDefault();
            const formulario = evento.currentTarget;
            const datos = new FormData(formulario);
            const nombre = datos.get("reactivo").trim();
            const condiciones = datos.get("condiciones").trim();
            const ubicacion = datos.get("ubicacion").trim();
            const usuarioNotificar = datos.get("usuarioNotificar").trim();
            const stock = Number(datos.get("cantidad"));
            const minimo = Number(datos.get("minimo"));
            if (!nombre || !condiciones || !ubicacion || !usuarioNotificar ||
                !Number.isSafeInteger(stock) || stock < 0 ||
                !Number.isSafeInteger(minimo) || minimo < 0) return;

            const nuevoReactivo = {
              id: crypto.randomUUID(),
              nombre,
              categoria: "Ingreso manual",
              stock,
              minimo,
              condiciones,
              ubicacion,
              condicionAlerta: datos.get("condicionAlerta"),
              usuarioNotificar,
            };
            setInventario((actuales) => [...actuales, nuevoReactivo]);
            setMensajeIngreso(
              stock <= minimo
                ? `${nombre} ingresado temporalmente y agregado a la tabla de aviso.`
                : `${nombre} ingresado temporalmente. No aparece en la tabla de aviso porque su cantidad supera el stock mínimo.`
            );
            formulario.reset();
            setPopiuopInsertar(false);
          }}
        >
          <header className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-white px-5 py-5 sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-status-info">Inventario laboratorio</p>
              <h2 id="titulo-ingresar-reactivo" className="mt-1 text-xl font-semibold tracking-tight">Ingresar reactivo</h2>
              <p id="descripcion-ingresar-reactivo" className="mt-2 text-sm leading-5 text-ink-muted">
                Completa los datos de existencias, almacenamiento y aviso.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPopiuopInsertar(false)}
              aria-label="Cerrar ingreso de reactivo"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          <div className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="ingreso-reactivo" className="text-sm font-medium text-ink-muted">Reactivo</label>
              <input id="ingreso-reactivo" name="reactivo" type="text" required pattern=".*\S.*" maxLength={150} autoFocus placeholder="Nombre del reactivo" className={CLASE_CAMPO} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ingreso-cantidad" className="text-sm font-medium text-ink-muted">Cantidad</label>
              <input id="ingreso-cantidad" name="cantidad" type="number" required min="0" max={Number.MAX_SAFE_INTEGER} step="1" placeholder="0" className={CLASE_CAMPO} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ingreso-minimo" className="text-sm font-medium text-ink-muted">Stock mínimo</label>
              <input id="ingreso-minimo" name="minimo" type="number" required min="0" max={Number.MAX_SAFE_INTEGER} step="1" defaultValue={REGLO_AVISO} className={CLASE_CAMPO} />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="ingreso-condiciones" className="text-sm font-medium text-ink-muted">Condiciones de almacenamiento</label>
              <textarea id="ingreso-condiciones" name="condiciones" required maxLength={500} rows={3} placeholder="Describe las condiciones indicadas para este reactivo" onChange={(evento) => evento.currentTarget.setCustomValidity(evento.currentTarget.value.trim() ? "" : "Ingresa las condiciones de almacenamiento.")} className={`${CLASE_CAMPO} min-h-24 resize-y`} />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="ingreso-ubicacion" className="text-sm font-medium text-ink-muted">Ubicación en el laboratorio</label>
              <input id="ingreso-ubicacion" name="ubicacion" type="text" required pattern=".*\S.*" maxLength={200} placeholder="Área, equipo o estante" className={CLASE_CAMPO} />
            </div>
            <fieldset className="grid gap-4 rounded-xl border border-line bg-surface-muted/50 p-4 sm:col-span-2 sm:grid-cols-2">
              <legend className="px-1 text-xs font-semibold text-status-info">Configuración de aviso</legend>
              <div className="flex flex-col gap-2">
                <label htmlFor="ingreso-alerta" className="text-sm font-medium text-ink-muted">Condición de alerta</label>
                <select id="ingreso-alerta" name="condicionAlerta" defaultValue="minimo" required className={CLASE_CAMPO}>
                  <option value="minimo">Stock igual o inferior al mínimo</option>
                  <option value="bajo_minimo">Stock inferior al mínimo</option>
                  <option value="agotado">Stock agotado (0 unidades)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="ingreso-usuario" className="text-sm font-medium text-ink-muted">Usuario a notificar</label>
                <input id="ingreso-usuario" name="usuarioNotificar" type="text" required pattern=".*\S.*" maxLength={200} placeholder="Nombre o correo del usuario" aria-describedby="aviso-notificaciones" className={CLASE_CAMPO} />
              </div>
              <p id="aviso-notificaciones" className="text-xs leading-5 text-ink-faint sm:col-span-2">
                La condición y el destinatario se guardan solo en este registro temporal. No se envían notificaciones ni se modifica la regla actual de la tabla.
              </p>
            </fieldset>
          </div>

          <footer className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-line bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button type="button" onClick={() => setPopiuopInsertar(false)} className="inline-flex h-10 items-center justify-center rounded-xl border border-line-strong bg-white px-4 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">
              Cancelar
            </button>
            <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">
              <Plus className="size-4" aria-hidden="true" />
              Ingresar reactivo
            </button>
          </footer>
        </form>
      </dialog>
    </div>
  );
}
