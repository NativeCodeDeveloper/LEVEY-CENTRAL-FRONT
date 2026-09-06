import { Auth } from "@/components/ui/auth-form-1";
import InteractiveNebulaShader from "@/components/ui/liquid-shader";
import Image from "next/image";
import imagenNativeCode from "../../../../public/ncode.png";

export default function PaginaInicioSesion() {
    return (
        <main className="fixed inset-0 z-[100] overflow-y-auto bg-[#02040a]">
            <InteractiveNebulaShader disableCenterDimming className="z-0 opacity-75 [mask-image:linear-gradient(115deg,black_15%,black_40%,transparent_78%)]" />

            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(2,4,10,0)_0%,rgba(2,4,10,0.18)_38%,rgba(2,4,10,0.92)_100%)]"
            />
            <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
                <section
                    className="relative isolate flex w-full max-w-[500px] shrink-0 flex-col items-center overflow-hidden rounded-[28px] border border-white/15 bg-[#0b0b0d]/95 px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[32px] sm:px-7"
                    aria-label="Acceso a LeveyQC"
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
                        sizes="(max-width: 639px) 220px, 240px"
                        className="h-auto w-[220px] max-w-full object-contain drop-shadow-[0_0_22px_rgba(255,255,255,0.16)] sm:w-[240px]"
                    />

                    <div className="mt-4 w-full sm:mt-5">
                        <Auth />
                    </div>
                </section>

                <Image
                    src={imagenNativeCode}
                    alt="NativeCode"
                    width={2172}
                    height={724}
                    unoptimized
                    loading="eager"
                    className="mt-5 h-16 w-[190px] max-w-full shrink-0 object-contain opacity-55 sm:mt-6 sm:h-20 sm:w-[240px]"
                />
            </div>
        </main>
    );
}
