// Utilidad basica para combinar clases de Tailwind (estilo cn de shadcn).
export function cn(...clases) {
  return clases.filter(Boolean).join(" ");
}
