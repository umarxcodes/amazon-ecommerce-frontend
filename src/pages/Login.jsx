import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import AuthForm from '../features/auth/components/AuthForm'
import { login } from '../features/auth/authSlice'
import { addToast } from '../features/ui/uiSlice'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await dispatch(login(formData))

    if (login.fulfilled.match(result)) {
      dispatch(
        addToast({
          title: 'Welcome back',
          message: 'Authentication completed successfully.',
          type: 'success',
        })
      )
      navigate(location.state?.from?.pathname || '/')
    }
  }

  return (
    <div className="auth-page">
      <AuthForm
        title="Sign in"
        subtitle="Authenticate with your JWT-backed backend and unlock protected customer flows."
        fields={[
          { name: 'email', label: 'Email', type: 'email', placeholder: 'admin@example.com' },
          { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
        ]}
        formData={formData}
        onChange={(event) =>
          setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
        }
        onSubmit={handleSubmit}
        isSubmitting={status === 'loading'}
        error={error}
        footerText="Need an account?"
        footerLink="/register"
        footerLabel="Create one"
      />
    </div>
  )
}
