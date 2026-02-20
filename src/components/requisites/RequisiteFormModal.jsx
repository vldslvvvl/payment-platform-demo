import { useState, useCallback, useMemo } from 'react'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import Radio from '../ui/Radio'
import Dropdown from '../ui/Dropdown'
import { mockBanks } from '../../mocks/banks'
import { getBankIcon } from '../../config/bankIcons'

const PAYMENT_METHODS = [
  { value: 'card2card', label: 'Номер карты' },
  { value: 'sbp', label: 'СБП' },
  { value: 'account-transfer', label: 'Номер счёта' },
]

const inputClass =
  'w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function formatPhoneRu(value) {
  const digits = value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11)
  if (digits.length === 0) return ''
  if (digits[0] !== '7') return `+7 (${digits.slice(1, 4)}`
  let s = '+7'
  if (digits.length > 1) s += ` (${digits.slice(1, 4)}`
  if (digits.length > 4) s += `) ${digits.slice(4, 7)}`
  if (digits.length > 7) s += `-${digits.slice(7, 9)}`
  if (digits.length > 9) s += `-${digits.slice(9, 11)}`
  return s
}

function parsePhoneToStorage(displayValue) {
  const digits = displayValue.replace(/\D/g, '')
  if (digits.length >= 11 && digits[0] === '7') return digits
  if (digits.length >= 10) return '7' + digits.slice(-10)
  return displayValue
}

function phoneDigitsCount(displayValue) {
  return (displayValue || '').replace(/\D/g, '').replace(/^8/, '7').length
}

function cardDigitsCount(displayValue) {
  return (displayValue || '').replace(/\D/g, '').length
}

function getEmptyForm() {
  return {
    operation_type: 'debit',
    requisites_type: 'card2card',
    order_cnt_per_day: '',
    order_sum_per_day: '',
    order_gap: '',
    order_in_parallel: '',
    cnt_issuance: '',
    start_work_time: '',
    end_work_time: '',
    fullname: '',
    limit_min: '',
    limit_max: '',
    bank_id: '',
    requisites: '',
    iban: '',
    phone_number: '',
    bank_bik: '',
  }
}

function requisiteToForm(r) {
  if (!r) return getEmptyForm()
  const phone = r.phone_number ?? ''
  return {
    operation_type: r.operation_type ?? 'debit',
    requisites_type: r.requisites_type ?? 'card2card',
    order_cnt_per_day: r.order_cnt_per_day ?? '',
    order_sum_per_day: r.order_sum_per_day ?? '',
    order_gap: r.order_gap ?? '',
    order_in_parallel: r.order_in_parallel ?? '',
    cnt_issuance: r.cnt_issuance ?? '',
    start_work_time: r.start_work_time ?? '',
    end_work_time: r.end_work_time ?? '',
    fullname: r.fullname ?? '',
    limit_min: r.limit_min != null ? r.limit_min : '',
    limit_max: r.limit_max != null ? r.limit_max : '',
    bank_id: r.bank_id ?? '',
    requisites: r.requisites ?? '',
    iban: r.iban ?? '',
    phone_number: typeof phone === 'string' && phone ? formatPhoneRu(phone) : '',
    bank_bik: r.bank_bik ?? '',
  }
}

/**
 * @param {{ mode: 'create' | 'edit', initialRequisite?: Record<string, unknown> | null, onSubmit: (values: Record<string, unknown>) => void, onClose: () => void }} props
 */
