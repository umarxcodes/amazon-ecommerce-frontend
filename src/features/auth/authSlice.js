import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchProfile, loginUser, registerUser } from './authAPI'
import { clearSession, getErrorMessage, loadSession, saveSession } from '../../utils/helpers'

const persistedSession = loadSession()

const initialState = {
  user: persistedSession?.user || null,
  token: persistedSession?.token || null,
  status: 'idle',
  error: null,
}

export const login = createAsyncThunk('auth/login', async (credentials, thunkApi) => {
  try {
    return await loginUser(credentials)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Login failed'))
  }
})

export const register = createAsyncThunk('auth/register', async (payload, thunkApi) => {
  try {
    return await registerUser(payload)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Registration failed'))
  }
})

export const getProfile = createAsyncThunk('auth/getProfile', async (_, thunkApi) => {
  try {
    return await fetchProfile()
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to load profile'))
  }
})

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        saveSession(action.payload)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        saveSession(action.payload)
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(getProfile.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
