export default function SurfaceCard({ as: Component = 'section', className = '', children }) {
  return <Component className={`surface-card ${className}`.trim()}>{children}</Component>
}
