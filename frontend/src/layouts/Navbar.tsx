import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCart } from "../hooks/useCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Search, ShoppingCart, Bell, LogOut, LayoutDashboard,
  RefreshCw, Wallet, ShoppingBag, MapPin, Plus,
  TrendingUp, Truck, Users, Tag,
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
const [searchQuery, setSearchQuery] = useState("");
  const { itemCount } = useCart();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
  };

const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && searchQuery.trim()) {
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
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

          {/* Search
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-orange-500" />
              <input
  type="text"
  placeholder="Search products..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={handleSearch}
  className="w-full pl-9 pr-4 py-2 border border-input rounded-full text-sm bg-muted/40 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
/>
            </div>
          </div> */}

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
                  <DropdownMenuContent align="end" className="w-52">
  <DropdownMenuLabel>
    <p className="text-sm font-medium truncate">{user?.name}</p>
    <p className="text-xs text-muted-foreground truncate font-normal">{user?.email}</p>
  </DropdownMenuLabel>
  <DropdownMenuSeparator />

  {/* Role-specific dashboard link */}
  <DropdownMenuItem onClick={() => {
    if (activeRole === "SELLER") navigate("/seller/store");
    else if (activeRole === "DRIVER") navigate("/driver/dashboard");
    else if (activeRole === "ADMIN") navigate("/admin/dashboard");
    else navigate("/buyer/dashboard");
  }}>
    <LayoutDashboard className="w-4 h-4 mr-2" />
    Dashboard
  </DropdownMenuItem>

  {/* Role-specific menu items */}
  {activeRole === "BUYER" && (
    <>
      <DropdownMenuItem onClick={() => navigate("/wallet")}>
        <Wallet className="w-4 h-4 mr-2" />
        My Wallet
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/orders")}>
        <ShoppingBag className="w-4 h-4 mr-2" />
        My Orders
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/addresses")}>
        <MapPin className="w-4 h-4 mr-2" />
        My Addresses
      </DropdownMenuItem>
    </>
  )}

  {activeRole === "SELLER" && (
    <>
      <DropdownMenuItem onClick={() => navigate("/seller/orders")}>
        <ShoppingBag className="w-4 h-4 mr-2" />
        Pesanan Masuk
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/seller/products/create")}>
        <Plus className="w-4 h-4 mr-2" />
        Tambah Produk
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/seller/reports")}>
        <TrendingUp className="w-4 h-4 mr-2" />
        Laporan
      </DropdownMenuItem>
    </>
  )}

  {activeRole === "DRIVER" && (
    <>
      <DropdownMenuItem onClick={() => navigate("/driver/jobs")}>
        <Truck className="w-4 h-4 mr-2" />
        Available Jobs
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/wallet")}>
        <Wallet className="w-4 h-4 mr-2" />
        Earnings Wallet
      </DropdownMenuItem>
    </>
  )}

  {activeRole === "ADMIN" && (
    <>
      <DropdownMenuItem onClick={() => navigate("/admin/users")}>
        <Users className="w-4 h-4 mr-2" />
        Kelola User
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => navigate("/admin/vouchers")}>
        <Tag className="w-4 h-4 mr-2" />
        Voucher & Promo
      </DropdownMenuItem>
    </>
  )}

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