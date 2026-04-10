import { createSlice, nanoid } from '@reduxjs/toolkit'

const initialState = {
  toasts: [],
  isRedirecting: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: {
      prepare({ title, message, type = 'info', duration = 3500 }) {
        return { payload: { id: nanoid(), title, message, type, duration } }
      },
      reducer(state, action) { state.toasts.push(action.payload) },
    },
    removeToast(state, action) { state.toasts = state.toasts.filter((t) => t.id !== action.payload) },
    setRedirecting(state, action) { state.isRedirecting = action.payload },
  },
})

export const { addToast, removeToast, setRedirecting } = uiSlice.actions
export default uiSlice.reducer

export const selectToasts = (s) => s.ui.toasts
export const selectIsRedirecting = (s) => s.ui.isRedirecting
