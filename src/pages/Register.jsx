import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import AuthForm from '../features/auth/components/AuthForm'
import { register } from '../features/auth/authSlice'
import { addToast } from '../features/ui/uiSlice'

export default function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { status, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

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
    <div className="auth-page">
      <AuthForm
        title="Create account"
        subtitle="Start with a scalable auth flow that persists tokens and protects downstream routes."
        fields={[
          { name: 'name', label: 'Full name', type: 'text', placeholder: 'Sarah Connor' },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'sarah@example.com' },
          { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          {
            name: 'confirmPassword',
            label: 'Confirm password',
            type: 'password',
            placeholder: '••••••••',
          },
        ]}
        formData={formData}
        onChange={(event) =>
          setFormData((current) => ({ ...current, [event.target.name]: event.target.value }))
        }
        onSubmit={handleSubmit}
        isSubmitting={status === 'loading'}
        error={error}
        footerText="Already have an account?"
        footerLink="/login"
        footerLabel="Sign in"
      />
    </div>
  )
}
