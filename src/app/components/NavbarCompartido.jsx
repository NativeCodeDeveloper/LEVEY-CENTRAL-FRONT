"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const enlaces = [
  { etiqueta: "Inicio", href: "/" },
  { etiqueta: "Laboratorios", href: "/LaboratorioClinico" },
  { etiqueta: "Bases de datos", href: "/BaseDatosClientes" },
  { etiqueta: "Usuarios", href: "/UsuariosSistema" },
  { etiqueta: "Perfiles", href: "/TiposUsuario" },
  { etiqueta: "Permisos", href: "/PermisosSistema" },
  { etiqueta: "Asignación Permisos", href: "/AsignacionPermisos" },
];

export default function NavbarCompartido() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#090d14]/95 shadow-[0_12px_30px_rgb(3_7_18_/_0.24)] backdrop-blur-xl" aria-label="Navegación principal">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] p-1.5 shadow-inner shadow-white/[0.03] transition group-hover:border-white/20 group-hover:bg-white/[0.09]"><Image src="/logopequeñolevey.png" alt="LeveyQC" width={512} height={512} priority className="size-full object-contain" /></span>
          <span className="text-[15px] font-semibold tracking-[-0.035em] text-white">Levey<span className="text-[#a78bfa]">QC</span> <span className="font-medium text-white/90">Panel Central</span></span>
        </Link>
        <div className="hidden items-center gap-1 rounded-xl border border-white/[0.07] bg-white/[0.035] p-1 xl:flex">
          {enlaces.map((enlace) => {
            const activo = enlace.href === "/" ? pathname === "/" : pathname.startsWith(enlace.href);
            return <Link key={enlace.href} href={enlace.href} className={`rounded-lg px-3 py-2 text-xs font-medium transition duration-200 ${activo ? "bg-[#6d28d9] text-white shadow-[0_4px_12px_rgb(0_0_0_/_0.18)]" : "text-white/55 hover:bg-white/[0.08] hover:text-white"}`}>{enlace.etiqueta}</Link>;
          })}
        </div>
        <div className="flex items-center"><UserButton showName appearance={{ variables: { colorForeground: "#ffffff" }, elements: { avatarBox: "size-9 border border-white/15", userButtonOuterIdentifier: "font-medium text-white", userButtonTrigger: "text-white" } }} /></div>
      </div>
    </nav>
  );
}
