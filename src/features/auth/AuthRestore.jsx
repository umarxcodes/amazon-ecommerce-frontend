/* ===== AUTH RESTORE COMPONENT ===== */
/* Validates stored token on app load to restore session */
/* Placed in App.jsx to run on every app initialization */

import { useEffect, useRef } from 'react'
import { useAppDispatch, useAuthToken, useIsAuthenticated } from '../../hooks'
import { getProfile } from './authSlice'
import { fetchCart } from '../cart/cartSlice'

export default function AuthRestore() {
  const dispatch = useAppDispatch()
  const token = useAuthToken()
  const isAuthenticated = useIsAuthenticated()
  const hasAttemptedRef = useRef(false)

  useEffect(() => {
    if (hasAttemptedRef.current) return
    hasAttemptedRef.current = true

    if (token && isAuthenticated) {
      // Validate token by fetching profile
      dispatch(getProfile())
      // Also restore cart from backend
      dispatch(fetchCart())
    }
  }, [dispatch, token, isAuthenticated])

  return null
}
