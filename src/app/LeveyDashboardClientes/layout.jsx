import Sidebar from "../Sidebar";

export default function LayoutDashboardClientes({ children }) {
  return (
    <div className="flex min-h-dvh bg-[#f5f6f8] text-ink">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
