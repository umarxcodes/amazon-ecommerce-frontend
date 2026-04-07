// ===*Css*===
import './Login.css'
// ===*NavLink*===
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { login } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'

// ===* Login*===
export default function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const currentDate = new Date().getFullYear()

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
    <div className="login-page-wrapper">
      <form className="loginForm" onSubmit={handleSubmit}>
        <img
          src="https://www.amazon.com/favicon.ico"
          alt="Amazon Logo"
          className="amazonLogo"
        />

        <h5 className="ctAccount">Sign in</h5>

        <label htmlFor="email">Email or mobile phone number</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter your email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Enter your password"
          required
        />

        {error && <div className="error-message">{error}</div>}

        <button
          type="submit"
          className="login-btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Signing in...' : 'Continue'}
        </button>

        <div className="conditions">
          By continuing, you agree to Amazon's
          <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
        </div>

        <div className="help-section">
          <a href="#" className="help-link">
            Forgot your password?
          </a>
        </div>

        <div className="divider">New to Amazon?</div>

        <NavLink to={'/Registration'} className="create-account-btn">
          Create your Amazon account
        </NavLink>
      </form>

      <footer>
        <div className="footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <p>© 1996-{currentDate}, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </div>
  )
}
