import { useCallback } from 'react'
import Table from '../components/ui/Table'
import PageHeader from '../components/ui/PageHeader'
import Switch from '../components/ui/Switch'
import { mockRequisites } from '../mocks/requisites'
import { mockUsers } from '../mocks/users'
import cardIcon from '../assets/icons/cards/card.svg'
import phoneIcon from '../assets/icons/cards/phone.svg'
import cardTransferIcon from '../assets/icons/cards/card-transfer.svg'
import activeIcon from '../assets/icons/active.svg'
import inactiveIcon from '../assets/icons/inactive.svg'
import { getBankIcon } from '../config/bankIcons'

const usersById = Object.fromEntries(mockUsers.map((u) => [u.user_id, u]))

const REQUISITE_TYPE_ICON = {
  card2card: cardIcon,
  sbp: phoneIcon,
  'account-transfer': cardTransferIcon,
}

function getRequisiteDisplayValue(row) {
  if (row.requisites) return row.requisites
  if (row.phone_number) return row.phone_number
  if (row.iban) return row.iban
  return '—'
}

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

export default function Requisites() {
  const handleCopyId = useCallback((id) => {
    copyToClipboard(id)
  }, [])

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleCopyId(row.id)}
          className="text-primary cursor-pointer hover:underline text-left"
        >
          {row.id}
        </button>
      ),
    },
    {
      key: 'requisites_cell',
      label: 'Реквизиты',
      render: (row) => {
        const bankName = row.bank?.name ?? '—'
        const bankIconSrc = row.bank ? getBankIcon(row.bank) : null
        const requisiteValue = getRequisiteDisplayValue(row)
        const iconSrc = REQUISITE_TYPE_ICON[row.requisites_type] ?? cardIcon
        return (
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              {bankIconSrc && (
                <img
                  src={bankIconSrc}
                  alt=""
                  className="w-4 h-4 shrink-0 object-contain"
                  aria-hidden
                />
              )}
              <span>{bankName}</span>
            </span>
            <span className="flex items-center gap-2">
              <img
                src={iconSrc}
                alt=""
                className={`h-auto shrink-0 brightness-0 invert ${row.requisites_type === 'account-transfer' ? 'w-4' : 'w-3'}`}
                aria-hidden
              />
              <span>{requisiteValue}</span>
            </span>
          </div>
        )
      },
    },
    { key: 'fullname', label: 'ФИО' },
    {
      key: 'user',
      label: 'Пользователь',
      render: (row) => {
        const user = usersById[row.trader_id]
        if (!user) return '—'
        const isActive = user.status_code === 'active'
        const statusIcon = isActive ? activeIcon : inactiveIcon
        const statusAlt = isActive ? 'Активен' : 'Неактивен'
        return (
          <span className="flex items-center gap-2">
            <img src={statusIcon} alt={statusAlt} className="w-3.5 h-auto shrink-0" />
            <span>{user.login}</span>
          </span>
        )
      },
    },
    {
      key: 'operation_type',
      label: 'Тип операции',
      render: (row) => {
        const op = row.operation_type
        if (op === 'debit') return <span className="text-primary">Пополнение</span>
        if (op === 'credit') return <span className="text-danger">Вывод</span>
        return '—'
      },
    },
    {
      key: 'limit',
      label: 'Лимит',
      render: (row) => {
        const min = row.limit_min != null ? Number(row.limit_min) : null
        const max = row.limit_max != null ? Number(row.limit_max) : null
        if (min == null && max == null) return '—'
        if (min != null && max != null) return `${min} - ${max}`
        if (min != null) return String(min)
        return String(max)
      },
    },
    {
      key: 'status',
      label: 'Статус',
      render: (row) => (
        <Switch checked={row.status === 'active'} disabled />
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="Реквизиты" iconKey="cards" />
      <Table columns={columns} data={mockRequisites} limit={10} />
    </div>
  )
}
