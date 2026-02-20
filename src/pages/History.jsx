import { useCallback, useMemo } from 'react'
import Table from '../components/ui/Table'
import PageHeader from '../components/ui/PageHeader'
import { mockOrders } from '../mocks/orders'
import { mockUsers } from '../mocks/users'
import { mockBanks } from '../mocks/banks'
import activeIcon from '../assets/icons/active.svg'
import inactiveIcon from '../assets/icons/inactive.svg'
import cardIcon from '../assets/icons/cards/card.svg'
import phoneIcon from '../assets/icons/cards/phone.svg'
import cardTransferIcon from '../assets/icons/cards/card-transfer.svg'
import actionIcon from '../assets/icons/action.svg'
import ActionPopover from '../components/ui/ActionPopover'
import { getBankIcon } from '../config/bankIcons'

const usersById = Object.fromEntries(mockUsers.map((u) => [u.user_id, u]))
const banksById = Object.fromEntries(mockBanks.map((b) => [b.id, b]))

const REQUISITE_TYPE_ICON = {
  card2card: cardIcon,
  sbp: phoneIcon,
  'account-transfer': cardTransferIcon,
  qr_nspk: cardIcon,
}

function getOrderRequisiteDisplayValue(row) {
  if (row.requisites) return row.requisites
  if (row.requisite_phone) return row.requisite_phone
  return '—'
}

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

function formatDateTime(isoString) {
  if (!isoString) return '—'
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return '—'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

const STATUS_LABELS = {
  completed: 'Оплачено',
  cancelled: 'Отменено',
  'in progress': 'В процессе',
}

function UserCell({ userId }) {
  const user = usersById[userId]
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
}

function getOrderActions(row) {
  const status = row?.status ?? ''
  const actions = [
    {
      id: 'deal-card',
      label: 'Карточка сделки',
      onClick: () => {
        // TODO: переход на карточку сделки
        console.log('Карточка сделки', row?.id)
      },
    },
  ]
  if (status === 'in progress') {
    actions.push({
      id: 'confirm',
      label: 'Подтвердить',
      variant: 'primary',
      onClick: () => {
        // TODO: подтверждение ордера
        console.log('Подтвердить', row?.id)
      },
    }),
    actions.push({
      id: 'cancel',
      label: 'Отменить',
      variant: 'danger',
      onClick: () => {
        // TODO: отмена ордера
        console.log('Отменить', row?.id)
      },
    })
  } else {
    actions.push({
      id: 'appeal',
      label: 'Создать аппеляцию',
      onClick: () => {
        // TODO: создание аппеляции
        console.log('Создать аппеляцию', row?.id)
      },
    })
  }
  if (status === 'cancelled') {
    actions.push({
      id: 'confirm',
      label: 'Подтвердить',
      variant: 'primary',
      onClick: () => {
        // TODO: подтверждение отменённого ордера
        console.log('Подтвердить', row?.id)
      },
    })
  }
  return actions
}

export default function History() {
  const handleCopyId = useCallback((id) => {
    copyToClipboard(id)
  }, [])

  const columns = useMemo(
    () => [
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
        key: 'invid',
        label: 'Invid',
        render: (row) => row.invid ?? '—',
      },
      { key: 'amount', label: 'Сумма' },
      {
        key: 'exchange_rate',
        label: 'Курс',
        render: (row) => (row.exchange_rate != null ? String(row.exchange_rate) : '—'),
      },
      {
        key: 'order_type',
        label: 'Тип',
        render: (row) => {
          const op = row.order_type
          if (op === 'debit') return <span className="text-primary">Пополнение</span>
          if (op === 'credit') return <span className="text-danger">Вывод</span>
          return '—'
        },
      },
      {
        key: 'status',
        label: 'Статус',
        render: (row) => {
          const status = row.status
          const label = STATUS_LABELS[status] ?? status ?? '—'
          if (status === 'completed') return <span className="text-primary whitespace-nowrap">{label}</span>
          if (status === 'cancelled') return <span className="text-danger whitespace-nowrap">{label}</span>
          if (status === 'in progress') return <span className="text-amber-400 whitespace-nowrap">{label}</span>
          return label
        },
      },
      {
        key: 'requisites_cell',
        label: 'Реквизиты',
        render: (row) => {
          const bank = row.bank ? banksById[row.bank] : null
          const bankName = bank?.name ?? '—'
          const bankIconSrc = bank ? getBankIcon(bank) : null
          const requisiteValue = getOrderRequisiteDisplayValue(row)
          const iconSrc = REQUISITE_TYPE_ICON[row.requisite_type] ?? cardIcon
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
                  className={`h-auto shrink-0 brightness-0 invert ${row.requisite_type === 'account-transfer' ? 'w-4' : 'w-3'}`}
                  aria-hidden
                />
                <span>{requisiteValue}</span>
              </span>
            </div>
          )
        },
      },
      {
        key: 'requisite_fio',
        label: 'ФИО',
        render: (row) => row.requisite_fio ?? '—',
      },
      {
        key: 'created_at',
        label: 'Создан',
        render: (row) => formatDateTime(row.created_at),
      },
      {
        key: 'merchant',
        label: 'Мерчант',
        render: (row) => <UserCell userId={row.merchant_id} />,
      },
      {
        key: 'trader',
        label: 'Трейдер',
        render: (row) => <UserCell userId={row.trader_id} />,
      },
      {
        key: 'actions',
        label: '',
        render: (row) => (
          <ActionPopover
            actions={getOrderActions(row)}
            triggerIcon={actionIcon}
          />
        ),
      },
    ],
    [handleCopyId]
  )

  return (
    <div>
      <PageHeader title="История" iconKey="history" />
      <Table columns={columns} data={mockOrders} limit={10} />
    </div>
  )
}
