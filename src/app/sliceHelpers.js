/* ===== REDUX SLICE HELPERS ===== */
/* Reusable pending/fulfilled/rejected handlers for async thunks */
/* Reduces boilerplate in Redux slice extraReducers */

export const pending =
  (key = 'status') =>
  (state) => {
    state[key] = 'loading'
    state.error = null
  }
export const fulfilled =
  (key = 'status') =>
  (state) => {
    state[key] = 'succeeded'
  }
export const rejected =
  (key = 'status') =>
  (state, action) => {
    state[key] = 'failed'
    state.error = action.payload || 'Request failed'
  }
