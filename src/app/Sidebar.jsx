"use client";

// Sidebar de dos niveles: un riel angosto de iconos (una entrada por grupo)
// y un panel de detalle que muestra la navegacion del grupo activo, con
// buscador, subitems colapsables y opcion de contraer el panel a solo
// iconos. Reemplaza el sidebar de una sola columna por este patron de
// riel+panel (estilo Linear/Arc), pidiendo lo mismo que antes: los items
// sin `href` y sin `subitems` son pantallas que todavia no existen (boton
// inerte, no rompen la navegacion).
//
// Paleta oscura propia en globals.css (sidebar-bg/text/hover/active),
// separada de la paleta clara del resto de la app.

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";

const grupos = [
  {
    id: "analisis-qc",
    titulo: "Análisis QC",
    iconoRiel: "reglas",
    items: [
      { etiqueta: "Registro QC", href: "/LeveyDashboardClientes/analisisCalidad/registro", icono: "registro" },
      { etiqueta: "Tecnicas Controladas", href: "/LeveyDashboardClientes/analisisCalidad/analitosControlados", icono: "controles" },
      { etiqueta: "Controles", href: "/LeveyDashboardClientes/analisisCalidad/controles", icono: "controlesQc" },
      { etiqueta: "Calibradores", href: "/LeveyDashboardClientes/analisisCalidad/calibradores", icono: "calibradores" },
      { etiqueta: "Control de Pares", href: "/LeveyDashboardClientes/analisisCalidad/controlDePares", icono: "controlPares" },
      { etiqueta: "Reportes", icono: "reportes" },
      { etiqueta: "Inventario Laboratorio", icono: "inventario", href: "/LeveyDashboardClientes/analisisCalidad/inventarioLaboratorio" },
    ],
  },
  {
    id: "gestion",
    titulo: "Gestión",
    iconoRiel: "equipos",
    items: [
      { etiqueta: "Categorias Analitos ", icono: "categorias",
          href: "/LeveyDashboardClientes/gestionLevey/categorias",
      },



      { etiqueta: "Tecnicas - Analitos", icono: "analitos",
          href: "/LeveyDashboardClientes/gestionLevey/analitos",
      },
      { etiqueta: "Matriz Biologica", icono: "matriz",
          href: "/LeveyDashboardClientes/gestionLevey/matriz",
      },
        { etiqueta: "Unidades de Medidas", icono: "unidades", href: "/LeveyDashboardClientes/gestionLevey/unidadesDeMedida",
        },
        { etiqueta: "Acciones correctivas", icono: "acciones" , href: "/LeveyDashboardClientes/gestionLevey/accionesCorrectivas"},
        { etiqueta: "Proveedores", icono: "proveedores", href: "/LeveyDashboardClientes/gestionLevey/proveedores", },
        { etiqueta: "Ubicaciones", icono: "ubicaciones", href: "/LeveyDashboardClientes/gestionLevey/ubicacionesLaboratorio", },

        { etiqueta: "Analizadores Equipos", icono: "analizadores" },
        { etiqueta: "Informacion ", icono: "informacion" },
        { etiqueta: "Reglas de Westgard ", icono: "westgard" },

    ],
  },
];

