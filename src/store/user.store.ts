import { create } from 'zustand';
import { userService } from '@/services/user.service';
import { DashboardStats, Contribution, WithdrawRequest, Reward } from '@/types';

interface UserState {
  dashboard: DashboardStats | null;
  contributions: Contribution[];
  withdraws: WithdrawRequest[];
  rewards: Reward[];
  loading: boolean;
  fetchDashboard: () => Promise<void>;
  fetchContributions: (page?: number, limit?: number, status?: string) => Promise<void>;
  fetchWithdraws: (page?: number, limit?: number, status?: string) => Promise<void>;
  fetchRewards: (page?: number, limit?: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  dashboard: null,
  contributions: [],
  withdraws: [],
  rewards: [],
  loading: false,
  fetchDashboard: async () => {
    try {
      set({ loading: true });
      const response = await userService.getDashboard();
      set({ dashboard: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  fetchContributions: async (page = 1, limit = 10, status) => {
    try {
      set({ loading: true });
      const response = await userService.getContributions(page, limit, status);
      set({ contributions: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  fetchWithdraws: async (page = 1, limit = 10, status) => {
    try {
      set({ loading: true });
      const response = await userService.getWithdraws(page, limit, status);
      set({ withdraws: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  fetchRewards: async (page = 1, limit = 10) => {
    try {
      set({ loading: true });
      const response = await userService.getRewards(page, limit);
      set({ rewards: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));
