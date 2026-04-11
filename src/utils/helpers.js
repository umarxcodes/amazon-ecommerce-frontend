/* ===== UTILITY FUNCTIONS ===== */
/* Shared helpers for formatting, storage, debounce, error messages */
/* Used across components and Redux slices */

const SESSION_KEY = 'amazon_clone_session'
const CART_KEY = 'amazon_clone_cart'

export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '$0.00'
  return `$${Number(amount).toFixed(2)}`
}

export function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Support both old array format and new object format
    if (Array.isArray(parsed)) return { items: parsed, shippingAddress: null }
    return parsed
  } catch {
    return null
  }
}

export function saveCart(data) {
  // Accept both array and object formats
  const toSave = Array.isArray(data)
    ? { items: data, shippingAddress: null }
    : data
  localStorage.setItem(CART_KEY, JSON.stringify(toSave))
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return fallback
}

export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
