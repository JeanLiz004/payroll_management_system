import { apiClient } from '../../../services/apiClient';
import { Employee, CreateEmployeeDto } from '../types/employee.types';

export const employeeApi = {
  getAll: async (params?: { name?: string; department?: string; active?: boolean }) => {
    const { data } = await apiClient.get<Employee[]>('/Employees', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Employee>(`/Employees/${id}`);
    return data;
  },

  create: async (dto: CreateEmployeeDto) => {
    const { data } = await apiClient.post<Employee>('/Employees', dto);
    return data;
  },

  update: async (id: number, dto: Partial<CreateEmployeeDto>) => {
    const { data } = await apiClient.put<Employee>(`/Employees/${id}`, { id, ...dto });
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/Employees/${id}`);
  },
};