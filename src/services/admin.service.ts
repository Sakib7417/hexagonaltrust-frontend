import api from './api';
import {
  ApiResponse,
  AdminDashboardStats,
  User,
  Contribution,
  WithdrawRequest,
  Reward,
  AdminSettings,
} from '@/types';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard');
    return response.data.data;
  },

  getUsers: async (page = 1, limit = 10, status?: string, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(search && { search }),
    });
    const response = await api.get<ApiResponse<User[]>>(`/admin/users?${params}`);
    return response.data.data;
  },

  getUser: async (id: string) => {
    const response = await api.get<ApiResponse<User>>(`/admin/users/${id}`);
    return response.data.data;
  },

  blockUser: async (id: string) => {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${id}/block`);
    return response.data.data;
  },

  unblockUser: async (id: string) => {
    const response = await api.put<ApiResponse<User>>(`/admin/users/${id}/unblock`);
    return response.data.data;
  },

  getContributions: async (page = 1, limit = 10, status?: string, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(search && { search }),
    });
    const response = await api.get<ApiResponse<Contribution[]>>(
      `/admin/contributions?${params}`
    );
    return response.data.data;
  },

  approveContribution: async (id: string) => {
    const response = await api.put<ApiResponse<Contribution>>(
      `/admin/contributions/${id}/approve`
    );
    return response.data.data;
  },

  rejectContribution: async (id: string) => {
    const response = await api.put<ApiResponse<Contribution>>(
      `/admin/contributions/${id}/reject`
    );
    return response.data.data;
  },

  getWithdraws: async (page = 1, limit = 10, status?: string, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(search && { search }),
    });
    const response = await api.get<ApiResponse<WithdrawRequest[]>>(
      `/admin/withdraws?${params}`
    );
    return response.data.data;
  },

  approveWithdraw: async (id: string, paymentTransactionId: string) => {
    const response = await api.put<ApiResponse<WithdrawRequest>>(
      `/admin/withdraws/${id}/approve`,
      { paymentTransactionId }
    );
    return response.data.data;
  },

  rejectWithdraw: async (id: string) => {
    const response = await api.put<ApiResponse<WithdrawRequest>>(
      `/admin/withdraws/${id}/reject`
    );
    return response.data.data;
  },

  getRewards: async (page = 1, limit = 10, status?: string, date?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(date && { date }),
    });
    const response = await api.get<ApiResponse<Reward[]>>(
      `/admin/rewards?${params}`
    );
    return response.data.data;
  },

  getSettings: async () => {
    const response = await api.get<ApiResponse<AdminSettings>>('/admin/settings');
    return response.data.data;
  },

  updateSettings: async (upiId: string, qrCodeFile?: File) => {
    const formData = new FormData();
    formData.append('upiId', upiId);
    if (qrCodeFile) {
      formData.append('qrCode', qrCodeFile);
    }

    const response = await api.put<ApiResponse<AdminSettings>>('/admin/settings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
