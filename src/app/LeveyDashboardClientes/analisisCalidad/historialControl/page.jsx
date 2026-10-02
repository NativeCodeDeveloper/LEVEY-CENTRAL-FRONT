"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceArea,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { clasificarValidacion, COMENTARIOS_SUGERIDOS } from "@/lib/westgard";

// ------------------------- Estilos premium (internos) -------------------------
const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/* Encabezado del historial: nombre del control + lote en chip gris premium.
   Recibe props para cuando se conecte al backend o se navegue desde
   "Analitos Controlados" (por ahora usa los valores de ejemplo). */
function HistorialControles({ nombreControl = "Bio-Rad Insulina", lote = "H909937" }) {
  return (
    <header className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-status-info">
        ANALISIS QC / HISTORIAL CONTROLES
      </p>
      <h1 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[26px]">
        Historial Controles : <span className="text-status-info">{nombreControl}</span>
      </h1>
      {/* Lote del control en gris premium (chip discreto bajo el título) */}
      <p className="mt-2.5 inline-flex items-center gap-2 rounded-full border border-line bg-surface-muted px-3 py-1 text-[11px] font-medium text-ink-faint shadow-[0_1px_2px_rgb(15_23_42_/_0.04)]">
        Lote
        <span className="font-semibold tabular-nums tracking-[0.02em] text-ink-muted">{lote}</span>
      </p>
    </header>
  );
}

// ---------------------- Datos ficticios del Levey-Jennings ----------------------
// Nivel "Normal" de la insulina: valores objetivo del lote H909937 y una
// serie de 22 corridas generada a mano (los z-scores están fijados para que
// el gráfico muestre casos validados, en revisión y rechazados).
const MEDIA_INSULINA = 15.2; // µUI/mL
const DE_INSULINA = 0.76; // desviación estándar del nivel
const Z_FICTICIOS = [
  0.5, -0.6, 1.1, 0.2, -1.2, 0.8, 1.5, -0.4, 0.9, 2.2, 1.4,
  0.6, -0.8, 1.1, 0.3, -1.5, 2.3, 1.8, 1.2, 0.7, -3.3, 0.4,
];

// Dominio vertical del gráfico: un margen de 0.8 DE más allá de ±3 DE.
const DOMINIO_INFERIOR = Number((MEDIA_INSULINA - 3.8 * DE_INSULINA).toFixed(2));
const DOMINIO_SUPERIOR = Number((MEDIA_INSULINA + 3.8 * DE_INSULINA).toFixed(2));

const COLOR_POR_CLASIFICACION = {
  validado: "#15803d",
  revisar: "#b45309",
  rechazado: "#be2d22",
};

const ETIQUETAS_CLASIFICACION = {
  validado: "Validado",
  revisar: "Revisar",
  rechazado: "Rechazado",
};

const CONFIG_GRAFICO_LEVEY = {
  valor: { label: "Insulina (µUI/mL)", color: "#5b3ec8" },
};

const formatoDecimal = (valor, decimales = 2) =>
  valor.toFixed(decimales).replace(".", ",");

const DATOS_LEVEY = Z_FICTICIOS.map((z, indice) => {
  const fecha = new Date(2026, 8, 11 + indice); // desde el 11/09 hasta el 02/10
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const valor = Number((MEDIA_INSULINA + z * DE_INSULINA).toFixed(2));
  const { clasificacion, z: zCalculado } = clasificarValidacion(valor, {
    media: MEDIA_INSULINA,
    sd: DE_INSULINA,
  });

  return {
    indice: indice + 1,
    fecha: `${dia}/${mes}`,
    valor,
    z: Number(zCalculado.toFixed(2)),
    clasificacion,
    validadoPor: "y6", // Usuario ficticio de validación (mismo de Registro QC).
  };
});

const CONTEO_CLASIFICACION = DATOS_LEVEY.reduce(
  (acumulado, punto) => {
    acumulado[punto.clasificacion] += 1;
    return acumulado;
  },
  { validado: 0, revisar: 0, rechazado: 0 },
);

const CV_INSULINA = (DE_INSULINA / MEDIA_INSULINA) * 100;

const RESUMEN_QC = [
  { etiqueta: "Media", valor: formatoDecimal(MEDIA_INSULINA) },
  { etiqueta: "DE", valor: formatoDecimal(DE_INSULINA) },
  { etiqueta: "CV", valor: `${formatoDecimal(CV_INSULINA, 1)}%` },
  { etiqueta: "Puntos", valor: String(DATOS_LEVEY.length) },
];

