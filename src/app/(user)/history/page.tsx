'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contributionService } from '@/services/contribution.service';
import { withdrawService } from '@/services/withdraw.service';
import { Calendar, DollarSign, Send, Award } from 'lucide-react';
import { format } from 'date-fns';
import type { Contribution, WithdrawRequest, Reward } from '@/types';

export default function HistoryPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [withdraws, setWithdraws] = useState<WithdrawRequest[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const [contribRes, withdrawRes] = await Promise.all([
        contributionService.getMyContributions(1, 50),
        withdrawService.getMyWithdraws(1, 50),
      ]);

      setContributions(contribRes.data);
      setWithdraws(withdrawRes.data);
    } catch (error) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'credited':
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
      <h1 className="text-3xl font-bold text-gray-900">History</h1>

      <Tabs defaultValue="contributions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contributions">
            <DollarSign size={16} className="mr-2" />
            Contributions
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            <Send size={16} className="mr-2" />
            Withdrawals
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Award size={16} className="mr-2" />
            Rewards
          </TabsTrigger>
        </TabsList>

        {/* Contributions Tab */}
        <TabsContent value="contributions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contribution History</CardTitle>
            </CardHeader>
            <CardContent>
              {contributions.length > 0 ? (
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
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-500" />
                              {format(new Date(contrib.createdAt), 'MMM dd, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">₹{contrib.amount}</TableCell>
                          <TableCell className="text-sm">{contrib.transactionId}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(contrib.status)}>
                              {contrib.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No contributions found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal History</CardTitle>
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
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-500" />
                              {format(new Date(withdraw.createdAt), 'MMM dd, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            ₹{withdraw.amount}
                          </TableCell>
                          <TableCell className="text-sm">{withdraw.upiId}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(withdraw.status)}>
                              {withdraw.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {withdraw.paymentTransactionId || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Send size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No withdrawals found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reward History</CardTitle>
            </CardHeader>
            <CardContent>
              {rewards.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week #</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Credit Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewards.map((reward) => (
                        <TableRow key={reward.id}>
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
                              {reward.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No rewards found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Rewards are generated weekly after eligibility
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
