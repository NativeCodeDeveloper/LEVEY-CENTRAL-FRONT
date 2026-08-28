"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const iconos = {
  laboratorio: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" />
    </>
  ),
  clientes: (
    <>
      <path d="M3 11l3-9 9 3 3-9-9-3z" />
      <path d="M17 19l-9-3 3-9 9 3z" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  usuarios: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  tipos: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  permisos: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  hamburguesa: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </>
  ),
  cerrar: (
    <>
      <path d="M18 6L6 18M6 6l12 12" />
    </>
  ),
  editar: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </>
  ),
  eliminar: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
  agregar: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  baseDatos: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>
  ),
  buscar: (
    <>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </>
  ),
  servidor: (
    <>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </>
  ),
  calendario: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  filtro: (
    <>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </>
  ),
  conexion: (
    <>
      <polyline points="9 17 9 9 15 9 15 17" />
      <path d="M13 22l8-8-3-3-8 8v3h3z" />
    </>
  ),
};

function Icono({ nombre, className = "h-5 w-5" }) {
  const trazos = iconos[nombre];
  if (!trazos) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {trazos}
    </svg>
  );
}

const laboratoriosOptions = [
  { id: 1, nombre: "Laboratorio Central" },
  { id: 2, nombre: "Hospital Regional Valparaíso" },
  { id: 3, nombre: "Clínica San José" },
];

const motoresBD = ["MySQL", "PostgreSQL", "SQL Server", "Oracle", "MongoDB", "SQLite"];

const estadosConexion = [
  { valor: "CONECTADO", etiqueta: "Conectado", color: "bg-green-100 text-green-700" },
  { valor: "DESCONECTADO", etiqueta: "Desconectado", color: "bg-red-100 text-red-700" },
];

const basesDatosIniciales = [
  {
    idBaseDatosLaboratorio: 1,
    idLaboratorioClinico: 1,
    nombreBaseDatos: "levey_qc_produccion",
    motorBaseDatos: "PostgreSQL",
    hostReferencia: "db.labcentral.cl",
    puertoReferencia: 5432,
    secretoConexionKey: "sk-************",
    estadoConexion: "CONECTADO",
    activo: 1,
    fechaCreacion: "2024-01-15T10:30:00",
    fechaModificacion: "2024-08-19T14:20:00",
    usuarioCreacionId: 1,
    usuarioModificacionId: 2,
  },
  {
    idBaseDatosLaboratorio: 2,
    idLaboratorioClinico: 1,
    nombreBaseDatos: "levey_qc_analytics",
    motorBaseDatos: "MySQL",
    hostReferencia: "analytics.labcentral.cl",
    puertoReferencia: 3306,
    secretoConexionKey: "sk-************",
    estadoConexion: "CONECTADO",
    activo: 1,
    fechaCreacion: "2024-02-20T09:15:00",
    fechaModificacion: "2024-08-18T16:45:00",
    usuarioCreacionId: 1,
    usuarioModificacionId: 1,
  },
  {
    idBaseDatosLaboratorio: 3,
    idLaboratorioClinico: 2,
    nombreBaseDatos: "hospital_regional_db",
    motorBaseDatos: "SQL Server",
    hostReferencia: "sql.hospitalregional.cl",
    puertoReferencia: 1433,
    secretoConexionKey: "sk-************",
    estadoConexion: "DESCONECTADO",
    activo: 1,
    fechaCreacion: "2024-03-10T11:00:00",
    fechaModificacion: "2024-08-17T10:30:00",
    usuarioCreacionId: 2,
    usuarioModificacionId: 3,
  },
  {
    idBaseDatosLaboratorio: 4,
    idLaboratorioClinico: 3,
    nombreBaseDatos: "clinica_sanjose_main",
    motorBaseDatos: "Oracle",
    hostReferencia: "oracle.csanjose.cl",
    puertoReferencia: 1521,
    secretoConexionKey: "sk-************",
    estadoConexion: "DESCONECTADO",
    activo: 0,
    fechaCreacion: "2024-04-05T14:20:00",
    fechaModificacion: "2024-08-15T09:00:00",
    usuarioCreacionId: 2,
    usuarioModificacionId: 2,
  },
];

