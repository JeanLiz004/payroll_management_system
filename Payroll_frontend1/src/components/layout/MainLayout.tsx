import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      <header className="bg-slate-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/employees" className="text-xl font-bold tracking-tight text-blue-400">
              SB Payroll
            </Link>
            <nav className="flex space-x-4">
              <Link to="/employees" className="text-sm font-medium hover:text-blue-300 transition-colors">
                Empleados
              </Link>
              <Link to="/payroll" className="text-sm font-medium hover:text-blue-300 transition-colors">
                Nómina
              </Link>
              
              {/* Opciones Visibles Únicamente para Administradores */}
              {isAdmin && (
                <>
                  <Link to="/government-entities" className="text-sm font-medium hover:text-blue-300 transition-colors">
                    Entidades
                  </Link>
                  <Link to="/users" className="text-sm font-medium hover:text-blue-300 transition-colors">
                    Usuarios
                  </Link>
                </>
              )}

              <Link to="/reports" className="text-sm font-medium hover:text-blue-300 transition-colors">
                Reportes
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">
              Hola, <strong className="text-white">{user?.name || 'Usuario'}</strong>
              {user?.role && (
                <span className="ml-2 text-xs bg-slate-800 text-blue-300 px-2 py-0.5 rounded border border-slate-700">
                  {user.role}
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md font-semibold transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};