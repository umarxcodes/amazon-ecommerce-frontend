/* ===== CONFIRMATION MODAL COMPONENT ===== */
/* Reusable modal for confirmations (delete, deactivate, etc.) */
/* Prevents accidental actions with a clear UI prompt */

import { useEffect, useCallback } from 'react'
import './ConfirmationModal.css'

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'warning' | 'primary'
  isLoading = false,
  children,
}) {
  const handleEscKey = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscKey])

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  const variantClass = `confirmation-modal--${variant}`

  return (
    <div className="confirmation-modal__backdrop" onClick={handleBackdropClick}>
      <div className={`confirmation-modal ${variantClass}`} role="dialog" aria-modal="true" aria-labelledby="confirmation-modal-title">
        <h2 id="confirmation-modal-title" className="confirmation-modal__title">
          {title}
        </h2>
        {message && <p className="confirmation-modal__message">{message}</p>}
        {children}
        <div className="confirmation-modal__actions">
          <button
            type="button"
            className={`confirmation-modal__btn confirmation-modal__btn--confirm confirmation-modal__btn--${variant}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
          <button
            type="button"
            className="confirmation-modal__btn confirmation-modal__btn--cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
