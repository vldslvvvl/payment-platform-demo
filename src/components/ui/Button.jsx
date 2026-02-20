/**
 * @param {{ variant?: 'primary' | 'secondary', icon?: import('react').ReactNode, children: import('react').ReactNode, type?: 'button' | 'submit', onClick?: () => void, className?: string, form?: string, disabled?: boolean }} props
 */
export default function Button({
  variant = 'secondary',
  icon,
  children,
  type = 'button',
  onClick,
  className = '',
  form,
  disabled = false,
}) {
  const base = 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary text-black hover:opacity-90',
    secondary: 'border border-gray-600 text-gray-300 hover:bg-gray-700',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      form={form}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}
