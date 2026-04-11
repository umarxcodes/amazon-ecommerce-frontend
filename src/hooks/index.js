/* ===== CUSTOM HOOKS LIBRARY ===== */
/* Centralized hooks for Redux state access and actions */
/* Provides typed selectors and dispatchers across the app */

import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useCallback } from 'react'

// Base hooks
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector

export function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debouncedValue
}

// Auth hooks
import {
  selectCurrentUser,
  selectAuthToken,
  selectIsAuthenticated,
  selectIsAdmin,
  selectAuthStatus,
  selectProfileStatus,
  selectAuthError,
  login,
  register,
  logout,
} from '../features/auth/authSlice'
export const useCurrentUser = () => useAppSelector(selectCurrentUser)
export const useAuthToken = () => useAppSelector(selectAuthToken)
export const useIsAuthenticated = () => useAppSelector(selectIsAuthenticated)
export const useIsAdmin = () => useAppSelector(selectIsAdmin)
export const useAuthStatus = () => useAppSelector(selectAuthStatus)
export const useProfileStatus = () => useAppSelector(selectProfileStatus)
export const useAuthError = () => useAppSelector(selectAuthError)

export const useLogin = () => {
  const dispatch = useAppDispatch()
  return useCallback((credentials) => dispatch(login(credentials)), [dispatch])
}
export const useRegister = () => {
  const dispatch = useAppDispatch()
  return useCallback(
    (credentials) => dispatch(register(credentials)),
    [dispatch]
  )
}
export const useLogout = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(logout()), [dispatch])
}

// Cart hooks
import {
  selectCartItems,
  selectShippingAddress,
  selectCartStatus,
  selectCheckoutStatus,
  selectCartError,
  selectCartCount,
  selectCartTotal,
  fetchCart,
  addItemToCart,
  updateItemQuantity,
  removeItem,
  clearBackendCart,
} from '../features/cart/cartSlice'
export const useCartItems = () => useAppSelector(selectCartItems)
export const useShippingAddress = () => useAppSelector(selectShippingAddress)
export const useCartStatus = () => useAppSelector(selectCartStatus)
export const useCheckoutStatus = () => useAppSelector(selectCheckoutStatus)
export const useCartError = () => useAppSelector(selectCartError)
export const useCartCount = () => useAppSelector(selectCartCount)
export const useCartTotal = () => useAppSelector(selectCartTotal)

export const useFetchCart = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(fetchCart()), [dispatch])
}
export const useAddToCart = () => {
  const dispatch = useAppDispatch()
  return useCallback((payload) => dispatch(addItemToCart(payload)), [dispatch])
}
export const useUpdateQty = () => {
  const dispatch = useAppDispatch()
  return useCallback(
    (payload) => dispatch(updateItemQuantity(payload)),
    [dispatch]
  )
}
export const useRemoveItem = () => {
  const dispatch = useAppDispatch()
  return useCallback((id) => dispatch(removeItem(id)), [dispatch])
}
export const useClearCart = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(clearBackendCart()), [dispatch])
}

