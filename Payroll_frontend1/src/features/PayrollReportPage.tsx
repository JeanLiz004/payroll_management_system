import React, { useState } from 'react';
import { usePayrollReport } from '../hooks/useManagement';

export const PayrollReportPage: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { reportData, isLoading, isError, refetch } = usePayrollReport({ startDate, endDate });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reporte Consolidados de Nómina</h1>
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
                <th className="p-3">Departamento</th>
                <th className="p-3">S. Bruto</th>
                <th className="p-3">TSS</th>
                <th className="p-3">ISR</th>
                <th className="p-3">S. Neto</th>
                <th className="p-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reportData.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 font-medium text-gray-800">{item.employeeName}</td>
                  <td className="p-3 text-gray-600">{item.department}</td>
                  <td className="p-3 text-gray-800">{formatCurrency(item.grossSalary)}</td>
                  <td className="p-3 text-red-600">-{formatCurrency(item.tssDeduction)}</td>
                  <td className="p-3 text-red-600">-{formatCurrency(item.isrDeduction)}</td>
                  <td className="p-3 font-semibold text-green-700">{formatCurrency(item.netSalary)}</td>
                  <td className="p-3 text-gray-500">{item.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};