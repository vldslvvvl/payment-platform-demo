import Table from '../components/ui/Table'
import PageHeader from '../components/ui/PageHeader'
import { mockBanks } from '../mocks/banks'

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Название' },
  { key: 'code', label: 'Код' },
  { key: 'status', label: 'Статус' },
  { key: 'created_at', label: 'Создан' },
]

export default function Banks() {
  return (
    <div>
      <PageHeader title="Банки" iconKey="banks" />
      <Table columns={COLUMNS} data={mockBanks} />
    </div>
  )
}
