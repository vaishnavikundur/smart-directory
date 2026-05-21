import client from './client';
import type { AuthResponse, LoginData, RegisterData, User } from '@/types';

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await client.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await client.post('/auth/logout');
  },

  updatePreferences: async (prefs: User['preferences']): Promise<User> => {
    const response = await client.patch<User>('/auth/preferences', prefs);
    return response.data;
  },
};
