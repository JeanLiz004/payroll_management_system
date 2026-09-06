import React, { useEffect, useState } from 'react';
import { empleadosService } from '../api/empleadosService';
import type { ItemReporteNominaDto } from '../types/empleado';

export const ReporteNomina: React.FC = () => {
  const [reporte, setReporte] = useState<ItemReporteNominaDto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);
        const data = await empleadosService.getReporteNomina();
        setReporte(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al conectar con la API de Nómina');
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, []);

  if (cargando) return <div className="p-4 text-center">Cargando datos de nómina...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Reporte Semanal de Nómina</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Empleado</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Detalle del Cálculo</th>
              <th className="p-3 text-right">Pago Semanal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reporte.map((item) => (
              <tr key={item.empleadoId} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-600">{item.empleadoId}</td>
                <td className="p-3 font-semibold text-slate-900">{item.nombreCompleto}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {item.tipoEmpleado}
                  </span>
                </td>
                <td className="p-3 text-slate-600">{item.detalleCalculo}</td>
                <td className="p-3 text-right font-bold text-emerald-600">
                  ${item.pagoSemanal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};