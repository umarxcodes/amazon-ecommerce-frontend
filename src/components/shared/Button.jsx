/* ===== REUSABLE BUTTON COMPONENT ===== */
/* Versatile button supporting variants, sizes, icons, and Link rendering */
/* Amazon-style gradients, hover animations, and icon integration */

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
      icon = null,
      iconRight = false,
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
      icon ? 'btn--with-icon' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const props = { ref, className: classes, onClick, disabled, ...rest }

    const iconElement = icon ? <i className={`btn__icon ${icon}`} /> : null

    if (as === 'link' && to) {
      return (
        <Link to={to} {...props}>
          {icon && !iconRight && iconElement}
          <span className="btn__text">{children}</span>
          {iconRight && iconElement}
        </Link>
      )
    }
    if (as === 'a' && href) {
      return (
        <a href={href} {...props}>
          {icon && !iconRight && iconElement}
          <span className="btn__text">{children}</span>
          {iconRight && iconElement}
        </a>
      )
    }

    return (
      <button type={type} {...props}>
        {icon && !iconRight && iconElement}
        <span className="btn__text">{children}</span>
        {iconRight && iconElement}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
