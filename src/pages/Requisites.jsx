import { useCallback, useMemo, useState, useEffect } from 'react'
import Table, { filterColumnsByRole } from '../components/ui/Table'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Checkbox from '../components/ui/Checkbox'
import Modal from '../components/ui/Modal'
import RequisiteFormModal from '../components/requisites/RequisiteFormModal'
import RequisitesFiltersModal, { getEmptyRequisitesFilters } from '../components/requisites/RequisitesFiltersModal'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Switch from '../components/ui/Switch'
import { mockUsers } from '../mocks/users'
import { getRequisitesList, saveRequisite, updateRequisite } from '../utils/requisitesStorage'
import cardIcon from '../assets/icons/cards/card.svg'
import phoneIcon from '../assets/icons/cards/phone.svg'
import cardTransferIcon from '../assets/icons/cards/card-transfer.svg'
import activeIcon from '../assets/icons/active.svg'
import inactiveIcon from '../assets/icons/inactive.svg'
import filterIcon from '../assets/icons/filter.svg'
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

const STATUS_VISIBLE_ROLES = ['admin', 'trader']
const ACTIONS_VISIBLE_ROLES = ['admin']

const OPERATION_LABELS = { debit: 'Пополнение', credit: 'Вывод' }
const PAYMENT_METHOD_LABELS = { 'card2card': 'Номер карты', sbp: 'СБП', 'account-transfer': 'Номер счета' }

function normalizeForSearch(s) {
  return (s ?? '').replace(/\D/g, '')
}

function applyRequisitesFilters(list, filters) {
  if (!filters) return list
  const {
    traderId,
    cardNumber,
    phoneNumber,
    accountNumber,
    operationType,
    paymentMethod,
    fullname,
  } = filters
  const hasNumberFilter = cardNumber || phoneNumber || accountNumber
  const numberFilterNorm = cardNumber
    ? normalizeForSearch(cardNumber)
    : phoneNumber
      ? normalizeForSearch(phoneNumber)
      : accountNumber
        ? normalizeForSearch(accountNumber)
        : ''
  const numberFilterType = cardNumber ? 'card' : phoneNumber ? 'phone' : accountNumber ? 'account' : null

  return list.filter((row) => {
    if (traderId && row.trader_id !== traderId) return false
    if (operationType && row.operation_type !== operationType) return false
    if (paymentMethod && row.requisites_type !== paymentMethod) return false
    if (fullname) {
      const rowName = (row.fullname ?? '').toLowerCase()
      if (!rowName.includes(fullname.toLowerCase())) return false
    }
    if (hasNumberFilter && numberFilterNorm) {
      const rowCard = normalizeForSearch(row.requisites)
      const rowPhone = normalizeForSearch(row.phone_number)
      const rowIban = normalizeForSearch(row.iban)
      if (numberFilterType === 'card' && !rowCard.includes(numberFilterNorm)) return false
      if (numberFilterType === 'phone' && !rowPhone.includes(numberFilterNorm)) return false
      if (numberFilterType === 'account' && !rowIban.includes(numberFilterNorm)) return false
    }
    return true
  })
}

