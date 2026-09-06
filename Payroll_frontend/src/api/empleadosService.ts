import api from './axiosConfig';
import type { ItemReporteNominaDto, CrearEmpleadoDto } from '../types/empleado';

export const empleadosService = {
  getReporteNomina: async (): Promise<ItemReporteNominaDto[]> => {
    const response = await api.get<ItemReporteNominaDto[]>('/Empleados/reporte-nomina');
    return response.data;
  },

  crearEmpleado: async (dto: CrearEmpleadoDto): Promise<void> => {
    await api.post('/Empleados', dto);
  },
};