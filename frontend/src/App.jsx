import { Navigate, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DiscoverProductsPage from "./pages/DiscoverProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AddProductPage from "./pages/AddProductPage";
import SellerOrdersPage from "./pages/SellerOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import { NavBar } from "./components/NavBar";

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem("userId");
  return userId ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <NavBar />
      <main className="container-shell pb-16 pt-8">
        <Routes>
          <Route path="/" element={<DiscoverProductsPage />} />
          <Route path="/products" element={<DiscoverProductsPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products/:productId" element={<ProductDetailsPage />} />
          <Route
            path="/checkout/:productId"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <ProtectedRoute>
                <AddProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller-orders"
            element={
              <ProtectedRoute>
                <SellerOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <footer className="border-t border-[#ebebeb] bg-[#f7f7f7]">
        <div className="container-shell grid gap-8 py-12 md:grid-cols-4">
          <div>
            <p className="mb-4 text-[16px] font-semibold text-[#222222]">Support</p>
            <div className="space-y-3">
              <p className="cursor-pointer text-[14px] text-[#6a6a6a] transition hover:text-[#222222]">Help Center</p>
              <p className="cursor-pointer text-[14px] text-[#6a6a6a] transition hover:text-[#222222]">Cancellation options</p>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[16px] font-semibold text-[#222222]">Buying</p>
            <div className="space-y-3">
              <p className="cursor-pointer text-[14px] text-[#6a6a6a] transition hover:text-[#222222]">How to shop</p>
              <p className="cursor-pointer text-[14px] text-[#6a6a6a] transition hover:text-[#222222]">COD policy</p>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[16px] font-semibold text-[#222222]">Selling</p>
            <div className="space-y-3">
              <p className="cursor-pointer text-[14px] text-[#6a6a6a] transition hover:text-[#222222]">List your products</p>
              <p className="cursor-pointer text-[14px] text-[#6a6a6a] transition hover:text-[#222222]">Seller dashboard</p>
            </div>
          </div>
          <div>
            <p className="mb-4 text-[16px] font-semibold text-[#222222]">Company</p>
            <div className="space-y-3">
              <p className="cursor-pointer text-[14px] text-[#6a6a6a] transition hover:text-[#222222]">About ECOM</p>
              <p className="cursor-pointer text-[14px] text-[#6a6a6a] transition hover:text-[#222222]">Careers</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
