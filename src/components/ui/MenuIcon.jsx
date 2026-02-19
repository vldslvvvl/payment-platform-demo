import { getIconSvg } from '../../config/icons'

const ICON_INACTIVE = '#FFFFFF'
const ICON_ACTIVE = '#141414'

/**
 * @param {{ iconKey: string, active?: boolean, size?: number }} props
 */
export default function MenuIcon({ iconKey, active = false, size = 24 }) {
  const color = active ? ICON_ACTIVE : ICON_INACTIVE
  const svg = getIconSvg(iconKey, color)
  if (!svg) return null
  return (
    <span
      className="inline-flex shrink-0 [&>svg]:block [&>svg]:w-full [&>svg]:h-full"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
