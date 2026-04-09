import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useAuthStatus,
  useAuthError,
} from '../../hooks/customHooks'
import { login } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const status = useAuthStatus()
  const error = useAuthError()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(formData))

    if (login.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Welcome back',
          message: 'Authentication completed successfully.',
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
          <h1 className="auth-card__title">Sign in</h1>

          <form onSubmit={handleSubmit}>
            <label className="auth-form__field">
              <span className="auth-form__label">Email or mobile number</span>
              <input
                type="email"
                className="auth-form__input"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
                autoFocus
              />
            </label>

            <label className="auth-form__field">
              <span className="auth-form__label">Password</span>
              <div className="auth-form__password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-form__input"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
                <button
                  type="button"
                  className="auth-form__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>

            {error && (
              <div className="auth-form__error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-form__submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          <p className="auth-form__terms">
            By continuing, you agree to Amazon's{' '}
            <a href="#conditions">Conditions of Use</a> and{' '}
            <a href="#privacy">Privacy Notice</a>.
          </p>

          <div className="auth-form__divider">
            <a href="#forgot" className="auth-form__forgot">
              Forgot your password?
            </a>
          </div>

          <div className="auth-form__footer">
            <span className="auth-form__footer-text">New to Amazon?</span>
            <Link to="/register" className="auth-form__footer-link">
              Create your Amazon account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
