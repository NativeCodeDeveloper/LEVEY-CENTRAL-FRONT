"use client";

import {useEffect, useRef, useState} from "react";
import { Check, ChevronDown, Eye, Hammer, Plus, X } from "lucide-react";
import {insertarCorrida, listarCorridas} from "@/app/LeveyDashboardClientes/servicesBackend/CorridaAnalitica";
import {getToken, useAuth} from "@clerk/nextjs";
import Link from "next/link";
import Toaster from "@/components/ui/toast";
import {listarNivelesActivos} from "@/app/LeveyDashboardClientes/servicesBackend/analitosControlados";
import {insertarValorAnaliticoApi} from "@/app/LeveyDashboardClientes/servicesBackend/medicionesAnalitos";


// Transición premium: desaceleración suave al entrar/soltar, respuesta inmediata al presionar (active:duration-75).
const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export default function PaginaRegistroControles() {
    const toasterRef = useRef(null);
    const [popupNuevaCorrida, setPopupNuevaCorrida] = useState(false);
    const [analitosAgregados, setAnalitosAgregados] = useState([]);
    const {getToken,userId} = useAuth();



    const [data, setData] = useState([]);
    async function listarTecnicas() {
        try {
            const token = await getToken();
            const respuestaBackend = await listarNivelesActivos(token)
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
        listarTecnicas();
    }, []);




    const [dataCorridas, setDataCorridas] = useState([]);
    // silencioso: evita el toast cuando solo se está refrescando la tabla (ej. tras insertar un valor).
    async function listarCorridaNiveles(silencioso = false) {
        try {
            const token = await getToken();
            const respuestaBackend = await listarCorridas(token)

            if (respuestaBackend.success) {
                setDataCorridas(respuestaBackend.data);
                if (silencioso) {
                    return undefined;
                }
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
        listarCorridaNiveles();
    }, []);


    // Máximo 3 decimales para los valores del backend (1.4142135… → 1.414; 14 → 14).
    function formatearNumero(valor) {
        if (valor === null || valor === undefined || valor === "") return `-`;
        const numero = Number(valor);
        if (Number.isNaN(numero)) return valor;
        return String(parseFloat(numero.toFixed(3)));
    }

    const corridasNiveles = dataCorridas.map((item) => {
        return {
            nombreAnalito: item[0],
            nombreNivel: item[1],

            nombreControl: item[2] || `-`,
            loteControl: item[3] || `-`,

            valor: formatearNumero(item[4]),
            media: formatearNumero(item[5]),
            desviacionEstandar: formatearNumero(item[6]),
            coeficienteVariacion: formatearNumero(item[7]),
            sesgo: formatearNumero(item[8]),
            zScore: formatearNumero(item[9]),

            reglasWestgard: item[10] || `-`,
            estadoAnaliticoMedicion: item[11] || `-`,

            nivelAnalitoControlActivo: item[12] || `-`,
            estadoControl: item[13] || `-`,
            estadoActivoMedicion: item[14] || `-`,

            fechaCreacionControl: item[15] || `-`,
            fechaCreacionMedicion: item[16] || `-`,

            idAnalito: item[17] || `-`,
            idAnalitoControl: item[18] || `-`,
            idControl: item[19] || `-`,
            idNivelAnalitoControl: item[20] || `-`,
            idMedicion: item[21] || `-`,
            idCorrida: item[22] || `-`,
            unidad  : item[23] || `-`,
        };
    });

    const analitosEjemplo = data.map((item) => {
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



    function limpiaryCerrar() {
        setAnalitosSeleccionados([]);
        setAnalitoEnSelector("");
        setPopupNuevaCorrida(false);
    }


    function limpiar() {
        setAnalitosSeleccionados([]);
        setAnalitoEnSelector("");
    }


    function obtenerSoloFecha(fecha) {
        return fecha.split("T")[0];
    }



    const[analitosEnSelector, setAnalitoEnSelector] = useState("");
    const[analitosSeleccionados, setAnalitosSeleccionados] = useState([]);
    function agregar(analitoControl){
        if(analitoControl=== null || analitoControl=== ""){
            return toasterRef.current?.show({
                title: "No fue posible seleccionar elemento",
                variant: "error",
                duration: 1000,
            });
        }else{
            const idBusqueda = Number(analitoControl);
            const AnalitoControl = analitosEjemplo.find((item) => item.idNivelAnalitoControl === idBusqueda);
            setAnalitosSeleccionados([...analitosSeleccionados,AnalitoControl]);
            setAnalitoEnSelector("");
            return toasterRef.current?.show({
                title: `Elemento agregado`,
                variant: "success",
                duration: 1000,
            });
        }
    }





    function quitar(idNivelAnalitoControl){
        if(idNivelAnalitoControl===null || idNivelAnalitoControl ==="" || idNivelAnalitoControl===undefined){
            return toasterRef.current?.show({
                title: `No se pudo eliminar seleccion`,
                variant: "error",
                duration: 1000,
            });
        }else {
            const idAeliminar = Number(idNivelAnalitoControl);
            const id = analitosSeleccionados.findIndex((elemento) => elemento.idNivelAnalitoControl === idAeliminar);
            if(id !== -1){
                analitosSeleccionados.splice(id, 1);
                setAnalitosSeleccionados([...analitosSeleccionados]);
                return toasterRef.current?.show({
                    title: `Elemento eliminado`,
                    variant: "success",
                    duration: 1000,
                });
            }
        }
    }



    const [comentario, setComentario] = useState("");
    async function insertar(ArrayObjetos,comentario) {
        try {

            if (!Array.isArray(ArrayObjetos) || ArrayObjetos.length === 0 ){
                return toasterRef.current?.show({
                    title: "No fue posible crear nueva corrida Analitica",
                    variant: "error",
                    duration: 1000,
                });
            }

            const ids = ArrayObjetos.map((object) => object.idNivelAnalitoControl);
            let usuarioCreacio= userId;

            const DTO = {
                usuarioCreacio,
                 comentario,
                ids
            }

            const token = await getToken();
            const respuestaBackend = await insertarCorrida(DTO, token);

                if (respuestaBackend.success) {
                    await listarTecnicas();
                    limpiaryCerrar();
                    return toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 1000,
                    });

                }

                if (!respuestaBackend.success) {
                    return toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 1000,
                    });
                }


        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 1000,
            });
        }
    }



    const [idMedicion, setIdMedicion] = useState(null);
    const [idCorrida, setIdCorrida] = useState(null);
    const [idNivelesAnalitosControl, setIdNivelesAnalitosControl] = useState(null);

    // Valores digitados por fila (key: idMedicion) para el input "Valor del día".
    const [valoresIngresados, setValoresIngresados] = useState({});
    const [filaValidando, setFilaValidando] = useState(null);

    function actualizarValorIngresado(idMedicion, valor) {
        setValoresIngresados((prev) => ({ ...prev, [idMedicion]: valor }));
    }

    // Acepta coma decimal ("98,6") y la normaliza a punto para el backend.
    function numeroNormalizado(valor) {
        return valor.trim().replace(",", ".");
    }

    function esNumeroValido(valor) {
        return valor.trim() !== "" && !Number.isNaN(Number(numeroNormalizado(valor)));
    }

    async function insertarValorAnalitico(
        idMedicion,
        idCorrida,
        idNivelesAnalitosControl,
        valorAnalitico
    ) {
        try {

            let usuarioCreacion= userId;


            const token = await getToken();
            const respuestaBackend = await insertarValorAnaliticoApi(
                idMedicion,
                idCorrida,
                idNivelesAnalitosControl,
                valorAnalitico,
                usuarioCreacion,
                token);

            if (respuestaBackend.success) {
                // Limpia el input de la fila y recarga el listado con lo validado.
                setValoresIngresados((prev) => {
                    const copia = { ...prev };
                    delete copia[idMedicion];
                    return copia;
                });
                listarCorridaNiveles(true);
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 1000,
                });

            }

            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message} `,
                    variant: "error",
                    duration: 3000,
                });
            }


        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 1000,
            });
        }
    }

    // Botón Validar de una fila: exige valor numérico y lo envía con los ids de la corrida.
    async function validarFila(r) {
        const valorDigitado = valoresIngresados[r.idMedicion] ?? "";

        if (!esNumeroValido(valorDigitado)) {
            return toasterRef.current?.show({
                title: "Ingresa un valor numérico antes de validar",
                variant: "error",
                duration: 1000,
            });
        }

        setFilaValidando(r.idMedicion);
        try {
            await insertarValorAnalitico(
                r.idMedicion,
                r.idCorrida,
                r.idNivelAnalitoControl,
                Number(numeroNormalizado(valorDigitado))
            );
        } finally {
            setFilaValidando(null);
        }
    }







    return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
        <Toaster ref={toasterRef} />
        <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
          ANÁLISIS QC / REGISTRO
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
          Registro de Corridas analiticas
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
            Conjunto o secuencia de mediciones y análisis consecutivos de muestras que se realizan bajo condiciones estables en un laboratorio        </p>
      </header>

      <div className="mt-8 flex justify-end gap-3">
        <Link
          href="/LeveyDashboardClientes/analisisCalidad/corridas"
          className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white px-5 text-sm font-semibold text-ink shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:border-status-info hover:text-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.16)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
        >
          <Eye className="size-4" aria-hidden="true" />
          Historial de Corridas
        </Link>
        <button
          type="button"
          onClick={() => {
            setAnalitosAgregados([]);
            setPopupNuevaCorrida(true);
          }}
          className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
        >
          <Plus className="size-4" aria-hidden="true" />
          Nueva Corrida Analitica
        </button>
      </div>

      <section aria-label="Filtros visuales del registro" className="mt-5 grid gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-3">
        <label className="block min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Filtrar por control</span>
          <span className="relative mt-2 block">
            <select defaultValue="" className="h-10 w-full appearance-none rounded-lg border border-line-strong bg-white pl-3 pr-9 text-sm text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10">
              <option value="">Todos los controles</option>
              <option value="control-ejemplo-a">Control de ejemplo A</option>
              <option value="control-ejemplo-b">Control de ejemplo B</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </span>
        </label>
        <label className="block min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Filtrar por lote</span>
          <span className="relative mt-2 block">
            <select defaultValue="" className="h-10 w-full appearance-none rounded-lg border border-line-strong bg-white pl-3 pr-9 text-sm text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10">
              <option value="">Todos los lotes</option>
              <option value="lote-ejemplo-001">Lote de ejemplo 001</option>
              <option value="lote-ejemplo-002">Lote de ejemplo 002</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </span>
        </label>
        <label className="block min-w-0 sm:col-span-2 xl:col-span-1">
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Filtrar por analito</span>
          <span className="relative mt-2 block">
            <select defaultValue="" className="h-10 w-full appearance-none rounded-lg border border-line-strong bg-white pl-3 pr-9 text-sm text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10">
              <option value="">Todos los analitos</option>
              <option value="glucosa">Glucosa</option>
              <option value="colesterol">Colesterol</option>
              <option value="hemoglobina">Hemoglobina</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
          </span>
        </label>
      </section>

      <section
        aria-label="Registro diario de controles"
        className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]"
      >
        <table className="w-full min-w-[1260px] table-fixed border-collapse text-center">
          <colgroup>
            <col className="w-[8%]" />
            <col className="w-[6%]" />
            <col className="w-[6%]" />
            <col className="w-[6%]" />
            <col className="w-[5%]" />
            <col className="w-[4%]" />
            <col className="w-[4%]" />
            <col className="w-[5%]" />
            <col className="w-[6%]" />
            <col className="w-[9%]" />
            <col className="w-[7%]" />
            <col className="w-[5%]" />
            <col className="w-[8%]" />
            <col className="w-[5%]" />
            <col className="w-[9%]" />
          </colgroup>
          <thead className="whitespace-nowrap text-[6.5px] tracking-[0.02em]">
            <tr className="border-b border-line bg-[#f8f9fb]">
              <th scope="col" className="px-1.5 py-2.5 text-left font-semibold uppercase text-ink-muted">Analito</th>
              <th scope="col" title="Número de serie" className="px-1.5 py-2.5 font-semibold text-ink-muted">N.Corrida</th>
                <th scope="col" title="Valor del día" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">Valor</th>
              <th scope="col" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">Previo</th>
              <th scope="col" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">Media</th>
              <th scope="col" title="Desviación estándar" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">D.E</th>
              <th scope="col" title="Coeficiente de variación" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">C.V</th>
              <th scope="col" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">Sesgo</th>
              <th scope="col" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">Z-Score</th>
              <th scope="col" title="Fecha y hora de la medición" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">Fecha y hora</th>
              <th scope="col" className="px-1.5 py-2.5 text-left font-semibold uppercase text-ink-muted">Control</th>
              <th scope="col" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">Lote</th>
              <th scope="col" title="Regla Westgard aplicada" className="px-1.5 py-2.5 font-semibold uppercase text-ink-muted">Westgard</th>
              <th scope="col" className="px-1 py-2.5 text-center font-semibold uppercase text-ink-muted">Alert</th>
              <th scope="col" className="px-1.5 py-2.5 text-center font-semibold uppercase text-ink-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {corridasNiveles.map((r, index) => (
                <tr
                  key={r.idMedicion !== "-" ? r.idMedicion : `${r.nombreAnalito}-${r.nombreNivel}-${index}`}
                  className={`border-b border-line transition-colors duration-200 ${EASE_PREMIUM} last:border-b-0 hover:bg-[#f8f9fb]`}
                >
                  <td className="px-2 py-2.5 text-left align-middle">
                    <p className="text-[9px] font-semibold tracking-[-0.01em] text-ink">{r.nombreAnalito}</p>
                    <span className="mt-1 block whitespace-nowrap text-[8px] font-medium uppercase leading-none tracking-[0.04em] text-status-info">
                      {r.nombreNivel}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <span className="whitespace-nowrap text-[8px] font-semibold tabular-nums text-ink">{r.idCorrida}</span>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={valoresIngresados[r.idMedicion] ?? ""}
                      onChange={(e) => actualizarValorIngresado(r.idMedicion, e.target.value)}
                      aria-label={`Valor del día para ${r.nombreAnalito}, ${r.nombreNivel}`}
                      placeholder="Valor"
                      className={`mx-auto block h-7 w-full max-w-[64px] rounded-md border border-line-strong bg-white px-1.5 text-left text-[9px] font-medium tabular-nums text-ink shadow-[inset_0_1px_2px_rgb(15_23_42_/_0.03)] outline-none transition-all duration-200 ${EASE_PREMIUM} placeholder:font-normal placeholder:text-ink-faint focus-visible:border-status-info focus-visible:ring-[3px] focus-visible:ring-status-info/15`}
                    />
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <p className="inline-flex flex-wrap items-center justify-center gap-1 text-[8px] font-semibold tabular-nums text-ink">
                      {r.valor}
                      <span className="text-[8px] font-normal text-ink-muted">{r.unidad}</span>
                    </p>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <p className="text-[8px] font-semibold tabular-nums text-ink">{r.media}</p>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <p className="text-[8px] font-semibold tabular-nums text-ink">{r.desviacionEstandar}</p>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <p className="text-[8px] font-semibold tabular-nums text-ink">{r.coeficienteVariacion}</p>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <p className="text-[8px] font-semibold tabular-nums text-ink">{r.sesgo}</p>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <p className="text-[8px] font-semibold tabular-nums text-ink">{r.zScore}</p>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <time dateTime={r.fechaCreacionMedicion} className="mx-auto block w-[16ch] max-w-full text-left font-mono">
                      <span className="block whitespace-nowrap text-[8px] font-medium leading-4 text-ink">
                        {r.fechaCreacionMedicion.replace("T", " ").split(" ")[0]}
                      </span>
                      <span className="block whitespace-nowrap text-[7px] font-medium leading-3 text-ink-muted">
                        {r.fechaCreacionMedicion.replace("T", " ").split(" ")[1]?.slice(0, 8)}
                      </span>
                    </time>
                  </td>
                  <td className="px-2 py-2.5 text-left align-middle">
                    <p className="text-[8px] font-medium text-ink">{r.nombreControl}</p>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <p className="text-[8px] font-medium leading-4 text-ink-muted">
                        {r.loteControl}
                    </p>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <span className="inline-flex rounded-md bg-status-alert-soft px-1.5 py-0.5 text-[8px] font-semibold tabular-nums text-status-alert">1-3s</span>
                  </td>
                  <td className="px-1 py-2.5 align-middle">
                    <div className="group relative flex items-center justify-center" role="img" aria-label="Estado de alerta: aceptado">
                      <span className="size-3 rounded-full bg-status-ok" aria-hidden="true" />
                      <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[9px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                        Aceptado
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 align-middle">
                    <div className="flex w-full items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => validarFila(r)}
                        disabled={filaValidando === r.idMedicion}
                        aria-label={`Validar ${r.nombreAnalito}, ${r.nombreNivel}`}
                        title="Validar"
                        className={`group inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-black bg-black text-white shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:border-status-info hover:bg-status-info active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <Check className="size-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Acciones correctivas para ${r.nombreAnalito}, ${r.nombreAnalito}`}
                        title="Acciones correctivas"
                        className={`group inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:border-status-info hover:text-status-info active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                      >
                        <Hammer className="size-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Ver ${r.nombreAnalito}, ${r.nombreAnalito}`}
                        title="Ver detalle"
                        className={`group inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-colors duration-200 ${EASE_PREMIUM} hover:border-status-info hover:text-status-info active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                      >
                        <Eye className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {/* ============================================================
          POPUP NUEVA CORRIDA ANALÍTICA
      ============================================================ */}
      {popupNuevaCorrida && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-nueva-corrida"
          aria-describedby="descripcion-nueva-corrida"
        >
          <div className="max-h-[calc(100dvh-3rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-line bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">Análisis de calidad</p>
                <h2 id="titulo-nueva-corrida" className="mt-1 text-2xl font-bold tracking-[-0.03em] text-ink">
                  Nueva Corrida Analítica
                </h2>
                <p id="descripcion-nueva-corrida" className="mt-2 text-sm leading-6 text-ink-muted">
                  Selecciona los analitos y niveles que serán asignados a la nueva corrida.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPopupNuevaCorrida(false)}
                aria-label="Cerrar nueva corrida analítica"
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6 px-5 py-6 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="block min-w-0 flex-1">
                  <span className="text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">
                    Analito · Nivel · Control · Lote
                  </span>
                  <span className="relative mt-2 block">
                    <select
                      onChange={(e) => setAnalitoEnSelector(e.target.value)}
                      className="h-12 w-full appearance-none rounded-xl border border-line-strong bg-white py-2 pl-3.5 pr-10 text-sm text-ink outline-none transition-colors focus:border-status-info focus:ring-4 focus:ring-status-info/10"
                    >
                      <option value="">Selecciona un analito y nivel</option>
                        {analitosEjemplo.map((registro) => (
                            <option key={registro.idNivelAnalitoControl}  value={registro.idNivelAnalitoControl}>    {registro.nombreAnalito} · {registro.nombreNivel} - {registro.nombreControl} · {registro.lote}</option>
                        ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                  </span>
                </label>
                <button
                    onClick={() => agregar(analitosEnSelector)}
                  type="button"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(15_23_42_/_0.14)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-status-info hover:shadow-[0_10px_24px_rgb(91_62_200_/_0.35)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                >
                  Agregar
                </button>
              </div>

              <section aria-labelledby="titulo-analitos-agregados">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                   <h3 id="titulo-analitos-agregados" className="text-sm font-bold text-ink">
                    Analitos y niveles añadidos
                   </h3>
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-semibold tabular-nums text-ink-muted">
                    {analitosAgregados.length} seleccionados
                  </span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-line">
                  <table className="w-full min-w-[580px] border-collapse text-left">
                    <thead className="border-b border-line bg-[#f8f9fb]">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Analito</th>
                        <th scope="col" className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Nivel</th>
                        <th scope="col" className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Control</th>
                        <th scope="col" className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Lote</th>
                        <th scope="col" className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analitosSeleccionados.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-sm text-ink-muted">
                            Selecciona un analito para añadirlo a la corrida.
                          </td>
                        </tr>
                      ) : (
                          analitosSeleccionados.map((registro) => (
                          <tr key={registro.idNivelAnalitoControl} className="border-b border-line last:border-b-0">
                            <td className="px-4 py-3 text-sm font-semibold text-ink">{registro.nombreAnalito}</td>
                            <td className="px-4 py-3 text-sm text-ink-muted">{registro.nombreNivel}</td>
                            <td className="px-4 py-3 text-sm text-ink-muted">{registro.nombreControl}</td>
                            <td className="px-4 py-3 text-sm tabular-nums text-ink-muted">{registro.lote}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                  onClick={()=> quitar(registro.idNivelAnalitoControl)}
                                type="button"
                                aria-label={`Quitar ${registro.nombreAnalito}, ${registro.nombreControl}`}
                                className="rounded-lg px-2 py-1.5 text-xs font-semibold text-status-alert transition-colors hover:bg-status-alert-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-alert"
                              >
                                Quitar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="max-w-sm">
                <label htmlFor="comentario-nueva-corrida" className="block text-xs font-bold uppercase tracking-[0.09em] text-ink-muted">
                  COMENTARIO
                </label>
                <input
                  id="comentario-nueva-corrida"
                  type="text"
                  placeholder="Analizador, operador u otras observaciones"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="mt-2 h-10 w-full rounded-xl border border-line-strong bg-white px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-status-info focus:ring-4 focus:ring-status-info/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setPopupNuevaCorrida(false)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-line-strong bg-white px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Cerrar
              </button>
              <button
                onClick={()=>insertar(analitosSeleccionados, comentario)}
                type="button"
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-status-info px-5 text-xs font-bold uppercase tracking-[0.06em] text-white shadow-[0_8px_20px_rgb(91_62_200_/_0.22)] transition-all duration-300 ${EASE_PREMIUM} hover:-translate-y-px hover:bg-black hover:shadow-[0_12px_24px_rgb(15_23_42_/_0.18)] active:translate-y-0 active:scale-[0.98] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info`}
              >
                <Plus className="size-4" aria-hidden="true" />
                CREAR NUEVA CORRIDA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
