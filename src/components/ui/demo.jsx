"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import Toaster from "@/components/ui/toast";

const variants = [
  { value: "default", label: "Informativa" },
  { value: "success", label: "Éxito" },
  { value: "error", label: "Error" },
  { value: "warning", label: "Advertencia" },
];

const positions = [
  { value: "top-left", label: "Superior izquierda" },
  { value: "top-center", label: "Superior centro" },
  { value: "top-right", label: "Superior derecha" },
  { value: "bottom-left", label: "Inferior izquierda" },
  { value: "bottom-center", label: "Inferior centro" },
  { value: "bottom-right", label: "Inferior derecha" },
];

export default function ToasterDemo() {
  const toasterRef = useRef(null);

  const showToast = (variant, position = "bottom-right") => {
    const selectedVariant = variants.find((item) => item.value === variant);

    toasterRef.current?.show({
      title: `Notificación de ${selectedVariant?.label.toLowerCase()}`,
      message: "Este es un ejemplo de notificación del sistema.",
      variant,
      position,
      duration: 3000,
      onDismiss: () =>
        console.info(`Notificación ${variant} cerrada en ${position}`),
    });
  };

  const simulateApiCall = async () => {
    toasterRef.current?.show({
      title: "Agendando...",
      message: "Espera mientras se agenda la reunión.",
      variant: "default",
      position: "bottom-right",
      duration: 2000,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toasterRef.current?.show({
        title: "Reunión agendada",
        message: "La reunión quedó agendada para el 4 de julio a las 15:42.",
        variant: "success",
        position: "bottom-right",
        highlightTitle: true,
        actions: {
          label: "Deshacer",
          onClick: () => console.info("Agenda de reunión deshecha"),
          variant: "outline",
        },
      });
    } catch {
      toasterRef.current?.show({
        title: "Error al agendar",
        message: "No fue posible agendar la reunión. Inténtalo nuevamente.",
        variant: "error",
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <Toaster ref={toasterRef} />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink">Tipos de notificación</h2>
        <div className="flex flex-wrap gap-3">
          {variants.map((variant) => (
            <Button
              key={variant.value}
              variant="outline"
              onClick={() => showToast(variant.value)}
            >
              {variant.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-ink">
          Posiciones disponibles
        </h2>
        <div className="flex flex-wrap gap-3">
          {positions.map((position) => (
            <Button
              key={position.value}
              variant="outline"
              onClick={() => showToast("default", position.value)}
            >
              {position.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-start gap-3">
        <h2 className="text-lg font-semibold text-ink">Ejemplo práctico</h2>
        <Button variant="outline" onClick={simulateApiCall}>
          Agendar reunión
        </Button>
      </section>
    </div>
  );
}
