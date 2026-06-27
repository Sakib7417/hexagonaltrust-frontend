'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { committeeService } from '@/services/committee.service';
import { toast } from 'sonner';
import { Crown, Users, ArrowLeft, TrendingUp } from 'lucide-react';
import type { CommitteeMember } from '@/types';
import Link from 'next/link';

export default function CoreCommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await committeeService.getCoreCommitteeMembers();
      setMembers(response || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load Core Committee members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/committee">
            <Button variant="ghost" className="gap-2 mb-2">
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Core Committee Members</h1>
          <p className="text-gray-600 mt-1">View all Core Committee members and their network stats</p>
        </div>
        <Badge className="bg-amber-100 text-amber-700 text-lg px-4 py-2">
          {members.length} / 10 Members
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Direct Referrals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.length > 0 
                    ? Math.round(members.reduce((sum, m) => sum + m.directReferrals, 0) / members.length)
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Crown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Slots Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{10 - members.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members List</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 bg-gradient-to-r from-amber-50 to-orange-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-700 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.uniqueId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Direct Referrals</p>
                      <p className="font-semibold">{member.directReferrals}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Downline</p>
                      <p className="font-semibold">{member.totalDownline}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700">CORE</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Crown className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No Core Committee members yet</p>
              <p className="text-sm mt-2">Super Committee members will be promoted when they qualify</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
