import Table from '../components/ui/Table'
import PageHeader from '../components/ui/PageHeader'
import { mockUsers } from '../mocks/users'

const COLUMNS = [
  { key: 'user_id', label: 'ID' },
  { key: 'login', label: 'Логин' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Роль' },
  { key: 'status_code', label: 'Статус' },
  { key: 'create_dttm', label: 'Создан' },
]

export default function Users() {
  return (
    <div>
      <PageHeader title="Пользователи" iconKey="profile" />
      <Table columns={COLUMNS} data={mockUsers} limit={10} />
    </div>
  )
}
