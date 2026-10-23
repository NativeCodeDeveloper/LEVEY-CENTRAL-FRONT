"use client";
import Link from "next/link";
import { ArrowRight, Eye, MessageSquarePlus, Power, Search, X } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@clerk/nextjs";
import {listarNivelesActivos} from "@/app/LeveyDashboardClientes/servicesBackend/analitosControlados";
import {
    ACTIVAR, BUSCARSIMILAR,
    DESACTIVAR, INSERTARCOMENTARIO,
    INSERTARCORRIDANUEVA,
    LISTARTODAS
} from "@/app/LeveyDashboardClientes/servicesBackend/CorridaAnalitica";
import Toaster from "@/components/ui/toast";

export default function PaginaCorridas() {
    const toasterRef = useRef(null);
    const [popupNuevaCorrida, setPopupNuevaCorrida] = useState(false);
    const [popupComentario, setPopupComentario] = useState(false);
    const [analitosAgregados, setAnalitosAgregados] = useState([]);
    const {getToken,userId} = useAuth();



    const [data, setData] = useState([]);
    const [filtroControl, setFiltroControl] = useState("todos");

    // Datos hardcodeados de controles para búsqueda por nombre
    const controlesHardcoded = [
        { id: "todos", nombre: "Todos los controles" },
        { id: "glucosa", nombre: "Glucosa" },
        { id: "urea", nombre: "Urea" },
        { id: "creatinina", nombre: "Creatinina" },
        { id: "alc", nombre: "HbAlc" },
        { id: "troponina", nombre: "Troponina" },
        { id: "cd4", nombre: "CD4" },
        { id: "vih", nombre: "VIH" },
        { id: "bilirrubina", nombre: "Bilirrubina" },
        { id: "albumina", nombre: "Albumina" },
    ];

    // Mapeo de control por idCorrida (hardcodeado)
    const mapeoControles = {
        1: "glucosa",
        2: "urea",
        3: "creatinina",
        4: "alc",
        5: "troponina",
        6: "cd4",
        7: "vih",
        8: "bilirrubina",
        9: "albumina",
    };

    // Mapeo de control por nombre según el idCorrida (hardcodeado)
    const getNombreControl = (idCorrida) => {
        const nombres = {
            1: "glucosa", 2: "urea", 3: "creatinina", 4: "alc",
            5: "troponina", 6: "cd4", 7: "vih", 8: "bilirrubina", 9: "albumina",
        };
        return nombres[idCorrida] || "otro";
    };

    async function listar() {
        try {
            const token = await getToken();
            const respuestaBackend = await LISTARTODAS(token)
            setData(respuestaBackend.data);

            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "error",
                    "duration": 1000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                "title": `${e.message}`,
                "variant": "error",
                "duration": 1000,
            });
        }
    }

    useEffect(() => {
        listar();
    }, []);

    function estado(numero){
        if(numero === null || numero === undefined || numero === "" || numero === 0){
            return { texto: "FINALIZADA", tono: "gray" }
        }
        const n = Number(numero);
        if (isNaN(n)) {
            return { texto: "FINALIZADA", tono: "gray" };
        }
        switch (n) {
            case 0:
                return { texto: "FINALIZADA", tono: "gray" };
            case 1:
                return { texto: "ACTIVO", tono: "ok" };
            case 2:
                return { texto: "FINALIZADA", tono: "gray" };
            case 3:
                return { texto: "CERRADO", tono: "red-pale" };
            default:
                return { texto: "-", tono: "neutral" };
        }
    }

    function estadoAnalitico(numero){
        if(numero === null || numero === undefined){
            return { texto: "-", tono: "neutral" }
        }
        const n = Number(numero);
        switch (n) {
            case 1:
                return { texto: "VALIDADA", tono: "ok" };
            case 2:
                return { texto: "PENDIENTE", tono: "warn" };
            case 3:
                return { texto: "RECHAZADO", tono: "alert" };
            default:
                return { texto: "-", tono: "neutral" };
        }
    }


    const corridas = data.map((i) => {
        return {
            numero: i.idCorrida,
            fechaIngreso: i.fechaCreacion,
            usuarioCreacion: "BOLATE",
            fechaModificacion: i.fechaModificacion,
            usuarioModificacion: "BOLATE",
            estadoActividad: estado(i.activo),
            estadoAnalitico: estadoAnalitico(i.estadoAnaliticoCorrida),
            comentarios: i.comentario,

        }
    })

  // Píldoras de estado: fondo suave + texto del mismo tono (tokens en globals.css).
  const tonoPill = {
    ok: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 ring-opacity-40",
    warn: "bg-amber-50 text-amber-700 ring-amber-600/20 ring-opacity-40",
    alert: "bg-red-50 text-red-600 ring-red-500/20 ring-opacity-50",
    info: "bg-status-info-soft text-status-info",
    neutral: "bg-gray-100 text-gray-500 ring-gray-400/20 ring-opacity-30",
    gray: "bg-gray-100 text-gray-600 ring-gray-400/20 ring-opacity-30",
    "red-pale": "bg-red-50/80 text-red-400 ring-red-400/10 ring-opacity-30",
  };

  const dotColor = {
    ok: "bg-emerald-500",
    warn: "bg-amber-500",
    alert: "bg-red-400",
    neutral: "bg-gray-400",
    gray: "bg-gray-500",
    "red-pale": "bg-red-300",
  };

  // Transición premium: desaceleración suave al entrar/soltar, respuesta inmediata al presionar (active:duration-75).
  const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";

  // Fechas formateadas una sola vez (dd/mm/aaaa · hh:mm) para no repetir el parseo en el JSX.
  const filas = corridas.map((c) => ({
    ...c,
    ingreso: c.fechaIngreso ? `${c.fechaIngreso.slice(0, 10).split("-").reverse().join("/")} · ${c.fechaIngreso.slice(11, 16)}` : "-",
    modificacion: c.fechaModificacion ? `${c.fechaModificacion.slice(0, 10).split("-").reverse().join("/")} · ${c.fechaModificacion.slice(11, 16)}` : "-",
  }));

  // Filtrado por nombre de control
  const filasFiltradas = filtroControl === "todos"
    ? filas.map(c => ({ ...c, nombreControl: getNombreControl(c.numero) }))
    : filas.filter(c => getNombreControl(c.numero) === filtroControl).map(c => ({ ...c, nombreControl: filtroControl }));









    async function activarCorrida(idCorrida) {
        try {

            const numero = Number(idCorrida);

            const token = await getToken();
            const respuestaBackend = await ACTIVAR(token, numero)

            if(respuestaBackend.success){
                await listar();
                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "error",
                    "duration": 1000,
                });
            }

            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "error",
                    "duration": 1000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                "title": `${e.message}`,
                "variant": "error",
                "duration": 1000,
            });
        }
    }




    async function desactivarCorrida(idCorrida) {
        try {

            const numero = Number(idCorrida);

            const token = await getToken();
            const respuestaBackend = await DESACTIVAR(token, numero)

            if(respuestaBackend.success){
                await listar();
                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "error",
                    "duration": 1000,
                });
            }

            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "error",
                    "duration": 1000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                "title": `${e.message}`,
                "variant": "error",
                "duration": 1000,
            });
        }
    }







    const [comentario, setComentario] = useState("");
    const [idCorrida, setIdCorrida]=useState("");

    async function anadirComentario(idCorrida, comentario) {
        try {

            const DTO = {
                idCorrida: Number(idCorrida),
                Comentario: comentario
            };


            const token = await getToken();
            const respuestaBackend = await INSERTARCOMENTARIO(token, DTO)

            if(respuestaBackend.success){

                setPopupComentario(false);
                setComentario("");
                setIdCorrida("");
                await listar();

                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "success",
                    "duration": 1000,
                });
            }

            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "error",
                    "duration": 1000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                "title": `${e.message}`,
                "variant": "error",
                "duration": 1000,
            });
        }
    }






    const [comentarioSimilar, setComentarioSimilar]=useState("");

    async function buscar(comentarioSimilar) {
        try {

            const token = await getToken();
            const respuestaBackend = await BUSCARSIMILAR(token, comentarioSimilar)

            if(respuestaBackend.success){
                setData(respuestaBackend.data);
                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "success",
                    "duration": 1000,
                });
            }

            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    "title": `${respuestaBackend.message}`,
                    "variant": "error",
                    "duration": 1000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                "title": `${e.message}`,
                "variant": "error",
                "duration": 1000,
            });
        }
    }


    useEffect(() => {
        if(comentarioSimilar) {
            buscar(comentarioSimilar);
        }else {
            listar();
        }
    }, [comentarioSimilar]);

    return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
        <Toaster ref={toasterRef} />
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
          ANÁLISIS QC / CORRIDAS
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
          Series Analíticas
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
            Conjunto de varias corridas analíticas individuales analizadas en su totalidad. CLSI C24 del Clinical and Laboratory Standards Institute.        </p>
      </header>

      <div className="mt-8 flex justify-end">
        <Link
          href="/LeveyDashboardClientes/analisisCalidad/registro"
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
        >
          Ir a Registros
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {/* FILTROS VISUALES */}
      <section aria-label="Filtros visuales de series analíticas" className="mt-5 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="block min-w-0 sm:col-span-2 xl:col-span-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Buscar por comentario</span>
            <span className="relative mt-2 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
              <input
                  value={comentarioSimilar}
                  onChange={(e) => setComentarioSimilar(e.target.value)}
                  type="search" placeholder="Buscar por comentario..." className="h-10 w-full rounded-lg border border-line-strong bg-white pl-9 pr-3 text-[12px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-status-info focus:ring-4 focus:ring-status-info/10" />
            </span>
          </label>
          <label className="block min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Desde</span>
            <input type="date" name="fechaDesde" className="mt-2 h-10 w-full min-w-0 rounded-lg border border-line-strong bg-white px-3 text-[12px] text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10" />
          </label>
          <label className="block min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Hasta</span>
            <input

                type="date" name="fechaHasta" className="mt-2 h-10 w-full min-w-0 rounded-lg border border-line-strong bg-white px-3 text-[12px] text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10" />
          </label>
        </div>
      </section>

      {/* TABLA DE SERIES */}
      <section
        aria-label="Historial de corridas analíticas"
        className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]"
      >
        <table className="w-full min-w-[1200px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[9%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[17%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[17%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-[#f8f9fb] align-middle">
              <th scope="col" title="Número de serie" className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-muted">Nº serie</th>
              <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-muted">Comentarios</th>
              <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-muted">Fecha de ingreso</th>
              <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-muted">Última modificación</th>
              <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-muted">Estado de actividad</th>
              <th scope="col" className="px-4 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-muted">Estado analítico</th>
              <th scope="col" className="px-4 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.07em] text-ink-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((c) => (
              <tr
                key={c.numero}
                className={`border-b border-line align-middle transition-colors duration-200 ${EASE_PREMIUM} last:border-b-0 hover:bg-[#f8f9fb]`}
              >
                <td className="px-4 py-3.5 text-left">
                  <p className="whitespace-nowrap text-[11px] font-bold tabular-nums text-ink">SERIE: {c.numero}</p>
                </td>
                <td className="px-4 py-3.5 text-left">
                  <p className="truncate text-[11px] font-semibold text-ink" title="Control Bio-Rad Nivel 1">{c.comentarios}</p>
                </td>
                <td className="px-4 py-3.5 text-left">
                  <p className="whitespace-nowrap text-[11px] font-semibold tabular-nums text-ink">{c.ingreso}</p>
                  <p className="mt-1 whitespace-nowrap text-[10px] font-medium leading-4 text-ink-faint">
                    Creada por {c.usuarioCreacion}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-left">
                  <p className="whitespace-nowrap text-[11px] font-semibold tabular-nums text-ink">{c.fechaModificacion || c.fechaIngreso }</p>
                  <p className="mt-1 whitespace-nowrap text-[10px] font-medium leading-4 text-ink-faint">
                    Modificada por {c.usuarioModificacion}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-left">
                  <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring ring-inset transition-colors duration-200 hover:brightness-95 ${tonoPill[c.estadoActividad.tono] ?? tonoPill.neutral}`}>
                    <span className={`mr-1.5 size-1.5 shrink-0 rounded-full ${dotColor[c.estadoActividad.tono]} opacity-70`} aria-hidden="true" />
                    {c.estadoActividad.texto}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-left">
                  <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring ring-inset transition-colors duration-200 hover:brightness-95 ${tonoPill[c.estadoAnalitico.tono] ?? tonoPill.neutral}`}>
                    <span className={`mr-1.5 size-1.5 shrink-0 rounded-full ${dotColor[c.estadoAnalitico.tono]} opacity-70`} aria-hidden="true" />
                    {c.estadoAnalitico.texto}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {/* MOCK: conectar con el endpoint de detalle de corrida cuando exista */}
                    <button
                      type="button"
                      aria-label={`Ver detalle de la corrida ${c.numero}`}
                      title="Ver detalle de la corrida"
                      className={`group flex size-8 shrink-0 items-center justify-center rounded-lg bg-black text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.12)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.32)] active:translate-y-0 active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                    >
                      <Eye className="size-3.5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                          setPopupComentario(true);
                          setIdCorrida(c.numero);
                      }}
                      aria-label={`Añadir comentario a la serie ${c.numero}`}
                      aria-haspopup="dialog"
                      title="Añadir comentario"
                      className={`group flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.16)] active:translate-y-0 active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                    >
                      <MessageSquarePlus className="size-3.5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    </button>

                    {/* Estado visual de finalización; conserva la acción existente */}
                    <button
                        type="button"
                        onClick={() => {
                            if (c.estadoActividad.texto === "ACTIVO") {
                                desactivarCorrida(c.numero);
                            } else {
                                activarCorrida(c.numero);
                            }
                        }}
                        aria-pressed={c.estadoActividad.tono !== "gray" && c.estadoActividad.tono !== "neutral"}
                        aria-label={c.estadoActividad.texto === "ACTIVO" ? `Finalizar la serie ${c.numero}` : `Activar la serie finalizada ${c.numero}`}
                        title={c.estadoActividad.texto === "ACTIVO" ? "Finalizar serie" : "Activar serie finalizada"}
                        className={`group flex h-8 min-w-[92px] shrink-0 items-center justify-center gap-1.5 rounded-lg px-2 text-[10px] font-semibold transition-all duration-300 ${EASE_PREMIUM} active:translate-y-0 active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                            c.estadoActividad.texto === "ACTIVO"
                                ? `bg-black text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.12)] hover:-translate-y-px hover:bg-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.32)]`
                                : `border border-line-strong bg-white text-ink-faint shadow-sm hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_6px_16px_rgb(91_62_200_/_0.16)]`
                        }`}
                    >
                      <Power className={`size-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${c.estadoActividad.texto === "ACTIVO" ? "opacity-100" : "opacity-50"}`} aria-hidden="true" />
                      {c.estadoActividad.texto === "ACTIVO" ? "FINALIZAR" : "FINALIZADA"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ============================================================
          POPUP AÑADIR COMENTARIO
      ============================================================ */}
      {popupComentario && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-comentario-corrida"
          aria-describedby="descripcion-comentario-corrida"
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">Series analíticas</p>
                <h2 id="titulo-comentario-corrida" className="mt-1 text-xl font-bold tracking-[-0.03em] text-ink">Añadir comentario</h2>
                <p id="descripcion-comentario-corrida" className="mt-2 text-sm leading-5 text-ink-muted">Escribe una observación para esta serie analítica.</p>
              </div>
              <button
                type="button"
                onClick={() => setPopupComentario(false)}
                aria-label="Cerrar comentario"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="px-5 py-6 sm:px-6">
              <label htmlFor="comentario-corrida" className="block text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Comentario</label>
              <textarea
                  value={comentario}
                  onChange={(e)=>setComentario(e.target.value)}
                id="comentario-corrida"
                rows={5}
                placeholder="Escribe aquí tu comentario..."
                className="mt-2 w-full resize-y rounded-xl border border-line-strong bg-white px-3.5 py-3 text-sm leading-6 text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-status-info focus:ring-4 focus:ring-status-info/10"
              />
            </div>
            <div className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setPopupComentario(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Cancelar
              </button>
              <button
                  onClick={() =>anadirComentario(idCorrida, comentario)}
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <MessageSquarePlus className="size-4" aria-hidden="true" />
                Añadir comentario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
