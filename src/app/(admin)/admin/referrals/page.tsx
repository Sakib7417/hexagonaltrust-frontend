'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { referralService } from '@/services/referral.service';
import { Search, Eye, ChevronDown, ChevronRight, Network, Users } from 'lucide-react';
import { toast } from 'sonner';
import type { UserWithReferrals, ReferralNode } from '@/types';

export default function AdminReferralsPage() {
  const [users, setUsers] = useState<UserWithReferrals[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [userTree, setUserTree] = useState<ReferralNode | null>(null);
  const [treeLoading, setTreeLoading] = useState(false);

  useEffect(() => {
    fetchReferrals();
  }, [page]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await referralService.getAllReferrals(page, 20, search);
      setUsers(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchReferrals();
  };

  const handleViewTree = async (userId: string) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setUserTree(null);
      return;
    }

    try {
      setTreeLoading(true);
      setExpandedUserId(userId);
      const response = await referralService.getUserReferralTree(userId);
      setUserTree(response.data.tree);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load referral tree');
    } finally {
      setTreeLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
        <p className="text-gray-600 mt-1">View and manage user referral networks</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, or unique ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            User Referral Network
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({users.length} users)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unique ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Referred By</TableHead>
                      <TableHead>Direct Referrals</TableHead>
                      <TableHead>Total Downline</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <>
                        <TableRow key={user.id}>
                          <TableCell>
                            <span className="font-mono font-bold text-purple-600">
                              {user.uniqueId}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.referredBy ? (
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-xs text-gray-600">
                                  {user.referredBy.uniqueId}
                                </span>
                                <span className="text-gray-400">({user.referredBy.name})</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">Self-registered</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {user.directReferrals}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-700 font-mono">
                              {user.totalDownline}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewTree(user.id)}
                              className="gap-2"
                              disabled={treeLoading && expandedUserId === user.id}
                            >
                              <Eye size={16} />
                              {expandedUserId === user.id ? 'Hide Tree' : 'View Tree'}
                            </Button>
                          </TableCell>
                        </TableRow>
                        {expandedUserId === user.id && (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                  <Network size={18} />
                                  Downline Tree for {user.name} ({user.uniqueId})
                                </h4>
                                {treeLoading ? (
                                  <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                  </div>
                                ) : userTree ? (
                                  <AdminTreeNode node={userTree} level={0} />
                                ) : (
                                  <p className="text-gray-500">No downline found</p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
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
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Admin tree node component
function AdminTreeNode({ node, level }: { node: ReferralNode; level: number }) {
  const [expanded, setExpanded] = useState(level < 2);

  if (!node.user) return null;

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div
        className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer border border-gray-100"
        onClick={() => setExpanded(!expanded)}
      >
        {node.children.length > 0 ? (
          expanded ? (
            <ChevronDown size={14} className="text-purple-500" />
          ) : (
            <ChevronRight size={14} className="text-purple-500" />
          )
        ) : (
          <div className="w-3.5" />
        )}
        <div className="flex items-center gap-2 flex-1">
          <Users size={14} className="text-gray-400" />
          <span className="font-medium text-sm">{node.user.name}</span>
          <span className="text-xs font-mono text-purple-600">{node.user.uniqueId}</span>
          <Badge variant="outline" className="text-xs">
            L{level}
          </Badge>
          <span className="text-xs text-gray-400">{node.user.email}</span>
        </div>
        <Badge
          className={
            node.user.status === 'active'
              ? 'bg-green-100 text-green-700 text-xs'
              : node.user.status === 'blocked'
              ? 'bg-red-100 text-red-700 text-xs'
              : 'bg-yellow-100 text-yellow-700 text-xs'
          }
        >
          {node.user.status}
        </Badge>
      </div>
      {expanded && node.children.length > 0 && (
        <div className="border-l-2 border-purple-200 ml-2 mt-1">
          {node.children.map((child, idx) => (
            <AdminTreeNode key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
