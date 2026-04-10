/* ===== AUTHENTICATION SLICE ===== */
/* Manages user authentication state (login, register, logout, profile) */
/* Persists session in localStorage for persistent login */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
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
      return thunkApi.rejectWithValue(getErrorMessage(err, 'Login failed'))
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkApi) => {
    try {
      return await registerAPI(credentials)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Registration failed')
      )
    }
  }
)

export const getProfile = createAsyncThunk(
  'auth/profile',
  async (_, thunkApi) => {
    try {
      return await fetchProfileAPI()
    } catch {
      return null
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
        state.user = action.payload.user
        state.token = action.payload.token
        saveSession({ user: action.payload.user, token: action.payload.token })
      })
      .addCase(register.pending, pending())
      .addCase(register.rejected, rejected())
      .addCase(register.fulfilled, (state, action) => {
        fulfilled()(state)
        state.user = action.payload.user
        state.token = action.payload.token
        saveSession({ user: action.payload.user, token: action.payload.token })
      })
      .addCase(getProfile.pending, pending('profileStatus'))
      .addCase(getProfile.rejected, rejected('profileStatus'))
      .addCase(getProfile.fulfilled, (state, action) => {
        fulfilled('profileStatus')(state)
        if (action.payload) state.user = action.payload.user || action.payload
      })
  },
})

export const { logout, resetAuthStatus } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUser = (s) => s.auth.user
export const selectAuthToken = (s) => s.auth.token
export const selectIsAuthenticated = (s) => !!s.auth.token
export const selectIsAdmin = (s) => s.auth.user?.role === 'admin'
export const selectAuthStatus = (s) => s.auth.status
export const selectProfileStatus = (s) => s.auth.profileStatus
export const selectAuthError = (s) => s.auth.error
