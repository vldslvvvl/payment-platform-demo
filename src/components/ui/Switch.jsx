/**
 * @param {{ checked: boolean, onChange?: (checked: boolean) => void, disabled?: boolean }} props
 */
export default function Switch({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-gray-600
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#191919]
        disabled:cursor-default
        ${checked ? 'bg-primary' : 'bg-gray-600'}
        ${!disabled && !checked ? 'hover:bg-gray-500' : ''}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-white shadow
          transition-transform duration-200
          ${checked ? 'translate-x-4' : 'translate-x-0.5'}
        `}
      />
    </button>
  )
}
