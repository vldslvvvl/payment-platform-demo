import { useState, useRef, useEffect, useCallback } from 'react'

const triggerClass =
  'w-full flex items-center justify-between gap-2 rounded border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-200 min-h-[2.25rem] cursor-pointer hover:border-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
const listClass =
  'absolute top-full left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded border border-gray-600 bg-[#2A2A2A] shadow-lg py-1'
const optionClass =
  'flex items-center gap-2 px-3 py-2 text-sm text-gray-200 cursor-pointer hover:bg-gray-600 transition-colors'

/**
 * Кастомный дропдаун в стиле приложения (тёмная тема).
 * @param {{
 *   options: Array<{ value: string, label: string, icon?: string | null }>,
 *   value: string,
 *   onChange: (value: string) => void,
 *   placeholder?: string,
 *   required?: boolean,
 *   disabled?: boolean,
 *   'aria-label'?: string,
 * }} props
 */
export default function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Выберите...',
  required = false,
  disabled = false,
  'aria-label': ariaLabel,
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const selected = options.find((o) => o.value === value)

  const handleClose = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onDocumentClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', onDocumentClick)
    return () => document.removeEventListener('mousedown', onDocumentClick)
  }, [open, handleClose])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false)
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen((prev) => !prev)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        aria-required={required}
        className={`${triggerClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
      >
        <span className="flex items-center gap-2 min-w-0">
          {selected?.icon && (
            <img
              src={selected.icon}
              alt=""
              className="w-4 h-4 shrink-0 object-contain"
              aria-hidden
            />
          )}
          <span className={selected ? 'truncate' : 'text-gray-500'}>{selected ? selected.label : placeholder}</span>
        </span>
        <svg
          className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.23a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className={listClass}
          aria-activedescendant={selected ? `dropdown-option-${selected.value}` : undefined}
        >
          {options.map((option) => (
            <li
              key={option.value}
              id={`dropdown-option-${option.value}`}
              role="option"
              aria-selected={option.value === value}
              className={optionClass}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelect(option.value)
                }
              }}
            >
              {option.icon && (
                <img
                  src={option.icon}
                  alt=""
                  className="w-4 h-4 shrink-0 object-contain"
                  aria-hidden
                />
              )}
              <span className="truncate">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
