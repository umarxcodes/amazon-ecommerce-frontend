export default function Field({
  as = 'input',
  label,
  hint,
  className = '',
  children,
  ...props
}) {
  const Component = as

  return (
    <label className={`field ${className}`.trim()}>
      {label ? <span className="field__label">{label}</span> : null}
      {children || <Component className="field__control" {...props} />}
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  )
}
