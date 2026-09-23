"use client"

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

export default function PaginaCategorias() {
    const toasterRef = useRef(null);
    const API = process.env.NEXT_PUBLIC_API_URL;
    const {getToken,userId} = useAuth();




    const [nombreCategoria, setNombreCategoria] = useState("");
    async function insertarCategoria(nombreCategoria) {
        if (nombreCategoria.trim() === "") {
            return toasterRef.current?.show({
                title: "Ingresa un nombre de categoría",
                variant: "error",
                duration: 1500,
            });
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API}/categorias`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                      nombreCategoria : nombreCategoria,
                      usuarioCreacion : userId
                })
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible insertar la nueva categoria",
                    variant: "error",
                    duration: 1000,
                });

            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    setNombreCategoria("");
                    await cargarDatosCategorias();
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 1500,
                    });
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


    const [dataCategorias, setDataCategorias] = useState([]);

    async function cargarDatosCategorias() {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/categorias`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible cargar las categorias",
                    variant: "error",
                    duration: 1000,
                });

            } else {

                const respuestaBackend = await res.json();
                if (respuestaBackend.success) {
                    setDataCategorias(respuestaBackend.data);
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










    async function seleccionar(idCategoria) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/categorias/${idCategoria}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible cargar las informacion. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    setNombreCategoriaEdit(respuestaBackend.data.nombreCategoria);
                    setIdCategoria(respuestaBackend.data.idCategoria);

                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 2000,
                    });
                }

                if (!respuestaBackend.success) {
                    return toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 1500,
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



    const mockCategorias = dataCategorias.map((categoria) => {
        return{
            id: categoria.idCategoria,
            popupId: categoria.idCategoria,
            nombre: categoria.nombreCategoria,
            estado: categoria.activo,
            estiloEstado: categoria.activo === 1
                ? "bg-status-ok-soft text-status-ok"
                : "bg-surface-muted text-ink-muted",
        }
    })
    function estadoEnPalabras(estado) {
        if (estado===0) {
            return "Inactivo";
        }
        if (estado===1) {
            return "Activo";
        }
    }







    const [nombreCategoriaEdit, setNombreCategoriaEdit] = useState("");
    const [idCategoria, setIdCategoria] = useState(null);

    async function actualizar(
        nombreCategoriaEdit,
        idCategoria,
        activoActual
    ) {
        if (nombreCategoriaEdit.trim() === "") {
            return toasterRef.current?.show({
                title: "Ingresa un nombre de categoría",
                variant: "error",
                duration: 1500,
            });
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API}/categorias`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombreCategoria : nombreCategoriaEdit,
                    activo: activoActual,
                    idCategoria : idCategoria,
                    usuarioModificacionId : userId
                })
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible insertar la nueva categoria",
                    variant: "error",
                    duration: 1000,
                });

            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    setNombreCategoriaEdit("");
                    setIdCategoria(null);
                    await cargarDatosCategorias();
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 1500,
                    });
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





    async function cargarActivos() {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/categorias/activas`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible cargar las informacion. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    setDataCategorias(respuestaBackend.data);
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 2000,
                    });
                }

                if (!respuestaBackend.success) {
                    return toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 1500,
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




    async function desactivar(idCategoria) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/categorias/desactivar/${idCategoria}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible desactivar la categoría. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                  await cargarDatosCategorias();
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 2000,
                    });
                }

                if (!respuestaBackend.success) {
                    return toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 1500,
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








    const [nombreBusqueda, setNombreBusqueda] = useState("");

    async function buscarSimilitud(nombreBusqueda) {
        try {
            const token = await getToken();
            const terminoCodificado = encodeURIComponent(nombreBusqueda.trim());
            const res = await fetch(`${API}/categorias/similitud/${terminoCodificado}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible encontrar la categoría. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    setDataCategorias(respuestaBackend.data);
                    return;
                }

                if (!respuestaBackend.success) {
                    return toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 1500,
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
        const termino = nombreBusqueda.trim();
        const temporizador = setTimeout(() => {
            if (termino === "") {
                cargarDatosCategorias();
            } else {
                buscarSimilitud(termino);
            }
        }, 300);

        return () => clearTimeout(temporizador);
    }, [nombreBusqueda]);






    async function activar(idCategoria) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/categorias/activar/${idCategoria}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible activar la categoría. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    await cargarDatosCategorias();
                    return  toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "success",
                        duration: 2000,
                    });
                }

                if (!respuestaBackend.success) {
                    return toasterRef.current?.show({
                        title: `${respuestaBackend.message}`,
                        variant: "error",
                        duration: 1500,
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





    return (
    <div className="min-h-dvh bg-canvas px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
        <Toaster ref={toasterRef} />
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">
              <span>Gestión</span>
              <span className="text-line-strong">/</span>
              <span className="text-ink-muted">Categorias Disponibles</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">
              Categorías
            </h1>

          </div>

          <button
            type="button"
            popoverTarget="popup-nueva-categoria"
            aria-controls="popup-nueva-categoria"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <CirclePlus className="size-4" aria-hidden="true" />
            Ingresar categoría
          </button>
        </header>

        <div
          id="popup-nueva-categoria"
          popover="auto"
          className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/35"
        >
          <div className="bg-ink px-5 py-5 text-white sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                  Catálogo maestro
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                  Ingresar nueva categoría
                </h2>
                <p className="mt-1 text-sm text-white/75">
                  Registra el nombre que agrupará tus analitos.
                </p>
              </div>
              <button
                type="button"
                popoverTarget="popup-nueva-categoria"
                popoverTargetAction="hide"
                aria-label="Cerrar formulario"
                className="flex size-8 items-center justify-center rounded-lg text-xl leading-none text-white/75 transition hover:bg-white/15 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          <form className="space-y-5 p-5 sm:p-7">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                Nombre de la categoría
              </span>
              <input
                  value={nombreCategoria}
                  onChange={(e) => setNombreCategoria(e.target.value)}
                type="text"
                placeholder="Ej. Química clínica"
                className="h-11 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-line-strong focus:ring-2 focus:ring-ink/10"
              />
            </label>
            <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                popoverTarget="popup-nueva-categoria"
                popoverTargetAction="hide"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink"
              >
                Cancelar
              </button>
              <button
                  onClick={() => insertarCategoria(nombreCategoria)}
                type="button"
                popoverTarget="popup-nueva-categoria"
                popoverTargetAction="hide"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                <CirclePlus className="size-4" aria-hidden="true" />
                Guardar categoría
              </button>
            </div>
          </form>
        </div>

        <section className="mt-7 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_14px_38px_rgb(15_23_42_/_0.07)]">
          <div className="flex flex-col gap-4 border-b border-line bg-surface px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.025em] text-ink">Listado de categorías</h2>
            </div>
            <label className="group flex h-12 min-w-0 items-center gap-3 rounded-2xl border border-line bg-canvas py-1.5 pl-2 pr-3 text-ink-muted shadow-[0_2px_8px_rgb(15_23_42_/_0.06)] transition-all duration-200 hover:border-line-strong hover:bg-surface focus-within:border-status-info focus-within:bg-surface focus-within:ring-4 focus-within:ring-status-info/10 sm:w-[380px]">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-ink-muted transition group-focus-within:bg-status-info-soft group-focus-within:text-status-info">
                <Search className="size-4" aria-hidden="true" />
              </span>
              <span className="sr-only">Buscar categoría</span>
              <input
                  onChange={(e) => setNombreBusqueda(e.target.value)}
                  value={nombreBusqueda}
                type="search"
                placeholder="Buscar categoría..."
                className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
              />
              <span className="hidden rounded-lg border border-line bg-surface px-2 py-1 font-mono text-[10px] font-semibold text-ink-faint sm:inline-flex" aria-hidden="true">⌘ K</span>
            </label>
          </div>

          <div className="overflow-x-auto bg-surface">
            <table className="w-full min-w-[800px] text-left">
              <thead className="border-b border-line bg-canvas text-[10px] font-bold uppercase tracking-[0.13em] text-ink-faint">
                <tr>
                  <th className="w-20 px-5 py-4">ID</th>
                  <th className="px-5 py-4">Categoría</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {mockCategorias.map((categoria) => (
                  <tr key={categoria.id} className="group transition-colors duration-150 hover:bg-[#f8f7ff]">
                    <td className="px-5 py-5 font-mono text-xs font-semibold text-ink-faint">{categoria.id}</td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3.5">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-status-info-soft text-status-info shadow-sm transition group-hover:scale-105">
                          <Tags className="size-[18px]" aria-hidden="true" />
                        </span>
                        <p className="text-[15px] font-semibold tracking-[-0.015em] text-ink">{categoria.nombre}</p>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span
                          className={`inline-flex w-24 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${categoria.estiloEstado}`}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {estadoEnPalabras(categoria.estado)}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                            onClick={()=>seleccionar(categoria.id)}
                          type="button"
                          popoverTarget={`popup-editar-categoria-${categoria.popupId}`}
                          aria-controls={`popup-editar-categoria-${categoria.popupId}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-xs font-semibold text-ink shadow-sm transition hover:border-status-info/40 hover:bg-status-info-soft/50 hover:text-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info"
                        >
                          <Pencil className="size-3.5 text-ink-muted" aria-hidden="true" />
                          Editar
                        </button>
                        <button
                            onClick={()=>{
                                let estado;
                                if(categoria.estado === 1) estado = true;
                                if(categoria.estado === 0) estado = false;
                                estado ? desactivar(categoria.id) : activar(categoria.id);
                            }}
                          type="button"
                          aria-label={categoria.estado === 1 ? "Desactivar categoría" : "Activar categoría"}
                          title={categoria.estado === 1 ? "Desactivar categoría" : "Activar categoría"}
                          className={`inline-flex size-9 items-center justify-center rounded-lg border bg-surface shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            categoria.estado === 1
                              ? "border-status-alert-soft text-status-alert hover:bg-status-alert-soft"
                              : "border-line text-ink-muted hover:bg-surface-muted"
                          }`}
                        >
                          <Power className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <div
                        id={`popup-editar-categoria-${categoria.popupId}`}
                        popover="auto"
                        className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/35"
                      >
                        <div className="bg-ink px-5 py-5 text-white sm:px-7">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                                Catálogo de categorías
                              </p>
                              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                                Formulario de edición
                              </h2>
                              <p className="mt-1 text-sm text-white/75">
                                Actualiza el nombre de la categoría seleccionada.
                              </p>
                            </div>
                            <button
                              type="button"
                              popoverTarget={`popup-editar-categoria-${categoria.popupId}`}
                              popoverTargetAction="hide"
                              aria-label="Cerrar formulario de edición"
                              className="flex size-8 items-center justify-center rounded-lg text-xl leading-none text-white/75 transition hover:bg-white/15 hover:text-white"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <form className="space-y-5 p-5 sm:p-7">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                              Nombre de la categoría
                            </span>
                            <input
                              type="text"
                              value={nombreCategoriaEdit}
                              onChange={(e) => setNombreCategoriaEdit(e.target.value)}
                              className="h-11 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-ink/10"
                            />
                          </label>

                          <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
                            <button
                              type="button"
                              popoverTarget={`popup-editar-categoria-${categoria.popupId}`}
                              popoverTargetAction="hide"
                              className="inline-flex h-10 items-center justify-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink"
                            >
                              Cancelar
                            </button>
                            <button
                                onClick={() => actualizar(nombreCategoriaEdit, idCategoria, categoria.estado)}
                              type="button"
                                popoverTarget={`popup-editar-categoria-${categoria.popupId}`}
                                popoverTargetAction="hide"
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong"
                            >
                              <Save className="size-4" aria-hidden="true" />
                              Guardar cambios
                            </button>
                          </div>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
