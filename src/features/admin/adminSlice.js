import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchUsersAPI,
  updateUserRoleAPI,
  deactivateUserAPI,
  createAdminAPI,
} from './adminAPI'
import { getErrorMessage } from '../../utils/helpers'
import { fulfilled, pending, rejected } from '../../app/sliceHelpers'

const initialState = {
  users: [],
  usersStatus: 'idle',
  mutationStatus: 'idle',
  error: null,
}

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, thunkApi) => {
    try {
      return await fetchUsersAPI()
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to fetch users')
      )
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async (payload, thunkApi) => {
    try {
      return await updateUserRoleAPI(payload)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to update user')
      )
    }
  }
)

export const deactivateUser = createAsyncThunk(
  'admin/deactivateUser',
  async (userId, thunkApi) => {
    try {
      return await deactivateUserAPI(userId)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to deactivate user')
      )
    }
  }
)

export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (payload, thunkApi) => {
    try {
      return await createAdminAPI(payload)
    } catch (error) {
      return thunkApi.rejectWithValue(
        getErrorMessage(error, 'Unable to create admin')
      )
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetAdminStatus(state) {
      state.usersStatus = 'idle'
      state.mutationStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, pending('usersStatus'))
      .addCase(fetchUsers.rejected, rejected('usersStatus'))
      .addCase(fetchUsers.fulfilled, (state, action) => {
        fulfilled('usersStatus')(state)
        state.users = action.payload.users || []
      })
      .addCase(updateUserRole.pending, pending('mutationStatus'))
      .addCase(updateUserRole.rejected, rejected('mutationStatus'))
      .addCase(updateUserRole.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        const updatedUser = action.payload.user || action.payload
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      })
      .addCase(deactivateUser.pending, pending('mutationStatus'))
      .addCase(deactivateUser.rejected, rejected('mutationStatus'))
      .addCase(deactivateUser.fulfilled, (state, action) => {
        fulfilled('mutationStatus')(state)
        const updated = action.payload.user || action.payload
        state.users = state.users.map((u) =>
          u._id === updated._id ? updated : u
        )
      })
      .addCase(createAdmin.pending, pending('mutationStatus'))
      .addCase(createAdmin.rejected, rejected('mutationStatus'))
      .addCase(createAdmin.fulfilled, fulfilled('mutationStatus'))
  },
})

export const { resetAdminStatus } = adminSlice.actions
export default adminSlice.reducer

// ─── Selectors ────────────────────────────────────────────
export const selectAllUsers = (state) => state.admin.users
export const selectUsersStatus = (state) => state.admin.usersStatus
export const selectMutationStatus = (state) => state.admin.mutationStatus
export const selectAdminError = (state) => state.admin.error
