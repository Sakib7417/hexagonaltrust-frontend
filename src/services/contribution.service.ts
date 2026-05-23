import api from './api';
import { ApiResponse, Contribution, Wallet, Reward } from '@/types';

export const contributionService = {
  submit: async (amount: number, transactionId: string) => {
    const response = await api.post<ApiResponse<Contribution>>('/contributions', {
      amount,
      transactionId,
    });
    return response.data;
  },

  getMyContributions: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    const response = await api.get<ApiResponse<Contribution[]>>(
      `/contributions?${params}`
    );
    return response.data;
  },

  getPaymentSettings: async () => {
    const response = await api.get<ApiResponse<{ upiId: string; qrCodeImage: string }>>(
      '/user/payment-settings'
    );
    return response.data;
  },
};

export const walletService = {
  getWallet: async () => {
    const response = await api.get<ApiResponse<Wallet>>('/wallet');
    return response.data;
  },

  getRewardHistory: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get<ApiResponse<Reward[]>>(
      `/wallet/rewards?${params}`
    );
    return response.data;
  },
};

export const rewardService = {
  getMyRewards: async (page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await api.get<ApiResponse<Reward[]>>(
      `/rewards?${params}`
    );
    return response.data;
  },
};
