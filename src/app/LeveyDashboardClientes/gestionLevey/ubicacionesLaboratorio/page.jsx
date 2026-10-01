"use client";

import {
    CirclePlus,
    Pencil,
    Power,
    Save,
    Search,
    Tags,
} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@clerk/nextjs";
import Toaster from "@/components/ui/toast";
import ubicacionesBackend, {
    actualizarUbicacion,
    desactivar,
    insertarUbicacion,
    obtenerUbicaciones,
    seleccionarUbicacionEspecifica,
    activar
} from "@/app/LeveyDashboardClientes/servicesBackend/ubicaciones";


export default function PaginaUbicacionesLaboratorio() {
  const [popupInsertar, setPopupInsertar] = useState(false);
  const [popupEditar, setPopupEditar] = useState(false);
  const toasterRef = useRef(null);
  const {getToken,userId} = useAuth();


  const [dataUbicaciones, setDataUbicaciones]=useState([])
  async function listar(){
      try {
          const TOKEN = await getToken();

          const respuestaBackend = await obtenerUbicaciones(TOKEN);

          if(respuestaBackend.success){
              setDataUbicaciones(respuestaBackend.data);
              return toasterRef.current?.show({
                  title: `${respuestaBackend.message}`,
                  variant: "success",
                  duration: 4000,
              });
          }

          if(!respuestaBackend.success){
              setDataUbicaciones(respuestaBackend.data);
              return toasterRef.current?.show({
                  title: `${respuestaBackend.message}`,
                  variant: "error",
                  duration: 4000,
              });
          }

      }catch (e) {
          return toasterRef.current?.show({
              title: `${e.message}`,
              variant: "error",
              duration: 4000,
          });
      }
  }

  useEffect(() => {
      listar();
  }, []);




    const [nombreUbicacion, setNombreUbicacion]=useState("");
    const [detalleUbicacion, setDetalleUbicacion]=useState("");
    const [detalleAlmacenamiento, setDetalleAlmacenamiento]=useState("");

    async function insertar(
        nombreUbicacion,
        detalleUbicacion,
        detalleAlmacenamiento,
        ){
        try {
            const TOKEN = await getToken();
            const respuestaBackend = await insertarUbicacion(
                nombreUbicacion,
                detalleUbicacion,
                detalleAlmacenamiento,
                userId,
                TOKEN)

            if(respuestaBackend.success){
                setNombreUbicacion("");
                setDetalleUbicacion("");
                setDetalleAlmacenamiento("");
                setPopupInsertar(false);
                await listar();
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
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
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }







    const [nombreUbicacionEdit, setNombreUbicacionEdit]=useState("");
    const [detalleUbicacionEdit, setDetalleUbicacionEdit]=useState("");
    const [detalleAlmacenamientoEdit, setDetalleAlmacenamientoEdit]=useState("");
    const [idUbicacion, setIdUbicacion]=useState("");
    async function seleccionar(
        idUbicacion){
        try {
            const TOKEN = await getToken();
            const respuestaBackend = await seleccionarUbicacionEspecifica(
                idUbicacion,
                TOKEN)


            if(respuestaBackend.success){
                setPopupEditar(true);
                setNombreUbicacionEdit(respuestaBackend.data.nombreUbicacion);
                setDetalleUbicacionEdit(respuestaBackend.data.detalleUbicacion);
                setDetalleAlmacenamientoEdit(respuestaBackend.data.detalleAlmacenamiento);
                setIdUbicacion(respuestaBackend.data.idUbicacion);
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
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
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }


    async function actualizar(
        idUbicacion,
        nombreUbicacionEdit,
        detalleUbicacionEdit,
        detalleAlmacenamientoEdit){
        try {
            const TOKEN = await getToken();

            const respuestaBackend = await actualizarUbicacion(
                idUbicacion,
                nombreUbicacionEdit,
                detalleUbicacionEdit,
                detalleAlmacenamientoEdit,
                userId,
                TOKEN)

            if(respuestaBackend.success){
                setNombreUbicacionEdit("");
                setDetalleUbicacionEdit("");
                setDetalleAlmacenamientoEdit("");
                setIdUbicacion("");
                setPopupEditar(false);
                await listar();
                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
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
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }








    async function desactivarUbicacion(
        idUbicacion
    ){
        try {
            const TOKEN = await getToken();
            const respuestaBackend = await desactivar(idUbicacion,TOKEN);

            if(respuestaBackend.success){
                await listar();

                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
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
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }




    async function activarUbicacion(
        idUbicacion
    ){
        try {
            const TOKEN = await getToken();
            const respuestaBackend = await activar(idUbicacion,TOKEN);

            if(respuestaBackend.success){
                await listar();

                return toasterRef.current?.show({
                    title: `${respuestaBackend.message}`,
                    variant: "success",
                    duration: 4000,
                });
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
                title: `${e.message}`,
                variant: "error",
                duration: 4000,
            });
        }
    }

    function activoStrig(intActivo){
      return intActivo === 1 ? "Activo" : "Inactivo";
  }
  return (
    <main className="min-h-dvh bg-canvas px-5 py-8 text-ink sm:px-8 lg:px-10 lg:py-12">
        <Toaster ref={toasterRef} />
        <div className="mx-auto max-w-7xl">
        <header className="border-b border-line pb-8">
          <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-status-info">
            <span className="size-1.5 rounded-full bg-status-info" aria-hidden="true" />
            Gestión del laboratorio
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
              Ubicaciones del laboratorio
            </h1>
            <button type="button" onClick={() => setPopupInsertar(true)} className="inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2.5 rounded-xl bg-ink px-5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-accent-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-status-info motion-reduce:transition-none">
              <span className="text-base leading-none" aria-hidden="true">+</span>
              Agregar ubicación
            </button>
          </div>
        </header>

        <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_14px_38px_rgb(15_23_42_/_0.07)]">
          <div className="border-b border-line bg-white px-5 py-6 sm:px-7">
            <h2 className="text-base font-semibold tracking-[-0.02em] text-ink">Listado de ubicaciones</h2>
            <p className="mt-1.5 text-sm leading-6 text-ink-muted">Consulta las áreas y condiciones de almacenamiento disponibles.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[21%]" />
                <col className="w-[24%]" />
                <col className="w-[27%]" />
                <col className="w-[13%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-line bg-canvas">
                  <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Nombre de la ubicación</th>
                  <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Detalle</th>
                  <th scope="col" className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Detalle de almacenamiento</th>
                  <th scope="col" className="px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Estado</th>
                  <th scope="col" className="px-6 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">

              {
                  dataUbicaciones.map((item, index) => {return(
                      <tr key={item.idUbicacion} className="group transition-colors duration-200 hover:bg-status-info-soft/30">
                          <td className="border-l-2 border-transparent px-6 py-6 align-middle text-sm font-semibold leading-6 text-ink group-hover:border-status-info/40">{item.nombreUbicacion}</td>
                          <td className="px-6 py-6 align-middle text-[13px] leading-6 text-ink-muted">{item.detalleUbicacion}</td>
                          <td className="px-6 py-6 align-middle text-[13px] leading-6 text-ink-muted">{item.detalleAlmacenamiento}</td>
                          <td className="px-6 py-5 text-center align-middle"><span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ring-1 ring-inset ring-current/10 ${item.activo === 1 ? "bg-status-ok-soft text-status-ok" : "bg-surface-muted text-ink-muted"}`}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{activoStrig(item.activo)}</span></td>
                          <td className="px-6 py-5 align-middle">
                              <div className="flex justify-center gap-2">
                                  <button type="button" onClick={() => seleccionar(item.idUbicacion)} aria-label="Editar ubicación" title="Editar ubicación" className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-canvas text-status-info transition duration-200 hover:border-status-info/40 hover:bg-status-info-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true"><path d="M12 20h9" strokeLinecap="round" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                  </button>
                                  <button
                                      onClick={() => {
                                          const estado = item.activo;
                                          estado ? desactivarUbicacion(item.idUbicacion) : activarUbicacion(item.idUbicacion);
                                      }}
                                      type="button" aria-label="Activar o desactivar ubicación" title="Activar o desactivar ubicación" className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-line bg-white text-ink-muted transition-colors hover:border-status-ok/50 hover:bg-status-ok-soft hover:text-status-ok focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className="size-4" aria-hidden="true"><path d="M12 2v10" strokeLinecap="round" /><path d="M6.2 4.8a9 9 0 1 0 11.6 0" strokeLinecap="round" /></svg>
                                  </button>
                              </div>
                          </td>
                      </tr>
                  )})
              }

              </tbody>
            </table>
          </div>
        </section>

        {popupInsertar ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-insertar-ubicacion">
            <div className="max-h-[calc(100dvh-3rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-3xl border border-line bg-white shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-line bg-canvas px-6 py-7 sm:px-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-status-info">Nueva ubicación</p>
                  <h2 id="titulo-insertar-ubicacion" className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">Agregar ubicación</h2>
                  <p className="mt-2 text-sm text-ink-muted">Registra un nuevo espacio de almacenamiento del laboratorio.</p>
                </div>
                <button type="button" onClick={() => setPopupInsertar(false)} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-xl leading-none text-status-info transition-colors hover:bg-status-info-soft hover:text-status-info focus-visible:outline-2 focus-visible:outline-status-info" aria-label="Cerrar formulario">×</button>
              </div>

              <form onSubmit={(evento) => evento.preventDefault()} className="grid gap-6 px-6 py-7 sm:grid-cols-2 sm:px-8">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold tracking-[0.01em] text-ink-muted">Nombre de la ubicación</span>
                  <input
                      value={nombreUbicacion}
                      onChange={(evento) => setNombreUbicacion(evento.target.value)}
                      name="nombreUbicacionInsertar" type="text" placeholder="Ej. Refrigerador A" className="mt-2.5 h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint hover:border-line-strong focus:border-status-info focus:bg-white focus:ring-4 focus:ring-status-info/10" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold tracking-[0.01em] text-ink-muted">Detalle</span>
                  <input
                      value={detalleUbicacion}
                      onChange={(evento) => setDetalleUbicacion(evento.target.value)}
                      name="detalleUbicacionInsertar" type="text" placeholder="Ej. Sector de bioquímica · Estante 2" className="mt-2.5 h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint hover:border-line-strong focus:border-status-info focus:bg-white focus:ring-4 focus:ring-status-info/10" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold tracking-[0.01em] text-ink-muted">Detalle de almacenamiento</span>
                  <input
                      value={detalleAlmacenamiento}
                      onChange={(evento) => setDetalleAlmacenamiento(evento.target.value)}
                      name="almacenamientoUbicacionInsertar" type="text" placeholder="Ej. 2 °C a 8 °C · Acceso restringido" className="mt-2.5 h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint hover:border-line-strong focus:border-status-info focus:bg-white focus:ring-4 focus:ring-status-info/10" />
                </label>
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5 sm:col-span-2">
                  <button type="button" onClick={() => setPopupInsertar(false)} className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">Cancelar</button>
                  <button
                      onClick={() =>
                          insertar(
                              nombreUbicacion,
                              detalleUbicacion,
                              detalleAlmacenamiento,
                          )
                  }
                      type="submit" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">Guardar ubicación</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {popupEditar ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="titulo-editar-ubicacion">
            <div className="max-h-[calc(100dvh-3rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-3xl border border-line bg-white shadow-2xl">
              <div className="flex items-start justify-between gap-4 border-b border-line bg-canvas px-6 py-7 sm:px-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-status-info">Edición de ubicación</p>
                  <h2 id="titulo-editar-ubicacion" className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">Editar ubicación</h2>
                  <p className="mt-2 text-sm text-ink-muted">Modifica los datos de la ubicación seleccionada.</p>
                </div>
                <button type="button" onClick={() => setPopupEditar(false)} className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-xl leading-none text-status-info transition-colors hover:bg-status-info-soft hover:text-status-info focus-visible:outline-2 focus-visible:outline-status-info" aria-label="Cerrar edición">×</button>
              </div>

              <form onSubmit={(evento) => evento.preventDefault()} className="grid gap-6 px-6 py-7 sm:grid-cols-2 sm:px-8">
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold tracking-[0.01em] text-ink-muted">Nombre de la ubicación</span>
                  <input
                      value={nombreUbicacionEdit}
                      onChange={(evento) => setNombreUbicacionEdit(evento.target.value)}
                      name="nombreUbicacionEditar" type="text" placeholder="Ingresa el nombre actualizado" className="mt-2.5 h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint hover:border-line-strong focus:border-status-info focus:bg-white focus:ring-4 focus:ring-status-info/10" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold tracking-[0.01em] text-ink-muted">Detalle</span>
                  <input
                      value={detalleUbicacionEdit}
                      onChange={(evento) => setDetalleUbicacionEdit(evento.target.value)}
                      name="detalleUbicacionEditar" type="text" placeholder="Ingresa el detalle actualizado" className="mt-2.5 h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint hover:border-line-strong focus:border-status-info focus:bg-white focus:ring-4 focus:ring-status-info/10" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-semibold tracking-[0.01em] text-ink-muted">Detalle de almacenamiento</span>
                  <input
                      value={detalleAlmacenamientoEdit}
                      onChange={(evento) => setDetalleAlmacenamientoEdit(evento.target.value)}
                      name="almacenamientoUbicacionEditar" type="text" placeholder="Ingresa las condiciones actualizadas" className="mt-2.5 h-12 w-full rounded-xl border border-line bg-canvas px-4 text-sm text-ink outline-none transition placeholder:text-ink-faint hover:border-line-strong focus:border-status-info focus:bg-white focus:ring-4 focus:ring-status-info/10" />
                </label>
                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5 sm:col-span-2">
                  <button type="button" onClick={() => setPopupEditar(false)} className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">Cancelar</button>
                  <button
                      onClick={
                          ()=> actualizar(
                              idUbicacion,
                              nombreUbicacionEdit,
                              detalleUbicacionEdit,
                              detalleAlmacenamientoEdit)
                      }
                      type="submit" className="rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