// Products hooks
import {
  selectAllProducts,
  selectSelectedProduct,
  selectProductFilters,
  selectProductTotal,
  selectProductPages,
  selectProductStatus,
  selectDetailStatus as selectProductDetailStatus,
  selectMutationStatus as selectProductMutationStatus,
  selectProductError,
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../features/products/productSlice'
export const useProducts = () => useAppSelector(selectAllProducts)
export const useSelectedProduct = () => useAppSelector(selectSelectedProduct)
export const useProductFilters = () => useAppSelector(selectProductFilters)
export const useProductTotal = () => useAppSelector(selectProductTotal)
export const useProductPages = () => useAppSelector(selectProductPages)
export const useProductStatus = () => useAppSelector(selectProductStatus)
export const useProductDetailStatus = () =>
  useAppSelector(selectProductDetailStatus)
export const useProductMutationStatus = () =>
  useAppSelector(selectProductMutationStatus)
export const useProductError = () => useAppSelector(selectProductError)

export const useFetchProducts = () => {
  const dispatch = useAppDispatch()
  return useCallback((params) => dispatch(fetchProducts(params)), [dispatch])
}
export const useFetchProductById = () => {
  const dispatch = useAppDispatch()
  return useCallback((id) => dispatch(fetchProductById(id)), [dispatch])
}
export const useCreateProduct = () => {
  const dispatch = useAppDispatch()
  return useCallback((payload) => dispatch(createProduct(payload)), [dispatch])
}
export const useUpdateProduct = () => {
  const dispatch = useAppDispatch()
  return useCallback((payload) => dispatch(updateProduct(payload)), [dispatch])
}
export const useDeleteProduct = () => {
  const dispatch = useAppDispatch()
  return useCallback((id) => dispatch(deleteProduct(id)), [dispatch])
}

// Orders hooks
import {
  selectAllOrders,
  selectSelectedOrder,
  selectOrderStatus,
  selectDetailStatus as selectOrderDetailStatus,
  selectOrderError,
  selectCreateOrderStatus,
  selectCheckoutStatus as selectOrderCheckoutStatus,
  fetchOrders,
  fetchOrderById,
  createOrder,
  startCheckout,
} from '../features/orders/orderSlice'
export const useOrders = () => useAppSelector(selectAllOrders)
export const useSelectedOrder = () => useAppSelector(selectSelectedOrder)
export const useOrderStatus = () => useAppSelector(selectOrderStatus)
export const useOrderDetailStatus = () =>
  useAppSelector(selectOrderDetailStatus)
export const useOrderError = () => useAppSelector(selectOrderError)
export const useCreateOrderStatus = () =>
  useAppSelector(selectCreateOrderStatus)
export const useOrderCheckoutStatus = () =>
  useAppSelector(selectOrderCheckoutStatus)

export const useFetchOrders = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(fetchOrders()), [dispatch])
}
export const useFetchOrderById = () => {
  const dispatch = useAppDispatch()
  return useCallback((id) => dispatch(fetchOrderById(id)), [dispatch])
}
export const useCreateOrder = () => {
  const dispatch = useAppDispatch()
  return useCallback((payload) => dispatch(createOrder(payload)), [dispatch])
}
export const useStartCheckout = () => {
  const dispatch = useAppDispatch()
  return useCallback((id) => dispatch(startCheckout(id)), [dispatch])
}

// Admin hooks
import {
  selectAllUsers,
  selectUsersStatus,
  selectMutationStatus as selectAdminMutationStatus,
  selectAdminError,
  fetchUsers,
  updateUserRole,
  deactivateUser,
  createAdmin,
} from '../features/admin/adminSlice'
export const useAllUsers = () => useAppSelector(selectAllUsers)
export const useUsersStatus = () => useAppSelector(selectUsersStatus)
export const useAdminMutationStatus = () =>
  useAppSelector(selectAdminMutationStatus)
export const useAdminError = () => useAppSelector(selectAdminError)

export const useFetchUsers = () => {
  const dispatch = useAppDispatch()
  return useCallback(() => dispatch(fetchUsers()), [dispatch])
}
export const useUpdateUserRole = () => {
  const dispatch = useAppDispatch()
  return useCallback((payload) => dispatch(updateUserRole(payload)), [dispatch])
}
export const useDeactivateUser = () => {
  const dispatch = useAppDispatch()
  return useCallback((id) => dispatch(deactivateUser(id)), [dispatch])
}
export const useCreateAdmin = () => {
  const dispatch = useAppDispatch()
  return useCallback((payload) => dispatch(createAdmin(payload)), [dispatch])
}

// UI hooks
import { selectToasts, selectIsRedirecting } from '../features/ui/uiSlice'
export const useToasts = () => useAppSelector(selectToasts)
export const useIsRedirecting = () => useAppSelector(selectIsRedirecting)
