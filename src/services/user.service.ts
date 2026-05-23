import api from './api';
import {
  ApiResponse,
  DashboardStats,
  Contribution,
  WithdrawRequest,
  Reward,
  User,
} from '@/types';

export const userService = {
  getDashboard: async () => {
    const response = await api.get<ApiResponse<DashboardStats>>('/user/dashboard');
    return response.data;
  },

  getContributions: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    const response = await api.get<ApiResponse<Contribution[]>>(
      `/user/contributions?${params}`
    );
    return response.data;
  },

  getWithdraws: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    const response = await api.get<ApiResponse<WithdrawRequest[]>>(
      `/user/withdraws?${params}`
    );
    return response.data;
  },

  getRewards: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get<ApiResponse<Reward[]>>(
      `/user/rewards?${params}`
    );
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/user/profile', data);
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put<ApiResponse<User>>('/user/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
