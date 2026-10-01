import React, { useState } from 'react';
import { usePayrollReport } from '../hooks/useManagement';
import type { PayrollReportEmployee } from '../types/management.types';

export const PayrollReportPage: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const {
    employees,
    totalEmployees,
    totalPayrollAmount,
    isLoading,
    isError,
    refetch,
  } = usePayrollReport({ startDate, endDate });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(val ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reporte Consolidado de Nómina</h1>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md shadow border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Empleados</p>
          <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow border border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase">Monto Total de Nómina</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPayrollAmount)}</p>
        </div>
      </div>

      {/* Filtro por rango de fecha */}
      <div className="bg-white p-4 rounded-md shadow border border-gray-200 flex gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
        </div>
        <button
          onClick={() => refetch()}
          className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm px-4 py-2 rounded"
        >
          Filtrar
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Cargando reporte...</p>
      ) : isError ? (
        <p className="text-red-600">Error al obtener los datos del reporte.</p>
      ) : (
        <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-3">Empleado</th>
                <th className="p-3">Cédula / SSN</th>
                <th className="p-3">Departamento</th>
                <th className="p-3">Sueldo Base</th>
                <th className="p-3 font-semibold text-right">Ganancias Calculadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.length > 0 ? (
                employees.map((emp: PayrollReportEmployee) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="p-3 text-gray-600">{emp.socialSecurityNumber}</td>
                    <td className="p-3 text-gray-600">{emp.department}</td>
                    <td className="p-3 text-gray-800">{formatCurrency(emp.baseSalary)}</td>
                    <td className="p-3 font-semibold text-green-700 text-right">
                      {formatCurrency(emp.calculatedEarnings)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No hay registros de reporte disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};