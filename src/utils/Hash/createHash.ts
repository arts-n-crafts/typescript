import crypto from 'node:crypto'

export function createHash(value: unknown): string {
  let stringValue: string

  if (value === null || value === undefined) {
    stringValue = String(value)
  }
  else if (typeof value === 'object' && value instanceof RegExp) {
    stringValue = value.toString()
  }
  else if (typeof value === 'symbol') {
    stringValue = value.toString()
  }
  else if (typeof value === 'object' && value instanceof Date) {
    stringValue = value.toISOString()
  }
  else if (typeof value === 'object') {
    stringValue = JSON.stringify(value)
  }
  else {
    stringValue = String(value)
  }

  return crypto.createHash('sha256').update(stringValue).digest('hex')
}
