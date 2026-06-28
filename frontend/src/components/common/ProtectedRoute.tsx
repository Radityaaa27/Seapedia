import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Wraps routes that require authentication.
// If not logged in → redirect to /login.
// If still loading session → show nothing (avoids flash of redirect).

const ProtectedRoute = () => {
    const {isAuthenticated,isLoading} = useAuth();
    if (isLoading) return null;

    return isAuthenticated ? <Outlet/> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;