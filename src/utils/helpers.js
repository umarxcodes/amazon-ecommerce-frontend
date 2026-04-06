const SESSION_KEY = 'amazon_clone_session'
const CART_KEY = 'amazon_clone_cart'

export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

export function formatDate(value) {
  if (!value) return 'N/A'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
}

export function getErrorMessage(error, fallback) {
  return error?.message || fallback
}

export function debounce(fn, wait = 250) {
  let timeoutId

  return (...args) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn(...args), wait)
  }
}
