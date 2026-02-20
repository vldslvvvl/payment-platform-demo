import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES, ROLE_LABELS, canAccess } from '../../config/roles'
import MenuIcon from '../ui/MenuIcon'

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)
const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
)

const NAV_ITEMS = [
  { to: '/', label: 'Сделки', icon: 'orders' },
  { to: '/requisites', label: 'Реквизиты', icon: 'cards' },
  { to: '/banks', label: 'Банки', icon: 'banks' },
  { to: '/balance', label: 'Депозиты', icon: 'balance' },
  { to: '/withdraw', label: 'Вывод', icon: 'withdraw' },
  { to: '/history', label: 'История', icon: 'history' },
  { to: '/appeals', label: 'Апелляции', icon: 'appeals' },
  { to: '/sms', label: 'Автоматизация', icon: 'sms' },
  { to: '/users', label: 'Пользователи', icon: 'profile' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, currentRole, setCurrentRole } = useAuth()
  const location = useLocation()
  const roleOptions = [ROLES.ADMIN, ROLES.MERCHANT, ROLES.TRADER, ROLES.SUPPORT]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname === to

  return (
    <aside
      className={`min-h-screen bg-[#141414] text-gray-100 flex flex-col border-r border-gray-700 transition-all duration-200 ${
        collapsed ? 'w-[72px]' : 'w-56'
      }`}
    >
      <div className={`flex border-b border-gray-700 transition-all duration-200 ${collapsed ? 'flex-col p-2 items-center' : 'flex-col p-4'}`}>
        <div className={`flex items-center w-full ${collapsed ? 'flex-col gap-2' : 'gap-2 mb-4'}`}>
          <img
            src={collapsed ? '/logo/logo_mini.svg' : '/logo/logo_full.svg'}
            alt="Логотип"
            className="shrink-0 object-contain"
            style={collapsed ? { height: 32 } : { height: 36 }}
          />
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 cursor-pointer hover:text-white hover:bg-[#1a1a1a] transition-colors shrink-0"
            title={collapsed ? 'Развернуть меню' : 'Свернуть меню'}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
        {!collapsed && (
          <>
            <label className="block text-xs font-medium text-gray-400 mb-2 w-full">
              Роль для просмотра
            </label>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full bg-gray-800 text-primary border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      <nav className={`flex-1 space-y-1 transition-all duration-200 ${collapsed ? 'p-2' : 'p-4'}`}>
        {NAV_ITEMS.filter((item) => canAccess(item.to, user.role)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive: active }) =>
              `flex items-center rounded-[10px] text-sm font-medium no-underline transition-colors ${
                collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-3'
              } ${
                active
                  ? 'bg-primary text-black'
                  : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
              }`
            }
          >
            <MenuIcon iconKey={item.icon} active={isActive(item.to)} size={24} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
