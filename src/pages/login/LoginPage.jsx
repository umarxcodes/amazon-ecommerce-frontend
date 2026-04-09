import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAuthStatus, useAuthToken } from '../../hooks'
import { login } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'
import Button from '../../components/ui/Button'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const status = useAuthStatus()
  const hasToken = useAuthToken()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  if (hasToken) navigate('/')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login({ email, password }))
    if (login.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Welcome back',
          message: `Signed in as ${result.payload.user?.name || email}.`,
          type: 'success',
        })
      )
      navigate('/')
    } else {
      dispatch(
        addToast({
          title: 'Sign in failed',
          message: result.payload || 'Invalid credentials.',
          type: 'error',
        })
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Sign in</h1>
        <form onSubmit={handleSubmit} className="auth-card__form">
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-field__password">
              <input
                id="auth-password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-field__toggle"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <Button
            variant="primary"
            fullWidth
            type="submit"
            disabled={status === 'loading'}
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
