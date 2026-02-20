import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

/**
 * Базовый компонент модального окна.
 * @param {{ open: boolean, onClose: () => void, title: string, children: import('react').ReactNode, footer?: import('react').ReactNode }} props
 */
export default function Modal({ open, onClose, title, children, footer }) {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, handleEscape])

  if (!open) return null

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        onKeyDown={handleEscape}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col rounded-lg border border-gray-600 bg-[#2A2A2A] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-4 py-3 border-b border-gray-600">
          <h2 id="modal-title" className="text-lg font-medium text-gray-100">
            {title}
          </h2>
        </div>
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden px-4 py-4 text-gray-300">
          {children}
        </div>
        {footer != null && (
          <div className="shrink-0 px-4 py-3 border-t border-gray-600 flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