// ------------------- Historial de resultados (solo un nivel) -------------------
// Estadística acumulada corrida a corrida (media y DE acumuladas, CV y sesgo
// del día), al estilo del "Registro QC" pero en modo solo lectura: una fila
// por corrida, sin inputs ni acciones. La primera corrida parte de los valores
// asignados del lote.
const ESTADISTICAS_ACUMULADAS = DATOS_LEVEY.map((punto, indice, serie) => {
  const valores = serie.slice(0, indice + 1).map((p) => p.valor);
  const cantidad = valores.length;
  const media = valores.reduce((a, v) => a + v, 0) / cantidad;
  const varianza =
    cantidad > 1
      ? valores.reduce((a, v) => a + (v - media) ** 2, 0) / (cantidad - 1)
      : DE_INSULINA ** 2;
  const de = Math.sqrt(varianza);
  const cv = (de / media) * 100;
  const sesgo = ((punto.valor - media) / media) * 100;

  return { ...punto, media, de, cv, sesgo };
});

const HISTORIAL_NIVEL = ESTADISTICAS_ACUMULADAS.map((fila, indice) => {
  const previa = ESTADISTICAS_ACUMULADAS[indice - 1];

  // Regla Westgard disparada por el punto (misma lógica que evaluateSeries):
  // fuera de ±3DE -> 1-3s, fuera de ±2DE -> 1-2s, dentro -> sin reglas.
  const regla = Math.abs(fila.z) > 3 ? "1-3s" : Math.abs(fila.z) > 2 ? "1-2s" : "—";

  return {
    ...fila,
    regla,
    // Solo la corrida rechazada lleva acción correctiva; el resto queda sin.
    accionCorrectiva:
      fila.clasificacion === "rechazado" ? "Repetir control y notificar al supervisor." : null,
    // Observación sugerida por el motor Westgard; si no hay, "No aplica".
    observacion: COMENTARIOS_SUGERIDOS[fila.clasificacion] ?? "No aplica",
    mediaPrevio: previa?.media ?? MEDIA_INSULINA,
    dePrevio: previa?.de ?? DE_INSULINA,
    cvPrevio: previa?.cv ?? CV_INSULINA,
    sesgoPrevio: previa?.sesgo ?? ((DATOS_LEVEY[0].valor - MEDIA_INSULINA) / MEDIA_INSULINA) * 100,
    fechaCompleta: `${fila.fecha}/2026`,
  };
}).reverse(); // La corrida más reciente arriba, como un historial.

const ULTIMA_CORRIDA = HISTORIAL_NIVEL[0];

// Tonos de la clasificación Westgard (verde / naranja / rojo del tema).
const TONO_CLASIFICACION = {
  validado: "text-status-ok",
  revisar: "text-status-warn",
  rechazado: "text-status-alert",
};

// "+0,8 %" / "−0,5 %": mismo formato de sesgo que usa Registro QC.
const formatoPorcentaje = (valor) =>
  `${valor > 0 ? "+" : valor < 0 ? "−" : ""}${formatoDecimal(Math.abs(valor), 1)} %`;

// Celda de estadística con el valor actual y el acumulado previo debajo
// (misma disposición de dos líneas que la tabla de Registro QC).
function CeldaEstadistica({ valor, valorPrevio }) {
  return (
    <td className="px-2 py-4 align-top">
      <p className="text-[12px] font-semibold tabular-nums text-ink">{valor}</p>
      <p className="mt-1 whitespace-nowrap text-[10px] leading-4 tabular-nums text-ink-faint">{valorPrevio}</p>
    </td>
  );
}

// Líneas de referencia (media y límites ±1/2/3 DE) con su etiqueta.
const LINEAS_REFERENCIA = [
  { y: MEDIA_INSULINA, etiqueta: "Media", color: "#1d1d1f", trazo: null, ancho: 1.5 },
  { y: MEDIA_INSULINA + DE_INSULINA, etiqueta: "+1DE", color: "#a1a1a6", trazo: "5 4", ancho: 1 },
  { y: MEDIA_INSULINA - DE_INSULINA, etiqueta: "-1DE", color: "#a1a1a6", trazo: "5 4", ancho: 1 },
  { y: MEDIA_INSULINA + 2 * DE_INSULINA, etiqueta: "+2DE", color: "#b45309", trazo: "5 4", ancho: 1 },
  { y: MEDIA_INSULINA - 2 * DE_INSULINA, etiqueta: "-2DE", color: "#b45309", trazo: "5 4", ancho: 1 },
  { y: MEDIA_INSULINA + 3 * DE_INSULINA, etiqueta: "+3DE", color: "#be2d22", trazo: "5 4", ancho: 1 },
  { y: MEDIA_INSULINA - 3 * DE_INSULINA, etiqueta: "-3DE", color: "#be2d22", trazo: "5 4", ancho: 1 },
];

