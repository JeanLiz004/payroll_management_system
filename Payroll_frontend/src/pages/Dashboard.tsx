import React, { useState, useEffect } from 'react';
import { HomeIcon } from '../components/icons/HomeIcon';
import { themeColors } from '../theme';

interface Empleado {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  departamento: string;
  activo: boolean;
  tipo: string;
}

export const Dashboard: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroDepto, setFiltroDepto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  const cargarEmpleados = async () => {
    const params = new URLSearchParams();
    if (filtroNombre) params.append('nombre', filtroNombre);
    if (filtroDepto) params.append('departamento', filtroDepto);
    if (filtroEstado !== 'todos') params.append('activo', filtroEstado === 'activo' ? 'true' : 'false');

    const res = await fetch(`/api/empleados?${params.toString()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setEmpleados(data);
  };

  useEffect(() => {
    cargarEmpleados();
  }, [filtroNombre, filtroDepto, filtroEstado]);

  return (
    <div style={{ backgroundColor: themeColors.gray, minHeight: '100vh', padding: '20px' }}>
      <header style={{ backgroundColor: themeColors.blue, color: '#fff', padding: '15px 30px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <HomeIcon color="#fff" size={28} />
        <h1 style={{ margin: 0, fontSize: '20px' }}>Sistema de Gestión de Nómina</h1>
      </header>

      <section style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input 
          placeholder="Buscar por nombre..." 
          value={filtroNombre} 
          onChange={(e) => setFiltroNombre(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input 
          placeholder="Departamento..." 
          value={filtroDepto} 
          onChange={(e) => setFiltroDepto(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select 
          value={filtroEstado} 
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="todos">Todos los Estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </section>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: themeColors.blue, color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>Nombre</th>
            <th style={{ padding: '12px' }}>Apellido Paterno</th>
            <th style={{ padding: '12px' }}>Departamento</th>
            <th style={{ padding: '12px' }}>Tipo</th>
            <th style={{ padding: '12px' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((emp) => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{emp.nombre}</td>
              <td style={{ padding: '12px' }}>{emp.apellidoPaterno}</td>
              <td style={{ padding: '12px' }}>{emp.departamento}</td>
              <td style={{ padding: '12px' }}>{emp.tipo}</td>
              <td style={{ padding: '12px' }}>{emp.activo ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};