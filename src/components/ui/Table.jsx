function getCellValue(row, key) {
  const value = key.split('.').reduce((obj, k) => obj?.[k], row)
  return value != null ? String(value) : '—'
}

/**
 * @param {{ columns: Array<{ key: string, label: string }>, data: Array<Record<string, unknown>> }} props
 */
export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-800/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                  {getCellValue(row, col.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
