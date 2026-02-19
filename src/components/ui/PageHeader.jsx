import MenuIcon from './MenuIcon'

/**
 * @param {{ title: string, iconKey: string }} props
 */
export default function PageHeader({ title, iconKey }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <MenuIcon iconKey={iconKey} active={false} size={28} />
      <h1 className="text-2xl font-semibold text-primary">{title}</h1>
    </div>
  )
}
