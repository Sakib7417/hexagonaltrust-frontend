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
import { contributionService } from '@/services/contribution.service';
import { Copy, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Contribution } from '@/types';

const contributionSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
});

type ContributionForm = z.infer<typeof contributionSchema>;

export default function ContributionPage() {
  const [loading, setLoading] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionForm>({
    resolver: zodResolver(contributionSchema),
  });

  useEffect(() => {
    fetchContributions();
    fetchSettings();
  }, [page]);

  const fetchContributions = async () => {
    try {
      const response = await contributionService.getMyContributions(page, 10);
      setContributions(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch contributions');
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await contributionService.getPaymentSettings();
      setSettings(response.data);
    } catch (error: any) {
      console.error('Failed to fetch payment settings:', error);
      // Settings are optional - payment info may not be configured yet
    }
  };

  const onSubmit = async (data: ContributionForm) => {
    try {
      setLoading(true);
      await contributionService.submit(data.amount, data.transactionId);
      toast.success('Contribution submitted successfully!');
      reset();
      fetchContributions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit contribution');
    } finally {
      setLoading(false);
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Contribution</h1>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign size={24} />
            Payment Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to Make a Contribution:</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. Send payment to the UPI ID below</li>
              <li>2. Copy the transaction ID from your payment app</li>
              <li>3. Fill in the form with amount and transaction ID</li>
              <li>4. Submit and wait for admin approval</li>
            </ol>
          </div>

          {settings?.upiId && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Admin UPI ID:</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-gray-900">{settings.upiId}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(settings.upiId)}
                  className="gap-1"
                >
                  <Copy size={16} />
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contribution Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Contribution</CardTitle>
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
                  disabled={loading}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  placeholder="Enter transaction ID"
                  {...register('transactionId')}
                  disabled={loading}
                />
                {errors.transactionId && (
                  <p className="text-sm text-red-500">{errors.transactionId.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? 'Submitting...' : 'Submit Contribution'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contribution History */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution History</CardTitle>
        </CardHeader>
        <CardContent>
          {contributions.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contributions.map((contrib) => (
                      <TableRow key={contrib.id}>
                        <TableCell>
                          {format(new Date(contrib.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="font-medium">₹{contrib.amount}</TableCell>
                        <TableCell className="text-sm">{contrib.transactionId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(contrib.status)}
                            <Badge className={getStatusColor(contrib.status)}>
                              {contrib.status}
                            </Badge>
                          </div>
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
              <DollarSign size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No contributions yet</p>
              <p className="text-sm text-gray-400">Make your first contribution above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
