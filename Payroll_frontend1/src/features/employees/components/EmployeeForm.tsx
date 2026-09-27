import React, { useState, useEffect } from 'react';
import { EmployeeType } from '../types/employee.types';
import type { CreateEmployeeDto, Employee } from '../types/employee.types';

interface EmployeeFormProps {
  initialValues?: Partial<CreateEmployeeDto> | Employee;
  initialData?: Employee; // Prop adicional para compatibilidad con EditEmployeePage
  onSubmit: (data: CreateEmployeeDto) => Promise<void>;
  isLoading?: boolean;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialValues,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  // Tomar el valor inicial de initialData o initialValues
  const data = initialData || initialValues;

  const [formData, setFormData] = useState<CreateEmployeeDto>({
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    socialSecurityNumber: data?.socialSecurityNumber || '',
    department: data?.department || '',
    isActive: data?.isActive ?? true,
    employeeType: data?.employeeType ?? EmployeeType.Salaried,
    weeklySalary: data?.weeklySalary || 0,
    hourlyRate: data?.hourlyRate || 0,
    hoursWorked: data?.hoursWorked || 0,
    grossSales: data?.grossSales || 0,
    commissionRate: data?.commissionRate || 0,
    baseSalary: data?.baseSalary || 0,
  });

  // Sincronizar el formulario cuando los datos se cargan desde la API (asíncrono)
  useEffect(() => {
    const currentData = initialData || initialValues;
    if (currentData) {
      setFormData({
        firstName: currentData.firstName || '',
        lastName: currentData.lastName || '',
        socialSecurityNumber: currentData.socialSecurityNumber || '',
        department: currentData.department || '',
        isActive: currentData.isActive ?? true,
        employeeType: currentData.employeeType ?? EmployeeType.Salaried,
        weeklySalary: currentData.weeklySalary || 0,
        hourlyRate: currentData.hourlyRate || 0,
        hoursWorked: currentData.hoursWorked || 0,
        grossSales: currentData.grossSales || 0,
        commissionRate: currentData.commissionRate || 0,
        baseSalary: currentData.baseSalary || 0,
      });
    }
  }, [initialData, initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = parseInt(e.target.value, 10) as EmployeeType;
    setFormData((prev) => ({
      ...prev,
      employeeType: newType,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold text-gray-800">
        {data ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
      </h2>

      {/* Datos Personales Base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cédula / SSN</label>
          <input
            type="text"
            name="socialSecurityNumber"
            value={formData.socialSecurityNumber}
            onChange={handleChange}
            required
            placeholder="001-0000000-0"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Departamento</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tipo de Empleado */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Empleado</label>
        <select
          name="employeeType"
          value={formData.employeeType}
          onChange={handleTypeChange}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={EmployeeType.Salaried}>Asalariado (Salaried)</option>
          <option value={EmployeeType.Hourly}>Por Horas (Hourly)</option>
          <option value={EmployeeType.Commission}>Comisión Pura (Commission)</option>
          <option value={EmployeeType.BasePlusCommission}>Base + Comisión (Base Plus Commission)</option>
        </select>
      </div>

      {/* CAMPOS DINÁMICOS SEGÚN EL TIPO SELECCIONADO */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-md space-y-4">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
          Parámetros de Nómina
        </h3>

        {/* 0 - Asalariado */}
        {formData.employeeType === EmployeeType.Salaried && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Salario Semanal</label>
            <input
              type="number"
              step="0.01"
              name="weeklySalary"
              value={formData.weeklySalary}
              onChange={handleChange}
              required
              className="mt-1 w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* 1 - Por Horas */}
        {formData.employeeType === EmployeeType.Hourly && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tarifa por Hora ($)</label>
              <input
                type="number"
                step="0.01"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horas Trabajadas</label>
              <input
                type="number"
                step="0.1"
                name="hoursWorked"
                value={formData.hoursWorked}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {/* 2 - Comisión Pura */}
        {formData.employeeType === EmployeeType.Commission && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ventas Brutas ($)</label>
              <input
                type="number"
                step="0.01"
                name="grossSales"
                value={formData.grossSales}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tasa de Comisión (Ej: 0.05 para 5%)</label>
              <input
                type="number"
                step="0.001"
                name="commissionRate"
                value={formData.commissionRate}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {/* 3 - Base + Comisión */}
        {formData.employeeType === EmployeeType.BasePlusCommission && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Salario Base ($)</label>
              <input
                type="number"
                step="0.01"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ventas Brutas ($)</label>
              <input
                type="number"
                step="0.01"
                name="grossSales"
                value={formData.grossSales}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tasa Comisión (Ej: 0.05)</label>
              <input
                type="number"
                step="0.001"
                name="commissionRate"
                value={formData.commissionRate}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
      </div>

      {/* Estado del Empleado */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 font-medium">
          Empleado Activo
        </label>
      </div>

      {/* Acciones */}
      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Guardando...' : 'Guardar Empleado'}
        </button>
      </div>
    </form>
  );
};