// Set de iconos de linea, minimalistas, dibujados a mano (sin dependencia de
// una libreria de iconos). Un solo componente con un mapa de paths en vez de
// un archivo por icono: mas facil de mantener y de revisar de un vistazo.
const trazosPorIcono = {
  registro: <><path d="M5 5h9M5 10h9M5 15h6" /><path d="M17 13l3 3-6 6h-3v-3z" /></>,
  controles: <><path d="M9 3h6M10 3v5.5L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 8.5V3" /></>,
  controlesQc: <><path d="M12 3.5l6.9 4v8l-6.9 4-6.9-4v-8z" /><path d="M12.5 5.9l4.1 2.4M16.6 14.7l-4.1 2.4M6.9 9.1v4.8" /></>,
  campana: <><path d="M6 9.5a6 6 0 0 1 12 0c0 5 1.8 6.2 2.5 7H3.5C4.2 15.7 6 14.5 6 9.5z" /><path d="M10.2 19.5a2 2 0 0 0 3.6 0" /></>,
  calibradores: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2.6" /></>,
  reglas: <><path d="M12 3l7 3v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
  inventario: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5l8 4.5 8-4.5" /><path d="M12 12v9" /></>,
  reportes: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M9.5 13h5M9.5 16h5" /></>,
  controlPares: <><circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" /></>,
  equipos: <><path d="M3 8l9-5 9 5-9 5-9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
  analitos: <><circle cx="12" cy="12" r="2.5" /><circle cx="5" cy="7" r="2" /><circle cx="19" cy="7" r="2" /><circle cx="12" cy="20" r="2" /><path d="M6.7 8.1l3.2 2.3M17.3 8.1l-3.2 2.3M12 14.5V18" /></>,
  categorias: <><path d="M4 7.5h16M4 12h16M4 16.5h16" /><path d="M7 5v4M12 9.5v5M17 14v4" /></>,
  matriz: <><path d="M5 4h14v16H5z" /><path d="M5 9h14M5 14h14M10 4v16M15 4v16" /></>,
  unidades: <><path d="M4 6h16v12H4z" /><path d="M8 6v4M12 6v2.5M16 6v4" /></>,
  analizadores: <><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="7" y="7" width="6" height="4" rx=".7" /><circle cx="16.5" cy="8" r="1" /><path d="M7 15h10" /><path d="M9 18h6" /></>,
  informacion: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></>,
  westgard: <><path d="M4 19V5M4 19h16" /><path d="M7 15l3-4 3 2 4-6" /><circle cx="7" cy="15" r="1" /><circle cx="10" cy="11" r="1" /><circle cx="13" cy="13" r="1" /><circle cx="17" cy="7" r="1" /></>,
  reactivos: <><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></>,
  muestras: <><path d="M9 3h6" /><path d="M10 3v13a2 2 0 0 0 4 0V3" /><path d="M10 13h4" /></>,
  acciones: <><rect x="6" y="4" width="12" height="16" rx="2" /><path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" /><path d="M9 12l2 2 4-4" /></>,
  bitacora: <><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v18H7.5A2.5 2.5 0 0 0 5 22.5" /><path d="M5 4.5v16" /></>,
  proveedores: <><rect x="2" y="7" width="12" height="9" /><path d="M14 10h4l3 3v3h-7" /><circle cx="6" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  ubicaciones: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="2.5" /></>,
  usuarios: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1-4 4-6 7-6s6 2 7 6" /></>,
  roles: <><circle cx="8" cy="15" r="3.5" /><path d="M10.5 12.5L19 4" /><path d="M16 7l2 2" /><path d="M13.5 9.5l2 2" /></>,
  perfiles: <><path d="M4 6h9M17 6h3M4 18h3M9 18h11" /><circle cx="14" cy="6" r="2" /><circle cx="7" cy="18" r="2" /></>,
  configuraciones: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>,
  buscar: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.35-4.35" /></>,
};

function IconoHamburguesa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function IconoItem({ nombre, className = "h-5 w-5 [filter:drop-shadow(0_0_2px_rgb(255_255_255_/_0.35))_drop-shadow(0_0_6px_rgb(255_255_255_/_0.22))]" }) {
  const trazos = trazosPorIcono[nombre];
  if (!trazos) return null;
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`${className} shrink-0`} stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {trazos}
    </svg>
  );
}

