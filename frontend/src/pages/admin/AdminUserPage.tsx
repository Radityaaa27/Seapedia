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
  Trash2,
  X,
  AlertTriangle,
  Mail,
  Phone,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

const roleColors: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700 border-red-200",
  SELLER: "bg-green-100 text-green-700 border-green-200",
  BUYER: "bg-blue-100 text-blue-700 border-blue-200",
  DRIVER: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const roleGradients: Record<string, string> = {
  ADMIN: "from-red-500 to-rose-600",
  SELLER: "from-green-500 to-emerald-600",
  BUYER: "from-blue-500 to-indigo-600",
  DRIVER: "from-yellow-500 to-orange-500",
};

interface DeleteModalProps {
  user: AdminUser;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const DeleteModal = ({ user, onConfirm, onCancel, isLoading }: DeleteModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    />
    {/* Modal */}
    <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-up">
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg">Hapus Akun Pengguna</h3>
          <p className="text-muted-foreground text-sm">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${roleGradients[user.roles[0]?.role ?? "BUYER"] ?? "from-gray-400 to-gray-500"}`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Semua data pengguna ini, termasuk riwayat order, akan dihapus secara permanen dari sistem.
      </p>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button
          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Trash2 className="w-4 h-4 mr-2" />
          )}
          Hapus Akun
        </Button>
      </div>
    </div>
  </div>
);

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers(page, search || undefined);
      setUsers(res.data);
      setTotalPages(res.meta?.totalPages ?? 1);
      setTotalItems(res.meta?.total ?? res.data.length);
    } catch {
      toast.error("Gagal memuat daftar pengguna.");
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
      toast.success("Status pengguna diperbarui.");
      fetchUsers();
    } catch {
      toast.error("Gagal memperbarui pengguna.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignRole = async (userId: string, role: string) => {
    setActionLoading(`${userId}-${role}`);
    try {
      await adminService.assignRole(userId, role);
      toast.success(`Role ${role} berhasil diberikan.`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memberikan role.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await adminService.deleteUser(deleteTarget.id);
      toast.success(`Akun ${deleteTarget.name} berhasil dihapus.`);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menghapus akun.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleteLoading}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            User Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola akun, role, dan status pengguna Seapedia.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1.5 rounded-xl">
            {totalItems} pengguna
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="user-search"
            placeholder="Cari berdasarkan nama atau email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 h-11 rounded-xl border-border/60 focus:border-orange-500"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/60">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-sm text-muted-foreground">Memuat pengguna...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <p className="font-semibold text-foreground mb-1">
            {search ? "Tidak ada hasil" : "Belum ada pengguna"}
          </p>
          <p className="text-sm text-muted-foreground">
            {search ? `Tidak ditemukan pengguna untuk "${search}"` : "Belum ada pengguna terdaftar."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const primaryRole = user.roles[0]?.role ?? "BUYER";
            const gradient = roleGradients[primaryRole] ?? "from-gray-400 to-gray-500";

            return (
              <Card
                key={user.id}
                className={`border transition-all duration-200 hover:shadow-md ${!user.isActive ? "opacity-60" : ""}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 flex-wrap">

                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg text-white bg-gradient-to-br ${gradient} shadow-sm`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-bold text-foreground">{user.name}</p>
                        {!user.isActive && (
                          <Badge className="bg-red-100 text-red-600 border-none text-[10px] font-bold px-2">
                            Nonaktif
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mb-2">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {user.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Role badges */}
                      <div className="flex gap-1.5 flex-wrap">
                        {user.roles.map((r) => (
                          <span
                            key={r.role}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${roleColors[r.role] ?? "bg-muted text-muted-foreground border-border"}`}
                          >
                            {r.role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">Total Orders</p>
                      <p className="text-lg font-black text-foreground">{user._count.ordersAsBuyer}</p>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">

                    {/* Toggle Active */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggle(user.id)}
                      disabled={actionLoading === user.id}
                      className={`text-xs font-semibold rounded-lg ${
                        user.isActive
                          ? "border-red-200 text-red-500 hover:bg-red-50"
                          : "border-green-200 text-green-500 hover:bg-green-50"
                      }`}
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      ) : user.isActive ? (
                        <UserX className="w-3.5 h-3.5 mr-1.5" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      {user.isActive ? "Nonaktifkan" : "Aktifkan"}
                    </Button>

                    {/* Assign Roles */}
                    {["SELLER", "DRIVER", "ADMIN"].map((role) => {
                      const hasRole = user.roles.some((r) => r.role === role);
                      if (hasRole) return null;
                      return (
                        <Button
                          key={role}
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssignRole(user.id, role)}
                          disabled={actionLoading === `${user.id}-${role}`}
                          className="text-xs font-semibold rounded-lg border-border/60"
                        >
                          {actionLoading === `${user.id}-${role}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          ) : (
                            <ShieldPlus className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          +{role}
                        </Button>
                      );
                    })}

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Delete */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteTarget(user)}
                      className="text-xs font-semibold rounded-lg border-red-200 text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Hapus Akun
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                    page === pageNum
                      ? "bg-orange-500 text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-xl"
          >
            Selanjutnya
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;