import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

const AUTO_CLOSE_MS = 4500

const VARIANT_STYLES = {
  success: 'border-primary bg-primary/10 text-gray-100',
  warning: 'border-amber-500 bg-amber-500/10 text-gray-100',
  error: 'border-danger bg-danger/10 text-gray-100',
  info: 'border-gray-500 bg-gray-500/10 text-gray-100',
}

function ToastItem({ id, message, variant, onClose }) {
  const variantClass = VARIANT_STYLES[variant] ?? VARIANT_STYLES.info

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-between gap-3 min-w-[280px] max-w-[360px] px-4 py-1 rounded-lg border ${variantClass} shadow-lg`}
    >
      <span className="text-sm">{message}</span>
      <button
        type="button"
        onClick={() => onClose(id)}
        className="cursor-pointer shrink-0 p-1 rounded hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-100"
        aria-label="Закрыть"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-label="Уведомления"
    >
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((t) => (
          <ToastItem key={t.id} id={t.id} message={t.message} variant={t.variant} onClose={removeToast} />
        ))}
      </div>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const removeToast = useCallback((id) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message, variant = 'info') => {
    const id = crypto.randomUUID()
    const toast = { id, message, variant }

    setToasts((prev) => [...prev, toast])

    const timer = setTimeout(() => {
      removeToast(id)
      timersRef.current.delete(id)
    }, AUTO_CLOSE_MS)
    timersRef.current.set(id, timer)
  }, [removeToast])

  const value = useMemo(
    () => ({
      success: (msg) => addToast(msg, 'success'),
      warning: (msg) => addToast(msg, 'warning'),
      error: (msg) => addToast(msg, 'error'),
      info: (msg) => addToast(msg, 'info'),
    }),
    [addToast]
  )

  return (
    <ToastContext.Provider value={value}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