const formatFecha = (fechaString) => {
  if (!fechaString) return "N/A";
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatFechaHora = (fechaString) => {
  if (!fechaString) return "N/A";
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getEstadoInfo = (estado) => {
  return estadosConexion.find((e) => e.valor === estado) || estadosConexion[1];
};

export default function BaseDatosClientesPage() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [basesDatos, setBasesDatos] = useState(basesDatosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroLaboratorio, setFiltroLaboratorio] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [bdEditando, setBdEditando] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);

  const [formData, setFormData] = useState({
    idLaboratorioClinico: "",
    nombreBaseDatos: "",
    motorBaseDatos: "",
    hostReferencia: "",
    puertoReferencia: 5432,
    secretoConexionKey: "",
    estadoConexion: "DESCONECTADO",
    activo: 1,
  });
  const [credenciales, setCredenciales] = useState({ usuario: "", contrasena: "" });
  const [errorCredenciales, setErrorCredenciales] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const basesDatosFiltradas = basesDatos.filter((bd) => {
    const cumpleBusqueda =
      bd.nombreBaseDatos.toLowerCase().includes(busqueda.toLowerCase()) ||
      bd.hostReferencia.toLowerCase().includes(busqueda.toLowerCase()) ||
      bd.motorBaseDatos.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleEstado = filtroEstado ? bd.estadoConexion === filtroEstado : true;
    const cumpleLaboratorio = filtroLaboratorio
      ? bd.idLaboratorioClinico === parseInt(filtroLaboratorio)
      : true;
    return cumpleBusqueda && cumpleEstado && cumpleLaboratorio;
  });

  const abrirModalCrear = () => {
    setModoEdicion(false);
    setFormData({
      idLaboratorioClinico: "",
      nombreBaseDatos: "",
      motorBaseDatos: "",
      hostReferencia: "",
      puertoReferencia: 5432,
      secretoConexionKey: "",
      estadoConexion: "DESCONECTADO",
      activo: 1,
    });
    setCredenciales({ usuario: "", contrasena: "" });
    setErrorCredenciales("");
    setModalAbierto(true);
  };

  const abrirModalEditar = (bd) => {
    setModoEdicion(true);
    setBdEditando(bd);
    setFormData({
      idLaboratorioClinico: bd.idLaboratorioClinico,
      nombreBaseDatos: bd.nombreBaseDatos,
      motorBaseDatos: bd.motorBaseDatos,
      hostReferencia: bd.hostReferencia,
      puertoReferencia: bd.puertoReferencia,
      secretoConexionKey: bd.secretoConexionKey,
      estadoConexion: bd.estadoConexion,
      activo: bd.activo,
    });
    setCredenciales({ usuario: "", contrasena: "" });
    setErrorCredenciales("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setBdEditando(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const toggleActivo = () => {
    setFormData((prev) => ({ ...prev, activo: prev.activo === 1 ? 0 : 1 }));
  };

  const handleCredencialChange = (e) => {
    const { name, value } = e.target;
    setCredenciales((prev) => ({ ...prev, [name]: value }));
    if (errorCredenciales) setErrorCredenciales("");
  };

  const guardarBaseDatos = () => {
    if (!credenciales.usuario.trim() || !credenciales.contrasena) {
      setErrorCredenciales("Debe ingresar su usuario y contraseña para confirmar la operación.");
      return;
    }
    const ahora = new Date().toISOString();
    if (modoEdicion && bdEditando) {
      setBasesDatos((prev) =>
        prev.map((bd) =>
          bd.idBaseDatosLaboratorio === bdEditando.idBaseDatosLaboratorio
            ? {
                ...bd,
                ...formData,
                fechaModificacion: ahora,
                usuarioModificacionId: user?.id || 0,
              }
            : bd
        )
      );
    } else {
      const nuevoId = Math.max(...basesDatos.map((b) => b.idBaseDatosLaboratorio), 0) + 1;
      setBasesDatos((prev) => [
        {
          ...formData,
          idBaseDatosLaboratorio: nuevoId,
          fechaCreacion: ahora,
          fechaModificacion: ahora,
          usuarioCreacionId: user?.id || 0,
          usuarioModificacionId: user?.id || 0,
        },
        ...prev,
      ]);
    }
    cerrarModal();
  };

  const eliminarBaseDatos = () => {
    if (confirmarEliminar) {
      setBasesDatos((prev) =>
        prev.filter((bd) => bd.idBaseDatosLaboratorio !== confirmarEliminar.idBaseDatosLaboratorio)
      );
      setConfirmarEliminar(null);
    }
  };

  const alternarConexion = (id) => {
    setBasesDatos((prev) =>
      prev.map((bd) =>
        bd.idBaseDatosLaboratorio === id
          ? {
              ...bd,
              estadoConexion: bd.estadoConexion === "CONECTADO" ? "DESCONECTADO" : "CONECTADO",
              fechaModificacion: new Date().toISOString(),
            }
          : bd
      )
    );
  };

  const alternarActivo = (id) => {
    setBasesDatos((prev) =>
      prev.map((bd) =>
        bd.idBaseDatosLaboratorio === id
          ? { ...bd, activo: bd.activo === 1 ? 0 : 1, fechaModificacion: new Date().toISOString() }
          : bd
      )
    );
  };

  const getNombreLaboratorio = (id) => {
    const lab = laboratoriosOptions.find((l) => l.id === id);
    return lab?.nombre || "N/A";
  };

  const esFormularioValido =
    formData.idLaboratorioClinico !== "" &&
    formData.nombreBaseDatos.trim() !== "" &&
    formData.motorBaseDatos !== "" &&
    formData.hostReferencia.trim() !== "" &&
    formData.puertoReferencia > 0 &&
    credenciales.usuario.trim() !== "" &&
    credenciales.contrasena !== "";

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Barra superior slim */}
      <nav className="!hidden">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logopequeñolevey.png"
              alt="LeveyQC"
              width={512}
              height={512}
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-semibold tracking-tight text-gray-900">LeveyQC</span>
          </Link>

          {user && (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-gray-700 sm:block">
                {user.firstName || user.username || "Usuario"}
              </span>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-9 lg:px-10">
        {/* Encabezado */}
        <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <nav className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">
              <Link href="/" className="transition hover:text-ink-muted">Inicio</Link>
              <span>/</span>
              <span className="text-ink-muted">Bases de datos</span>
            </nav>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-[34px]">
              Bases de Datos de Laboratorios
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Gestiona las conexiones a bases de datos de los laboratorios clientes
            </p>
          </div>
          <button
            type="button"
            onClick={abrirModalCrear}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-strong focus:outline-none focus:ring-2 focus:ring-line-strong focus:ring-offset-2"
          >
            <Icono nombre="agregar" className="h-4 w-4" />
            Nueva Base de Datos
          </button>
        </div>

        {/* Filtros y Buscador */}
        <div className="mb-6 rounded-xl border border-line bg-surface p-3 shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <Icono nombre="buscar" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, host o motor..."
                className="w-full rounded-lg border border-line bg-canvas py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink-faint transition focus:border-line-strong focus:outline-none"
              />
            </div>
            <div className="relative">
              <Icono nombre="filtro" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={filtroLaboratorio}
                onChange={(e) => setFiltroLaboratorio(e.target.value)}
                className="w-full appearance-none rounded-lg border border-line bg-canvas py-2.5 pl-9 pr-8 text-sm text-ink transition focus:border-line-strong focus:outline-none"
              >
                <option value="">Todos los laboratorios</option>
                {laboratoriosOptions.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <Icono nombre="reloj" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full appearance-none rounded-lg border border-line bg-canvas py-2.5 pl-9 pr-8 text-sm text-ink transition focus:border-line-strong focus:outline-none"
              >
                <option value="">Todos los estados</option>
                {estadosConexion.map((estado) => (
                  <option key={estado.valor} value={estado.valor}>
                    {estado.etiqueta}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Bases de Datos */}
        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0_/_0.02)]">
          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
            <div><p className="text-base font-semibold tracking-[-0.02em] text-ink">Conexiones registradas</p><p className="mt-1 text-xs text-ink-muted">Infraestructura de datos asociada a los laboratorios clínicos</p></div>
            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-ink-muted">{basesDatosFiltradas.length} visibles</span>
          </div>
          <div className="overflow-x-auto">
          <table className="min-w-[1050px] w-full">
            <thead className="border-b border-line bg-surface-muted/70">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <div className="flex items-center gap-1">
                    <Icono nombre="baseDatos" className="h-3.5 w-3.5" />
                    Base de Datos
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Laboratorio
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Motor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <div className="flex items-center gap-1">
                    <Icono nombre="servidor" className="h-3.5 w-3.5" />
                    Host : Puerto
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Activo
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {basesDatosFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-16 text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100">
                      <Icono nombre="baseDatos" className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No se encontraron bases de datos</p>
                    <p className="mt-1 text-sm text-gray-500">Ajusta los filtros o crea una nueva base de datos</p>
                  </td>
                </tr>
              ) : (
                basesDatosFiltradas.map((bd) => {
                  const estadoInfo = getEstadoInfo(bd.estadoConexion);
                  return (
                    <tr key={bd.idBaseDatosLaboratorio} className="transition-colors hover:bg-surface-muted/50">
                      <td className="px-5 py-4 text-sm text-ink-muted">{bd.idBaseDatosLaboratorio}</td>
                      <td className="px-4 py-4">
                        <span className="font-semibold tracking-[-0.01em] text-ink">{bd.nombreBaseDatos}</span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-ink-muted">
                        {getNombreLaboratorio(bd.idLaboratorioClinico)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-md border border-line bg-surface-muted px-2 py-1 text-xs font-semibold text-ink-muted">
                          {bd.motorBaseDatos}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[13px] font-medium text-ink">{bd.hostReferencia}</span>
                          <span className="font-mono text-xs text-ink-faint">:{bd.puertoReferencia}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoInfo.color}`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {estadoInfo.etiqueta}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={bd.activo === 1}
                          onClick={() => alternarActivo(bd.idBaseDatosLaboratorio)}
                          title={bd.activo === 1 ? "Desactivar base de datos" : "Activar base de datos"}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/30 ${
                            bd.activo === 1 ? "bg-emerald-500" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block size-3.5 transform rounded-full bg-white shadow transition-transform ${
                              bd.activo === 1 ? "translate-x-[18px]" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={bd.estadoConexion === "CONECTADO"}
                            onClick={() => alternarConexion(bd.idBaseDatosLaboratorio)}
                            title={bd.estadoConexion === "CONECTADO" ? "Conectado - clic para desconectar" : "Desconectado - clic para conectar"}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/30 ${
                              bd.estadoConexion === "CONECTADO" ? "bg-emerald-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block size-3.5 transform rounded-full bg-white shadow transition-transform ${
                                bd.estadoConexion === "CONECTADO" ? "translate-x-[18px]" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => abrirModalEditar(bd)}
                            className="rounded-md border border-transparent p-1.5 text-gray-500 transition hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                            title="Editar"
                          >
                            <Icono nombre="editar" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmarEliminar(bd)}
                            className="rounded-md border border-transparent p-1.5 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            title="Eliminar"
                          >
                            <Icono nombre="eliminar" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
          <div className="border-t border-line bg-surface-muted/50 px-5 py-3 sm:px-6">
            <p className="text-xs text-ink-muted">
              Mostrando <span className="font-semibold text-ink">{basesDatosFiltradas.length}</span> de{" "}
              <span className="font-semibold text-ink">{basesDatos.length}</span> bases de datos
            </p>
          </div>
        </div>
      </main>

      {/* Modal para Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {modoEdicion ? "Editar Base de Datos" : "Nueva Base de Datos"}
              </h2>
              <button
                type="button"
                onClick={cerrarModal}
                className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <Icono nombre="cerrar" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Laboratorio <span className="text-red-500">*</span>
                </label>
                <select
                  name="idLaboratorioClinico"
                  value={formData.idLaboratorioClinico}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="">Seleccione un laboratorio</option>
                  {laboratoriosOptions.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nombre Base de Datos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombreBaseDatos"
                  value={formData.nombreBaseDatos}
                  onChange={handleInputChange}
                  placeholder="Ej: levey_qc_produccion"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Motor Base de Datos <span className="text-red-500">*</span>
                </label>
                <select
                  name="motorBaseDatos"
                  value={formData.motorBaseDatos}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                >
                  <option value="">Seleccione un motor</option>
                  {motoresBD.map((motor) => (
                    <option key={motor} value={motor}>
                      {motor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Host <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hostReferencia"
                    value={formData.hostReferencia}
                    onChange={handleInputChange}
                    placeholder="Ej: db.laboratorio.cl"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Puerto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="puertoReferencia"
                    value={formData.puertoReferencia}
                    onChange={handleInputChange}
                    placeholder="Ej: 5432"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Secreto de Conexión
                </label>
                <input
                  type="password"
                  name="secretoConexionKey"
                  value={formData.secretoConexionKey}
                  onChange={handleInputChange}
                  placeholder="Ej: sk-****************"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Estado Conexión</label>
                  <select
                    name="estadoConexion"
                    value={formData.estadoConexion}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  >
                    {estadosConexion.map((estado) => (
                      <option key={estado.valor} value={estado.valor}>
                        {estado.etiqueta}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activo === 1}
                      onChange={toggleActivo}
                      className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Activo</span>
                  </label>
                </div>
              </div>
              {/* Confirmación de identidad */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Confirmación de identidad</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Ingrese su usuario y contraseña para autorizar esta operación
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Usuario <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="usuario"
                      value={credenciales.usuario}
                      onChange={handleCredencialChange}
                      placeholder="Su usuario"
                      autoComplete="username"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="contrasena"
                      value={credenciales.contrasena}
                      onChange={handleCredencialChange}
                      placeholder="Su contraseña"
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  </div>
                </div>
                {errorCredenciales && (
                  <p className="text-xs font-medium text-red-600">{errorCredenciales}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={cerrarModal}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarBaseDatos}
                disabled={!esFormularioValido}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {modoEdicion ? "Guardar Cambios" : "Crear Base de Datos"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl">
            <div className="px-6 py-4">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-100">
                <Icono nombre="eliminar" className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-center text-lg font-semibold text-gray-900">
                Eliminar Base de Datos
              </h3>
              <p className="mt-2 text-center text-sm text-gray-500">
                ¿Estás seguro de que deseas eliminar{" "}
                <strong>{confirmarEliminar.nombreBaseDatos}</strong>?<br />
                Laboratorio: {getNombreLaboratorio(confirmarEliminar.idLaboratorioClinico)}
                <br />
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setConfirmarEliminar(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={eliminarBaseDatos}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto border-t border-line bg-surface py-4">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LeveyQC. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
