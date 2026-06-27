'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { committeeService } from '@/services/committee.service';
import { toast } from 'sonner';
import { Shield, Crown, Users, TrendingUp, ArrowRight, Lock } from 'lucide-react';
import type { CommitteeDashboard } from '@/types';
import Link from 'next/link';

export default function CommitteeDashboardPage() {
  const [dashboard, setDashboard] = useState<CommitteeDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await committeeService.getCommitteeDashboard();
      setDashboard(response);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load committee dashboard');
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

  const superFillPercentage = (dashboard?.superCommittee.occupiedSlots || 0) / (dashboard?.superCommittee.maxSlots || 50) * 100;
  const coreFillPercentage = (dashboard?.coreCommittee.occupiedSlots || 0) / (dashboard?.coreCommittee.maxSlots || 10) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Committee Management</h1>
        <p className="text-gray-600 mt-1">Manage Super and Core Committee memberships</p>
      </div>

      {/* Committee Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Super Committee Card */}
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Super Committee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{dashboard?.superCommittee.occupiedSlots || 0}</p>
                <p className="text-purple-100">of {dashboard?.superCommittee.maxSlots || 50} members</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{dashboard?.superCommittee.remainingSlots || 50}</p>
                <p className="text-purple-100">slots remaining</p>
              </div>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${superFillPercentage}%` }}
              />
            </div>

            <Link href="/admin/committee/super">
              <Button variant="secondary" className="w-full gap-2">
                View Members
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Core Committee Card */}
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6" />
              Core Committee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">{dashboard?.coreCommittee.occupiedSlots || 0}</p>
                <p className="text-amber-100">of {dashboard?.coreCommittee.maxSlots || 10} members</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{dashboard?.coreCommittee.remainingSlots || 10}</p>
                <p className="text-amber-100">slots remaining</p>
              </div>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${coreFillPercentage}%` }}
              />
            </div>

            <Link href="/admin/committee/core">
              <Button variant="secondary" className="w-full gap-2">
                View Members
                <ArrowRight size={16} />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Members */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Super Committee Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              Recent Super Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.superCommittee.members && dashboard.superCommittee.members.length > 0 ? (
              <div className="space-y-3">
                {dashboard.superCommittee.members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.uniqueId}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">SUPER</Badge>
                  </div>
                ))}
                {dashboard.superCommittee.members.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{dashboard.superCommittee.members.length - 5} more members
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Lock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No members yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Core Committee Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5 text-amber-600" />
              Recent Core Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboard?.coreCommittee.members && dashboard.coreCommittee.members.length > 0 ? (
              <div className="space-y-3">
                {dashboard.coreCommittee.members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.uniqueId}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700">CORE</Badge>
                  </div>
                ))}
                {dashboard.coreCommittee.members.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{dashboard.coreCommittee.members.length - 5} more members
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Lock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No members yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Link href="/admin/committee/statistics">
              <Button variant="outline" className="w-full gap-2">
                <TrendingUp size={18} />
                View Statistics
              </Button>
            </Link>
            <Link href="/admin/committee/super">
              <Button variant="outline" className="w-full gap-2">
                <Shield size={18} />
                Super Committee
              </Button>
            </Link>
            <Link href="/admin/committee/core">
              <Button variant="outline" className="w-full gap-2">
                <Crown size={18} />
                Core Committee
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
