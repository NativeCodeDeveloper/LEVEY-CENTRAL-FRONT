export function CargadorCircular({ texto = "Verificando" }) {
  return (
    <output
      aria-live="polite"
      aria-label={`${texto} acceso`}
      className="relative flex size-40 select-none items-center justify-center sm:size-[180px]"
    >
      <span className="sr-only">{texto} acceso</span>

      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,transparent_0deg,#38bdf8_72deg,#005dff_150deg,#6d28d9_245deg,transparent_360deg)] opacity-90 shadow-[0_0_34px_rgba(56,189,248,0.22)] motion-safe:animate-[spin_5s_linear_infinite] motion-reduce:animate-none"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[3px] rounded-full bg-gradient-to-b from-[#19377e] via-[#0d1830] to-[#07090f] shadow-[inset_0_14px_26px_rgba(56,189,248,0.18),inset_0_-24px_38px_rgba(30,64,175,0.28)]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-4 rounded-full border border-white/10 motion-safe:animate-[spin_2.8s_linear_infinite] motion-reduce:animate-none"
      >
        <span className="absolute left-1/2 top-[-5px] size-2.5 -translate-x-1/2 rounded-full bg-[#7dd3fc] shadow-[0_0_14px_rgba(125,211,252,0.9)]" />
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-8 rounded-full border border-[#60a5fa]/20 shadow-[inset_0_0_24px_rgba(96,165,250,0.12)] motion-safe:animate-pulse motion-reduce:animate-none"
      />

      <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80 motion-safe:animate-pulse motion-reduce:animate-none sm:text-xs">
        {texto}
      </span>
    </output>
  );
}

export default CargadorCircular;
