export default function ReglasDeWestgard() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Reglas de Westgard
            </h1>
            <p className="text-gray-500 mt-1 text-base font-normal">
              Configuración y gestión de las reglas aplicadas al control de calidad.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
              Total: 3 reglas
            </div>
          </div>
        </header>


        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre de funcionalidad
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Rule 1 */}
                <tr className="hover:bg-gray-50/50 transition-colors duration-200 group">
                  <td className="px-6 py-4 text-sm font-medium text-gray-400">#01</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">Regla 1s</td>
                  <td className="px-6 py-4 text-sm text-gray-600 leading-relaxed">
                    Control de desviación básica en el proceso analítico.
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                      Activa
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-red-600 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-50">
                      Desactivar
                    </button>
                  </td>
                </tr>

                {/* Rule 2 */}
                <tr className="hover:bg-gray-50/50 transition-colors duration-200 group">
                  <td className="px-6 py-4 text-sm font-medium text-gray-400">#02</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">Regla 2s</td>
                  <td className="px-6 py-4 text-sm text-gray-600 leading-relaxed">
                    Detección de error sistemático en mediciones consecutivas.
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
                      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>
                      Inactiva
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-emerald-600 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-emerald-50">
                      Activar
                    </button>
                  </td>
                </tr>

                {/* Rule 3 */}
                <tr className="hover:bg-gray-50/50 transition-colors duration-200 group">
                  <td className="px-6 py-4 text-sm font-medium text-gray-400">#03</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">Regla R4s</td>
                  <td className="px-6 py-4 text-sm text-gray-600 leading-relaxed">
                    Error aleatorio detectado por diferencia entre controles.
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
                      Activa
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-red-600 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-50">
                      Desactivar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer/Info Section */}
        <div className="text-center text-gray-400 text-xs uppercase tracking-widest font-medium">
          Sistema de Control de Calidad Levey-Jennings v2.0
        </div>
      </div>
    </div>
  );
}
