"use client"

import {CheckCircle2, ClipboardCheck, Pencil, Plus, Power, ShieldCheck} from "lucide-react";
import Toaster from "@/components/ui/toast";
import {useEffect, useState} from "react";
import { useRef } from "react";
import {useAuth} from "@clerk/nextjs";

// Datos simulados mientras la pantalla no está conectada con la API.


function Campo({etiqueta, placeholder}) {
    return <label className="flex flex-col gap-1.5"><span
        className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">{etiqueta}</span><input
        placeholder={placeholder}
        className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"/></label>;
}

export default function PaginaPermisosSistema() {
    const toasterRef = useRef(null);
    const formularioPermisoRef = useRef(null);
    const API = process.env.NEXT_PUBLIC_API_URL;

    const {
        getToken,
        userId
    } = useAuth();




    const [data , setData] = useState([]);
    async function obtenerListaPermisos(){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/permiso/listarPermisosAcciones`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }else{

                const respuestaBackend =await res.json();

                if (respuestaBackend.success) {
                    setData(respuestaBackend.data);
                    return;
                }

                if (!respuestaBackend.success) {

                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 4000,
                    });
                }
            }


        }catch (e) {
          return  toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }

    useEffect(() => {
        obtenerListaPermisos();
    }, []);




    const[codigoPermiso, setCodigoPermiso]=useState("");
    const[nombrePermiso, setnombrePermiso]=useState("");
    const[modulo,setmodulo]=useState("");
    const[accion, setaccion]=useState("");
    const[descripcion, setdescripcion]=useState("");

    async function insertar(
        codigoPermiso,
        nombrePermiso,
        modulo,
        accion,
        descripcion
    ){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/permiso/crearPermisoAccion`,{
                method: "POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    codigoPermiso,
                    nombrePermiso,
                    modulo,
                    accion,
                    descripcion,
                    usuarioCreacionId: userId
                }),
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }else{

                const respuestaBackend =await res.json();

                if (respuestaBackend.success) {
                    setCodigoPermiso("");
                    setnombrePermiso("");
                    setmodulo("");
                    setaccion("");
                    setdescripcion("");
                    formularioPermisoRef.current?.hidePopover();
                    await obtenerListaPermisos();
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 4000,
                    });
                }

                if (!respuestaBackend.success) {
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 4000,
                    });
                }
            }


        }catch (e) {
            return  toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }




    const[idPermisoAccion,setidPermisoAccion]=useState("");
    const[codigoPermisoEdit, setCodigoPermisoEdit]=useState("");
    const[nombrePermisoEdit, setNombrePermisoEdit]=useState("");
    const[moduloEdit, setModuloEdit]=useState("");
    const[accionEdit, setAccionEdit]=useState("");
    const[descripcionEdit, setDescripcionEdit]=useState("");

    async function actualizar(
        idPermisoAccion,
        codigoPermisoEdit,
        nombrePermisoEdit,
        moduloEdit,
        accionEdit,
        descripcionEdit
    ){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/permiso/actualizarPermisoAccion`,{
                method: "PUT",
                headers:{
                    "Accept":"application/json",
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idPermisoAccion: idPermisoAccion,
                    codigoPermiso: codigoPermisoEdit,
                    nombrePermiso: nombrePermisoEdit,
                    modulo: moduloEdit,
                    accion: accionEdit,
                    descripcion: descripcionEdit,
                    usuarioModificacionId: userId
                }),
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }else{

                const respuestaBackend =await res.json();

                if (respuestaBackend.success) {
                    setidPermisoAccion("");
                    setCodigoPermisoEdit("");
                    setNombrePermisoEdit("");
                    setModuloEdit("");
                    setAccionEdit("");
                    setDescripcionEdit("");
                    document.getElementById("editar-formulario-permiso")?.hidePopover();
                    await obtenerListaPermisos();
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 4000,
                    });
                }

                if (!respuestaBackend.success) {
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 4000,
                    });
                }
            }


        }catch (e) {
            return  toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }




    async function buscarPermisoAccionPorId(idPermisoAccion){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/permiso/buscarPermisoAccionPorId/${idPermisoAccion}`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }else{

                const respuestaBackend = await res.json();


                if (respuestaBackend.success) {
                    setidPermisoAccion(respuestaBackend.data.idPermisoAccion);
                    setCodigoPermisoEdit(respuestaBackend.data.codigoPermiso);
                    setNombrePermisoEdit(respuestaBackend.data.nombrePermiso);
                    setModuloEdit(respuestaBackend.data.modulo);
                    setAccionEdit(respuestaBackend.data.accion);
                    setDescripcionEdit(respuestaBackend.data.descripcion);

                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 4000,
                    });

                }

                if (!respuestaBackend.success) {
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 4000,
                    });
                }
            }

        }catch (e) {
            return  toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }








    async function activar(idPermisoAccion){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/permiso/activarPermisoAccion/${idPermisoAccion}`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }else{

                const respuestaBackend = await res.json();


                if (respuestaBackend.success) {
                    await obtenerListaPermisos();
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 4000,
                    });
                }

                if (!respuestaBackend.success) {
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 4000,
                    });
                }
            }

        }catch (e) {
            return  toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }






    async function desactivar(idPermisoAccion){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/permiso/desactivarPermisoAccion/${idPermisoAccion}`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }else{

                const respuestaBackend = await res.json();


                if (respuestaBackend.success) {
                    await obtenerListaPermisos();
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 4000,
                    });
                }

                if (!respuestaBackend.success) {
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 4000,
                    });
                }
            }

        }catch (e) {
            return  toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }

    const permisosDemo = data.map(permiso =>{
        return {
            id: permiso.idPermisoAccion,
            codigo: permiso.codigoPermiso,
            nombre: permiso.nombrePermiso,
            modulo: permiso.modulo,
            accion: permiso.accion,
            descripcion: permiso.descripcion,
            activo: permiso.activo,
            creacion: permiso.fechaCreacion,
            modificacion: permiso.fechaModificacion,
            creador: permiso.usuarioCreacionId,
            modificador: permiso.usuarioModificacionId
        }
    })


    // Estructura principal de la pantalla de administración de permisos.
    return <main className="min-h-screen bg-canvas px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
        <Toaster ref={toasterRef} />

        <div className="mx-auto max-w-[1440px]">
            <header
                className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">Administración
                    de acceso</p><h1
                    className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Permisos del
                    sistema</h1><p className="mt-2 text-sm text-ink-muted">Define las acciones autorizadas por módulo
                    dentro de Levey QC.</p></div>
                <button type="button" popoverTarget="formulario-permiso"
                        className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong">
                    <Plus className="size-4"/>Nuevo permiso
                </button>
            </header>
            <section
                className="mt-6 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]">
                <div className="border-b border-line p-4">
                    <div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Listado de permisos</p><p
                        className="mt-1 text-xs text-ink-muted">Acciones disponibles y trazabilidad de
                        administración</p></div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-[1160px] w-full text-left">
                        <thead
                            className="border-b border-line bg-surface-muted/70 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                        <tr>
                            <th className="px-5 py-3.5">ID</th>
                            <th className="px-4 py-3.5">Código / permiso</th>
                            <th className="px-4 py-3.5">Nombre permiso</th>
                            <th className="px-4 py-3.5">Módulo</th>
                            <th className="px-4 py-3.5">Acción</th>
                            <th className="px-4 py-3.5">Descripción</th>
                            <th className="px-4 py-3.5">Estado</th>
                            <th className="px-5 py-3.5 text-right">Acciones</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-line">{permisosDemo.map((permiso) => <tr key={permiso.id}
                                                                                                   className="transition hover:bg-surface-muted/50">
                            <td className="px-5 py-4 text-sm font-medium text-ink-muted">#{permiso.id}</td>
                            <td className="px-4 py-4"><p
                                className="font-mono text-[11px] font-semibold text-status-info">{permiso.codigo}</p>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-ink-muted">{permiso.nombre}</td>
                            <td className="px-4 py-4 text-sm font-medium text-ink-muted">{permiso.modulo}</td>
                            <td className="px-4 py-4"><span
                                className="rounded-md bg-surface-muted px-2 py-1 text-xs font-semibold text-ink-muted">{permiso.accion}</span>
                            </td>
                            <td className="max-w-[280px] px-4 py-4 text-sm leading-5 text-ink-muted">{permiso.descripcion}</td>
                            <td className="px-4 py-4"><span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${permiso.activo ? "bg-status-ok-soft text-status-ok" : "bg-surface-muted text-ink-muted"}`}><span
                                className="size-1.5 rounded-full bg-current"/>{permiso.activo ? "Activo" : "Inactivo"}</span>
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={()=>buscarPermisoAccionPorId(permiso.id)}
                                        type="button" popoverTarget="editar-formulario-permiso"
                                            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[11px] font-semibold text-ink transition hover:border-line-strong hover:bg-surface-muted">
                                        <Pencil className="size-3.5 text-ink-muted"/>Editar
                                    </button>
                                    <button
                                        onClick={()=>{
                                            const estado = permiso.activo;
                                            if (estado===0) {
                                                activar(permiso.id)
                                            }
                                            if (estado===1){
                                                desactivar(permiso.id)
                                            }

                                        }}
                                        type="button"
                                            title={permiso.activo ? "Desactivar permiso" : "Activar permiso"}
                                            className={`flex size-8 items-center justify-center rounded-md border transition ${permiso.activo ? "border-status-alert-soft bg-surface text-status-alert hover:bg-status-alert-soft" : "border-status-ok-soft bg-surface text-status-ok hover:bg-status-ok-soft"}`}>
                                        <Power className="size-3.5"/></button>
                                </div>
                            </td>
                        </tr>)}</tbody>
                    </table>
                </div>
                <div
                    className="border-t border-line bg-surface-muted/50 px-5 py-3 text-xs text-ink-muted">Mostrando <span
                    className="font-semibold text-ink">{permisosDemo.length}</span> permisos registrados.
                </div>
            </section>
            <div ref={formularioPermisoRef} id="formulario-permiso" popover="auto"
                 className="m-auto max-h-[88vh] w-[min(620px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-2xl backdrop:bg-black/35 sm:p-6">
                <div className="flex items-center gap-3 border-b border-line pb-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-ink text-white">
                        <ClipboardCheck className="size-5"/></div>
                    <div className="flex-1">
                        <p className="font-semibold tracking-[-0.02em] text-ink"> Permiso del sistema</p>
                        <p className="text-xs text-ink-muted">Creación o edición visual de permiso</p></div>
                    <button type="button" popoverTarget="formulario-permiso" popoverTargetAction="hide"
                            className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">Cerrar
                    </button>
                </div>
                <div className="mt-5 space-y-4">


                    {/* Campos principales del permiso: código, nombre, módulo y acción. */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Código único que identifica el permiso. */}
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Código de permiso</span>
                            <input
                                value={codigoPermiso}
                                onChange={e => setCodigoPermiso(e.target.value.toUpperCase())}
                                placeholder="Ej. QC.VALIDAR" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong" />
                        </label>
                        {/* Nombre descriptivo que verá el usuario. */}
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Nombre del permiso</span>
                            <input
                                value={nombrePermiso}
                                onChange={(e)=> setnombrePermiso(e.target.value)}
                                placeholder="Ej. Validar controles QC" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong" />
                        </label>
                        {/* Módulo al que pertenece el permiso. */}
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Módulo</span>
                            <input
                                value={modulo}
                                onChange={e => setmodulo(e.target.value)}
                                placeholder="Ej. Análisis QC" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong" />
                        </label>
                        {/* Acción que será autorizada. */}
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Acción</span>
                            <input
                                value={accion}
                                onChange={e => setaccion(e.target.value)}
                                placeholder="Ej. Validar" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong" />
                        </label>
                    </div>
                    <label
                        className="flex flex-col gap-1.5"><span
                        className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Descripción</span>
                        <textarea
                            value={descripcion}
                            onChange={e => setdescripcion(e.target.value)}
                        rows="4" placeholder="Describe qué permite hacer este permiso..."
                        className="resize-none rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"/></label><label
                    className="flex flex-col gap-1.5">

                </label>
                    <button
                        onClick={() => insertar(
                            codigoPermiso,
                            nombrePermiso,
                            modulo,
                            accion,
                            descripcion
                        )}
                        type="button"
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-white transition hover:bg-accent-strong">
                        <CheckCircle2 className="size-4"/>Guardar permiso
                    </button>
                    <p className="text-center text-[11px] leading-4 text-ink-faint">Acción visual sin conexión ni
                        persistencia configurada.</p></div>
            </div>
        </div>



        {/* Popup independiente para actualizar un permiso existente. */}
        <div id="editar-formulario-permiso" popover="auto"
             className="m-auto max-h-[88vh] w-[min(620px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-2xl backdrop:bg-black/35 sm:p-6">
            {/* Encabezado específico del formulario de edición. */}
            <div className="flex items-center gap-3 border-b border-line pb-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-status-info text-white">
                    <Pencil className="size-5"/>
                </div>
                <div className="flex-1">
                    <p className="font-semibold tracking-[-0.02em] text-ink">Actualizar permiso</p>
                    <p className="text-xs text-ink-muted">Actualizar información del permiso seleccionado.</p>
                </div>
                <button type="button" popoverTarget="editar-formulario-permiso" popoverTargetAction="hide"
                        className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">
                    Cerrar
                </button>
            </div>

                {/* Campos específicos para modificar los datos del permiso. */}
            <div className="mt-5 space-y-4">
                <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint"> Código / Permiso </span>
                    <input
                        value={codigoPermisoEdit}
                        onChange={e => setCodigoPermisoEdit(e.target.value.toUpperCase())}
                        placeholder="Ej. QC.VALIDAR"
                           className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"/>
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Nombre permiso</span>
                        <input
                            value={nombrePermisoEdit}
                            onChange={e => setNombrePermisoEdit(e.target.value)}
                            placeholder="Ej. Validar controles QC"
                               className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"/>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Módulo</span>
                        <input
                            value={moduloEdit}
                            onChange={e => setModuloEdit(e.target.value)}
                            placeholder="Ej. Análisis QC"
                               className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"/>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Acción</span>
                        <input
                            value={accionEdit}
                            onChange={e => setAccionEdit(e.target.value)}
                            placeholder="Ej. Validar"
                               className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"/>
                    </label>
                </div>
                <label className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Descripción</span>
                    <textarea
                        value={descripcionEdit}
                        onChange={e => setDescripcionEdit(e.target.value)}
                        rows="4" placeholder="Actualiza la descripción del permiso..."
                              className="resize-none rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"/>
                </label>
                <button
                    onClick={() =>
                        actualizar(
                            idPermisoAccion,
                            codigoPermisoEdit,
                            nombrePermisoEdit,
                            moduloEdit,
                            accionEdit,
                            descripcionEdit
                        )}

                    type="button"
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-white transition hover:bg-accent-strong">
                    <CheckCircle2 className="size-4"/>
                    Actualizar
                </button>
            </div>
        </div>
    </main>;
}
