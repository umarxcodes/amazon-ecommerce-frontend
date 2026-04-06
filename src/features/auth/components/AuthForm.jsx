import { Link } from 'react-router-dom'
import Button from '../../../components/UI/Button'
import Field from '../../../components/UI/Field'

export default function AuthForm({
  title,
  subtitle,
  fields,
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  error,
  footerText,
  footerLink,
  footerLabel,
}) {
  return (
    <div className="auth-card">
      <div className="auth-copy">
        <span className="eyebrow">Account Access</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        {fields.map((field) => (
          <Field key={field.name} label={field.label}>
            <input
              className="field__control"
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={onChange}
              required={field.required !== false}
            />
          </Field>
        ))}

        {error ? <p className="form-error">{error}</p> : null}

        <Button className="full-width" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : title}
        </Button>
      </form>

      <p className="auth-footer">
        {footerText} <Link to={footerLink}>{footerLabel}</Link>
      </p>
    </div>
  )
}
