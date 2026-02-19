import Table from '../components/ui/Table'
import PageHeader from '../components/ui/PageHeader'
import { mockOrders } from '../mocks/orders'

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'amount', label: 'Сумма' },
  { key: 'order_type', label: 'Тип' },
  { key: 'status', label: 'Статус' },
  { key: 'created_at', label: 'Создан' },
  { key: 'merchant_id', label: 'ID мерчанта' },
  { key: 'trader_id', label: 'ID трейдера' },
]

export default function History() {
  return (
    <div>
      <PageHeader title="История" iconKey="history" />
      <Table columns={COLUMNS} data={mockOrders} />
    </div>
  )
}
