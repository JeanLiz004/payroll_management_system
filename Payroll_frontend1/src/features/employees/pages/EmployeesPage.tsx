import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeList } from '../components/EmployeeList';
import { employeeApi } from '../services/employeeApi';
import { Employee } from '../types/employee.types';

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (err: any) {
      setError('Error al cargar la lista de empleados.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await employeeApi.delete(id);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
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

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
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