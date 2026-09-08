"use client"
import {Building2, CheckCircle2, LoaderCircle, Pencil, Power, ShieldCheck, UserPlus} from "lucide-react";
import {useEffect, useState} from "react";
import { useRef } from "react";
import Toaster from "@/components/ui/toast";
import {useAuth} from "@clerk/nextjs";




export default function PaginaUsuariosSistema() {
    const toasterRef = useRef(null);
    const formularioNuevoUsuarioRef = useRef(null);
    const formularioEditarUsuarioRef = useRef(null);
    const API = process.env.NEXT_PUBLIC_API_URL;

    const {
        getToken,
        userId
    } = useAuth();





    const [dataUsuarios, setDataUsuarios]=useState([]);


    async function cargarUsuariosLevey(){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/usuarios-levey`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
               return  toasterRef.current?.show({
                    title: "Error al cargar los Usuarios Levey",
                    variant: "error",
                    duration: 4000,
                });
            }


            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                return setDataUsuarios(respuestaBackend.data);
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
                title: "Error al cargar los Usuarios Levey",
                variant: "error",
                duration: 4000,
            });
        }

    }
    useEffect(() => {
        cargarUsuariosLevey();
    }, []);






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




    const[nombre, setNombre]=useState("");
    const[apellido, setApellido]=useState("");
    const[rut, setRut]=useState("");
    const[email, setEmail]=useState("");
    const[profesion, setProfesion]=useState("");
    const[username, setUsername]=useState("");
    const[telefono, setTelefono]=useState("");
    const[idLaboratorioClinico, setIdLaboratorioClinico] = useState("");
    const[idTipoUsuarios, setIdTipoUsuarios]=useState("");
    const[password, setPassword]=useState("");
    const[creandoUsuario, setCreandoUsuario]=useState(false);

    function limpiarFormularioUsuario(){
        setNombre("");
        setApellido("");
        setRut("");
        setEmail("");
        setProfesion("");
        setUsername("");
        setTelefono("");
        setIdLaboratorioClinico("");
        setIdTipoUsuarios("");
        setPassword("");
    }

    async function crearUsuario(
        nombre,
        apellido,
        rut,
        email,
        profesion,
        username,
        telefono,
        idLaboratorioClinico,
        idTipoUsuarios,
        password
    ){
        setCreandoUsuario(true);

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

                    usuario: {
                        nombre,
                        apellido,
                        rut,
                        email,
                        profesion,
                        username,
                        telefono,
                        idLaboratorioClinico,
                        idTipoUsuarios,
                        usuarioCreacionId: userId,
                    },
                    password
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
                limpiarFormularioUsuario();
                formularioNuevoUsuarioRef.current?.hidePopover();
                await cargarUsuariosLevey();
                return;
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
        }finally {
            setCreandoUsuario(false);
        }
    }

    // Datos simulados utilizados únicamente para representar el listado visual.
    const usuariosDemo = dataUsuarios.map(usuariosBackend => {
        return {
            id: usuariosBackend[3]?? "",
            nombre: `${usuariosBackend[4]+" "+usuariosBackend[5]}` ?? "Sin datos",
            iniciales: `${usuariosBackend?.[4]?.[0]?.toUpperCase() ?? ""}${usuariosBackend?.[5]?.[0]?.toUpperCase() ?? ""}`,
            rol: usuariosBackend[1] ?? "Sin datos",
            laboratorio: usuariosBackend[0] ?? "Sin datos",
            activo: usuariosBackend[10] ?? "Sin datos",
            telefono: usuariosBackend[7] ?? "Sin datos"
        }
    })






    async function desactivar(
        idUsuarioLevey
    ){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/usuarios-levey/${idUsuarioLevey}/desactivar`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Error al desactivar el usuario",

                    variant: "error",
                    duration: 4000,
                });
            }


            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                await  cargarUsuariosLevey();
                toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
                limpiarFormularioUsuario();
                formularioNuevoUsuarioRef.current?.hidePopover();
                return;
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
                title: "Error activar el usuario. Error en el servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }






    async function activar(
        idUsuarioLevey
    ){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/usuarios-levey/${idUsuarioLevey}/activar`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Error al activar el usuario",

                    variant: "error",
                    duration: 4000,
                });
            }


            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                await  cargarUsuariosLevey();
                toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
                limpiarFormularioUsuario();
                formularioNuevoUsuarioRef.current?.hidePopover();
                return;
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
                title: "Error activar el usuario. Error en el servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }












    const [nombreEditar, setNombreEditar] = useState("");
    const [apellidoEditar, setApellidoEditar] = useState("");
    const [rutEditar, setRutEditar] = useState("");
    const [emailEditar, setEmailEditar] = useState("");
    const [profesionEditar, setProfesionEditar] = useState("");
    const [usernameEditar, setUsernameEditar] = useState("");
    const [telefonoEditar, setTelefonoEditar] = useState("");
    const [idLaboratorioClinicoEditar, setIdLaboratorioClinicoEditar] = useState("");
    const [idTipoUsuariosEditar, setIdTipoUsuariosEditar] = useState("");
    const [passwordEdit, setPasswordEdit] = useState("");

    async function editar(
        idUsuarioLevey,
        nombreEditar,
        apellidoEditar,
        rutEditar,
        emailEditar,
        profesionEditar,
        usernameEditar,
        telefonoEditar,
        idLaboratorioClinicoEditar,
        idTipoUsuariosEditar,
        passwordEdit
    ){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/usuarios-levey/actualizar`,{
                method: "PUT",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user :{
                        idUsuarioLevey: idUsuarioLevey,
                        nombre : nombreEditar,
                        apellido : apellidoEditar,
                        rut : rutEditar,
                        email : emailEditar,
                        profesion : profesionEditar,
                        username : usernameEditar,
                        telefono : telefonoEditar,
                        idLaboratorioClinico: idLaboratorioClinicoEditar,
                        idTipoUsuarios: idTipoUsuariosEditar,
                        usuarioModificacionId: userId
                    },
                    password  :passwordEdit
                }),
            });

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Error al actualizar el usuario",
                    variant: "error",
                    duration: 4000,
                });
            }


            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                setIdUsuarioLevey("");
                setNombreEditar("");
                setApellidoEditar("");
                setRutEditar("");
                setEmailEditar("");
                setProfesionEditar("");
                setUsernameEditar("");
                setTelefonoEditar("");
                setIdLaboratorioClinicoEditar("");
                setIdTipoUsuariosEditar("");
                setPasswordEdit("");
                formularioEditarUsuarioRef.current?.hidePopover();
                await cargarUsuariosLevey();
                return toasterRef.current?.show({
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
                title: "Error al actualizar el usuario. Error en el servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }






    const[idUsuarioLevey,setIdUsuarioLevey] = useState("");

    async function seleccionarPorId(idUsuarioLevey){
        setIdUsuarioLevey("");
        setNombreEditar("");
        setApellidoEditar("");
        setRutEditar("");
        setEmailEditar("");
        setProfesionEditar("");
        setUsernameEditar("");
        setTelefonoEditar("");
        setIdLaboratorioClinicoEditar("");
        setIdTipoUsuariosEditar("");
        setPasswordEdit("");

        try {
            const token = await getToken();
            const res = await fetch(`${API}/usuarios-levey/${idUsuarioLevey}`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Error al cargar los datos del usuario seleccionado",
                    variant: "error",
                    duration: 4000,
                });
            }


            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                setIdUsuarioLevey(respuestaBackend.data.idUsuarioLevey)
                setNombreEditar(respuestaBackend.data.nombre);
                setApellidoEditar(respuestaBackend.data.apellido);
                setRutEditar(respuestaBackend.data.rut);
                setEmailEditar(respuestaBackend.data.email);
                setProfesionEditar(respuestaBackend.data.profesion);
                setUsernameEditar(respuestaBackend.data.username);
                setTelefonoEditar(respuestaBackend.data.telefono);
                setIdLaboratorioClinicoEditar(respuestaBackend.data.idLaboratorioClinicos);
                setIdTipoUsuariosEditar(respuestaBackend.data.idTipoUsuarios);

                return toasterRef.current?.show({
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
                title: "Error al cargar los perfiles de ususarios",
                variant: "error",
                duration: 4000,
            });
        }
    }

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

                {/* Sección principal: contiene el listado y los formularios visuales de usuarios. */}
                <section className="mt-6">
                    <div className="rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]">
                        {/* Cabecera del listado: identifica la tabla de usuarios. */}
                        <div
                            className="border-b border-line p-4">
                            <div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Listado de
                                usuarios</p><p className="mt-1 text-xs text-ink-muted">Identidades registradas en la
                                plataforma</p></div>
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
                                    <th className="px-4 py-3.5 text-right">Contacto</th>
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
                                            <div><p className="font-semibold text-ink">{usuario.nombre}</p>
                                            </div>
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
                                    <td className="px-4 py-4 text-right text-xs font-medium text-ink-muted">{usuario.telefono}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={()=> seleccionarPorId(usuario.id)}
                                                type="button" title="Editar usuario"
                                                    popoverTarget="formulario-editar-usuario"
                                                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 text-[11px] font-semibold text-ink transition hover:border-line-strong hover:bg-surface-muted">
                                                <Pencil className="size-3.5 text-ink-muted"/>Editar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const estado = usuario.activo ? desactivar(usuario.id) : activar(usuario.id);
                                                } }
                                                type="button"
                                                    title={usuario.activo ? "Desactivar usuario" : "Activar usuario"}
                                                    className={`flex size-8 items-center justify-center rounded-md border transition ${usuario.activo ? "border-status-alert-soft bg-surface text-status-alert hover:bg-status-alert-soft" : "border-status-ok-soft bg-surface text-status-ok hover:bg-status-ok-soft"}`}>
                                                <Power className="size-3.5"/></button>
                                        </div>
                                    </td>
                                </tr>)}</tbody>
                            </table>
                        </div>
                    </div>

                    {/* Formulario emergente visual para editar un usuario existente. */}
                    <div ref={formularioEditarUsuarioRef} id="formulario-editar-usuario" popover="auto"
                         className="m-auto max-h-[88vh] w-[min(760px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-2xl backdrop:bg-black/35 sm:p-6">
                        <div className="flex items-center gap-3 border-b border-line pb-4">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-status-info-soft text-status-info">
                                <Pencil className="size-5"/>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold tracking-[-0.02em] text-ink">Editar usuario</p>
                                <p className="text-xs text-ink-muted">Actualiza la información del usuario seleccionado</p>
                            </div>
                            <button type="button" popoverTarget="formulario-editar-usuario" popoverTargetAction="hide"
                                    className="rounded-md px-3 py-2 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-5 space-y-5">
                            <div>
                                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Identidad</p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Usuario</span>
                                        <input
                                            value={usernameEditar}
                                            onChange={(e) => setUsernameEditar(e.target.value)}
                                            type="text" placeholder="nombre.usuario" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"/>
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Nombre</span>
                                        <input
                                            value={nombreEditar}
                                            onChange={(e) => setNombreEditar(e.target.value)}
                                            type="text" placeholder="Nombre" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"/>
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Apellido</span>
                                        <input
                                            value={apellidoEditar}
                                            onChange={(e) => setApellidoEditar(e.target.value)}
                                            type="text" placeholder="Apellido" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"/>
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">RUT</span>
                                        <input
                                            value={rutEditar}
                                            onChange={(e) => setRutEditar(e.target.value)}
                                            type="text" placeholder="12.345.678-9" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"/>
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Correo electrónico</span>
                                        <input
                                            value={emailEditar}
                                            onChange={(e) => setEmailEditar(e.target.value)}
                                            type="email" placeholder="correo@dominio.cl" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"/>
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Teléfono</span>
                                        <input
                                            value={telefonoEditar}
                                            onChange={(e) => setTelefonoEditar(e.target.value)}
                                            type="tel" placeholder="+56 9 1234 5678" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"/>
                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Contraseña</span>
                                        <input
                                            value={passwordEdit}
                                            onChange={(e) => setPasswordEdit(e.target.value)}
                                            type="password" placeholder="********" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"/>
                                    </label>

                                </div>
                            </div>

                            <div>
                                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-faint">Acceso y pertenencia</p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Perfil de usuario</span>
                                        <select
                                            value={idTipoUsuariosEditar}
                                            onChange={(e) => setIdTipoUsuariosEditar(e.target.value)}
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none focus:border-line-strong">

                                            <option value="" disabled>Selecciona un perfil</option>

                                            {
                                                dataPerfiles.map((perfile) => {
                                                    return(
                                                        <option key={perfile.idTipoUsuarios} value={perfile.idTipoUsuarios}>{perfile.nombreTipo}</option>
                                                    )
                                                })
                                            }

                                        </select>
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Laboratorio clínico</span>

                                        <select
                                            value={idLaboratorioClinicoEditar}
                                            onChange={(e) => setIdLaboratorioClinicoEditar(e.target.value)}
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none focus:border-line-strong">

                                            <option value="" disabled>Selecciona un laboratorio</option>

                                            {
                                                dataLaboratorios.map((laboratorio) => {
                                                    return(<option value={laboratorio.idLaboratorioClinico} key={laboratorio.idLaboratorioClinico}>{laboratorio.nombreLaboratorioClinico}</option>)
                                                })
                                            }
                                        </select>

                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
                                <button type="button" popoverTarget="formulario-editar-usuario" popoverTargetAction="hide" className="h-10 rounded-lg border border-line px-4 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">Cancelar</button>
                                <button
                                    onClick={
                                        ()=> editar(
                                            idUsuarioLevey,
                                            nombreEditar,
                                            apellidoEditar,
                                            rutEditar,
                                            emailEditar,
                                            profesionEditar,
                                            usernameEditar,
                                            telefonoEditar,
                                            idLaboratorioClinicoEditar,
                                            idTipoUsuariosEditar,
                                            passwordEdit
                                        )
                                    }
                                    type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong"><CheckCircle2 className="size-4"/>Guardar cambios</button>
                            </div>
                        </div>
                    </div>

                    {/* Formulario emergente: reúne los campos visuales para registrar un nuevo usuario. */}
                    <div ref={formularioNuevoUsuarioRef} id="formulario-nuevo-usuario" popover="auto"
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



                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                            Contraseña <span className="text-status-alert">*</span>
                                        </span>
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                            placeholder="Mínimo 15 caracteres"
                                            aria-describedby="requisito-contrasena"
                                            className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong"
                                        />
                                        <span id="requisito-contrasena" aria-live="polite"
                                              className={`text-[11px] font-medium transition-colors ${password.length >= 15 ? "text-status-ok" : "text-status-alert"}`}>
                                            {password.length} caracteres ingresados · mínimo obligatorio: 15 caracteres.
                                        </span>
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

                                            <option value="" disabled>Selecciona un laboratorio</option>

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

                                            <option value="" disabled>Selecciona un perfil</option>

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
                                disabled={creandoUsuario}
                                aria-busy={creandoUsuario}
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
                                        idTipoUsuarios,
                                        password
                                    )}
                                type="button"
                                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink">
                                {creandoUsuario ? <><LoaderCircle className="size-4 animate-spin"/>Creando usuario...</> : <><CheckCircle2 className="size-4"/>Crear usuario</>}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
