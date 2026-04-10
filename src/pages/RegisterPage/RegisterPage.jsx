/* ===== REGISTRATION PAGE ===== */
/* New user account creation form */
/* Validates password match and minimum length */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAuthStatus, useAuthToken } from '../../hooks'
import { register } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'
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

  if (hasToken) navigate('/')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      dispatch(
        addToast({
          title: 'Mismatch',
          message: 'Passwords do not match.',
          type: 'error',
        })
      )
      return
    }
    if (password.length < 6) {
      dispatch(
        addToast({
          title: 'Weak password',
          message: 'Password must be at least 6 characters.',
          type: 'error',
        })
      )
      return
    }
    const result = await dispatch(register({ name, email, password }))
    if (register.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Account created',
          message: `Welcome, ${name}!`,
          type: 'success',
        })
      )
      navigate('/')
    } else {
      dispatch(
        addToast({
          title: 'Registration failed',
          message: result.payload || 'Could not create account.',
          type: 'error',
        })
      )
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Create account</h1>
        <form onSubmit={handleSubmit} className="auth-card__form">
          <div className="auth-field">
            <label htmlFor="auth-name">Your name</label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-confirm">Re-enter password</label>
            <input
              id="auth-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
            />
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
