export default function Button({
  as: Component = 'button',
  className = '',
  variant = 'primary',
  size = 'md',
  children,
  ...props
}) {
  const classes = ['ui-button', `ui-button--${variant}`, `ui-button--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
