import React from 'react';
import { Employee, EmployeeType } from '../types/employee.types';

interface EmployeeListProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  // Formateador de moneda (Dólares / Pesos)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Mapeo visual y de color para los tipos de empleado
  const getEmployeeTypeBadge = (type: EmployeeType) => {
    switch (type) {
      case EmployeeType.Salaried:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Asalariado
          </span>
        );
      case EmployeeType.Hourly:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Por Horas
          </span>
        );
      case EmployeeType.Commission:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Comisión Pura
          </span>
        );
      case EmployeeType.BasePlusCommission:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Base + Comisión
          </span>
        );
      default:
        return null;
    }
  };

  // Sumatoria total de la nómina
  const totalPayroll = employees.reduce(
    (acc, emp) => acc + (emp.calculatedEarnings || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 font-medium">
        Cargando listado de empleados...
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-lg font-bold text-gray-800">Nómina de Empleados</h2>
        <div className="text-sm font-semibold text-gray-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
          Total Nómina Semanal:{' '}
          <span className="text-emerald-700 text-base font-bold ml-1">
            {formatCurrency(totalPayroll)}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold tracking-wider border-b border-gray-200">
              <th className="py-3 px-4">Empleado</th>
              <th className="py-3 px-4">Cédula / SSN</th>
              <th className="py-3 px-4">Departamento</th>
              <th className="py-3 px-4">Tipo</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-right">Ganancia Calculada</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-500">
                  No hay empleados registrados en el sistema.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{emp.socialSecurityNumber}</td>
                  <td className="py-3 px-4">{emp.department}</td>
                  <td className="py-3 px-4">{getEmployeeTypeBadge(emp.employeeType)}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${
                        emp.isActive ? 'bg-green-500' : 'bg-red-400'
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      {emp.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-gray-900">
                    {formatCurrency(emp.calculatedEarnings)}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(emp)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs transition-colors"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(emp.id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-xs transition-colors"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};