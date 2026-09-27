import { apiClient } from './apiClient';
import type {
  GovernmentEntity,
  CreateGovernmentEntityDto,
  User,
  CreateUserDto,
  PayrollReportFilter,
  PayrollReportItem,
} from '../types/management.types';

export const managementService = {
  // Government Entities
  getGovernmentEntities: async (): Promise<GovernmentEntity[]> => {
    const { data } = await apiClient.get<GovernmentEntity[]>('/GovernmentEntities');
    return data;
  },

  createGovernmentEntity: async (dto: CreateGovernmentEntityDto): Promise<GovernmentEntity> => {
    const { data } = await apiClient.post<GovernmentEntity>('/GovernmentEntities', dto);
    return data;
  },

  updateGovernmentEntity: async (id: number, dto: CreateGovernmentEntityDto): Promise<GovernmentEntity> => {
    const { data } = await apiClient.put<GovernmentEntity>(`/GovernmentEntities/${id}`, dto);
    return data;
  },

  deleteGovernmentEntity: async (id: number): Promise<void> => {
    await apiClient.delete(`/GovernmentEntities/${id}`);
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/Users');
    return data;
  },

  createUser: async (dto: CreateUserDto): Promise<User> => {
    const { data } = await apiClient.post<User>('/Users', dto);
    return data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/Users/${id}`);
  },

  // Reports
  getPayrollReport: async (filter?: PayrollReportFilter): Promise<PayrollReportItem[]> => {
    const { data } = await apiClient.get<PayrollReportItem[]>('/Reports/payroll', { params: filter });
    return data;
  },
};