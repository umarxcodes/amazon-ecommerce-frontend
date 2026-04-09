import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../layout/Layout'
import HomePage from '../pages/Home/HomePage'
import CartPage from '../pages/Cart/CartPage'
import LoginPage from '../pages/Login/LoginPage'
import RegistrationPage from '../pages/Registration/RegistrationPage'
import NotFoundPage from '../pages/NotFound/NotFound'
import AdminProductsPage from '../pages/AdminProductsPage/AdminProductsPage'
import AdminUsersPage from '../pages/AdminUsersPage/AdminUsersPage'
import Checkout from '../pages/Checkout'
import Orders from '../pages/Orders'
import OrderDetail from '../pages/OrderDetail'
import ProductDetail from '../pages/ProductDetail'
import AdminRoute from './AdminRoute'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />

      {/* Routes with Layout wrapper */}
      <Route element={<Layout />}>
        <Route path="/products" element={<ProductDetail />} />
        <Route path="/products/:productId" element={<ProductDetail />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
