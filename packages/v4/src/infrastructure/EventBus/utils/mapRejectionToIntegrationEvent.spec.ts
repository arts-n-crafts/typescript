import type { CreateUserProps } from '@core/examples/CreateUser.ts'
import type { RejectionMetadata } from '@domain/Rejection.ts'
import { randomUUID } from 'node:crypto'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { createUserAlreadyExistsRejection } from '@core/examples/UserAlreadyExists.ts'
import { mapRejectionToIntegrationEvent } from '@infrastructure/EventBus/utils/mapRejectionToIntegrationEvent.ts'

describe('rejection to integration event', () => {
  let metadata: RejectionMetadata

  beforeEach(() => {
    metadata = { aggregateId: randomUUID(), aggregateType: 'User' }
  })

  it('should be defined', () => {
    expect(mapRejectionToIntegrationEvent).toBeDefined()
  })

  it('should convert the UserCreated event', () => {
    const payload: CreateUserProps = {
      name: 'Elon',
      email: 'musk@x.com',
    }
    const createCommand = createRegisterUserCommand(randomUUID(), payload, metadata)
    const rejection = createUserAlreadyExistsRejection(createCommand, metadata)
    const integrationEvent = mapRejectionToIntegrationEvent(rejection)

    expect(integrationEvent.id).toBe(rejection.id)
    expect(integrationEvent.type).toBe(rejection.type)
    expect(integrationEvent.payload).toStrictEqual({
      classification: 'business',
      details: {
        email: 'musk@x.com',
        name: 'Elon',
      },
      reason: undefined,
      reasonCode: 'ALREADY_EXISTS',
      retryable: undefined,
      validationErrors: undefined,
    })
    expect(integrationEvent.metadata.aggregateId).toBe(metadata.aggregateId)
    expect(integrationEvent.metadata.aggregateType).toBe(rejection.metadata?.aggregateType)
    expect(integrationEvent.metadata.commandId).toBe(rejection.commandId)
    expect(integrationEvent.metadata.commandType).toBe(rejection.commandType)
    expect(integrationEvent.metadata.outcome).toBe('rejected')
  })
})
