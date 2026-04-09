import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import './Button.css'

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      disabled = false,
      as = 'button',
      to,
      href,
      onClick,
      type = 'button',
      className = '',
      ...rest
    },
    ref
  ) => {
    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      fullWidth ? 'btn--full' : '',
      disabled ? 'btn--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const props = { ref, className: classes, onClick, disabled, ...rest }

    if (as === 'link' && to) {
      return <Link to={to} {...props}>{children}</Link>
    }
    if (as === 'a' && href) {
      return <a href={href} {...props}>{children}</a>
    }

    return <button type={type} {...props}>{children}</button>
  }
)

Button.displayName = 'Button'
export default Button
