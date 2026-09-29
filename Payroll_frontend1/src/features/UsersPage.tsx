import React, { useState } from 'react';
import { useUsers } from '../hooks/useManagement';
import type { User } from '../types/management.types';

export const UsersPage: React.FC = () => {
  const { users, isLoading, isError, createUser, updateUser, deleteUser } = useUsers();

  // Create Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin');

  // Modal States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Edit Form Fields
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('Admin');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    try {
      await createUser({ username, password, role });
      setUsername('');
      setPassword('');
      setRole('Admin');
    } catch (err) {
      alert('Error al crear el usuario.');
    }
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditPassword(''); // Keep blank unless updating
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser({
        id: editingUser.id,
        dto: {
          username: editUsername,
          role: editRole,
          ...(editPassword ? { password: editPassword } : {}),
        },
      });
      setEditingUser(null);
    } catch (err) {
      alert('Error al actualizar el usuario.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser(deletingUser.id);
      setDeletingUser(null);
    } catch (err) {
      alert('Error al eliminar el usuario.');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>

      {/* Formulario de Creación */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded-md shadow border border-gray-200 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre de Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej. admin"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            required
          />
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            required
          />
        </div>
        <div className="w-44">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="HR">HR</option>
            <option value="PayrollManager">PayrollManager</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded">
          Crear Usuario
        </button>
      </form>

      {/* Tabla */}
      {isLoading ? (
        <p className="text-gray-500">Cargando usuarios...</p>
      ) : isError ? (
        <p className="text-red-600">Error al cargar la lista de usuarios.</p>
      ) : (
        <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Usuario</th>
                <th className="p-3">Rol</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3 text-gray-500">{u.id}</td>
                  <td className="p-3 font-medium text-gray-800">{u.username}</td>
                  <td className="p-3 text-gray-600">
                    <span className="bg-slate-100 text-slate-800 text-xs px-2 py-0.5 rounded font-medium">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeletingUser(u)}
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

      {/* Modal de Edición */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Editar Usuario</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre de Usuario</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Nueva Contraseña <span className="text-gray-400 font-normal">(dejar en blanco para conservar)</span>
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Rol</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
                >
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                  <option value="HR">HR</option>
                  <option value="PayrollManager">PayrollManager</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-semibold hover:bg-indigo-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm p-6 text-center">
            <h3 className="text-base font-bold text-gray-900 mb-2">¿Eliminar usuario?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. Se eliminará al usuario <span className="font-semibold">{deletingUser.username}</span>.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};