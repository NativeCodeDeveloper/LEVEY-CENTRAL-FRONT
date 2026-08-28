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
    <nav className="sticky top-0 z-50 border-b border-line bg-surface/95 shadow-[0_1px_10px_rgb(0_0_0_/_0.03)] backdrop-blur" aria-label="Navegación principal">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-ink p-1.5"><Image src="/logopequeñolevey.png" alt="Levey QC" width={512} height={512} priority className="size-full object-contain" /></span>
          <span><span className="block text-sm font-bold tracking-[-0.03em] text-ink">Levey<span className="text-status-ok">QC</span></span><span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-ink-faint">Quality control</span></span>
        </Link>
        <div className="hidden items-center gap-0.5 xl:flex">
          {enlaces.map((enlace) => {
            const activo = enlace.href === "/" ? pathname === "/" : pathname.startsWith(enlace.href);
            return <Link key={enlace.href} href={enlace.href} className={`rounded-md px-3 py-2 text-xs font-semibold transition ${activo ? "bg-ink text-white" : "text-ink-muted hover:bg-surface-muted hover:text-ink"}`}>{enlace.etiqueta}</Link>;
          })}
        </div>
        <div className="flex items-center gap-2.5"><span className="hidden items-center gap-2 rounded-full bg-status-ok-soft px-2.5 py-1.5 text-[11px] font-semibold text-status-ok sm:flex"><span className="size-1.5 rounded-full bg-status-ok" /> Red operativa</span><UserButton showName appearance={{ elements: { avatarBox: "size-8" } }} /></div>
      </div>
    </nav>
  );
}
