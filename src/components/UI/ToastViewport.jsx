import { useEffect } from 'react'
import { useAppDispatch, useToasts } from '../../hooks/customHooks'
import { removeToast } from '../../features/ui/uiSlice'

export default function ToastViewport() {
  const dispatch = useAppDispatch()
  const toasts = useToasts()

  useEffect(() => {
    const timeoutIds = toasts.map((toast) =>
      window.setTimeout(() => dispatch(removeToast(toast.id)), 3500)
    )

    return () =>
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
  }, [dispatch, toasts])

  return (
    <div className="toast-viewport">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <strong>{toast.title}</strong>
          <p>{toast.message}</p>
        </div>
      ))}
    </div>
  )
}
