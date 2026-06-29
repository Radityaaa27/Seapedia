import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RoleType } from "../types/auth.types";
import {
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const roleConfig: {
  role: RoleType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  available: boolean;
}[] = [
  {
    role: "BUYER",
    label: "Buyer",
    description: "Browse products, manage cart, place orders, and track deliveries.",
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200 hover:border-blue-400",
    available: true,
  },
  {
    role: "SELLER",
    label: "Seller",
    description: "Manage your store, list products, and process orders.",
    icon: Store,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200 hover:border-green-400",
    available: true,
  },
  {
    role: "DRIVER",
    label: "Driver",
    description: "Accept delivery jobs, pick up orders, and earn money.",
    icon: Truck,
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200 hover:border-yellow-400",
    available: true,
  },
  {
    role: "ADMIN",
    label: "Admin",
    description: "Monitor the marketplace, manage vouchers and resolve disputes.",
    icon: ShieldCheck,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200 hover:border-red-400",
    available: false, // cannot self-assign
  },
];

const RoleSelectPage = () => {
  const { user, switchRole, activeRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<RoleType | null>(null);

  // Only show roles the user actually has
  const userRoles = user?.roles.map((r) => r.role) ?? [];

  const handleSelect = async (role: RoleType) => {
  if (role === activeRole) {
    // Redirect to the right dashboard per role
if (role === "DRIVER") navigate("/driver/dashboard");
else if (role === "SELLER") navigate("/seller/store");
else if (role === "ADMIN") navigate("/admin/dashboard");
else navigate("/dashboard");
    return;
  }
   setLoading(role);
  try {
    await switchRole(role);
    toast.success(`Switched to ${role} mode.`);
    if (role === "DRIVER") navigate("/driver/dashboard");
    else if (role === "SELLER") navigate("/seller/store");
    else navigate("/dashboard");
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to switch role.");
  } finally {
    setLoading(null);
  }
};

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-orange-500">
            SEA<span className="text-foreground">PEDIA</span>
          </span>
          <h2 className="text-xl font-bold text-foreground mt-4">
            Select Your Role
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Hi {user?.name}! Choose how you want to use SEAPEDIA right now.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {roleConfig.map((config) => {
            const hasRole = userRoles.includes(config.role);
            const isActive = activeRole === config.role;

            return (
              <Card
                key={config.role}
                className={`border-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-orange-500 shadow-md"
                    : hasRole
                    ? config.bg
                    : "opacity-40 cursor-not-allowed border-border"
                }`}
                onClick={() => hasRole && handleSelect(config.role)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? "bg-orange-100" : "bg-white"
                    }`}>
                      <config.icon className={`w-6 h-6 ${
                        isActive ? "text-orange-500" : config.color
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {config.label}
                        </h3>
                        {isActive && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                        {!hasRole && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Not assigned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {config.description}
                      </p>
                    </div>
                  </div>

                  {hasRole && (
                    <Button
                      size="sm"
                      className={`w-full mt-4 ${
                        isActive
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-white border border-input hover:bg-muted text-foreground"
                      }`}
                      disabled={loading === config.role}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(config.role);
                      }}
                    >
                      {loading === config.role ? (
                        "Switching..."
                      ) : isActive ? (
                        <>Go to Dashboard <ArrowRight className="w-3 h-3 ml-1" /></>
                      ) : (
                        `Switch to ${config.label}`
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add role section */}
        <Card className="border-dashed border-2 border-border">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Want to register as a Seller or Driver?{" "}
              <span className="text-orange-500 font-medium cursor-pointer hover:underline">
                Apply here
              </span>{" "}
              — coming in Phase 2.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default RoleSelectPage;