'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserStore } from '@/store/user.store';
import { Wallet, TrendingUp, ArrowDownLeft, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';
import type { Reward } from '@/types';

export default function WalletPage() {
  const { dashboard, loading, fetchDashboard } = useUserStore();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardsLoading, setRewardsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchRewards();
  }, [page]);

  const fetchRewards = async () => {
    try {
      setRewardsLoading(true);
      const response = await fetch(`/api/v1/wallet/rewards?page=${page}&limit=10`);
      const data = await response.json();
      if (data.success) {
        setRewards(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error('Failed to fetch rewards');
    } finally {
      setRewardsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>

      {/* Wallet Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet size={18} />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{dashboard?.wallet.availableBalance || 0}
            </div>
            <p className="text-xs text-blue-100 mt-1">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award size={18} />
              Total Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboard?.wallet.totalRewards || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime rewards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowDownLeft size={18} />
              Total Withdrawn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboard?.wallet.totalWithdrawn || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Successfully withdrawn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp size={18} />
              Reward Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.rewardCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Weekly rewards received</p>
          </CardContent>
        </Card>
      </div>

      {/* Reward Progress */}
      {dashboard?.user.isEligibleForReward && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award size={20} />
              Reward Progress (₹500/week for 100 weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Weeks Completed</span>
                <span className="font-semibold">
                  {dashboard?.rewardCount || 0} / 100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{
                    width: `${Math.min(((dashboard?.rewardCount || 0) / 100) * 100, 100)}%`,
                  }}
                >
                  {dashboard?.rewardCount || 0}%
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Earned: ₹{dashboard?.totalRewards || 0}</span>
                <span>Target: ₹50,000</span>
              </div>
              <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                💡 You earn ₹500 every week. Total potential: ₹50,000 over 100 weeks!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reward History */}
      <Card>
        <CardHeader>
          <CardTitle>Reward History</CardTitle>
        </CardHeader>
        <CardContent>
          {rewardsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : rewards.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rewards.map((reward, index) => (
                      <TableRow key={reward.id}>
                        <TableCell className="font-medium">
                          Week {(page - 1) * 10 + index + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ₹{reward.amount}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-500" />
                            {format(new Date(reward.creditDate), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            Credited
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, rewards.length)} rewards
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No rewards yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Rewards are generated weekly after eligibility
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
