"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const statsCards = [
  { titulo: "Laboratorios", valor: "12", icono: "laboratorio", color: "bg-blue-500" },
  { titulo: "Controles QC", valor: "48", icono: "controles", color: "bg-green-500" },
  { titulo: "Analitos", valor: "156", icono: "analitos", color: "bg-purple-500" },
  { titulo: "Usuarios", valor: "8", icono: "usuarios", color: "bg-orange-500" },
];

const menuItems = [
  { etiqueta: "Laboratorios Clinicos", href: "/LaboratorioClinico", icono: "laboratorio" },
  { etiqueta: "Base Datos Clientes", href: "/BaseDatosClientes", icono: "clientes" },
  { etiqueta: "Usuarios Del Sistema", href: "/UsuariosSistema", icono: "usuarios" },
  { etiqueta: "Tipos De Usuario", href: "/TiposUsuario", icono: "tipos" },
  { etiqueta: "Permisos Del Sistema", href: "/PermisosSistema", icono: "permisos" },
];

const iconos = {
  laboratorio: (
    <>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="8" cy="6" r="1.5" fill="currentColor" />
    </>
  ),
  controles: (
    <>
      <path d="M12 3v18M3 12h18" />
      <circle cx="12" cy="12" r="8" />
    </>
  ),
  analitos: (
    <>
      <path d="M9 3h6M10 3v5.5L5.5 17a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 8.5V3" />
    </>
  ),
  usuarios: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  clientes: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
  actividad: (
    <>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </>
  ),
  alerta: (
    <>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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

const actividadesRecientes = [
  { id: 1, texto: "Nuevo laboratorio registrado", tiempo: "Hace 5 min", tipo: "exito" },
  { id: 2, texto: "Control QC generado", tiempo: "Hace 15 min", tipo: "info" },
  { id: 3, texto: "Usuario actualizado", tiempo: "Hace 1 hora", tipo: "neutral" },
  { id: 4, texto: "Alerta de Westgard", tiempo: "Hace 2 horas", tipo: "alerta" },
];

export default function HomePage() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const router = useRouter();

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

  const actividadTipoClase = {
    exito: "bg-green-100 text-green-700",
    info: "bg-blue-100 text-blue-700",
    neutral: "bg-gray-100 text-gray-700",
    alerta: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Gris Oscuro */}
      <nav className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logopequeñolevey.png"
                alt="LeveyQC"
                width={512}
                height={512}
                className="h-9 w-9 object-contain"
              />
              <span className="text-xl font-semibold text-white">LeveyQC</span>
            </div>

            <div className="hidden items-center gap-1 md:flex">
              {menuItems.map((item) => (
                <Link
                  key={item.etiqueta}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 hover:text-white"
                >
                  <Icono nombre={item.icono} className="h-4 w-4" />
                  {item.etiqueta}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="text-sm font-medium text-white">
                    {user.firstName || user.username || "Usuario"}
                  </span>
                  <div className="size-9 rounded-full bg-gray-300 flex items-center justify-center">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="" className="size-9 rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {(user?.firstName || user?.username || "U").charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="flex rounded-md p-2 text-white transition hover:bg-gray-800 md:hidden"
              >
                <Icono nombre={menuAbierto ? "cerrar" : "hamburguesa"} />
              </button>
            </div>
          </div>
        </div>

        {menuAbierto && (
          <div className="border-t border-gray-700 bg-gray-900 md:hidden">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {menuItems.map((item) => (
                <Link
                  key={item.etiqueta}
                  href={item.href}
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 hover:text-white"
                >
                  <Icono nombre={item.icono} className="h-4 w-4" />
                  {item.etiqueta}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.firstName || user?.username || "Usuario"}
          </h1>
          <p className="mt-2 text-gray-600">Panel de Control de LeveyQC</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <div key={stat.titulo} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.titulo}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.valor}</p>
                </div>
                <div className={`flex size-12 items-center justify-center rounded-full text-white ${stat.color}`}>
                  <Icono nombre={stat.icono} className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secciones principales */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Accesos Rápidos */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Accesos Rápidos</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {menuItems.map((item) => (
                <Link
                  key={item.etiqueta}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md border border-gray-200 p-3 transition hover:bg-gray-50 hover:border-gray-300"
                >
                  <div className="flex size-10 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                    <Icono nombre={item.icono} className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.etiqueta}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Ver todo
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {actividadesRecientes.map((actividad) => (
                <div
                  key={actividad.id}
                  className="flex items-center gap-3 rounded-md border border-gray-100 p-3"
                >
                  <div className={`size-2 rounded-full ${actividadTipoClase[actividad.tipo]}`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{actividad.texto}</p>
                    <p className="text-xs text-gray-500">{actividad.tiempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen de Controles QC */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Estado de Controles QC</h2>
            <Link href="/AnalisisQC" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Ver detalles
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 text-left font-semibold text-gray-600">Laboratorio</th>
                  <th className="py-3 text-left font-semibold text-gray-600">Control</th>
                  <th className="py-3 text-left font-semibold text-gray-600">Nivel</th>
                  <th className="py-3 text-left font-semibold text-gray-600">Estado</th>
                  <th className="py-3 text-left font-semibold text-gray-600">Último Registro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">Laboratorio Central</td>
                  <td className="py-3 text-gray-700">Glucosa</td>
                  <td className="py-3 text-gray-700">Nivel 1</td>
                  <td className="py-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Aceptado
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">Hace 2 horas</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">Hospital Regional</td>
                  <td className="py-3 text-gray-700">Colesterol</td>
                  <td className="py-3 text-gray-700">Nivel 2</td>
                  <td className="py-3">
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                      Revisión
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">Hace 4 horas</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-900">Clínica San José</td>
                  <td className="py-3 text-gray-700">Hemoglobina</td>
                  <td className="py-3 text-gray-700">Nivel 1</td>
                  <td className="py-3">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      Rechazado
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">Hace 6 horas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} LeveyQC. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
