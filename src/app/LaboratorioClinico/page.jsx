"use client"

import {useEffect, useState} from "react";

import { useRef } from "react";
import Toaster from "@/components/ui/toast";
import { useAuth, useOrganizationList } from "@clerk/nextjs";
import {
    Building2,
    CheckCircle2,
    ContactRound,
    Fingerprint,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Power,
    PowerOff,
    X,
} from "lucide-react";

function FormularioEditarLaboratorio({ laboratorio, alActualizar, referenciaToast }) {
    const idPopover = `editar-laboratorio-${laboratorio.idLaboratorioClinico}`;
    const idTitulo = `titulo-editar-laboratorio-${laboratorio.idLaboratorioClinico}`;
    const formularioEditarLaboratorioRef = useRef(null);


    const [idLaboratorioClinico, setidLaboratorioClinico] = useState(
        laboratorio.idLaboratorioClinico
    );

    const [nombreLaboratorioClinicoeditar, setnombreLaboratorioClinicoeditar] = useState(
        laboratorio.nombreLaboratorioClinico ?? ""
    );


    const [clerkOrganizationId, setclerkOrganizationId] = useState(
        laboratorio.clerkOrganizationId ?? ""
    );


    const [rutInstitucioneditar, setRutInstitucioneditar] = useState(
        laboratorio.rutInstitucion ?? ""
    );

    const [representanteLegaleditar, setrepresentanteLegaleditar] = useState(
        laboratorio.representanteLegal ?? ""
    );

    const [emailContactoeditar, setEmailContactoeditar] = useState(
        laboratorio.emailContacto ?? ""
    );

    const [telefonoContactoeditar, setTelefonoContactoeditar] = useState(
        laboratorio.telefonoContacto ?? ""
    );

    const [direccioneditar, setDireccioneditar] = useState(
        laboratorio.direccion ?? ""
    );

    const [comunaeditar, setComunaeditar] = useState(
        laboratorio.comuna ?? ""
    );

    const [ciudadeditar, setCiudadeditar] = useState(
        laboratorio.ciudad ?? ""
    );

    const [regioneditar, setRegioneditar] = useState(
        laboratorio.region ?? ""
    );


    const [activo, setActivo] = useState(
        laboratorio.activo ?? 1
    );

    const [paiseditar, setPaiseditar] = useState(
        laboratorio.pais ?? ""
    );

    const API = process.env.NEXT_PUBLIC_API_URL;

    const {
        isLoaded: organizacionesCargadas,
        createOrganization: crearOrganizacion,
        setActive: activarOrganizacion,
    } = useOrganizationList();


    const {
        getToken,
        isLoaded,
        isSignedIn,
        userId
    } = useAuth();

    async function editar(
        idLaboratorioClinico,
        clerkOrganizationId,
        nombreLaboratorioClinico,
        rutInstitucion,
        representanteLegal,
        emailContacto,
        telefonoContacto,
        direccion,
        comuna,
        ciudad,
        region,
        pais,
        activo
    ){
        try {


            const token = await getToken();
            const res = await fetch(`${API}/laboratorios-clinicos/actualizar`,{
                method: "PUT",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body:JSON.stringify({
                    idLaboratorioClinico,
                    clerkOrganizationId,
                    nombreLaboratorioClinico,
                    rutInstitucion,
                    representanteLegal,
                    emailContacto,
                    telefonoContacto,
                    direccion,
                    comuna,
                    ciudad,
                    region,
                    pais,
                    activo,
                    usuarioModificacionId: userId
                })
            });

            if (!res.ok) {
                return referenciaToast.current?.show({
                    title: "Error al actualizar datos del Laboratorio. Mala respuesta del servidor",
                    variant: "error",
                    duration: 4000,
                });
            }

            const response = await res.json();

            if (response.success) {
                await alActualizar();
                referenciaToast.current?.show({
                    title: "Laboratorios Clinicos actualizado Correctamente",
                    variant: "success",
                    duration: 4000,
                });
                formularioEditarLaboratorioRef.current?.hidePopover();
                return;
            }

            if (!response.success) {
                return referenciaToast.current?.show({
                    title: `${response.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }
        }catch (e) {
            return referenciaToast.current?.show({
                title: "Error al actualizar Laboratorio",
                variant: "error",
                duration: 4000,
            });

        }
    }


    return (
        <div
            ref={formularioEditarLaboratorioRef}
            id={idPopover}
            popover="auto"
            role="dialog"
            aria-labelledby={idTitulo}
            className="m-auto max-h-[90vh] w-[min(760px,calc(100vw-2rem))] overflow-y-auto rounded-[26px] border border-line bg-surface p-5 text-ink shadow-[0_32px_90px_-30px_rgba(11,13,16,0.55)] backdrop:bg-black/35 sm:p-7"
        >
            <div className="flex items-start gap-3 border-b border-line pb-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-status-info-soft text-status-info">
                    <Pencil aria-hidden="true" className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">Ficha institucional</p>
                    <h2 id={idTitulo} className="mt-1 text-xl font-semibold tracking-[-0.035em] text-ink">Editar laboratorio clínico</h2>
                    <p className="mt-1 text-xs leading-5 text-ink-muted">Actualiza los datos de identificación, contacto y ubicación del laboratorio.</p>
                </div>
                <button
                    type="button"
                    popoverTarget={idPopover}
                    popoverTargetAction="hide"
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-surface-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-line-strong"
                    aria-label="Cerrar edición"
                >
                    <X aria-hidden="true" className="size-4" />
                </button>
            </div>

            <div className="mt-6 space-y-6">
                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <ContactRound aria-hidden="true" className="size-4 text-status-info" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-faint">Identificación y contacto</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5 sm:col-span-2">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Nombre del laboratorio</span>
                            <input
                                value={nombreLaboratorioClinicoeditar}
                                onChange={(e) => setnombreLaboratorioClinicoeditar(e.target.value)}
                                name="nombreLaboratorioClinico"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>


                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">RUT institución</span>
                            <input
                                value={rutInstitucioneditar}
                                onChange={(e) => setRutInstitucioneditar(e.target.value)}
                                name="rutInstitucion"  className="h-10 rounded-lg border border-line bg-canvas px-3 font-mono text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>


                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Representante legal</span>
                            <input
                                value={representanteLegaleditar}
                                onChange={(e) => setrepresentanteLegaleditar(e.target.value)}
                                name="representanteLegal"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>


                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Correo de contacto</span>
                            <input
                                value={emailContactoeditar}
                                onChange={(e) => setEmailContactoeditar(e.target.value)}
                                name="emailContacto" type="email"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>


                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Teléfono de contacto</span>
                            <input
                                value={telefonoContactoeditar}
                                onChange={(e) => setTelefonoContactoeditar(e.target.value)}
                                name="telefonoContacto" type="tel"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>
                    </div>
                </section>

                <section>
                    <div className="mb-3 flex items-center gap-2">
                        <MapPin aria-hidden="true" className="size-4 text-status-ok" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-faint">Ubicación institucional</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5 sm:col-span-2">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Dirección</span>
                            <input
                                value={direccioneditar}
                                onChange={(e) => setDireccioneditar(e.target.value)}
                                name="direccion"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Comuna</span>
                            <input
                                value={comunaeditar}
                                onChange={(e) => setComunaeditar(e.target.value)}
                                name="comuna"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Ciudad</span>
                            <input
                                value={ciudadeditar}
                                onChange={(e) => setCiudadeditar(e.target.value)}
                                name="ciudad"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Región</span>
                            <input
                                value={regioneditar}
                                onChange={(e) => setRegioneditar(e.target.value)}
                                name="region"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">País</span>
                            <input
                                value={paiseditar}
                                onChange={(e) => setPaiseditar(e.target.value)}
                                name="pais"  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                        </label>
                    </div>
                </section>

                <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[11px] leading-5 text-ink-faint">ID institucional #{laboratorio.idLaboratorioClinico}</p>
                    <div className="flex items-center gap-2 sm:justify-end">
                        <button type="button" popoverTarget={idPopover} popoverTargetAction="hide" className="inline-flex h-10 items-center justify-center rounded-lg border border-line px-3.5 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">
                            Cancelar
                        </button>
                        <button
                            onClick={()=> editar(
                                idLaboratorioClinico,
                                clerkOrganizationId,
                                nombreLaboratorioClinicoeditar,
                                rutInstitucioneditar,
                                representanteLegaleditar,
                                emailContactoeditar,
                                telefonoContactoeditar,
                                direccioneditar,
                                comunaeditar,
                                ciudadeditar,
                                regioneditar,
                                paiseditar,
                                activo
                            )}
                            type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-xs font-semibold text-white transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-line-strong focus:ring-offset-2">
                            <CheckCircle2 aria-hidden="true" className="size-3.5" />
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LaboratoriosClinicos() {
    const toasterRef = useRef(null);
    const formularioNuevoLaboratorioRef = useRef(null);
    /*
    <<entity>>
    LaboratorioClinico
    ----------------
    + idLaboratorioClinico: Long
    + clerkOrganizationId: String
    + nombreLaboratorioClinico: String
    + rutInstitucion: String
    + representanteLegal: String
    + emailContacto: String
    + telefonoContacto: String
    + direccion: String
    + comuna: String
    + ciudad: String
    + region: String
    + pais: String
    + activo: Integer
    + fechaCreacion: LocalDateTime
    + fechaModificacion: LocalDateTime
    + usuarioCreacionId: Long
    + usuarioModificacionId: Long

    * */






    const API = process.env.NEXT_PUBLIC_API_URL;

    const {
        getToken,
        userId
    } = useAuth();

    const [dataLaboratorios, setDataLaboratorios] = useState([]);


    const {
        isLoaded: organizacionesCargadas,
        createOrganization: crearOrganizacion,
        setActive: activarOrganizacion,
    } = useOrganizationList();



    async function buscarLaboratorios(mostrarNotificacion = true){
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
                return []
            }

            const response = await res.json();

            if (response.success) {
                if (mostrarNotificacion) {
                    toasterRef.current?.show({
                        title: "Laboratorios Clinicos Cargados Correctamente",
                        variant: "success",
                        duration: 4000,
                    });
                }

                return response.data;

            }

        }catch (e) {
            if (mostrarNotificacion) {
                toasterRef.current?.show({
                    title: "Error al cargar los Laboratorios Clinicos",
                    variant: "error",
                    duration: 4000,
                });
            }
            return [];
        }
    }

    async function recargarLaboratorios() {
        const laboratoriosActualizados = await buscarLaboratorios(false);
        setDataLaboratorios(laboratoriosActualizados);
    }

    useEffect(() => {
        async function cargarLaboratorios() {
            let arrayDataLaboratorios = await buscarLaboratorios(false);
            if (arrayDataLaboratorios.length > 0) {
                setDataLaboratorios(arrayDataLaboratorios);
            }
        }
        cargarLaboratorios();
    }, []);



/*
        "clerkOrganizationId": "org_prueba_001",
        "nombreLaboratorioClinico": "Laboratorio Clínico de Prueba",
        "rutInstitucion": "76.123.456-7",
        "representanteLegal": "Nicolás Pérez",
        "emailContacto": "contacto@laboratorioprueba.cl",
        "telefonoContacto": "+56912345678",
        "direccion": "Avenida de Prueba 123",
        "comuna": "Santiago",
        "ciudad": "Santiago",
        "region": "Región Metropolitana",
        "pais": "Chile",

* */


    const [nombreLaboratorioClinico, setNombreLaboratorioClinico] = useState("");
    const [rutInstitucion, setRutInstitucion] = useState("");
    const [representanteLegal, setRepresentanteLegal] = useState("");
    const [emailContacto, setEmailContacto] = useState("");
    const [telefonoContacto, setTelefonoContacto] = useState("");
    const [direccion, setDireccion] = useState("");
    const [comuna, setComuna] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [region, setRegion] = useState("");
    const [pais, setPais] = useState("");

    async function insertar(
        nombreLaboratorioClinico,
        rutInstitucion,
        representanteLegal,
        emailContacto,
        telefonoContacto,
        direccion,
        comuna,
        ciudad,
        region,
        pais
    ){
        try {

            const organizacionCreada = await crearOrganizacion({
                name: nombreLaboratorioClinico.trim(),
            });

            const token = await getToken();
            const res = await fetch(`${API}/laboratorios-clinicos/insertar`,{
                method: "POST",
                headers:{
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body:JSON.stringify({
                    clerkOrganizationId: organizacionCreada.id,
                    nombreLaboratorioClinico,
                    rutInstitucion,
                    representanteLegal,
                    emailContacto,
                    telefonoContacto,
                    direccion,
                    comuna,
                    ciudad,
                    region,
                    pais,
                    usuarioCreacionId: userId
                })
            });

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Error al insertar Laboratorio. Mala respuesta del servidor",
                    variant: "error",
                    duration: 4000,
                });
            }

            const response = await res.json();

            if (response.success) {
                await recargarLaboratorios();
                setNombreLaboratorioClinico("");
                setRutInstitucion("");
                setRepresentanteLegal("");
                setEmailContacto("");
                setTelefonoContacto("");
                setDireccion("");
                setComuna("");
                setCiudad("");
                setRegion("");
                setPais("");
                formularioNuevoLaboratorioRef.current?.hidePopover();

                return toasterRef.current?.show({
                    title: "Laboratorios Clinicos ingresado Correctamente",
                    variant: "success",
                    duration: 4000,
                });
            }

            if (!response.success) {
                return  toasterRef.current?.show({
                    title: `${response.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }
        }catch (e) {
            return  toasterRef.current?.show({
                title: "Error al insertar Laboratorio",
                variant: "error",
                duration: 4000,
            });

        }
    }





    async function activar(
        idLaboratorioClinico
    ){
        if(!idLaboratorioClinico){
            return  toasterRef.current?.show({
                title: "Debe proporcionar un ID de laboratorio clínico",
                variant: "error",
                duration: 4000,
            });
        }

        try {


            const token = await getToken();
            const res = await fetch(`${API}/laboratorios-clinicos/${idLaboratorioClinico}/activar`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Mala respuesta del servidor",
                    variant: "error",
                    duration: 4000,
                });
            }

            const response = await res.json();

            if (response.success) {
                await recargarLaboratorios();

                return toasterRef.current?.show({
                    title: `${response.message}`,
                    variant: "success",
                    duration: 4000,
                });
            }

            if (!response.success) {
                return  toasterRef.current?.show({
                    title: `${response.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        }catch (e) {
            return  toasterRef.current?.show({
                title: "Error al actualizar Laboratorio",
                variant: "error",
                duration: 4000,
            });

        }
    }







    async function desactivar(
        idLaboratorioClinico
    ){
        if(!idLaboratorioClinico){
            return  toasterRef.current?.show({
                title: "Debe proporcionar un ID de laboratorio clínico",
                variant: "error",
                duration: 4000,
            });
        }

        try {


            const token = await getToken();
            const res = await fetch(`${API}/laboratorios-clinicos/${idLaboratorioClinico}/desactivar`,{
                method: "PATCH",
                headers:{
                    "Accept":"application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!res.ok) {
                return  toasterRef.current?.show({
                    title: "Mala respuesta del servidor",
                    variant: "error",
                    duration: 4000,
                });
            }

            const response = await res.json();

            if (response.success) {
                await recargarLaboratorios();

                return toasterRef.current?.show({
                    title: `${response.message}`,
                    variant: "success",
                    duration: 4000,
                });
            }

            if (!response.success) {
                return  toasterRef.current?.show({
                    title: `${response.message}`,
                    variant: "error",
                    duration: 4000,
                });
            }

        }catch (e) {
            return  toasterRef.current?.show({
                title: "Error al desactivar Laboratorio",
                variant: "error",
                duration: 4000,
            });

        }
    }




    return(
        <main className="relative min-h-screen overflow-hidden bg-canvas px-4 py-7 text-ink sm:px-7 sm:py-9 lg:px-10">
            <Toaster ref={toasterRef} />

            <div className="relative mx-auto max-w-[1440px]">
                <header className="border-b border-line pb-6 sm:pb-7">
                    <div className="max-w-3xl">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">Gestión institucional</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-[34px]">Laboratorios clínicos</h1>
                        <p className="mt-2 text-sm leading-6 text-ink-muted">Administra las instituciones registradas y su información de contacto.</p>
                    </div>
                </header>

                <section className="mt-7">
                    <div className="mb-5 flex justify-end">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold text-ink-muted shadow-sm">
                                <Building2 aria-hidden="true" className="size-3.5 text-status-info" />
                                Red de laboratorios
                            </div>
                            <button
                                type="button"
                                popoverTarget="formulario-nuevo-laboratorio"
                                className="inline-flex h-9 items-center gap-2 rounded-lg bg-ink px-3.5 text-xs font-semibold text-white shadow-sm transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-line-strong focus:ring-offset-2"
                            >
                                <Plus aria-hidden="true" className="size-3.5" />
                                Nuevo laboratorio
                            </button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_12px_36px_-28px_rgba(11,13,16,0.55)]">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1300px] table-fixed border-collapse text-left">
                                <caption className="sr-only">Listado de laboratorios clínicos registrados</caption>
                                <colgroup>
                                    <col className="w-[5%]" />
                                    <col className="w-[22%]" />
                                    <col className="w-[12%]" />
                                    <col className="w-[16%]" />
                                    <col className="w-[16%]" />
                                    <col className="w-[10%]" />
                                    <col className="w-[19%]" />
                                </colgroup>
                                <thead className="border-b border-line bg-surface-muted/70">
                                    <tr className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                        <th scope="col" className="px-5 py-3.5">ID</th>
                                        <th scope="col" className="px-4 py-3.5">Laboratorio</th>
                                        <th scope="col" className="px-4 py-3.5">Representante</th>
                                        <th scope="col" className="px-4 py-3.5">Contacto</th>
                                        <th scope="col" className="px-4 py-3.5">Ubicación</th>
                                        <th scope="col" className="px-4 py-3.5 text-center">Estado</th>
                                        <th scope="col" className="px-5 py-3.5 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line">
                                    {dataLaboratorios.map((laboratorio) => (
                                        <tr
                                            key={laboratorio.idLaboratorioClinico}
                                            className="align-middle transition hover:bg-surface-muted/45"
                                        >
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-ink-muted">
                                                    <Fingerprint aria-hidden="true" className="size-3.5 text-ink-faint" />
                                                    {laboratorio.idLaboratorioClinico}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    type="button"
                                                    popoverTarget={`editar-laboratorio-${laboratorio.idLaboratorioClinico}`}
                                                    aria-haspopup="dialog"
                                                    aria-controls={`editar-laboratorio-${laboratorio.idLaboratorioClinico}`}
                                                    className="group flex w-full items-center gap-3 rounded-xl p-1.5 text-left transition hover:bg-status-info-soft/70 focus:outline-none focus:ring-2 focus:ring-status-info/25"
                                                >
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-status-info-soft text-status-info">
                                                        <Building2 aria-hidden="true" className="size-4" />
                                                    </div>
                                                    <span className="min-w-0 flex-1 font-semibold leading-5 text-ink">{laboratorio.nombreLaboratorioClinico}</span>
                                                    <Pencil aria-hidden="true" className="size-3.5 shrink-0 text-ink-faint opacity-0 transition group-hover:opacity-100 group-focus:opacity-100" />
                                                </button>
                                                <FormularioEditarLaboratorio
                                                    laboratorio={laboratorio}
                                                    alActualizar={recargarLaboratorios}
                                                    referenciaToast={toasterRef}
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="max-w-[170px] text-sm font-medium leading-5 text-ink">{laboratorio.representanteLegal}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="min-w-0 space-y-1.5 text-xs text-ink-muted">
                                                    <p className="flex items-center gap-2">
                                                        <Mail aria-hidden="true" className="size-3.5 shrink-0 text-ink-faint" />
                                                        <span className="min-w-0 flex-1 truncate">{laboratorio.emailContacto}</span>
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <Phone aria-hidden="true" className="size-3.5 shrink-0 text-ink-faint" />
                                                        {laboratorio.telefonoContacto}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex min-w-0 items-start gap-2">
                                                    <MapPin aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-status-ok" />
                                                    <div>
                                                        <p className="text-xs font-semibold leading-5 text-ink">{laboratorio.direccion}</p>
                                                        <p className="text-[11px] leading-4 text-ink-muted">
                                                            {laboratorio.comuna}, {laboratorio.ciudad}
                                                        </p>
                                                        <p className="text-[10px] leading-4 text-ink-faint">
                                                            {laboratorio.region}, {laboratorio.pais}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                data-activo={laboratorio.activo}
                                                className="group/estado px-4 py-4 text-center"
                                            >
                                                <span className="hidden items-center gap-1.5 rounded-full bg-status-ok-soft px-2.5 py-1 text-[10px] font-bold text-status-ok group-data-[activo=1]/estado:inline-flex">
                                                    <span className="size-1.5 rounded-full bg-current" />
                                                    Activo
                                                </span>
                                                <span className="hidden items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-[10px] font-bold text-ink-muted ring-1 ring-inset ring-line group-data-[activo=0]/estado:inline-flex">
                                                    <span className="size-1.5 rounded-full bg-current" />
                                                    Inactivo
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => activar(laboratorio.idLaboratorioClinico)}
                                                        type="button"
                                                        aria-label={`Activar ${laboratorio.nombreLaboratorioClinico}`}
                                                        title="Activar laboratorio"
                                                        className="inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-status-ok-soft bg-surface px-2.5 text-[11px] font-semibold text-status-ok transition hover:bg-status-ok-soft focus:outline-none focus:ring-2 focus:ring-status-ok/30 focus:ring-offset-2"
                                                    >
                                                        <Power aria-hidden="true" className="size-3.5" />
                                                        Activar
                                                    </button>
                                                    <button
                                                        onClick={() => desactivar(laboratorio.idLaboratorioClinico)}
                                                        type="button"
                                                        aria-label={`Desactivar ${laboratorio.nombreLaboratorioClinico}`}
                                                        title="Desactivar laboratorio"
                                                        className="inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-status-alert-soft bg-surface px-2.5 text-[11px] font-semibold text-status-alert transition hover:bg-status-alert-soft focus:outline-none focus:ring-2 focus:ring-status-alert/30 focus:ring-offset-2"
                                                    >
                                                        <PowerOff aria-hidden="true" className="size-3.5" />
                                                        Desactivar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div
                        ref={formularioNuevoLaboratorioRef}
                        id="formulario-nuevo-laboratorio"
                        popover="auto"
                        className="m-auto max-h-[90vh] w-[min(760px,calc(100vw-2rem))] overflow-y-auto rounded-[26px] border border-line bg-surface p-5 text-ink shadow-[0_32px_90px_-30px_rgba(11,13,16,0.55)] backdrop:bg-black/35 sm:p-7"
                    >
                        <div className="flex items-start gap-3 border-b border-line pb-5">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-white shadow-sm">
                                <Building2 aria-hidden="true" className="size-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">Nueva ficha institucional</p>
                                <h2 className="mt-1 text-xl font-semibold tracking-[-0.035em] text-ink">Registrar laboratorio clínico</h2>
                                <p className="mt-1 text-xs leading-5 text-ink-muted">Completa los mismos datos que se visualizan en las fichas del directorio.</p>
                            </div>
                            <button
                                type="button"
                                popoverTarget="formulario-nuevo-laboratorio"
                                popoverTargetAction="hide"
                                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-muted transition hover:bg-surface-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-line-strong"
                                aria-label="Cerrar formulario"
                            >
                                <X aria-hidden="true" className="size-4" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-6">
                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <ContactRound aria-hidden="true" className="size-4 text-status-info" />
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-faint">Identificación y contacto</p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="flex flex-col gap-1.5 sm:col-span-2">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Nombre del laboratorio</span>
                                        <input
                                            value={nombreLaboratorioClinico}
                                            onChange={(e) => setNombreLaboratorioClinico(e.target.value)}
                                            type="text" placeholder="Ej. Laboratorio Clínico Central" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">RUT institución</span>
                                        <input
                                            value={rutInstitucion}
                                            onChange={(e) => setRutInstitucion(e.target.value)}
                                            type="text" placeholder="12.345.678-9" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Representante legal</span>
                                        <input
                                            value={representanteLegal}
                                            onChange={(e) => setRepresentanteLegal(e.target.value)}
                                            type="text" placeholder="Nombre completo" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Correo de contacto</span>
                                        <input
                                            value={emailContacto}
                                            onChange={(e) => setEmailContacto(e.target.value)}
                                            type="email" placeholder="contacto@laboratorio.cl" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Teléfono de contacto</span>
                                        <input
                                            value={telefonoContacto}
                                            onChange={(e) => setTelefonoContacto(e.target.value)}
                                            type="tel" placeholder="+56 9 1234 5678" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                </div>
                            </section>

                            <section>
                                <div className="mb-3 flex items-center gap-2">
                                    <MapPin aria-hidden="true" className="size-4 text-status-ok" />
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-faint">Ubicación institucional</p>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <label className="flex flex-col gap-1.5 sm:col-span-2">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Dirección</span>
                                        <input
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
                                            type="text" placeholder="Calle, número y oficina" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Comuna</span>
                                        <input
                                            value={comuna}
                                            onChange={(e) => setComuna(e.target.value)}
                                            type="text" placeholder="Ej. Providencia" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Ciudad</span>
                                        <input
                                            value={ciudad}
                                            onChange={(e) => setCiudad(e.target.value)}
                                            type="text" placeholder="Ej. Santiago" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">Región</span>
                                        <input
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            type="text" placeholder="Ej. Metropolitana" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">País</span>
                                        <input
                                            value={pais}
                                            onChange={(e) => setPais(e.target.value)}
                                            type="text" placeholder="Ej. Chile" className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-line/60" />
                                    </label>
                                </div>
                            </section>

                            <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 sm:justify-end">
                                    <button type="button" popoverTarget="formulario-nuevo-laboratorio" popoverTargetAction="hide" className="inline-flex h-10 items-center justify-center rounded-lg border border-line px-3.5 text-xs font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink">
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => insertar(
                                            nombreLaboratorioClinico,
                                            rutInstitucion,
                                            representanteLegal,
                                            emailContacto,
                                            telefonoContacto,
                                            direccion,
                                            comuna,
                                            ciudad,
                                            region,
                                            pais
                                        )}
                                        type="button" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-xs font-semibold text-white transition hover:bg-accent-strong">
                                        <CheckCircle2 aria-hidden="true" className="size-3.5" />
                                        Guardar laboratorio
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
