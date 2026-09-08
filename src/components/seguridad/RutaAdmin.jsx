"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RutaAdmin({ children }) {
    const API = process.env.NEXT_PUBLIC_API_URL;

    const {
        getToken,
        isLoaded,
        isSignedIn
    } = useAuth();

    const router = useRouter();
    const [autorizado, setAutorizado] = useState(false);

    useEffect(() => {
        async function verificarAdmin() {

            if (!isLoaded) {
                return;
            }

            if (!isSignedIn) {
                router.replace("/sign-in");
                return;
            }

            try {
                const token = await getToken();

                const res = await fetch(`${API}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (!res.ok) {
                    router.replace("/no-access");
                    return;
                }

                const actor = await res.json();

                if (actor.tipoActor !== 1) {
                    router.replace("/sin-acceso");
                    return;
                }

                setAutorizado(true);

            } catch (error) {
                console.error(error);
                router.replace("/sin-acceso");
            }
        }

        verificarAdmin();

    }, [isLoaded, isSignedIn]);

    if (!autorizado) {
        return null;
    }

    return children;
}