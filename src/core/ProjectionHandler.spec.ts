import type { UUID } from 'node:crypto'
import type { UserEvent } from '../domain/examples/User'
import type { Database, EventBus } from '../infrastructure'
import type { ProjectionHandler } from './ProjectionHandler'
import { randomUUID } from 'node:crypto'
import { UserCreated } from '../domain/examples/UserCreated'
import { UserNameUpdated } from '../domain/examples/UserNameUpdated'
import { InMemoryDatabase, InMemoryEventBus } from '../infrastructure'
import { UserProjectionHandler } from './examples/UserProjection'

describe('projectionHandler', () => {
  const id: UUID = randomUUID()
  const payload = { name: 'Elon', email: 'musk@x.com' }
  const database: Database = new InMemoryDatabase()
  let eventBus: EventBus<UserEvent>
  let handler: ProjectionHandler<UserEvent>

  beforeEach(async () => {
    eventBus = new InMemoryEventBus()
    handler = new UserProjectionHandler(eventBus, database)
    handler.start()
  })

  it('should be defined', () => {
    expect(UserProjectionHandler).toBeDefined()
  })

  it('should update projection with create event', async () => {
    const event = UserCreated(id, payload)
    await eventBus.publish(event)
    const results = await database.query('users', [{ name: payload.name }])
    expect(results.at(0)).toStrictEqual({ id, ...payload, prospect: true })
  })

  it('should update projection with update event', async () => {
    const updatePayload = { name: 'Donald' }
    const event = UserNameUpdated(id, updatePayload)
    await eventBus.publish(event)
    const results = await database.query('users', [{ name: updatePayload.name }])
    expect(results.at(0)).toStrictEqual({ id, ...payload, ...updatePayload, prospect: true })
  })
})
