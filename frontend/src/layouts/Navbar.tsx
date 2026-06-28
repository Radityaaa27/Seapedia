import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ShoppingCart,
  Bell,
  LogOut,
  LayoutDashboard,
  User,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const roleBadgeColor: Record<string, string> = {
  BUYER: "bg-blue-100 text-blue-700",
  SELLER: "bg-green-100 text-green-700",
  DRIVER: "bg-yellow-100 text-yellow-700",
  ADMIN: "bg-red-100 text-red-700",
};

const Navbar = () => {
  const { isAuthenticated, user, logout, activeRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-2xl font-bold text-orange-500">
              SEA<span className="text-foreground">PEDIA</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 border border-input rounded-full text-sm bg-muted/40 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="w-5 h-5" />
                </Button>

                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-orange-500 text-white text-sm font-bold">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium max-w-24 truncate leading-none">
                          {user?.name}
                        </span>
                        {activeRole && (
                          <span className={`text-xs px-1.5 rounded mt-0.5 font-medium ${roleBadgeColor[activeRole]}`}>
                            {activeRole}
                          </span>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate font-normal">
                        {user?.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/role-select")}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Switch Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 focus:text-red-500"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-orange-500 hover:bg-orange-600 rounded-full">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;