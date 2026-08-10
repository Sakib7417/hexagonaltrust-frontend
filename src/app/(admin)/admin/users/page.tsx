"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminService } from "@/services/admin.service";
import { Search, UserCheck, UserX, IdCard, Copy } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import type { User } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const copyUniqueId = (uniqueId: string) => {
    navigator.clipboard.writeText(uniqueId);
    toast.success("ID copied!");
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, page]);

  const fetchUsers = async (isSearch = false) => {
    try {
      
      if (isSearch) {
        setSearchLoading(true);
      } else {
        setLoading(true);
      }

      const response = await adminService.getUsers(
        page,
        20,
        filter === "all" ? undefined : filter,
        search,
      );
      setUsers(response.data);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      if (isSearch) {
        setSearchLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleBlock = async (id: string) => {
    try {
      await adminService.blockUser(id);
      toast.success("User blocked");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to block user");
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await adminService.unblockUser(id);
      toast.success("User unblocked");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to unblock user");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-yellow-100 text-yellow-700";
      case "blocked":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
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
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">Manage platform users</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {searchLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {["all", "active", "inactive", "blocked"].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filter === "all"
              ? "All"
              : filter.charAt(0).toUpperCase() + filter.slice(1)}{" "}
            Users
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({users.length})
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
                      <TableHead>Phone</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Password (Plain Text)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.uniqueId ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-purple-600">
                                {user.uniqueId}
                              </span>
                              <button
                                onClick={() => copyUniqueId(user.uniqueId!)}
                                className="p-1 hover:bg-purple-100 rounded transition-colors"
                                title="Copy ID"
                              >
                                <Copy size={14} className="text-purple-600" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-xs text-gray-600"
                              title={user.password}
                            >
                              {user.password || "-"}
                            </span>
                            <button
                              onClick={() => {
                                if (user.password) {
                                  navigator.clipboard.writeText(user.password);
                                  toast.success("Password copied!");
                                }
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                              title="Copy password"
                            >
                              <Copy size={14} className="text-gray-600" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          {user.status === "blocked" ? (
                            <Button
                              size="sm"
                              onClick={() => handleUnblock(user.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <UserCheck size={16} className="mr-1" />
                              Unblock
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBlock(user.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <UserX size={16} className="mr-1" />
                              Block
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
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
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
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
