import type { UUID } from 'node:crypto'
import type { Database } from '../Database/Database'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockUserCreatedEvent } from '../../domain/DomainEvent/mocks/MockUserCreated'
import { MockUserNameUpdatedEvent } from '../../domain/DomainEvent/mocks/MockUserNameUpdated'
import { MockUserByUsernameSpecification } from '../../domain/Specification/mocks/MockUserByUsernameSpecification'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase'
import { EventBus } from '../EventBus/EventBus'
import { MockUserProjectionHandler } from './mocks/MockUserProjection'
import { ProjectionHandler } from './ProjectionHandler'

describe('projectionHandler', () => {
  const id: UUID = randomUUID()
  const payload = { name: 'Elon', email: 'musk@x.com' }
  const database: Database = new InMemoryDatabase()
  let eventBus: EventBus
  let handler: ProjectionHandler

  beforeEach(async () => {
    eventBus = new EventBus()
    handler = new MockUserProjectionHandler(eventBus, database)
    handler.start()
  })

  it('should be defined', () => {
    expect(ProjectionHandler).toBeDefined()
  })

  it('should update projection with create event', async () => {
    const event = new MockUserCreatedEvent(id, payload)
    await eventBus.publish(event)
    const spec = new MockUserByUsernameSpecification(payload.name)

    const results = await database.query('users', spec)
    expect(results.at(0)).toStrictEqual({ id, ...payload })
  })

  it('should update projection with update event', async () => {
    const updatePayload = { name: 'Donald' }
    const event = new MockUserNameUpdatedEvent(id, updatePayload)
    await eventBus.publish(event)
    const spec = new MockUserByUsernameSpecification(updatePayload.name)

    const results = await database.query('users', spec)
    expect(results.at(0)).toStrictEqual({ id, ...payload, ...updatePayload })
  })
})
