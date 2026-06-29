import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RoleSelectPage from "./pages/RoleSelectPage";
import ProductsPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CreateStorePage from "./pages/seller/CreateStorePage";
import MyStorePage from "./pages/seller/MyStorePage";
import CreateProductPage from "./pages/seller/CreateProductPage";
import SellerOrdersPage from "./pages/seller/SellerOrderPage";
import WalletPage from "./pages/buyer/WalletPage";
import AddressPage from "./pages/buyer/AddressPage";
import CartPage from "./pages/buyer/CartPage";
import CheckoutPage from "./pages/buyer/CheckOutPage";
import OrdersPage from "./pages/buyer/OrderPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>

                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route
                  path="/products/:storeSlug/:productSlug"
                  element={<ProductDetailPage />}
                />

                {/* Protected */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/role-select" element={<RoleSelectPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/addresses" element={<AddressPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/orders/:id" element={<OrdersPage />} />
                  <Route
                    path="/seller/create-store"
                    element={<CreateStorePage />}
                  />

                  {/* Seller */}
                  <Route element={<RoleRoute allowedRoles={["SELLER"]} />}>
                    <Route path="/seller/store" element={<MyStorePage />} />
                    <Route
                      path="/seller/products/create"
                      element={<CreateProductPage />}
                    />
                    <Route
                      path="/seller/orders"
                      element={<SellerOrdersPage />}
                    />
                  </Route>

                  {/* Driver — Phase 5 */}
                  <Route element={<RoleRoute allowedRoles={["DRIVER"]} />}>
                  </Route>

                  {/* Admin — Phase 6 */}
                  <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                  </Route>
                </Route>

              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;