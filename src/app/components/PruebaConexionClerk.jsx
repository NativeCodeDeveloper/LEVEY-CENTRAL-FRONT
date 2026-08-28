"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function PruebaConexionClerk() {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    async function probarEndpointProtegido() {
      try {
        const token = await getToken();
        const respuesta = await fetch("http://localhost:8080/usuarios-levey", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Estado backend:", respuesta.status);
        console.log("Respuesta backend:", await respuesta.json());
      } catch (error) {
        console.error("No fue posible conectar el frontend con el backend protegido:", error);
      }
    }

    probarEndpointProtegido();
  }, [isSignedIn, getToken]);

  return null;
}
