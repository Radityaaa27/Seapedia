import { useState, useEffect, useCallback } from "react";
import { adminService } from "../../services/adminService";
import { AdminUser } from "../../types/adminTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Search,
  UserCheck,
  UserX,
  ShieldPlus,
  Loader2,
  Users,
} from "lucide-react";

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700",
  SELLER: "bg-green-100 text-green-700",
  BUYER: "bg-blue-100 text-blue-700",
  DRIVER: "bg-yellow-100 text-yellow-700",
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers(page, search || undefined);
      setUsers(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggle = async (userId: string) => {
    setActionLoading(userId);
    try {
      await adminService.toggleUserActive(userId);
      toast.success("User status updated.");
      fetchUsers();
    } catch {
      toast.error("Failed to update user.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignRole = async (userId: string, role: string) => {
    setActionLoading(`${userId}-${role}`);
    try {
      await adminService.assignRole(userId, role);
      toast.success(`${role} role assigned.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to assign role.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          User Management
        </h1>
        <Badge variant="outline" className="text-sm">
          {users.length} users shown
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Users className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <p className="text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0 text-orange-600 font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {user.name}
                        </p>
                        {!user.isActive && (
                          <Badge className="bg-red-100 text-red-600 border-none text-xs">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {user.roles.map((r) => (
                          <span
                            key={r.role}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              roleColors[r.role] ??
                              "bg-muted text-muted-foreground"
                            }`}
                          >
                            {r.role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <p className="text-xs text-muted-foreground">
                      {user._count.ordersAsBuyer} orders ·{" "}
                      {new Date(user.createdAt).toLocaleDateString("id-ID")}
                    </p>

                    {/* Toggle active */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggle(user.id)}
                      disabled={actionLoading === user.id}
                      className={`text-xs ${
                        user.isActive
                          ? "text-red-500 hover:text-red-600"
                          : "text-green-500 hover:text-green-600"
                      }`}
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : user.isActive ? (
                        <>
                          <UserX className="w-3 h-3 mr-1" /> Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" /> Activate
                        </>
                      )}
                    </Button>

                    {/* Assign roles */}
                    {["SELLER", "DRIVER", "ADMIN"].map((role) => {
                      const hasRole = user.roles.some(
                        (r) => r.role === role
                      );
                      if (hasRole) return null;
                      return (
                        <Button
                          key={role}
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignRole(user.id, role)}
                          disabled={
                            actionLoading === `${user.id}-${role}`
                          }
                          className="text-xs"
                        >
                          {actionLoading === `${user.id}-${role}` ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <ShieldPlus className="w-3 h-3 mr-1" />+
                              {role}
                            </>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;