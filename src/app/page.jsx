import LayoutAdministracion from "./admin/layout";
import LaboratoriosClinicos from "./admin/LaboratorioClinico/page";

export default function PaginaInicio() {
  return (
    <LayoutAdministracion>
      <LaboratoriosClinicos />
    </LayoutAdministracion>
  );
}
