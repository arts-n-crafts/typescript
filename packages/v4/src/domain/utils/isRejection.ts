import type { Rejection } from '@domain/Rejection.ts'
import { isEvent } from './isEvent.ts'

export function isRejection(event: unknown): event is Rejection {
  return isEvent(event)
    && 'commandId' in event
    && 'reasonCode' in event
    && event.kind === 'rejection'
}
