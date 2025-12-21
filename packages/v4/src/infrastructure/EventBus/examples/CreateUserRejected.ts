import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent.ts'
import { createIntegrationEvent } from '@infrastructure/EventBus/utils/createIntegrationEvent.ts'

export interface CreateUserRejectedPayload {
  userEmail: string
}

export function createUserRejected(props: CreateUserRejectedPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<CreateUserRejectedPayload> {
  return createIntegrationEvent('CreateUserRejected', props, metadata)
}

export type CreateUserRejected = ReturnType<typeof createUserRejected>
