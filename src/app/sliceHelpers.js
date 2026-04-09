// Shared async state helpers — used by every Redux slice
// Eliminates boilerplate for pending/fulfilled/rejected lifecycle cases.

export const pending = (statusKey = 'status') => (state) => {
  state[statusKey] = 'loading'
  state.error = null
}

export const fulfilled = (statusKey = 'status') => (state) => {
  state[statusKey] = 'succeeded'
}

export const rejected = (statusKey = 'status') => (state, action) => {
  state[statusKey] = 'failed'
  state.error = action.payload ?? 'Something went wrong'
}