function FlechaGrupo({ abierto }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 text-sidebar-text-faint transition-transform duration-150 ${abierto ? "rotate-90" : ""}`}>
      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function coincide(texto, termino) {
  return texto.toLowerCase().includes(termino);
}

// Filtra los items de un grupo por el termino de busqueda: conserva un item
// si su propia etiqueta matchea, o si alguno de sus subitems matchea (en
// cuyo caso solo deja los subitems que matchean, ya expandido).
function filtrarItems(items, termino) {
  if (!termino) return items;
  return items
    .map((item) => {
      const propioMatch = coincide(item.etiqueta, termino);
      if (!item.subitems) return propioMatch ? item : null;
      const subitemsFiltrados = item.subitems.filter((sub) => coincide(sub.etiqueta, termino));
      if (propioMatch) return item;
      if (subitemsFiltrados.length > 0) return { ...item, subitems: subitemsFiltrados };
      return null;
    })
    .filter(Boolean);
}

/* ------------------------------- Riel de iconos ------------------------------ */

function RielDeIconos({ grupoActivoId, alSeleccionarGrupo }) {
  return (
    <div className="flex h-full min-h-0 w-16 shrink-0 flex-col items-center gap-2 overflow-x-hidden overflow-y-auto overscroll-contain border-r border-sidebar-border bg-sidebar-bg px-2 pb-5 pt-[22px]">
      <div className="mb-3 flex size-9 shrink-0 items-center justify-center">
        <Image src="/logopequeñolevey.png" alt="LeveyQC" width={512} height={512} priority className="h-auto w-8 object-contain" />
      </div>

      <nav className="flex shrink-0 flex-col items-center gap-1.5" aria-label="Secciones">
        <Link
          href="/LeveyDashboardClientes"
          aria-label="Notificaciones"
          title="Notificaciones"
          className="flex size-10 items-center justify-center rounded-lg text-sidebar-text-muted transition hover:bg-sidebar-hover-bg hover:text-sidebar-text"
        >
          <IconoItem nombre="campana" />
        </Link>

        {grupos.map((grupo) => {
          const activo = grupoActivoId === grupo.id;
          return (
            <button
              key={grupo.id}
              type="button"
              onClick={() => alSeleccionarGrupo(grupo.id)}
              title={grupo.titulo}
              aria-pressed={activo}
              className={`flex size-10 items-center justify-center rounded-lg border transition ${
                activo
                  ? "border-transparent bg-sidebar-active-bg text-sidebar-text"
                  : "border-transparent text-sidebar-text-muted hover:bg-sidebar-hover-bg hover:text-sidebar-text"
              }`}
            >
              <IconoItem nombre={grupo.iconoRiel} />
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center">
        <span className="size-2 rounded-full bg-status-ok" title="Control interno activo" />
      </div>
    </div>
  );
}

/* ------------------------------ Items del panel ------------------------------ */

function ItemDePanel({ item, pathname, grupoAbierto, alternarGrupo, colapsado, onNavegar }) {
  const tieneSubitems = Array.isArray(item.subitems) && item.subitems.length > 0;
  const claseBase = "flex min-h-[38px] w-full items-center gap-2.5 rounded-md border px-3 text-[13.5px] font-medium transition";
  const claseInactiva = "border-transparent text-sidebar-text-muted hover:bg-sidebar-hover-bg hover:text-sidebar-text";
  const claseActiva = "border-transparent bg-sidebar-active-bg text-sidebar-text";

  if (tieneSubitems) {
    const abierto = grupoAbierto === item.etiqueta;
    const activo = item.subitems.some((sub) => pathname === sub.href);

    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => alternarGrupo(item.etiqueta)}
          aria-expanded={abierto}
          title={colapsado ? item.etiqueta : undefined}
          className={`${claseBase} ${colapsado ? "justify-center px-0" : "justify-between"} ${activo ? claseActiva : claseInactiva}`}
        >
          <span className="flex items-center gap-2.5">
            <IconoItem nombre={item.icono} />
            {colapsado ? null : item.etiqueta}
          </span>
          {colapsado ? null : <FlechaGrupo abierto={abierto} />}
        </button>

        {abierto && !colapsado ? (
          <div className="ml-[19px] flex flex-col gap-[2px] border-l border-sidebar-border py-0.5 pl-3" aria-label={`${item.etiqueta} submenu`}>
            {item.subitems.map((sub) => (
              <Link
                key={sub.etiqueta}
                href={sub.href}
                onClick={onNavegar}
                className={`flex min-h-[28px] items-center rounded-md px-2.5 text-[13px] transition hover:bg-sidebar-hover-bg hover:text-sidebar-text ${
                  pathname === sub.href ? "bg-sidebar-hover-bg font-medium text-sidebar-text" : "text-sidebar-text-muted"
                }`}
              >
                {sub.etiqueta}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (item.href) {
    const activo = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link href={item.href} onClick={onNavegar} title={colapsado ? item.etiqueta : undefined} className={`${claseBase} ${colapsado ? "justify-center px-0" : ""} ${activo ? claseActiva : claseInactiva}`}>
        <IconoItem nombre={item.icono} />
        {colapsado ? null : item.etiqueta}
      </Link>
    );
  }

  return (
    <button type="button" title={colapsado ? item.etiqueta : undefined} className={`${claseBase} ${colapsado ? "justify-center px-0" : "text-left"} ${claseInactiva} cursor-default opacity-60`}>
      <IconoItem nombre={item.icono} />
      {colapsado ? null : item.etiqueta}
    </button>
  );
}

/* -------------------------------- Panel de detalle ---------------------------- */

function PanelDeDetalle({ grupo, colapsado, alColapsar, onNavegar }) {
  const pathname = usePathname();
  const { isLoaded: usuarioCargado, user: usuario } = useUser();
  const { isLoaded: institucionCargada, organization: institucion } = useOrganization();
  const { openUserProfile: abrirPerfilUsuario } = useClerk();
  const nombreUsuario = usuario?.fullName || usuario?.username || "Usuario";
  const [grupoAbierto, setGrupoAbierto] = useState("Controles");
  const [busqueda, setBusqueda] = useState("");

  function alternarGrupo(etiqueta) {
    setGrupoAbierto((actual) => (actual === etiqueta ? null : etiqueta));
  }

  const itemsVisibles = useMemo(
    () => filtrarItems(grupo.items, busqueda.trim().toLowerCase()),
    [grupo.items, busqueda]
  );

  return (
    <div className={`flex h-full min-h-0 shrink-0 flex-col overflow-x-hidden overflow-y-auto overscroll-contain border-r border-sidebar-border bg-sidebar-bg transition-[width] duration-300 ${colapsado ? "w-16" : "w-64"}`}>
      {colapsado ? (
        <div className="flex shrink-0 justify-center pb-4 pt-[22px]">
          <button
            type="button"
            onClick={alColapsar}
            aria-label="Expandir panel"
            className="flex size-9 items-center justify-center rounded-lg text-sidebar-text-muted transition hover:bg-sidebar-hover-bg hover:text-sidebar-text"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4 rotate-180">
              <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div className="flex shrink-0 flex-col items-center gap-3 px-5 pb-6 pt-7" aria-busy={!usuarioCargado}>
            <button
              type="button"
              onClick={() => abrirPerfilUsuario()}
              disabled={!usuarioCargado || !usuario}
              aria-label="Gestionar foto de perfil y cuenta"
              title="Gestionar mi perfil"
              className="group relative flex size-36 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-sidebar-border bg-sidebar-hover-bg ring-4 ring-white/5 transition hover:ring-white/20 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-sidebar-text disabled:cursor-default"
            >
              {usuarioCargado && usuario?.imageUrl ? (
                <Image
                  src={usuario.imageUrl}
                  alt={`Foto de ${nombreUsuario}`}
                  width={144}
                  height={144}
                  unoptimized
                  className="size-full rounded-full object-cover"
                />
              ) : (
                <IconoItem nombre="usuarios" className="size-14 text-sidebar-text-muted" />
              )}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-black/60 py-2 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">Editar perfil</span>
            </button>
            <div className="w-full space-y-1.5 text-center">
              <p className="break-words text-[15px] font-semibold leading-5 text-sidebar-text">
                {usuarioCargado ? nombreUsuario : "Cargando usuario…"}
              </p>
              <p className="break-words text-xs leading-5 text-sidebar-text-muted" aria-busy={!institucionCargada}>
                {institucionCargada ? institucion?.name || "Sin institución activa" : "Cargando institución…"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between px-4 pb-3">
            <p className="m-0 text-[15px] font-semibold text-sidebar-text">{grupo.titulo}</p>
            <button
              type="button"
              onClick={alColapsar}
              aria-label="Contraer panel"
              className="flex size-8 items-center justify-center rounded-md text-sidebar-text-faint transition hover:bg-sidebar-hover-bg hover:text-sidebar-text"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
                <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="hidden">
            <label className="flex h-9 items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-hover-bg px-2.5 text-sidebar-text-muted focus-within:border-sidebar-text-faint">
              <IconoItem nombre="buscar" className="h-3.5 w-3.5" />
              <input
                type="search"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Buscar en el menú..."
                className="h-full w-full bg-transparent text-[13px] text-sidebar-text outline-none placeholder:text-sidebar-text-faint"
              />
            </label>
          </div>
        </>
      )}

      <nav className={`flex shrink-0 flex-col gap-1 px-3 pb-4 ${colapsado ? "items-center px-2" : ""}`} aria-label={grupo.titulo}>
        {itemsVisibles.length === 0 ? (
          <p className="mt-2 px-1 text-[12px] text-sidebar-text-faint">Sin resultados para &quot;{busqueda}&quot;.</p>
        ) : (
          itemsVisibles.map((item) => (
            <ItemDePanel key={item.etiqueta} item={item} pathname={pathname} grupoAbierto={grupoAbierto} alternarGrupo={alternarGrupo} colapsado={colapsado} onNavegar={onNavegar} />
          ))
        )}
      </nav>
    </div>
  );
}

/* ----------------------------------- Sidebar ---------------------------------- */

export default function Sidebar() {
  const pathname = usePathname();

  const grupoInicial = useMemo(() => {
    const grupoConRuta = grupos.find((grupo) =>
      grupo.items.some((item) => {
        if (item.href) return pathname === item.href || pathname.startsWith(`${item.href}/`);
        if (item.subitems) return item.subitems.some((sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`));
        return false;
      })
    );
    return grupoConRuta?.id ?? grupos[0].id;
    // Solo se calcula una vez, al montar: despues el usuario controla
    // libremente que grupo ver en el riel sin que la navegacion se lo pise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [grupoActivoId, setGrupoActivoId] = useState(grupoInicial);
  const [colapsado, setColapsado] = useState(false);
  // Solo importa por debajo de 860px: en desktop el aside siempre esta
  // visible y este estado no se usa.
  const [abiertoEnMovil, setAbiertoEnMovil] = useState(false);

  const grupoActivo = grupos.find((grupo) => grupo.id === grupoActivoId) ?? grupos[0];

  return (
    <>
      <div className="hidden items-center justify-between border-b border-line bg-white px-4 py-3 max-[860px]:flex">
        <button
          type="button"
          onClick={() => setAbiertoEnMovil(true)}
          aria-label="Abrir menu"
          className="flex size-9 items-center justify-center rounded-md text-ink transition hover:bg-surface-muted"
        >
          <IconoHamburguesa />
        </button>
        <Image src="/logopequeñolevey.png" alt="LeveyQC" width={512} height={512} className="h-auto w-7 object-contain" />
      </div>

      {abiertoEnMovil ? (
        <button
          type="button"
          aria-label="Cerrar menu"
          onClick={() => setAbiertoEnMovil(false)}
          className="fixed inset-0 z-40 hidden bg-black/40 max-[860px]:block"
        />
      ) : null}

      <aside
        className={`sticky top-0 z-50 flex h-dvh max-h-dvh shrink-0 overflow-hidden transition-transform duration-300 max-[860px]:fixed max-[860px]:inset-y-0 max-[860px]:left-0 max-[860px]:shadow-2xl ${
          abiertoEnMovil ? "max-[860px]:translate-x-0" : "max-[860px]:-translate-x-full"
        }`}
        aria-label="Menu principal"
      >
        <RielDeIconos grupoActivoId={grupoActivoId} alSeleccionarGrupo={setGrupoActivoId} />
        <PanelDeDetalle
          grupo={grupoActivo}
          colapsado={colapsado}
          alColapsar={() => setColapsado((actual) => !actual)}
          onNavegar={() => setAbiertoEnMovil(false)}
        />
      </aside>
    </>
  );
}
