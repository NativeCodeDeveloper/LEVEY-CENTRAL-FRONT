"use client"

import {CheckCircle2, KeyRound, Microscope, Plus, Trash2, Users} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@clerk/nextjs";
import Toaster from "@/components/ui/toast";




export default function PaginaAsignacionPermisos() {


    const toasterRef = useRef(null);

    const API = process.env.NEXT_PUBLIC_API_URL;

    const {
        getToken,
        userId
    } = useAuth();


    const [data, setData] = useState([]);

    async function obtenerListaPermisos() {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/permiso/listarPermisosAcciones`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: `${res.message}`,
                    variant: "error",
                    duration: 1000,
                });
            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    setData(respuestaBackend.data);
                    return;
                }

                if (!respuestaBackend.success) {

                    return toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 1000,
                    });
                }
            }


        } catch (e) {
            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 1000,
            });
        }
    }

    useEffect(() => {
        obtenerListaPermisos();
    }, []);





    const [dataTipos, setDataTipos] = useState([]);
    async function obtenerDatosTipos(){
        try {
            const token = await getToken();

            const res = await fetch(`${API}/tipos-usuarios`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if(!res.ok){

                return toasterRef.current?.show({
                    title: respuestaServidor.message ?? "Error al obtener tipos de usuarios",
                    variant: "error",
                    duration: 1000,
                });

            }

            const respuestaServidor = await res.json();

            if(respuestaServidor.success){
                toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "success",
                    duration: 1000,
                });

                return setDataTipos(respuestaServidor.data);

            }

            if(!respuestaServidor.success){
                return toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "error",
                    duration: 1000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al obtener los tipos de usarios. Error del Servidor",
                variant: "error",
                duration: 1000,
            });
        }
    }

    useEffect(() => {
        obtenerDatosTipos()
    }, []);



    const [permisos, setPermisos] = useState([]);
    async function obtenerPermisos(idTipoUsuario){
        try {
            const token = await getToken();

            const res = await fetch(`${API}/asignacion-permisos/buscar-tipo-usuario/${idTipoUsuario}`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if(!res.ok){

                return toasterRef.current?.show({
                    title: res.message ?? "Error al obtener permisos, el tipo de usuario indicado",
                    variant: "error",
                    duration: 1000,
                });

            }

            const respuestaServidor = await res.json();

            if(respuestaServidor.success){
                toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "success",
                    duration: 1000,
                });

                return setPermisos(respuestaServidor.data);

            }

            if(!respuestaServidor.success){
                return toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "error",
                    duration: 1000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al obtener los permisos. Error del Servidor",
                variant: "error",
                duration: 1000,
            });
        }
    }




    const permisosDemo = permisos.map((permiso) => {
        return        {
            id: permiso[7],
            codigo: permiso[1],
            nombre: permiso[0],
            modulo: permiso[3],
            descripcion: permiso[2]
        }
    })



    const [idPermisoAccion, setIdPermisoAccion] = useState("");
    const [idTipoUsuarios, setIdTipoUsuarios] = useState("");


    async function asignar(idPermisoAccion,idTipoUsuarios){
        try {
            const token = await getToken();

            const res = await fetch(`${API}/asignacion-permisos/crear`,{
                method: "POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idPermisoAccion,
                    idTipoUsuarios,
                    usuarioCreacionId: userId
                })
            });

            if(!res.ok){

                return toasterRef.current?.show({
                    title: res.message ?? "Error",
                    variant: "error",
                    duration: 1000,
                });

            }

            const respuestaServidor = await res.json();

            if(respuestaServidor.success){
                await obtenerPermisos(idTipoUsuarios)
                toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "success",
                    duration: 1000,
                });


            }

            if(!respuestaServidor.success){
                return toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "error",
                    duration: 1000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al obtener los permisos. Error del Servidor",
                variant: "error",
                duration: 1000,
            });
        }
    }








    async function eliminar(idAsignacion){
        try {
            const token = await getToken();

            const res = await fetch(`${API}/asignacion-permisos/eliminar/${idAsignacion}`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(!res.ok){
                return toasterRef.current?.show({
                    title: res.message ?? "Error",
                    variant: "error",
                    duration: 1000,
                });

            }

            const respuestaServidor = await res.json();

            if(respuestaServidor.success){
                await obtenerPermisos(idTipoUsuarios)
                toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "success",
                    duration: 1000,
                });


            }

            if(!respuestaServidor.success){
                return toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "error",
                    duration: 1000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al obtener los permisos. Error del Servidor",
                variant: "error",
                duration: 1000,
            });
        }
    }




    return <main className="min-h-screen bg-canvas px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
        <Toaster ref={toasterRef} />

        <div className="mx-auto max-w-[1440px]">
            <header className="border-b border-line pb-6"><p
                className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">Administración de
                acceso</p><h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Asignación
                de permisos</h1><p className="mt-2 text-sm text-ink-muted">Configura los permisos disponibles para cada
                tipo de usuario del sistema.</p></header>
            <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(320px,0.65fr)_minmax(0,1.35fr)]">
                <div className="h-fit space-y-5">
                    <aside
                        className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0_/_0.02)] sm:p-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-status-info-soft text-status-info">
                                <Users className="size-5"/></div>
                            <div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Perfiles
                                disponibles</p><p className="mt-1 text-xs text-ink-muted">Elige el perfil al que deseas
                                administrar sus permisos.</p></div>
                        </div>
                        <label className="mt-5 block">








                            <select
                                onChange={(e) => {
                                    const idSeleccionado = Number(e.target.value);

                                    setIdTipoUsuarios(idSeleccionado);
                                    obtenerPermisos(idSeleccionado);
                                }}
                                aria-label="Seleccionar perfil"
                                defaultValue=""
                                className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm font-medium text-ink outline-none focus:border-line-strong"
                            >
                                <option value="" disabled>
                                    Selecciona un perfil
                                </option>

                                {dataTipos.map((tipo) => {
                                    return (
                                        <option
                                            value={tipo.idTipoUsuarios}
                                            key={tipo.idTipoUsuarios}
                                        >
                                            {tipo.nombreTipo}
                                        </option>
                                    )
                                })}
                            </select>





                        </label></aside>
                    <section
                        className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgb(0_0_0_/_0.02)] sm:p-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-status-info-soft text-status-info">
                                <KeyRound className="size-5"/></div>
                            <div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Permisos
                                disponibles</p><p className="mt-1 text-xs text-ink-muted">Añade un permiso al perfil
                                seleccionado.</p></div>
                        </div>
                        <label className="mt-5 block">








                            <select
                                onChange={(e) => setIdPermisoAccion(e.target.value)}
                                aria-label="Seleccionar permiso" defaultValue="" className="h-10 w-full rounded-lg border border-line bg-canvas px-3 text-sm font-medium text-ink outline-none focus:border-line-strong">

                            <option value="" disabled>Selecciona un permiso</option>
                                {
                                    data.map((permiso) => (
                                        <option
                                            onChange={()=>{
                                                setIdPermisoAccion(permiso.idPermisoAccion)
                                            }}
                                            key={permiso.idPermisoAccion} value={permiso.idPermisoAccion}>{permiso.nombrePermiso}</option>
                                    ))
                                }

                        </select>

                        </label>
                        <button
                            onClick={() => asignar(idPermisoAccion,idTipoUsuarios)}
                            type="button"
                                className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink px-3 text-sm font-semibold text-white transition hover:bg-accent-strong">
                            <Plus className="size-4"/>Asignar permiso
                        </button>
                    </section>
                </div>
                <section
                    className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]">
                    <div
                        className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-bold tracking-[-0.03em] text-ink sm:text-2xl">Permisos asignados al
                            perfil</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-[880px] w-full text-left">
                            <thead
                                className="border-b border-line bg-surface-muted/70 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                            <tr>
                                <th className="px-4 py-3.5">Nombre del permiso</th>
                                <th className="px-4 py-3.5">Código</th>
                                <th className="px-4 py-3.5">Módulo</th>
                                <th className="px-4 py-3.5">Descripción</th>
                                <th className="px-4 py-3.5 text-right">Acción</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-line">{permisosDemo.map((permiso) => <tr
                                key={permiso.id} className="transition hover:bg-surface-muted/50">
                                <td className="px-4 py-4 font-semibold text-ink">{permiso.nombre}</td>
                                <td className="px-4 py-4 font-mono text-[11px] font-semibold text-status-info">{permiso.codigo}</td>
                                <td className="px-4 py-4"><span
                                    className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted"><Microscope
                                    className="size-3.5 text-ink-faint"/>{permiso.modulo}</span></td>
                                <td className="max-w-xs px-4 py-4 text-sm leading-5 text-ink-muted">{permiso.descripcion}</td>
                                <td className="px-4 py-4 text-right">
                                    <button onClick={() => eliminar(permiso.id)} type="button" aria-label={`Quitar permiso ${permiso.nombre}`}
                                            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-50">
                                        <Trash2 className="size-3.5"/>Quitar
                                    </button>
                                </td>
                            </tr>)}</tbody>
                        </table>
                    </div>
                    <div className="flex justify-end border-t border-line bg-surface-muted/50 px-5 py-3">

                    </div>
                </section>
            </section>
        </div>
    </main>;
}
