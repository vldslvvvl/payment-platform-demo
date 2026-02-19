export const ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  TRADER: 'trader',
  SUPPORT: 'support',
}

const ALL_ROLES = [ROLES.ADMIN, ROLES.MERCHANT, ROLES.TRADER, ROLES.SUPPORT]

export const ROUTE_ACCESS = {
  '/': ALL_ROLES,
  '/history': ALL_ROLES,
  '/requisites': [ROLES.ADMIN, ROLES.TRADER, ROLES.MERCHANT],
  '/banks': [ROLES.ADMIN, ROLES.SUPPORT],
  '/balance': ALL_ROLES,
  '/withdraw': ALL_ROLES,
  '/appeals': ALL_ROLES,
  '/sms': ALL_ROLES,
  '/users': [ROLES.ADMIN, ROLES.SUPPORT],
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Админ',
  [ROLES.MERCHANT]: 'Мерчант',
  [ROLES.TRADER]: 'Трейдер',
  [ROLES.SUPPORT]: 'Саппорт',
}

export function canAccess(route, role) {
  const allowed = ROUTE_ACCESS[route]
  return allowed ? allowed.includes(role) : false
}
