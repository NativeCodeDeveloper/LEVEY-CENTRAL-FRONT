"use client"

import Image from "next/image";
import CargadorCircular from "@/components/ui/cargador-circular";
import {useRef, useEffect} from "react";
import Toaster from "@/components/ui/toast";
import {useAuth} from "@clerk/nextjs";
import {useRouter} from "next/navigation";

export default function PaginaRedireccionamiento() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const toasterRef = useRef(null);
    const router = useRouter();
    const {
        getToken,
        userId,
        isLoaded,
        isSignedIn
    } = useAuth();


    async function verificarUsuarioTipo(){
        try {
            const token = await getToken();
            const res = await fetch(`${API}/auth/me`,{
                method: "GET",
                headers:{
                    "Accept":"application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if(!res.ok){
                return toasterRef.current?.show({
                    title: `No fue posible verificar el tipo de usuario , intente mas tarde`,
                    variant: "error",
                    duration: 4000,
                });
            }

            const respuestaAuth = await res.json();

            console.log("RESPUESTA AUTH:", respuestaAuth);

            if (respuestaAuth.tipoActor === 1) {
                router.replace("/LaboratorioClinico");
                return;

            }


            if (respuestaAuth.tipoActor === 2) {
                router.replace("/LeveyDashboardClientes");
                return;
            }

        }catch (e) {
            return toasterRef.current?.show({
                title: "Error al verificar tipos de usuario. Error del Servidor",
                variant: "error",
                duration: 4000,
            });
        }
    }

    useEffect(() => {
        verificarUsuarioTipo()

    }, []);


    return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#080b13] px-5 py-10 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(31,67,145,0.22),transparent_42%),linear-gradient(to_bottom,#151827_0%,#080b13_100%)]" />

      <div className="relative flex flex-col items-center gap-14 sm:gap-16">
        <Image
          src="/leveylogo.png"
          alt="LeveyQC"
          width={2172}
          height={724}
          priority
          className="h-auto w-[210px] object-contain sm:w-[238px]"
        />
        <CargadorCircular />
      </div>
    </main>
  );
}
