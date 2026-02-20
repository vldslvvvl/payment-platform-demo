import { useId } from 'react'

/**
 * Чекбокс в стиле приложения (тёмная тема, primary при выборе).
 * @param {{ checked: boolean, onChange?: (checked: boolean) => void, disabled?: boolean, label?: string, id?: string }} props
 */
export default function Checkbox({ checked, onChange, disabled = false, label, id }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <label
      htmlFor={inputId}
      className="inline-flex items-center gap-2 cursor-pointer select-none text-sm text-gray-300"
    >
      <span className="relative inline-flex h-5 w-5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`
            relative block h-5 w-5 rounded border transition-colors duration-200
            border-gray-600
            peer-disabled:cursor-default peer-disabled:opacity-50
            ${checked ? 'bg-primary border-primary' : 'bg-gray-700 hover:border-gray-500'}
          `}
        >
          {checked && (
            <svg
              className="absolute inset-0 m-auto w-3 h-3 text-black"
              viewBox="0 0 12 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M1 5l3 3 7-6" />
            </svg>
          )}
        </span>
      </span>
      {label != null && <span>{label}</span>}
    </label>
  )
}
