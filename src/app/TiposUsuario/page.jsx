"use client"
import {
    CheckCircle2,
    Pencil,
    Plus,
    Power,
    Tags,
} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import Toaster from "@/components/ui/toast";
import {useAuth} from "@clerk/nextjs";




// Datos estáticos utilizados para representar los tipos de usuario.




export default function PaginaTiposUsuario() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const toasterRef = useRef(null);
    const formularioTipoUsuarioRef = useRef(null);

    const {
        getToken,
        userId
    } = useAuth();

    const [dataTipos, setDataTipos] = useState([]);

    const tiposUsuarioDemo = dataTipos.map(data => {
        return {
            id: data.idTipoUsuarios,
            nombre: data.nombreTipo,
            descripcion: data.descripcion,
            activo: data.activo,
        };
    });

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
                    duration: 4000,
                });

            }

            const respuestaServidor = await res.json();

            if(respuestaServidor.success){
                toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "success",
                    duration: 4000,
                });

                return setDataTipos(respuestaServidor.data);

            }

            if(!respuestaServidor.success){
                return toasterRef.current?.show({
                    title: `${respuestaServidor.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }
        }catch (e) {
          return toasterRef.current?.show({
                title: "Error al obtener los tipos de usarios. Error del Servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }

    useEffect(() => {
        obtenerDatosTipos()
    }, []);












    async function crearTipo(nombre,descripcion){
        try {
            const token = await getToken();

            const res = await fetch(`${API}/tipos-usuarios`,{
                method: "POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombreTipo: nombre,
                    descripcion : descripcion,
                    usuarioCreacionId: userId
                }),

            });

            if(!res.ok){

                return toasterRef.current?.show({
                    title:"No fue posible crear el tipo de usario , intente mas tarde",
                    variant: "error",
                    duration: 4000,
                });

            }

            const respuestaInsercion= await res.json();

            if(respuestaInsercion.success){
                toasterRef.current?.show({
                    title: `${respuestaInsercion.message}`,
                    variant: "success",
                    duration: 4000,
                });

                formularioTipoUsuarioRef.current?.hidePopover();
                await obtenerDatosTipos();
                return;

            }

            if(!respuestaInsercion.success){
                return toasterRef.current?.show({
                    title: `${respuestaInsercion.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al insertar  tipos de usuario. Error del Servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }







    async function desactivar(idTipoUsuarios){
        try {
            const token = await getToken();

            const res = await fetch(`${API}/tipos-usuarios/${idTipoUsuarios}/desactivar`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(!res.ok){

                return toasterRef.current?.show({
                    title: `No fue posible desactivar el tipo de usuario , intente mas tarde`,
                    variant: "error",
                    duration: 4000,
                });

            }

            const respuestaBackend = await res.json();

            if(respuestaBackend.success){
                toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });

                await obtenerDatosTipos();
                return;

            }

            if(!respuestaBackend.success){
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al activar  tipos de usuario. Error del Servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }







    async function activar(idTipoUsuarios){
        try {
            const token = await getToken();

            const res = await fetch(`${API}/tipos-usuarios/${idTipoUsuarios}/activar`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(!res.ok){

                return toasterRef.current?.show({
                    title: `No fue posible activar el tipo de usuario , intente mas tarde`,
                    variant: "error",
                    duration: 4000,
                });

            }

            const respuestaBackend = await res.json();

            if(respuestaBackend.success){
                toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });

                await obtenerDatosTipos();
                return;

            }

            if(!respuestaBackend.success){
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al activar  tipos de usuario. Error del Servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }






    const[nombre, setNombre] = useState("");
    const[descripcion, setDescripcion] = useState("");

    async function actualizar(nombre, descripcion,idTipoUsuarios){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/tipos-usuarios`,{
                method: "PUT",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombreTipo: nombre,
                    descripcion: descripcion,
                    idTipoUsuarios :idTipoUsuarios,
                    usuarioModificacionId: userId
                }),
            });


            if(!res.ok){
                return toasterRef.current?.show({
                    title: `No fue posible actualizar el tipo de usuario , intente mas tarde`,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaBackend = await res.json();

            if(respuestaBackend.success){
                toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });

                document.getElementById(`editar-tipo-usuario-${idTipoUsuarios}`)?.hidePopover();
                setNombre("");
                setDescripcion("");
                await obtenerDatosTipos();
                return;

            }

            if(!respuestaBackend.success){
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al actualizar  tipos de usuario. Error del Servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }






    async function buscarNombre(nombre){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/tipos-usuarios/buscar?nombreTipo=${nombre}`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(!res.ok){

                return toasterRef.current?.show({
                    title: `No fue posible buscar el tipo de usuario , intente mas tarde`,
                    variant: "error",
                    duration: 4000,
                });

            }

            const respuestaBackend = await res.json();

            if(respuestaBackend.success){
                toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });

                await obtenerDatosTipos();
                return;

            }

            if(!respuestaBackend.success){
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }
        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al buscar  tipos de usuario. Error del Servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }



    return (
        // Contenedor principal de la pantalla.
        <main className="min-h-screen bg-canvas px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
            <Toaster ref={toasterRef} />
            <div className="mx-auto max-w-[1440px]">
                {/* Encabezado de la página y botón para crear un nuevo tipo de usuario. */}
                <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                            Administración de acceso
                        </p>

                        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">
                            Tipo de Usuario
                        </h1>

                        <p className="mt-2 text-sm text-ink-muted">
                            Define los perfiles disponibles para asignar permisos y
                            responsabilidades dentro de Levey QC.
                        </p>
                    </div>

                    {/* Botón visual que permite abrir el formulario de creación. */}
                    <button
                        type="button"
                        popoverTarget="formulario-tipo-usuario"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong"
                    >
                        <Plus className="size-4" />
                        Nuevo tipo de usuario
                    </button>
                </header>

                {/* Sección que contiene el listado de tipos de usuario registrados. */}
                <section className="mt-6 overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]">
                    {/* Encabezado del listado. */}
                    <div className="border-b border-line p-4">
                        <div>
                            <p className="text-base font-semibold tracking-[-0.02em] text-ink">
                                Tipos registrados
                            </p>

                            <p className="mt-1 text-xs text-ink-muted">
                                Perfiles disponibles para la gestión de usuarios
                            </p>
                        </div>
                    </div>

                    {/* Tabla responsiva con la información de cada tipo de usuario. */}
                    <div className="overflow-x-auto">
                        <table className="min-w-[840px] w-full text-left">
                            {/* Encabezados de las columnas de la tabla. */}
                            <thead className="border-b border-line bg-surface-muted/70 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                            <tr>
                                <th className="w-20 px-5 py-3.5">ID</th>
                                <th className="px-4 py-3.5">Tipo de usuario</th>
                                <th className="px-4 py-3.5">Descripción</th>
                                <th className="px-4 py-3.5">Estado</th>
                                <th className="px-5 py-3.5 text-right">Acciones</th>
                            </tr>
                            </thead>

                            {/* Cuerpo de la tabla con los tipos de usuario. */}
                            <tbody className="divide-y divide-line">
                            {tiposUsuarioDemo.map((tipo) => (
                                // Fila individual de cada tipo de usuario.
                                <tr
                                    key={tipo.id}
                                    className="transition hover:bg-surface-muted/50"
                                >
                                    {/* Identificador del tipo de usuario. */}
                                    <td className="px-5 py-4 text-sm font-medium text-ink-muted">
                                        #{tipo.id}
                                    </td>

                                    {/* Nombre e ícono representativo del tipo de usuario. */}
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg bg-status-info-soft text-status-info">
                                                <Tags className="size-4" />
                                            </div>

                                            <p className="font-semibold text-ink">
                                                {tipo.nombre}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Descripción de las responsabilidades del perfil. */}
                                    <td className="max-w-md px-4 py-4 text-sm leading-5 text-ink-muted">
                                        {tipo.descripcion}
                                    </td>

                                    {/* Estado visual del tipo de usuario. */}
                                    <td className="px-4 py-4">
                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                tipo.activo
                                    ? "bg-status-ok-soft text-status-ok"
                                    : "bg-surface-muted text-ink-muted"
                            }`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                            {tipo.activo ? "Activo" : "Inactivo"}
                        </span>
                                    </td>

                                    {/* Acciones visuales disponibles para cada tipo de usuario. */}
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            {/* Botón visual para editar el tipo de usuario. */}
                                            <button
                                                type="button"
                                                popoverTarget={`editar-tipo-usuario-${tipo.id}`}
                                                aria-controls={`editar-tipo-usuario-${tipo.id}`}
                                                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[11px] font-semibold text-ink transition hover:border-line-strong hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-line-strong focus:ring-offset-2"
                                            >
                                                <Pencil className="size-3.5 text-ink-muted" />
                                                Editar
                                            </button>

                                            {/* Botón visual para activar o desactivar el tipo de usuario. */}
                                            <button
                                                onClick={() => tipo.activo ? desactivar(tipo.id) : activar(tipo.id)}
                                                type="button"
                                                title={
                                                    tipo.activo
                                                        ? "Desactivar tipo"
                                                        : "Activar tipo"
                                                }
                                                className={`flex size-8 items-center justify-center rounded-md border transition ${
                                                    tipo.activo
                                                        ? "border-status-alert-soft bg-surface text-status-alert hover:bg-status-alert-soft"
                                                        : "border-status-ok-soft bg-surface text-status-ok hover:bg-status-ok-soft"
                                                }`}
                                            >
                                                <Power className="size-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {tiposUsuarioDemo.map((tipo) => (
                    <div
                        key={`editar-${tipo.id}`}
                        id={`editar-tipo-usuario-${tipo.id}`}
                        popover="auto"
                        aria-labelledby={`titulo-editar-tipo-${tipo.id}`}
                        className="m-auto max-h-[88vh] w-[min(600px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-5 text-ink shadow-[0_28px_80px_-24px_rgba(11,13,16,0.45)] backdrop:bg-black/40 sm:p-6"
                    >
                        <div className="flex items-start gap-3 border-b border-line pb-5">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-status-info-soft text-status-info">
                                <Pencil className="size-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
                                    Edición del perfil
                                </p>

                                <h2
                                    id={`titulo-editar-tipo-${tipo.id}`}
                                    className="mt-1 text-xl font-semibold tracking-[-0.035em] text-ink"
                                >
                                    Editar tipo de usuario
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-ink-muted">
                                    Actualiza la información del perfil seleccionado.
                                </p>
                            </div>

                            <button
                                type="button"
                                popoverTarget={`editar-tipo-usuario-${tipo.id}`}
                                popoverTargetAction="hide"
                                aria-label="Cerrar edición"
                                className="shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-line-strong"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-status-info-soft bg-status-info-soft/50 px-3.5 py-3">
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-status-info">
                                    Perfil seleccionado
                                </p>

                                <p className="mt-1 truncate text-sm font-semibold text-ink">
                                    #{tipo.id} · {tipo.nombre}
                                </p>
                            </div>

                            <span
                                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                    tipo.activo
                                        ? "bg-status-ok-soft text-status-ok"
                                        : "bg-surface text-ink-muted"
                                }`}
                            >
                                <span className="size-1.5 rounded-full bg-current" />
                                {tipo.activo ? "Activo" : "Inactivo"}
                            </span>
                        </div>

                        <div className="mt-5 space-y-4">
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                    Nombre del tipo
                                </span>

                                <input
                                    value={nombre}
                                    onChange={(e)=>setNombre(e.target.value)}
                                    placeholder="Ej. Tecnólogo Médico"
                                    className="h-11 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60"
                                />
                            </label>

                            <label className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                    Descripción
                                </span>

                                <textarea
                                    value={descripcion}
                                    onChange={e => setDescripcion(e.target.value)}
                                    placeholder="Describe las responsabilidades de este perfil..."
                                    rows="4"
                                    className="resize-none rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm leading-5 text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60"
                                />
                            </label>

                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-line pt-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                popoverTarget={`editar-tipo-usuario-${tipo.id}`}
                                popoverTargetAction="hide"
                                className="inline-flex h-10 items-center justify-center rounded-lg border border-line px-4 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-line-strong"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={()=>actualizar(
                                    nombre,
                                    descripcion,
                                    tipo.id
                                )}
                                type="button"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-xs font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-line-strong focus:ring-offset-2"
                            >
                                <CheckCircle2 className="size-4" />
                                Guardar cambios
                            </button>
                        </div>

                        <p className="mt-3 text-center text-[11px] leading-4 text-ink-faint">
                            Revisa los datos antes de confirmar la edición.
                        </p>
                    </div>
                ))}

                {/* Formulario visual para crear un nuevo tipo de usuario. */}
                <div
                    id="formulario-tipo-usuario"
                    ref={formularioTipoUsuarioRef}
                    popover="auto"
                    className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-5 shadow-2xl backdrop:bg-black/35 sm:p-6"
                >
                    {/* Encabezado del formulario y botón para cerrarlo. */}
                    <div className="flex items-center gap-3 border-b border-line pb-4">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-ink text-white">
                            <Tags className="size-5" />
                        </div>

                        <div className="flex-1">
                            <p className="font-semibold tracking-[-0.02em] text-ink">
                                Nuevo tipo de usuario
                            </p>

                            <p className="text-xs text-ink-muted">
                                Configuración visual de perfil
                            </p>
                        </div>

                        <button
                            type="button"
                            popoverTarget="formulario-tipo-usuario"
                            popoverTargetAction="hide"
                            className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink"
                        >
                            Cerrar
                        </button>
                    </div>

                    {/* Campos visuales del formulario. */}
                    <div className="mt-5 space-y-4">
                        {/* Campo para ingresar el nombre del tipo de usuario. */}
                        <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Nombre del tipo
                </span>

                            <input
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej. Tecnólogo Médico General"
                                className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"
                            />
                        </label>

                        {/* Campo para ingresar la descripción del perfil. */}
                        <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Descripción
                </span>

                            <textarea
                                placeholder="Describe las responsabilidades de este perfil..."
                                rows="4"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="resize-none rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-line-strong"
                            />
                        </label>


                        {/* Botón visual para guardar el tipo de usuario. */}
                        <button
                            onClick={() => crearTipo(nombre,descripcion)}
                            type="button"
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-white transition hover:bg-accent-strong"
                        >
                            <CheckCircle2 className="size-4" />
                            Guardar tipo de usuario
                        </button>

                        {/* Indicación de que el formulario no tiene persistencia configurada. */}
                        <p className="text-center text-[11px] leading-4 text-ink-faint">
                            Acción visual sin conexión ni persistencia configurada.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
