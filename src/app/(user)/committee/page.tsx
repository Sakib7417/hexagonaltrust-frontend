'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { committeeService } from '@/services/committee.service';
import { toast } from 'sonner';
import { Crown, Shield, Users, TrendingUp, Award, Lock } from 'lucide-react';
import type { CommitteeStatus } from '@/types';

export default function CommitteePage() {
  const [committeeStatus, setCommitteeStatus] = useState<CommitteeStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommitteeStatus();
  }, []);

  const fetchCommitteeStatus = async () => {
    try {
      setLoading(true);
      const response = await committeeService.getCommitteeStatus();
      setCommitteeStatus(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load committee status');
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

  const getCommitteeInfo = (status: string) => {
    switch (status) {
      case 'SUPER':
        return {
          icon: <Shield className="h-12 w-12" />,
          title: 'Super Committee Member',
          description: 'You are a member of the Super Committee. Keep building your network!',
          color: 'from-purple-600 to-indigo-600',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
        };
      case 'CORE':
        return {
          icon: <Crown className="h-12 w-12" />,
          title: 'Core Committee Member',
          description: 'Congratulations! You are a member of the elite Core Committee.',
          color: 'from-amber-500 to-orange-600',
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-700',
        };
      default:
        return {
          icon: <Lock className="h-12 w-12" />,
          title: 'Not in Committee',
          description: 'Refer more users to qualify for committee membership.',
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
        };
    }
  };

  const info = getCommitteeInfo(committeeStatus?.committee || 'NONE');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Committee Status</h1>
        <p className="text-gray-600 mt-1">View your committee membership status</p>
      </div>

      {/* Committee Status Card */}
      <Card className={`bg-gradient-to-br ${info.color} text-white border-0`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {info.icon}
            {info.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/90 text-lg">{info.description}</p>
        </CardContent>
      </Card>

      {/* Committee Requirements */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              Super Committee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Requirement</span>
              <Badge className="bg-purple-100 text-purple-700">10 Direct Referrals</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Max Members</span>
              <Badge variant="outline">50</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Selection</span>
              <Badge variant="outline">First Come First Serve</Badge>
            </div>
            {committeeStatus?.committee === 'NONE' && (
              <p className="text-sm text-gray-500 pt-2">
                Refer 10 users directly to qualify for Super Committee membership.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5 text-amber-600" />
              Core Committee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Requirement</span>
              <Badge className="bg-amber-100 text-amber-700">Super + 10x10 Network</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Max Members</span>
              <Badge variant="outline">10</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Selection</span>
              <Badge variant="outline">First Come First Serve</Badge>
            </div>
            {committeeStatus?.committee === 'SUPER' && (
              <p className="text-sm text-gray-500 pt-2">
                Ensure your first 10 direct referrals each have 10 direct referrals to qualify for Core Committee.
              </p>
            )}
            {committeeStatus?.committee === 'NONE' && (
              <p className="text-sm text-gray-500 pt-2">
                First qualify for Super Committee, then build a strong network to reach Core Committee.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Build Network</p>
                <p className="font-semibold text-gray-900">Share your referral link</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Track Progress</p>
                <p className="font-semibold text-gray-900">Monitor your referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Get Promoted</p>
                <p className="font-semibold text-gray-900">Automatic promotion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
