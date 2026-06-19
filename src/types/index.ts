export interface User {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  password?: string; // Optional: Only for admin view
  status: 'inactive' | 'active' | 'blocked';
  isEligibleForReward?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface Wallet {
  id: string;
  userId: string;
  totalRewards: number;
  availableBalance: number;
  totalWithdrawn: number;
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  id: string;
  userId: string;
  amount: number;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Reward {
  id: string;
  userId: string;
  amount: number;
  rewardDate: string;
  weekNumber: number;
  status: 'pending' | 'credited';
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  amount: number;
  upiId: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentTransactionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface AdminSettings {
  id: string;
  upiId: string;
  qrCodeImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  user: User;
  wallet: Wallet;
  totalContribution: number;
  contributionCount: number;
  totalRewards: number;
  rewardCount: number;
  pendingRewards: number;
  recentContributions?: Contribution[];
  recentWithdraws?: WithdrawRequest[];
}

export interface AdminDashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    blocked: number;
  };
  contributions: {
    total: number;
    pending: number;
    approved: number;
  };
  rewards: {
    totalDistributed: number;
  };
  withdraws: {
    total: number;
    pending: number;
    approved: number;
    totalAmount: number;
  };
}

// Referral Types
export interface ReferralInfo {
  myCode: string;
  directReferrals: User[];
  directCount: number;
  totalDownline: number;
}

export interface ReferralNode {
  user: {
    id: string;
    uniqueId: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
  };
  level: number;
  children: ReferralNode[];
}

export interface UserWithReferrals {
  id: string;
  uniqueId: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  referredBy?: {
    id: string;
    uniqueId: string;
    name: string;
  } | null;
  directReferrals: number;
  totalDownline: number;
}
