import Table from '../components/ui/Table'
import PageHeader from '../components/ui/PageHeader'
import { mockRequisites } from '../mocks/requisites'

function getRequisiteDisplayValue(row) {
  if (row.requisites) return row.requisites
  if (row.phone_number) return row.phone_number
  if (row.iban) return row.iban
  return '—'
}

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'requisites_display', label: 'Реквизит / Телефон / IBAN' },
  { key: 'fullname', label: 'ФИО' },
  { key: 'requisites_type', label: 'Тип реквизита' },
  { key: 'operation_type', label: 'Тип операции' },
  { key: 'status', label: 'Статус' },
  { key: 'bank.name', label: 'Банк' },
  { key: 'limit_min', label: 'Лимит мин' },
  { key: 'limit_max', label: 'Лимит макс' },
]

export default function Requisites() {
  const data = mockRequisites.map((r) => ({
    ...r,
    requisites_display: getRequisiteDisplayValue(r),
  }))
  return (
    <div>
      <PageHeader title="Ревизиты" iconKey="cards" />
      <Table columns={COLUMNS} data={data} />
    </div>
  )
}
