import type { UserModel } from '@core/examples/UserProjection.ts'
import type { ProjectionHandler } from '@core/ProjectionHandler.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.ts'
import type { UUID } from 'node:crypto'
import { randomUUID } from 'node:crypto'
import { UserProjectionHandler } from '@core/examples/UserProjection.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { FieldEquals } from '@domain/Specification/implementations/FieldEquals.specification.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { InMemoryEventBus } from '@infrastructure/EventBus/implementations/InMemoryEventBus.ts'

describe('projectionHandler', () => {
  const id: UUID = randomUUID()
  const payload = { name: 'Elon', email: 'musk@x.com' }
  const database: Database = new InMemoryDatabase()
  let specification: FieldEquals<UserModel> = new FieldEquals<UserModel>('name', payload.name)
  let eventBus: EventBus
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
    const results = await database.query<UserModel>('users', specification)
    expect(results.at(0)).toStrictEqual({ id, ...payload, prospect: true })
  })

  it('should update projection with update event', async () => {
    const updatePayload = { name: 'Donald' }
    specification = new FieldEquals<UserModel>('name', updatePayload.name)
    const event = UserNameUpdated(id, updatePayload)
    await eventBus.publish(event)
    const results = await database.query<UserModel>('users', specification)
    expect(results.at(0)).toStrictEqual({ id, ...payload, ...updatePayload, prospect: true })
  })
})
