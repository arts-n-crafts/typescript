import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent.ts'
import { createIntegrationEvent } from '@infrastructure/EventBus/utils/createIntegrationEvent.ts'

export interface UserCreationRejectedDueToInvalidEmailPayload {
  userEmail: string
}

export function UserCreationRejectedDueToInvalidEmail(props: UserCreationRejectedDueToInvalidEmailPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<UserCreationRejectedDueToInvalidEmailPayload> {
  return createIntegrationEvent('UserCreationRejectedDueToInvalidEmail', props, metadata)
}

export type UserCreationRejectedDueToInvalidEmailEvent = ReturnType<typeof UserCreationRejectedDueToInvalidEmail>
