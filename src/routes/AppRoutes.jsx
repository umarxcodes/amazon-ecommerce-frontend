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
const OrdersPage = lazy(() => import('../pages/OrdersPage/OrdersPage'))
const OrderDetailPage = lazy(
  () => import('../pages/OrderDetailPage/OrderDetailPage')
)
const AdminProductsPage = lazy(
  () => import('../pages/AdminProductsPage/AdminProductsPage')
)
const AdminUsersPage = lazy(
  () => import('../pages/AdminUsersPage/AdminUsersPage')
)
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ===== PUBLIC ROUTES ===== */}
        {/* These routes are accessible without authentication */}

        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <HomePage />
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <RegisterPage />
            </Suspense>
          }
        />
        <Route
          path="/account"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <AccountPage />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <ProductsPage />
            </Suspense>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <ProductDetailPage />
            </Suspense>
          }
        />

        {/* ===== PROTECTED ROUTES ===== */}
        {/* These routes require authentication (ProtectedRoute guard) */}

        <Route element={<ProtectedRoute />}>
          <Route
            path="/cart"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <CartPage />
              </Suspense>
            }
          />
          <Route
            path="/checkout"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <CheckoutPage />
              </Suspense>
            }
          />
          <Route
            path="/orders"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <OrdersPage />
              </Suspense>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <OrderDetailPage />
              </Suspense>
            }
          />
        </Route>

        {/* ===== ADMIN ROUTES ===== */}
        {/* These routes require admin role (AdminRoute guard) */}

        <Route element={<AdminRoute />}>
          <Route
            path="/admin/products"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <AdminProductsPage />
              </Suspense>
            }
          />
          <Route
            path="/admin/users"
            element={
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <AdminUsersPage />
              </Suspense>
            }
          />
        </Route>

        {/* ===== FALLBACK ROUTES ===== */}
        {/* Catch-all route redirects to 404 page */}
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
