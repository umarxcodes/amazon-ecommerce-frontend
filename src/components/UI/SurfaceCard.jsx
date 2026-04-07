export default function SurfaceCard({
  as: Element = 'section',
  className = '',
  children,
}) {
  const Tag = Element
  return <Tag className={`surface-card ${className}`.trim()}>{children}</Tag>
}
