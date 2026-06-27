'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminService } from '@/services/admin.service';
import { Award, Calendar, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Reward } from '@/types';

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'credited': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'credited': return 'Completed';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [page, statusFilter, dateFilter]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const response = await adminService.getRewards(
        page,
        20,
        statusFilter !== 'all' ? statusFilter : undefined,
        dateFilter || undefined
      );
      setRewards(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.total);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleDateChange = (value: string) => {
    setDateFilter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setDateFilter('');
    setPage(1);
  };

  const hasActiveFilters = statusFilter !== 'all' || dateFilter !== '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
        <p className="text-gray-600 mt-1">View all distributed rewards</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>
              Reward History
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({totalCount})
              </span>
            </CardTitle>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Date Filter */}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="credited">Completed</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg px-3 py-2 transition-colors"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-2">
              {dateFilter && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  Date: {format(new Date(dateFilter + 'T00:00:00'), 'dd MMM yyyy')}
                  <button onClick={() => handleDateChange('')} className="hover:text-purple-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  Status: {getStatusLabel(statusFilter)}
                  <button onClick={() => handleStatusChange('all')} className="hover:text-purple-900">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
          ) : rewards.length > 0 ? (
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
                          <Badge className={getStatusColor(reward.status)}>
                            {getStatusLabel(reward.status)}
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
              {hasActiveFilters && (
                <p className="text-sm text-gray-400 mt-1">
                  Try clearing the filters
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
