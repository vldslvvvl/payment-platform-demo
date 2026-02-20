import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Layout from './components/layout/Layout'
import Deals from './pages/Deals'
import Requisites from './pages/Requisites'
import Banks from './pages/Banks'
import Balance from './pages/Balance'
import Withdraw from './pages/Withdraw'
import History from './pages/History'
import Appeals from './pages/Appeals'
import Sms from './pages/Sms'
import Users from './pages/Users'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Deals />} />
              <Route path="requisites" element={<Requisites />} />
              <Route path="banks" element={<Banks />} />
              <Route path="balance" element={<Balance />} />
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="history" element={<History />} />
              <Route path="appeals" element={<Appeals />} />
              <Route path="sms" element={<Sms />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
