/**
 * 将整数“分”安全格式化为保留两位小数的“元”字符串（如 2500 -> "25.00"）。
 */
export function formatCentsToYuan(cents) {
  if (cents === null || cents === undefined || cents === '' || typeof cents === 'boolean') {
    return '0.00'
  }

  let value
  if (typeof cents === 'bigint') {
    value = cents
  } else if (typeof cents === 'number') {
    if (!Number.isFinite(cents)) return '0.00'
    value = BigInt(Math.round(cents))
  } else if (typeof cents === 'string') {
    const trimmed = cents.trim()
    if (!trimmed) return '0.00'
    if (/^[+-]?\d+$/.test(trimmed)) {
      value = BigInt(trimmed)
    } else if (/^[+-]?\d+(?:\.\d+)?$/.test(trimmed)) {
      const parsed = Number(trimmed)
      if (!Number.isFinite(parsed)) return '0.00'
      value = BigInt(Math.round(parsed))
    } else {
      return '0.00'
    }
  } else {
    return '0.00'
  }

  const sign = value < 0n ? '-' : ''
  const abs = value < 0n ? -value : value
  const yuanInt = abs / 100n
  const centPart = (abs % 100n).toString().padStart(2, '0')
  return `${sign}${yuanInt.toString()}.${centPart}`
}

/**
 * 将表单输入的“元”安全转换为整数“分”，通过字符串拆分避免浮点数精度误差（如 19.99 -> 1999）。
 * 非法输入返回 NaN，便于表单校验规则识别。
 */
export function yuanToCents(yuan) {
  if (yuan === null || yuan === undefined || typeof yuan === 'boolean') {
    return NaN
  }

  let text
  if (typeof yuan === 'number') {
    if (!Number.isFinite(yuan)) return NaN
    const raw = String(yuan)
    text = /[eE]/.test(raw) ? yuan.toFixed(4) : raw
  } else if (typeof yuan === 'string') {
    text = yuan.trim()
  } else {
    return NaN
  }

  if (!text) return NaN

  const match = text.match(/^([+-])?(\d+)(?:\.(\d*))?$/)
  if (!match) return NaN

  const sign = match[1] === '-' ? -1 : 1
  const intPart = match[2]
  const decPart = match[3] || ''
  const decTwo = decPart.slice(0, 2).padEnd(2, '0')
  const roundUp = decPart.length > 2 && Number(decPart[2]) >= 5 ? 1 : 0

  const totalCents = Number(intPart) * 100 + Number(decTwo) + roundUp
  if (!Number.isFinite(totalCents)) return NaN
  return totalCents === 0 ? 0 : sign * totalCents
}

function pad2(num) {
  return String(num).padStart(2, '0')
}

/**
 * 将 ISO 8601 UTC 时间字符串格式化为本地时区可读文本（默认 YYYY-MM-DD HH:mm）。
 */
export function formatUtcToLocal(isoString, options = {}) {
  const { showSeconds = false, fallback = '--' } =
    typeof options === 'boolean' ? { showSeconds: options } : options || {}

  if (!isoString) return fallback

  let date
  if (isoString instanceof Date) {
    date = isoString
  } else if (typeof isoString === 'string') {
    const trimmed = isoString.trim()
    if (!trimmed) return fallback

    const bareIsoPattern = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?$/
    const normalized = bareIsoPattern.test(trimmed)
      ? `${trimmed.replace(' ', 'T')}Z`
      : trimmed
    date = new Date(normalized)
  } else {
    return fallback
  }

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  const hours = pad2(date.getHours())
  const minutes = pad2(date.getMinutes())

  if (showSeconds) {
    const seconds = pad2(date.getSeconds())
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return `${year}-${month}-${day} ${hours}:${minutes}`
}
