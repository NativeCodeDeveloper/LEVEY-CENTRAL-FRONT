"use client"
import {Building2, CheckCircle2, Pencil, Power, Search, ShieldCheck, UserPlus} from "lucide-react";
import {useEffect, useState} from "react";
import { useRef } from "react";
import Toaster from "@/components/ui/toast";
import {useAuth} from "@clerk/nextjs";




export default function PaginaUsuariosSistema() {
    const toasterRef = useRef(null);
    const API = process.env.NEXT_PUBLIC_API_URL;

    const {
        getToken,
        userId
    } = useAuth();





    const [dataLaboratorios, setDataLaboratorios]=useState([]);


    async function cargarLaboratorios(){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/laboratorios-clinicos`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
               return  toasterRef.current?.show({
                    title: "Error al cargar los Laboratorios Clinicos",
                    variant: "error",
                    duration: 4000,
                });
            }


            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                return setDataLaboratorios(respuestaBackend.data);
            }

            if (!respuestaBackend.success) {

              return   toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        }catch (e) {
            toasterRef.current?.show({
                title: "Error al cargar los Laboratorios Clinicos",
                variant: "error",
                duration: 4000,
            });
        }

    }
    useEffect(() => {
        cargarLaboratorios();
    }, []);









    const [dataPerfiles, setDataPerfiles]=useState([]);

    async function cargarPerfiles(){
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

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Error al cargar los perfiles de ususarios",
                    variant: "error",
                    duration: 4000,
                });
            }


            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                return  setDataPerfiles(respuestaBackend.data);
            }

            if (!respuestaBackend.success) {
                return   toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        }catch (e) {
            toasterRef.current?.show({
                title: "Error al cargar los perfiles de ususarios",
                variant: "error",
                duration: 4000,
            });
        }
    }

    useEffect(() => {
        cargarPerfiles();
    }, []);




    const [clerkUserId, setClerkUserId] = useState("");
    const[nombre, setNombre]=useState("");
    const[apellido, setApellido]=useState("");
    const[rut, setRut]=useState("");
    const[email, setEmail]=useState("");
    const[profesion, setProfesion]=useState("");
    const[username, setUsername]=useState("");
    const[telefono, setTelefono]=useState("");
    const [idLaboratorioClinico, setIdLaboratorioClinico] = useState("");
    const[idTipoUsuarios, setIdTipoUsuarios]=useState("");

    async function crearUsuario(
        nombre,
        apellido,
        rut,
        email,
        profesion,
        username,
        telefono,
        idLaboratorioClinico,
        idTipoUsuarios
    ){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/usuarios-levey/insertar`,{
                method: "POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    clerkUserId: `exaple?1313123`,
                    nombre,
                    apellido,
                    rut,
                    email,
                    profesion,
                    username,
                    telefono,
                    idLaboratorioClinico,
                    idTipoUsuarios,
                    usuarioCreacionId: userId
                }),
            });

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Error al crear el nuevo usuario",
                    variant: "error",
                    duration: 4000,
                });
            }


            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
            }

            if (!respuestaBackend.success) {
                return   toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        }catch (e) {
            toasterRef.current?.show({
                title: "Error al crear el nuevo usuario. Error en el servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }

    // Datos simulados utilizados únicamente para representar el listado visual.
    const usuariosDemo = [
        {
            id: 1,
            nombre: "Nicolás Castillo",
            iniciales: "NC",
            nombreUsuario: "nicolas.castillo",
            rol: "Administrador QC",
            laboratorio: "Laboratorio Central",
            activo: true,
            acceso: "Hoy, 09:42"
        }
    ];
    return (
        <main className="min-h-screen bg-canvas px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
            <Toaster ref={toasterRef} />
            <div className="mx-auto max-w-[1440px]">
                {/* Encabezado principal: presenta el título, la descripción y el acceso al formulario. */}
                <header
                    className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div><p
                        className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">Administración
                        de acceso</p><h1
                        className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">Usuarios del
                        sistema</h1><p className="mt-2 text-sm text-ink-muted">Gestiona las identidades, roles y
                        pertenencia a laboratorios de Levey QC.</p></div>
                    <div className="flex items-center gap-3">
                        <button type="button" popoverTarget="formulario-nuevo-usuario"
                                className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong">
                            <UserPlus className="size-4"/>Nuevo usuario
                        </button>
                    </div>
                </header>

                {/* Sección principal: contiene el buscador, el listado y el formulario visual de usuarios. */}
                <section className="mt-6">
                    <div className="rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]">
                        {/* Cabecera del listado: identifica la tabla e incluye el buscador visual. */}
                        <div
                            className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Listado de
                                usuarios</p><p className="mt-1 text-xs text-ink-muted">Identidades registradas en la
                                plataforma</p></div>
                            <div className="relative w-full sm:w-64"><Search
                                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint"/><input
                                placeholder="Buscar usuario..."
                                className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-3 text-sm outline-none placeholder:text-ink-faint focus:border-line-strong"/>
                            </div>
                        </div>
                        {/* Tabla de usuarios: muestra los datos simulados y sus acciones visuales. */}
                        <div className="overflow-x-auto">
                            <table className="min-w-[970px] w-full text-left">
                                <thead
                                    className="border-b border-line bg-surface-muted/70 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                <tr>
                                    <th className="w-16 px-4 py-3.5 text-center">ID</th>
                                    <th className="px-4 py-3.5">Usuario</th>
                                    <th className="px-4 py-3.5">Perfil</th>
                                    <th className="px-4 py-3.5">Laboratorio</th>
                                    <th className="px-4 py-3.5">Estado</th>
                                    <th className="px-4 py-3.5 text-right">Último acceso</th>
                                    <th className="px-5 py-3.5 text-right">Acciones</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-line">{usuariosDemo.map((usuario) => <tr
                                    key={usuario.id} className="transition hover:bg-surface-muted/50">
                                    <td className="px-4 py-4 text-center text-xs font-semibold text-ink-muted">{usuario.id}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-status-info-soft text-xs font-bold text-status-info">{usuario.iniciales}</div>
                                            <div><p className="font-semibold text-ink">{usuario.nombre}</p><p
                                                className="mt-0.5 text-xs text-ink-muted">{usuario.nombreUsuario}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4"><span
                                        className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted"><ShieldCheck
                                        className="size-3.5 text-ink-faint"/>{usuario.rol}</span></td>
                                    <td className="px-4 py-4"><span
                                        className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted"><Building2
                                        className="size-3.5 text-ink-faint"/>{usuario.laboratorio}</span></td>
                                    <td className="px-4 py-4"><span
                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${usuario.activo ? "bg-status-ok-soft text-status-ok" : "bg-surface-muted text-ink-muted"}`}><span
                                        className="size-1.5 rounded-full bg-current"/>{usuario.activo ? "Activo" : "Inactivo"}</span>
                                    </td>
                                    <td className="px-4 py-4 text-right text-xs font-medium text-ink-muted">{usuario.acceso}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button type="button" title="Editar usuario"
                                                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[11px] font-semibold text-ink transition hover:border-line-strong hover:bg-surface-muted">
                                                <Pencil className="size-3.5 text-ink-muted"/>Editar
                                            </button>
                                            <button type="button"
                                                    title={usuario.activo ? "Desactivar usuario" : "Activar usuario"}
                                                    className={`flex size-8 items-center justify-center rounded-md border transition ${usuario.activo ? "border-status-alert-soft bg-surface text-status-alert hover:bg-status-alert-soft" : "border-status-ok-soft bg-surface text-status-ok hover:bg-status-ok-soft"}`}>
                                                <Power className="size-3.5"/></button>
                                        </div>
                                    </td>
                                </tr>)}</tbody>
                            </table>
                        </div>
                    </div>

                    {/* Formulario emergente: reúne los campos visuales para registrar un nuevo usuario. */}
                    <div id="formulario-nuevo-usuario" popover="auto"
                         className="m-auto max-h-[88vh] w-[min(760px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-2xl backdrop:bg-black/35 sm:p-6">
                        {/* Cabecera del formulario: muestra su propósito y el control visual para cerrarlo. */}
                        <div className="flex items-center gap-3 border-b border-line pb-4">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-ink text-white">
                                <UserPlus className="size-5"/></div>
                            <div className="flex-1"><p className="font-semibold tracking-[-0.02em] text-ink">Nuevo
                                usuario</p><p className="text-xs text-ink-muted">Formulario de ingreso de nuevos usuarios</p></div>
                            <button type="button" popoverTarget="formulario-nuevo-usuario" popoverTargetAction="hide"
                                    className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">Cerrar
                            </button>
                        </div>
                        <div className="mt-5 space-y-5">
                            {/* Identidad: solicita los datos personales y de acceso del usuario. */}
                            <div>
                                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                                    Identidad
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Usuario (Username)
                                        </span>
                                        <input
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            type="text"
                                            placeholder="nombre.usuario"
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Nombre
                                        </span>
                                        <input
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            type="text"
                                            placeholder="Nombre"
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Apellido
                                        </span>
                                        <input
                                            value={apellido}
                                            onChange={(e) => setApellido(e.target.value)}
                                            type="text"
                                            placeholder="Apellido"
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            RUT
                                        </span>
                                        <input
                                            value={rut}
                                            onChange={(e) => setRut(e.target.value)}
                                            type="text"
                                            placeholder="12.345.678-9"
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Email
                                        </span>
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            placeholder="correo@dominio.cl"
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"
                                        />
                                    </label>
                                </div>
                            </div>
                            {/* Perfil y asignación: agrupa los datos profesionales y administrativos. */}
                            <div>
                                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">
                                    Perfil y asignación
                                </p>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Teléfono
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="+56 9 ..."
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Profesión
                                        </span>
                                        <input
                                            value={profesion}
                                            onChange={(e) => setProfesion(e.target.value)}
                                            type="text"
                                            placeholder="Tecnólogo médico"
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Laboratorio clínico
                                        </span>


                                        <select
                                            value={idLaboratorioClinico}
                                            onChange={(e) => setIdLaboratorioClinico(e.target.value)}
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none focus:border-line-strong">

                                            {
                                                dataLaboratorios.map((laboratorio) => {
                                                    return(<option value={laboratorio.idLaboratorioClinico} key={laboratorio.idLaboratorioClinico}>{laboratorio.nombreLaboratorioClinico}</option>)
                                                })
                                            }
                                        </select>



                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Perfil de Usuario
                                        </span>
                                        <select
                                            value={idTipoUsuarios}
                                            onChange={(e) => setIdTipoUsuarios(e.target.value)}
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none focus:border-line-strong">


                                            {
                                                dataPerfiles.map((perfile) => {
                                                    return(
                                                        <option key={perfile.idTipoUsuarios} value={perfile.idTipoUsuarios}>{perfile.nombreTipo}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </label>


                                </div>
                            </div>

                            {/* Acción final: botón visual preparado para una futura integración. */}
                            <button
                                onClick={()=>
                                    crearUsuario(
                                        nombre,
                                        apellido,
                                        rut,
                                        email,
                                        profesion,
                                        username,
                                        telefono,
                                        idLaboratorioClinico,
                                        idTipoUsuarios
                                    )}
                                type="button"
                                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-white transition hover:bg-accent-strong">
                                <CheckCircle2 className="size-4"/>Crear usuario
                            </button>
                            <p className="text-center text-[11px] leading-4 text-ink-faint">Acción visual sin conexión
                                ni persistencia configurada.</p></div>
                    </div>
                </section>
            </div>
        </main>
    );
}
