import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'

export interface OutboxEntry {
  id: string
  event: IntegrationEvent
  published: boolean
  retryCount: number
  lastAttemptAt?: number
}
