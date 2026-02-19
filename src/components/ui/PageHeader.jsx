import MenuIcon from './MenuIcon'

/**
 * @param {{ title: string, iconKey: string }} props
 */
export default function PageHeader({ title, iconKey }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <MenuIcon iconKey={iconKey} active={false} size={28} />
      <h1 className="text-s font-semibold text-white">{title}</h1>
    </div>
  )
}
