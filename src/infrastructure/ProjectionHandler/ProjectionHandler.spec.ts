import type { UUID } from 'node:crypto'
import type { Database } from '../Database/Database'
import type { IProjectionHandler } from './IProjectionHandler'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '../../domain/DomainEvent/examples/UserCreated'
import { UserNameUpdated } from '../../domain/DomainEvent/examples/UserNameUpdated'
import { UserByUsernameSpecification } from '../../domain/Specification/examples/UserByUsernameSpecification'
import { InMemoryDatabase } from '../Database/implementations/InMemoryDatabase'
import { EventBus } from '../EventBus/EventBus'
import { UserProjectionHandler } from './examples/UserProjection'

describe('projectionHandler', () => {
  const id: UUID = randomUUID()
  const payload = { name: 'Elon', email: 'musk@x.com' }
  const database: Database = new InMemoryDatabase()
  let eventBus: EventBus
  let handler: IProjectionHandler

  beforeEach(async () => {
    eventBus = new EventBus()
    handler = new UserProjectionHandler(eventBus, database)
    handler.start()
  })

  it('should be defined', () => {
    expect(UserProjectionHandler).toBeDefined()
  })

  it('should update projection with create event', async () => {
    const event = UserCreated(id, 1, payload)
    await eventBus.publish(event)
    const spec = new UserByUsernameSpecification(payload.name)

    const results = await database.query('users', spec)
    expect(results.at(0)).toStrictEqual({ id, ...payload, prospect: true })
  })

  it('should update projection with update event', async () => {
    const updatePayload = { name: 'Donald' }
    const event = UserNameUpdated(id, 2, updatePayload)
    await eventBus.publish(event)
    const spec = new UserByUsernameSpecification(updatePayload.name)

    const results = await database.query('users', spec)
    expect(results.at(0)).toStrictEqual({ id, ...payload, ...updatePayload, prospect: true })
  })
})
