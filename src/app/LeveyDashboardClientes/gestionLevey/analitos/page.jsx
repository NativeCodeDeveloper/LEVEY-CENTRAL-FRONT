"use client"
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@clerk/nextjs";
import Toaster from "@/components/ui/toast";
import {CirclePlus,FlaskConical, LoaderCircle, Pencil, Power,Save,Search,SlidersHorizontal} from "lucide-react";



export default function PaginaAnalitos() {
    const toasterRef = useRef(null);
    const API = process.env.NEXT_PUBLIC_API_URL;
    const {getToken,userId} = useAuth();
    const[estadoPopUpInsertar, setEstadoPopUpInsertar]=useState(false);
    const[estadoPopUpEditar, setEstadoPopUpEditar]=useState(false);



    const [data, setData] = useState([])
    async function cargarDatos() {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/analitos`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible cargar las informacion. Contacte a soporte",
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
        cargarDatos();
    }, []);







    const [dataCategorias, setDataCategorias] = useState([])
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
                    title: "No fue posible cargar las informacion. Contacte a soporte",
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

    useEffect(() => {
        cargarDatosCategorias();
    }, []);






    const [dataUnidadMedida, setDataUnidadMedida] = useState([])
    async function cargarDatosUnidadMedida() {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/unidadDeMedida`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible cargar las informacion. Contacte a soporte",
                    variant: "error",
                    duration: 1000,
                });

            } else {
                const respuestaBackend = await res.json();
                if (respuestaBackend.success) {
                    setDataUnidadMedida(respuestaBackend.data);
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
        cargarDatosUnidadMedida();
    }, []);








    const [dataMatriz, setDataMatriz] = useState([])
    async function cargarDatosMatriz() {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/matriz`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible cargar las informacion. Contacte a soporte",
                    variant: "error",
                    duration: 1000,
                });

            } else {
                const respuestaBackend = await res.json();
                if (respuestaBackend.success) {
                    setDataMatriz(respuestaBackend.data);
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
        cargarDatosMatriz();
    }, []);




    const[idCategoria, setIdCategoria]=useState(null);
    const[idMatriz, setIdMatriz]=useState(null);
    const[nombreAnalito, setNombreAnalito]=useState("");
    const[abreviacion, setAbreviacion]=useState("");
    const[unidadMedidaId, setUnidadMedidaId]=useState(null);

    async function insertar(
        idCategoria,
        idMatriz,
        nombreAnalito,
        abreviacion,
        unidadMedidaId
    ) {
        if (nombreAnalito.trim() === "") {
            return toasterRef.current?.show({
                title: "Ingresa un texto valido",
                variant: "error",
                duration: 1500,
            });
        }
        try {
            const token = await getToken();
            const res = await fetch(`${API}/analitos`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idCategoria : idCategoria,
                    idMatriz : idMatriz,
                    nombreAnalito : nombreAnalito,
                    abreviacion : abreviacion,
                    unidadMedidaId : unidadMedidaId,
                    usuarioCreacion : userId
                })
            })
            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible insertar el nuevo elemento",
                    variant: "error",
                    duration: 1000,
                });
            } else {
                const respuestaBackend = await res.json();
                if (respuestaBackend.success) {
                    document.getElementById("popup-nuevo-analito")?.hidePopover();
                    setNombreAnalito("");
                    setIdCategoria(null);
                    setIdMatriz(null);
                    setAbreviacion("");
                    setUnidadMedidaId(null);
                    setEstadoPopUpInsertar(false);
                    await cargarDatos();
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





    const mockAnalitos = data.map((objeto) => {
   return        {
       id: objeto[3],
       codigo: objeto[5],
       nombre: objeto[4],
       categoria: objeto[0],
       muestra: objeto[2],
    unidad: objeto[1],
    rango: "70 – 100",
    minimo: "70",
    maximo: "100",
       activo:objeto[6],
       estado: estadoStringLetras(objeto[6]),
    estiloEstado: estadoStringColor(objeto[6]),
    popupId: objeto[3],
    }
    })


    function estadoStringColor(estado) {
        switch (estado) {
            case 1:
                return "bg-status-ok-soft text-status-ok";
            case 0:
                return "bg-surface-muted text-ink-muted";
            default:
                return "bg-status-warning-soft text-status-warning";
        }
    }


    function estadoStringLetras(estado) {
        switch (estado) {
            case 1:
                return "Activo";
            case 0:
                return "Inactivo";
            default:
                return "Desconocido";
        }
    }








    async function desactivar(idAnalito) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/analitos/desactivar/${idAnalito}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible desactivar el analito. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    await cargarDatos();
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






    async function activar(idAnalito) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/analitos/activar/${idAnalito}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible activar el analito. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    await cargarDatos();
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




    async function seleccionar(idAnalito) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/analitos/${idAnalito}`, {
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
                    const analitoSeleccionado = respuestaBackend.data;
                    setIdAnalitoEdit(analitoSeleccionado.idAnalito);
                    setNombreAnalitoEdit(analitoSeleccionado.nombreAnalito);
                    setAbreviacionEdit(analitoSeleccionado.abreviacion);
                    setIdCategoriaEdit(analitoSeleccionado.idCategoria);
                    setIdMatrizEdit(analitoSeleccionado.idMatriz);
                    setEstadoEdit(analitoSeleccionado.activo);
                    setUnidadMedidaIdEdit(analitoSeleccionado.unidadMedidaId);
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






    const[idCategoriaEdit, setIdCategoriaEdit]=useState(null);
    const[estadoEdit, setEstadoEdit]= useState(null);
    const[idMatrizEdit, setIdMatrizEdit]=useState(null);
    const[nombreAnalitoEdit, setNombreAnalitoEdit]=useState("");
    const[abreviacionEdit, setAbreviacionEdit]=useState("");
    const[unidadMedidaIdEdit, setUnidadMedidaIdEdit]=useState(null);
    const[idAnalitoEdit, setIdAnalitoEdit]=useState(null);

    async function actualizar(
        idCategoriaEdit,
        idMatrizEdit,
        nombreAnalitoEdit,
        abreviacionEdit,
        estadoEdit,
        unidadMedidaIdEdit,
        idAnalitoEdit
    ) {
        if (nombreAnalitoEdit.trim() === "") {
            return toasterRef.current?.show({
                title: "Ingresa un texto valido",
                variant: "error",
                duration: 1500,
            });
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API}/analitos/actualizar`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idAnalito: idAnalitoEdit,
                    idCategoria : idCategoriaEdit,
                    idMatriz : idMatrizEdit,
                    nombreAnalito : nombreAnalitoEdit,
                    abreviacion : abreviacionEdit,
                    unidadMedidaId : unidadMedidaIdEdit,
                    activo : estadoEdit,
                    usuarioModificacion : userId
                })
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible actualizar el analito",
                    variant: "error",
                    duration: 1000,
                });

            } else {
                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    document.getElementById(`popup-editar-analito-${idAnalitoEdit}`)?.hidePopover();
                    setNombreAnalitoEdit("");
                    setIdAnalitoEdit(null);
                    setIdCategoriaEdit(null);
                    setIdMatrizEdit(null);
                    setAbreviacionEdit("");
                    setEstadoEdit(null);
                    setUnidadMedidaIdEdit(null);
                    setEstadoPopUpEditar(false);
                    await cargarDatos();
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











    const[nombreAnalitoBuscado, setnombreAnalitoBuscado] = useState("");
    const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
    const busquedaInicialRef = useRef(true);

    async function buscarSimilar(nombreAnalito) {
        setCargandoBusqueda(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API}/analitos/similitud/${nombreAnalito}`, {
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
                    setData(respuestaBackend.data);

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
        } finally {
            setCargandoBusqueda(false);
        }
    }


    useEffect(() => {
        if (busquedaInicialRef.current) {
            busquedaInicialRef.current = false;
            return;
        }

        const esperaBusqueda = setTimeout(() => {
            const termino = nombreAnalitoBuscado.trim();

            if (termino === "") {
                setCargandoBusqueda(true);
                cargarDatos().finally(() => setCargandoBusqueda(false));
                return;
            }

            buscarSimilar(encodeURIComponent(termino));
        }, 300);

        return () => clearTimeout(esperaBusqueda);
    }, [nombreAnalitoBuscado]);





    const[idCategoriaBusqueda, setIdCategoriaBusqueda] = useState(null);
    async function buscarPorCategoria(idCategoria) {
        setCargandoBusqueda(true);
        try {
            const token = await getToken();
            const res = await fetch(`${API}/analitos/buscar/${idCategoria}`, {
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
                    setData(respuestaBackend.data);

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
        } finally {
            setCargandoBusqueda(false);
        }
    }


    useEffect(() => {
        if (idCategoriaBusqueda == null || idCategoriaBusqueda === "") {
            cargarDatos();
        }else{
            buscarPorCategoria(idCategoriaBusqueda);
        }
    }, [idCategoriaBusqueda]);

    return (
    <div className="min-h-dvh bg-canvas px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
        <Toaster ref={toasterRef} />
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">
              <span>Gestión</span>
              <span className="text-line-strong">/</span>
              <span className="text-[#6854c7]">Catálogo maestro</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">
              Analitos
            </h1>
          </div>

          <button
            onClick={() => setEstadoPopUpInsertar(true)}
            type="button"
            popoverTarget="popup-nuevo-analito"
            aria-controls="popup-nuevo-analito"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <CirclePlus className="size-4" aria-hidden="true" />
            Ingresar analito
          </button>
        </header>

        <div
          id="popup-nuevo-analito"
          popover="auto"
          className="m-auto max-h-[90vh] w-[min(680px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-5 text-ink shadow-2xl backdrop:bg-black/35 sm:p-6"
        >
          {estadoPopUpInsertar && (
          <form className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Código
                </span>
                <input
                  value={abreviacion}
                  onChange={(e) => setAbreviacion(e.target.value)}
                  type="text"
                  placeholder="Ej. GLU"
                  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-status-info focus:ring-2 focus:ring-status-info/15"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Nombre del analito
                </span>
                <input
                    value={nombreAnalito}
                    onChange={(e) => setNombreAnalito(e.target.value)}
                  type="text"
                  placeholder="Ej. Glucosa"
                  className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-status-info focus:ring-2 focus:ring-status-info/15"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Categoría
                </span>
                <select
                    onChange={(e) => setIdCategoria(e.target.value)}
                    className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-status-info focus:ring-2 focus:ring-status-info/15">
                  <option>Selecciona una categoría</option>
                    {
                        dataCategorias.map(categoria => (
                            <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>
                        ))
                    }
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Matriz de muestra
                </span>
                <select
                    onChange={(e) => setIdMatriz(e.target.value)}
                    className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-status-info focus:ring-2 focus:ring-status-info/15">
                    <option>Selecciona una Matriz de Muestra</option>
                    {
                        dataMatriz.map(matriz => (
                            <option key={matriz.idMatriz} value={matriz.idMatriz}>{matriz.nombreMatriz}</option>
                        ))
                    }
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Unidad de medida
                </span>
                <select
                    onChange={(e) => setUnidadMedidaId(e.target.value)}
                    className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-status-info focus:ring-2 focus:ring-status-info/15">
                    <option>Selecciona una Unidad de Medida</option>
                    {
                        dataUnidadMedida.map(unidad => (
                            <option key={unidad.idUnidadesDeMedida} value={unidad.idUnidadesDeMedida}>{unidad.unidadDeMedida}</option>
                        ))
                    }
                </select>
              </label>

            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                popoverTarget="popup-nuevo-analito"
                popoverTargetAction="hide"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-strong"
              >
                Cancelar
              </button>
              <button
                  onClick={() => insertar(
                      idCategoria,
                      idMatriz,
                      nombreAnalito,
                      abreviacion,
                      unidadMedidaId
                  )}
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <CirclePlus className="size-4" aria-hidden="true" />
                Guardar analito
              </button>
            </div>
          </form>
          )}
        </div>

        <section className="mt-7 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_14px_38px_rgb(15_23_42_/_0.07)]">
          <div className="flex flex-col gap-4 border-b border-line bg-surface px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[17px] font-semibold tracking-[-0.025em] text-ink">
                Listado de analitos
              </h2>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="group flex h-12 min-w-0 items-center gap-3 rounded-2xl border border-line bg-canvas py-1.5 pl-2 pr-3 text-ink-muted shadow-[0_2px_8px_rgb(15_23_42_/_0.06)] transition-all duration-200 hover:border-line-strong hover:bg-surface focus-within:border-status-info focus-within:bg-surface focus-within:ring-4 focus-within:ring-status-info/10 sm:w-[380px]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-ink-muted transition group-focus-within:bg-status-info-soft group-focus-within:text-status-info">
                  <Search className="size-4" aria-hidden="true" />
                </span>
                <span className="sr-only">Buscar analito</span>
                <input
                    value={nombreAnalitoBuscado}
                    onChange={(e) => setnombreAnalitoBuscado(e.target.value)}
                  type="search"
                  placeholder="Buscar por nombre o código..."
                  className="h-full min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
                />
                {cargandoBusqueda ? (
                  <span className="flex size-7 items-center justify-center text-status-info" role="status" aria-label="Buscando analitos">
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  </span>
                ) : (
                  <span className="hidden rounded-lg border border-line bg-surface px-2 py-1 font-mono text-[10px] font-semibold text-ink-faint sm:inline-flex" aria-hidden="true">
                    ⌘ K
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="border-b border-line bg-canvas/60 px-5 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-ink-muted" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-muted">
                Filtros del catálogo
              </p>
            </div>
            <div className="mt-3 max-w-sm">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                  Categoría
                </span>
                <select
                    onChange={(e) => setIdCategoriaBusqueda(e.target.value)}
                    className="h-10 rounded-xl border border-line bg-surface px-3.5 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-status-info focus:ring-4 focus:ring-status-info/10">
                  <option value={""}>Todas las categorías</option>
                    {
                        dataCategorias.map(categoria => (
                            <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>
                        ))
                    }
                </select>
              </label>
            </div>
          </div>

          <div className="overflow-x-auto bg-surface">
            <table className="w-full min-w-[980px] text-left">
              <thead className="border-b border-line bg-canvas text-[10px] font-bold uppercase tracking-[0.13em] text-ink-faint">
                <tr>
                  <th className="w-20 px-5 py-4">ID</th>
                  <th className="px-5 py-4">Analito</th>
                  <th className="px-5 py-4">Categoría</th>
                  <th className="px-5 py-4">Matriz</th>
                  <th className="px-5 py-4">Unidad</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {mockAnalitos.map((analito) => (
                  <tr key={analito.id} className="group transition-colors duration-150 hover:bg-[#f8f7ff]">
                    <td className="px-5 py-5 font-mono text-xs font-semibold text-ink-faint">
                      {analito.id}
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3.5">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-status-info-soft text-status-info shadow-sm transition group-hover:scale-105">
                          <FlaskConical className="size-[18px]" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-[15px] font-semibold tracking-[-0.015em] text-ink">{analito.nombre}</p>
                          <p className="mt-1 font-mono text-[11px] font-bold tracking-[0.04em] text-status-info">
                            {analito.codigo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-sm font-medium text-ink-muted">
                      {analito.categoria}
                    </td>
                    <td className="px-5 py-5 text-sm text-ink-muted">{analito.muestra}</td>
                    <td className="px-5 py-5">
                      <span className="inline-flex rounded-lg border border-line bg-canvas px-2.5 py-1 font-mono text-xs font-semibold text-ink-muted">
                        {analito.unidad}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex w-24 items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold ${analito.estiloEstado}`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {analito.estado}
                      </span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                              setEstadoPopUpEditar(true);
                              seleccionar(analito.id);
                            }}
                          type="button"
                          popoverTarget={`popup-editar-analito-${analito.popupId}`}
                          aria-controls={`popup-editar-analito-${analito.popupId}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-xs font-semibold text-ink shadow-sm transition hover:border-status-info/40 hover:bg-status-info-soft/50 hover:text-status-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-info"
                        >
                          <Pencil className="size-3.5 text-ink-muted" aria-hidden="true" />
                          Editar
                        </button>
                        <button
                            onClick={() => {
                                const activo = analito.activo;
                                activo ? desactivar(analito.id) : activar(analito.id);
                            }}
                          type="button"
                          aria-label="Desactivar analito"
                          title="Desactivar analito"
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-status-alert-soft bg-surface text-status-alert shadow-sm transition hover:bg-status-alert-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-alert"
                        >
                          <Power className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                      <div
                        id={`popup-editar-analito-${analito.popupId}`}
                        popover="auto"
                        className="m-auto max-h-[90vh] w-[min(680px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/35 sm:w-[min(700px,calc(100vw-3rem))]"
                      >
                        <div className="bg-ink px-5 py-5 text-white sm:px-7">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                                Catálogo de analitos
                              </p>
                              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                                Formulario de edición
                              </h2>
                              <p className="mt-1 text-sm text-white/75">
                                Actualiza la configuración de {analito.nombre}.
                              </p>
                            </div>
                            <button
                              type="button"
                              popoverTarget={`popup-editar-analito-${analito.popupId}`}
                              popoverTargetAction="hide"
                              aria-label="Cerrar formulario de edición"
                              className="flex size-8 items-center justify-center rounded-lg text-xl leading-none text-white/75 transition hover:bg-white/15 hover:text-white"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        {estadoPopUpEditar && (
                        <form className="space-y-5 p-5 sm:p-7">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                Código
                              </span>
                              <input
                                type="text"
                                value={abreviacionEdit}
                                onChange={(e) => setAbreviacionEdit(e.target.value)}
                                className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm font-mono font-semibold text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-ink/10"
                              />
                            </label>
                            <label className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                Nombre del analito
                              </span>
                              <input
                                type="text"
                                value={nombreAnalitoEdit}
                                onChange={(e) => setNombreAnalitoEdit(e.target.value)}
                                className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-ink/10"
                              />
                            </label>
                            <label className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                Categoría
                              </span>
                              <select
                                value={idCategoriaEdit ?? ""}
                                onChange={(e) => setIdCategoriaEdit(e.target.value)}
                                className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-ink/10"
                              >
                                <option value="" disabled>Selecciona una categoría</option>
                                {dataCategorias.map((categoria) => (
                                  <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombreCategoria}</option>
                                ))}
                              </select>
                            </label>
                            <label className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                Matriz de muestra
                              </span>
                              <select
                                value={idMatrizEdit ?? ""}
                                onChange={(e) => setIdMatrizEdit(e.target.value)}
                                className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-ink/10"
                              >
                                <option value="" disabled>Selecciona una matriz de muestra</option>
                                {dataMatriz.map((matriz) => (
                                  <option key={matriz.idMatriz} value={matriz.idMatriz}>{matriz.nombreMatriz}</option>
                                ))}
                              </select>
                            </label>
                            <label className="flex flex-col gap-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink-faint">
                                Unidad de medida
                              </span>
                              <select
                                value={unidadMedidaIdEdit ?? ""}
                                onChange={(e) => setUnidadMedidaIdEdit(e.target.value)}
                                className="h-10 rounded-lg border border-line bg-canvas px-3 text-sm text-ink outline-none transition focus:border-line-strong focus:ring-2 focus:ring-ink/10"
                              >
                                <option value="" disabled>Selecciona una unidad de medida</option>
                                {dataUnidadMedida.map((unidad) => (
                                  <option key={unidad.idUnidadesDeMedida} value={unidad.idUnidadesDeMedida}>{unidad.unidadDeMedida}</option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
                            <button
                              type="button"
                              popoverTarget={`popup-editar-analito-${analito.popupId}`}
                              popoverTargetAction="hide"
                              className="inline-flex h-10 items-center justify-center rounded-lg border border-line bg-surface px-4 text-sm font-semibold text-ink-muted transition hover:bg-surface-muted hover:text-ink"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => actualizar(
                                  idCategoriaEdit,
                                  idMatrizEdit,
                                  nombreAnalitoEdit,
                                  abreviacionEdit,
                                  estadoEdit,
                                  unidadMedidaIdEdit,
                                  idAnalitoEdit
                              )}
                              type="button"
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white transition hover:bg-accent-strong"
                            >
                              <Save className="size-4" aria-hidden="true" />
                              Guardar cambios
                            </button>
                          </div>
                        </form>
                        )}
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
