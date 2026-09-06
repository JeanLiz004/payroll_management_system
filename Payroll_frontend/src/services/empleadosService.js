import api from '../api/axios';

// Obtener la lista de empleados (Requiere [Authorize] en el controlador)
export const getEmpleados = async () => {
  const response = await api.get('/Empleados');
  return response.data;
};