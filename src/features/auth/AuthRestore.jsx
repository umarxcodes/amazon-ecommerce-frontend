/* ===== AUTH RESTORE COMPONENT ===== */
/* Rehydrates session from localStorage on app load */
/* Placed in App.jsx to run on every app initialization */

import { useEffect } from 'react'
import { useAppDispatch, useAuthToken, useIsAuthenticated } from '../../hooks'
import { restoreSession } from './authSlice'
import { fetchCart } from '../cart/cartSlice'

export default function AuthRestore() {
  const dispatch = useAppDispatch()
  const token = useAuthToken()
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    // Rehydrate auth state from localStorage
    dispatch(restoreSession())
  }, [dispatch])

  useEffect(() => {
    if (token && isAuthenticated) {
      // Restore cart from backend once authenticated
      dispatch(fetchCart())
    }
  }, [dispatch, token, isAuthenticated])

  return null
}
