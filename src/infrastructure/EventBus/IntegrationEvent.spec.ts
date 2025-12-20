import type { UserCreationRejectedDueToInvalidEmailPayload } from '@infrastructure/EventBus/examples/UserCreationRejectedDueToInvalidEmail.ts'
import type { IntegrationEventMetadata } from './IntegrationEvent.ts'
import { randomUUID } from 'node:crypto'
import {
  UserCreationRejectedDueToInvalidEmail,

} from '@infrastructure/EventBus/examples/UserCreationRejectedDueToInvalidEmail.ts'
import { createIntegrationEvent } from './utils/createIntegrationEvent.ts'
import { isIntegrationEvent } from './utils/isIntegrationEvent.ts'

describe('integrationEvent', () => {
  let metadata: IntegrationEventMetadata

  beforeEach(() => {
    metadata = {
      aggregateId: randomUUID(),
      aggregateType: 'User',
      commandId: randomUUID(),
      commandType: 'CreateUser',
      outcome: 'rejected',
    }
  })

  it('should be defined', () => {
    expect(createIntegrationEvent).toBeDefined()
  })

  it('should consider the event as IntegrationEvent', () => {
    const payload: UserCreationRejectedDueToInvalidEmailPayload = {
      userEmail: 'not-an-email',
    }
    const event = UserCreationRejectedDueToInvalidEmail(payload, metadata)
    expect(isIntegrationEvent(event)).toBeTruthy()
  })

  it('should create the UserCreationRejectedDueToInvalidEmail event', () => {
    const payload: UserCreationRejectedDueToInvalidEmailPayload = {
      userEmail: 'not-an-email',
    }
    const event = UserCreationRejectedDueToInvalidEmail(payload, metadata)
    expect(event.id).toBeDefined()
    expect(event.type).toBe('UserCreationRejectedDueToInvalidEmail')
    expect(event.payload).toBe(payload)
    expect(event).toHaveProperty('timestamp')
    expect(event.kind).toBe('integration')
    expect(event.metadata.outcome).toBe('rejected')
  })
})
