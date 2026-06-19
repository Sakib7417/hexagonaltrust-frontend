import api from './api';
import { ApiResponse, User } from '@/types';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    phone: string;
    country: string;
    password: string;
  }) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register',
      data
    );
    return response.data;
  },

  login: async (identifier: string, password: string) => {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      { identifier, password }
    );
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/user/profile');
    return response.data;
  },

  adminLogin: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ admin: any; token: string }>>(
      '/admin/login',
      { email, password }
    );
    return response.data;
  },
};
