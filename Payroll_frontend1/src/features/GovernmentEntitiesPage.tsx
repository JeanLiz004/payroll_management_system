import React, { useState } from 'react';
import { useGovernmentEntities } from '../hooks/useManagement';
import type { GovernmentEntity } from '../types/management.types';

export const GovernmentEntitiesPage: React.FC = () => {
  const { entities, isLoading, isError, createEntity, updateEntity, deleteEntity } = useGovernmentEntities();

  // Form State for Creation
  const [name, setName] = useState('');
  const [rnc, setRnc] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [description, setDescription] = useState('');

  // Modal States
  const [editingEntity, setEditingEntity] = useState<GovernmentEntity | null>(null);
  const [deletingEntity, setDeletingEntity] = useState<GovernmentEntity | null>(null);

  // Edit Form Fields
  const [editName, setEditName] = useState('');
  const [editRnc, setEditRnc] = useState('');
  const [editDiscountPercentage, setEditDiscountPercentage] = useState<number>(0);
  const [editDescription, setEditDescription] = useState('');

  // Handlers
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rnc) return;
    try {
      await createEntity({ name, rnc, discountPercentage, description });
      setName('');
      setRnc('');
      setDiscountPercentage(0);
      setDescription('');
    } catch (err) {
      alert('Error al registrar la entidad.');
    }
  };

  const handleOpenEdit = (entity: GovernmentEntity) => {
    setEditingEntity(entity);
    setEditName(entity.name);
    setEditRnc(entity.rnc);
    setEditDiscountPercentage(entity.discountPercentage);
    setEditDescription(entity.description || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntity) return;

    try {
      await updateEntity({
        id: editingEntity.id,
        dto: {
          name: editName,
          rnc: editRnc,
          discountPercentage: editDiscountPercentage,
          description: editDescription,
        },
      });
      setEditingEntity(null);
    } catch (err) {
      alert('Error al actualizar la entidad.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEntity) return;
    try {
      await deleteEntity(deletingEntity.id);
      setDeletingEntity(null);
    } catch (err) {
      alert('Error al eliminar la entidad.');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-900">Entidades Gubernamentales</h1>

      {/* Formulario de Creación */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded-md shadow border border-gray-200 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: DGII, TSS"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            required
          />
        </div>
        <div className="w-32">
          <label className="block text-xs font-semibold text-gray-600 mb-1">RNC</label>
          <input
            type="text"
            value={rnc}
            onChange={(e) => setRnc(e.target.value)}
            placeholder="101000101"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            required
          />
        </div>
        <div className="w-32">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Descuento (%)</label>
          <input
            type="number"
            step="0.01"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
            required
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción opcional"
            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
          />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded">
          Guardar Entidad
        </button>
      </form>

      {/* Tabla */}
      {isLoading ? (
        <p className="text-gray-500">Cargando entidades...</p>
      ) : isError ? (
        <p className="text-red-600">Error al obtener las entidades.</p>
      ) : (
        <div className="bg-white rounded-md shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">RNC</th>
                <th className="p-3">Descuento (%)</th>
                <th className="p-3">Descripción</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entities.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">{item.name}</td>
                  <td className="p-3 text-gray-600">{item.rnc}</td>
                  <td className="p-3 text-gray-600">{item.discountPercentage}%</td>
                  <td className="p-3 text-gray-500">{item.description}</td>
                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setDeletingEntity(item)}
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
      {editingEntity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Editar Entidad Gubernamental</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">RNC</label>
                <input
                  type="text"
                  value={editRnc}
                  onChange={(e) => setEditRnc(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Descuento (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editDiscountPercentage}
                  onChange={(e) => setEditDiscountPercentage(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Descripción</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEntity(null)}
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
      {deletingEntity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm p-6 text-center">
            <h3 className="text-base font-bold text-gray-900 mb-2">¿Eliminar entidad?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción no se puede deshacer. Se eliminará <span className="font-semibold">{deletingEntity.name}</span>.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingEntity(null)}
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