import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EmployeeForm } from '../components/EmployeeForm';
import { useEmployee, useEmployees } from '../hooks/useEmployees';

export const EditEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);

  // Hook para obtener la información del empleado por ID
  const { data: employee, isLoading: isFetching, isError: fetchError } = useEmployee(numericId);

  // Hook para ejecutar la actualización
  const { updateEmployee, isUpdating } = useEmployees();

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Cargando datos del empleado...</span>
      </div>
    );
  }

  if (fetchError || !employee) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
        <p className="font-semibold">Error al cargar el empleado.</p>
        <p className="text-sm">El empleado solicitado no existe o no se pudo consultar.</p>
        <button
          onClick={() => navigate('/employees')}
          className="mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-colors"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Empleado #{employee.id}
        </h1>
        <p className="text-sm text-gray-500">
          Actualiza la información laboral o salarial de {employee.firstName} {employee.lastName}.
        </p>
      </div>

      <EmployeeForm
        initialData={employee}
        isLoading={isUpdating}
        onSubmit={async (dto) => {
          await updateEmployee({ id: numericId, dto });
          navigate('/employees');
        }}
      />
    </div>
  );
};