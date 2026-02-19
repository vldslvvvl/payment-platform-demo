function getCellValue(row, key) {
  const value = key.split('.').reduce((obj, k) => obj?.[k], row)
  return value != null ? String(value) : '—'
}

/**
 * @param {{ columns: Array<{ key: string, label: string, render?: (row: Record<string, unknown>) => import('react').ReactNode }>, data: Array<Record<string, unknown>> }} props
 */
export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-[#373636]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? 'bg-[#2A2A2A]' : 'bg-[#373636]'}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-gray-200 break-words align-middle"
                >
                  {col.render ? col.render(row) : getCellValue(row, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
