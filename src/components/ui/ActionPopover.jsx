import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

const actionButtonBase =
  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left border-0 cursor-pointer transition-colors rounded'

function getActionButtonClass(variant) {
  switch (variant) {
    case 'primary':
      return `${actionButtonBase} bg-primary text-black hover:opacity-90`
    case 'danger':
      return `${actionButtonBase} bg-danger text-white hover:opacity-90`
    default:
      return `${actionButtonBase} bg-transparent text-gray-200 hover:bg-gray-600`
  }
}

/**
 * Универсальный popover с быстрыми действиями.
 * Рендерится в портал, чтобы не обрезаться контейнерами с overflow (таблицы, скролл).
 * Состав кнопок и логика полностью задаются снаружи через массив actions.
 *
 * @param {{
 *   actions: Array<{ id?: string, label: string, variant?: 'primary' | 'danger', onClick: () => void }>,
 *   triggerIcon?: string,
 *   triggerClassName?: string,
 *   ariaLabel?: string,
 *   menuAriaLabel?: string,
 * }} props
 */
export default function ActionPopover({
  actions = [],
  triggerIcon,
  triggerClassName = 'p-1 rounded hover:bg-gray-600 inline-flex items-center justify-center w-[16px] cursor-pointer',
  ariaLabel = 'Действия',
  menuAriaLabel = 'Быстрые действия',
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)

  const handleClose = useCallback(() => setOpen(false), [])

  const handleToggle = useCallback(() => {
    if (open) {
      handleClose()
    } else {
      const el = triggerRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        setPosition({ top: rect.bottom + 4, left: rect.right })
      }
      setOpen(true)
    }
  }, [open, handleClose])

  useEffect(() => {
    if (!open) return
    const onDocumentClick = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        const menu = document.getElementById('action-popover-menu')
        if (menu && !menu.contains(e.target)) handleClose()
      }
    }
    document.addEventListener('mousedown', onDocumentClick)
    return () => document.removeEventListener('mousedown', onDocumentClick)
  }, [open, handleClose])

  useEffect(() => {
    if (!open) return
    const onEscape = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [open, handleClose])

  const handleActionClick = (action) => {
    action.onClick?.()
    setOpen(false)
  }

  if (actions.length === 0) return null

  const popoverContent = open && (
    <div
      id="action-popover-menu"
      role="menu"
      aria-label={menuAriaLabel}
      className="fixed z-[100] min-w-[180px] rounded border border-gray-600 bg-[#2A2A2A] shadow-lg"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-100%)',
      }}
    >
      {actions.map((action, index) => (
        <button
          key={action.id ?? action.label ?? index}
          type="button"
          role="menuitem"
          className={getActionButtonClass(action.variant)}
          onClick={() => handleActionClick(action)}
        >
          {action.label}
        </button>
      ))}
    </div>
  )

  return (
    <>
      <div ref={triggerRef} className="relative inline-flex">
        <button
          type="button"
          onClick={handleToggle}
          className={triggerClassName}
          aria-label={ariaLabel}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          {triggerIcon ? (
            <img src={triggerIcon} alt="" className="w-4 h-4" aria-hidden />
          ) : (
            <span className="text-gray-400" aria-hidden>⋯</span>
          )}
        </button>
      </div>
      {createPortal(popoverContent, document.body)}
    </>
  )
}
