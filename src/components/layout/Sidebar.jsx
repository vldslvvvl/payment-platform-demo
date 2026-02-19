import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES, ROLE_LABELS, canAccess } from '../../config/roles'
import MenuIcon from '../ui/MenuIcon'

const NAV_ITEMS = [
  { to: '/', label: 'Сделки', icon: 'orders' },
  { to: '/requisites', label: 'Ревизиты', icon: 'cards' },
  { to: '/banks', label: 'Банки', icon: 'banks' },
  { to: '/balance', label: 'Депозиты', icon: 'balance' },
  { to: '/withdraw', label: 'Вывод', icon: 'withdraw' },
  { to: '/history', label: 'История', icon: 'history' },
  { to: '/appeals', label: 'Апелляции', icon: 'appeals' },
  { to: '/sms', label: 'Автоматизация', icon: 'sms' },
  { to: '/users', label: 'Пользователи', icon: 'profile' },
]

export default function Sidebar() {
  const { user, currentRole, setCurrentRole } = useAuth()
  const location = useLocation()
  const roleOptions = [ROLES.ADMIN, ROLES.MERCHANT, ROLES.TRADER, ROLES.SUPPORT]

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname === to

  return (
    <aside className="w-56 min-h-screen bg-[#141414] text-gray-100 flex flex-col border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <label className="block text-xs font-medium text-gray-400 mb-2">
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
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.filter((item) => canAccess(item.to, user.role)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-[10px] text-sm font-medium no-underline transition-colors ${
                isActive
                  ? 'bg-primary text-black'
                  : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
              }`
            }
          >
            <MenuIcon iconKey={item.icon} active={isActive(item.to)} size={24} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
