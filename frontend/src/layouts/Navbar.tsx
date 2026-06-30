import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { MapPin } from "lucide-react";
import { ShoppingBag } from "lucide-react";
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
  const [navSearch, setNavSearch] = useState("");
  const { itemCount } = useCart();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && navSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearch.trim())}`);
    }
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border/60 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <span className="text-2xl font-black text-orange-500 tracking-tight transition-transform duration-300 group-hover:scale-[1.02]">
              SEA<span className="text-foreground font-semibold">PEDIA</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-orange-500" />
              <input
                type="text"
                placeholder="Search premium marine products..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onKeyDown={handleSearchKeyPress}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-full text-sm bg-muted/30 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 hover:bg-muted/50 focus:bg-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative transition-transform active:scale-95 hover:text-orange-500" 
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse-glow">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Button>

                <Button variant="ghost" size="icon" className="transition-transform active:scale-95 hover:text-orange-500">
                  <Bell className="w-5 h-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted/50 transition-colors rounded-full">
                      <Avatar className="w-8 h-8 border border-orange-500/20">
                        <AvatarFallback className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white text-sm font-bold">
                          {user?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start text-left">
                        <span className="text-sm font-medium max-w-24 truncate leading-none">
                          {user?.name}
                        </span>
                        {activeRole && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 font-medium leading-none tracking-wide ${roleBadgeColor[activeRole]}`}>
                            {activeRole}
                          </span>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 mt-1 glass-card">
                    <DropdownMenuLabel>
                      <p className="text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate font-normal">
                        {user?.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")} className="hover:bg-orange-500/10 cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/wallet")} className="hover:bg-orange-500/10 cursor-pointer">
                      <Wallet className="w-4 h-4 mr-2" />
                      My Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")} className="hover:bg-orange-500/10 cursor-pointer">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/addresses")} className="hover:bg-orange-500/10 cursor-pointer">
                      <MapPin className="w-4 h-4 mr-2" />
                      My Addresses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/role-select")} className="hover:bg-orange-500/10 cursor-pointer">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Switch Role
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-500 focus:text-red-500 hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="hover:text-orange-500">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all duration-300 shadow-sm hover:shadow-orange-500/20 hover:shadow-lg">
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