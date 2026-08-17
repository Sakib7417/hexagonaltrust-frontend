'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { adminService } from '@/services/admin.service';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function UserWithdrawalsPage() {
  const params = useParams();
  const userId = params?.id as string;
  const [withdraws, setWithdraws] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchUserWithdrawals();
  }, [userId]);

  const fetchUserWithdrawals = async () => {
    try {
      setLoading(true);
      const [userResponse, withdrawalsResponse] = await Promise.all([
        adminService.getUser(userId),
        adminService.getWithdraws(1, 100, 'all'),
      ]);

      setUser(userResponse);
      const filtered = (withdrawalsResponse.data || []).filter(
        (withdraw) => withdraw.userId === userId || withdraw.user?.id === userId
      );
      setWithdraws(filtered);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch user withdrawals');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'User'} Withdrawal History</h1>
        <p className="text-gray-600 mt-1">
          {user?.uniqueId ? `Unique ID: ${user.uniqueId}` : 'User withdrawals'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Withdrawal History
            <span className="text-sm font-normal text-gray-500 ml-2">({withdraws.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withdraws.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>UPI ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Transaction ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdraws.map((withdraw) => (
                    <TableRow key={withdraw.id}>
                      <TableCell>{format(new Date(withdraw.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="font-semibold">₹{withdraw.amount}</TableCell>
                      <TableCell className="text-sm">{withdraw.upiId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(withdraw.status)}
                          <Badge className={getStatusColor(withdraw.status)}>{withdraw.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{withdraw.paymentTransactionId || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No withdrawal history found for this user</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
