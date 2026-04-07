// ===*Css*===
import './Registration.css'
// ===*NavLink*===
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { register } from '../../features/auth/authSlice'
import { addToast } from '../../features/ui/uiSlice'

// ===*Registration Page*===
export default function Registration() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { status } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const currentYear = new Date().getFullYear()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      dispatch(
        addToast({
          title: 'Passwords do not match',
          message: 'Please make sure both password fields are identical.',
          type: 'error',
        })
      )
      return
    }

    const result = await dispatch(register(formData))

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
    <div className="registration-page-wrapper">
      <form className="registrationContainer" onSubmit={handleSubmit}>
        <img
          src="https://www.amazon.com/favicon.ico"
          alt="Amazon Logo"
          className="amazonLogo"
        />

        <h5 className="ctAccount">Create account</h5>

        <label htmlFor="names">Your name</label>
        <input
          type="text"
          id="names"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="First and last name"
          required
        />

        <label htmlFor="email">Email</label>
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
          placeholder="At least 6 characters"
          required
        />

        <label htmlFor="confirmPassword">Re-enter password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="Re-enter password"
          required
        />

        <button
          type="submit"
          className="login-btn"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Creating account...' : 'Continue'}
        </button>

        <div className="conditions">
          By creating an account, you agree to Amazon's
          <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
        </div>

        <div className="divider">Already have an account?</div>

        <NavLink to={'/Login'} className="sign-in-btn">
          Sign in ›
        </NavLink>
      </form>

      {/* Footer */}
      <footer>
        <div className="footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <p>© 1996-{currentYear}, Amazon.com, Inc. or its affiliates</p>
      </footer>
    </div>
  )
}
