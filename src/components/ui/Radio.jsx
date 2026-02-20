import { useId } from 'react'

/**
 * Радиокнопка в стиле приложения (тёмная тема, primary при выборе).
 * @param {{ name: string, value: string, checked: boolean, onChange?: () => void, disabled?: boolean, label?: string, id?: string }} props
 */
export default function Radio({ name, value, checked, onChange, disabled = false, label, id }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <label
      htmlFor={inputId}
      className="inline-flex items-center gap-2 cursor-pointer select-none text-sm text-gray-300 peer-disabled:opacity-50"
    >
      <span className="relative inline-flex h-5 w-5 shrink-0">
        <input
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="peer sr-only"
        />
        <span
          className={`
            relative block h-5 w-5 rounded-full border transition-colors duration-200
            border-gray-600
            peer-disabled:cursor-default peer-disabled:opacity-50
            ${checked ? 'bg-primary border-primary' : 'bg-gray-700 hover:border-gray-500'}
          `}
        >
          {checked && (
            <span className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-black" aria-hidden />
          )}
        </span>
      </span>
      {label != null && <span>{label}</span>}
    </label>
  )
}
