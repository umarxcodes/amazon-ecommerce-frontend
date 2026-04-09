import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../layout/Layout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const HomePage = lazy(() => import('../pages/home/HomePage'))
const LoginPage = lazy(() => import('../pages/login/LoginPage'))
const RegisterPage = lazy(() => import('../pages/register/RegisterPage'))
const AccountPage = lazy(() => import('../pages/account/AccountPage'))
const ProductsPage = lazy(() => import('../pages/products/ProductsPage'))
const ProductDetailPage = lazy(
  () => import('../pages/product-detail/ProductDetailPage')
)
const CartPage = lazy(() => import('../pages/cart/CartPage'))
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'))
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage'))
const OrderDetailPage = lazy(
  () => import('../pages/order-detail/OrderDetailPage')
)
const AdminProductsPage = lazy(
  () => import('../pages/admin-products/AdminProductsPage')
)
const AdminUsersPage = lazy(() => import('../pages/admin-users/AdminUsersPage'))
const NotFoundPage = lazy(() => import('../pages/not-found/NotFound'))

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
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
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
