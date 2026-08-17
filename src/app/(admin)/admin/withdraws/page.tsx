'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminService } from '@/services/admin.service';
import { membershipService } from '@/services/membership.service';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
// import { useSearchParams } from "next/navigation";
import type { WithdrawRequest } from '@/types';

export default function AdminWithdrawsPage() {
  const router = useRouter();
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // const searchParams = useSearchParams();
//   const [filter, setFilter] = useState(
//   searchParams.get("status") || "all"
// );
const [filter, setFilter] = useState<string>("");
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawRequest | null>(null);
  const [membershipLookup, setMembershipLookup] = useState<Record<string, any>>({});
  const [memberLookup, setMemberLookup] = useState<Record<string, { uniqueId?: string }>>({});

  useEffect(() => {
    console.log("Stored filter:", localStorage.getItem("withdrawFilter"));
  }, []);

  useEffect(() => {
    fetchWithdraws();
  }, [filter, page]);

  useEffect(() => {
  const status = localStorage.getItem("withdrawFilter");

  if (status) {
    setFilter(status);
    setPage(1);
    localStorage.removeItem("withdrawFilter");
  }
}, []);
  const fetchWithdraws = async () => {
    try {
      setLoading(true);
      const [withdrawResponse, membershipResponse, usersResponse] = await Promise.all([
        adminService.getWithdraws(page, 20, filter),
        membershipService.getAllForms(1, 500),
        adminService.getUsers(1, 500),
      ]);

      const lookup: Record<string, any> = {};
      const userLookup: Record<string, { uniqueId?: string }> = {};

      (membershipResponse.data || []).forEach((membership: any) => {
        const userId = membership?.user?.id || membership?.userId;
        if (userId) {
          lookup[userId] = membership;
        }
      });

      (usersResponse.data || []).forEach((user) => {
        if (user.id) {
          userLookup[user.id] = { uniqueId: user.uniqueId };
        }
      });

      setMembershipLookup(lookup);
      setMemberLookup(userLookup);
      setWithdraws(withdrawResponse.data);
      if (withdrawResponse.pagination) {
        setTotalPages(withdrawResponse.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (withdraw: WithdrawRequest) => {
    setSelectedWithdraw(withdraw);
    setShowApproveModal(true);
    setTransactionId('');
  };

  const handleApprove = async () => {
    if (!selectedWithdraw || !transactionId.trim()) {
      toast.error('Transaction ID is required');
      return;
    }

    try {
      setApprovingId(selectedWithdraw.id);
      await adminService.approveWithdraw(selectedWithdraw.id, transactionId);
      toast.success('Withdrawal approved');
      setShowApproveModal(false);
      setSelectedWithdraw(null);
      fetchWithdraws();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectWithdraw(id);
      toast.success('Withdrawal rejected');
      fetchWithdraws();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
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

  const getUserUniqueId = (withdraw: WithdrawRequest) => {
    const userId = withdraw.userId || withdraw.user?.id;
    const membershipUser = membershipLookup[userId || ''];
    const uniqueId =
      memberLookup[userId || '']?.uniqueId ||
      membershipUser?.user?.uniqueId ||
      withdraw.user?.uniqueId ||
      'N/A';

    return uniqueId;
  };

  const getBankDetails = (withdraw: WithdrawRequest) => {
    const membership =
      membershipLookup[withdraw.userId] ||
      withdraw.user?.membership ||
      withdraw.member || {
        accountHolder: withdraw.accountHolder,
        bankName: withdraw.bankName,
        accountNumber: withdraw.accountNumber,
        ifscCode: withdraw.ifscCode,
      };

    return {
      accountHolder: membership?.accountHolder || 'N/A',
      bankName: membership?.bankName || 'N/A',
      accountNumber: membership?.accountNumber || 'N/A',
      ifscCode: membership?.ifscCode || 'N/A',
    };
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
        <h1 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h1>
        <p className="text-gray-600 mt-1">Manage and process user withdrawals</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by UPI ID or user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['pending', 'approved', 'rejected', 'all'].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFilter(f);
                    setPage(1);
                  }}
                  className="capitalize"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} Withdrawals
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({withdraws.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {withdraws.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unique ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>UPI ID</TableHead>
                      <TableHead>Bank Details</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment Transaction ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdraws.map((withdraw) => {
                      const bankDetails = getBankDetails(withdraw);
                      const uniqueId = getUserUniqueId(withdraw);

                      return (
                        <TableRow key={withdraw.id}>
                          <TableCell>
                            <button
                              type="button"
                              onClick={() => withdraw.userId && router.push(`/admin/users/${withdraw.userId}/withdrawals`)}
                              className="font-mono text-sm font-semibold text-purple-700 transition-colors hover:text-purple-900 hover:opacity-80"
                            >
                              {uniqueId}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{withdraw.user?.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500">{withdraw.user?.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">₹{withdraw.amount}</TableCell>
                          <TableCell className="text-sm">{withdraw.upiId}</TableCell>
                          <TableCell className="min-w-[220px]">
                            <div className="space-y-1 text-xs text-gray-700">
                              <p><span className="font-semibold">A/C Holder:</span> {bankDetails.accountHolder}</p>
                              <p><span className="font-semibold">Bank:</span> {bankDetails.bankName}</p>
                              <p className="font-mono"><span className="font-semibold not-italic">A/C No:</span> {bankDetails.accountNumber}</p>
                              <p className="font-mono"><span className="font-semibold not-italic">IFSC:</span> {bankDetails.ifscCode}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(withdraw.createdAt), 'MMM dd, yyyy')}
                          </TableCell>
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
                          <TableCell>
                            {withdraw.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveClick(withdraw)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle size={16} className="mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(withdraw.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <XCircle size={16} className="mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

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
              <p className="text-gray-500">No withdrawals found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Modal */}
      {showApproveModal && selectedWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Approve Withdrawal</h2>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-gray-600">User</p>
                <p className="font-medium">{selectedWithdraw.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium text-green-600">₹{selectedWithdraw.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">UPI ID</p>
                <p className="font-medium">{selectedWithdraw.upiId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Payment Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter payment transaction ID"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={!!approvingId || !transactionId.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {approvingId ? 'Processing...' : 'Approve'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedWithdraw(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
