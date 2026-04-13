/* ===== AUTHENTICATION SLICE ===== */
/* Manages user authentication state (login, register, logout) */
/* Persists session in localStorage for persistent login */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import { loginAPI, registerAPI } from './authAPI'
import {
  getErrorMessage,
  loadSession,
  saveSession,
  clearSession,
} from '../../utils/helpers'
import { fulfilled, pending, rejected } from '../../app/sliceHelpers'

const session = loadSession()

const initialState = {
  user: session?.user || null,
  token: session?.token || null,
  status: 'idle',
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkApi) => {
    try {
      return await loginAPI(credentials)
    } catch (err) {
      const msg = getErrorMessage(err, 'Login failed')
      if (err.response?.status === 401) {
        return thunkApi.rejectWithValue('Invalid credentials.')
      }
      return thunkApi.rejectWithValue(msg)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkApi) => {
    try {
      return await registerAPI(credentials)
    } catch (err) {
      const msg = getErrorMessage(err, 'Registration failed')
      if (err.response?.status === 409) {
        return thunkApi.rejectWithValue('Email already exists.')
      }
      return thunkApi.rejectWithValue(msg)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
      clearSession()
    },
    restoreSession(state) {
      // Called on app init — rehydrate from localStorage
      state.user = session?.user || null
      state.token = session?.token || null
      state.status = 'idle'
      state.error = null
    },
    resetAuthStatus(state) {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, pending())
      .addCase(login.rejected, rejected())
      .addCase(login.fulfilled, (state, action) => {
        fulfilled()(state)
        const { user, accessToken } = action.payload.data
        state.user = user
        state.token = accessToken
        saveSession({ user, token: accessToken })
      })
      .addCase(register.pending, pending())
      .addCase(register.rejected, rejected())
      .addCase(register.fulfilled, (state, action) => {
        fulfilled()(state)
        // Backend register returns { success, message, data: user } — NO token
        // UI should redirect to /login after success
      })
  },
})

export const { logout, restoreSession, resetAuthStatus } = authSlice.actions
export default authSlice.reducer

// Memoized selectors
const selectAuthState = (s) => s.auth
export const selectCurrentUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
)
export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
)
export const selectIsAuthenticated = createSelector(
  [selectAuthToken],
  (token) => !!token
)
export const selectIsAdmin = createSelector(
  [selectCurrentUser],
  (user) => user?.role?.toLowerCase() === 'admin'
)
export const selectAuthStatus = createSelector(
  [selectAuthState],
  (auth) => auth.status
)
export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
)