export default function Requisites() {
  const { user } = useAuth()
  const toast = useToast()
  const [hideInactive, setHideInactive] = useState(false)
  const [requisitesList, setRequisitesList] = useState(() => getRequisitesList(user.user_id))
  const [modalMode, setModalMode] = useState(null)
  const [editingRequisite, setEditingRequisite] = useState(null)
  const [filters, setFilters] = useState(getEmptyRequisitesFilters)
  const [filtersModalOpen, setFiltersModalOpen] = useState(false)

  useEffect(() => {
    setRequisitesList(getRequisitesList(user.user_id))
  }, [user.user_id])

  const handleCopyId = useCallback((id) => {
    copyToClipboard(id)
  }, [])

  const openCreate = useCallback(() => {
    setEditingRequisite(null)
    setModalMode('create')
  }, [])

  const openEdit = useCallback((row) => {
    setEditingRequisite(row)
    setModalMode('edit')
  }, [])

  const closeModal = useCallback(() => {
    setModalMode(null)
    setEditingRequisite(null)
  }, [])

  const openFiltersModal = useCallback(() => setFiltersModalOpen(true), [])
  const closeFiltersModal = useCallback(() => setFiltersModalOpen(false), [])
  const handleFiltersSubmit = useCallback((newFilters) => {
    setFilters(newFilters)
    closeFiltersModal()
  }, [closeFiltersModal])
  const clearFilters = useCallback(() => setFilters(getEmptyRequisitesFilters()), [])

  const hasActiveFilters = useMemo(() => {
    const f = filters
    return !!(
      f.traderId ||
      f.cardNumber ||
      f.phoneNumber ||
      f.accountNumber ||
      f.operationType ||
      f.paymentMethod ||
      f.fullname
    )
  }, [filters])

  const handleSubmit = useCallback(
    (payload) => {
      const traderId = user.user_id
      if (modalMode === 'create') {
        const withId = { ...payload, id: crypto.randomUUID(), trader_id: traderId }
        setRequisitesList(saveRequisite(withId, traderId))
        toast.success('Реквизит успешно создан')
      } else {
        const withTrader = { ...editingRequisite, ...payload, trader_id: editingRequisite.trader_id || traderId }
        setRequisitesList(updateRequisite(withTrader, traderId))
        toast.success('Реквизит успешно изменён')
      }
      closeModal()
    },
    [user.user_id, modalMode, editingRequisite, closeModal, toast]
  )

  const handleStatusChange = useCallback(
    (row) => {
      const newStatus = row.status === 'active' ? 'inactive' : 'active'
      const updated = { ...row, status: newStatus }
      const traderId = row.trader_id || user.user_id
      setRequisitesList(updateRequisite(updated, traderId))
      toast.success(newStatus === 'active' ? 'Реквизит активирован' : 'Реквизит деактивирован')
    },
    [user.user_id, toast]
  )

  const columns = useMemo(() => [
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
        <Switch
          checked={row.status === 'active'}
          onChange={() => handleStatusChange(row)}
        />
      ),
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (row) => (
        <Button variant="secondary" onClick={() => openEdit(row)}>
          Изменить
        </Button>
      ),
    },
  ], [openEdit, handleStatusChange])

  const visibleColumns = useMemo(
    () =>
      filterColumnsByRole(columns, user.role, {
        status: STATUS_VISIBLE_ROLES,
        actions: ACTIONS_VISIBLE_ROLES,
      }),
    [columns, user.role]
  )

  const tableData = useMemo(() => {
    const list = hideInactive ? requisitesList.filter((row) => row.status === 'active') : requisitesList
    return applyRequisitesFilters(list, filters)
  }, [hideInactive, requisitesList, filters])

  return (
    <div>
      <PageHeader title="Реквизиты" iconKey="cards" />
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {user.role === 'trader' && (
          <Button variant="primary" onClick={openCreate}>
            Добавить реквизит
          </Button>
        )}
        <Button
          variant="secondary"
          icon={<img src={filterIcon} alt="" className="w-3 h-3 brightness-0 invert" aria-hidden />}
          onClick={openFiltersModal}
        >
          Фильтры
        </Button>
        <Checkbox
          checked={hideInactive}
          onChange={setHideInactive}
          label="Скрыть неактивные"
        />
      </div>
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-gray-400">Активные фильтры:</span>
          {filters.traderId && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-600 px-2.5 py-0.5 text-sm text-gray-200">
              Трейдер: {usersById[filters.traderId]?.login ?? filters.traderId}
            </span>
          )}
          {(filters.cardNumber || filters.phoneNumber || filters.accountNumber) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-600 px-2.5 py-0.5 text-sm text-gray-200">
              {filters.cardNumber && `Карта: ${filters.cardNumber}`}
              {filters.phoneNumber && `Телефон: ${filters.phoneNumber}`}
              {filters.accountNumber && `Счёт: ${filters.accountNumber}`}
            </span>
          )}
          {filters.operationType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-600 px-2.5 py-0.5 text-sm text-gray-200">
              Тип: {OPERATION_LABELS[filters.operationType] ?? filters.operationType}
            </span>
          )}
          {filters.paymentMethod && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-600 px-2.5 py-0.5 text-sm text-gray-200">
              Метод: {PAYMENT_METHOD_LABELS[filters.paymentMethod] ?? filters.paymentMethod}
            </span>
          )}
          {filters.fullname && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-600 px-2.5 py-0.5 text-sm text-gray-200">
              ФИО: {filters.fullname}
            </span>
          )}
          <Button variant="secondary" onClick={clearFilters}>
            Сбросить фильтры
          </Button>
        </div>
      )}
      <Table columns={visibleColumns} data={tableData} limit={10} />

      <Modal
        open={modalMode !== null}
        onClose={closeModal}
        title={modalMode === 'create' ? 'Добавить реквизит' : 'Редактировать реквизит'}
      >
        <RequisiteFormModal
          mode={modalMode === 'create' ? 'create' : 'edit'}
          initialRequisite={editingRequisite}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      </Modal>

      <Modal open={filtersModalOpen} onClose={closeFiltersModal} title="Фильтры">
        <RequisitesFiltersModal
          filters={filters}
          onSubmit={handleFiltersSubmit}
          onClose={closeFiltersModal}
        />
      </Modal>
    </div>
  )
}
