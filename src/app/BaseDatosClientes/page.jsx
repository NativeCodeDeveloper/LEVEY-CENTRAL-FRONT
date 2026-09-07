"use client"

import {useEffect, useState} from "react";

import {useRef} from "react";
import Toaster from "@/components/ui/toast";
import {useAuth} from "@clerk/nextjs";


export default function BaseDatosClientes() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const toasterRef = useRef(null);
    const {
        getToken,
        userId
    } = useAuth();


    const [dataBasesDatos, setDataBasesDatos] = useState([]);

    async function cargarBasesDatos() {
        const token = await getToken();
        try {
            const res = await fetch(`${API}/bases-datos-laboratorio`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                setDataBasesDatos(respuestaBackend.data);
                return;
            }


            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }

    useEffect(() => {
        cargarBasesDatos();
    }, []);


    const [dataLaboratorios, setDataLaboratorios] = useState([]);

    async function cargarLaboratorios() {
        const token = await getToken();
        try {
            const res = await fetch(`${API}/laboratorios-clinicos`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                setDataLaboratorios(respuestaBackend.data);
                return;

            }


            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }

    useEffect(() => {
        cargarLaboratorios();
    }, []);







    const[idLaboratorioClinico, setIdLaboratorioClinico] = useState("");
    const[nombreBaseDatos,setnombreBaseDatos] = useState("");
    const[motorBaseDatos,setMotorBaseDatos] = useState("");
    const[hostReferencia,setHostReferencia] = useState("");
    const[puertoReferencia,setPuertoReferencia] = useState("");
    const[secretoConexionKey,setSecretoConexionKey] = useState("");

    async function insertar(
        idLaboratorioClinico,
        nombreBaseDatos,
        motorBaseDatos,
        hostReferencia,
        puertoReferencia,
        secretoConexionKey
    ) {
        const token = await getToken();
        try {
            const res = await fetch(`${API}/bases-datos-laboratorio`, {
                method: "POST",
                headers: {
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idLaboratorioClinico,
                    nombreBaseDatos,
                    motorBaseDatos,
                    hostReferencia,
                    puertoReferencia,
                    secretoConexionKey,
                    usuarioCreacionId: userId
                })
            })

            if (!res.ok) {
                toasterRef.current?.show({
                    title: ``,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                setIdLaboratorioClinico("");
                setnombreBaseDatos("");
                setMotorBaseDatos("");
                setHostReferencia("");
                setPuertoReferencia("");
                setSecretoConexionKey("");
                await cargarBasesDatos();
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
            }


            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }

    useEffect(() => {
        cargarLaboratorios();
    }, []);


    function estado(estadoNumber){
        let estadoString;

        if(estadoNumber === 0){
            estadoString = `inactivo`;
            return estadoString;
        }

        if(estadoNumber === 1){
            estadoString = `activo`;
            return estadoString;
        }
    }



    async function desactivar(idBaseDatosLaboratorio) {
        const token = await getToken();
        try {
            const res = await fetch(`${API}/bases-datos-laboratorio/${idBaseDatosLaboratorio}/desactivar`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                await cargarBasesDatos();
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
            }


            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }




    async function activar(idBaseDatosLaboratorio) {
        const token = await getToken();
        try {
            const res = await fetch(`${API}/bases-datos-laboratorio/${idBaseDatosLaboratorio}/activar`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                await cargarBasesDatos();
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
            }


            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }








    async function editar(
        idBaseDatosLaboratorio,
        idLaboratorioClinicoEdit,
        nombreBaseDatosEdit,
        motorBaseDatosEdit,
        hostReferenciaEdit,
        puertoReferenciaEdit,
        secretoConexionKeyEdit
    ) {
        const token = await getToken();
        try {
            const res = await fetch(`${API}/bases-datos-laboratorio/laboratorio`, {
                method: "PUT",
                headers: {
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idBaseDatosLaboratorio: idBaseDatosLaboratorio,
                    idLaboratorioClinico : idLaboratorioClinicoEdit,
                    nombreBaseDatos: nombreBaseDatosEdit,
                    motorBaseDatos: motorBaseDatosEdit,
                    hostReferencia: hostReferenciaEdit,
                    puertoReferencia: puertoReferenciaEdit,
                    secretoConexionKey: secretoConexionKeyEdit,
                    usuarioModificacionId: userId
                })
            })

            if (!res.ok) {
                toasterRef.current?.show({
                    title: `Error al editar la base de datos`,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                setIdBaseDatosLaboratorio("");
                setIdLaboratorioClinicoEdit("");
                setNombreBaseDatosEdit("");
                setMotorBaseDatosEdit("");
                setHostReferenciaEdit("");
                setPuertoReferenciaEdit("");
                setSecretoConexionKeyEdit("");
                await cargarBasesDatos();
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
            }


            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }






    const[idBaseDatosLaboratorio, setIdBaseDatosLaboratorio] = useState("");
    const[idLaboratorioClinicoEdit, setIdLaboratorioClinicoEdit] = useState("");
    const[nombreBaseDatosEdit,setNombreBaseDatosEdit] = useState("");
    const[motorBaseDatosEdit,setMotorBaseDatosEdit] = useState("");
    const[hostReferenciaEdit,setHostReferenciaEdit] = useState("");
    const[puertoReferenciaEdit,setPuertoReferenciaEdit] = useState("");
    const[secretoConexionKeyEdit,setSecretoConexionKeyEdit] = useState("");

    async function seleccionarPorId(idBaseDatosLaboratorio) {
        const token = await getToken();
        try {
            const res = await fetch(`${API}/bases-datos-laboratorio/${idBaseDatosLaboratorio}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                setIdBaseDatosLaboratorio(respuestaBackend.data[0].idBaseDatosLaboratorio ?? "sin datos");
                setIdLaboratorioClinicoEdit(respuestaBackend.data[0].idLaboratorioClinico ?? "sin datos");
                setNombreBaseDatosEdit(respuestaBackend.data[0].nombreBaseDatos ?? "sin datos");
                setMotorBaseDatosEdit(respuestaBackend.data[0].motorBaseDatos ?? "sin datos");
                setHostReferenciaEdit(respuestaBackend.data[0].hostReferencia ?? "sin datos");
                setPuertoReferenciaEdit(respuestaBackend.data[0].puertoReferencia ?? "sin datos");
                setSecretoConexionKeyEdit(respuestaBackend.data[0].secretoConexionKey ?? "sin datos");
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
            }


            if (!respuestaBackend.success) {
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }


    return (
        <main
            className="min-h-screen bg-canvas px-4 py-7 sm:px-7 sm:py-9 lg:px-10 [&_button.border-status-alert-soft]:w-28 [&_button.border-status-alert-soft]:justify-center [&_button.border-status-ok-soft]:w-28 [&_button.border-status-ok-soft]:justify-center">
            <Toaster ref={toasterRef}/>
            <div className="mx-auto max-w-[1440px]">
                <header
                    className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">Administración
                            de datos</p>
                        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Bases de datos
                            de clientes</h1>
                        <p className="mt-2 text-sm text-ink-muted">Consulta el estado de las conexiones configuradas
                            para cada cliente.</p>
                    </div>
                    <button type="button" popoverTarget="formulario-conexion-cliente"
                            className="inline-flex h-10 w-fit items-center justify-center rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-line-strong focus:ring-offset-2">Ingresar
                        Conexión Cliente
                    </button>
                </header>

                <section
                    className="mt-6 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]">
                    <div
                        className="flex flex-col gap-1 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div><h2 className="text-base font-semibold tracking-[-0.02em] text-ink">Conexiones
                            registradas</h2><p className="mt-1 text-xs text-ink-muted">Información de acceso y
                            disponibilidad por cliente.</p></div>
                        <span className="mt-2 text-xs font-medium text-ink-muted sm:mt-0">4 registros</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-[1120px] w-full text-left">
                            <thead
                                className="border-b border-line bg-surface-muted/70 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                            <tr>
                                <th className="px-5 py-3.5">ID </th>
                                <th className="px-4 py-3.5">Nombre del cliente</th>
                                <th className="px-4 py-3.5">Nombre de la base de datos</th>
                                <th className="px-4 py-3.5">Puerto</th>
                                <th className="px-4 py-3.5">Dirección IP / DNS</th>
                                <th className="px-4 py-3.5">Estado de conexión</th>
                                <th className="px-5 py-3.5 text-right">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-line">


                            {dataBasesDatos?.map(data => {
                                return (
                                    <tr key={data[1]}
                                        className="transition hover:bg-surface-muted/50">

                                        <td className="px-5 py-4 font-mono text-xs font-semibold text-status-info">{data[1]}</td>
                                        <td className="px-4 py-4 text-sm font-semibold text-ink">{data[0]}</td>
                                        <td className="px-4 py-4 font-mono text-xs font-medium text-ink-muted">{data[3]}</td>
                                        <td className="px-4 py-4 text-sm font-medium text-ink-muted">{data[6]}</td>
                                        <td className="px-4 py-4 font-mono text-xs font-medium text-ink-muted">{data[5]}</td>
                                        <td className="px-4 py-4"><span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${data[9] === 0 ? "bg-surface-muted text-ink-muted" : "bg-status-ok-soft text-status-ok"}`}> <span
                                            className="size-1.5 rounded-full bg-current"/>
                                            {estado(data[9])}</span></td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={()=>seleccionarPorId(data[1])}
                                                    type="button"
                                                        aria-label="Editar conexión de Laboratorio Central"
                                                        title="Editar conexión"
                                                        popoverTarget="formulario-edicion-conexion"
                                                        className="flex size-8 items-center justify-center rounded-md border border-line bg-surface text-ink-muted transition hover:border-line-strong hover:bg-surface-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-line-strong">
                                                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
                                                         className="size-3.5" stroke="currentColor" strokeWidth="1.8"
                                                         strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M12 20h9"/>
                                                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={()=> {
                                                        let estado = data[9];
                                                        estado ? desactivar(data[1]) : activar(data[1]);
                                                    }}
                                                    type="button"
                                                        className={`inline-flex h-8 items-center rounded-md border bg-surface px-3 text-[11px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-line-strong focus:ring-offset-2 ${data[9] === 0 ? "border-status-ok-soft text-status-ok hover:bg-status-ok-soft" : "border-status-alert-soft text-status-alert hover:bg-status-alert-soft"}`}>{data[9] === 0 ? "Activar" : "Desactivar"}
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div
                        className="border-t border-line bg-surface-muted/50 px-5 py-3 text-xs text-ink-muted">Mostrando <span
                        className="font-semibold text-ink">4</span> bases de datos de clientes.
                    </div>
                </section>

                <div id="formulario-conexion-cliente" popover="auto"
                     className="m-auto max-h-[88vh] w-[min(620px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-5 text-ink shadow-[0_28px_80px_-24px_rgba(11,13,16,0.45)] backdrop:bg-black/35 sm:p-6">
                    <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">Nueva
                                conexión</p>
                            <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-ink">Ingresar conexión de
                                cliente</h2>
                            <p className="mt-1 text-xs text-ink-muted">Completa los datos de referencia de la base de
                                datos.</p>
                        </div>
                        <button type="button" popoverTarget="formulario-conexion-cliente" popoverTargetAction="hide"
                                className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-line-strong">Cerrar
                        </button>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Laboratorio clínico</span>

                            <select
                                onChange={(e) => setIdLaboratorioClinico(e.target.value)}
                                className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink">
                                {
                                    dataLaboratorios.map((dataLaboratorio) => {
                                        return(
                                            <option value={dataLaboratorio.idLaboratorioClinico} key={dataLaboratorio.idLaboratorioClinico}>{dataLaboratorio.nombreLaboratorioClinico}</option>
                                        )
                                    })
                                }
                            </select>

                        </label>


                        <label className="flex flex-col gap-1.5"><span
                            className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Nombre base de datos</span>
                            <input
                                value={nombreBaseDatos}
                                onChange={(e) => setnombreBaseDatos(e.target.value)}
                            type="text" placeholder="Ej. levey_qc_produccion"
                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60"/>
                        </label>


                        <label className="flex flex-col gap-1.5">
                            <span
                            className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Motor base de datos</span>
                            <input
                                value={motorBaseDatos}
                                onChange={(e) => setMotorBaseDatos(e.target.value)}
                            type="text" placeholder="Ej. PostgreSQL"
                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60"/>
                        </label>


                        <label className="flex flex-col gap-1.5"><span
                            className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Host de referencia</span>
                            <input
                                value={hostReferencia}
                                onChange={(e) => setHostReferencia(e.target.value)}
                            type="text" placeholder="Ej. db.cliente.cl"
                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60"/>
                        </label>


                        <label className="flex flex-col gap-1.5">
                            <span
                            className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Puerto de referencia</span>
                            <input
                                value={puertoReferencia}
                                onChange={(e) => setPuertoReferencia(e.target.value)}
                            type="text" placeholder="Ej. 5432"
                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60"/>
                        </label>


                        <label className="flex flex-col gap-1.5 sm:col-span-2"><span
                            className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Clave secreta de conexión</span>
                            <input
                                value={secretoConexionKey}
                                onChange={(e) => setSecretoConexionKey(e.target.value)}
                            type="password" placeholder="Ingrese la clave de conexión"
                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60"/></label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
                        <button type="button" popoverTarget="formulario-conexion-cliente" popoverTargetAction="hide"
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-line px-4 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-line-strong">Cancelar
                        </button>
                        <button
                            onClick={()=>
                                insertar(
                                idLaboratorioClinico,
                                nombreBaseDatos,
                                motorBaseDatos,
                                hostReferencia,
                                puertoReferencia,
                                secretoConexionKey
                            )}
                            type="button"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-xs font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-line-strong focus:ring-offset-2">
                            Guardar
                            conexión
                        </button>
                    </div>
                </div>
                <div id="formulario-edicion-conexion" popover="auto"
                     className="m-auto max-h-[88vh] w-[min(620px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-2xl border border-line bg-surface p-5 text-ink shadow-[0_28px_80px_-24px_rgba(11,13,16,0.45)] backdrop:bg-black/35 sm:p-6">
                    <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                        <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">Conexión
                            existente</p><h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-ink">Edición
                            de Datos</h2><p className="mt-1 text-xs text-ink-muted">Actualiza los datos de referencia de
                            la base de datos.</p></div>
                        <button type="button" popoverTarget="formulario-edicion-conexion" popoverTargetAction="hide"
                                className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">Cerrar
                        </button>
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-1.5"><span
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Laboratorio clínico</span>



                        <select
                            onChange={(e) => setIdLaboratorioClinicoEdit(e.target.value)}
                        className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink">
                            {
                                dataLaboratorios.map((dataLaboratorio) => {
                                    return(
                                        <option value={dataLaboratorio.idLaboratorioClinico} key={dataLaboratorio.idLaboratorioClinico}>{dataLaboratorio.nombreLaboratorioClinico}</option>
                                    )
                                })
                            }
                        </select>


                    </label><label className="flex flex-col gap-1.5"><span
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Nombre base de datos</span>
                        <input
                            value={nombreBaseDatosEdit}
                            onChange={(e) => setNombreBaseDatosEdit(e.target.value)}
                        type="text"
                        className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink"/></label><label
                        className="flex flex-col gap-1.5"><span
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Motor base de datos</span>

                        <input
                            value={motorBaseDatosEdit}
                            onChange={(e) => setMotorBaseDatosEdit(e.target.value)}
                        type="text"
                        className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink"/></label><label
                        className="flex flex-col gap-1.5"><span
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Host de referencia</span>
                        <input
                            value={hostReferenciaEdit}
                            onChange={(e) => setHostReferenciaEdit(e.target.value)}
                        type="text"
                        className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink"/></label><label
                        className="flex flex-col gap-1.5"><span
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Puerto de referencia</span>
                        <input
                            value={puertoReferenciaEdit}
                            onChange={(e) => setPuertoReferenciaEdit(e.target.value)}
                        type="text"
                        className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink"/></label><label
                        className="flex flex-col gap-1.5 sm:col-span-2"><span
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Clave secreta de conexión</span>
                        <input
                            value={secretoConexionKeyEdit}
                            onChange={(e) => setSecretoConexionKeyEdit(e.target.value)}
                        type="password" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink"/></label>
                    </div>
                    <div className="mt-6 flex justify-end gap-3 border-t border-line pt-4">
                        <button type="button" popoverTarget="formulario-edicion-conexion" popoverTargetAction="hide"
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-line px-4 text-xs font-semibold text-ink-muted">Cancelar
                        </button>
                        <button
                            onClick={()=>editar(
                                idBaseDatosLaboratorio,
                                idLaboratorioClinicoEdit,
                                nombreBaseDatosEdit,
                                motorBaseDatosEdit,
                                hostReferenciaEdit,
                                puertoReferenciaEdit,
                                secretoConexionKeyEdit
                            )}
                            type="button"
                                className="inline-flex h-10 items-center justify-center rounded-lg bg-ink px-4 text-xs font-semibold text-white">Guardar
                            cambios
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
