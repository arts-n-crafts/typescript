import { randomUUID } from 'node:crypto'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { OfflineOutbox } from './OfflineOutbox.ts'

describe('offlineOutbox', () => {
  const outbox = new OfflineOutbox()
  const event = UserCreated(randomUUID(), { name: 'elon', email: 'musk@x.com' })

  it('throws on enqueue', async () => {
    await expect(outbox.enqueue(event)).rejects.toThrow('Could not enqueue, outbox offline!')
  })

  it('throws on getPending', async () => {
    await expect(outbox.getPending()).rejects.toThrow('Could not getPending, outbox offline!')
  })

  it('throws on markAsPublished', async () => {
    await expect(outbox.markAsPublished(event.aggregateId)).rejects.toThrow('Could not markAsPublished, outbox offline!')
  })

  it('throws on markAsFailed', async () => {
    await expect(outbox.markAsFailed(event.aggregateId)).rejects.toThrow('Could not markAsFailed, outbox offline!')
  })
})
