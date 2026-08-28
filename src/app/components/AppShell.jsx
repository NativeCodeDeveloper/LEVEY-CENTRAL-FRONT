"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import NavbarCompartido from "./NavbarCompartido";

export default function AppShell({ children }) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const esPaginaDeInicioSesion = pathname.startsWith("/sign-in");

  useEffect(() => {
    if (isLoaded && !userId && !esPaginaDeInicioSesion) {
      router.replace("/sign-in");
    }
  }, [isLoaded, userId, esPaginaDeInicioSesion, router]);

  if (!isLoaded || (!userId && !esPaginaDeInicioSesion)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  return <>{esPaginaDeInicioSesion ? null : <NavbarCompartido />}{children}</>;
}
