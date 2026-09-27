import { apiClient } from '../../../services/apiClient';
import type { LoginResponse } from '../types/auth.types';

export const authApi = {
  login: async (username: string, passwordHash: string): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/Auth/login', {
      username,
      password: passwordHash,
    });
    return data;
  },
};