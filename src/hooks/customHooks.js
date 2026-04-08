import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

// ─── Base Hooks ───────────────────────────────────────────
export const useAppDispatch = useDispatch
export const useAppSelector = useSelector

export function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debouncedValue
}

// ─── Auth Hooks ───────────────────────────────────────────
import {
  selectCurrentUser,
  selectAuthToken,
  selectIsAuthenticated,
  selectIsAdmin,
  selectAuthStatus,
  selectProfileStatus,
  selectAuthError,
} from '../features/auth/authSlice'

export const useCurrentUser = () => useAppSelector(selectCurrentUser)
export const useAuthToken = () => useAppSelector(selectAuthToken)
export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated)
export const useIsAdmin = () => useAppSelector(selectIsAdmin)
export const useAuthStatus = () => useAppSelector(selectAuthStatus)
export const useProfileStatus = () => useAppSelector(selectProfileStatus)
export const useAuthError = () => useAppSelector(selectAuthError)

// ─── Cart Hooks ───────────────────────────────────────────
import {
  selectCartItems,
  selectShippingAddress,
  selectCartStatus,
  selectCheckoutStatus,
  selectCartError,
  selectCartCount,
  selectCartTotal,
} from '../features/cart/cartSlice'

export const useCartItems = () => useAppSelector(selectCartItems)
export const useShippingAddress = () => useAppSelector(selectShippingAddress)
export const useCartStatus = () => useAppSelector(selectCartStatus)
export const useCheckoutStatus = () => useAppSelector(selectCheckoutStatus)
export const useCartError = () => useAppSelector(selectCartError)
export const useCartCount = () => useAppSelector(selectCartCount)
export const useCartTotal = () => useAppSelector(selectCartTotal)

// ─── Products Hooks ───────────────────────────────────────
import {
  selectAllProducts,
  selectSelectedProduct,
  selectProductFilters,
  selectProductTotal,
  selectProductPages,
  selectProductStatus,
  selectDetailStatus,
  selectMutationStatus,
  selectProductError,
} from '../features/products/productSlice'

export const useProducts = () => useAppSelector(selectAllProducts)
export const useSelectedProduct = () => useAppSelector(selectSelectedProduct)
export const useProductFilters = () => useAppSelector(selectProductFilters)
export const useProductTotal = () => useAppSelector(selectProductTotal)
export const useProductPages = () => useAppSelector(selectProductPages)
export const useProductStatus = () => useAppSelector(selectProductStatus)
export const useProductDetailStatus = () => useAppSelector(selectDetailStatus)
export const useProductMutationStatus = () =>
  useAppSelector(selectMutationStatus)
export const useProductError = () => useAppSelector(selectProductError)

// ─── Orders Hooks ─────────────────────────────────────────
import {
  selectAllOrders,
  selectSelectedOrder,
  selectOrderStatus,
  selectDetailStatus as selectOrderDetailStatus,
  selectOrderError,
} from '../features/orders/orderSlice'

export const useOrders = () => useAppSelector(selectAllOrders)
export const useSelectedOrder = () => useAppSelector(selectSelectedOrder)
export const useOrderStatus = () => useAppSelector(selectOrderStatus)
export const useOrderDetailStatus = () =>
  useAppSelector(selectOrderDetailStatus)
export const useOrderError = () => useAppSelector(selectOrderError)

// ─── Admin Hooks ──────────────────────────────────────────
import {
  selectAllUsers,
  selectUsersStatus,
  selectMutationStatus as selectAdminMutationStatus,
  selectAdminError,
} from '../features/admin/adminSlice'

export const useAllUsers = () => useAppSelector(selectAllUsers)
export const useUsersStatus = () => useAppSelector(selectUsersStatus)
export const useAdminMutationStatus = () =>
  useAppSelector(selectAdminMutationStatus)
export const useAdminError = () => useAppSelector(selectAdminError)

// ─── UI Hooks ─────────────────────────────────────────────
import { selectToasts } from '../features/ui/uiSlice'

export const useToasts = () => useAppSelector(selectToasts)
