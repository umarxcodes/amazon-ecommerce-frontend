/*
📁 FILE: AppRoutes.jsx
📌 PURPOSE: Application route configuration
======================================
*/

// =====*** IMPORTS ***=====
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../layout/Layout'
import Home from '../pages/Home'
import CartPage from '../pages/Cart/CartPage'
import LoginPage from '../pages/Login/Loginpage'
import NotFound from '../pages/NotFound/NotFound'
import RegistrationPage from '../pages/Registration/RegistrationPage'
import AdminRoute from './AdminRoute'
import AdminProductsPage from '../pages/AdminProductsPage/AdminProductsPage'
import AdminUsersPage from '../pages/AdminUsersPage/AdminUsersPage'
import Checkout from '../pages/Checkout'
import Orders from '../pages/Orders'
import OrderDetail from '../pages/OrderDetail'
import ProductDetail from '../pages/ProductDetail'

// =====*** ROUTES ***=====
export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route element={<Layout />}>
        <Route path="/CartPage" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
      </Route>

      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Registration" element={<RegistrationPage />} />

      <Route path="/login" element={<Navigate to="/Login" replace />} />
      <Route
        path="/register"
        element={<Navigate to="/Registration" replace />}
      />
      <Route path="/LoginPage" element={<Navigate to="/Login" replace />} />

      <Route path="/404" element={<NotFound />} />

      {/* Admin-only routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
