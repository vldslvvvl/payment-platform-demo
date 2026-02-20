import { useCallback, useMemo, useState } from 'react'
import Table from '../components/ui/Table'
import PageHeader from '../components/ui/PageHeader'
import Switch from '../components/ui/Switch'
import { mockBanks } from '../mocks/banks'
import { getBankIcon } from '../config/bankIcons'

function copyToClipboard(text) {
  return navigator.clipboard.writeText(text)
}

export default function Banks() {
  const [banks, setBanks] = useState(() => [...mockBanks])

  const handleCopyId = useCallback((id) => {
    copyToClipboard(id)
  }, [])

  const handleStatusChange = useCallback((row) => {
    const newStatus = row.status === 'active' ? 'inactive' : 'active'
    setBanks((prev) =>
      prev.map((b) => (b.id === row.id ? { ...b, status: newStatus } : b))
    )
  }, [])

  const columns = useMemo(() => [
    {
      key: 'icon',
      label: 'Иконка',
      render: (row) => {
        const iconSrc = getBankIcon(row)
        if (!iconSrc) return '—'
        return (
          <img
            src={iconSrc}
            alt=""
            className="w-6 h-6 shrink-0 object-contain"
            aria-hidden
          />
        )
      },
    },
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
    { key: 'name', label: 'Название' },
    { key: 'code', label: 'Код' },
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
  ], [handleCopyId, handleStatusChange])

  return (
    <div>
      <PageHeader title="Банки" iconKey="banks" />
      <div className="mt-4">
        <Table columns={columns} data={banks} limit={10} />
      </div>
    </div>
  )
}
