import { createContext, useContext, useState, useMemo } from 'react'

const AuthContext = createContext(null)

const BASE_USER = {
  user_id: 'demo-user-id',
  create_dttm: '2025-12-11T10:10:11.862604Z',
  login: 'demo_user',
  email: 'demo@test.com',
  role: 'admin',
  phone_number: '+79001234567',
  status_code: 'active',
}

export function AuthProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('admin')
  const user = useMemo(
    () => ({ ...BASE_USER, role: currentRole }),
    [currentRole]
  )
  const value = useMemo(
    () => ({ user, currentRole, setCurrentRole }),
    [user, currentRole]
  )
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
