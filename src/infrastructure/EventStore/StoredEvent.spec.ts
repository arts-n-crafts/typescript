import { randomUUID } from 'node:crypto'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { makeStreamKey } from '@utils/index.ts'
import { createStoredEvent } from './utils/createStoredEvent.ts'

describe('storedEvent', () => {
  it('should be defined', () => {
    expect(createStoredEvent).toBeDefined()
  })

  it('should create a new StoredEvent', () => {
    const event = createUserCreatedEvent(randomUUID(), { name: 'John Doe', email: 'john.doe@example.com', age: 30 })
    const streamKey = makeStreamKey('users', event.aggregateId)
    const storedEvent = createStoredEvent(streamKey, 1, event)

    expect(storedEvent.id).toBeDefined()
    expect(storedEvent.version).toBe(1)
    expect(storedEvent.event).toBe(event)
    expect(storedEvent.createdAt).toBeDefined()
  })
})
