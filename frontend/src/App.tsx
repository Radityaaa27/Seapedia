import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../src/context/Authcontext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RoleSelectPage from "./pages/RoleSelectPage";
import CreateStorePage from "./pages/seller/CreateStorePage";
import MyStorePage from "./pages/seller/MyStorePage";

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

                {/* Seller routes */}
                <Route element={<RoleRoute allowedRoles={["SELLER"]} />}>
                  <Route path="/seller/store" element={<MyStorePage />} />
                </Route>

                {/* Create store — any logged in user */}
                <Route path="/seller/create-store" element={<CreateStorePage />} />

                {/* Buyer only — Phase 3 */}
                <Route element={<RoleRoute allowedRoles={["BUYER"]} />}>
                </Route>

                {/* Driver only — Phase 5 */}
                <Route element={<RoleRoute allowedRoles={["DRIVER"]} />}>
                </Route>

                {/* Admin only — Phase 6 */}
                <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
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