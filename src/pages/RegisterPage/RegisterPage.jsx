/* ===== REGISTRATION PAGE ===== */
/* New user account creation form with Yup validation */
/* Handles 409 "Email already exists" error, redirects to /login on success */

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAuthStatus, useAuthToken } from '../../hooks'
import { register } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'
import { registerSchema } from '../../features/auth/authSchemas'
import Button from '../../components/shared/Button'
import './AuthPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const status = useAuthStatus()
  const hasToken = useAuthToken()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (hasToken) {
      navigate('/', { replace: true })
    }
  }, [hasToken, navigate])

  const validateField = async (fieldName, value) => {
    const formData = { name, email, password, confirmPassword: confirm }
    formData[fieldName] = value
    try {
      await registerSchema.validateAt(fieldName, formData)
      setErrors((prev) => {
        const next = { ...prev }
        delete next[fieldName]
        return next
      })
    } catch (err) {
      setErrors((prev) => ({ ...prev, [fieldName]: err.message }))
    }
  }

  const handleChange = (field, value) => {
    switch (field) {
      case 'name':
        setName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'confirm':
        setConfirm(value)
        break
    }
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
      await registerSchema.validate(
        { name, email, password, confirmPassword: confirm },
        { abortEarly: false }
      )
    } catch (err) {
      const fieldErrors = {}
      err.inner.forEach((e) => {
        fieldErrors[e.path] = e.message
      })
      setErrors(fieldErrors)
      return
    }

    const result = await dispatch(register({ name, email, password }))
    if (register.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Account created',
          message: `Welcome, ${name}! Please sign in.`,
          type: 'success',
        })
      )
      navigate('/login')
    } else {
      const msg = result.payload ?? 'Could not create account.'
      // Handle 409 conflict — email already exists
      if (
        msg.toLowerCase().includes('already exists') ||
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('conflict')
      ) {
        setErrors({
          email:
            'Email already exists. Please sign in or use a different email.',
        })
      } else {
        setErrors({ form: msg })
      }
      dispatch(
        addToast({
          title: 'Registration failed',
          message: msg,
          type: 'error',
        })
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create account</h1>
        {errors.form && (
          <div className="auth-card__error-banner">{errors.form}</div>
        )}
        <form onSubmit={handleSubmit} className="auth-card__form" noValidate>
          <div className="auth-field">
            <label htmlFor="auth-name">Your name</label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => validateField('name', name)}
              required
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <span className="auth-field__error" id="name-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>
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
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => validateField('password', password)}
              required
              minLength={6}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
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
          <div className="auth-field">
            <label htmlFor="auth-confirm">Re-enter password</label>
            <input
              id="auth-confirm"
              type="password"
              value={confirm}
              onChange={(e) => handleChange('confirm', e.target.value)}
              onBlur={() => validateField('confirmPassword', confirm)}
              required
              minLength={6}
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword ? 'confirm-error' : undefined
              }
            />
            {errors.confirmPassword && (
              <span
                className="auth-field__error"
                id="confirm-error"
                role="alert"
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            fullWidth
            type="submit"
            disabled={status === 'loading'}
            icon={status === 'loading' ? '' : 'fas fa-user-plus'}
          >
            {status === 'loading'
              ? 'Creating...'
              : 'Create your Amazon account'}
          </Button>
        </form>
        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
