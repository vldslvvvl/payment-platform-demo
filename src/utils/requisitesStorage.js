import { mockRequisites } from '../mocks/requisites'
import { mockBanks } from '../mocks/banks'

const STORAGE_KEY = 'requisites_local'

const banksById = Object.fromEntries(mockBanks.map((b) => [b.id, b]))

const defaultStatistics = (traderId, requisiteId) => ({
  stat_order_in_parallel: 0,
  trader_id: traderId,
  stat_cnt_success_order: 0,
  stat_median_amount: 0.0,
  stat_success_conversion: 0.0,
  id: requisiteId,
  stat_last_order_create_dttm: null,
  stat_cnt_issuance: 0,
  stat_sum_success_order: 0.0,
  stat_mean_amount: 0.0,
  stat_created_exist: false,
})

/**
 * Читает массив реквизитов из localStorage (только созданные/отредактированные пользователем).
 * @returns {Array<Record<string, unknown>>}
 */
function getLocalRequisites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Записывает массив реквизитов в localStorage.
 * @param {Array<Record<string, unknown>>} list
 */
function setLocalRequisites(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/**
 * Объединяет моки и localStorage: при дубликате id приоритет у записи из localStorage.
 * Добавляет каждому реквизиту bank и statistics для отображения в таблице.
 * @param {string} [traderId] — trader_id текущего пользователя (для дефолтной statistics у новых записей)
 * @returns {Array<Record<string, unknown>>}
 */
export function getRequisitesList(traderId = '') {
  const localList = getLocalRequisites()
  const localById = Object.fromEntries(localList.map((r) => [r.id, r]))
  const mockIds = new Set(mockRequisites.map((r) => r.id))

  const merged = mockRequisites.map((r) => {
    const raw = localById[r.id] ?? r
    const bank = raw.bank_id ? banksById[raw.bank_id] : null
    const statistics = raw.statistics ?? defaultStatistics(raw.trader_id || traderId, raw.id)
    return { ...raw, bank, statistics }
  })

  const onlyLocal = localList.filter((r) => !mockIds.has(r.id))
  for (const raw of onlyLocal) {
    const bank = raw.bank_id ? banksById[raw.bank_id] : null
    const statistics = raw.statistics ?? defaultStatistics(raw.trader_id || traderId, raw.id)
    merged.push({ ...raw, bank, statistics })
  }

  return merged
}

/**
 * Сохраняет новый реквизит в localStorage и возвращает объединённый список для отображения.
 * @param {Record<string, unknown>} requisite — объект без bank/statistics (они подставятся при чтении)
 * @param {string} traderId
 * @returns {Array<Record<string, unknown>>}
 */
export function saveRequisite(requisite, traderId) {
  const localList = getLocalRequisites()
  const now = new Date().toISOString().slice(0, 19).replace('T', 'T')
  const withTimestamps = {
    ...requisite,
    created_at: requisite.created_at ?? now,
    updated_at: now,
  }
  localList.push(withTimestamps)
  setLocalRequisites(localList)
  return getRequisitesList(traderId)
}

/**
 * Обновляет реквизит в localStorage (по id). Если id есть в моках — перезаписываем в локальном списке; если только в локальном — обновляем там.
 * @param {Record<string, unknown>} requisite
 * @param {string} traderId
 * @returns {Array<Record<string, unknown>>}
 */
export function updateRequisite(requisite, traderId) {
  const localList = getLocalRequisites()
  const id = requisite.id
  const now = new Date().toISOString().slice(0, 19).replace('T', 'T')
  const updated = { ...requisite, updated_at: now }

  const mockIds = new Set(mockRequisites.map((r) => r.id))
  const index = localList.findIndex((r) => r.id === id)

  if (index >= 0) {
    localList[index] = updated
  } else {
    localList.push(updated)
  }
  setLocalRequisites(localList)
  return getRequisitesList(traderId)
}
