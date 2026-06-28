import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../src/context/Authcontext";
import MainLayout from "../src/layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RoleSelectPage from "./pages/RoleSelectPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Requires login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/role-select" element={<RoleSelectPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Buyer only */}
                <Route element={<RoleRoute allowedRoles={["BUYER"]} />}>
                  {/* Phase 3: cart, orders go here */}
                </Route>

                {/* Seller only */}
                <Route element={<RoleRoute allowedRoles={["SELLER"]} />}>
                  {/* Phase 2: store, products go here */}
                </Route>

                {/* Driver only */}
                <Route element={<RoleRoute allowedRoles={["DRIVER"]} />}>
                  {/* Phase 5: driver dashboard goes here */}
                </Route>

                {/* Admin only */}
                <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                  {/* Phase 6: admin dashboard goes here */}
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;