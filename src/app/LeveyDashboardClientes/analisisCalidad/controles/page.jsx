"use client";
import {
    CirclePlus,
    LoaderCircle,
    Pencil,
    Power,
    RotateCcw,
    Save,
    Search,
    SlidersHorizontal,
    Tags,
} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "@clerk/nextjs";
import Toaster from "@/components/ui/toast";

const FILTROS_INICIALES = Object.freeze({
    nombre: "",
    lote: "",
    matriz: "",
    categoria: "",
    estado: "",
});

const ETIQUETAS_FILTRO = {
    nombre: "Nombre",
    lote: "Lote",
    matriz: "Matriz",
    categoria: "Categoría",
    estado: "Estado",
};

const OPCIONES_NIVELES = Object.freeze({
    numerica: [
        {valor: 1, etiqueta: "Nivel 1"},
        {valor: 2, etiqueta: "Nivel 2"},
        {valor: 3, etiqueta: "Nivel 3"},
    ],
    clinica: [
        {valor: "bajo", etiqueta: "Bajo"},
        {valor: "normal", etiqueta: "Normal"},
        {valor: "patologico", etiqueta: "Patológico"},
    ],
});

export default function PaginaControles() {
  const [estadoInputsIngreso, setEstadoInputsIngreso] = useState(false);
  const [estadoInputsEdicion, setEstadoInputsEdicion] = useState(false);
  const [estadoInputsTecnicas, setEstadoInputsTecnicas] = useState(false);
  const [controlTecnicas, setControlTecnicas] = useState(null);
  const [analitosTecnicas, setAnalitosTecnicas] = useState([]);
  const [tecnicasPorControl, setTecnicasPorControl] = useState({});
  const [indiceListaAbiertaTecnicas, setIndiceListaAbiertaTecnicas] = useState(null);
    const toasterRef = useRef(null);
    const API = process.env.NEXT_PUBLIC_API_URL;
    const {getToken,userId} = useAuth();
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);
    const [filtroCargando, setFiltroCargando] = useState(false);
    const solicitudControlesRef = useRef(0);
    const temporizadorFiltroRef = useRef(null);

  // ------------------------- Estilos premium (internos) -------------------------
  const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";
  const TONO_ESTADO = {
      "Activo" : "font-semibold text-emerald-700",
      "Inactivo" : "font-semibold text-red-600",
  };
  const CLASE_BTN_ACCION = `inline-flex h-9 w-full items-center gap-2 rounded-lg border border-line-strong bg-white px-3 text-[13px] font-medium text-ink-muted shadow-[0_1px_2px_rgb(15_23_42_/_0.06)] transition-[background-color,border-color,color,box-shadow] duration-200 ${EASE_PREMIUM} hover:border-ink-faint hover:bg-[#f8f9fb] hover:shadow-[0_4px_12px_rgb(15_23_42_/_0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`;
  const CLASE_CONTROL = `h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(15_23_42_/_0.04)] outline-none transition-[background-color,border-color,box-shadow] duration-200 ${EASE_PREMIUM} placeholder:font-normal placeholder:text-ink-faint hover:border-line-strong focus-visible:border-status-info focus-visible:ring-4 focus-visible:ring-status-info/10`;
  const CLASE_ETIQUETA = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-muted";
  const CLASE_BTN_MODAL_SECUNDARIO = `inline-flex h-11 items-center justify-center rounded-lg border border-line-strong bg-white px-5 text-sm font-semibold text-ink shadow-[0_1px_2px_rgb(15_23_42_/_0.05)] transition-[background-color,border-color,color,box-shadow] duration-200 ${EASE_PREMIUM} hover:border-ink-faint hover:bg-[#f8f9fb] hover:shadow-[0_4px_12px_rgb(15_23_42_/_0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`;
  const CLASE_BTN_MODAL_PRINCIPAL = `inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white shadow-[0_2px_8px_rgb(15_23_42_/_0.16)] transition-[background-color,box-shadow] duration-200 ${EASE_PREMIUM} hover:bg-[#24262b] hover:shadow-[0_6px_16px_rgb(15_23_42_/_0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`;

  // ------------------- Acciones internas del popup (gráficas) -------------------
  const abrirIngreso = () => setEstadoInputsIngreso(true);
  const cerrarIngreso = () => setEstadoInputsIngreso(false);


  // ---------------- Acciones internas del popup de edición (gráficas) ----------------

  // "dd/mm/aaaa" -> "aaaa-mm-dd" para los inputs date del popup de edición.
  const aIso = (fecha) => {
    const [dia, mes, anio] = fecha.split("/");
    return `${anio}-${mes}-${dia}`;
  };

  // ------------- Acciones internas del popup de técnicas (gráficas) -------------
  const abrirTecnicas = (control) => {
    const analitosGuardados = tecnicasPorControl[control.id] ?? control.analitos;

    setControlTecnicas({ ...control });
    setAnalitosTecnicas(
      analitosGuardados.map((analito) => {
        const niveles = Array.isArray(analito.niveles) ? [...analito.niveles] : [];
        const nomenclatura = analito.nomenclatura
          ?? (niveles.some((nivel) => typeof nivel === "string") ? "clinica" : "numerica");

        return { ...analito, nomenclatura, niveles };
      })
    );
    setEstadoInputsTecnicas(true);
  };
  const cerrarTecnicas = () => setEstadoInputsTecnicas(false);

  const anadirAnalitoTecnicas = () =>
    setAnalitosTecnicas((filas) => [
      ...filas,
      { nombre: "", nomenclatura: "", niveles: [] },
    ]);

  const quitarAnalitoTecnicas = (indice) => {
    setIndiceListaAbiertaTecnicas(null);
    setAnalitosTecnicas((filas) => filas.filter((_, i) => i !== indice));
  };

  const renombrarAnalitoTecnicas = (indice, nombre) =>
    setAnalitosTecnicas((filas) => filas.map((fila, i) => (i === indice ? { ...fila, nombre } : fila)));

  const cambiarNomenclaturaTecnicas = (indice, nomenclatura) =>
    setAnalitosTecnicas((filas) =>
      filas.map((fila, i) =>
        i === indice
          ? { ...fila, nomenclatura, niveles: [] }
          : fila
      )
    );

  const alternarNivelTecnicas = (indice, nivel) =>
    setAnalitosTecnicas((filas) =>
      filas.map((fila, i) => {
        if (i !== indice) return fila;

        const seleccionados = fila.niveles.includes(nivel)
          ? fila.niveles.filter((seleccionado) => seleccionado !== nivel)
          : [...fila.niveles, nivel];
        const ordenPermitido = (OPCIONES_NIVELES[fila.nomenclatura] ?? [])
          .map((opcion) => opcion.valor);

        return {
          ...fila,
          niveles: ordenPermitido.filter((valor) => seleccionados.includes(valor)),
        };
      })
    );

  const guardarTecnicas = () => {
    const configuracionIncompleta = analitosTecnicas.length === 0 || analitosTecnicas.some(
      (analito) =>
        analito.nombre.trim() === ""
        || !analito.nomenclatura
        || analito.niveles.length === 0
    );

    if (configuracionIncompleta) {
      return toasterRef.current?.show({
        title: "Cada analito debe tener nombre, nomenclatura y al menos un nivel.",
        variant: "error",
        duration: 2200,
      });
    }

    setTecnicasPorControl((controles) => ({
      ...controles,
      [controlTecnicas.id]: analitosTecnicas.map((analito) => ({
        ...analito,
        niveles: [...analito.niveles],
      })),
    }));
    setEstadoInputsTecnicas(false);

    return toasterRef.current?.show({
      title: "Configuración de analitos guardada en esta sesión.",
      variant: "success",
      duration: 1800,
    });
  };

  // Similitud de nombre para el buscador de analitos (sin mayúsculas ni tildes).
  const normalizar = (texto) => texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Catálogo mock de analitos para el selector con buscador (nombre + abreviatura).
  const ANALITOS_CATALOGO = [
    { nombre: "Glucosa", abrev: "GLU" },
    { nombre: "Colesterol", abrev: "COL" },
    { nombre: "HDL", abrev: "HDL" },
    { nombre: "LDL", abrev: "LDL" },
    { nombre: "Bilirrubina total", abrev: "BT" },
    { nombre: "Hemoglobina", abrev: "HGB" },
    { nombre: "Urea", abrev: "URE" },
    { nombre: "Creatinina", abrev: "CRE" },
    { nombre: "Ácido úrico", abrev: "AU" },
    { nombre: "Triglicéridos", abrev: "TRI" },
    { nombre: "GOT", abrev: "GOT" },
    { nombre: "GPT", abrev: "GPT" },
    { nombre: "Proteínas totales", abrev: "PT" },
    { nombre: "Albúmina", abrev: "ALB" },
  ];

  // Opciones del selector de analito de una fila: filtra por similitud (nombre
  // o abreviatura) y excluye los ya asignados en otras filas.
  const opcionesAnalitoTecnicas = (indice) => {
    const termino = normalizar((analitosTecnicas[indice]?.nombre ?? "").trim());
    const usados = analitosTecnicas
      .filter((_, i) => i !== indice)
      .map((fila) => normalizar(fila.nombre.trim()))
      .filter(Boolean);
    return ANALITOS_CATALOGO.filter((opcion) => {
      const nombre = normalizar(opcion.nombre);
      const abrev = normalizar(opcion.abrev);
      return !usados.includes(nombre) && (!termino || nombre.includes(termino) || abrev.includes(termino));
    });
  };


    const [data, setData] = useState([])

    async function consultarControles(ruta, {mostrarCarga = false} = {}) {
        const solicitudId = ++solicitudControlesRef.current;

        if (mostrarCarga) {
            setFiltroCargando(true);
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API}${ruta}`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (solicitudId !== solicitudControlesRef.current) {
                return;
            }

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible cargar los controles. Contacte a soporte.",
                    variant: "error",
                    duration: 1800,
                });
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.success) {
                setData(respuestaBackend.data);
                return;
            }

            return toasterRef.current?.show({
                title: `${respuestaBackend.message}`,
                variant: "error",
                duration: 1500,
            });
        } catch (e) {
            if (solicitudId !== solicitudControlesRef.current) {
                return;
            }

            return toasterRef.current?.show({
                title: `${e.message}`,
                variant: "error",
                duration: 1000,
            });
        } finally {
            if (solicitudId === solicitudControlesRef.current) {
                setFiltroCargando(false);
            }
        }
    }

    async function cargarDatos(opciones) {
        return consultarControles("/controles", opciones);
    }

    useEffect(() => {
        cargarDatos();

        return () => {
            if (temporizadorFiltroRef.current) {
                clearTimeout(temporizadorFiltroRef.current);
            }
        };
    }, []);




















    const[nombreControl, setNombreControl] = useState("");
    const[numeroLote,setNumeroLote] = useState("");
    const[idProveedor,setIdProveedor] = useState("");
    const[idMatriz,setIdMatriz] = useState("");
    const[categoriaId,setCategoriaId] = useState("");
    const[fechaCaducidad,setFechaCaducidad] = useState("");
    const[unidadesStock,setUnidadesStock] = useState("");
    const[usuarioCreacion,setUsuarioCreacion] = useState("");

    async function insertar(
        nombreControl,
        numeroLote,
        idProveedor,
        idMatriz,
        categoriaId,
        fechaCaducidad,
        unidadesStock,
    ) {
        if (nombreControl.trim() === "") {
            return toasterRef.current?.show({
                title: "Ingresa un texto valido",
                variant: "error",
                duration: 1500,
            });
        }

        if (numeroLote.trim() === "") {
            return toasterRef.current?.show({
                title: "Ingresa un numero de lote",
                variant: "error",
                duration: 1500,
            });
        }

        if (!idProveedor) {
            return toasterRef.current?.show({
                title: "Ingresa un proveedor valido",
                variant: "error",
                duration: 1500,
            });
        }

        if (!idMatriz) {
            return toasterRef.current?.show({
                title: "Ingresa una matriz valida",
                variant: "error",
                duration: 1500,
            });
        }


        if (!fechaCaducidad) {
            return toasterRef.current?.show({
                title: "Ingresa una fecha de caducidad valida",
                variant: "error",
                duration: 1500,
            });
        }


        if (!categoriaId) {
            return toasterRef.current?.show({
                title: "Ingresa una categoria valida",
                variant: "error",
                duration: 1500,
            });
        }



        if (!Number.isFinite(Number(unidadesStock)) || Number(unidadesStock) <= 0) {
            return toasterRef.current?.show({
                title: "Ingresa una cantidad de unidades valida",
                variant: "error",
                duration: 1500,
            });
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API}/controles`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombreControl : nombreControl,
                    numeroLote : numeroLote,
                    idProveedor : idProveedor,
                    idMatriz : idMatriz,
                    categoriaId : categoriaId,
                    fechaCaducidad : fechaCaducidad,
                    activo: 1,
                    unidadesStock: unidadesStock,
                    usuarioCreacion: userId
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
                    setNombreControl("");
                    setNumeroLote("");
                    setIdProveedor("");
                    setIdMatriz("");
                    setCategoriaId("");
                    setFechaCaducidad("");
                    setUnidadesStock("");
                    setEstadoInputsIngreso(false);
                    await limpiarFiltros();
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

    // ------------------------------ Datos de ejemplo ------------------------------

    function estadoString(estadoInteger){
        switch (Number(estadoInteger)) {
            case 0:
                return "Inactivo";
            case 1:
                return "Activo";
            default:
                return "Desconocido";
        }
    }

    function obtenerFecha(fechaHora) {
        if (!fechaHora) {
            return "Sin fecha";
        }

        return String(fechaHora).split("T")[0];
    }

    const CONTROLES = data.map((e)=>{
      return {
          id: e[0],
          nombre: e[1],
          proveedor: e[4],
          lote: e[2],
          creacion: obtenerFecha(e[12]),
          matriz: e[6],
          categoria: e[8],
          stock: e[10],
          ultimaModificacion: e[14],
          caducidad: obtenerFecha(e[9]),
          estado: estadoString(e[11]),
          estadoActividad: Number(e[11]) === 1,
          analitos: tecnicasPorControl[e[0]] ?? [
              { nombre: "Glucosa", nomenclatura: "numerica", niveles: [1, 2, 3] },
          ]
      }
  })





    const [dataProvedores, setDataProvedores] = useState([])
    async function cargarProvedores() {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/proveedores`, {
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
                    setDataProvedores(respuestaBackend.data);
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
        cargarProvedores();
    }, []);






    const [dataMatriz, setDataMatriz] = useState([])
    async function cargarMatrices() {
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
        cargarMatrices();
    }, []);









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

    useEffect(() => {
        cargarDatosCategorias();
    }, []);






    const[nombreControlEdit, setNombreControlEdit] = useState("");
    const[numeroLoteEdit,setNumeroLoteEdit] = useState("");
    const[idProveedorEdit,setIdProveedorEdit] = useState("");
    const[idMatrizEdit,setIdMatrizEdit] = useState("");
    const[categoriaIdEdit,setCategoriaIdEdit] = useState("");
    const[fechaCaducidadEdit,setFechaCaducidadEdit] = useState("");
    const[unidadesStockEdit,setUnidadesStockEdit] = useState("");
    const[idControlEdit, setIdControlEdit] = useState(null);
    async function seleccionar(idControl) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/controles/buscarEspecifico/${idControl}`, {
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
                    setNombreControlEdit(respuestaBackend.data.nombreControl);
                    setNumeroLoteEdit(respuestaBackend.data.numeroLote);
                    setIdProveedorEdit(respuestaBackend.data.idProveedor);
                    setIdMatrizEdit(respuestaBackend.data.idMatriz);
                    setCategoriaIdEdit(respuestaBackend.data.categoriaId);
                    setFechaCaducidadEdit(String(respuestaBackend.data.fechaCaducidad ?? "").split("T")[0]);
                    setUnidadesStockEdit(Number(respuestaBackend.data.unidadesStock));
                    setIdControlEdit(respuestaBackend.data.idControl);
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
    async function actualizar(
      nombreControlEdit,
      numeroLoteEdit,
      idProveedorEdit,
      idMatrizEdit,
      categoriaIdEdit,
      fechaCaducidadEdit,
      unidadesStockEdit,
      idControlEdit
    ) {
        if (nombreControlEdit.trim() === "") {
            return toasterRef.current?.show({
                title: "Ingresa un Nombre valido para el control",
                variant: "error",
                duration: 1500,
            });
        }

        if (numeroLoteEdit.trim() === "") {
            return toasterRef.current?.show({
                title: "Ingresa un numero de lote",
                variant: "error",
                duration: 1500,
            });
        }

        if (!idProveedorEdit) {
            return toasterRef.current?.show({
                title: "Ingresa un proveedor valido",
                variant: "error",
                duration: 1500,
            });
        }

        if (!idMatrizEdit) {
            return toasterRef.current?.show({
                title: "Ingresa una matriz valida",
                variant: "error",
                duration: 1500,
            });
        }


        if (!fechaCaducidadEdit) {
            return toasterRef.current?.show({
                title: "Ingresa una fecha de caducidad valida",
                variant: "error",
                duration: 1500,
            });
        }


        if (!categoriaIdEdit) {
            return toasterRef.current?.show({
                title: "Ingresa una categoria valida",
                variant: "error",
                duration: 1500,
            });
        }



        if (!Number.isFinite(Number(unidadesStockEdit)) || Number(unidadesStockEdit) <= 0) {
            return toasterRef.current?.show({
                title: "Ingresa una cantidad de unidades valida",
                variant: "error",
                duration: 1500,
            });
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API}/controles/actualizar`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idControl : idControlEdit,
                    nombreControl : nombreControlEdit,
                    numeroLote : numeroLoteEdit,
                    idProveedor : idProveedorEdit,
                    idMatriz : idMatrizEdit,
                    categoriaId : categoriaIdEdit,
                    fechaCaducidad : fechaCaducidadEdit,
                    activo: 1,
                    unidadesStock: unidadesStockEdit,
                    usuarioModificacion: userId
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
                    setNombreControlEdit("");
                    setNumeroLoteEdit("");
                    setIdProveedorEdit("");
                    setIdMatrizEdit("");
                    setCategoriaIdEdit("");
                    setFechaCaducidadEdit("");
                    setUnidadesStockEdit("");
                    setEstadoInputsEdicion(false);
                    await limpiarFiltros();

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








    async function desactivar(idControl) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/controles/desactivar/${idControl}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible desactivar el control. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    await limpiarFiltros();
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



    async function activar(idControl) {
        try {
            const token = await getToken();
            const res = await fetch(`${API}/controles/activar/${idControl}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                return toasterRef.current?.show({
                    title: "No fue posible activar el control. Consulte a soporte.",
                    variant: "error",
                    duration: 2000,
                });

            } else {

                const respuestaBackend = await res.json();

                if (respuestaBackend.success) {
                    await limpiarFiltros();
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

    function obtenerRutaFiltro(tipo, valor) {
        const valorSeguro = encodeURIComponent(valor);

        switch (tipo) {
            case "nombre":
                return `/controles/buscarPorNombreControl/${valorSeguro}`;
            case "lote":
                return `/controles/SeleccionarPorSimilitudNumeroLote/${valorSeguro}`;
            case "matriz":
                return `/controles/buscarPorMatrizId/${valorSeguro}`;
            case "categoria":
                return `/controles/seleccionarPorCategoria/${valorSeguro}`;
            case "estado":
                return valor === "activo" ? "/controles/activos" : "/controles/inactivos";
            default:
                return "/controles";
        }
    }

    async function ejecutarFiltro(tipo, valor) {
        const ruta = obtenerRutaFiltro(tipo, valor);
        await consultarControles(ruta, {mostrarCarga: true});
    }

    function cambiarFiltro(tipo, valor) {
        const valorRecibido = String(valor ?? "");
        const esTexto = tipo === "nombre" || tipo === "lote";
        const valorConsulta = esTexto ? valorRecibido.trim() : valorRecibido;
        const valorEstado = esTexto && valorConsulta === "" ? "" : valorRecibido;

        if (temporizadorFiltroRef.current) {
            clearTimeout(temporizadorFiltroRef.current);
        }

        solicitudControlesRef.current += 1;

        setFiltros({
            ...FILTROS_INICIALES,
            [tipo]: valorEstado,
        });

        if (valorConsulta === "") {
            cargarDatos({mostrarCarga: true});
            return;
        }

        if (esTexto) {
            setFiltroCargando(true);
            temporizadorFiltroRef.current = setTimeout(() => {
                ejecutarFiltro(tipo, valorConsulta);
            }, 320);
            return;
        }

        ejecutarFiltro(tipo, valorConsulta);
    }

    async function limpiarFiltros() {
        if (temporizadorFiltroRef.current) {
            clearTimeout(temporizadorFiltroRef.current);
        }

        setFiltros(FILTROS_INICIALES);
        await cargarDatos({mostrarCarga: true});
    }

    const filtroActivo = Object.entries(filtros).find(([, valor]) => valor !== "");

    return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
        <Toaster ref={toasterRef} />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
            ANÁLISIS QC / CONTROLES
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
            Controles
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Catálogo de controles con su lote, caducidad, analitos asociados y niveles disponibles.
          </p>
        </header>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          {/* BOTÓN QUE ABRE EL POPUP DE INGRESO (ver bloque POPUP al final del archivo) */}
          <button
            type="button"
            onClick={abrirIngreso}
            className={`group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white shadow-[0_2px_8px_rgb(15_23_42_/_0.16)] transition-[background-color,box-shadow] duration-200 ${EASE_PREMIUM} hover:bg-[#24262b] hover:shadow-[0_6px_16px_rgb(15_23_42_/_0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
          >
            {/* Mismo trazo que el icono "controlesQc" del sidebar: anillo bencenico de Kekule */}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3.5l6.9 4v8l-6.9 4-6.9-4v-8z" />
              <path d="M12.5 5.9l4.1 2.4M16.6 14.7l-4.1 2.4M6.9 9.1v4.8" />
            </svg>
            Ingresar Control
          </button>
        </div>
      </div>

      <section
        aria-labelledby="titulo-filtros-controles"
        aria-busy={filtroCargando}
        className="mt-8 rounded-lg border border-line bg-white p-4 shadow-[0_8px_24px_rgb(15_23_42_/_0.05)] sm:p-5"
      >
        <div className="mb-5 flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-[#f8f9fb] text-ink-muted">
              <SlidersHorizontal aria-hidden="true" className="size-4" />
            </span>
            <div>
              <p
                id="titulo-filtros-controles"
                className="text-sm font-semibold text-ink"
              >
                Filtros
              </p>
              <p className="mt-0.5 text-xs text-ink-muted" aria-live="polite">
                {filtroActivo
                  ? `Filtro activo: ${ETIQUETAS_FILTRO[filtroActivo[0]]}`
                  : "Vista completa del catálogo"}
              </p>
            </div>
          </div>

          <div className="flex min-h-9 items-center gap-3">
            {filtroCargando ? (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-ink-muted">
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                Actualizando
              </span>
            ) : null}
            <button
              type="button"
              onClick={limpiarFiltros}
              disabled={!filtroActivo || filtroCargando}
              className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line-strong bg-white px-3 text-xs font-semibold text-ink-muted shadow-[0_1px_2px_rgb(15_23_42_/_0.05)] transition-[background-color,border-color,color,box-shadow] duration-200 ${EASE_PREMIUM} hover:border-ink-faint hover:bg-[#f8f9fb] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:bg-white disabled:hover:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Limpiar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label htmlFor="filtro-nombre-control" className={CLASE_ETIQUETA}>
              Nombre del control
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
              />
              <input
                value={filtros.nombre}
                onChange={(e) => cambiarFiltro("nombre", e.target.value)}
                id="filtro-nombre-control"
                type="search"
                placeholder="Buscar por nombre"
                className={`${CLASE_CONTROL} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="filtro-lote-control" className={CLASE_ETIQUETA}>
              Número de lote
            </label>
            <div className="relative">
              <Tags
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint"
              />
              <input
                value={filtros.lote}
                onChange={(e) => cambiarFiltro("lote", e.target.value)}
                id="filtro-lote-control"
                type="search"
                placeholder="Buscar por lote"
                className={`${CLASE_CONTROL} pl-10`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="filtro-matriz-control" className={CLASE_ETIQUETA}>
              Matriz
            </label>
            <select
              value={filtros.matriz}
              onChange={(e) => cambiarFiltro("matriz", e.target.value)}
              id="filtro-matriz-control"
              className={CLASE_CONTROL}
            >
              <option value="">Todas las matrices</option>
              {dataMatriz.map((matriz) => (
                <option key={matriz.idMatriz} value={matriz.idMatriz}>
                  {matriz.nombreMatriz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtro-categoria-control" className={CLASE_ETIQUETA}>
              Categoría
            </label>
            <select
              value={filtros.categoria}
              onChange={(e) => cambiarFiltro("categoria", e.target.value)}
              id="filtro-categoria-control"
              className={CLASE_CONTROL}
            >
              <option value="">Todas las categorías</option>
              {dataCategorias.map((categoria) => (
                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                  {categoria.nombreCategoria}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filtro-estado-control" className={CLASE_ETIQUETA}>
              Estado de actividad
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => cambiarFiltro("estado", e.target.value)}
              id="filtro-estado-control"
              className={CLASE_CONTROL}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </section>

      <section
        aria-label="Controles de calidad"
        className="mt-6 overflow-hidden rounded-lg border border-line bg-white shadow-[0_12px_32px_rgb(15_23_42_/_0.06)]"
      >
        <div className="flex min-h-14 items-center justify-between gap-4 border-b border-line px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold text-ink">Listado de controles</h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              {CONTROLES.length} {CONTROLES.length === 1 ? "registro visible" : "registros visibles"}
            </p>
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-faint">
            Control de calidad
          </span>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[29%]" />
            <col className="w-[19%]" />
            <col className="w-[31%]" />
            <col className="w-[21%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-line bg-[#f8f9fb]">
              <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Control</th>
              <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Condición control</th>
              <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Analitos y niveles</th>
              <th scope="col" className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {CONTROLES.map((c) => (
              <tr
                key={c.id}
                className={`border-b border-line transition-colors duration-200 ${EASE_PREMIUM} last:border-b-0 hover:bg-[#f8f9fb]`}
              >
                <td className="px-5 py-4 align-top">
                  <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{c.nombre}</p>
                  <p className="mt-2 whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Proveedor: <span className="font-medium text-ink-muted">{c.proveedor}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Lote: <span className="font-medium tabular-nums text-ink-muted">{c.lote}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Matriz: <span className="font-medium text-ink-muted">{c.matriz}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Categoría: <span className="font-medium text-ink-muted">{c.categoria}</span>
                  </p>

                </td>
                <td className="px-5 py-4 align-top">
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Creación: <span className="tabular-nums">{c.creacion}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Caducidad: <span className="tabular-nums">{c.caducidad}</span>
                  </p>
                  <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                    Estado:{" "}
                    <span className={`inline-flex items-center gap-1.5 ${TONO_ESTADO[c.estado] ?? "font-semibold text-ink-muted"}`}>
                      <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${c.estadoActividad ? "bg-emerald-600" : "bg-red-500"}`}
                      />
                      {c.estado}
                    </span>
                  </p>
                    <p className="whitespace-nowrap text-[11px] leading-4 text-ink-faint">
                        Stock: <span className="font-medium tabular-nums text-ink-muted">{c.stock}</span>
                    </p>

                </td>
                <td className="px-5 py-4 align-top">
                  {/* Cada analito con SUS propios niveles, en línea junto al nombre */}
                  <ul className="flex w-[200px] flex-col gap-1.5">
                    {c.analitos.map((a) => (
                      <li
                        key={a.nombre}
                        className="flex w-full items-center gap-2 rounded-lg border border-line-strong bg-white px-2.5 py-1.5 text-[12px] font-medium text-ink shadow-[0_1px_3px_rgb(15_23_42_/_0.08)]"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-status-info" aria-hidden="true" />
                        <span className="min-w-0 truncate">{a.nombre}</span>
                        <span className="ml-auto shrink-0 text-[10px] font-bold tabular-nums text-status-info">
                          {a.niveles.length} {a.niveles.length === 1 ? "Nivel" : "Niveles"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="flex w-full flex-col items-stretch gap-1.5">
                    {/* BOTÓN QUE ABRE EL POPUP DE EDICIÓN (ver bloque POPUP DE EDICIÓN al final del archivo) */}
                    <button
                      type="button"
                      aria-label={`Editar ${c.nombre}`}
                      onClick={() => {
                          seleccionar(c.id);
                          setEstadoInputsEdicion(true);
                      }}
                      className={`${CLASE_BTN_ACCION} hover:border-status-info hover:text-status-info`}
                    >
                      <Pencil aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.7} />
                      Editar
                    </button>
                    {/* BOTÓN QUE ABRE EL POPUP DE TÉCNICAS (ver bloque POPUP DE TÉCNICAS al final del archivo) */}
                    <button
                      type="button"
                      aria-label={`Añadir técnicas a ${c.nombre}`}
                      onClick={() => abrirTecnicas(c)}
                      className={`${CLASE_BTN_ACCION} hover:border-status-info hover:text-status-info`}
                    >
                      <CirclePlus aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.7} />
                      Añadir Técnicas
                    </button>
                    <button
                        onClick={() => {
                            const estado = c.estadoActividad;
                            estado ? desactivar(c.id) : activar(c.id);
                        }}
                      type="button"
                      aria-label={`${c.estadoActividad ? "Desactivar" : "Activar"} ${c.nombre}`}
                      className={`${CLASE_BTN_ACCION} ${
                        c.estadoActividad
                          ? "text-red-600! hover:text-red-700!"
                          : "text-emerald-700! hover:text-emerald-800!"
                      }`}
                    >
                      <Power aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.7} />
                      {c.estadoActividad ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtroCargando && CONTROLES.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-14 text-center">
                  <p className="text-sm font-semibold text-ink">Sin resultados</p>
                  <p className="mt-1 text-xs text-ink-muted">No hay controles para el filtro seleccionado.</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        </div>
      </section>

      {/* ==================================================================
          INICIO POPUP DE INGRESO DE CONTROL — EXCLUSIVO DE INGRESO
          Componente 100% gráfico: NO está conectado al backend.
          Cuando conectes la lógica:
            - Abrir/cerrar: estado `estadoInputsIngreso` (useState arriba).
            - Datos del control: inputs con id "campo-ingreso-*".
          ================================================================== */}
      {estadoInputsIngreso ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-ingresar-control"
        >
          {/* Fondo clickeable para cerrar */}
          <button
            type="button"
            aria-label="Cerrar popup"
            onClick={cerrarIngreso}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative max-h-[calc(100dvh-4rem)] w-[min(620px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-2xl">
            {/* Encabezado del popup */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  Nuevo registro
                </p>
                <h2 id="titulo-ingresar-control" className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink">
                  Ingresar Control
                </h2>
              </div>
              <button
                type="button"
                onClick={cerrarIngreso}
                aria-label="Cerrar"
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-alert hover:text-status-alert active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Datos del control (los mismos que muestra la tabla) */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="campo-ingreso-nombre" className={CLASE_ETIQUETA}>
                  Nombre del control
                </label>
                <input
                  value={nombreControl}
                  onChange={(e)=>setNombreControl(e.target.value)}
                  id="campo-ingreso-nombre"
                  type="text"
                  placeholder="Ej. BioRad Glucosa"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-ingreso-proveedor" className={CLASE_ETIQUETA}>
                  Proveedor
                </label>
                <select
                    value={idProveedor}
                    onChange={(e)=>setIdProveedor(e.target.value)}
                    id="campo-ingreso-proveedor" className={CLASE_CONTROL}>
                    <option value="" disabled>
                        Selecciona proveedor
                    </option>
                    {dataProvedores.map(p=>{return(
                        <option value={p.idProveedor} key={p.idProveedor}>
                            {p.nombreProveedor}
                        </option>
                    )})}
                </select>
              </div>
              <div>
                <label htmlFor="campo-ingreso-lote" className={CLASE_ETIQUETA}>
                  Lote
                </label>
                <input
                  value={numeroLote}
                  onChange={(e)=>setNumeroLote(e.target.value)}
                  id="campo-ingreso-lote"
                  type="text"
                  placeholder="Ej. GLO090"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-ingreso-matriz" className={CLASE_ETIQUETA}>
                  Matriz
                </label>
                <select
                    value={idMatriz}
                    onChange={(e)=>setIdMatriz(e.target.value)}
                    id="campo-ingreso-matriz" className={CLASE_CONTROL}>
                    <option value="" disabled>
                        Selecciona matriz
                    </option>
                    {dataMatriz.map(m=>{return(
                        <option value={m.idMatriz} key={m.idMatriz}>
                            {m.nombreMatriz}
                        </option>
                    )})}
                </select>
              </div>
              <div>
                <label htmlFor="campo-ingreso-categoria" className={CLASE_ETIQUETA}>
                  Categoría
                </label>
                <select
                    value={categoriaId}
                    onChange={(e)=>setCategoriaId(e.target.value)}
                    id="campo-ingreso-categoria" className={CLASE_CONTROL}>
                  <option value="" disabled>
                    Selecciona categoría
                  </option>
                    {dataCategorias.map(c=>{return(
                        <option value={c.idCategoria} key={c.idCategoria}>
                            {c.nombreCategoria}
                        </option>
                    )})}
                </select>
              </div>
              <div>
                <label htmlFor="campo-ingreso-stock" className={CLASE_ETIQUETA}>
                  Stock
                </label>
                <input
                    value={unidadesStock}
                    onChange={(e)=>setUnidadesStock(e.target.value)}
                  id="campo-ingreso-stock"
                  type="number"
                  placeholder="Ej. 10"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-ingreso-caducidad" className={CLASE_ETIQUETA}>
                  Caducidad
                </label>
                <input
                  value={fechaCaducidad}
                  onChange={(e)=>setFechaCaducidad(e.target.value)}
                  id="campo-ingreso-caducidad"
                  type="date"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>

              </div>
            </div>


            {/* Pie del popup */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarIngreso}
                className={CLASE_BTN_MODAL_SECUNDARIO}
              >
                Cancelar
              </button>
              {/* Gráfico solamente: aquí conectarás el guardado */}
              <button
                type="button"
                onClick={()=> insertar(
                    nombreControl,
                    numeroLote,
                    idProveedor,
                    idMatriz,
                    categoriaId,
                    fechaCaducidad,
                    unidadesStock,
                )}
                className={CLASE_BTN_MODAL_PRINCIPAL}
              >
                <Save aria-hidden="true" className="size-4" strokeWidth={1.8} />
                Guardar Control
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* ================== FIN POPUP DE INGRESO DE CONTROL ================== */}

      {/* ==================================================================
          INICIO POPUP DE EDICIÓN DE CONTROL — EXCLUSIVO DE EDICIÓN
          Componente 100% gráfico: NO está conectado al backend.
          Se abre desde el botón "Editar" de una fila, precargado con
          los datos de ese control. Cuando conectes la lógica:
            - Abrir/cerrar: estado `estadoInputsEdicion` (useState arriba).
            - Datos del control: inputs con id "campo-edicion-*".
          ================================================================== */}
      {estadoInputsEdicion ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-editar-control"
        >
          {/* Fondo clickeable para cerrar */}
          <button
            type="button"
            aria-label="Cerrar popup"
            onClick={() => setEstadoInputsEdicion(false)}            className="absolute inset-0 cursor-default"
          />

          <div className="relative max-h-[calc(100dvh-4rem)] w-[min(620px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-2xl">
            {/* Encabezado del popup de edición */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  Editando: {nombreControlEdit}
                </p>
                <h2 id="titulo-editar-control" className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink">
                  Editar Control
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEstadoInputsEdicion(false)}
                aria-label="Cerrar"
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-alert hover:text-status-alert active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Datos del control en edición (inputs propios del popup) */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="campo-edicion-nombre" className={CLASE_ETIQUETA}>
                  Nombre del control
                </label>
                <input
                  id="campo-edicion-nombre"
                  type="text"
                  value={nombreControlEdit}
                  onChange={(e) => setNombreControlEdit(e.target.value)}
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-edicion-proveedor" className={CLASE_ETIQUETA}>
                  Proveedor
                </label>
                <select
                    value={idProveedorEdit}
                    onChange={(e)=>setIdProveedorEdit(e.target.value)}
                  id="campo-edicion-proveedor"
                  className={CLASE_CONTROL}
                >
                    <option value="" disabled>Selecciona proveedor</option>
                    {dataProvedores.map(p=>{return(
                        <option value={p.idProveedor} key={p.idProveedor}>
                            {p.nombreProveedor}
                        </option>
                    )})}
                </select>
              </div>
              <div>
                <label htmlFor="campo-edicion-lote" className={CLASE_ETIQUETA}>
                  Lote
                </label>
                <input
                    value={numeroLoteEdit}
                    onChange={(e)=>setNumeroLoteEdit(e.target.value)}
                  id="campo-edicion-lote"
                  type="text"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>
                <label htmlFor="campo-edicion-matriz" className={CLASE_ETIQUETA}>
                  Matriz
                </label>
                <select
                    value={idMatrizEdit}
                    onChange={(e)=>setIdMatrizEdit(e.target.value)}
                  id="campo-edicion-matriz"
                  className={CLASE_CONTROL}
                >
                    <option value="" disabled>Selecciona matriz</option>
                    {dataMatriz.map(c=>{return(
                        <option value={c.idMatriz} key={c.idMatriz}>
                            {c.nombreMatriz}
                        </option>
                    )})}
                </select>
              </div>
              <div>
                <label htmlFor="campo-edicion-categoria" className={CLASE_ETIQUETA}>
                  Categoría
                </label>
                <select
                  id="campo-edicion-categoria"
                  value={categoriaIdEdit}
                  onChange={(e)=>setCategoriaIdEdit(e.target.value)}
                  className={CLASE_CONTROL}>

                    <option value="" disabled>Selecciona categoría</option>
                    {dataCategorias.map(c=>{return(
                        <option value={c.idCategoria} key={c.idCategoria}>
                            {c.nombreCategoria}
                        </option>
                    )})}
                </select>
              </div>
              <div>
                <label htmlFor="campo-edicion-stock" className={CLASE_ETIQUETA}>
                  Stock
                </label>
                <input
                  id="campo-edicion-stock"
                  type="number"
                  min="0"
                  value={unidadesStockEdit}
                  onChange={(e)=>setUnidadesStockEdit(e.target.value)}
                  className={CLASE_CONTROL}
                />
              </div>
              <div>

              </div>
              <div>
                <label htmlFor="campo-edicion-caducidad" className={CLASE_ETIQUETA}>
                  Caducidad
                </label>
                <input
                    value={fechaCaducidadEdit}
                    onChange={(e)=>setFechaCaducidadEdit(e.target.value)}
                  id="campo-edicion-caducidad"
                  type="date"
                  className={CLASE_CONTROL}
                />
              </div>
              <div>

              </div>
            </div>


            {/* Pie del popup de edición */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEstadoInputsEdicion(false)}
                className={CLASE_BTN_MODAL_SECUNDARIO}
              >
                Cancelar
              </button>
              {/* Gráfico solamente: aquí conectarás la actualización */}
              <button
                type="button"
                onClick={() => actualizar(
                    nombreControlEdit,
                    numeroLoteEdit,
                    idProveedorEdit,
                    idMatrizEdit,
                    categoriaIdEdit,
                    fechaCaducidadEdit,
                    unidadesStockEdit,
                    idControlEdit
                )}
                className={CLASE_BTN_MODAL_PRINCIPAL}
              >
                <Save aria-hidden="true" className="size-4" strokeWidth={1.8} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* ================== FIN POPUP DE EDICIÓN DE CONTROL ================== */}

      {/* ==================================================================
          INICIO POPUP DE TÉCNICAS — EXCLUSIVO DE ANALITOS Y NIVELES
          Componente 100% gráfico: NO está conectado al backend.
          Se abre desde el botón "Añadir Técnicas" de una fila y siempre
          indica a qué control se le están añadiendo los analitos.
          Cuando conectes la lógica:
            - Abrir/cerrar: estado `estadoInputsTecnicas` (useState arriba).
            - Control destino: estado `controlTecnicas`.
            - Analitos y niveles por analito: estado `analitosTecnicas`.
          ================================================================== */}
      {estadoInputsTecnicas && controlTecnicas ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-anadir-tecnicas"
        >
          {/* Fondo clickeable para cerrar */}
          <button
            type="button"
            aria-label="Cerrar popup"
            onClick={cerrarTecnicas}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative max-h-[calc(100dvh-4rem)] w-[min(620px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-line bg-white p-6 shadow-2xl">
            {/* Encabezado: indica a qué control se le añaden analitos y niveles */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  Añadiendo analitos y niveles
                </p>
                <h2 id="titulo-anadir-tecnicas" className="mt-1 text-xl font-semibold tracking-[-0.025em] text-ink">
                  Añadir Técnicas
                </h2>
                <p className="mt-2 text-sm text-ink-muted">
                  Control: <span className="font-semibold text-ink">{controlTecnicas.nombre}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={cerrarTecnicas}
                aria-label="Cerrar"
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-alert hover:text-status-alert active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Analitos asociados: cada analito recibe SUS propios niveles (hasta 3) */}
            <div className="mt-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  Analitos asociados
                </p>
                <button
                  type="button"
                  onClick={anadirAnalitoTecnicas}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 text-[12px] font-medium text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-info hover:text-status-info active:scale-[0.97] active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                >
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                  Añadir analito
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-3">
                {analitosTecnicas.map((fila, indice) => (
                  <div key={indice} className="rounded-xl border border-line bg-canvas/60 p-3.5">
                    <div className="flex items-center gap-2">
                      {/* Selector de analito con buscador (combobox gráfico) */}
                      <div
                        className="relative flex-1"
                        onBlur={(evento) => {
                          if (!evento.currentTarget.contains(evento.relatedTarget)) setIndiceListaAbiertaTecnicas(null);
                        }}
                        onKeyDown={(evento) => {
                          if (evento.key === "Escape") setIndiceListaAbiertaTecnicas(null);
                        }}
                      >
                        <input
                          value={fila.nombre}
                          onChange={(evento) => {
                            renombrarAnalitoTecnicas(indice, evento.target.value);
                            setIndiceListaAbiertaTecnicas(indice);
                          }}
                          onFocus={() => setIndiceListaAbiertaTecnicas(indice)}
                          type="text"
                          placeholder="Buscar analito…"
                          aria-label={`Buscar analito ${indice + 1}`}
                          role="combobox"
                          aria-expanded={indiceListaAbiertaTecnicas === indice}
                          aria-controls={`lista-analito-tecnicas-${indice}`}
                          className={`${CLASE_CONTROL} pr-9`}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label="Desplegar opciones"
                          onClick={() => setIndiceListaAbiertaTecnicas(indiceListaAbiertaTecnicas === indice ? null : indice)}
                          className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-ink-faint transition-colors duration-150 hover:text-ink-muted"
                        >
                          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 7.5l5 5 5-5" />
                          </svg>
                        </button>

                        {indiceListaAbiertaTecnicas === indice ? (
                          <ul
                            id={`lista-analito-tecnicas-${indice}`}
                            role="listbox"
                            aria-label={`Opciones de analito ${indice + 1}`}
                            className="absolute inset-x-0 top-[calc(100%+4px)] z-10 max-h-48 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-[0_16px_40px_rgb(15_23_42_/_0.16)]"
                          >
                            {opcionesAnalitoTecnicas(indice).length === 0 ? (
                              <li className="px-3 py-2.5 text-[12px] text-ink-faint">
                                Sin resultados para tu búsqueda
                              </li>
                            ) : (
                              opcionesAnalitoTecnicas(indice).map((opcion) => (
                                <li key={opcion.nombre} role="option" aria-selected={fila.nombre === opcion.nombre}>
                                  <button
                                    type="button"
                                    onMouseDown={(evento) => evento.preventDefault()}
                                    onClick={() => {
                                      renombrarAnalitoTecnicas(indice, opcion.nombre);
                                      setIndiceListaAbiertaTecnicas(null);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] transition-colors duration-150 ${
                                      fila.nombre === opcion.nombre
                                        ? "bg-status-info-soft font-medium text-status-info"
                                        : "text-ink hover:bg-canvas"
                                    }`}
                                  >
                                    <span className="min-w-0 truncate">
                                      {opcion.nombre} <span className="font-bold text-status-info">- {opcion.abrev}</span>
                                    </span>
                                    {fila.nombre === opcion.nombre ? (
                                      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 10.5l4 4 8-9" />
                                      </svg>
                                    ) : null}
                                  </button>
                                </li>
                              ))
                            )}
                          </ul>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => quitarAnalitoTecnicas(indice)}
                        aria-label={`Quitar ${fila.nombre || "analito"}`}
                        title="Quitar analito"
                        className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-white text-ink-muted shadow-sm transition-all duration-300 ${EASE_PREMIUM} hover:border-status-alert hover:text-status-alert active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                      >
                        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                          <path d="M5 5l10 10M15 5L5 15" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-[9rem_1fr] sm:items-end">
                      <div>
                        <label
                          htmlFor={`nomenclatura-analito-${indice}`}
                          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-faint"
                        >
                          Nomenclatura
                        </label>
                        <select
                          id={`nomenclatura-analito-${indice}`}
                          value={fila.nomenclatura}
                          onChange={(evento) => cambiarNomenclaturaTecnicas(indice, evento.target.value)}
                          aria-label={`Nomenclatura del analito ${fila.nombre || indice + 1}`}
                          className={`h-8 w-full rounded-md border border-line bg-white px-2 text-[11px] font-semibold text-ink-muted shadow-[0_1px_2px_rgb(15_23_42_/_0.04)] outline-none transition-[border-color,box-shadow] duration-150 ${EASE_PREMIUM} hover:border-line-strong focus-visible:border-status-info focus-visible:ring-2 focus-visible:ring-status-info/10`}
                        >
                          <option value="" disabled>Seleccionar</option>
                          <option value="numerica">Numérica</option>
                          <option value="clinica">Clínica</option>
                        </select>
                      </div>

                      <fieldset>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <legend className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
                            Niveles
                          </legend>
                          <span className="text-[10px] font-medium text-ink-faint">
                            {fila.niveles.length}/3 seleccionados
                          </span>
                        </div>
                        {fila.nomenclatura ? (
                          <div className="grid grid-cols-3 gap-1.5">
                            {OPCIONES_NIVELES[fila.nomenclatura].map((opcion) => {
                              const activo = fila.niveles.includes(opcion.valor);
                              return (
                                <button
                                  key={opcion.valor}
                                  type="button"
                                  onClick={() => alternarNivelTecnicas(indice, opcion.valor)}
                                  aria-pressed={activo}
                                  className={`h-8 min-w-0 rounded-md border px-2 text-[10px] font-semibold transition-[background-color,border-color,color,box-shadow] duration-150 ${EASE_PREMIUM} ${
                                    activo
                                      ? "border-status-info/40 bg-status-info-soft text-status-info shadow-[0_1px_2px_rgb(91_62_200_/_0.08)]"
                                      : "border-line bg-white text-ink-faint hover:border-line-strong hover:text-ink-muted"
                                  } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink`}
                                >
                                  {opcion.etiqueta}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex h-8 items-center rounded-md border border-dashed border-line px-2.5 text-[10px] font-medium text-ink-faint">
                            Selecciona una nomenclatura
                          </div>
                        )}
                      </fieldset>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie del popup de técnicas */}
            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarTecnicas}
                className={CLASE_BTN_MODAL_SECUNDARIO}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarTecnicas}
                className={CLASE_BTN_MODAL_PRINCIPAL}
              >
                <Save aria-hidden="true" className="size-4" strokeWidth={1.8} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* ================== FIN POPUP DE TÉCNICAS ================== */}
    </div>
  );
}
