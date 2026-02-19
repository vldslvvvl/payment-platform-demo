import { useState, useMemo, useEffect } from 'react'

function getCellValue(row, key) {
  const value = key.split('.').reduce((obj, k) => obj?.[k], row)
  return value != null ? String(value) : '—'
}

/**
 * @param {{ columns: Array<{ key: string, label: string, render?: (row: Record<string, unknown>) => import('react').ReactNode }>, data: Array<Record<string, unknown>>, limit?: number }} props
 */
export default function Table({ columns, data, limit = 10 }) {
  const [page, setPage] = useState(1)

  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / limit) || 1
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * limit
  const pageData = useMemo(
    () => data.slice(start, start + limit),
    [data, start, limit]
  )

  const showPagination = totalPages > 1

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(1)
  }, [totalPages, page])

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(p, totalPages))
    setPage(next)
  }

  const pageNumbers = useMemo(() => {
    const pages = []
    const showEllipsisStart = totalPages > 5 && currentPage > 3
    const showEllipsisEnd = totalPages > 5 && currentPage < totalPages - 2
    let from = 1
    let to = totalPages
    if (totalPages > 5) {
      from = Math.max(1, currentPage - 2)
      to = Math.min(totalPages, currentPage + 2)
    }
    for (let i = from; i <= to; i++) pages.push(i)
    return { pages, showEllipsisStart, showEllipsisEnd, from, to }
  }, [totalPages, currentPage])

  return (
    <div className="space-y-4">
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
            {pageData.map((row, idx) => (
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

      {showPagination && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">
            Показано {start + 1}–{Math.min(start + limit, totalItems)} из {totalItems}
          </p>
          <nav className="flex items-center gap-1" aria-label="Пагинация">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded border border-gray-600 text-sm text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Назад
            </button>
            <div className="flex items-center gap-1">
              {pageNumbers.from > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goToPage(1)}
                    className="min-w-[2rem] px-2 py-1.5 rounded text-sm text-gray-300 hover:bg-gray-700"
                  >
                    1
                  </button>
                  {pageNumbers.from > 2 && <span className="px-1 text-gray-500">…</span>}
                </>
              )}
              {pageNumbers.pages.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  className={`min-w-[2rem] px-2 py-1.5 rounded text-sm ${p === currentPage ? 'bg-primary text-black font-medium' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {p}
                </button>
              ))}
              {pageNumbers.to < totalPages && (
                <>
                  {pageNumbers.to < totalPages - 1 && <span className="px-1 text-gray-500">…</span>}
                  <button
                    type="button"
                    onClick={() => goToPage(totalPages)}
                    className="min-w-[2rem] px-2 py-1.5 rounded text-sm text-gray-300 hover:bg-gray-700"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded border border-gray-600 text-sm text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Вперёд
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}
