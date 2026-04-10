/* ===== ADMIN SLICE ===== */
/* Manages admin operations (user management, product management) */
/* Restricted to users with admin role */

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createAdminAPI,
  deactivateUserAPI,
  fetchUsersAPI,
  updateUserRoleAPI,
} from './adminAPI'
import { getErrorMessage } from '../../utils/helpers'
import { fulfilled, pending, rejected } from '../../app/sliceHelpers'

const initialState = {
  users: [],
  status: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, thunkApi) => {
    try {
      return await fetchUsersAPI()
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to fetch users')
      )
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async (payload, thunkApi) => {
    try {
      return await updateUserRoleAPI(payload)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to update role')
      )
    }
  }
)

export const deactivateUser = createAsyncThunk(
  'admin/deactivateUser',
  async (id, thunkApi) => {
    try {
      return await deactivateUserAPI(id)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to deactivate user')
      )
    }
  }
)

export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (payload, thunkApi) => {
    try {
      return await createAdminAPI(payload)
    } catch (err) {
      return thunkApi.rejectWithValue(
        getErrorMessage(err, 'Unable to create admin')
      )
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetAdminStatus(state) {
      state.status = 'idle'
      state.mutationStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, pending())
      .addCase(fetchUsers.rejected, rejected())
      .addCase(fetchUsers.fulfilled, (state, action) => {
        fulfilled()(state)
        state.users = action.payload.users || action.payload || []
      })
      .addCase(updateUserRole.pending, pending('mutationStatus'))
      .addCase(updateUserRole.rejected, rejected('mutationStatus'))
      .addCase(updateUserRole.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        const u = action.payload.user || action.payload
        state.users = state.users.map((x) => (x._id === u._id ? u : x))
      })
      .addCase(deactivateUser.pending, pending('mutationStatus'))
      .addCase(deactivateUser.rejected, rejected('mutationStatus'))
      .addCase(deactivateUser.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        const u = action.payload.user || action.payload
        state.users = state.users.map((x) => (x._id === u._id ? u : x))
      })
      .addCase(createAdmin.pending, pending('mutationStatus'))
      .addCase(createAdmin.rejected, rejected('mutationStatus'))
      .addCase(createAdmin.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        state.users.unshift(action.payload)
      })
  },
})

export const { resetAdminStatus } = adminSlice.actions
export default adminSlice.reducer

export const selectAllUsers = (s) => s.admin.users
export const selectUsersStatus = (s) => s.admin.status
export const selectMutationStatus = (s) => s.admin.mutationStatus
export const selectAdminError = (s) => s.admin.error
