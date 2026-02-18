import type { Rejection } from '@domain/Rejection.ts'

export function isRejection(candidate: unknown): candidate is Rejection {
  if (candidate === null || typeof candidate !== 'object')
    return false
  return (
    'commandId' in candidate
    && 'commandType' in candidate
    && 'reasonCode' in candidate
    && 'timestamp' in candidate
  )
}
