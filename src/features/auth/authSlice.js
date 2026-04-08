import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchProfile, loginUser, registerUser } from './authAPI'
import {
  clearSession,
  getErrorMessage,
  loadSession,
  saveSession,
} from '../../utils/helpers'
import { fulfilled, pending, rejected } from '../../app/sliceHelpers'

const persistedSession = loadSession()

const initialState = {
  user: persistedSession?.user || null,
  token: persistedSession?.token || null,
  status: 'idle',
  profileStatus: 'idle',
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, thunkApi) => {
    try {
      return await loginUser(credentials)
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error, 'Login failed'))
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload, thunkApi) => {
    try {
      return await registerUser(payload)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Registration failed')
      )
    }
  }
)

export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, thunkApi) => {
    try {
      return await fetchProfile()
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to load profile')
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
      state.profileStatus = 'idle'
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
        state.user = action.payload.user
        state.token = action.payload.token
        saveSession(action.payload)
      })
      .addCase(register.pending, pending())
      .addCase(register.rejected, rejected())
      .addCase(register.fulfilled, (state, action) => {
        fulfilled()(state)
        state.user = action.payload.user
        state.token = action.payload.token
        saveSession(action.payload)
      })
      .addCase(getProfile.pending, pending('profileStatus'))
      .addCase(getProfile.rejected, rejected('profileStatus'))
      .addCase(getProfile.fulfilled, (state, action) => {
        fulfilled('profileStatus')(state)
        state.user = action.payload.user
      })
  },
})

export const { logout, resetAuthStatus } = authSlice.actions
export default authSlice.reducer

// ─── Selectors ────────────────────────────────────────────
export const selectCurrentUser = (state) => state.auth.user
export const selectAuthToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => Boolean(state.auth.token)
export const selectIsAdmin = (state) => state.auth.user?.role === 'ADMIN'
export const selectAuthStatus = (state) => state.auth.status
export const selectProfileStatus = (state) => state.auth.profileStatus
export const selectAuthError = (state) => state.auth.error
