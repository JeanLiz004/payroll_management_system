import React, { useState } from 'react';
import { useUsers } from '../hooks/useManagement';

export const UsersPage: React.FC = () => {
  const { users, isLoading, isError, createUser, deleteUser } = useUsers();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'HR' | 'PayrollManager'>('PayrollManager');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    try {
      await createUser({ name, email, role });
      setName('');
      setEmail('');
    } catch {
      alert('Error al crear el usuario.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md shadow border border-gray-200 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            required
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            required
          />
        </div>
        <div className="w-44">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
          >
            <option value="Admin">Administrador</option>
            <option value="HR">Recursos Humanos</option>
            <option value="PayrollManager">Nómina</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded">
          Crear Usuario
        </button>
      </form>

      {isLoading ? (
        <p className="text-gray-500">Cargando usuarios...</p>
      ) : isError ? (
        <p className="text-red-600">Error al cargar la lista de usuarios.</p>
      ) : (
        <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Rol</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="p-3 font-medium text-gray-800">{u.name}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3 text-gray-600">
                    <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded font-medium">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Eliminar
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