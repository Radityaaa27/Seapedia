import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

// This page acts as a smart redirect — it sends users to
// their role-specific dashboard automatically
const DashboardPage = () => {
  const { activeRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (activeRole === "SELLER") navigate("/seller/store", { replace: true });
    else if (activeRole === "DRIVER") navigate("/driver/dashboard", { replace: true });
    else if (activeRole === "ADMIN") navigate("/admin/dashboard", { replace: true });
    else navigate("/buyer/dashboard", { replace: true });
  }, [activeRole, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );
};

export default DashboardPage;