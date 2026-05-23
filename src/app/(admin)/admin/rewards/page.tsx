'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminService } from '@/services/admin.service';
import { Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Reward } from '@/types';

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRewards();
  }, [page]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await adminService.getRewards(page, 20);
      setRewards(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
        <p className="text-gray-600 mt-1">View all distributed rewards</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Reward History
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({rewards.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rewards.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Week #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Credit Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{reward.user?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{reward.user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          Week {reward.weekNumber}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ₹{reward.amount}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-500" />
                            {format(new Date(reward.rewardDate), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">
                            {reward.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
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
              <p className="text-gray-500">No rewards found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
