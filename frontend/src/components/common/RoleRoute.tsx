import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { RoleType } from "../../types/auth.types";

interface RoleRouteProps {
  allowedRoles: RoleType[];
}

// Extends ProtectedRoute by also checking the active role.
// Usage:
//   <Route element={<RoleRoute allowedRoles={["SELLER"]} />}>
//     <Route path="/seller/dashboard" element={<SellerDashboard />} />
//   </Route>

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { isAuthenticated, activeRole, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!activeRole || !allowedRoles.includes(activeRole)) {
    return <Navigate to="/role-select" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;