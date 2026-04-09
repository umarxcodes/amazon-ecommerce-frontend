import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useAuthStatus,
  useAuthError,
} from '../../hooks/customHooks'
import { register } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'

function PasswordStrength({ password }) {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  const colors = ['#DD0000', '#FF6600', '#FFCC00', '#66CC00', '#009900']

  if (!password) return null

  return (
    <div className="auth-form__strength">
      <div className="auth-form__strength-bar">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="auth-form__strength-segment"
            style={{
              backgroundColor: i < strength ? colors[strength - 1] : '#E0E0E0',
            }}
          />
        ))}
      </div>
      <span
        className="auth-form__strength-label"
        style={{ color: colors[strength - 1] || '#999' }}
      >
        {labels[strength - 1] || 'Too Short'}
      </span>
    </div>
  )
}

export default function RegistrationPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const status = useAuthStatus()
  const error = useAuthError()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) errors.email = 'Email is required'
    if (formData.password.length < 6)
      errors.password = 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = await dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
    )

    if (register.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Account created',
          message: 'Your customer account is ready to use.',
          type: 'success',
        })
      )
      navigate('/')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <img
            src="https://res.cloudinary.com/dlul8f6xz/image/upload/v1775646248/amazon_logo_vwm0jl.png"
            alt="Amazon"
            className="auth-card__logo-img"
          />
        </div>

        <div className="auth-card__content">
          <h1 className="auth-card__title">Create account</h1>

          <form onSubmit={handleSubmit}>
            <label className="auth-form__field">
              <span className="auth-form__label">Your name</span>
              <input
                type="text"
                className={`auth-form__input ${fieldErrors.name ? 'auth-form__input--error' : ''}`}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                autoFocus
              />
              {fieldErrors.name && (
                <span className="auth-form__error">{fieldErrors.name}</span>
              )}
            </label>

            <label className="auth-form__field">
              <span className="auth-form__label">Email</span>
              <input
                type="email"
                className={`auth-form__input ${fieldErrors.email ? 'auth-form__input--error' : ''}`}
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
              {fieldErrors.email && (
                <span className="auth-form__error">{fieldErrors.email}</span>
              )}
            </label>

            <label className="auth-form__field">
              <span className="auth-form__label">Password</span>
              <input
                type="password"
                className={`auth-form__input ${fieldErrors.password ? 'auth-form__input--error' : ''}`}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
              <PasswordStrength password={formData.password} />
              {fieldErrors.password && (
                <span className="auth-form__error">{fieldErrors.password}</span>
              )}
            </label>

            <label className="auth-form__field">
              <span className="auth-form__label">Re-enter password</span>
              <input
                type="password"
                className={`auth-form__input ${fieldErrors.confirmPassword ? 'auth-form__input--error' : ''}`}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
              />
              {fieldErrors.confirmPassword && (
                <span className="auth-form__error">
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </label>

            {error && !Object.keys(fieldErrors).length && (
              <div className="auth-form__error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-form__submit"
              disabled={status === 'loading'}
            >
              {status === 'loading'
                ? 'Creating account...'
                : 'Create your Amazon account'}
            </button>
          </form>

          <div className="auth-form__footer">
            <span className="auth-form__footer-text">
              Already have an account?
            </span>
            <Link to="/login" className="auth-form__footer-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
