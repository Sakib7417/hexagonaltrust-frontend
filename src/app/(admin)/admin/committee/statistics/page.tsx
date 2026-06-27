'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { committeeService } from '@/services/committee.service';
import { toast } from 'sonner';
import { Shield, Crown, Users, TrendingUp, ArrowLeft, BarChart3 } from 'lucide-react';
import type { CommitteeStatistics } from '@/types';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CommitteeStatisticsPage() {
  const [statistics, setStatistics] = useState<CommitteeStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await committeeService.getCommitteeStatistics();
      setStatistics(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load committee statistics');
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
        <Link href="/admin/committee">
          <Button variant="ghost" className="gap-2 mb-2">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Committee Statistics</h1>
        <p className="text-gray-600 mt-1">Overview of committee distribution and recent promotions</p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900">{statistics?.totalUsers || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Registered users in the platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Committee Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">None</span>
                <Badge variant="outline">{statistics?.committeeDistribution.none || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Super</span>
                <Badge className="bg-purple-100 text-purple-700">{statistics?.committeeDistribution.super || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Core</span>
                <Badge className="bg-amber-100 text-amber-700">{statistics?.committeeDistribution.core || 0}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Committee Fill Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Super Committee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-700">{statistics?.superCommittee.occupied || 0}</p>
                <p className="text-sm text-gray-600">occupied</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-700">{statistics?.superCommittee.remaining || 50}</p>
                <p className="text-sm text-gray-600">remaining</p>
              </div>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-4">
              <div 
                className="bg-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${statistics?.superCommittee.fillPercentage || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {statistics?.superCommittee.fillPercentage.toFixed(1)}% filled
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              Core Committee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-700">{statistics?.coreCommittee.occupied || 0}</p>
                <p className="text-sm text-gray-600">occupied</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-700">{statistics?.coreCommittee.remaining || 10}</p>
                <p className="text-sm text-gray-600">remaining</p>
              </div>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-4">
              <div 
                className="bg-amber-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${statistics?.coreCommittee.fillPercentage || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 text-center">
              {statistics?.coreCommittee.fillPercentage.toFixed(1)}% filled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Promotions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Recent Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statistics?.recentPromotions && statistics.recentPromotions.length > 0 ? (
            <div className="space-y-3">
              {statistics.recentPromotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{promotion.user.name}</p>
                      <p className="text-sm text-gray-500">{promotion.user.uniqueId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Promoted On</p>
                      <p className="font-semibold">{format(new Date(promotion.promotedAt), 'MMM dd, yyyy')}</p>
                    </div>
                    <Badge 
                      className={
                        promotion.newCommittee === 'SUPER'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-700'
                      }
                    >
                      {promotion.newCommittee}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No promotions yet</p>
              <p className="text-sm mt-2">Promotions will appear here as users qualify</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