// Punto del gráfico coloreado según la clasificación Westgard del resultado.
function PuntoLevey({ cx, cy, payload }) {
  if (cx == null || cy == null) {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={payload.clasificacion === "rechazado" ? 5 : 4}
      fill={COLOR_POR_CLASIFICACION[payload.clasificacion]}
      stroke="#ffffff"
      strokeWidth={1.5}
    />
  );
}

// Tooltip propio del Levey-Jennings: encabezado con la corrida, filas
// alineadas de resultado y desvío, y pie con el estado Westgard + quién validó.
function ContenidoTooltipLevey({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const punto = payload[0].payload;
  const color = COLOR_POR_CLASIFICACION[punto.clasificacion];
  const desvio = `${punto.z > 0 ? "+" : ""}${formatoDecimal(punto.z)}`;

  return (
    <div className="min-w-[11rem] rounded-lg border border-line bg-white px-3 py-2.5 text-xs shadow-xl">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
        Corrida #{punto.indice} · {punto.fecha}
      </p>

      <div className="mt-2 grid gap-1.5">
        <p className="flex items-baseline justify-between gap-4">
          <span className="text-[11px] text-ink-muted">Resultado</span>
          <span className="font-mono text-[12px] font-semibold tabular-nums text-ink">
            {formatoDecimal(punto.valor)}{" "}
            <span className="text-[10px] font-normal text-ink-muted">µUI/mL</span>
          </span>
        </p>
        <p className="flex items-baseline justify-between gap-4">
          <span className="text-[11px] text-ink-muted">Desvío</span>
          <span className="font-mono text-[12px] font-semibold tabular-nums" style={{ color }}>
            {desvio} <span className="text-[10px] font-normal text-ink-muted">DE</span>
          </span>
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 border-t border-line pt-1.5">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
          <span className="text-[11px] font-semibold" style={{ color }}>
            {ETIQUETAS_CLASIFICACION[punto.clasificacion]}
          </span>
        </span>
        <span className="text-[10px] text-ink-faint">
          Validó <span className="font-semibold text-ink-muted">{punto.validadoPor}</span>
        </span>
      </div>
    </div>
  );
}

export default function PaginaHistorialControl() {
  return (
    <div className="min-h-dvh bg-canvas px-4 pb-8 pt-5 text-ink sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
        <HistorialControles nombreControl="Bio-Rad Insulina" lote="H909937" />

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Link
            href="/LeveyDashboardClientes/analisisCalidad/analitosControlados"
            className={`inline-flex h-9 w-fit shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line bg-white px-3.5 text-xs font-semibold text-ink-muted shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:border-status-info/40 hover:bg-status-info-soft hover:text-status-info active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info motion-reduce:transition-none`}
          >
            <ArrowLeft aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={1.8} />
            Volver a Analitos Controlados
          </Link>
        </div>
      </div>

      {/* ======================= GRÁFICO LEVEY-JENNINGS ======================= */}
      <section
        aria-label="Gráfico Levey-Jennings del control"
        className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-[0_4px_18px_rgb(15_23_42_/_0.04)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">Gráfico Levey-Jennings</h2>
            <p className="mt-0.5 text-[13px] font-semibold text-status-info">
              Insulina · Nivel Normal (µUI/mL) · Últimos 30 días
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {RESUMEN_QC.map((stat) => (
              <span
                key={stat.etiqueta}
                className="inline-flex items-baseline gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink-muted"
              >
                {stat.etiqueta}
                <span className="font-mono text-[12px] font-semibold tabular-nums text-ink">
                  {stat.valor}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="px-2 py-4 sm:px-4">
          {/* Scroll horizontal: cada punto ocupa ~40px compactos. El gráfico
              usa el ancho disponible y recién crece (y scrollea) cuando la
              cantidad de corridas supera ese ancho, para ver más datos. */}
          <div className="overflow-x-auto">
          <ChartContainer
            config={CONFIG_GRAFICO_LEVEY}
            className="h-[340px] w-full sm:h-[380px]"
            style={{ minWidth: `${DATOS_LEVEY.length * 40}px` }}
          >
            <LineChart data={DATOS_LEVEY} margin={{ top: 10, right: 46, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#ececf0" />
              <XAxis
                dataKey="fecha"
                tickLine={false}
                axisLine={{ stroke: "#e5e5ea" }}
                tickMargin={8}
                minTickGap={24}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                domain={[DOMINIO_INFERIOR, DOMINIO_SUPERIOR]}
                ticks={[
                  MEDIA_INSULINA - 3 * DE_INSULINA,
                  MEDIA_INSULINA - 2 * DE_INSULINA,
                  MEDIA_INSULINA - DE_INSULINA,
                  MEDIA_INSULINA,
                  MEDIA_INSULINA + DE_INSULINA,
                  MEDIA_INSULINA + 2 * DE_INSULINA,
                  MEDIA_INSULINA + 3 * DE_INSULINA,
                ]}
                tickFormatter={(valor) => formatoDecimal(valor, 1)}
                width={40}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <ChartTooltip
                cursor={{ stroke: "#d2d2d7", strokeDasharray: "4 4" }}
                content={<ContenidoTooltipLevey />}
              />

              {/* Zonas de control: verde ±2DE, naranja 2-3DE, rojo fuera de 3DE */}
              <ReferenceArea
                y1={MEDIA_INSULINA - 2 * DE_INSULINA}
                y2={MEDIA_INSULINA + 2 * DE_INSULINA}
                fill="#e4f4ea"
                fillOpacity={0.5}
                stroke="none"
              />
              <ReferenceArea
                y1={MEDIA_INSULINA + 2 * DE_INSULINA}
                y2={MEDIA_INSULINA + 3 * DE_INSULINA}
                fill="#fdf0df"
                fillOpacity={0.55}
                stroke="none"
              />
              <ReferenceArea
                y1={MEDIA_INSULINA - 3 * DE_INSULINA}
                y2={MEDIA_INSULINA - 2 * DE_INSULINA}
                fill="#fdf0df"
                fillOpacity={0.55}
                stroke="none"
              />
              <ReferenceArea
                y1={MEDIA_INSULINA + 3 * DE_INSULINA}
                y2={DOMINIO_SUPERIOR}
                fill="#fce8e6"
                fillOpacity={0.55}
                stroke="none"
              />
              <ReferenceArea
                y1={DOMINIO_INFERIOR}
                y2={MEDIA_INSULINA - 3 * DE_INSULINA}
                fill="#fce8e6"
                fillOpacity={0.55}
                stroke="none"
              />

              {/* Media y límites ±1/2/3 DE */}
              {LINEAS_REFERENCIA.map((linea) => (
                <ReferenceLine
                  key={linea.etiqueta}
                  y={linea.y}
                  stroke={linea.color}
                  strokeWidth={linea.ancho}
                  strokeDasharray={linea.trazo ?? undefined}
                  label={{
                    value: linea.etiqueta,
                    position: "right",
                    fill: linea.color,
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              ))}

              <Line
                type="monotone"
                dataKey="valor"
                stroke="#c9c9cf"
                strokeWidth={1.5}
                dot={<PuntoLevey />}
                activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
          </div>

          {/* Leyenda de estados Westgard con conteo de corridas */}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3 px-2 pb-1 sm:px-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {Object.entries(ETIQUETAS_CLASIFICACION).map(([clave, etiqueta]) => (
                <span
                  key={clave}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-muted"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: COLOR_POR_CLASIFICACION[clave] }}
                    aria-hidden="true"
                  />
                  {etiqueta}
                  <span className="font-mono font-semibold tabular-nums text-ink-faint">
                    {CONTEO_CLASIFICACION[clave]}
                  </span>
                </span>
              ))}
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
              Clasificación Westgard
            </p>
          </div>
        </div>
      </section>
      {/* ===================== FIN GRÁFICO LEVEY-JENNINGS ===================== */}

      {/* ================ HISTORIAL DE RESULTADOS (SOLO LECTURA) ================
          Tabla del Registro QC reducida a un solo nivel (Insulina · Nivel
          Normal): una fila por corrida con sus valores históricos. Sin inputs
          ni botones; la primera línea de cada celda es el valor de la corrida
          y la segunda, el acumulado previo. */}
      <section
        aria-label="Historial de resultados del nivel"
        className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]"
      >
        <div className="flex min-w-[900px] flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">Historial de resultados</h2>
            <p className="mt-0.5 text-[13px] font-semibold text-status-info">
              Insulina · Nivel Normal (µUI/mL) · Lote H909937 · Solo lectura
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-baseline gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink-muted">
              <span className="font-mono text-[12px] font-semibold tabular-nums text-ink">
                {DATOS_LEVEY.length}
              </span>
              corridas
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink-muted">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: COLOR_POR_CLASIFICACION[ULTIMA_CORRIDA.clasificacion] }}
                aria-hidden="true"
              />
              Última {ULTIMA_CORRIDA.fecha} ·{" "}
              <span className={`font-semibold ${TONO_CLASIFICACION[ULTIMA_CORRIDA.clasificacion]}`}>
                {ETIQUETAS_CLASIFICACION[ULTIMA_CORRIDA.clasificacion]}
              </span>
            </span>
          </div>
        </div>

        <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[7%]" />
            <col className="w-[8%]" />
            <col className="w-[6%]" />
            <col className="w-[7%]" />
            <col className="w-[7%]" />
            <col className="w-[7%]" />
            <col className="w-[7%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[15%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-[#f8f9fb]">
              <th scope="col" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Fecha</th>
              <th scope="col" title="Valor medido en la corrida" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Valor</th>
              <th scope="col" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Unidad</th>
              <th scope="col" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Media</th>
              <th scope="col" title="Desviación estándar acumulada" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">D.E</th>
              <th scope="col" title="Coeficiente de variación" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">C.V</th>
              <th scope="col" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Sesgo</th>
              <th scope="col" title="Usuario que validó la corrida" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Validó</th>
              <th scope="col" title="Clasificación Westgard de la corrida" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Estado</th>
              <th scope="col" title="Acción correctiva registrada para la corrida" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Acción correctiva</th>
              <th scope="col" title="Observación registrada en la corrida" className="px-2.5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {HISTORIAL_NIVEL.map((fila) => (
              <tr
                key={fila.indice}
                className={`border-b border-line transition-colors duration-200 ${EASE_PREMIUM} last:border-b-0 hover:bg-[#f8f9fb]`}
              >
                <td className="px-2 py-4 align-top">
                  <p className="text-[13px] font-semibold tabular-nums tracking-[-0.01em] text-ink">{fila.fecha}</p>
                  <span className="mt-1.5 block whitespace-nowrap text-[8px] font-medium uppercase leading-none tracking-[0.04em] text-status-info">
                    #{fila.indice}
                  </span>
                </td>
                <td className="px-2 py-4 align-top">
                  <p className="text-[12px] font-semibold tabular-nums text-ink">{formatoDecimal(fila.valor)}</p>
                  <p className="mt-1 whitespace-nowrap text-[10px] leading-4 tabular-nums text-ink-muted">
                    {fila.z > 0 ? "+" : ""}
                    {formatoDecimal(fila.z)} DE
                  </p>
                </td>
                <td className="px-2 py-4 align-top">
                  <p className="text-[11px] font-medium text-ink-muted">µUI/mL</p>
                </td>
                <CeldaEstadistica valor={formatoDecimal(fila.media)} valorPrevio={formatoDecimal(fila.mediaPrevio)} />
                <CeldaEstadistica valor={formatoDecimal(fila.de)} valorPrevio={formatoDecimal(fila.dePrevio)} />
                <CeldaEstadistica
                  valor={`${formatoDecimal(fila.cv, 1)} %`}
                  valorPrevio={`${formatoDecimal(fila.cvPrevio, 1)} %`}
                />
                <CeldaEstadistica valor={formatoPorcentaje(fila.sesgo)} valorPrevio={formatoPorcentaje(fila.sesgoPrevio)} />
                <td className="px-2 py-4 align-top">
                  <p className="text-[12px] font-medium text-ink">{fila.validadoPor}</p>
                  <p className="mt-1 whitespace-nowrap text-[10px] leading-4 tabular-nums text-ink-faint">
                    {fila.fechaCompleta}
                  </p>
                </td>
                <td className="px-2 py-4 align-top">
                  <p className={`text-[11px] font-medium ${TONO_CLASIFICACION[fila.clasificacion]}`}>
                    {ETIQUETAS_CLASIFICACION[fila.clasificacion]}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-[10px] leading-4 font-medium tabular-nums text-ink-faint">
                    {fila.regla}
                  </p>
                </td>
                <td className="px-2 py-4 align-top">
                  {fila.accionCorrectiva ? (
                    <p className="text-[11px] font-medium leading-4 text-ink">{fila.accionCorrectiva}</p>
                  ) : (
                    <p className="text-[10px] leading-4 text-ink-faint">Sin acciones correctivas</p>
                  )}
                </td>
                <td className="px-2 py-4 align-top">
                  <p
                    className={`text-[11px] leading-4 ${
                      fila.clasificacion === "validado" ? "text-ink-faint" : "font-medium text-ink"
                    }`}
                  >
                    {fila.observacion}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {/* ================== FIN HISTORIAL DE RESULTADOS ================== */}
    </div>
  );
}
