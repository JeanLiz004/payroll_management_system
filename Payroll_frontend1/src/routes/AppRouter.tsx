import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { Login } from '../features/auth/components/Login';
import { EmployeesPage } from '../features/employees/pages/EmployeesPage';
import { CreateEmployeePage } from '../features/employees/pages/CreateEmployeePage';
import { EditEmployeePage } from '../features/employees/pages/EditEmployeePage';
import { PayrollPage } from '../features/PayrollPage';
import { GovernmentEntitiesPage } from '../features/GovernmentEntitiesPage';
import { UsersPage } from '../features/UsersPage';
import { PayrollReportPage } from '../features/PayrollReportPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Ruta Pública */}
      <Route path="/login" element={<Login />} />

      {/* Rutas Autenticadas Generales */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employees/new" element={<CreateEmployeePage />} />
          <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/reports" element={<PayrollReportPage />} />

          {/* Rutas Exclusivas para Administradores */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/government-entities" element={<GovernmentEntitiesPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/employees" replace />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};