import type { UUID } from 'node:crypto'
import type { Database } from '../Database/Database'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserCreatedEvent } from '../../domain/DomainEvent_v1/examples/UserCreated'
import { UserNameUpdatedEvent } from '../../domain/DomainEvent_v1/examples/UserNameUpdated'
import { UserByUsernameSpecification } from '../../domain/Specification/examples/UserByUsernameSpecification'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase'
import { EventBus } from '../EventBus/EventBus'
import { UserProjectionHandler } from './examples/UserProjection'
import { ProjectionHandler } from './ProjectionHandler'

describe('projectionHandler', () => {
  const id: UUID = randomUUID()
  const payload = { name: 'Elon', email: 'musk@x.com' }
  const database: Database = new InMemoryDatabase()
  let eventBus: EventBus
  let handler: ProjectionHandler

  beforeEach(async () => {
    eventBus = new EventBus()
    handler = new UserProjectionHandler(eventBus, database)
    handler.start()
  })

  it('should be defined', () => {
    expect(ProjectionHandler).toBeDefined()
  })

  it('should update projection with create event', async () => {
    const event = new UserCreatedEvent(id, payload)
    await eventBus.publish(event)
    const spec = new UserByUsernameSpecification(payload.name)

    const results = await database.query('users', spec)
    expect(results.at(0)).toStrictEqual({ id, ...payload })
  })

  it('should update projection with update event', async () => {
    const updatePayload = { name: 'Donald' }
    const event = new UserNameUpdatedEvent(id, updatePayload)
    await eventBus.publish(event)
    const spec = new UserByUsernameSpecification(updatePayload.name)

    const results = await database.query('users', spec)
    expect(results.at(0)).toStrictEqual({ id, ...payload, ...updatePayload })
  })
})
