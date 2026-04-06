import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '../components/Layout/AppShell'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'

const Home = lazy(() => import('../pages/Home'))
const ProductDetail = lazy(() => import('../pages/ProductDetail'))
const Cart = lazy(() => import('../pages/Cart'))
const Checkout = lazy(() => import('../pages/Checkout'))
const Orders = lazy(() => import('../pages/Orders'))
const OrderDetail = lazy(() => import('../pages/OrderDetail'))
const Login = lazy(() => import('../pages/Login'))
const Register = lazy(() => import('../pages/Register'))
const AdminProducts = lazy(() => import('../pages/AdminProducts'))
const AdminUsers = lazy(() => import('../pages/AdminUsers'))
const NotFound = lazy(() => import('../pages/NotFound'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner label="Preparing storefront..." />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
