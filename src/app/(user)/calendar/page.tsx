'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calendarService } from '@/services/calendar.service';
import { Calendar, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function CalendarPage() {
  const [calendar, setCalendar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchCalendar();
  }, [currentPage]);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const response = await calendarService.getCalendar(currentPage, limit);
      setCalendar(response.data);
    } catch (error) {
      console.error('Error fetching calendar:', error);
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

  if (!calendar) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">No calendar data found</p>
      </div>
    );
  }

  const { payments, summary } = calendar;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Advertisement Cost Calendar</h1>
        <p className="text-gray-600 mt-1">Track your weekly payment schedule</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold">₹{summary.totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Received</p>
                <p className="text-2xl font-bold text-green-600">₹{summary.paidAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{summary.paidWeeks} weeks</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{summary.pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{summary.pendingWeeks} weeks</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Next Payment</p>
                {summary.nextPaymentDate ? (
                  <>
                    <p className="text-lg font-bold">Week {summary.nextPaymentWeek}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(summary.nextPaymentDate), 'dd MMM yyyy')}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold">-</p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Payment Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Week</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Credit Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Day</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment: any) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-semibold">Week {payment.weekNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      {format(new Date(payment.creditDate), 'dd MMM yyyy')}
                    </td>
                    <td className="py-3 px-4">
                      {format(new Date(payment.creditDate), 'EEEE')}
                    </td>
                    <td className="py-3 px-4 font-semibold">₹{Number(payment.amount).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                        {payment.status === 'paid' ? (
                          <>
                            <CheckCircle size={14} className="mr-1" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Clock size={14} className="mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {calendar.pagination && calendar.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, calendar.pagination.total)} of{' '}
                {calendar.pagination.total} payments
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {calendar.pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= calendar.pagination.totalPages}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
