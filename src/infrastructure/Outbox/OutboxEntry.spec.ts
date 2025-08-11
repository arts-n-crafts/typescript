import { randomUUID } from 'node:crypto'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createOutboxEntry } from './utils/createOutboxEntry.ts'

describe('outbox entry', () => {
  it('should be defined', () => {
    expect(createOutboxEntry).toBeDefined()
  })

  it('should create a new outbox entry', () => {
    const event = createUserCreatedEvent(randomUUID(), { name: 'John Doe', email: 'john.doe@example.com', age: 30 })
    const outboxEntry = createOutboxEntry(event)

    expect(outboxEntry.id).toBeDefined()
    expect(outboxEntry.published).toBe(false)
    expect(outboxEntry.event).toBe(event)
    expect(outboxEntry.retryCount).toBe(0)
    expect(outboxEntry.lastAttemptAt).toBeUndefined()
  })
})
