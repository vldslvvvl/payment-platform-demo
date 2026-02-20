import { useState, useCallback } from 'react'
import Button from '../ui/Button'
import Dropdown from '../ui/Dropdown'
import { mockUsers } from '../../mocks/users'

const inputClass =
  'w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

const TRADER_OPTIONS = [
  { value: '', label: 'Все' },
  ...mockUsers.map((u) => ({ value: u.user_id, label: u.login })),
]

const OPERATION_TYPE_OPTIONS = [
  { value: '', label: 'Оба' },
  { value: 'debit', label: 'Пополнение' },
  { value: 'credit', label: 'Вывод' },
]

const PAYMENT_METHOD_OPTIONS = [
  { value: '', label: 'Все' },
  { value: 'card2card', label: 'Номер карты' },
  { value: 'sbp', label: 'СБП' },
  { value: 'account-transfer', label: 'Номер счета' },
]

/**
 * @typedef {{
 *   traderId: string,
 *   cardNumber: string,
 *   phoneNumber: string,
 *   accountNumber: string,
 *   operationType: string,
 *   paymentMethod: string,
 *   fullname: string,
 * }} RequisitesFilters
 */

/**
 * @param {{ filters: RequisitesFilters, onSubmit: (f: RequisitesFilters) => void, onClose: () => void }} props
 */
export default function RequisitesFiltersModal({ filters, onSubmit, onClose }) {
  const [traderId, setTraderId] = useState(filters.traderId ?? '')
  const [cardNumber, setCardNumber] = useState(filters.cardNumber ?? '')
  const [phoneNumber, setPhoneNumber] = useState(filters.phoneNumber ?? '')
  const [accountNumber, setAccountNumber] = useState(filters.accountNumber ?? '')
  const [operationType, setOperationType] = useState(filters.operationType ?? '')
  const [paymentMethod, setPaymentMethod] = useState(filters.paymentMethod ?? '')
  const [fullname, setFullname] = useState(filters.fullname ?? '')

  const clearOtherNumberFields = useCallback((keep) => {
    if (keep !== 'card') setCardNumber('')
    if (keep !== 'phone') setPhoneNumber('')
    if (keep !== 'account') setAccountNumber('')
  }, [])

  const handleCardChange = (e) => {
    const v = e.target.value
    setCardNumber(v)
    if (v) clearOtherNumberFields('card')
  }
  const handlePhoneChange = (e) => {
    const v = e.target.value
    setPhoneNumber(v)
    if (v) clearOtherNumberFields('phone')
  }
  const handleAccountChange = (e) => {
    const v = e.target.value
    setAccountNumber(v)
    if (v) clearOtherNumberFields('account')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      traderId,
      cardNumber: cardNumber.trim(),
      phoneNumber: phoneNumber.trim(),
      accountNumber: accountNumber.trim(),
      operationType,
      paymentMethod,
      fullname: fullname.trim(),
    })
    onClose()
  }

  const handleReset = () => {
    setTraderId('')
    setCardNumber('')
    setPhoneNumber('')
    setAccountNumber('')
    setOperationType('')
    setPaymentMethod('')
    setFullname('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">Трейдер</label>
        <Dropdown
          options={TRADER_OPTIONS}
          value={traderId}
          onChange={setTraderId}
          placeholder="Выберите трейдера"
        />
      </div>

      <div className="space-y-2">
        <span className="block text-sm font-medium text-gray-300">Номер карты / Телефона / Счёта (только один)</span>
        <div className="grid gap-3">
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardChange}
            placeholder="Номер карты"
            className={inputClass}
            aria-label="Номер карты"
          />
          <input
            type="text"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Номер телефона"
            className={inputClass}
            aria-label="Номер телефона"
          />
          <input
            type="text"
            value={accountNumber}
            onChange={handleAccountChange}
            placeholder="Номер счета"
            className={inputClass}
            aria-label="Номер счета"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">Тип операции</label>
        <Dropdown
          options={OPERATION_TYPE_OPTIONS}
          value={operationType}
          onChange={setOperationType}
          placeholder="Выберите тип"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">Метод оплаты</label>
        <Dropdown
          options={PAYMENT_METHOD_OPTIONS}
          value={paymentMethod}
          onChange={setPaymentMethod}
          placeholder="Выберите метод"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-300">ФИО</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="ФИО"
          className={inputClass}
          aria-label="ФИО"
        />
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button type="submit" variant="primary">
          Применить
        </Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Сбросить
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          Отмена
        </Button>
      </div>
    </form>
  )
}

export const getEmptyRequisitesFilters = () => ({
  traderId: '',
  cardNumber: '',
  phoneNumber: '',
  accountNumber: '',
  operationType: '',
  paymentMethod: '',
  fullname: '',
})
