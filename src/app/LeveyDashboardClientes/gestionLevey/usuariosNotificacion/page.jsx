"use client";

import React from 'react';

const mockResponsables = [
    { id: 1, nombre: "Carlos", apellido: "Fuentes", rut: "12.345.678-9", correo: "carlos.fuentes@lab.cl", telefono: "+56 9 1234 5678", estado: "Activo" },
    { id: 2, nombre: "Elena", apellido: "Rojas", rut: "15.987.654-3", correo: "e.rojas@medica.cl", telefono: "+56 9 8765 4321", estado: "Inactivo" },
    { id: 3, nombre: "Ricardo", apellido: "Soto", rut: "18.222.333-4", correo: "rsoto@clinica.cl", telefono: "+56 9 5555 0000", estado: "Activo" },
    { id: 4, nombre: "Sofía", apellido: "Mendoza", rut: "10.111.222-3", correo: "sofia.m@hospital.cl", telefono: "+56 9 4444 1111", estado: "Activo" },
    { id: 5, nombre: "Diego", apellido: "Pérez", rut: "14.555.666-7", correo: "diego.p@servicios.cl", telefono: "+56 9 3333 2222", estado: "Inactivo" },
];

export default function ResponsablesLaboratorio() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Responsables de <span className="text-purple-600">Laboratorio</span>
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Gestión y control de los responsables asignados a las instalaciones.
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <button className="bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 shadow-sm active:scale-95">
                            + Nuevo Responsable
                        </button>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
<thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nombre y Apellido</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">RUT</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Contacto</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                                </thead>
                            <tbody className="divide-y divide-gray-50">
                            {mockResponsables.map((resp) => (
                                <tr key={resp.id} className="hover:bg-purple-50/30 transition-colors duration-200 group">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-500 w-16">#{resp.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900">{resp.nombre} {resp.apellido}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{resp.rut}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-900">{resp.correo}</span>
                                            <span className="text-xs text-gray-400">{resp.telefono}</span>
                                        </div>
                                    </td>
<td className="px-6 py-4 text-center">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${resp.estado === 'Activo' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${resp.estado === 'Activo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                              {resp.estado}
                                          </span>
                                      </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-all active:scale-95 shadow-sm">
                                            Editar
                                        </button>
                                        {resp.estado === 'Activo' ? (
                                            <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 transition-all active:scale-95 border border-purple-100">
                                                Desactivar
                                            </button>
                                        ) : (
                                            <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-all active:scale-95 border border-green-100">
                                                Activar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer / Pagination Mock */}
                <div className="mt-6 flex items-center justify-between text-sm text-gray-500 px-2">
                    <p>Mostrando {mockResponsables.length} responsables</p>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 rounded border border-gray-200 hover:bg-white transition-colors disabled:opacity-50" disabled>Anterior</button>
                        <button className="px-3 py-1 rounded border border-gray-200 bg-black text-white">1</button>
                        <button className="px-3 py-1 rounded border border-gray-200 hover:bg-white transition-colors">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}