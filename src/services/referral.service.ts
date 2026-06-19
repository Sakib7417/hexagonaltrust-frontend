import api from './api';
import { ApiResponse, ReferralInfo, ReferralNode, UserWithReferrals } from '@/types';

export const referralService = {
  // Get my referral info (user)
  getMyReferralInfo: async () => {
    const response = await api.get<ApiResponse<ReferralInfo>>('/user/referrals');
    return response.data;
  },

  // Get my downline tree (user)
  getMyDownline: async () => {
    const response = await api.get<ApiResponse<ReferralNode>>('/user/referrals/downline');
    return response.data;
  },

  // Get all referrals (admin)
  getAllReferrals: async (page = 1, limit = 10, search?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    const response = await api.get<ApiResponse<UserWithReferrals[]>>(
      `/admin/referrals?${params}`
    );
    return response.data;
  },

  // Get user's referral tree (admin)
  getUserReferralTree: async (userId: string) => {
    const response = await api.get<ApiResponse<{
      user: any;
      tree: ReferralNode;
      totalDownline: number;
    }>>(`/admin/referrals/${userId}`);
    return response.data;
  },
};