export default function RequisiteFormModal({ mode, initialRequisite, onSubmit, onClose }) {
  const [form, setForm] = useState(() => requisiteToForm(initialRequisite ?? null))

  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const payload = {
        ...(initialRequisite?.id && { id: initialRequisite.id }),
        ...(initialRequisite?.trader_id && { trader_id: initialRequisite.trader_id }),
        ...(initialRequisite?.created_at && { created_at: initialRequisite.created_at }),
        operation_type: form.operation_type,
        requisites_type: form.requisites_type,
        order_cnt_per_day: form.order_cnt_per_day === '' ? null : Number(form.order_cnt_per_day),
        order_sum_per_day: form.order_sum_per_day === '' ? null : Number(form.order_sum_per_day),
        order_gap: form.order_gap === '' ? null : Number(form.order_gap),
        order_in_parallel: form.order_in_parallel === '' ? null : Number(form.order_in_parallel),
        cnt_issuance: form.cnt_issuance === '' ? null : Number(form.cnt_issuance),
        start_work_time: form.start_work_time || null,
        end_work_time: form.end_work_time || null,
        fullname: form.fullname || null,
        limit_min: form.limit_min === '' ? null : Number(form.limit_min),
        limit_max: form.limit_max === '' ? null : Number(form.limit_max),
        bank_id: form.bank_id || null,
        requisites: form.requisites_type === 'card2card' ? (form.requisites || null) : null,
        iban: form.requisites_type !== 'card2card' ? (form.iban || null) : null,
        phone_number: form.phone_number ? parsePhoneToStorage(form.phone_number) : null,
        bank_bik: form.bank_bik || null,
        status: initialRequisite?.status ?? 'active',
        country: 'RUS',
        qr_manager_key: null,
        statistics: initialRequisite?.statistics ?? undefined,
      }
      onSubmit(payload)
    },
    [form, initialRequisite, onSubmit]
  )

  const isCard = form.requisites_type === 'card2card'
  const isAccountOrSbp = form.requisites_type === 'sbp' || form.requisites_type === 'account-transfer'
  const isSbp = form.requisites_type === 'sbp'
  const isAccountTransfer = form.requisites_type === 'account-transfer'

  const canSubmit = useMemo(() => {
    if (!form.fullname?.trim()) return false
    if (!form.bank_id) return false
    if (isSbp && phoneDigitsCount(form.phone_number) < 10) return false
    if (isCard && cardDigitsCount(form.requisites) < 16) return false
    if (isAccountTransfer && !form.iban?.trim()) return false
    return true
  }, [form.fullname, form.bank_id, form.phone_number, form.requisites, form.iban, isSbp, isCard, isAccountTransfer])

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <form id="requisite-form" onSubmit={handleSubmit} className="space-y-4 pb-2">
      {/* 1. Тип операции — чекбоксы (взаимоисключающие) */}
      <div>
        <span className="block text-xs font-medium text-gray-400 mb-2">Тип операции</span>
        <div className="flex gap-6">
          <Checkbox
            label="Пополнение"
            checked={form.operation_type === 'debit'}
            onChange={(checked) => checked && update('operation_type', 'debit')}
          />
          <Checkbox
            label="Вывод"
            checked={form.operation_type === 'credit'}
            onChange={(checked) => checked && update('operation_type', 'credit')}
          />
        </div>
      </div>

      {/* 2. Метод оплаты — радио */}
      <div>
        <span className="block text-xs font-medium text-gray-400 mb-2">Метод оплаты</span>
        <div className="flex flex-wrap gap-4">
          {PAYMENT_METHODS.map(({ value, label }) => (
            <Radio
              key={value}
              name="requisites_type"
              value={value}
              checked={form.requisites_type === value}
              onChange={() => update('requisites_type', value)}
              label={label}
            />
          ))}
        </div>
      </div>

      {/* 3. Числовые инпуты */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Количество успешных ордеров в день</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.order_cnt_per_day}
            onChange={(e) => update('order_cnt_per_day', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Сумма успешных ордеров в день (₽)</label>
          <input
            type="number"
            min={0}
            step={0.01}
            className={inputClass}
            value={form.order_sum_per_day}
            onChange={(e) => update('order_sum_per_day', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Мин. интервал между ордерами (сек)</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.order_gap}
            onChange={(e) => update('order_gap', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Количество одновременных ордеров</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.order_in_parallel}
            onChange={(e) => update('order_in_parallel', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Количество показов реквизита</label>
          <input
            type="number"
            min={0}
            className={inputClass}
            value={form.cnt_issuance}
            onChange={(e) => update('cnt_issuance', e.target.value)}
          />
        </div>
      </div>

      {/* 4. Рабочее время */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Рабочее время от (МСК)</label>
          <input
            type="time"
            className={inputClass}
            value={form.start_work_time}
            onChange={(e) => update('start_work_time', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Рабочее время до (МСК)</label>
          <input
            type="time"
            className={inputClass}
            value={form.end_work_time}
            onChange={(e) => update('end_work_time', e.target.value)}
          />
        </div>
      </div>

      {/* 5. ФИО */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">ФИО <span className="text-red-400">*</span></label>
        <input
          type="text"
          required
          className={inputClass}
          value={form.fullname}
          onChange={(e) => update('fullname', e.target.value)}
          placeholder="Фамилия Имя Отчество"
        />
      </div>

      {/* 6. Лимиты */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Лимит мин.</label>
          <input
            type="number"
            min={0}
            step={0.01}
            className={inputClass}
            value={form.limit_min}
            onChange={(e) => update('limit_min', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Лимит макс.</label>
          <input
            type="number"
            min={0}
            step={0.01}
            className={inputClass}
            value={form.limit_max}
            onChange={(e) => update('limit_max', e.target.value)}
          />
        </div>
      </div>

      {/* 7. Банк */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Банк <span className="text-red-400">*</span></label>
        <Dropdown
          required
          placeholder="Выберите банк"
          value={form.bank_id}
          onChange={(id) => update('bank_id', id)}
          options={mockBanks.map((b) => ({
            value: b.id,
            label: b.name,
            icon: getBankIcon(b) ?? undefined,
          }))}
          aria-label="Банк"
        />
      </div>

      {/* 8. Номер карты / Номер счёта (условно) */}
      {isCard && (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Номер карты <span className="text-red-400">*</span></label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={19}
            className={inputClass}
            value={form.requisites}
            onChange={(e) => update('requisites', formatCardNumber(e.target.value))}
            placeholder="0000 0000 0000 0000"
          />
        </div>
      )}
      {isAccountOrSbp && (
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">
            Номер счёта {isAccountTransfer ? <span className="text-red-400">*</span> : null}
          </label>
          <input
            type="text"
            className={inputClass}
            value={form.iban}
            onChange={(e) => update('iban', e.target.value)}
            placeholder="Номер счёта"
          />
        </div>
      )}

      {/* 9. Телефон с маской РФ */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">
          Телефон {isSbp ? <span className="text-red-400">*</span> : null}
        </label>
        <input
          type="tel"
          className={inputClass}
          value={form.phone_number}
          onChange={(e) => update('phone_number', formatPhoneRu(e.target.value))}
          placeholder="+7 (999) 123-45-67"
        />
      </div>

      {/* 10. БИК банка */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">БИК банка</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={9}
          className={inputClass}
          value={form.bank_bik}
          onChange={(e) => update('bank_bik', e.target.value.replace(/\D/g, '').slice(0, 9))}
          placeholder="9 цифр"
        />
      </div>
        </form>
      </div>
      <div className="shrink-0 flex justify-end gap-2 pt-3 mt-auto border-t border-gray-600">
        <Button type="button" variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button type="submit" form="requisite-form" variant="primary" disabled={!canSubmit}>
          Сохранить
        </Button>
      </div>
    </div>
  )
}

export { requisiteToForm, getEmptyForm }
