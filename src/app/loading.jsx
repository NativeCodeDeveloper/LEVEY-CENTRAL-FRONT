import CargadorCircular from "@/components/ui/cargador-circular";

export default function Cargando() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#080b13] px-5 py-10 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(31,67,145,0.22),transparent_42%),linear-gradient(to_bottom,#151827_0%,#080b13_100%)]"
      />

      <div className="relative">
        <CargadorCircular />
      </div>
    </main>
  );
}
