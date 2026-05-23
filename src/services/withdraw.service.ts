import api from './api';
import { ApiResponse, WithdrawRequest } from '@/types';

export const withdrawService = {
  request: async (amount: number, upiId: string) => {
    const response = await api.post<ApiResponse<WithdrawRequest>>('/withdraws', {
      amount,
      upiId,
    });
    return response.data;
  },

  getMyWithdraws: async (page = 1, limit = 10, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });
    const response = await api.get<ApiResponse<WithdrawRequest[]>>(
      `/withdraws?${params}`
    );
    return response.data;
  },
};
