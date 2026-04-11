/* ===== LOGIN PAGE ===== */
/* User authentication form (email + password) with Yup validation */
/* Redirects to home on successful login, handles 401 errors */

import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAuthStatus, useAuthToken } from '../../hooks'
import { login } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'
import { loginSchema } from '../../features/auth/authSchemas'
import Button from '../../components/shared/Button'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const status = useAuthStatus()
  const hasToken = useAuthToken()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors] = useState({})

  const redirectPath = searchParams.get('redirect') || '/'

  useEffect(() => {
    if (hasToken) {
      navigate(redirectPath, { replace: true })
    }
  }, [hasToken, navigate, redirectPath])

  const validateField = async (name) => {
    try {
      await loginSchema.validateAt(name, { email, password })
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }))
    }
  }

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value)
    else setPassword(value)
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false })
    } catch (err) {
      const fieldErrors = {}
      err.inner.forEach((e) => {
        fieldErrors[e.path] = e.message
      })
      setErrors(fieldErrors)
      return
    }

    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Welcome back',
          message: `Signed in as ${result.payload.data?.user?.name ?? email}.`,
          type: 'success',
        })
      )
      navigate(redirectPath, { replace: true })
    } else {
      const msg = result.payload ?? 'Invalid credentials.'
      // Handle 401 specifically
      if (
        msg.toLowerCase().includes('unauthorized') ||
        msg.toLowerCase().includes('invalid')
      ) {
        setErrors({
          form: 'Invalid credentials. Please check your email and password.',
        })
      } else {
        setErrors({ form: msg })
      }
      dispatch(
        addToast({
          title: 'Sign in failed',
          message: msg,
          type: 'error',
        })
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Sign in</h1>
        {errors.form && (
          <div className="auth-card__error-banner">{errors.form}</div>
        )}
        <form onSubmit={handleSubmit} className="auth-card__form" noValidate>
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => validateField('email', email)}
              required
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span className="auth-field__error" id="email-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-field__password">
              <input
                id="auth-password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? 'password-error' : undefined
                }
              />
              <button
                type="button"
                className="auth-field__toggle"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <span
                className="auth-field__error"
                id="password-error"
                role="alert"
              >
                {errors.password}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            fullWidth
            type="submit"
            disabled={status === 'loading'}
            icon={status === 'loading' ? '' : 'fas fa-sign-in-alt'}
          >
            {status === 'loading' ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        <p className="auth-card__footer">
          New to Amazon? <Link to="/register">Create your account</Link>
        </p>
      </div>
    </div>
  )
}
