"use client";

const EASE_PREMIUM = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const TONOS_ESTADO = {
  Vigente: "border-[#b9ddc5] bg-status-ok-soft text-status-ok",
  "Por vencer": "border-[#f0dcc0] bg-status-warn-soft text-status-warn",
  Vencido: "border-status-alert/30 bg-status-alert-soft text-status-alert",
};

const TONO_CADUCIDAD = {
  Vigente: "",
  "Por vencer": "font-semibold text-status-warn",
  Vencido: "font-semibold text-status-alert",
};

// Datos de demostración: reemplazar por la respuesta de la API cuando
// exista el endpoint de calibradores.
const CALIBRADORES = [
  {
    id: "cal-1",
    nombre: "Calibrador Chemistry Sera-1",
    fabricante: "Roche",
    creacion: "02-01-2026",
    caducacion: "30-11-2026",
    usuarioCreacion: "TM BOL",
    usuarioModificacion: "TM AMH",
    estado: "Vigente",
    stock: 8,
    ubicacion: "Refrigerador A · Estante 2",
    categoria: "Bioquímica",
  },
  {
    id: "cal-2",
    nombre: "Calibrador Multianalito Hormone II",
    fabricante: "Abbott",
    creacion: "18-12-2025",
    caducacion: "01-02-2027",
    usuarioCreacion: "TM FDI",
    usuarioModificacion: "TM FDI",
    estado: "Vigente",
    stock: 12,
    ubicacion: "Refrigerador B · Estante 1",
    categoria: "Hormonal",
  },
  {
    id: "cal-3",
    nombre: "HbA1c Calibrator Set",
    fabricante: "Siemens",
    creacion: "05-03-2026",
    caducacion: "10-10-2026",
    usuarioCreacion: "TM BOL",
    usuarioModificacion: "TM RSO",
    estado: "Por vencer",
    stock: 4,
    ubicacion: "Refrigerador A · Estante 3",
    categoria: "Hematología",
  },
  {
    id: "cal-4",
    nombre: "ImmunoAssay Cal 5",
    fabricante: "Beckman Coulter",
    creacion: "20-10-2025",
    caducacion: "01-08-2026",
    usuarioCreacion: "TM AMH",
    usuarioModificacion: "TM MVE",
    estado: "Vencido",
    stock: 2,
    ubicacion: "Congelador -20° · Bandeja 1",
    categoria: "Inmunología",
  },
  {
    id: "cal-5",
    nombre: "Coagulation Calibrator Plasma",
    fabricante: "Stago",
    creacion: "11-02-2026",
    caducacion: "31-03-2027",
    usuarioCreacion: "TM RSO",
    usuarioModificacion: "TM BOL",
    estado: "Vigente",
    stock: 6,
    ubicacion: "Refrigerador C · Estante 2",
    categoria: "Coagulación",
  },
  {
    id: "cal-6",
    nombre: "Calibrador Orina Chemistry",
    fabricante: "Wiener Lab",
    creacion: "07-04-2026",
    caducacion: "30-12-2026",
    usuarioCreacion: "TM MVE",
    usuarioModificacion: "TM MVE",
    estado: "Vigente",
    stock: 9,
    ubicacion: "Temp. Ambiente · Repisa 4",
    categoria: "Orinas",
  },
];

function MicroDato({ etiqueta, tono = "", children }) {
  return (
    <p className="flex items-baseline gap-1.5 leading-3.5">
      <span className="shrink-0 text-[8px] font-bold uppercase tracking-[0.12em] text-ink-faint">{etiqueta}</span>
      <span className={`min-w-0 truncate text-[10px] font-medium tabular-nums text-ink-muted ${tono}`}>{children}</span>
    </p>
  );
}

function ChipEstado({ estado }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${TONOS_ESTADO[estado]}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {estado}
    </span>
  );
}

function FilaCalibrador({ calibrador, esUltima }) {
  return (
    <tr className={`transition-colors duration-200 ${EASE_PREMIUM} hover:bg-[#fbfbfc] ${esUltima ? "" : "border-b border-line/60"}`}>
      <td className="border-r border-line/60 px-4 py-3 align-top">
        <p className="text-[12px] font-semibold leading-4 text-ink">{calibrador.nombre}</p>
        <p className="mt-0.5 text-[10px] leading-3.5 text-ink-muted">{calibrador.fabricante}</p>
        <div className="mt-2 space-y-1 border-t border-line/40 pt-1.5">
          <MicroDato etiqueta="Creado">{calibrador.creacion}</MicroDato>
          <MicroDato etiqueta="Caduca" tono={TONO_CADUCIDAD[calibrador.estado]}>{calibrador.caducacion}</MicroDato>
          <MicroDato etiqueta="Creado por">{calibrador.usuarioCreacion}</MicroDato>
          <MicroDato etiqueta="Modificado por">{calibrador.usuarioModificacion}</MicroDato>
        </div>
      </td>
      <td className="border-r border-line/60 px-4 py-3 align-top">
        <ChipEstado estado={calibrador.estado} />
        <div className="mt-2 border-t border-line/40 pt-1.5">
          <MicroDato etiqueta="Stock">{calibrador.stock} un.</MicroDato>
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <p className="text-[11px] font-medium leading-4 text-ink">{calibrador.ubicacion}</p>
        <div className="mt-2 border-t border-line/40 pt-1.5">
          <MicroDato etiqueta="Categoría">{calibrador.categoria}</MicroDato>
        </div>
      </td>
    </tr>
  );
}

export default function PaginaCalibradores() {
  return (
    <div className="min-h-dvh bg-canvas px-5 pb-12 pt-8 text-ink sm:px-8 lg:px-10">
      <header className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-muted sm:text-[13px]">
            Análisis QC / Calibradores
          </p>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-[34px]">
            Calibradores
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">
            Inventario de calibradores del laboratorio: vigencia, stock y ubicación física por categoría.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <span className="inline-flex h-8 items-center justify-center rounded-full bg-status-info-soft px-3 text-[11px] font-semibold text-status-info">
            {CALIBRADORES.length} calibradores
          </span>
        </div>
      </header>

      <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_36px_rgb(15_23_42_/_0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[54%]" />
              <col className="w-[21%]" />
              <col className="w-[25%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-line/60 bg-[#f8f9fb]">
                <th scope="col" className="border-r border-line/60 px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Calibrador
                </th>
                <th scope="col" className="border-r border-line/60 px-4 py-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Estado
                </th>
                <th scope="col" className="px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Ubicación en el laboratorio
                </th>
              </tr>
            </thead>
            <tbody>
              {CALIBRADORES.map((calibrador, indice) => (
                <FilaCalibrador
                  key={calibrador.id}
                  calibrador={calibrador}
                  esUltima={indice === CALIBRADORES.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
