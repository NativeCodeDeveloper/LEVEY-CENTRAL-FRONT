"use client";

import { UserButton, useOrganization, useUser } from "@clerk/nextjs";

function IconoEdificio() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M2 21h20M8 7h4M8 11h4M8 15h4M16 9h2M16 13h2M16 17h2" />
    </svg>
  );
}

function IconoFlecha() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4l6 6-6 6" />
    </svg>
  );
}

export default function PaginaDashboardClientes() {
  const { isLoaded: usuarioCargado, user } = useUser();
  const { isLoaded: institucionCargada, organization } = useOrganization();

  const datosCargados = usuarioCargado && institucionCargada;
  const nombreUsuario = datosCargados ? user?.fullName || "Usuario autenticado" : "Cargando usuario...";
  const nombreInstitucion = datosCargados ? organization?.name || "Sin institución activa" : "Cargando institución...";
  return (
    <div className="min-h-dvh">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex min-h-20 max-w-[1560px] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-faint">
              Dashboard
            </p>
            <p className="mt-1 truncate text-sm font-medium text-ink-muted">
              Vista general de tu espacio de trabajo
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden min-w-0 items-center gap-2.5 border-r border-[#e5e7eb] pr-4 sm:flex">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f0edff] text-[#6854c7]">
                <IconoEdificio />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-faint">
                  Institución activa
                </p>
                <p className="truncate text-sm font-semibold text-ink">
                  {nombreInstitucion}
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2.5">
              <UserButton
                appearance={{
                  variables: { colorPrimary: "#6854c7" },
                  elements: {
                    avatarBox: "size-16 border border-[#e5e7eb] shadow-sm sm:size-20",
                    userButtonTrigger: "rounded-full focus:outline-none focus:ring-2 focus:ring-[#6854c7] focus:ring-offset-2",
                  },
                }}
              />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-ink-faint">
                  Sesión activa
                </p>
                <p className="truncate text-sm font-semibold text-ink">
                  {nombreUsuario}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100dvh-81px)] max-w-[1560px] items-center px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
          <div>
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl border border-[#ded9fa] bg-[#f0edff] text-[#6854c7] shadow-[0_10px_30px_rgb(104_84_199_/_0.1)]">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M3 12h18" />
                <path d="M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" />
              </svg>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6854c7]">
              Levey Quality Control
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.055em] text-ink sm:text-5xl">
              Bienvenido, {nombreUsuario}.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink-muted sm:text-lg">
              Selecciona una sección en el menú lateral para comenzar a gestionar el control de calidad de tu institución.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-[0_14px_35px_rgb(20_25_35_/_0.05)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-faint">
              Espacio actual
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f0edff] text-[#6854c7]">
                <IconoEdificio />
              </span>
              <span className="min-w-0 truncate">{nombreInstitucion}</span>
            </div>
            <span className="mt-5 flex items-center gap-1 text-xs font-semibold text-[#6854c7]">
              Explora el menú <IconoFlecha />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
