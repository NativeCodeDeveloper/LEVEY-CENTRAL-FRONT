"use client"
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/nextjs";
import Toaster from "@/components/ui/toast";
import { useRef } from "react";
import {
    listarAnalitosyNiveles,
    listarPorSimilitudDeNombre,
    listarPorLoteSimilar,
    listarNivelesInactivos,
    listarNivelesActivos,
    listarSegunAnalitos,
    buscarEntreFechas
} from "@/app/LeveyDashboardClientes/servicesBackend/analitosControlados"
import {listarAnalitos} from "@/app/LeveyDashboardClientes/servicesBackend/tecnicasAnalitos";


export default function PaginaAnalitosControlados() {
  const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";
  const CLASE_CONTROL = `h-9 w-full rounded-lg border border-line bg-canvas shadow-sm outline-none transition-colors duration-200 ${EASE_PREMIUM} hover:border-line-strong placeholder:text-ink-faint focus-visible:border-status-info focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-status-info/10 motion-reduce:transition-none`;
    const { getToken, isLoaded } = useAuth();
    const toasterRef = useRef();


    const [data, setData] = useState([]);
    const [dataTecnicas, setDataTecnicas] = useState([]);

    useEffect(() => {
        if (!isLoaded) return;
        let vigente = true;

        async function cargarTecnicasDisponibles() {
            try {
                const token = await getToken();
                if (!vigente) return;
                const respuestaBackend = await listarAnalitos(token);
                if (!vigente) return;

                if (!respuestaBackend.success) {
                    throw new Error(respuestaBackend.message);
                }
                setDataTecnicas(respuestaBackend.data);
            } catch (error) {
                if (!vigente) return;
                toasterRef.current?.show({
                    title: error.message,
                    variant: "error",
                    duration: 1000,
                });
            }
        }

        cargarTecnicasDisponibles();
        return () => {
            vigente = false;
        };
    }, [getToken, isLoaded]);

    const analitos = dataTecnicas.map((analitos) => {
        return {
            categoria: analitos[0],
            unidadMedida: analitos[1],
            matriz: analitos[2],
            idAnalito: analitos[3],
            nombreAnalito: analitos[4],
            abreviacion: analitos[5],
            activo: analitos[6]
        }
    })


    const [analitoSeleccionado, setAnalitoSeleccionado] = useState("");
    const [nombreCo, setNombreCo] = useState("");
    const [lote, setLote] = useState("");
    const [estado, setEstado] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    function actualizarFiltro(tipo, valor) {
        setAnalitoSeleccionado(tipo === "tecnica" ? valor : "");
        setLote(tipo === "lote" ? valor : "");
        setNombreCo(tipo === "control" ? valor : "");
        setEstado(tipo === "estado" ? valor : "");

        if (tipo === "fechaInicio") {
            setFechaInicio(valor);
        } else if (tipo === "fechaFin") {
            setFechaFin(valor);
        } else {
            setFechaInicio("");
            setFechaFin("");
        }
    }

    useEffect(() => {
        if (!isLoaded) return;
        let vigente = true;

        async function cargarListadoFiltrado() {
            try {
                const token = await getToken();
                if (!vigente) return;

                let respuestaBackend;
                if (analitoSeleccionado) {
                    respuestaBackend = await listarSegunAnalitos(token, analitoSeleccionado);
                } else if (lote.trim()) {
                    respuestaBackend = await listarPorLoteSimilar(token, lote.trim());
                } else if (nombreCo.trim()) {
                    respuestaBackend = await listarPorSimilitudDeNombre(token, nombreCo.trim());
                } else if (estado === "1") {
                    respuestaBackend = await listarNivelesActivos(token);
                } else if (estado === "2") {
                    respuestaBackend = await listarNivelesInactivos(token);
                } else if (fechaInicio && fechaFin) {
                    respuestaBackend = await buscarEntreFechas(token, fechaInicio, fechaFin);
                } else {
                    respuestaBackend = await listarAnalitosyNiveles(token);
                }

                if (!vigente) return;
                if (!respuestaBackend.success) {
                    throw new Error(respuestaBackend.message);
                }
                if (!Array.isArray(respuestaBackend.data)) {
                    throw new Error("El backend no devolvió un listado válido.");
                }

                setData(respuestaBackend.data);
                if (analitoSeleccionado || lote.trim() || nombreCo.trim() || estado || (fechaInicio && fechaFin)) {
                    toasterRef.current?.show({
                        title: respuestaBackend.message,
                        variant: "success",
                        duration: 4000,
                    });
                }
            } catch (error) {
                if (!vigente) return;
                toasterRef.current?.show({
                    title: error.message,
                    variant: "error",
                    duration: 1000,
                });
            }
        }

        cargarListadoFiltrado();
        return () => {
            vigente = false;
        };
    }, [analitoSeleccionado, lote, nombreCo, estado, fechaInicio, fechaFin, getToken, isLoaded]);

    const AnalitosControlados = data.map((item) => {
        return {
            idNivelAnalitoControl: item[0],
            nombreNivel: item[1],
            activo: item[2],

            idAnalitoControl: item[3],

            idControl: item[4],
            nombreControl: item[5],

            analitoId: item[6],
            idAnalito: item[7],
            nombreAnalito: item[8],
            lote: item[9],
            estadoControl: item[10],
            fecha: item[11],
        };
    });



    function estadoString(a) {
        return a ? "Activo" : "Desactivado";
    }


    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        const date = new Date(fecha);
        return date.toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };








    return (
    <div className="min-h-dvh bg-canvas px-4 pb-8 pt-5 text-ink sm:px-6 lg:px-8">
        <Toaster ref={toasterRef} />

        <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <header>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-status-info">
            ANALISIS QC / ANALITOS CONTROLADOS
          </p>
          <h1 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[26px]">
            Analitos Controlados
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Link
            href="/LeveyDashboardClientes/gestionLevey/analitos"
            className={`inline-flex h-9 w-fit shrink-0 items-center justify-center rounded-lg border border-line bg-white px-3.5 text-xs font-semibold text-ink-muted shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:border-status-info/40 hover:bg-status-info-soft hover:text-status-info active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info motion-reduce:transition-none`}
          >
            Técnicas Disponibles
          </Link>
          <Link
            href="/LeveyDashboardClientes/analisisCalidad/controles"
            className={`inline-flex h-9 w-fit shrink-0 items-center justify-center rounded-lg bg-ink px-3.5 text-xs font-semibold text-white shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:bg-accent-strong active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info motion-reduce:transition-none`}
          >
            Ir a Controles
          </Link>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line bg-white p-3.5 shadow-sm">
        <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0">
          <label htmlFor="tecnica-controlada" className="mb-1.5 block text-[11px] font-medium text-ink-muted">
            Técnica controlada
          </label>
          <div className="relative">
            <select
              id="tecnica-controlada"
              name="tecnicaControlada"
              value={analitoSeleccionado}
              className={`${CLASE_CONTROL} appearance-none px-3 pr-8 text-xs font-medium text-ink`}
              onChange={e => actualizarFiltro("tecnica", e.target.value)}
            >
              <option value="">Todas las técnicas</option>
                {
                    analitos.map(analito => (
                      <option key={analito.idAnalito} value={analito.idAnalito}>
                        {analito.nombreAnalito} {"  - "}{analito.unidadMedida}
                      </option>
                    ))
                }
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </div>
        </div>
        <div className="min-w-0">
          <label htmlFor="numero-lote" className="mb-1.5 block text-[11px] font-medium text-ink-muted">
            Número de lote
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              value={lote}
              onChange={e => actualizarFiltro("lote", e.target.value)}
              id="numero-lote"
              name="numeroLote"
              type="search"
              placeholder="Buscar por lote…"
              className={`${CLASE_CONTROL} pl-9 pr-3 text-xs font-medium text-ink`}
            />
          </div>
        </div>
        <div className="min-w-0">
          <label htmlFor="nombre-control" className="mb-1.5 block text-[11px] font-medium text-ink-muted">
            Nombre del control
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              value={nombreCo}
              onChange={e => actualizarFiltro("control", e.target.value)}
              id="nombre-control"
              name="nombreControl"
              type="search"
              placeholder="Buscar por control…"
              className={`${CLASE_CONTROL} pl-9 pr-3 text-xs font-medium text-ink`}
            />
          </div>
        </div>
        <div className="min-w-0">
          <label htmlFor="estado-control" className="mb-1.5 block text-[11px] font-medium text-ink-muted">
            Estado del control
          </label>
          <div className="relative">
            <select
              onChange={e => actualizarFiltro("estado", e.target.value)}
              id="estado-control"
              name="estadoControl"
              value={estado}
              className={`${CLASE_CONTROL} appearance-none px-3 pr-8 text-xs font-medium text-ink`}
            >
              <option value="">Todos los estados</option>
              <option value="1">Activo</option>
              <option value="2">Inactivo</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </div>
        </div>
        </div>
        <div className="mt-3 border-t border-line/70 pt-3">
          <details className="group min-w-0 rounded-lg border border-line bg-white open:bg-canvas">
            <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-3 text-[11px] font-semibold text-ink-muted transition-colors hover:bg-canvas hover:text-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info [&::-webkit-details-marker]:hidden">
              Rango de fechas de ingreso
              <ChevronDown className="size-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
            </summary>
            <div className="grid gap-3 border-t border-line/70 p-3 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="fecha-desde" className="mb-1.5 block text-[11px] font-medium text-ink-muted">
                  Desde
                </label>
                <input
                    value={fechaInicio}
                    onChange={e => actualizarFiltro("fechaInicio", e.target.value)}
                  id="fecha-desde"
                  name="fechaDesde"
                  type="datetime-local"
                  className={`${CLASE_CONTROL} min-w-0 px-3 text-xs font-medium text-ink`}
                />
              </div>
              <div className="min-w-0">
                <label htmlFor="fecha-hasta" className="mb-1.5 block text-[11px] font-medium text-ink-muted">
                  Hasta
                </label>
                <input
                    value={fechaFin}
                    onChange={e => actualizarFiltro("fechaFin", e.target.value)}
                  id="fecha-hasta"
                  name="fechaHasta"
                  type="datetime-local"
                  className={`${CLASE_CONTROL} min-w-0 px-3 text-xs font-medium text-ink`}
                />
              </div>
            </div>
          </details>
        </div>
      </div>

      <section
        aria-label="Analitos controlados de química"
        className="mt-4 overflow-x-auto rounded-xl border border-line bg-white shadow-[0_4px_18px_rgb(15_23_42_/_0.04)]"
      >
        <table className="w-full min-w-[820px] table-auto border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-canvas">
              <th scope="col" className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Técnica controlada</th>
              <th scope="col" className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Fecha de ingreso</th>
              <th scope="col" className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Control</th>
              <th scope="col" className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Estado del control</th>
              <th scope="col" className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">Acciones</th>
            </tr>
          </thead>
          <tbody>

          {AnalitosControlados.map((a)=>{
              return(
                  <tr key={a.idNivelAnalitoControl} className={`border-b border-line/70 transition-colors duration-200 ${EASE_PREMIUM} last:border-b-0 hover:bg-status-info-soft/20 motion-reduce:transition-none`}>
                      <td className="px-3 py-2.5 align-middle text-xs leading-4 text-ink-muted">
                          <p className="font-semibold text-ink">{a.nombreAnalito}</p>
                          <p className="mt-0.5 text-[10px] leading-4 text-ink-faint">{a.nombreNivel}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 align-middle text-xs font-medium tabular-nums text-ink-muted">{formatearFecha(a.fecha)}</td>
                      <td className="px-3 py-2.5 align-middle">
                          <p className="text-xs font-medium leading-4 text-ink">{a.nombreControl}</p>
                          <p className="mt-0.5 whitespace-nowrap text-[10px] leading-4 text-ink-faint">{a.lote}</p>
                      </td>
                      <td className="px-3 py-2.5 align-middle">
                <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ring-inset ring-current/10 ${a.estadoControl ? "bg-status-ok-soft text-status-ok" : "bg-status-alert-soft text-status-alert"}`}>
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                    {estadoString(a.estadoControl)}
                </span>
                      </td>
                      <td className="px-3 py-2.5 align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                              <button
                                  type="button"
                                  aria-label="Ver gráfico Levey-Jennings de Glucosa"
                                  className={`inline-flex h-7 items-center whitespace-nowrap rounded-md border border-line bg-white px-2 text-[10px] font-semibold text-ink-muted shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:border-status-info/40 hover:bg-status-info-soft hover:text-status-info active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info motion-reduce:transition-none`}
                              >
                                  Levey-Jennings
                              </button>
                              <button
                                  type="button"
                                  aria-label="Ver historial de BioRad Glucosa"
                                  className={`inline-flex h-7 items-center rounded-md bg-ink px-2 text-[10px] font-semibold text-white shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:bg-accent-strong active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info motion-reduce:transition-none`}
                              >
                                  Historial
                              </button>
                          </div>
                      </td>
                  </tr>
          )})}
          </tbody>
        </table>
      </section>

    </div>
  );
}
