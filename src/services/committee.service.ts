import api from './api';
import { ApiResponse } from '@/types';

export const committeeService = {
  // User endpoints
  getCommitteeStatus: async () => {
    const response = await api.get<ApiResponse<{ committee: 'NONE' | 'SUPER' | 'CORE' }>>(
      '/user/committee-status'
    );
    return response.data.data;
  },

  // Admin endpoints
  getCommitteeDashboard: async () => {
    const response = await api.get<ApiResponse<{
      superCommittee: {
        occupiedSlots: number;
        remainingSlots: number;
        maxSlots: number;
        members: any[];
      };
      coreCommittee: {
        occupiedSlots: number;
        remainingSlots: number;
        maxSlots: number;
        members: any[];
      };
    }>>('/admin/committee/dashboard');
    return response.data.data;
  },

  getSuperCommitteeMembers: async () => {
    const response = await api.get<ApiResponse<any[]>>('/admin/committee/super');
    return response.data.data;
  },

  getCoreCommitteeMembers: async () => {
    const response = await api.get<ApiResponse<any[]>>('/admin/committee/core');
    return response.data.data;
  },

  getCommitteeStatistics: async () => {
    const response = await api.get<ApiResponse<{
      totalUsers: number;
      committeeDistribution: {
        none: number;
        super: number;
        core: number;
      };
      superCommittee: {
        occupied: number;
        remaining: number;
        max: number;
        fillPercentage: number;
      };
      coreCommittee: {
        occupied: number;
        remaining: number;
        max: number;
        fillPercentage: number;
      };
      recentPromotions: any[];
    }>>('/admin/committee/statistics');
    return response.data.data;
  },

  getUserCommitteeDetails: async (userId: string) => {
    const response = await api.get<ApiResponse<{
      user: any;
      history: any[];
    }>>(`/admin/committee/user/${userId}`);
    return response.data.data;
  },
};
