import ToasterDemo from "@/components/ui/demo";

export default function PaginaDemoNotificaciones() {
  return (
    <main className="min-h-screen bg-canvas px-4 py-8 sm:px-7 lg:px-10">
      <div className="mx-auto max-w-5xl rounded-xl border border-line bg-surface shadow-sm">
        <div className="border-b border-line px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Componentes UI
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-ink">
            Demostración de notificaciones
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Prueba los tipos, las posiciones y el ejemplo de una operación
            asíncrona.
          </p>
        </div>

        <ToasterDemo />
      </div>
    </main>
  );
}
