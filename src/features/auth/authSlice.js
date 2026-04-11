/* ===== AUTHENTICATION SLICE ===== */
/* Manages user authentication state (login, register, logout, profile) */
/* Persists session in localStorage for persistent login */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import { loginAPI, registerAPI, fetchProfileAPI } from './authAPI'
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
  profileStatus: 'idle',
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkApi) => {
    try {
      return await loginAPI(credentials)
    } catch (err) {
      const msg = getErrorMessage(err, 'Login failed')
      // Normalize 401 errors
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
      // Normalize 409 conflicts
      if (err.response?.status === 409) {
        return thunkApi.rejectWithValue('Email already exists.')
      }
      return thunkApi.rejectWithValue(msg)
    }
  }
)

export const getProfile = createAsyncThunk(
  'auth/profile',
  async (_, thunkApi) => {
    try {
      return await fetchProfileAPI()
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Failed to fetch profile')
      )
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
        const { user, accessToken } = action.payload.data
        state.user = user
        state.token = accessToken
        saveSession({ user, token: accessToken })
      })
      .addCase(getProfile.pending, pending('profileStatus'))
      .addCase(getProfile.rejected, (state, action) => {
        rejected('profileStatus')(state, action)
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        fulfilled('profileStatus')(state)
        if (action.payload) state.user = action.payload.user || action.payload
      })
  },
})

export const { logout, resetAuthStatus } = authSlice.actions
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
export const selectProfileStatus = createSelector(
  [selectAuthState],
  (auth) => auth.profileStatus
)
export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
)
