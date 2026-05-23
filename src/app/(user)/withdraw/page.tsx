'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserStore } from '@/store/user.store';
import { withdrawService } from '@/services/withdraw.service';
import { Send, CheckCircle, XCircle, Clock, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import type { WithdrawRequest } from '@/types';

const withdrawSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  upiId: z.string().min(1, 'UPI ID is required'),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

export default function WithdrawPage() {
  const { dashboard, loading, fetchDashboard } = useUserStore();
  const [submitting, setSubmitting] = useState(false);
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WithdrawForm>({
    resolver: zodResolver(withdrawSchema),
  });

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    fetchWithdraws();
  }, [page]);

  const fetchWithdraws = async () => {
    try {
      const response = await withdrawService.getMyWithdraws(page, 10);
      setWithdraws(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch withdrawals');
    }
  };

  const onSubmit = async (data: WithdrawForm) => {
    const availableBalance = dashboard?.wallet.availableBalance || 0;
    
    if (data.amount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setSubmitting(true);
      await withdrawService.request(data.amount, data.upiId);
      toast.success('Withdraw request submitted successfully!');
      reset();
      fetchDashboard();
      fetchWithdraws();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdraw request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <h1 className="text-3xl font-bold text-gray-900">Withdraw</h1>

      {/* Available Balance */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wallet size={18} />
            Available Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            ₹{dashboard?.wallet.availableBalance || 0}
          </div>
          <p className="text-sm text-green-100 mt-1">
            You can withdraw this amount to your UPI
          </p>
        </CardContent>
      </Card>

      {/* Withdraw Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send size={20} />
            Request Withdrawal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  {...register('amount', { valueAsNumber: true })}
                  disabled={submitting}
                  max={dashboard?.wallet.availableBalance || 0}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Maximum: ₹{dashboard?.wallet.availableBalance || 0}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@upi"
                  {...register('upiId')}
                  disabled={submitting}
                />
                {errors.upiId && (
                  <p className="text-sm text-red-500">{errors.upiId.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Enter your UPI ID to receive payment
                </p>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full md:w-auto">
              {submitting ? 'Submitting...' : 'Request Withdrawal'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdraw History */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          {withdraws.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>UPI ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdraws.map((withdraw) => (
                      <TableRow key={withdraw.id}>
                        <TableCell>
                          {format(new Date(withdraw.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ₹{withdraw.amount}
                        </TableCell>
                        <TableCell className="text-sm">{withdraw.upiId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(withdraw.status)}
                            <Badge className={getStatusColor(withdraw.status)}>
                              {withdraw.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {withdraw.paymentTransactionId || '-'}
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
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Send size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No withdrawal requests yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Submit a withdrawal request above
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
