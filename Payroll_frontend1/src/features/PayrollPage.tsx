import React, { useState } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import { StatCard } from '../components/common/StatCard';
import { formatCurrency, getEmployeeTypeName } from '../utils/formatters';
import type { PayrollEmployee } from '../types/payroll.types';

export const PayrollPage: React.FC = () => {
  const {
    receipts,
    payrollSummary,
    isLoadingReceipts,
    isErrorReceipts,
    refetchReceipts,
    downloadPdf,
  } = usePayroll();

  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const handleDownloadPdf = async (employeeId: number) => {
    try {
      setDownloadingId(employeeId);
      await downloadPdf(employeeId);
    } catch (error) {
      console.error('Error descargando el PDF:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Nómina y Recibos de Pago
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reporte consolidado de salarios y ganancias devengadas.
          </p>
        </div>

        <button
          onClick={() => refetchReceipts()}
          disabled={isLoadingReceipts}
          className="w-full sm:w-auto bg-[rgba(13,48,72,0.9)] hover:bg-[#0d3048] text-white font-medium px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingReceipts ? 'Actualizando...' : 'Actualizar Reporte'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Total Empleados"
          value={payrollSummary.totalEmployees}
        />
        <StatCard
          label="Monto Total de Nómina"
          value={formatCurrency(payrollSummary.totalPayrollAmount)}
          variant="success"
        />
      </div>

      {/* Tabla Responsiva */}
      {!isLoadingReceipts && !isErrorReceipts && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-3.5">Empleado</th>
                <th className="p-3.5">Departamento</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5">Salario Base</th>
                <th className="p-3.5 text-right">Ganancias Calculadas</th>
                <th className="p-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receipts.map((employee: PayrollEmployee) => (
                <tr key={employee.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-medium text-slate-900">
                    <div>{employee.firstName} {employee.lastName}</div>
                    <div className="text-xs text-slate-400 font-normal">
                      NSS: {employee.socialSecurityNumber}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600">{employee.department}</td>
                  <td className="p-3.5 text-slate-600">
                    {getEmployeeTypeName(employee.employeeType)}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {formatCurrency(employee.baseSalary)}
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600 text-right">
                    {formatCurrency(employee.calculatedEarnings)}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleDownloadPdf(employee.id)}
                      disabled={downloadingId === employee.id}
                      className="text-xs text-blue-600 hover:text-blue-800 border border-slate-300 hover:border-blue-400 px-3 py-1.5 rounded bg-white transition-all disabled:opacity-50"
                    >
                      {downloadingId === employee.id ? 'Guardando...' : 'Descargar PDF'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};