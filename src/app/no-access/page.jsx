import Image from "next/image";
import InteractiveNebulaShader from "@/components/ui/liquid-shader";

export default function PaginaSinAcceso() {
  return (
    <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#02040a] text-white">
      <InteractiveNebulaShader
        disableCenterDimming
        className="z-0 opacity-75 [mask-image:linear-gradient(115deg,black_15%,black_40%,transparent_78%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(2,4,10,0)_0%,rgba(2,4,10,0.18)_38%,rgba(2,4,10,0.92)_100%)]"
      />

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
        <section
          aria-labelledby="titulo-sin-acceso"
          className="relative isolate flex w-full max-w-[500px] shrink-0 flex-col items-center overflow-hidden rounded-[28px] border border-white/15 bg-[#0b0b0d]/95 px-6 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[32px] sm:px-10 sm:py-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,107,158,0.18),transparent_65%)]"
          />

          <Image
            src="/leveylogo.png"
            alt="LeveyQC"
            width={2172}
            height={724}
            priority
            sizes="(max-width: 639px) 190px, 220px"
            className="h-auto w-[190px] max-w-full object-contain drop-shadow-[0_0_22px_rgba(255,255,255,0.16)] sm:w-[220px]"
          />

          <div className="mt-10 flex size-16 items-center justify-center rounded-2xl border border-sky-200/15 bg-sky-400/10 shadow-[0_0_36px_rgba(14,165,233,0.14)] sm:mt-12 sm:size-[72px]">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="size-8 text-sky-100 sm:size-9"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path strokeLinecap="round" d="M12 16.5h.008" />
            </svg>
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-200/65 sm:text-xs">
            Acceso restringido
          </p>
          <h1 id="titulo-sin-acceso" className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-[34px]">
            Sin acceso
          </h1>
          <p className="mt-4 max-w-[330px] text-sm leading-6 text-white/55 sm:text-[15px]">
            Consulte a Soporte NativeCode si necesita permisos adicionales.
          </p>
        </section>

        <Image
          src="/ncode.png"
          alt="NativeCode"
          width={2172}
          height={724}
          priority
          className="mt-5 h-16 w-[190px] max-w-full shrink-0 object-contain opacity-55 sm:mt-6 sm:h-20 sm:w-[240px]"
        />
      </div>
    </main>
  );
}
