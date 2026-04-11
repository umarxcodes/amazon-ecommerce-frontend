/* ===== APPLICATION ROUTES ===== */
/* Defines all routes with lazy loading and route guards (Protected/Admin) */

import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../layout/Layout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import LoadingSpinner from '../components/shared/LoadingSpinner'

const HomePage = lazy(() => import('../pages/home/HomePage'))
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'))
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'))
const AccountPage = lazy(() => import('../pages/AccountPage/AccountPage'))
const ProductsPage = lazy(() => import('../pages/ProductsPage/ProductsPage'))
const ProductDetailPage = lazy(
  () => import('../pages/ProductDetailPage/ProductDetailPage')
)
const CartPage = lazy(() => import('../pages/CartPage/CartPage'))
const CheckoutPage = lazy(() => import('../pages/CheckoutPage/CheckoutPage'))
const GamingPage = lazy(() => import('../pages/GamingPage/GamingPage'))
const OrdersPage = lazy(() => import('../pages/OrdersPage/OrdersPage'))
const OrderDetailPage = lazy(
  () => import('../pages/OrderDetailPage/OrderDetailPage')
)
const PaymentReturnPage = lazy(
  () => import('../pages/PaymentReturnPage/PaymentReturnPage')
)
const AdminProductsPage = lazy(
  () => import('../pages/AdminProductsPage/AdminProductsPage')
)
const AdminUsersPage = lazy(
  () => import('../pages/AdminUsersPage/AdminUsersPage')
)
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'))

const SuspensePage = ({ children }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>
)

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route
          index
          element={
            <SuspensePage>
              <HomePage />
            </SuspensePage>
          }
        />
        <Route
          path="/login"
          element={
            <SuspensePage>
              <LoginPage />
            </SuspensePage>
          }
        />
        <Route
          path="/register"
          element={
            <SuspensePage>
              <RegisterPage />
            </SuspensePage>
          }
        />
        <Route
          path="/products"
          element={
            <SuspensePage>
              <ProductsPage />
            </SuspensePage>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <SuspensePage>
              <ProductDetailPage />
            </SuspensePage>
          }
        />
        <Route
          path="/gaming"
          element={
            <SuspensePage>
              <GamingPage />
            </SuspensePage>
          }
        />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/account"
            element={
              <SuspensePage>
                <AccountPage />
              </SuspensePage>
            }
          />
          <Route
            path="/cart"
            element={
              <SuspensePage>
                <CartPage />
              </SuspensePage>
            }
          />
          <Route
            path="/checkout"
            element={
              <SuspensePage>
                <CheckoutPage />
              </SuspensePage>
            }
          />
          <Route
            path="/orders"
            element={
              <SuspensePage>
                <OrdersPage />
              </SuspensePage>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <SuspensePage>
                <OrderDetailPage />
              </SuspensePage>
            }
          />
          <Route
            path="/payment/return/:orderId"
            element={
              <SuspensePage>
                <PaymentReturnPage />
              </SuspensePage>
            }
          />
        </Route>

        {/* ===== ADMIN ROUTES ===== */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin/products"
            element={
              <SuspensePage>
                <AdminProductsPage />
              </SuspensePage>
            }
          />
          <Route
            path="/admin/users"
            element={
              <SuspensePage>
                <AdminUsersPage />
              </SuspensePage>
            }
          />
        </Route>

        {/* ===== FALLBACK ROUTES ===== */}
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
