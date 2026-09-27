import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeList } from '../components/EmployeeList';
import { useEmployees } from '../hooks/useEmployees';
import type { Employee } from '../types/employee.types';

export const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { employees, isLoading, isError, deleteEmployee } = useEmployees();

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await deleteEmployee(id);
      } catch (err) {
        alert('No se pudo eliminar el empleado.');
      }
    }
  };

  const handleEdit = (employee: Employee) => {
    navigate(`/employees/edit/${employee.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h1>
        <button
          onClick={() => navigate('/employees/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md shadow text-sm transition-colors"
        >
          + Registrar Empleado
        </button>
      </div>

      {isError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          Ocurrió un error al cargar la lista de empleados desde la API.
        </div>
      )}

      <EmployeeList
        employees={employees}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};