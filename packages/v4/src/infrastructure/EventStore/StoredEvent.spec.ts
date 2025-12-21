import { randomUUID } from 'node:crypto'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createStoredEvent } from './utils/createStoredEvent.ts'

describe('storedEvent', () => {
  it('should be defined', () => {
    expect(createStoredEvent).toBeDefined()
  })

  it('should create a new StoredEvent', () => {
    const event = createUserCreatedEvent(randomUUID(), { name: 'John Doe', email: 'john.doe@example.com', age: 30 })
    const storedEvent = createStoredEvent('users', 1, event)

    expect(storedEvent.id).toBeDefined()
    expect(storedEvent.version).toBe(1)
    expect(storedEvent.event).toBe(event)
    expect(storedEvent.createdAt).toBeDefined()
  })
})
