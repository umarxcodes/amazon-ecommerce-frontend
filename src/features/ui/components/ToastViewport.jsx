import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast, selectToasts } from '../uiSlice'
import './ToastViewport.css'

export default function ToastViewport() {
  const dispatch = useDispatch()
  const toasts = useSelector(selectToasts)

  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((t) => (
        <Toast
          key={t.id}
          toast={t}
          onDismiss={() => dispatch(removeToast(t.id))}
        />
      ))}
    </div>
  )
}

function Toast({ toast, onDismiss }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(removeToast(toast.id)),
      toast.duration || 3500
    )
    return () => clearTimeout(timer)
  }, [dispatch, toast.id, toast.duration])

  return (
    <div className={`toast toast--${toast.type}`} role="alert">
      <div className="toast__content">
        {toast.title && <strong className="toast__title">{toast.title}</strong>}
        {toast.message && <p className="toast__message">{toast.message}</p>}
      </div>
      <button
        type="button"
        className="toast__close"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  )
}
