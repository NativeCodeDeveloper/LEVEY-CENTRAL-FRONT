"use client";

import {UserButton, useOrganization, useUser, useAuth} from "@clerk/nextjs";
import Link from "next/link";
import {useState} from "react";
import ContadorCelulas from "./analisisCalidad/controlDePares/ContadorCelulas";

function IconoEdificio() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M2 21h20M8 7h4M8 11h4M8 15h4M16 9h2M16 13h2M16 17h2" />
    </svg>
  );
}

export default function PaginaDashboardClientes() {
  const [modalAvisoAbierto, setModalAvisoAbierto] = useState(false);
  const [contadorLibreAbierto, setContadorLibreAbierto] = useState(false);
  const { isLoaded: usuarioCargado, user } = useUser();
  const { isLoaded: institucionCargada, organization } = useOrganization();


    const API = process.env.NEXT_PUBLIC_API_URL;

    const {
        getToken,
        userId
    } = useAuth();



    async function probarEndPoint() {
        try {

            const token = await getToken();

            const res = await fetch(`${API}/informacionlaboratorio`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });



            if (!res.ok) {
                return alert(
                    "bad request"
                );
            }

           const respuestaBackend = await res.json();

            if(respuestaBackend.success) {
                return alert(`
                INFORMACION CARGADA CORRECTAMENTE
               ${respuestaBackend.data[0].nombre}}
                `);
            }else{
                return alert(`
                problema:
               ${respuestaBackend.message}}
                `);
            }

        } catch (e) {

            console.error(e);

            return alert(
                `Error ejecutando prueba: ${e.message}`
            );
        }
    }

    const datosCargados = usuarioCargado && institucionCargada;
  const nombreUsuario = datosCargados ? user?.fullName || "Usuario autenticado" : "Cargando usuario...";
  const nombreInstitucion = datosCargados ? organization?.name || "Sin institución activa" : "Cargando institución...";
  return (
    <div className="min-h-dvh bg-[#f8f9fb]">
      <header className="border-b border-[#e5e7eb] bg-white/90">
        <div className="mx-auto flex min-h-20 max-w-[1560px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
              Tu espacio de trabajo
            </p>
            <p className="mt-1 truncate text-sm font-medium text-ink-muted">
              Inicio <span className="mx-2 text-ink-faint">/</span> Vista general
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 items-center gap-2.5 border-r border-[#e5e7eb] pr-4 sm:flex">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f0edff] text-[#6854c7]">
                <IconoEdificio />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-faint">
                  Institución activa
                </p>
                <p className="truncate text-sm font-semibold text-ink">
                  {nombreInstitucion}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2.5">
              <UserButton
                appearance={{
                  variables: { colorPrimary: "#6854c7" },
                  elements: {
                    avatarBox: "size-10 border border-[#e5e7eb] shadow-sm sm:size-11",
                    userButtonTrigger: "rounded-full focus:outline-none focus:ring-2 focus:ring-[#6854c7] focus:ring-offset-2",
                  },
                }}
              />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-faint">
                  Sesión activa
                </p>
                <p className="truncate text-sm font-semibold text-ink">
                  {nombreUsuario}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1560px] px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6854c7]">Comunicación interna</p>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.035em] text-ink sm:text-3xl">Información del Laboratorio</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => setModalAvisoAbierto(true)} type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#11141c] px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgb(17_20_28_/_0.16)] transition hover:-translate-y-0.5 hover:bg-[#252936] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6854c7]">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                Nuevo aviso
              </button>
              <button onClick={() => setContadorLibreAbierto(true)} type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line-strong bg-white px-5 text-sm font-semibold text-ink shadow-[0_4px_14px_rgb(17_20_28_/_0.08)] transition hover:-translate-y-0.5 hover:border-[#9eabb2] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#6854c7]">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg>
                Contador de células
              </button>
              <div className="group relative inline-flex">
                <span className="pointer-events-none absolute -inset-3 rounded-full bg-[#6854c7]/65 opacity-90 blur-xl motion-safe:animate-[pulse_2s_ease-in-out_infinite] transition duration-500 group-hover:opacity-100" />
                <button
                  onClick={()=>probarEndPoint()}
                  type="button"
                  className="relative isolate inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-ink p-px text-sm font-semibold text-white shadow-[0_0_32px_rgb(104_84_199_/_0.62),0_10px_24px_rgb(0_0_0_/_0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgb(104_84_199_/_0.82),0_14px_30px_rgb(0_0_0_/_0.24)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink active:translate-y-0"
                >
                  <span className="pointer-events-none absolute inset-[-220%] z-0 motion-safe:animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg,transparent_0deg,white_30deg,#a5b4fc_70deg,#6854c7_115deg,transparent_165deg)] opacity-95 transition duration-500 group-hover:opacity-100" />
                  <span className="relative z-10 inline-flex h-[42px] items-center justify-center gap-2 rounded-full bg-ink px-5">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 3h6M10 3v6.4L5.6 17a2.7 2.7 0 0 0 2.3 4h8.2a2.7 2.7 0 0 0 2.3-4L14 9.4V3" />
                      <path d="M8.2 15h7.6" />
                    </svg>
                    Iniciar Control de Calidad
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 space-y-4">
              {modalAvisoAbierto ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11141c]/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-nuevo-aviso">
                <div className="w-full max-w-xl rounded-[24px] border border-white/60 bg-white p-5 shadow-[0_30px_90px_rgb(17_20_28_/_0.35)] sm:p-7">
                  <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
                    <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6854c7]">Comunicación interna</p><h2 id="titulo-nuevo-aviso" className="mt-1.5 text-xl font-semibold tracking-[-0.025em] text-ink">Nuevo aviso</h2><p className="mt-1.5 text-sm text-ink-muted">Comparte información relevante con el equipo del laboratorio.</p></div>
                    <button onClick={() => setModalAvisoAbierto(false)} type="button" aria-label="Cerrar nuevo aviso" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition hover:bg-surface-muted hover:text-ink"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
                  </div>
                  <div className="mt-5 space-y-5">
                    <div><label htmlFor="contenido-aviso" className="text-xs font-semibold text-ink">Aviso</label><textarea id="contenido-aviso" name="contenidoAviso" rows="5" placeholder="Escribe el aviso para el equipo del laboratorio..." className="mt-2 w-full resize-none rounded-xl border border-line bg-[#fafafa] px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-[#6854c7] focus:ring-3 focus:ring-[#6854c7]/10" /></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label htmlFor="categoria-aviso" className="text-xs font-semibold text-ink">Área del laboratorio</label><select id="categoria-aviso" name="categoriaAviso" defaultValue="" className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-[#6854c7] focus:ring-3 focus:ring-[#6854c7]/10"><option value="" disabled>Selecciona un área</option><option>Química</option><option>Microbiología</option><option>Inmunología</option><option>Banco de sangre</option><option>Coordinación</option><option>Urgencias</option><option>Otros</option></select></div>
                      <div><label htmlFor="tipo-aviso" className="text-xs font-semibold text-ink">Tipo de aviso</label><select id="tipo-aviso" name="tipoAviso" defaultValue="" className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-[#6854c7] focus:ring-3 focus:ring-[#6854c7]/10"><option value="" disabled>Selecciona un tipo</option><option>Incidencia</option><option>Control de calidad</option><option>Aviso</option><option>Cambio de turno</option><option>Jefatura</option><option>Coordinación</option></select></div>
                      <div className="sm:col-span-2"><label htmlFor="urgencia-aviso" className="text-xs font-semibold text-ink">Grado de urgencia</label><select id="urgencia-aviso" name="urgenciaAviso" defaultValue="sin-urgencia" className="mt-2 min-h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-[#6854c7] focus:ring-3 focus:ring-[#6854c7]/10"><option value="sin-urgencia">Sin urgencia</option><option value="bajo">Bajo</option><option value="moderado">Moderado</option><option value="alto">Alto</option><option value="urgente">Urgente</option></select></div>
                    </div>
                  </div>
                  <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-line pt-5"><button onClick={() => setModalAvisoAbierto(false)} type="button" className="min-h-10 rounded-full border border-line px-4 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">Cancelar</button><button type="button" className="min-h-10 rounded-full bg-[#11141c] px-5 text-sm font-semibold text-white shadow-sm">Publicar aviso</button></div>
                </div>
              </div>
              ) : null}

              <div className="flex items-end justify-between gap-4 border-b border-line pb-3 pt-1">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-ink-faint">Bitácora interna</p>
                  <h2 className="mt-1 text-base font-semibold tracking-[-0.015em] text-ink">Novedades del laboratorio</h2>
                </div>
                <p className="hidden text-xs text-ink-muted sm:block">Actualizaciones del equipo</p>
              </div>

              <article className="rounded-xl border border-line bg-white px-5 py-5 shadow-[0_8px_24px_rgb(20_25_35_/_0.025)] sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f3f5] text-sm font-bold text-ink-muted">CR</span><div><p className="text-sm font-semibold text-ink">Camila Rojas</p><p className="mt-0.5 text-xs text-ink-muted">Bioquímica · Química clínica</p></div></div><time className="pt-0.5 text-xs text-ink-muted">Hoy · 07:40</time></div><div className="mt-4 border-t border-line pt-4"><span className="inline-flex flex-wrap items-center gap-1.5"><span className="rounded-md border border-[#f2cf89] bg-[#fff3d6] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a5700]">Inventario</span><span className="rounded-md border border-[#efb7b0] bg-[#fde8e5] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9c3128]">Prioridad alta</span></span><h3 className="mt-3 text-base font-semibold tracking-[-0.01em] text-ink">Reactivo de bilirrubina próximo a agotarse</h3><p className="mt-2 text-sm leading-6 text-ink-muted">Queda reactivo para aproximadamente dos corridas. Favor revisar el stock de respaldo y coordinar la reposición durante el turno de hoy.</p></div><details className="group mt-5 border-t border-line pt-4"><summary className="flex cursor-pointer list-none items-center gap-2 rounded-md py-1 text-left outline-none [&::-webkit-details-marker]:hidden focus-visible:ring-2 focus-visible:ring-[#6854c7]"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4 text-ink-muted" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 11.5a6.8 6.8 0 0 1-7 6.5 7.6 7.6 0 0 1-3.2-.7L5 19l1.2-3.4A6.2 6.2 0 0 1 5 12c0-3.6 3.1-6.5 7-6.5s8 2.4 8 6z" /></svg><p className="text-xs font-semibold text-ink">2 respuestas</p><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="ml-auto size-4 text-ink-faint transition-transform group-open:rotate-180" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m7 9 5 5 5-5" /></svg></summary><div className="mt-4 space-y-3 border-l border-line pl-4"><div className="flex gap-3 rounded-lg border border-[#d8e0e6] bg-[#e7edf1] p-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-ink-muted shadow-sm">JP</span><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"><p className="text-xs font-semibold text-ink">Javier Paredes</p><time className="text-[11px] text-ink-faint">Hace 18 min</time></div><p className="mt-1 text-sm leading-5 text-ink-muted">Revisé el inventario de respaldo. Tenemos un lote disponible para cubrir las corridas de la tarde.</p></div></div><div className="flex gap-3 rounded-lg border border-[#d8e0e6] bg-[#e7edf1] p-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-ink-muted shadow-sm">LS</span><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5"><p className="text-xs font-semibold text-ink">Laura Silva</p><time className="text-[11px] text-ink-faint">Hace 7 min</time></div><p className="mt-1 text-sm leading-5 text-ink-muted">Dejo solicitada la reposición con el proveedor. Confirmo la fecha de entrega apenas tenga respuesta.</p></div></div></div><div className="mt-5 flex items-center gap-3 rounded-lg border border-line bg-[#fafbfc] p-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e9edf1] text-[10px] font-bold text-ink-muted">TU</span><p className="min-w-0 flex-1 px-1 text-sm text-ink-faint">Escribe una respuesta…</p><span className="rounded-md bg-[#e9edf1] px-3 py-1.5 text-xs font-semibold text-ink-muted">Responder</span></div></details>
              </article>

              <article className="rounded-xl border border-line bg-white px-5 py-5 shadow-[0_8px_24px_rgb(20_25_35_/_0.025)] sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f3f5] text-sm font-bold text-ink-muted">AV</span><div><p className="text-sm font-semibold text-ink">Aracely Valderrama</p><p className="mt-0.5 text-xs text-ink-muted">Tecnóloga médica · Química</p></div></div><time className="pt-0.5 text-xs text-ink-muted">Ayer · 18:26</time></div><div className="mt-4 border-t border-line pt-4"><span className="rounded-md border border-[#d9cdf7] bg-[#f0edff] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5f4bac]">Equipo</span><p className="mt-3 text-sm leading-6 text-ink-muted">Se realizó la calibración del analizador de química. Los controles quedaron dentro de rango y el equipo está disponible para el turno siguiente.</p></div>
              </article>

              <article className="rounded-xl border border-line bg-white px-5 py-5 shadow-[0_8px_24px_rgb(20_25_35_/_0.025)] sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f3f5] text-sm font-bold text-ink-muted">MD</span><div><p className="text-sm font-semibold text-ink">Marcelo Díaz</p><p className="mt-0.5 text-xs text-ink-muted">Tecnólogo médico · Gasometría</p></div></div><time className="pt-0.5 text-xs text-ink-muted">Ayer · 00:12</time></div><div className="mt-4 border-t border-line pt-4"><span className="rounded-md border border-[#efb7b0] bg-[#fde8e5] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9c3128]">Incidencia LIS</span><h3 className="mt-3 text-base font-semibold tracking-[-0.01em] text-ink">Interfaz desconectada durante el turno de noche</h3><p className="mt-2 text-sm leading-6 text-ink-muted">La interfaz del LIS se desconectó en el área de gasometría. Se contactó al proveedor y quedó agendada la visita de un técnico durante el día de hoy.</p></div>
              </article>

              <article className="rounded-xl border border-line bg-white px-5 py-5 shadow-[0_8px_24px_rgb(20_25_35_/_0.025)] sm:px-6">
                <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#f1f3f5] text-sm font-bold text-ink-muted">PS</span><div><p className="text-sm font-semibold text-ink">Paula Salinas</p><p className="mt-0.5 text-xs text-ink-muted">Tecnóloga médica · Hematología</p></div></div><time className="pt-0.5 text-xs text-ink-muted">Ayer · 22:48</time></div><div className="mt-4 border-t border-line pt-4"><span className="rounded-md border border-[#bde0c9] bg-[#e8f6ed] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#21613a]">Entrega de turno</span><p className="mt-3 text-sm leading-6 text-ink-muted">Controles de hematología procesados y validados. Se deja una muestra pendiente de repetición en la gradilla identificada junto al analizador.</p></div>
              </article>
            </div>

            <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-[0_12px_32px_rgb(20_25_35_/_0.035)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-ink-faint">Inventario del laboratorio</p>
                  <Link href="/LeveyDashboardClientes/analisisCalidad/inventarioLaboratorio" className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-white px-2.5 text-[10px] font-semibold text-ink transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                    Editar inventario
                  </Link>
                </div>
                <div className="mt-4 space-y-3.5">
                  <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm text-ink-muted"><span className="size-2 rounded-full bg-[#604ca7]" /> Reactivos</span><strong className="text-sm text-ink">24</strong></div>
                  <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm text-ink-muted"><span className="size-2 rounded-full bg-[#31708c]" /> Cajas de placas de Petri</span><strong className="text-sm text-ink">3</strong></div>
                  <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 text-sm text-ink-muted"><span className="size-2 rounded-full bg-[#5c6873]" /> Insumos de laboratorio</span><strong className="text-sm text-ink">15</strong></div>
                </div>
                <div className="mt-4 border-t border-line pt-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-status-warn">Bajo la regla de aviso</p>
                  <ul className="mt-2 space-y-1.5">
                    <li className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-ink-muted">Agar sangre · Microbiología</span><strong className="shrink-0 font-mono tabular-nums text-status-alert">2</strong></li>
                    <li className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-ink-muted">Bilirrubina total · Bioquímica</span><strong className="shrink-0 font-mono tabular-nums text-status-alert">1</strong></li>
                    <li className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-ink-muted">Tromboplastina para TP · Coagulación</span><strong className="shrink-0 font-mono tabular-nums text-status-warn">5</strong></li>
                    <li className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-ink-muted">Asas calibradas de 1 µL · Insumos</span><strong className="shrink-0 font-mono tabular-nums text-status-warn">4</strong></li>
                  </ul>
                </div>
                <div className="mt-5 border-t border-line pt-4"><p className="text-[10px] uppercase tracking-[0.13em] text-ink-faint">Institución activa</p><p className="mt-2 truncate text-sm font-semibold text-ink">{nombreInstitucion}</p></div>
              </div>
              <div className="rounded-2xl bg-[#ece9ff] p-5"><span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#6854c7] shadow-sm"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"/><path d="M12 16v-4M12 8h.01"/></svg></span><h3 className="mt-4 text-sm font-semibold text-ink">Comunicación clara entre turnos</h3><p className="mt-2 text-xs leading-5 text-ink-muted">Incluye el área, el equipo involucrado y las acciones pendientes para que el siguiente turno pueda continuar.</p></div>
            </aside>
          </div>
        </div>
        <footer className="mt-9 flex flex-wrap items-center justify-between gap-2 pb-2 text-[11px] text-ink-faint"><span>Levey Quality Control</span><span>Diseñado para cuidar la calidad.</span></footer>
      </section>

      {contadorLibreAbierto ? (
        <ContadorCelulas
          control="Uso libre"
          onCerrar={() => setContadorLibreAbierto(false)}
          onAplicar={() => setContadorLibreAbierto(false)}
        />
      ) : null}
    </div>
  );
}
