import RutaAdmin from "@/components/seguridad/RutaAdmin.jsx"
import NavbarCompartido from "../components/NavbarCompartido";

export default function LayoutAdministracion({ children }) {
    return (
        <RutaAdmin>
            <NavbarCompartido />
            <main className="min-h-dvh">
                {children}
            </main>
        </RutaAdmin>
    );
}
