import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchUsersAPI, updateUserRoleAPI } from './adminAPI'
import { getErrorMessage } from '../../utils/helpers'

const initialState = {
  users: [],
  status: 'idle',
  error: null,
}

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, thunkApi) => {
  try {
    return await fetchUsersAPI()
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to fetch users'))
  }
})

export const updateUserRole = createAsyncThunk('admin/updateUserRole', async (payload, thunkApi) => {
  try {
    return await updateUserRoleAPI(payload)
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error, 'Unable to update user'))
  }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.users = action.payload.users || []
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload.user || action.payload
        state.users = state.users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      })
  },
})

export default adminSlice.reducer
