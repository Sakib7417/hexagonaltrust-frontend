'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Send,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function DashboardPage() {
  const router = useRouter();
  const { dashboard, loading, fetchDashboard } = useUserStore();
  const [recentContributions, setRecentContributions] = useState<any[]>([]);
  const [recentWithdraws, setRecentWithdraws] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

    if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
      case 'blocked':
      case 'inactive':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {dashboard?.user.name}!</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/contribution')} className="gap-2">
            <Plus size={18} />
            Make Contribution
          </Button>
          <Button
            onClick={() => router.push('/withdraw')}
            variant="outline"
            className="gap-2"
          >
            <Send size={18} />
            Request Withdraw
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Account Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge
              className={getStatusColor(dashboard?.user.status || 'inactive')}
            >
              {dashboard?.user.status || 'Inactive'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {dashboard?.user.status === 'active'
                ? 'Your account is active'
                : 'Waiting for admin approval'}
            </p>
          </CardContent>
        </Card>

        {/* Wallet Balance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboard?.wallet.availableBalance || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

        {/* Total Rewards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboard?.totalRewards || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {dashboard?.rewardCount || 0} weekly rewards
            </p>
          </CardContent>
        </Card>

        {/* Total Contribution */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contributed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboard?.totalContribution || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all contributions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Contributions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.recentContributions && dashboard.recentContributions.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentContributions.slice(0, 5).map((contrib: any) => (
                  <div
                    key={contrib.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">₹{contrib.amount}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(contrib.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(contrib.status)}>
                      {contrib.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No contributions yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Withdrawals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.recentWithdraws && dashboard.recentWithdraws.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recentWithdraws.slice(0, 5).map((withdraw: any) => (
                  <div
                    key={withdraw.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">₹{withdraw.amount}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(withdraw.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(withdraw.status)}>
                      {withdraw.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No withdrawals yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reward Progress */}
      {dashboard?.user.isEligibleForReward && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reward Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Weeks Completed</span>
                <span className="font-medium">
                  {dashboard?.rewardCount || 0} / 100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(((dashboard?.rewardCount || 0) / 100) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Total earned: ₹{dashboard?.totalRewards || 0} / ₹50,000
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
