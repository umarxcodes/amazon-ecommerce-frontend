import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: {
      reducer(state, action) {
        state.toasts.push(action.payload)
      },
      prepare({ title, message, type = 'info' }) {
        return {
          payload: {
            id: nanoid(),
            title,
            message,
            type,
          },
        }
      },
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer

// ─── Selectors ────────────────────────────────────────────
export const selectToasts = (state) => state.ui.toasts
