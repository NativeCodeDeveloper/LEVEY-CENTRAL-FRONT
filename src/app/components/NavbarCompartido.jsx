"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const enlaces = [
  { etiqueta: "Laboratorios", href: "/admin/LaboratorioClinico" },
  { etiqueta: "Bases de datos", href: "/admin/BaseDatosClientes" },
  { etiqueta: "Usuarios", href: "/admin/UsuariosSistema" },
  { etiqueta: "Perfiles", href: "/admin/TiposUsuario" },
  { etiqueta: "Permisos", href: "/admin/PermisosSistema" },
  { etiqueta: "Asignación Permisos", href: "/admin/AsignacionPermisos" },
];

export default function NavbarCompartido() {
  const pathname = usePathname();

  if (pathname.startsWith("/LeveyDashboardClientes") || pathname.startsWith("/Redireccionamiento")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#090d14]/95 shadow-[0_12px_30px_rgb(3_7_18_/_0.24)] backdrop-blur-xl" aria-label="Navegación principal">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-7 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] p-1.5 shadow-inner shadow-white/[0.03] transition group-hover:border-white/20 group-hover:bg-white/[0.09]"><Image src="/logopequeñolevey.png" alt="LeveyQC" width={512} height={512} priority className="size-full object-contain" /></span>
          <span className="text-[15px] font-semibold tracking-[-0.035em] text-white">Levey<span className="text-[#a78bfa]">QC</span> <span className="hidden font-medium text-white/90 sm:inline">Panel Central</span></span>
        </Link>
        <div className="hidden items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.035] p-1 xl:flex">
          {enlaces.map((enlace) => {
            const activo = enlace.href === "/" ? pathname === "/" : pathname.startsWith(enlace.href);
            return <Link key={enlace.href} href={enlace.href} className={`rounded-lg px-3 py-2 text-xs font-medium transition duration-200 ${activo ? "bg-[#6d28d9] text-white shadow-[0_4px_12px_rgb(0_0_0_/_0.18)]" : "text-white/55 hover:bg-white/[0.08] hover:text-white"}`}>{enlace.etiqueta}</Link>;
          })}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <details className="group relative xl:hidden">
            <summary className="flex h-10 list-none items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-xs font-semibold text-white transition hover:bg-white/[0.11] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              <span className="hidden sm:inline">Menú</span>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="hidden size-3.5 transition-transform duration-200 group-open:rotate-180 sm:block" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </summary>

            <div className="absolute right-0 top-[calc(100%+10px)] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/10 bg-[#111722]/[0.98] p-2 shadow-[0_20px_50px_rgb(0_0_0_/_0.38)] backdrop-blur-xl">
              <div className="border-b border-white/[0.08] px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Navegación</p>
                <p className="mt-0.5 text-sm font-semibold text-white">Panel Central</p>
              </div>
              <div className="mt-1 grid gap-1">
                {enlaces.map((enlace) => {
                  const activo = enlace.href === "/" ? pathname === "/" : pathname.startsWith(enlace.href);
                  return (
                    <Link
                      key={enlace.href}
                      href={enlace.href}
                      aria-current={activo ? "page" : undefined}
                      className={`flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium transition ${
                        activo
                          ? "bg-[#6d28d9] text-white shadow-[0_4px_12px_rgb(0_0_0_/_0.18)]"
                          : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      {enlace.etiqueta}
                      {activo ? <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">Actual</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          </details>
          <UserButton showName appearance={{ variables: { colorForeground: "#ffffff" }, elements: { avatarBox: "size-9 border border-white/15", userButtonOuterIdentifier: "hidden font-medium text-white sm:block", userButtonTrigger: "text-white" } }} />
        </div>
      </div>
    </nav>
  );
}
