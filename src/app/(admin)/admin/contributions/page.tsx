'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminService } from '@/services/admin.service';
import { CheckCircle, XCircle, Clock, Search, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Contribution } from '@/types';

export default function AdminContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchContributions();
  }, [filter, page]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getContributions(page, 20, filter);
      setContributions(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch contributions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveContribution(id);
      toast.success('Contribution approved');
      fetchContributions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectContribution(id);
      toast.success('Contribution rejected');
      fetchContributions();
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

  const filteredContributions = contributions.filter((c) => {
    if (search) {
      return (
        c.transactionId.toLowerCase().includes(search.toLowerCase()) ||
        c.user?.name.toLowerCase().includes(search.toLowerCase()) ||
        c.user?.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contributions</h1>
          <p className="text-gray-600 mt-1">Manage and approve user contributions</p>
        </div>
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
                  placeholder="Search by transaction ID or user..."
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

      {/* Contributions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} Contributions
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredContributions.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContributions.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContributions.map((contrib) => (
                      <TableRow key={contrib.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{contrib.user?.name || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{contrib.user?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">₹{contrib.amount}</TableCell>
                        <TableCell className="text-sm">{contrib.transactionId}</TableCell>
                        <TableCell>
                          {format(new Date(contrib.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(contrib.status)}
                            <Badge className={getStatusColor(contrib.status)}>
                              {contrib.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {contrib.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(contrib.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle size={16} className="mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(contrib.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <XCircle size={16} className="mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
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
              <p className="text-gray-500">No contributions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
