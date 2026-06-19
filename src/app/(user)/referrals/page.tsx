'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { referralService } from '@/services/referral.service';
import { toast } from 'sonner';
import { Copy, Users, Network, ChevronDown, ChevronRight } from 'lucide-react';
import type { ReferralInfo, ReferralNode } from '@/types';

export default function ReferralsPage() {
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [downlineTree, setDownlineTree] = useState<ReferralNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      const [infoRes, treeRes] = await Promise.all([
        referralService.getMyReferralInfo(),
        referralService.getMyDownline(),
      ]);
      setReferralInfo(infoRes.data);
      setDownlineTree(treeRes.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    if (referralInfo?.myCode) {
      navigator.clipboard.writeText(referralInfo.myCode);
      toast.success('Referral code copied!');
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
        <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
        <p className="text-gray-600 mt-1">View your referral tree and downline</p>
      </div>

      {/* Referral Code Card */}
      <Card className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network size={24} />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold font-mono">{referralInfo?.myCode}</p>
              <p className="text-purple-100 mt-2">Share this code with others to refer them</p>
            </div>
            <Button
              onClick={copyReferralCode}
              variant="secondary"
              className="gap-2"
            >
              <Copy size={18} />
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Direct Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralInfo?.directCount || 0}</div>
            <p className="text-xs text-muted-foreground">Users you directly referred</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downline</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referralInfo?.totalDownline || 0}</div>
            <p className="text-xs text-muted-foreground">All levels in your network</p>
          </CardContent>
        </Card>
      </div>

      {/* Direct Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Direct Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referralInfo?.directReferrals && referralInfo.directReferrals.length > 0 ? (
            <div className="space-y-3">
              {referralInfo.directReferrals.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      {user.email} • Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className={
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : user.status === 'blocked'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No referrals yet. Share your code to start building your network!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Downline Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Full Downline Tree</CardTitle>
        </CardHeader>
        <CardContent>
          {downlineTree && downlineTree.children.length > 0 ? (
            <div className="space-y-2">
              <TreeNode node={downlineTree} level={0} />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Network size={48} className="mx-auto mb-3 text-gray-300" />
              <p>No downline tree yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Recursive tree node component
function TreeNode({ node, level }: { node: ReferralNode; level: number }) {
  const [expanded, setExpanded] = useState(level < 2); // Auto-expand first 2 levels

  if (!node.user) return null;

  return (
    <div style={{ marginLeft: `${level * 24}px` }}>
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {node.children.length > 0 ? (
          expanded ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronRight size={16} className="text-gray-400" />
          )
        ) : (
          <div className="w-4" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{node.user.name}</span>
            <Badge variant="outline" className="text-xs">
              Level {level}
            </Badge>
          </div>
          <p className="text-xs text-gray-500">
            {node.user.email} • {node.user.uniqueId}
          </p>
        </div>
      </div>
      {expanded && node.children.length > 0 && (
        <div className="border-l-2 border-gray-200 ml-3">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
