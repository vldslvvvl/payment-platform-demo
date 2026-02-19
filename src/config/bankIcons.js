/**
 * Конфиг иконок банков.
 * По bank.code (или его буквенной части) подбирается иконка из src/assets/icons/banks/mini.
 *
 * BANK_CODE_TO_ICON — маппинг буквенной части кода банка на имя файла иконки (без .svg).
 * Если кода нет в маппинге, используется сама буквенная часть как имя файла (например, sber900 → sber).
 * Исключения (когда код не совпадает с именем файла) задаются явно, например: tinkoff → tbank.
 */
const BANK_CODE_TO_ICON = {
  tinkoff: 'tbank',
  // Остальные банки: имя файла иконки = буквенная часть кода (sber, vtb, alfabank и т.д.)
  // При необходимости добавьте сюда исключения.
}

const iconModules = import.meta.glob(
  '../assets/icons/banks/mini/*.svg',
  { eager: true, query: '?url', import: 'default' }
)

const iconByKey = {}
for (const path of Object.keys(iconModules)) {
  const key = path.replace(/^.*\/mini\/(.*)\.svg$/, '$1')
  iconByKey[key] = iconModules[path]
}

/**
 * Извлекает буквенную часть из кода банка (например, sber900 → sber).
 * @param {string} code
 * @returns {string}
 */
function getCodePrefix(code) {
  if (!code || typeof code !== 'string') return ''
  const match = code.match(/^([a-z]+)/i)
  return match ? match[1].toLowerCase() : ''
}

/**
 * Возвращает URL иконки банка по объекту банка { code, name } или по коду.
 * @param {{ code?: string, name?: string } | string} bank — объект банка или строка code
 * @returns {string | null} URL иконки или null, если иконки нет
 */
export function getBankIcon(bank) {
  const code = typeof bank === 'string' ? bank : bank?.code
  const prefix = getCodePrefix(code)
  if (!prefix) return null
  const iconKey = BANK_CODE_TO_ICON[prefix] ?? prefix
  return iconByKey[iconKey] ?? null
}

export { BANK_CODE_TO_ICON, iconByKey }
