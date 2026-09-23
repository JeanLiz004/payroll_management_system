import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { Login } from '../features/auth/components/Login';
import { EmployeesPage } from '../features/employees/pages/EmployeesPage';
import { EmployeeForm } from '../features/employees/components/EmployeeForm';
import { employeeApi } from '../features/employees/services/employeeApi';
import { useNavigate } from 'react-router-dom';

// Wrapper para el formulario de creación
const CreateEmployeePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <EmployeeForm
      onSubmit={async (dto) => {
        await employeeApi.create(dto);
        navigate('/employees');
      }}
    />
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rutas Protegidas que requieren JWT */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/new" element={<CreateEmployeePage />} />
          
          {/* Redirección por defecto para rutas protegidas */}
          <Route path="/" element={<Navigate to="/employees" replace />} />
        </Route>
      </Route>

      {/* Ruta por defecto para URLs no encontradas */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};