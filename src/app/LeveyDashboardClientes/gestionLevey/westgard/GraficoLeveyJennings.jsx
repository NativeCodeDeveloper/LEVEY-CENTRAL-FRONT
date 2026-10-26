// Gráfico Levey-Jennings demostrativo: SVG estático dibujado a mano, sin
// librerías. Muestra la media objetivo, las líneas de ±1/±2/±3 DE y los puntos
// de control del ejemplo de una regla (datos 100 % estáticos por props, sin
// lógica estadística real).
//
// Color con rol de estado (nunca identidad de serie): gris = en control,
// ámbar = advertencia, rojo = rechazo. La posición del punto dentro de las
// zonas es la codificación principal; la leyenda y el tooltip de cada punto
// nombran el estado en texto.

export function formatearZ(z) {
  const magnitud = Math.abs(z).toFixed(1);
  if (z > 0) return `+${magnitud}`;
  if (z < 0) return `−${magnitud}`;
  return magnitud;
}

const ANCHO = 560;
const ALTO = 250;
const MARGEN_IZQ = 40;
const MARGEN_DER = 14;
const MARGEN_SUP = 12;
const MARGEN_INF = 34;
const Z_MAX = 4;

const COLOR_EN_CONTROL = "#64748b";
const COLOR_ADVERTENCIA = "#d97706";
const COLOR_RECHAZO = "#e11d48";

function colorPorZ(z) {
  const magnitud = Math.abs(z);
  if (magnitud >= 3) return COLOR_RECHAZO;
  if (magnitud >= 2) return COLOR_ADVERTENCIA;
  return COLOR_EN_CONTROL;
}

const LEYENDA = [
  { color: COLOR_EN_CONTROL, texto: "En control · |Z| < 2" },
  { color: COLOR_ADVERTENCIA, texto: "Advertencia · 2 ≤ |Z| < 3" },
  { color: COLOR_RECHAZO, texto: "Rechazo · |Z| ≥ 3" },
];

export default function GraficoLeveyJennings({ zScores }) {
  const total = zScores.length;
  const anchoUtil = ANCHO - MARGEN_IZQ - MARGEN_DER;
  const altoUtil = ALTO - MARGEN_SUP - MARGEN_INF;
  const xEn = (i) => (total === 1 ? MARGEN_IZQ + anchoUtil / 2 : MARGEN_IZQ + (i * anchoUtil) / (total - 1));
  const yEn = (z) => MARGEN_SUP + ((Z_MAX - z) * altoUtil) / (Z_MAX * 2);

  const zonas = [3, 2, 1];
  const puntos = zScores.map((z, i) => ({ x: xEn(i), y: yEn(z), z }));
  const trazo = puntos.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label="Gráfico Levey-Jennings del ejemplo de la regla" className="h-auto w-full">
        {/* Zonas acumulativas: cada banda apila su tono, más oscuro hacia el centro */}
        {zonas.map((de) => (
          <rect key={`zona-${de}`} x={MARGEN_IZQ} y={yEn(de)} width={anchoUtil} height={yEn(-de) - yEn(de)} fill="#334155" opacity={0.05} />
        ))}

        {/* Líneas de DE (recesivas, punteadas) y media objetivo (sólida) */}
        {zonas.map((de) => (
          <line key={`limite-${de}`} x1={MARGEN_IZQ} x2={ANCHO - MARGEN_DER} y1={yEn(de)} y2={yEn(de)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 4" />
        ))}
        <line x1={MARGEN_IZQ} x2={ANCHO - MARGEN_DER} y1={yEn(0)} y2={yEn(0)} stroke="#94a3b8" strokeWidth={1.5} />

        {/* Rótulos del eje Z */}
        {[3, 2, 1, 0, -1, -2, -3].map((v) => (
          <text key={`rotulo-${v}`} x={MARGEN_IZQ - 8} y={yEn(v) + 3} textAnchor="end" fontSize={9.5} fill="#94a3b8">
            {formatearZ(v)}
          </text>
        ))}

        {/* Trazo y puntos de control */}
        {total > 1 ? <polyline points={trazo} fill="none" stroke="#94a3b8" strokeWidth={2} /> : null}
        {puntos.map((p, i) => (
          <circle key={`punto-${i}`} cx={p.x} cy={p.y} r={4} fill={colorPorZ(p.z)} stroke="#ffffff" strokeWidth={1.5}>
            <title>{`Corrida ${i + 1}: Z ${formatearZ(p.z)}`}</title>
          </circle>
        ))}

        <text x={MARGEN_IZQ} y={ALTO - 12} fontSize={9.5} fill="#94a3b8">
          Desviaciones estándar (DE) respecto de la media objetivo
        </text>
        <text x={ANCHO - MARGEN_DER} y={ALTO - 12} fontSize={9.5} fill="#94a3b8" textAnchor="end">
          Corridas consecutivas →
        </text>
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {LEYENDA.map((item) => (
          <span key={item.texto} className="inline-flex items-center gap-1.5 text-[10px] font-medium text-ink-muted">
            <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
            {item.texto}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
