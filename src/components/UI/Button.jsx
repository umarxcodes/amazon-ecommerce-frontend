/*
📁 FILE: Button.jsx
📌 PURPOSE: Reusable button with variant/size support
======================================
*/

// =====*** COMPONENT ***=====
/**
 * @param {object} props
 * @param {'button'|'a'} [props.as='button'] - Element type to render
 * @param {'primary'|'ghost'|'danger'} [props.variant='primary'] - Button style variant
 * @param {'sm'|'md'} [props.size='md'] - Button size
 * @param {boolean} [props.fullWidth=false] - Whether button spans full width
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function Button({
  as: Element = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  const ElementTag = Element
  const classes = [
    'ui-button',
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth ? 'full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ElementTag className={classes} {...props}>
      {children}
    </ElementTag>
  )
}
