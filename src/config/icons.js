import ordersSvg from '../assets/icons/menu_items/orders.svg?raw'
import cardsSvg from '../assets/icons/menu_items/cards.svg?raw'
import banksSvg from '../assets/icons/menu_items/banks.svg?raw'
import balanceSvg from '../assets/icons/menu_items/balance.svg?raw'
import withdrawSvg from '../assets/icons/menu_items/withdraw.svg?raw'
import historySvg from '../assets/icons/menu_items/history.svg?raw'
import appealsSvg from '../assets/icons/menu_items/appeals.svg?raw'
import smsSvg from '../assets/icons/menu_items/sms.svg?raw'
import profileSvg from '../assets/icons/menu_items/profile.svg?raw'
import accountsSvg from '../assets/icons/menu_items/accounts.svg?raw'

export const MENU_ICONS = {
  orders: ordersSvg,
  cards: cardsSvg,
  banks: banksSvg,
  balance: balanceSvg,
  withdraw: withdrawSvg,
  history: historySvg,
  appeals: appealsSvg,
  sms: smsSvg,
  profile: profileSvg,
  accounts: accountsSvg,
}

/** Заменяет white/hex/currentColor на плейсхолдер для подстановки нужного цвета */
function svgToColorPlaceholder(svgString) {
  return svgString
    .replace(/stroke="white"/gi, 'stroke="__ICON_COLOR__"')
    .replace(/fill="white"/gi, 'fill="__ICON_COLOR__"')
    .replace(/stroke="#B98600"/gi, 'stroke="__ICON_COLOR__"')
    .replace(/fill="#FFFFFF"/gi, 'fill="__ICON_COLOR__"')
    .replace(/stroke="currentColor"/gi, 'stroke="__ICON_COLOR__"')
}

export function getIconSvg(iconKey, color) {
  const raw = MENU_ICONS[iconKey]
  if (!raw) return null
  const withPlaceholder = svgToColorPlaceholder(raw)
  const hex = color || '#FFFFFF'
  return withPlaceholder.replace(/__ICON_COLOR__/g, hex)
}
