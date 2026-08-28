import { Activity, ArrowDownRight, ArrowUpRight, Building2, CheckCircle2, ChevronRight, CircleAlert, Clock3, FlaskConical, MoreHorizontal, ShieldCheck, TriangleAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PruebaConexionClerk from "./components/PruebaConexionClerk";

const indicadoresDemo = [
  { titulo: "Controles realizados", valor: "1.284", detalle: "+12,8% vs. mes anterior", icono: Activity, tono: "bg-status-ok-soft text-status-ok", tendencia: "positiva" },
  { titulo: "Controles aceptados", valor: "96,8%", detalle: "Meta institucional: 95%", icono: ShieldCheck, tono: "bg-status-info-soft text-status-info", tendencia: "positiva" },
  { titulo: "Alertas pendientes", valor: "07", detalle: "3 requieren revisión hoy", icono: TriangleAlert, tono: "bg-status-warn-soft text-status-warn", tendencia: "atencion" },
  { titulo: "Laboratorios activos", valor: "24", detalle: "2 incorporados este trimestre", icono: Building2, tono: "bg-surface-muted text-ink-muted", tendencia: "neutral" },
];

const rendimientoLaboratoriosDemo = [
  { nombre: "Laboratorio Central", ciudad: "Santiago", controles: 342, aceptacion: "98,5%", progreso: "w-[98.5%]", estado: "Estable" },
  { nombre: "Hospital Regional", ciudad: "Valparaíso", controles: 286, aceptacion: "96,9%", progreso: "w-[96.9%]", estado: "Estable" },
  { nombre: "Clínica San José", ciudad: "Concepción", controles: 218, aceptacion: "94,7%", progreso: "w-[94.7%]", estado: "En revisión" },
  { nombre: "Laboratorio Norte", ciudad: "Antofagasta", controles: 194, aceptacion: "97,4%", progreso: "w-[97.4%]", estado: "Estable" },
];

const actividadDemo = [
  { titulo: "Regla Westgard 1-3s detectada", detalle: "Glucosa · Nivel 2 · Clínica San José", hora: "Hace 12 min", tipo: "alerta" },
  { titulo: "Corrida QC validada", detalle: "Hemoglobina · Nivel 1 · Laboratorio Central", hora: "Hace 28 min", tipo: "correcto" },
  { titulo: "Nuevo lote registrado", detalle: "Control BioRad · Lote 8021", hora: "Hace 1 h", tipo: "info" },
  { titulo: "Revisión de control completada", detalle: "TSH · Nivel 3 · Hospital Regional", hora: "Hace 2 h", tipo: "correcto" },
];

const distribucionDemo = [
  { etiqueta: "Aceptados", porcentaje: "96,8%", barra: "w-[96.8%] bg-status-ok" },
  { etiqueta: "En revisión", porcentaje: "2,1%", barra: "w-[2.1%] bg-status-warn" },
  { etiqueta: "Rechazados", porcentaje: "1,1%", barra: "w-[1.1%] bg-status-alert" },
];

function estadoActividad(tipo) {
  if (tipo === "alerta") return "bg-status-alert-soft text-status-alert";
  if (tipo === "correcto") return "bg-status-ok-soft text-status-ok";
  return "bg-status-info-soft text-status-info";
}

export default function PaginaInicio() {
  return (
    <div className="min-h-screen bg-canvas">
      <PruebaConexionClerk />
      <nav className="!hidden" aria-label="Navegación principal">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-ink p-1.5"><Image src="/logopequeñolevey.png" alt="Levey QC" width={512} height={512} priority className="size-full object-contain" /></div>
            <div><p className="text-sm font-bold tracking-[-0.03em] text-ink">Levey<span className="text-status-ok">QC</span></p><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-faint">Quality control</p></div>
          </div>
          <div className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white">Inicio</Link>
            <Link href="/LaboratorioClinico" className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">Laboratorios</Link>
            <span className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted">Análisis QC</span>
            <span className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted">Controles</span>
            <span className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted">Gestión</span>
            <span className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted">Reportes</span>
          </div>
          <div className="flex items-center gap-2.5"><div className="hidden items-center gap-2 rounded-full bg-status-ok-soft px-2.5 py-1.5 text-[11px] font-semibold text-status-ok sm:flex"><span className="size-1.5 rounded-full bg-status-ok" /> Red operativa</div><div className="flex size-8 items-center justify-center rounded-full bg-surface-muted text-xs font-bold text-ink-muted">NC</div></div>
        </div>
      </nav>
    <main className="px-4 py-5 sm:px-7 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint"><span className="size-2 rounded-full bg-status-ok" />Operación en línea</div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Panorama de calidad</h1>
            <p className="mt-2 text-sm text-ink-muted">Resumen ejecutivo de la red Levey QC · Agosto 2026</p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm shadow-[0_1px_2px_rgb(0_0_0_/_0.03)]"><div className="flex size-8 items-center justify-center rounded-md bg-surface-muted text-ink-muted"><Clock3 className="size-4" /></div><div><p className="text-[11px] font-medium text-ink-faint">Última actualización</p><p className="font-semibold text-ink">Hoy, 09:42</p></div></div>
        </header>

        <section aria-label="Indicadores principales" className="grid gap-3 py-6 sm:grid-cols-2 xl:grid-cols-4">
          {indicadoresDemo.map((indicador) => {
            const Icono = indicador.icono;
            const esAtencion = indicador.tendencia === "atencion";
            return <article key={indicador.titulo} className="group rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0_/_0.02)] transition duration-200 hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div className={`flex size-10 items-center justify-center rounded-lg ${indicador.tono}`}><Icono className="size-5" strokeWidth={1.8} /></div><MoreHorizontal className="size-5 text-ink-faint" /></div><p className="mt-5 text-[13px] font-medium text-ink-muted">{indicador.titulo}</p><div className="mt-1.5 flex items-baseline gap-2"><p className="text-[30px] font-semibold tracking-[-0.045em] text-ink">{indicador.valor}</p>{esAtencion ? <ArrowDownRight className="size-4 text-status-warn" /> : <ArrowUpRight className="size-4 text-status-ok" />}</div><p className={`mt-1.5 text-xs ${esAtencion ? "text-status-warn" : "text-ink-muted"}`}>{indicador.detalle}</p></article>;
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
          <article className="rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]"><div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6"><div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Rendimiento por laboratorio</p><p className="mt-1 text-xs text-ink-muted">Controles procesados y tasa de aceptación del período</p></div><span className="hidden items-center gap-1 text-xs font-semibold text-ink-muted sm:flex">Ver detalle <ChevronRight className="size-3.5" /></span></div><div className="overflow-x-auto"><table className="min-w-[650px] w-full text-left"><thead className="border-b border-line bg-surface-muted/70 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint"><tr><th className="px-5 py-3.5 sm:px-6">Laboratorio</th><th className="px-4 py-3.5">Controles</th><th className="px-4 py-3.5">Tasa de aceptación</th><th className="px-5 py-3.5 text-right sm:px-6">Estado</th></tr></thead><tbody className="divide-y divide-line">{rendimientoLaboratoriosDemo.map((laboratorio) => { const revisar = laboratorio.estado === "En revisión"; return <tr key={laboratorio.nombre} className="text-sm transition hover:bg-surface-muted/50"><td className="px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex size-8 items-center justify-center rounded-md bg-surface-muted text-ink-muted"><FlaskConical className="size-4" /></div><div><p className="font-semibold text-ink">{laboratorio.nombre}</p><p className="mt-0.5 text-xs text-ink-muted">{laboratorio.ciudad}</p></div></div></td><td className="px-4 py-4 font-semibold text-ink">{laboratorio.controles}</td><td className="px-4 py-4"><div className="flex min-w-[155px] items-center gap-2.5"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted"><div className={`h-full rounded-full ${revisar ? "bg-status-warn" : "bg-status-ok"} ${laboratorio.progreso}`} /></div><span className="text-xs font-semibold text-ink">{laboratorio.aceptacion}</span></div></td><td className="px-5 py-4 text-right sm:px-6"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${revisar ? "bg-status-warn-soft text-status-warn" : "bg-status-ok-soft text-status-ok"}`}>{laboratorio.estado}</span></td></tr>; })}</tbody></table></div></article>
          <article className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0_/_0.02)] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Distribución de resultados</p><p className="mt-1 text-xs text-ink-muted">1.284 controles en el período</p></div><div className="flex size-9 items-center justify-center rounded-lg bg-status-ok-soft text-status-ok"><CheckCircle2 className="size-[18px]" /></div></div><div className="mt-7 space-y-5">{distribucionDemo.map((resultado) => <div key={resultado.etiqueta}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium text-ink-muted">{resultado.etiqueta}</span><span className="font-semibold text-ink">{resultado.porcentaje}</span></div><div className="h-2 overflow-hidden rounded-full bg-surface-muted"><div className={`h-full rounded-full ${resultado.barra}`} /></div></div>)}</div><div className="mt-7 border-t border-line pt-4"><p className="text-xs leading-5 text-ink-muted"><span className="font-semibold text-ink">Indicador clave:</span> la aceptación global se mantiene 1,8 puntos sobre la meta institucional.</p></div></article>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]"><article className="rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]"><div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6"><div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Actividad reciente</p><p className="mt-1 text-xs text-ink-muted">Eventos que requieren trazabilidad de la red</p></div><span className="text-xs font-semibold text-ink-muted">Hoy</span></div><div className="divide-y divide-line">{actividadDemo.map((actividad) => <div key={actividad.titulo} className="flex gap-3 px-5 py-4 sm:px-6"><div className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${estadoActividad(actividad.tipo)}`}>{actividad.tipo === "alerta" ? <CircleAlert className="size-4" /> : actividad.tipo === "correcto" ? <CheckCircle2 className="size-4" /> : <FlaskConical className="size-4" />}</div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-ink">{actividad.titulo}</p><p className="mt-0.5 truncate text-xs text-ink-muted">{actividad.detalle}</p></div><span className="shrink-0 pt-0.5 text-[11px] text-ink-faint">{actividad.hora}</span></div>)}</div></article><article className="rounded-xl border border-ink bg-ink p-5 text-white shadow-[0_8px_22px_rgb(29_29_31_/_0.12)] sm:p-6"><div className="flex size-10 items-center justify-center rounded-lg bg-white/10"><TriangleAlert className="size-5 text-[#ffca89]" /></div><p className="mt-6 text-lg font-semibold tracking-[-0.025em]">07 alertas requieren atención</p><p className="mt-2 text-sm leading-6 text-white/60">Tres incidencias críticas están pendientes de revisión antes del cierre operativo de hoy.</p><div className="mt-6 flex items-center gap-2 text-xs font-semibold text-white"><span className="size-2 rounded-full bg-[#ffca89]" /> Prioridad alta</div></article></section>
      </div>
    </main>
    </div>
  );
}
